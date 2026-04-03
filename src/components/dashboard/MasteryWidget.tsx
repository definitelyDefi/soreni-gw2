import React, {useMemo} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import Card from '../ui/Card';
import {useAccountMasteries, useMasteries, useMasteryRank} from '../../hooks/useGW2';
import {useAppStore} from '../../store/appStore';
import {colors, fontSize, spacing, radius} from '../../constants/theme';

const REGION_COLORS: Record<string, string> = {
  Tyria:    '#4fc3f7',
  Maguuma:  '#8bc34a',
  Desert:   '#ffb74d',
  Tundra:   '#90caf9',
  Jade:     '#4db6ac',
  Sky:      '#ce93d8',
};

const REGION_EMOJI: Record<string, string> = {
  Tyria:    '🗺️',
  Maguuma:  '🌿',
  Desert:   '🏜️',
  Tundra:   '❄️',
  Jade:     '🐉',
  Sky:      '🌌',
};

export default function MasteryWidget() {
  const {settings} = useAppStore();
  const {data: totalPoints, isLoading: rankLoading} = useMasteryRank();
  const {data: allMasteries} = useMasteries();
  const {data: accountMasteries, isLoading: accLoading} = useAccountMasteries();

  if (!settings.apiKey) return null;

  const isLoading = rankLoading || accLoading;

  // Build per-region summary: completed / total mastery levels
  const regionStats = useMemo(() => {
    if (!allMasteries || !accountMasteries) return [];
    const accMap = new Map<number, number>();
    (accountMasteries as {id: number; level: number}[]).forEach(m => accMap.set(m.id, m.level ?? 0));

    const regions: Record<string, {completed: number; total: number}> = {};
    for (const mastery of allMasteries as {id: number; region: string; levels: {name: string}[]}[]) {
      const reg = mastery.region ?? 'Tyria';
      if (!regions[reg]) regions[reg] = {completed: 0, total: 0};
      const totalLevels = mastery.levels?.length ?? 0;
      const earnedLevels = accMap.get(mastery.id) ?? 0;
      regions[reg].completed += earnedLevels;
      regions[reg].total += totalLevels;
    }
    return Object.entries(regions).map(([region, stats]) => ({region, ...stats}));
  }, [allMasteries, accountMasteries]);

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>⭐ Mastery Points</Text>
        {totalPoints != null && !isLoading && (
          <Text style={styles.totalPts}>{totalPoints.toLocaleString()} pts</Text>
        )}
      </View>
      {isLoading ? (
        <ActivityIndicator color={colors.gold} size="small" />
      ) : (
        <View style={styles.grid}>
          {regionStats.map(({region, completed, total}) => {
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
            const color = REGION_COLORS[region] ?? colors.gold;
            const emoji = REGION_EMOJI[region] ?? '🗺️';
            return (
              <View key={region} style={styles.regionCard}>
                <Text style={styles.regionEmoji}>{emoji}</Text>
                <Text style={[styles.regionName, {color}]} numberOfLines={1}>{region}</Text>
                <View style={styles.regionBar}>
                  <View style={[styles.regionBarFill, {width: `${pct}%` as any, backgroundColor: color}]} />
                </View>
                <Text style={styles.regionPct}>{completed}/{total}</Text>
              </View>
            );
          })}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {marginBottom: spacing.md, gap: spacing.sm},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {color: colors.gold, fontSize: fontSize.md, fontWeight: '700'},
  totalPts: {color: colors.gold, fontSize: fontSize.sm, fontWeight: '800'},
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  regionCard: {
    width: '30%',
    flexGrow: 1,
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    gap: 4,
    alignItems: 'center',
  },
  regionEmoji: {fontSize: 18},
  regionName: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    textAlign: 'center',
  },
  regionBar: {
    width: '100%',
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  regionBarFill: {height: '100%', borderRadius: 2},
  regionPct: {
    color: colors.textMuted,
    fontSize: 10,
  },
});
