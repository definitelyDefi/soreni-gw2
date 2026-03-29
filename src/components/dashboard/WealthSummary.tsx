import React, {useMemo} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import Card from '../ui/Card';
import GoldDisplay from '../ui/GoldDisplay';
import {Skeleton} from '../ui/Skeleton';
import {
  useWallet,
  useBank,
  useMaterials,
  useItems,
  useItemPrices,
} from '../../hooks/useGW2';
import {useAppStore} from '../../store/appStore';
import {CURRENCY_IDS} from '../../api/account';
import {colors, fontSize, spacing, radius} from '../../constants/theme';

export default function WealthSummary() {
  const {settings} = useAppStore();
  const {data: wallet, isLoading: walletLoading} = useWallet();
  const {data: bank, isLoading: bankLoading} = useBank();
  const {data: materials, isLoading: materialsLoading} = useMaterials();

  const allRawItems = useMemo(() => {
    const items: {id: number; count: number}[] = [];
    if (bank) {
      bank
        .filter((i: any) => i?.id)
        .forEach((i: any) => items.push({id: i.id, count: i.count ?? 1}));
    }
    if (materials) {
      materials
        .filter((i: any) => i?.id && i?.count > 0)
        .forEach((i: any) => items.push({id: i.id, count: i.count ?? 1}));
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
    prices?.forEach((p: any) => map.set(p.id, p.sells?.unit_price ?? 0));
    return map;
  }, [prices]);

  const walletGold =
    wallet?.find((w: any) => w.id === CURRENCY_IDS.GOLD)?.value ?? 0;
  const karma =
    wallet?.find((w: any) => w.id === CURRENCY_IDS.KARMA)?.value ?? 0;
  const laurels =
    wallet?.find((w: any) => w.id === CURRENCY_IDS.LAURELS)?.value ?? 0;
  const astralAcclaim =
    wallet?.find((w: any) => w.id === CURRENCY_IDS.ASTRAL_ACCLAIM)?.value ?? 0;

  const bankValue = useMemo(
    () =>
      allRawItems.reduce((sum, item) => {
        const price = priceMap.get(item.id) ?? 0;
        return sum + price * item.count;
      }, 0),
    [allRawItems, priceMap],
  );

  const totalWealth = walletGold + bankValue;
  const isLoading =
    walletLoading || bankLoading || materialsLoading || pricesLoading;

  if (!settings.apiKey) return null;

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>💰 Account Wealth</Text>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Skeleton width="60%" height={24} />
          <Skeleton width="40%" height={14} style={{marginTop: 8}} />
        </View>
      ) : (
        <>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <GoldDisplay copper={totalWealth} size="lg" />
          </View>

          <View style={styles.divider} />

          <View style={styles.breakdown}>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Wallet</Text>
              <GoldDisplay copper={walletGold} size="sm" />
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Bank + Mats</Text>
              <GoldDisplay copper={bankValue} size="sm" />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.currencies}>
            <View style={styles.currencyChip}>
              <Text style={styles.currencyValue}>{karma.toLocaleString()}</Text>
              <Text style={styles.currencyLabel}>Karma</Text>
            </View>
            <View style={styles.currencyChip}>
              <Text style={styles.currencyValue}>{laurels}</Text>
              <Text style={styles.currencyLabel}>Laurels</Text>
            </View>
            <View style={styles.currencyChip}>
              <Text style={styles.currencyValue}>{astralAcclaim}</Text>
              <Text style={styles.currencyLabel}>Astral ✦</Text>
            </View>
          </View>
        </>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  title: {
    color: colors.gold,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  loadingContainer: {
    gap: spacing.sm,
    paddingVertical: spacing.sm,
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
  divider: {
    height: 1,
    backgroundColor: colors.border,
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
  currencies: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  currencyChip: {
    flex: 1,
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    alignItems: 'center',
    gap: 2,
  },
  currencyValue: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  currencyLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
});
