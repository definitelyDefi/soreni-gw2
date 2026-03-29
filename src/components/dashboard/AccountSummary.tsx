import React, {useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Card from '../ui/Card';
import GoldDisplay from '../ui/GoldDisplay';
import {Skeleton, SkeletonCard} from '../ui/Skeleton';
import ErrorMessage from '../ui/ErrorMessage';
import {
  useAccount,
  useWallet,
  useBank,
  useMaterials,
  useItemPrices,
  usePvpStats,
} from '../../hooks/useGW2';
import {useAppStore} from '../../store/appStore';
import {CURRENCY_IDS} from '../../api/account';
import type {InventorySlot, Price} from '../../types/index';
import {colors, fontSize, spacing, radius} from '../../constants/theme';

export default function AccountSummary() {
  const {settings} = useAppStore();
  const {
    data: account,
    isLoading: accountLoading,
    error: accountError,
    refetch: refetchAccount,
  } = useAccount();
  const {data: wallet, isLoading: walletLoading} = useWallet();
  const {data: bank, isLoading: bankLoading} = useBank();
  const {data: materials, isLoading: materialsLoading} = useMaterials();
  const {data: pvp} = usePvpStats();

  const allRawItems = useMemo(() => {
    const items: {id: number; count: number}[] = [];
    if (bank) {
      bank
        .filter((i): i is InventorySlot => i !== null)
        .forEach(i => items.push({id: i.id, count: i.count ?? 1}));
    }
    if (materials) {
      (materials as {id: number; count: number}[])
        .filter(i => i?.id && i?.count > 0)
        .forEach(i => items.push({id: i.id, count: i.count ?? 1}));
    }
    return items;
  }, [bank, materials]);

  const itemIds = useMemo(
    () => [...new Set(allRawItems.map(i => i.id))],
    [allRawItems],
  );
  const {data: prices, isLoading: pricesLoading} = useItemPrices(itemIds);

  const priceMap = useMemo(() => {
    const map = new Map<number, number>();
    (prices as Price[] | undefined)?.forEach(p =>
      map.set(p.id, p.sells?.unit_price ?? 0),
    );
    return map;
  }, [prices]);

  const goldCopper = wallet?.find(w => w.id === CURRENCY_IDS.GOLD)?.value ?? 0;
  const karma = wallet?.find(w => w.id === CURRENCY_IDS.KARMA)?.value ?? 0;
  const laurels = wallet?.find(w => w.id === CURRENCY_IDS.LAURELS)?.value ?? 0;

  const bankValue = useMemo(
    () =>
      allRawItems.reduce((sum, item) => {
        const price = priceMap.get(item.id) ?? 0;
        return sum + price * item.count;
      }, 0),
    [allRawItems, priceMap],
  );

  const totalWealth = goldCopper + bankValue;
  const wealthLoading =
    walletLoading || bankLoading || materialsLoading || pricesLoading;

  if (!settings.apiKey) {
    return (
      <Card style={styles.noKeyCard}>
        <Text style={styles.noKeyTitle}>🔑 No API Key Set</Text>
        <Text style={styles.noKeyText}>
          Go to Settings and enter your Guild Wars 2 API key to see your account
          data.
        </Text>
      </Card>
    );
  }

  if (accountLoading) {
    return <SkeletonCard style={styles.card} />;
  }

  if (accountError) {
    return <ErrorMessage error={accountError} onRetry={refetchAccount} />;
  }

  if (!account) {
    return null;
  }

  const ap = account.daily_ap + account.monthly_ap;
  const playtimeHours = Math.floor(account.age / 3600);
  const playtimeDisplay = playtimeHours >= 1000
    ? `${(playtimeHours / 1000).toFixed(1)}k`
    : playtimeHours.toLocaleString();

  return (
    <Card style={styles.card}>
      <Text style={styles.name}>{account.name}</Text>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{ap.toLocaleString()}</Text>
          <Text style={styles.statLabel}>AP</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {account.wvw_rank.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>WvW Rank</Text>
        </View>
        {pvp && (
          <>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{pvp.pvp_rank}</Text>
              <Text style={styles.statLabel}>PvP Rank</Text>
            </View>
          </>
        )}
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{playtimeDisplay}h</Text>
          <Text style={styles.statLabel}>Playtime</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>💰 Net Wealth</Text>

      {wealthLoading ? (
        <View style={styles.skeletonGroup}>
          <Skeleton width="55%" height={22} />
          <Skeleton width="80%" height={14} style={styles.skeletonGap} />
        </View>
      ) : (
        <>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <GoldDisplay copper={totalWealth} size="lg" />
          </View>
          <View style={styles.breakdown}>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Wallet</Text>
              <GoldDisplay copper={goldCopper} size="sm" />
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Bank + Mats</Text>
              <GoldDisplay copper={bankValue} size="sm" />
            </View>
          </View>
        </>
      )}

      <View style={styles.divider} />

      <View style={styles.chips}>
        <View style={styles.chip}>
          <Text style={styles.chipValue}>{karma.toLocaleString()}</Text>
          <Text style={styles.chipLabel}>Karma</Text>
        </View>
        <View style={styles.chip}>
          <Text style={styles.chipValue}>{laurels.toLocaleString()}</Text>
          <Text style={styles.chipLabel}>Laurels</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  noKeyCard: {
    marginBottom: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
  },
  noKeyTitle: {
    color: colors.gold,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  noKeyText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
  name: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statItem: {
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  sectionTitle: {
    color: colors.gold,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  skeletonGroup: {
    gap: spacing.xs,
  },
  skeletonGap: {
    marginTop: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
  },
  breakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownItem: {
    gap: 4,
  },
  breakdownLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  chips: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    flex: 1,
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    alignItems: 'center',
    gap: 2,
  },
  chipValue: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  chipLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
});
