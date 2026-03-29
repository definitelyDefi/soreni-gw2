import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Card from '../ui/Card';
import {useNextBoss, useActiveBosses} from '../../hooks/useTimers';
import {colors, fontSize, spacing, radius} from '../../constants/theme';

export default function NextBossWidget() {
  const nextBoss = useNextBoss();
  const activeBosses = useActiveBosses();

  if (!nextBoss && activeBosses.length === 0) return null;

  return (
    <Card style={styles.card}>
      <Text style={styles.sectionTitle}>⏱ World Bosses</Text>

      {activeBosses.length > 0 && (
        <View style={styles.activeSection}>
          <Text style={styles.activeLabel}>🟢 Active Now</Text>
          {activeBosses.slice(0, 3).map(t => (
            <View key={t.boss.id} style={styles.activeRow}>
              <View>
                <Text style={styles.activeBoss}>{t.boss.name}</Text>
                <Text style={styles.timeRange}>{t.startTime} – {t.endTime}</Text>
              </View>
              <Text style={styles.activeTime}>
                {Math.floor(t.secondsRemaining / 60)}:
                {(t.secondsRemaining % 60).toString().padStart(2, '0')} left
              </Text>
            </View>
          ))}
        </View>
      )}

      {nextBoss && (
        <View style={styles.nextSection}>
          <Text style={styles.nextLabel}>Next Up</Text>
          <Text style={styles.bossName}>{nextBoss.boss.name}</Text>
          <Text style={styles.mapName}>{nextBoss.boss.mapName}</Text>
          <Text style={styles.timeRange}>{nextBoss.startTime} – {nextBoss.endTime}</Text>
          <Text
            style={[
              styles.countdown,
              nextBoss.secondsUntil <= 300 && {color: colors.red},
              nextBoss.secondsUntil <= 900 &&
                nextBoss.secondsUntil > 300 && {color: colors.gold},
            ]}>
            {nextBoss.countdown}
          </Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.gold,
    fontSize: fontSize.md,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  activeSection: {
    backgroundColor: colors.green + '15',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.green + '44',
  },
  activeLabel: {
    color: colors.green,
    fontSize: fontSize.xs,
    fontWeight: '700',
    marginBottom: spacing.xs,
    letterSpacing: 1,
  },
  activeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  activeBoss: {
    color: colors.text,
    fontSize: fontSize.sm,
  },
  activeTime: {
    color: colors.green,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  nextSection: {
    gap: 2,
  },
  nextLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bossName: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  mapName: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  timeRange: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 1,
  },
  countdown: {
    color: colors.gold,
    fontSize: fontSize.xxl,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
});
