import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Card from '../ui/Card';
import {
  useWizardVaultDaily,
  useWizardVaultWeekly,
  useDailyAchievements,
  useAccountAchievements,
  useAchievementDefs,
} from '../../hooks/useGW2';
import {useAppStore} from '../../store/appStore';
import {colors, fontSize, spacing, radius} from '../../constants/theme';
import {getNextDailyReset} from '../../utils/timers';
import {WizardVaultData, WizardVaultObjective} from '../../api/account';

const DAILY_TASKS = [
  {id: 'login_reward', label: '🎁 Login Reward'},
  {id: 'daily_achievements', label: '📜 Daily Achievements'},
  {id: 'fractal_daily', label: '🌀 Fractal Daily (T4)'},
  {id: 'strike_daily', label: '⚔️ Strike Mission'},
  {id: 'wvw_daily', label: '🏰 WvW Daily'},
  {id: 'pvp_daily', label: '🗡 PvP Daily'},
  {id: 'home_gather', label: '🌿 Home Instance Gathering'},
  {id: 'fishing_daily', label: '🎣 Fishing Daily'},
  {id: 'rift_hunting', label: '🌌 Rift Hunting'},
];

const WEEKLY_TASKS = [
  {id: 'raid_wing', label: '👑 Raid Wing'},
  {id: 'fractal_cm', label: '🌀 Fractal CMs'},
  {id: 'strike_weekly', label: '⚔️ Weekly Strikes (IBS/EoD/SotO)'},
  {id: 'convergence', label: '🌌 Convergence'},
  {id: 'dragonstail', label: '🐉 Dragon\'s End / Harvest Temple'},
  {id: 'wvw_weekly', label: '🏰 WvW Reward Track'},
  {id: 'pvp_weekly', label: '🗡 PvP Weekly'},
  {id: 'guild_missions', label: '🎪 Guild Missions'},
  {id: 'map_bonus', label: '🗺 Map Bonus Reward'},
  {id: 'weekly_achievements', label: '📅 Weekly Achievements'},
];

function getTodayKey(): string {
  const now = new Date();
  return `daily_v2_${now.getUTCFullYear()}_${now.getUTCMonth()}_${now.getUTCDate()}`;
}

function getWeekKey(): string {
  // GW2 weekly reset is Monday 07:30 UTC.
  // Shift time back by 7.5 hours so the week boundary aligns with reset.
  const RESET_OFFSET_MS = 7.5 * 60 * 60 * 1000;
  const shifted = Date.now() - RESET_OFFSET_MS;
  // Find the most recent Monday (day 1) by flooring to weeks since a known Monday epoch.
  // Unix epoch (Jan 1 1970) was a Thursday (day 4). Offset to Monday = -3 days.
  const MONDAY_EPOCH_OFFSET = 3 * 24 * 60 * 60 * 1000;
  const week = Math.floor((shifted + MONDAY_EPOCH_OFFSET) / (7 * 24 * 60 * 60 * 1000));
  return `weekly_v2_${week}`;
}

type Tab = 'daily' | 'weekly';

export default function DailyChecklist() {
  const [tab, setTab] = useState<Tab>('daily');
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const {settings} = useAppStore();
  const {data: vaultDaily, isLoading: vaultDailyLoading} = useWizardVaultDaily();
  const {data: vaultWeekly, isLoading: vaultWeeklyLoading} = useWizardVaultWeekly();
  const {hoursUntil, minutesUntil} = getNextDailyReset();
  const resetLabel = hoursUntil === 0
    ? `${minutesUntil}m`
    : `${hoursUntil}h`;

  useEffect(() => {
    loadChecked();
  }, []);

  async function loadChecked() {
    try {
      const [daily, weekly] = await Promise.all([
        AsyncStorage.getItem(getTodayKey()),
        AsyncStorage.getItem(getWeekKey()),
      ]);
      setChecked({
        ...(daily ? JSON.parse(daily) : {}),
        ...(weekly ? JSON.parse(weekly) : {}),
      });
    } catch {}
  }

  async function toggle(id: string, isWeekly: boolean) {
    const next = {...checked, [id]: !checked[id]};
    setChecked(next);
    try {
      const key = isWeekly ? getWeekKey() : getTodayKey();
      const tasks = isWeekly ? WEEKLY_TASKS : DAILY_TASKS;
      const relevant = Object.fromEntries(
        Object.entries(next).filter(([k]) => tasks.find(t => t.id === k)),
      );
      await AsyncStorage.setItem(key, JSON.stringify(relevant));
    } catch {}
  }

  const dailyDone = DAILY_TASKS.filter(t => checked[t.id]).length;
  const weeklyDone = WEEKLY_TASKS.filter(t => checked[t.id]).length;

  const vaultDailyDone =
    vaultDaily?.objectives.filter(
      o => o.progress_current >= o.progress_complete,
    ).length ?? 0;
  const vaultWeeklyDone =
    vaultWeekly?.objectives.filter(
      o => o.progress_current >= o.progress_complete,
    ).length ?? 0;

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
              {t === 'daily'
                ? `Daily ${dailyDone}/${DAILY_TASKS.length}`
                : `Weekly ${weeklyDone}/${WEEKLY_TASKS.length}`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'daily' && (
        <View style={styles.tabContent}>
          <TaskList
            tasks={DAILY_TASKS}
            checked={checked}
            onToggle={id => toggle(id, false)}
          />
          {settings.apiKey && <DailyAchievementsSection />}
          {settings.apiKey && (
            <VaultSection
              data={vaultDaily}
              isLoading={vaultDailyLoading}
              vaultDone={vaultDailyDone}
            />
          )}
        </View>
      )}

      {tab === 'weekly' && (
        <View style={styles.tabContent}>
          <TaskList
            tasks={WEEKLY_TASKS}
            checked={checked}
            onToggle={id => toggle(id, true)}
          />
          {settings.apiKey && (
            <VaultSection
              data={vaultWeekly}
              isLoading={vaultWeeklyLoading}
              vaultDone={vaultWeeklyDone}
            />
          )}
        </View>
      )}
    </Card>
  );
}

function TaskList({
  tasks,
  checked,
  onToggle,
}: {
  tasks: {id: string; label: string}[];
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  const done = tasks.filter(t => checked[t.id]).length;
  return (
    <View style={styles.taskListBlock}>
      <ProgressBar value={done} max={tasks.length} />
      <View style={styles.tasks}>
        {tasks.map(task => (
          <TouchableOpacity
            key={task.id}
            style={styles.task}
            onPress={() => onToggle(task.id)}
            activeOpacity={0.7}>
            <View
              style={[styles.checkbox, checked[task.id] && styles.checkboxDone]}>
              {checked[task.id] && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text
              style={[styles.taskLabel, checked[task.id] && styles.taskDone]}>
              {task.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function DailyAchievementsSection() {
  const {data: dailyData, isLoading: dailyLoading, error: dailyError} =
    useDailyAchievements();
  const {data: accountAchievements, isLoading: accountLoading} =
    useAccountAchievements();

  const allIds = useMemo(() => {
    if (!dailyData) return [];
    const ids = new Set<number>();
    dailyData.pve.forEach(a => ids.add(a.id));
    dailyData.pvp.forEach(a => ids.add(a.id));
    dailyData.wvw.forEach(a => ids.add(a.id));
    return [...ids];
  }, [dailyData]);

  const {data: defs, isLoading: defsLoading} = useAchievementDefs(allIds);

  const defMap = useMemo(() => {
    const m = new Map<number, string>();
    defs?.forEach(d => m.set(d.id, d.name));
    return m;
  }, [defs]);

  const doneSet = useMemo(() => {
    const s = new Set<number>();
    accountAchievements?.forEach(a => {
      if (a.done) s.add(a.id);
    });
    return s;
  }, [accountAchievements]);

  // Silently hide if endpoint returned an error
  if (dailyError || !dailyData) return null;

  const isLoading = dailyLoading || accountLoading || defsLoading;

  if (isLoading) {
    return (
      <View style={styles.dailiesBlock}>
        <Text style={styles.dailiesTitle}>📜 Today's Dailies</Text>
        <ActivityIndicator color={colors.gold} size="small" style={styles.loader} />
      </View>
    );
  }

  const categories: {label: string; ids: number[]}[] = [
    {label: 'PvE', ids: dailyData.pve.map(a => a.id)},
    {label: 'PvP', ids: dailyData.pvp.map(a => a.id)},
    {label: 'WvW', ids: dailyData.wvw.map(a => a.id)},
  ];

  return (
    <View style={styles.dailiesBlock}>
      <Text style={styles.dailiesTitle}>📜 Today's Dailies</Text>
      {categories.map(cat => {
        if (cat.ids.length === 0) return null;
        const doneCount = cat.ids.filter(id => doneSet.has(id)).length;
        return (
          <View key={cat.label} style={styles.dailiesCat}>
            <View style={styles.dailiesCatHeader}>
              <Text style={styles.dailiesCatLabel}>{cat.label}</Text>
              <Text style={styles.dailiesCatCount}>
                {doneCount}/{cat.ids.length}
              </Text>
            </View>
            {cat.ids.map(id => {
              const done = doneSet.has(id);
              const name = defMap.get(id) ?? `Achievement #${id}`;
              return (
                <View key={id} style={styles.dailiesRow}>
                  <View
                    style={[
                      styles.dailiesCheck,
                      done && styles.dailiesCheckDone,
                    ]}>
                    {done && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text
                    style={[
                      styles.dailiesName,
                      done && styles.dailiesNameDone,
                    ]}
                    numberOfLines={1}>
                    {name}
                  </Text>
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

function VaultSection({
  data,
  isLoading,
  vaultDone,
}: {
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
            {vaultDone}/{total} • {data.meta_progress_current}/
            {data.meta_progress_complete} ✦
          </Text>
        )}
      </View>

      {isLoading ? (
        <ActivityIndicator color={colors.gold} size="small" style={styles.loader} />
      ) : data ? (
        <>
          <ProgressBar
            value={data.meta_progress_current}
            max={data.meta_progress_complete}
          />
          {data.objectives.map(obj => (
            <VaultObjective key={obj.id} objective={obj} />
          ))}
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
  const pct =
    objective.progress_complete > 0
      ? (objective.progress_current / objective.progress_complete) * 100
      : 0;

  return (
    <View style={[styles.vaultObj, done && styles.vaultObjDone]}>
      <View style={styles.vaultObjLeft}>
        <View style={[styles.checkbox, done && styles.checkboxDone]}>
          {done && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <View style={styles.vaultObjInfo}>
          <Text style={[styles.vaultObjTitle, done && styles.taskDone]} numberOfLines={2}>
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
  card: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.gold,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  reset: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabBtnActive: {
    backgroundColor: colors.gold + '22',
    borderColor: colors.gold,
  },
  tabText: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.gold,
  },
  tabContent: {
    gap: spacing.md,
  },
  taskListBlock: {
    gap: spacing.xs,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.gold,
    borderRadius: 2,
  },
  tasks: {
    gap: spacing.sm,
  },
  task: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  checkmark: {
    color: '#000',
    fontSize: 12,
    fontWeight: '800',
  },
  taskLabel: {
    color: colors.text,
    fontSize: fontSize.sm,
    flex: 1,
  },
  taskDone: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  vaultBlock: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    gap: spacing.xs,
  },
  vaultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  vaultTitle: {
    color: colors.gold,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  vaultMeta: {
    color: colors.gold,
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  loader: {
    paddingVertical: spacing.sm,
  },
  noData: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    textAlign: 'center',
    paddingVertical: spacing.xs,
  },
  vaultObj: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  vaultObjDone: {
    opacity: 0.55,
  },
  vaultObjLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
  },
  vaultObjInfo: {
    flex: 1,
    gap: 2,
  },
  vaultObjTitle: {
    color: colors.text,
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  vaultMiniBar: {
    height: 3,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  vaultMiniFill: {
    height: '100%',
    backgroundColor: colors.gold,
  },
  vaultObjProgress: {
    color: colors.textMuted,
    fontSize: 10,
  },
  acclaim: {
    color: colors.gold,
    fontSize: fontSize.xs,
    fontWeight: '700',
    marginLeft: spacing.sm,
    flexShrink: 0,
  },

  // Daily Achievements Section
  dailiesBlock: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    gap: spacing.xs,
  },
  dailiesTitle: {
    color: colors.gold,
    fontSize: fontSize.sm,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  dailiesCat: {
    gap: 4,
    marginBottom: spacing.xs,
  },
  dailiesCatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  dailiesCatLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dailiesCatCount: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  dailiesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 2,
  },
  dailiesCheck: {
    width: 16,
    height: 16,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dailiesCheckDone: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  dailiesName: {
    color: colors.text,
    fontSize: fontSize.xs,
    flex: 1,
  },
  dailiesNameDone: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
});
