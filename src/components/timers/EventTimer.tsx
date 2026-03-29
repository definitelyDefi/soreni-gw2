import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {BossTimer} from '../../hooks/useTimers';
import {colors, fontSize, spacing, radius} from '../../constants/theme';

interface EventTimerProps {
  timer: BossTimer;
}

export default function EventTimer({timer}: EventTimerProps) {
  const {boss, isActive, countdown, minutesUntil} = timer;

  const urgency =
    !isActive && minutesUntil <= 15
      ? 'urgent'
      : !isActive && minutesUntil <= 30
      ? 'soon'
      : 'normal';

  const accentColor = isActive
    ? colors.green
    : urgency === 'urgent'
    ? colors.red
    : urgency === 'soon'
    ? colors.gold
    : colors.textMuted;

  return (
    <View style={[styles.container, {borderLeftColor: accentColor}]}>
      <View style={styles.left}>
        <Text style={styles.bossName}>{boss.name}</Text>
        <Text style={styles.mapName}>{boss.mapName}</Text>
      </View>
      <View style={styles.right}>
        {isActive ? (
          <View style={styles.activePill}>
            <Text style={styles.activeText}>ACTIVE</Text>
          </View>
        ) : (
          <Text style={[styles.countdown, {color: accentColor}]}>
            {countdown}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderLeftWidth: 3,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  left: {
    flex: 1,
    gap: 2,
  },
  bossName: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  mapName: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  right: {
    alignItems: 'flex-end',
  },
  countdown: {
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  activePill: {
    backgroundColor: colors.green + '22',
    borderWidth: 1,
    borderColor: colors.green,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  activeText: {
    color: colors.green,
    fontSize: fontSize.xs,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
