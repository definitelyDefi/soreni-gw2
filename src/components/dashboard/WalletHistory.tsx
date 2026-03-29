import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GoldDisplay from '../ui/GoldDisplay';
import {useWallet} from '../../hooks/useGW2';
import {useAppStore} from '../../store/appStore';
import {CURRENCY_IDS} from '../../api/account';
import {colors, spacing, fontSize, radius} from '../../constants/theme';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const BAR_MIN_HEIGHT = 4;
const BAR_MAX_HEIGHT = 40;
const HISTORY_DAYS = 7;

function getDateKey(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `wallet_history_${y}-${m}-${d}`;
}

function getLast7DateKeys(): {key: string; label: string}[] {
  const result: {key: string; label: string}[] = [];
  for (let i = HISTORY_DAYS - 1; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    result.push({
      key: getDateKey(d),
      label: DAY_LABELS[d.getUTCDay()],
    });
  }
  return result;
}

export default function WalletHistory() {
  const {settings} = useAppStore();
  const {data: wallet} = useWallet();
  const [history, setHistory] = useState<(number | null)[]>(
    Array(HISTORY_DAYS).fill(null),
  );
  const [labels, setLabels] = useState<string[]>(Array(HISTORY_DAYS).fill(''));

  // Snapshot today's gold value whenever wallet data arrives
  useEffect(() => {
    if (!settings.apiKey || !wallet) return;
    const goldEntry = wallet.find(w => w.id === CURRENCY_IDS.GOLD);
    if (goldEntry == null) return;
    const key = getDateKey(new Date());
    AsyncStorage.setItem(key, String(goldEntry.value)).catch(() => {});
  }, [wallet, settings.apiKey]);

  // Load last 7 days from AsyncStorage
  useEffect(() => {
    async function load() {
      const dateKeys = getLast7DateKeys();
      const values = await Promise.all(
        dateKeys.map(async ({key}) => {
          try {
            const raw = await AsyncStorage.getItem(key);
            return raw != null ? parseInt(raw, 10) : null;
          } catch {
            return null;
          }
        }),
      );
      setHistory(values);
      setLabels(dateKeys.map(dk => dk.label));
    }
    load();
  }, [wallet]);

  const currentGold =
    wallet?.find(w => w.id === CURRENCY_IDS.GOLD)?.value ?? null;

  // Calculate yesterday vs today net change
  const todayVal = history[HISTORY_DAYS - 1];
  const yesterdayVal = history[HISTORY_DAYS - 2];
  const netChange =
    todayVal != null && yesterdayVal != null ? todayVal - yesterdayVal : null;

  // Sparkline bar heights
  const defined = history.filter(v => v != null) as number[];
  const maxVal = defined.length > 0 ? Math.max(...defined) : 1;
  const barHeights = history.map(v => {
    if (v == null || maxVal === 0) return BAR_MIN_HEIGHT;
    return Math.max(
      BAR_MIN_HEIGHT,
      Math.round((v / maxVal) * BAR_MAX_HEIGHT),
    );
  });

  if (!settings.apiKey) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📈 Gold Trend</Text>
        {currentGold != null && <GoldDisplay copper={currentGold} size="sm" />}
      </View>

      {/* Net change vs yesterday */}
      {netChange != null && (
        <Text
          style={[
            styles.netChange,
            netChange >= 0 ? styles.netChangePos : styles.netChangeNeg,
          ]}>
          {netChange >= 0 ? '+' : ''}
          {Math.floor(Math.abs(netChange) / 10000)}g vs yesterday
        </Text>
      )}

      {/* Sparkline */}
      <View style={styles.sparkline}>
        {barHeights.map((h, i) => (
          <View key={i} style={styles.barCol}>
            <View style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  {height: h},
                  history[i] == null ? styles.barMissing : styles.barFilled,
                  i === HISTORY_DAYS - 1 && styles.barToday,
                ]}
              />
            </View>
            <Text style={styles.dayLabel}>{labels[i]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: colors.gold,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  netChange: {
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
  netChangePos: {
    color: colors.green,
  },
  netChangeNeg: {
    color: colors.red,
  },
  sparkline: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.xs,
    paddingTop: spacing.xs,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  barWrapper: {
    height: BAR_MAX_HEIGHT,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: radius.sm,
  },
  barFilled: {
    backgroundColor: colors.gold + 'bb',
  },
  barMissing: {
    backgroundColor: colors.border,
  },
  barToday: {
    backgroundColor: colors.gold,
  },
  dayLabel: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '600',
  },
});
