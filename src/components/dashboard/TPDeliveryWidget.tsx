import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import Card from '../ui/Card';
import GoldDisplay from '../ui/GoldDisplay';
import {useTPDelivery} from '../../hooks/useGW2';
import {useAppStore} from '../../store/appStore';
import {colors, fontSize, spacing, radius} from '../../constants/theme';

export default function TPDeliveryWidget() {
  const {settings} = useAppStore();
  const {data: delivery, isLoading} = useTPDelivery();

  if (!settings.apiKey) return null;

  const hasCoins = (delivery?.coins ?? 0) > 0;
  const itemCount = delivery?.items?.length ?? 0;
  const hasItems = itemCount > 0;
  const hasAnything = hasCoins || hasItems;

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>📦 TP Delivery Box</Text>
      {isLoading ? (
        <ActivityIndicator color={colors.gold} size="small" />
      ) : !hasAnything ? (
        <Text style={styles.empty}>Delivery box is empty</Text>
      ) : (
        <View style={styles.content}>
          {hasCoins && (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Gold waiting</Text>
              <GoldDisplay copper={delivery!.coins} size="sm" />
            </View>
          )}
          {hasItems && (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Items waiting</Text>
              <View style={styles.itemBadge}>
                <Text style={styles.itemBadgeTxt}>{itemCount} item{itemCount !== 1 ? 's' : ''}</Text>
              </View>
            </View>
          )}
          <Text style={styles.hint}>Open Trading Post → Delivery to collect</Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {marginBottom: spacing.md, gap: spacing.sm},
  title: {color: colors.gold, fontSize: fontSize.md, fontWeight: '700'},
  empty: {color: colors.textMuted, fontSize: fontSize.sm},
  content: {gap: spacing.xs},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  rowLabel: {color: colors.textMuted, fontSize: fontSize.sm},
  itemBadge: {
    backgroundColor: colors.gold + '22',
    borderWidth: 1,
    borderColor: colors.gold + '66',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  itemBadgeTxt: {color: colors.gold, fontSize: fontSize.xs, fontWeight: '700'},
  hint: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.xs,
  },
});
