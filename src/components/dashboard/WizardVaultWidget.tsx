import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import Card from '../ui/Card';
import {useWizardVaultDaily, useWizardVaultWeekly} from '../../hooks/useGW2';
import {useAppStore} from '../../store/appStore';
import {colors, fontSize, spacing, radius} from '../../constants/theme';

function ProgressBar({current, total, color}: {current: number; total: number; color: string}) {
  const pct = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, {width: `${pct}%` as any, backgroundColor: color}]} />
    </View>
  );
}

export default function WizardVaultWidget() {
  const {settings} = useAppStore();
  const {data: daily, isLoading: dailyLoading} = useWizardVaultDaily();
  const {data: weekly, isLoading: weeklyLoading} = useWizardVaultWeekly();

  if (!settings.apiKey) return null;

  const isLoading = dailyLoading || weeklyLoading;

  const dailyUnclaimed = daily?.objectives.filter(o => !o.claimed && o.progress_current >= o.progress_complete).length ?? 0;
  const weeklyUnclaimed = weekly?.objectives.filter(o => !o.claimed && o.progress_current >= o.progress_complete).length ?? 0;

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>🧙 Wizard's Vault</Text>
      {isLoading ? (
        <ActivityIndicator color={colors.gold} size="small" />
      ) : (
        <>
          {/* Daily */}
          {daily && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionLabel}>Daily</Text>
                <Text style={styles.acclaim}>
                  {daily.meta_progress_current} / {daily.meta_progress_complete} ✦
                </Text>
              </View>
              <ProgressBar
                current={daily.meta_progress_current}
                total={daily.meta_progress_complete}
                color={colors.gold}
              />
              <View style={styles.objRow}>
                <Text style={styles.objDone}>
                  {daily.objectives.filter(o => o.progress_current >= o.progress_complete).length}/{daily.objectives.length} done
                </Text>
                {dailyUnclaimed > 0 && (
                  <View style={styles.claimBadge}>
                    <Text style={styles.claimBadgeTxt}>{dailyUnclaimed} to claim</Text>
                  </View>
                )}
                {daily.meta_reward_claimed && (
                  <View style={[styles.claimBadge, styles.claimedBadge]}>
                    <Text style={[styles.claimBadgeTxt, styles.claimedTxt]}>Reward claimed ✓</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Weekly */}
          {weekly && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionLabel}>Weekly</Text>
                <Text style={styles.acclaim}>
                  {weekly.meta_progress_current} / {weekly.meta_progress_complete} ✦
                </Text>
              </View>
              <ProgressBar
                current={weekly.meta_progress_current}
                total={weekly.meta_progress_complete}
                color='#ce93d8'
              />
              <View style={styles.objRow}>
                <Text style={styles.objDone}>
                  {weekly.objectives.filter(o => o.progress_current >= o.progress_complete).length}/{weekly.objectives.length} done
                </Text>
                {weeklyUnclaimed > 0 && (
                  <View style={styles.claimBadge}>
                    <Text style={styles.claimBadgeTxt}>{weeklyUnclaimed} to claim</Text>
                  </View>
                )}
                {weekly.meta_reward_claimed && (
                  <View style={[styles.claimBadge, styles.claimedBadge]}>
                    <Text style={[styles.claimBadgeTxt, styles.claimedTxt]}>Reward claimed ✓</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {marginBottom: spacing.md, gap: spacing.sm},
  title: {color: colors.gold, fontSize: fontSize.md, fontWeight: '700'},
  section: {gap: spacing.xs},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  acclaim: {color: colors.gold, fontSize: fontSize.xs, fontWeight: '700'},
  progressTrack: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {height: '100%', borderRadius: 3},
  objRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  objDone: {color: colors.textMuted, fontSize: fontSize.xs},
  claimBadge: {
    backgroundColor: colors.gold + '22',
    borderWidth: 1,
    borderColor: colors.gold + '66',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  claimBadgeTxt: {color: colors.gold, fontSize: fontSize.xs, fontWeight: '700'},
  claimedBadge: {
    backgroundColor: colors.green + '15',
    borderColor: colors.green + '55',
  },
  claimedTxt: {color: colors.green},
});
