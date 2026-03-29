import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Card from '../ui/Card';
import {colors, fontSize, spacing, radius} from '../../constants/theme';

function getNextReset(type: 'daily' | 'weekly'): Date {
  const now = new Date();
  const next = new Date();
  if (type === 'daily') {
    // Daily reset: 00:00 UTC
    next.setUTCHours(0, 0, 0, 0);
    if (next <= now) {
      next.setUTCDate(next.getUTCDate() + 1);
    }
  } else {
    // Weekly reset: Monday 07:30 UTC
    // Advance from today to the nearest future Monday 07:30
    const day = next.getUTCDay(); // 0=Sun, 1=Mon...6=Sat
    const daysToMon = (1 - day + 7) % 7; // 0 if today is Monday, else days until next Mon
    next.setUTCDate(next.getUTCDate() + daysToMon);
    next.setUTCHours(7, 30, 0, 0);
    if (next <= now) {
      next.setUTCDate(next.getUTCDate() + 7);
    }
  }
  return next;
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return '00:00:00';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) {
    return `${h}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  }
  return `${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
}

interface CounterProps {
  label: string;
  emoji: string;
  type: 'daily' | 'weekly';
}

function Counter({label, emoji, type}: CounterProps) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    function tick() {
      const now = Date.now();
      const next = getNextReset(type).getTime();
      setRemaining(Math.max(0, next - now));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [type]);

  const urgent = remaining < 30 * 60 * 1000; // < 30 min

  return (
    <View style={styles.counter}>
      <Text style={styles.counterEmoji}>{emoji}</Text>
      <Text style={styles.counterLabel}>{label}</Text>
      <Text style={[styles.counterTime, urgent && styles.counterTimeUrgent]}>
        {formatCountdown(remaining)}
      </Text>
    </View>
  );
}

export default function ResetCountdown() {
  return (
    <Card style={styles.card} padded>
      <Text style={styles.title}>Reset Timers</Text>
      <View style={styles.row}>
        <Counter label="Daily" emoji="🌅" type="daily" />
        <View style={styles.divider} />
        <Counter label="Weekly" emoji="📅" type="weekly" />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counter: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  counterEmoji: {
    fontSize: 22,
  },
  counterLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontWeight: '600',
  },
  counterTime: {
    fontSize: fontSize.lg,
    color: colors.gold,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  counterTimeUrgent: {
    color: colors.red,
  },
  divider: {
    width: 1,
    height: 48,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
});
