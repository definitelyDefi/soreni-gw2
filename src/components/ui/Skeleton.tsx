import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View, ViewStyle} from 'react-native';
import {colors, radius} from '../../constants/theme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = radius.sm,
  style,
}: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {width: width as any, height, borderRadius, opacity},
        style,
      ]}
    />
  );
}

export function SkeletonCard({style}: {style?: ViewStyle}) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.cardHeader}>
        <Skeleton width={44} height={44} borderRadius={22} />
        <View style={styles.cardHeaderText}>
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={12} style={{marginTop: 6}} />
        </View>
      </View>
      <Skeleton width="100%" height={12} style={{marginTop: 12}} />
      <Skeleton width="80%" height={12} style={{marginTop: 6}} />
    </View>
  );
}

export function SkeletonRow({style}: {style?: ViewStyle}) {
  return (
    <View style={[styles.row, style]}>
      <Skeleton width={44} height={44} borderRadius={radius.sm} />
      <View style={styles.rowText}>
        <Skeleton width="50%" height={14} />
        <Skeleton width="30%" height={11} style={{marginTop: 5}} />
      </View>
      <Skeleton width={60} height={14} />
    </View>
  );
}

export function SkeletonGrid({count = 12}: {count?: number}) {
  const slots = Array(count).fill(0);
  return (
    <View style={styles.grid}>
      {slots.map((_, i) => (
        <Skeleton key={i} width={52} height={52} borderRadius={radius.sm} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.border,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardHeaderText: {
    flex: 1,
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 8,
    gap: 12,
  },
  rowText: {
    flex: 1,
    gap: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    padding: 16,
  },
});
