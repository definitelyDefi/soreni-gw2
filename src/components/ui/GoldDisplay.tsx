import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {formatGold} from '../../utils/currency';
import {fontSize, spacing} from '../../constants/theme';

interface GoldDisplayProps {
  copper: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function GoldDisplay({copper, size = 'md'}: GoldDisplayProps) {
  const {gold, silver, copper: c} = formatGold(copper);
  const fs =
    size === 'sm' ? fontSize.xs : size === 'lg' ? fontSize.lg : fontSize.sm;

  return (
    <View style={styles.container}>
      {gold > 0 && (
        <View style={styles.unit}>
          <Text style={[styles.value, {fontSize: fs}]}>{gold}</Text>
          <Text style={[styles.gold, {fontSize: fs}]}>g</Text>
        </View>
      )}
      {(gold > 0 || silver > 0) && (
        <View style={styles.unit}>
          <Text style={[styles.value, {fontSize: fs}]}>{silver}</Text>
          <Text style={[styles.silver, {fontSize: fs}]}>s</Text>
        </View>
      )}
      <View style={styles.unit}>
        <Text style={[styles.value, {fontSize: fs}]}>{c}</Text>
        <Text style={[styles.copper, {fontSize: fs}]}>c</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  unit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },
  value: {
    color: '#e8e0d0',
    fontWeight: '600',
  },
  gold: {
    color: '#c8972b',
    fontWeight: '700',
  },
  silver: {
    color: '#aaaaaa',
    fontWeight: '700',
  },
  copper: {
    color: '#b87333',
    fontWeight: '700',
  },
});
