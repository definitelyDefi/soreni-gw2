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
import {CURRENCY_IDS, Wallet} from '../../api/account';
import {InventorySlot, Price} from '../../types';
import {colors, fontSize, spacing, radius} from '../../constants/theme';

// GW2 bank API returns null for empty slots — InventorySlot | null
type BankSlot = InventorySlot | null;
// Material storage entries always have id and count
interface MaterialSlot { id: number; count: number; }

export default function WealthSummary() {
  const {settings} = useAppStore();
  const {data: wallet, isLoading: walletLoading} = useWallet();
  const {data: bank, isLoading: bankLoading} = useBank();
  const {data: materials, isLoading: materialsLoading} = useMaterials();

  const allRawItems = useMemo(() => {
    const items: {id: number; count: number}[] = [];
    if (bank) {
      // Bank slots can be null (empty slots) — filter those out
      (bank as BankSlot[])
        .filter((slot): slot is InventorySlot => slot !== null && slot.id != null)
        .forEach(slot => items.push({id: slot.id, count: slot.count ?? 1}));
    }
    if (materials) {
      (materials as MaterialSlot[])
        .filter(slot => slot?.id != null && slot.count > 0)
        .forEach(slot => items.push({id: slot.id, count: slot.count}));
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
    (prices as Price[] | undefined)?.forEach(p => map.set(p.id, p.sells?.unit_price ?? 0));
    return map;
  }, [prices]);

  const w = (id: number) => (wallet as Wallet[] | undefined)?.find(c => c.id === id)?.value ?? 0;
  const walletGold           = w(CURRENCY_IDS.GOLD);
  const karma                = w(CURRENCY_IDS.KARMA);
  const laurels              = w(CURRENCY_IDS.LAURELS);
  const gems                 = w(CURRENCY_IDS.GEMS);
  const spiritShards         = w(CURRENCY_IDS.SPIRIT_SHARDS);
  const transmutationCharges = w(CURRENCY_IDS.TRANSMUTATION_CHARGES);
  const researchNotes        = w(CURRENCY_IDS.RESEARCH_NOTES);
  const astralAcclaim        = w(CURRENCY_IDS.ASTRAL_ACCLAIM);

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
            {[
              {label: 'Karma',      value: karma.toLocaleString()},
              {label: 'Laurels',    value: laurels.toLocaleString()},
              {label: 'Gems',       value: gems.toLocaleString()},
              {label: 'Spirit ✦',   value: spiritShards.toLocaleString()},
              {label: 'Transmute',  value: transmutationCharges.toLocaleString()},
              {label: 'Research',   value: researchNotes.toLocaleString()},
              {label: 'Astral ✦',   value: astralAcclaim.toLocaleString()},
            ].map(({label, value}) => (
              <View key={label} style={styles.currencyChip}>
                <Text style={styles.currencyValue}>{value}</Text>
                <Text style={styles.currencyLabel}>{label}</Text>
              </View>
            ))}
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
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  currencyChip: {
    width: '30%',
    flexGrow: 1,
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
