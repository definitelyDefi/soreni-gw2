import React, {useMemo} from 'react';
import {View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity} from 'react-native';
import {useStrikeMissions, useWizardVaultWeekly} from '../hooks/useGW2';
import {useAppStore} from '../store/appStore';
import Card from '../components/ui/Card';
import {colors, fontSize, spacing, radius} from '../constants/theme';

// ─── Static Data ──────────────────────────────────────────────────────────────

const STRIKE_GROUPS = [
  {
    expansion: 'Icebrood Saga',
    emoji: '❄️',
    color: '#80c8e0',
    strikes: [
      {id: 'shiverpeaks_pass', name: 'Shiverpeaks Pass', cm: false},
      {id: 'voice_in_the_deep', name: 'Voice in the Deep', cm: false},
      {id: 'fraenir_of_janthir', name: 'Fraenir of Janthir', cm: false},
      {id: 'boneskinner', name: 'Boneskinner', cm: false},
      {id: 'whisper_of_jormag', name: 'Whisper of Jormag', cm: false},
      {id: 'cold_war', name: 'Cold War', cm: false},
      {id: 'forging_steel', name: 'Forging Steel', cm: false},
      {id: 'darkrime_delves', name: 'Darkrime Delves', cm: false},
    ],
  },
  {
    expansion: 'End of Dragons',
    emoji: '🐉',
    color: '#c870b0',
    strikes: [
      {id: 'aetherblade_hideout', name: 'Aetherblade Hideout', cm: true},
      {id: 'xunlai_jade_junkyard', name: 'Xunlai Jade Junkyard', cm: true},
      {id: 'kaineng_overlook', name: 'Kaineng Overlook', cm: true},
      {id: 'harvest_temple', name: 'Harvest Temple', cm: true},
      {id: 'old_lions_court', name: "Old Lion's Court", cm: true},
    ],
  },
  {
    expansion: 'Secrets of the Obscure',
    emoji: '🌌',
    color: '#9060c0',
    strikes: [
      {id: 'cosmic_observatory', name: 'Cosmic Observatory', cm: true},
      {id: 'temple_of_febe', name: 'Temple of Febe', cm: true},
    ],
  },
  {
    expansion: 'Janthir Wilds',
    emoji: '🐻',
    color: '#c8972b',
    strikes: [
      {id: 'muttering_mines', name: 'Muttering Mines', cm: false},
      {id: 'lakeside_munitions', name: 'Lakeside Munitions', cm: false},
    ],
  },
];

const TOTAL_STRIKES = STRIKE_GROUPS.reduce((sum, g) => sum + g.strikes.length, 0);

const WV_STRIKE_KEYWORDS = [
  'strike',
  'aetherblade',
  'xunlai',
  'kaineng',
  'harvest temple',
  'old lion',
  'cosmic',
  'temple of febe',
  'shiverpeaks',
  'whisper',
  'fraenir',
  'boneskinner',
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({value, max, color = colors.gold}: {value: number; max: number; color?: string}) {
  const pct = max > 0 ? Math.min(1, value / max) : 0;
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, {width: `${pct * 100}%` as any, backgroundColor: color}]} />
    </View>
  );
}

interface StrikeRowProps {
  name: string;
  cm: boolean;
  done: boolean;
}

function StrikeRow({name, cm, done}: StrikeRowProps) {
  return (
    <View style={[styles.strikeRow, done && styles.strikeRowDone]}>
      <View style={[styles.checkbox, done ? styles.checkboxDone : styles.checkboxUndone]}>
        {done && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={[styles.strikeName, done && styles.strikeNameDone]} numberOfLines={1}>
        {name}
      </Text>
      {cm && (
        <View style={styles.cmBadge}>
          <Text style={styles.cmText}>CM</Text>
        </View>
      )}
    </View>
  );
}

interface ExpansionCardProps {
  expansion: string;
  emoji: string;
  color: string;
  strikes: {id: string; name: string; cm: boolean}[];
  completedIds: Set<string>;
}

function ExpansionCard({expansion, emoji, color, strikes, completedIds}: ExpansionCardProps) {
  const done = strikes.filter(s => completedIds.has(s.id)).length;
  const total = strikes.length;
  const allDone = done === total;

  return (
    <Card style={styles.expansionCard} padded={false}>
      {/* Header */}
      <View style={[styles.expansionHeader, {borderBottomColor: color + '40'}]}>
        <View style={[styles.expansionAccent, {backgroundColor: color}]} />
        <Text style={styles.expansionEmoji}>{emoji}</Text>
        <Text style={[styles.expansionTitle, {color}]} numberOfLines={1}>
          {expansion}
        </Text>
        <View style={[styles.groupProgress, allDone && styles.groupProgressDone]}>
          <Text style={[styles.groupProgressText, {color: allDone ? colors.green : colors.textMuted}]}>
            {done}/{total}
          </Text>
        </View>
      </View>

      {/* Strike list */}
      <View style={styles.strikeList}>
        {strikes.map((strike, idx) => (
          <View key={strike.id} style={idx < strikes.length - 1 && styles.strikeRowDivider}>
            <StrikeRow
              name={strike.name}
              cm={strike.cm}
              done={completedIds.has(strike.id)}
            />
          </View>
        ))}
      </View>
    </Card>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function StrikesScreen() {
  const {settings} = useAppStore();

  const {
    data: completedStrikes,
    isLoading: strikesLoading,
    error: strikesError,
    refetch: refetchStrikes,
  } = useStrikeMissions();

  const {
    data: wvWeekly,
    isLoading: wvLoading,
    error: wvError,
    refetch: refetchWv,
  } = useWizardVaultWeekly();

  const completedIds = useMemo(() => {
    if (!completedStrikes) return new Set<string>();
    return new Set<string>(completedStrikes);
  }, [completedStrikes]);

  const totalDone = useMemo(() => {
    return STRIKE_GROUPS.reduce((sum, group) => {
      return sum + group.strikes.filter(s => completedIds.has(s.id)).length;
    }, 0);
  }, [completedIds]);

  const strikeObjectives = useMemo(() => {
    if (!wvWeekly?.objectives) return [];
    return wvWeekly.objectives.filter(obj =>
      WV_STRIKE_KEYWORDS.some(kw => obj.title.toLowerCase().includes(kw)),
    );
  }, [wvWeekly]);

  // No API key
  if (!settings.apiKey) {
    return (
      <View style={styles.center}>
        <Card style={styles.noKeyCard} padded>
          <Text style={styles.noKeyTitle}>🔑 No API Key Set</Text>
          <Text style={styles.noKeyText}>Go to Settings to enter your GW2 API key.</Text>
        </Card>
      </View>
    );
  }

  // Loading
  if (strikesLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.gold} />
        <Text style={styles.loadingText}>Loading strike missions…</Text>
      </View>
    );
  }

  // Error
  if (strikesError) {
    return (
      <View style={styles.center}>
        <Card style={styles.errorCard} padded>
          <Text style={styles.errorTitle}>⚠️ Failed to Load</Text>
          <Text style={styles.errorText}>Could not fetch strike mission data. Check your API key and connection.</Text>
          <TouchableOpacity onPress={() => refetchStrikes()} style={styles.retryBtn}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </Card>
      </View>
    );
  }

  const allDone = totalDone === TOTAL_STRIKES;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Summary Card */}
      <Card style={styles.card} padded>
        <Text style={styles.sectionLabel}>⚔️ Weekly Progress</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryCount}>
            <Text style={[styles.summaryDone, allDone && styles.summaryAllDone]}>{totalDone}</Text>
            <Text style={styles.summaryOf}>/{TOTAL_STRIKES}</Text>
          </Text>
          <Text style={styles.summarySubtitle}>strikes completed this week</Text>
        </View>
        <ProgressBar value={totalDone} max={TOTAL_STRIKES} color={allDone ? colors.green : colors.gold} />
        {allDone && (
          <Text style={styles.allDoneText}>All strikes cleared! Resets Monday 07:30 UTC.</Text>
        )}
        {!allDone && (
          <Text style={styles.resetHint}>{TOTAL_STRIKES - totalDone} remaining · Resets Monday 07:30 UTC</Text>
        )}
      </Card>

      {/* Expansion Groups */}
      {STRIKE_GROUPS.map(group => (
        <ExpansionCard
          key={group.expansion}
          expansion={group.expansion}
          emoji={group.emoji}
          color={group.color}
          strikes={group.strikes}
          completedIds={completedIds}
        />
      ))}

      {/* Wizard's Vault Weekly — Strike Objectives */}
      <Card style={[styles.card, styles.wvCard]} padded>
        <Text style={styles.sectionLabel}>🧙 Wizard's Vault — Strike Objectives</Text>
        {wvError ? (
          <View style={styles.inlineError}>
            <Text style={styles.inlineErrorText}>⚠️ Could not load Wizard's Vault data.</Text>
            <TouchableOpacity onPress={() => refetchWv()} style={styles.retryBtnSmall}>
              <Text style={styles.retryBtnText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : wvLoading ? (
          <ActivityIndicator color={colors.gold} style={styles.loader} />
        ) : strikeObjectives.length === 0 ? (
          <Text style={styles.emptyText}>No strike objectives this week.</Text>
        ) : (
          strikeObjectives.map(obj => {
            const done = obj.claimed;
            const pct = obj.progress_complete > 0
              ? obj.progress_current / obj.progress_complete
              : 1;
            return (
              <View key={obj.id} style={[styles.wvRow, done && styles.wvRowDone]}>
                <Text style={styles.wvDot}>{done ? '✅' : '◯'}</Text>
                <View style={styles.wvContent}>
                  <Text style={[styles.wvTitle, done && styles.wvTitleDone]}>{obj.title}</Text>
                  <View style={styles.wvProgressRow}>
                    <ProgressBar value={obj.progress_current} max={obj.progress_complete} color={colors.gold} />
                    <Text style={styles.wvCount}>
                      {obj.progress_current}/{obj.progress_complete}
                    </Text>
                  </View>
                  <Text style={styles.acclaimText}>+{obj.acclaim} Astral Acclaim</Text>
                </View>
              </View>
            );
          })
        )}
        <Text style={styles.resetHint}>Resets weekly with strike missions</Text>
      </Card>

    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bg},
  content: {padding: spacing.md, gap: spacing.md},
  center: {flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center', padding: spacing.md},

  // No key / error
  noKeyCard: {maxWidth: 320},
  noKeyTitle: {fontSize: fontSize.lg, color: colors.gold, fontWeight: '700', marginBottom: spacing.sm},
  noKeyText: {fontSize: fontSize.sm, color: colors.textMuted, lineHeight: 20},
  errorCard: {maxWidth: 320, alignItems: 'center'},
  errorTitle: {fontSize: fontSize.lg, color: colors.red, fontWeight: '700', marginBottom: spacing.sm},
  errorText: {fontSize: fontSize.sm, color: colors.textMuted, lineHeight: 20, textAlign: 'center', marginBottom: spacing.md},

  // Loading
  loadingText: {marginTop: spacing.md, fontSize: fontSize.sm, color: colors.textMuted},

  // Generic
  card: {marginBottom: 0},
  loader: {marginVertical: spacing.md},
  emptyText: {color: colors.textMuted, fontSize: fontSize.sm, textAlign: 'center', paddingVertical: spacing.md},
  sectionLabel: {fontSize: fontSize.xs, color: colors.textMuted, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: spacing.sm},

  // Summary card
  summaryRow: {flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, marginBottom: spacing.sm},
  summaryCount: {flexDirection: 'row'},
  summaryDone: {fontSize: 36, fontWeight: '800', color: colors.gold},
  summaryAllDone: {color: colors.green},
  summaryOf: {fontSize: fontSize.xl, fontWeight: '600', color: colors.textMuted},
  summarySubtitle: {fontSize: fontSize.sm, color: colors.textMuted, flexShrink: 1},
  allDoneText: {marginTop: spacing.sm, fontSize: fontSize.sm, color: colors.green, fontWeight: '600'},
  resetHint: {marginTop: spacing.sm, fontSize: fontSize.xs, color: colors.textMuted},

  // Progress bar
  progressTrack: {height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden', marginVertical: 4},
  progressFill: {height: '100%', borderRadius: 3},

  // Expansion card
  expansionCard: {overflow: 'hidden'},
  expansionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    gap: spacing.sm,
  },
  expansionAccent: {width: 3, height: 18, borderRadius: 2},
  expansionEmoji: {fontSize: fontSize.md},
  expansionTitle: {flex: 1, fontSize: fontSize.md, fontWeight: '700'},
  groupProgress: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    backgroundColor: colors.border,
  },
  groupProgressDone: {backgroundColor: colors.green + '22'},
  groupProgressText: {fontSize: fontSize.sm, fontWeight: '700'},

  // Strike list
  strikeList: {paddingHorizontal: spacing.md},
  strikeRowDivider: {borderBottomWidth: 1, borderBottomColor: colors.border},
  strikeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    gap: spacing.sm,
  },
  strikeRowDone: {opacity: 0.55},

  // Checkbox
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {backgroundColor: colors.gold},
  checkboxUndone: {borderWidth: 1.5, borderColor: colors.textMuted},
  checkmark: {fontSize: fontSize.xs, color: colors.bg, fontWeight: '800'},

  // Strike name & CM badge
  strikeName: {flex: 1, fontSize: fontSize.sm, color: colors.text},
  strikeNameDone: {color: colors.textMuted, textDecorationLine: 'line-through'},
  cmBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
    backgroundColor: colors.gold + '22',
    borderWidth: 1,
    borderColor: colors.gold + '55',
  },
  cmText: {fontSize: fontSize.xs, color: colors.gold, fontWeight: '700', letterSpacing: 0.5},

  // Retry buttons
  retryBtn: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.gold,
    alignSelf: 'center',
  },
  retryBtnSmall: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.md,
    backgroundColor: colors.gold,
    alignSelf: 'flex-start',
  },
  retryBtnText: {fontSize: fontSize.sm, color: colors.bg, fontWeight: '700'},

  // Inline error
  inlineError: {paddingVertical: spacing.sm},
  inlineErrorText: {fontSize: fontSize.sm, color: colors.red},

  // Wizard's Vault card
  wvCard: {marginBottom: spacing.md},
  wvRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  wvRowDone: {opacity: 0.5},
  wvDot: {fontSize: fontSize.md, marginTop: 1},
  wvContent: {flex: 1},
  wvTitle: {fontSize: fontSize.sm, color: colors.text},
  wvTitleDone: {textDecorationLine: 'line-through', color: colors.textMuted},
  wvProgressRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 4},
  wvCount: {fontSize: fontSize.xs, color: colors.textMuted, minWidth: 36, textAlign: 'right'},
  acclaimText: {fontSize: fontSize.xs, color: colors.gold, marginTop: 3},
});
