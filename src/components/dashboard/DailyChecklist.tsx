import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Card from '../ui/Card';
import {
  useWizardVaultDaily,
  useWizardVaultWeekly,
} from '../../hooks/useGW2';
import {colors, fontSize, spacing, radius} from '../../constants/theme';
import {getNextDailyReset} from '../../utils/timers';
import {WizardVaultData, WizardVaultObjective} from '../../api/account';

type Tab = 'daily' | 'weekly';


export default function DailyChecklist() {
  const [tab, setTab] = useState<Tab>('daily');
  const {data: vaultDaily, isLoading: vaultDailyLoading} = useWizardVaultDaily();
  const {data: vaultWeekly, isLoading: vaultWeeklyLoading} = useWizardVaultWeekly();
  const {hoursUntil, minutesUntil} = getNextDailyReset();
  const resetLabel = hoursUntil === 0 ? `${minutesUntil}m` : `${hoursUntil}h`;

  const vaultDailyDone =
    vaultDaily?.objectives.filter(o => o.progress_current >= o.progress_complete).length ?? 0;
  const vaultWeeklyDone =
    vaultWeekly?.objectives.filter(o => o.progress_current >= o.progress_complete).length ?? 0;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>📋 Checklist</Text>
        <Text style={styles.reset}>Reset in {resetLabel}</Text>
      </View>

      <View style={styles.tabs}>
        {(['daily', 'weekly'] as Tab[]).map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tabBtn, tab === t && styles.tabBtnActive]}
            onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'daily' ? 'Daily' : 'Weekly'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'daily' && (
        <View style={styles.tabContent}>
          <VaultSection
            data={vaultDaily}
            isLoading={vaultDailyLoading}
            vaultDone={vaultDailyDone}
          />
        </View>
      )}

      {tab === 'weekly' && (
        <View style={styles.tabContent}>
          <VaultSection
            data={vaultWeekly}
            isLoading={vaultWeeklyLoading}
            vaultDone={vaultWeeklyDone}
          />
        </View>
      )}
    </Card>
  );
}


function VaultSection({data, isLoading, vaultDone}: {
  data: WizardVaultData | undefined;
  isLoading: boolean;
  vaultDone: number;
}) {
  const total = data?.objectives?.length ?? 0;
  return (
    <View style={styles.vaultBlock}>
      <View style={styles.vaultHeader}>
        <Text style={styles.vaultTitle}>✦ Wizard's Vault</Text>
        {data && (
          <Text style={styles.vaultMeta}>
            {vaultDone}/{total} • {data.meta_progress_current}/{data.meta_progress_complete} ✦
          </Text>
        )}
      </View>
      {isLoading ? (
        <ActivityIndicator color={colors.gold} size="small" style={styles.loader} />
      ) : data ? (
        <>
          <ProgressBar value={data.meta_progress_current} max={data.meta_progress_complete} />
          {data.objectives.map(obj => <VaultObjective key={obj.id} objective={obj} />)}
        </>
      ) : (
        <Text style={styles.noData}>No Wizard's Vault data</Text>
      )}
    </View>
  );
}

function ProgressBar({value, max}: {value: number; max: number}) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <View style={styles.progressBar}>
      <View style={[styles.progressFill, {width: `${pct}%`}]} />
    </View>
  );
}

function VaultObjective({objective}: {objective: WizardVaultObjective}) {
  const done = objective.progress_current >= objective.progress_complete;
  const pct = objective.progress_complete > 0
    ? (objective.progress_current / objective.progress_complete) * 100
    : 0;
  return (
    <View style={[styles.vaultObj, done && styles.vaultObjDone]}>
      <View style={styles.vaultObjLeft}>
        <View style={[styles.checkbox, done && styles.checkboxDone]}>
          {done && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <View style={styles.vaultObjInfo}>
          <Text style={[styles.vaultObjTitle, done && styles.textDone]} numberOfLines={2}>
            {objective.title}
          </Text>
          <View style={styles.vaultMiniBar}>
            <View style={[styles.vaultMiniFill, {width: `${pct}%`}]} />
          </View>
          <Text style={styles.vaultObjProgress}>
            {objective.progress_current}/{objective.progress_complete}
          </Text>
        </View>
      </View>
      <Text style={styles.acclaim}>+{objective.acclaim}✦</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {marginBottom: spacing.md},
  header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm},
  title: {color: colors.gold, fontSize: fontSize.md, fontWeight: '700'},
  reset: {color: colors.textMuted, fontSize: fontSize.xs},
  tabs: {flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.sm},
  tabBtn: {flex: 1, paddingVertical: spacing.xs, alignItems: 'center', borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border},
  tabBtnActive: {backgroundColor: colors.gold + '22', borderColor: colors.gold},
  tabText: {color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '600'},
  tabTextActive: {color: colors.gold},
  tabContent: {gap: spacing.md},
  noKey: {color: colors.textMuted, fontSize: fontSize.xs, textAlign: 'center', paddingVertical: spacing.sm},
  loader: {paddingVertical: spacing.sm},
  errorText: {color: colors.red, fontSize: fontSize.xs},
  emptyText: {color: colors.textMuted, fontSize: fontSize.xs},

  // Achievement sections
  achievBlock: {gap: spacing.xs},
  achievHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs},
  achievTitle: {color: colors.gold, fontSize: fontSize.sm, fontWeight: '700'},
  achievCount: {color: colors.textMuted, fontSize: fontSize.xs},
  catBlock: {gap: 4, marginBottom: spacing.xs},
  catHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2},
  catLabel: {color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5},
  catCount: {color: colors.textMuted, fontSize: fontSize.xs},
  achievRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 2},
  achievCheck: {width: 16, height: 16, borderRadius: radius.sm, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0},
  achievCheckDone: {backgroundColor: colors.gold, borderColor: colors.gold},
  achievName: {color: colors.text, fontSize: fontSize.xs, flex: 1},
  achievNameDone: {color: colors.textMuted, textDecorationLine: 'line-through'},
  checkmark: {color: '#000', fontSize: 10, fontWeight: '800'},

  // Vault
  vaultBlock: {borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm, gap: spacing.xs},
  vaultHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs},
  vaultTitle: {color: colors.gold, fontSize: fontSize.sm, fontWeight: '700'},
  vaultMeta: {color: colors.gold, fontSize: fontSize.xs, fontWeight: '600'},
  noData: {color: colors.textMuted, fontSize: fontSize.xs, textAlign: 'center', paddingVertical: spacing.xs},
  progressBar: {height: 4, backgroundColor: colors.border, borderRadius: 2, marginBottom: spacing.sm, overflow: 'hidden'},
  progressFill: {height: '100%', backgroundColor: colors.gold, borderRadius: 2},
  vaultObj: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.xs, borderBottomWidth: 1, borderBottomColor: colors.border},
  vaultObjDone: {opacity: 0.55},
  vaultObjLeft: {flexDirection: 'row', alignItems: 'center', flex: 1, gap: spacing.sm},
  vaultObjInfo: {flex: 1, gap: 2},
  vaultObjTitle: {color: colors.text, fontSize: fontSize.xs, fontWeight: '600'},
  vaultMiniBar: {height: 3, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden'},
  vaultMiniFill: {height: '100%', backgroundColor: colors.gold},
  vaultObjProgress: {color: colors.textMuted, fontSize: 10},
  acclaim: {color: colors.gold, fontSize: fontSize.xs, fontWeight: '700', marginLeft: spacing.sm, flexShrink: 0},
  checkbox: {width: 20, height: 20, borderRadius: radius.sm, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center'},
  checkboxDone: {backgroundColor: colors.gold, borderColor: colors.gold},
  textDone: {color: colors.textMuted, textDecorationLine: 'line-through'},
});
