import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {rarity} from '../../constants/theme';
import {fontSize, radius, spacing} from '../../constants/theme';

interface RarityBadgeProps {
  rarityName: string;
  size?: 'sm' | 'md';
}

export default function RarityBadge({
  rarityName,
  size = 'md',
}: RarityBadgeProps) {
  const color = rarity[rarityName as keyof typeof rarity] ?? rarity.Fine;

  return (
    <View
      style={[styles.badge, {borderColor: color}, size === 'sm' && styles.sm]}>
      <Text style={[styles.text, {color}, size === 'sm' && styles.textSm]}>
        {rarityName}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  sm: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 1,
  },
  text: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  textSm: {
    fontSize: fontSize.xs,
  },
});
