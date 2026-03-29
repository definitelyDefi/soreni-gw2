import React, {useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {RecipeNode} from '../../utils/recipes';
import GoldDisplay from '../ui/GoldDisplay';
import RarityBadge from '../ui/RarityBadge';
import {colors, fontSize, spacing, radius, rarity as rarityColors} from '../../constants/theme';

interface RecipeTreeProps {
  node: RecipeNode;
  depth?: number;
}

export default function RecipeTree({node, depth = 0}: RecipeTreeProps) {
  const [expanded, setExpanded] = useState(depth < 2);

  const hasChildren = node.children.length > 0;
  const indent = depth * 16;

  const iconBorderColor = node.item?.rarity
    ? rarityColors[node.item.rarity as keyof typeof rarityColors] ?? colors.border
    : colors.border;

  return (
    <View style={{marginLeft: indent}}>
      <TouchableOpacity
        onPress={() => hasChildren && setExpanded(e => !e)}
        activeOpacity={hasChildren ? 0.7 : 1}>
        <View style={[styles.row, node.shouldCraft && styles.craftRow]}>
          <View style={styles.left}>
            {hasChildren ? (
              <Text style={styles.toggle}>{expanded ? '▼' : '▶'}</Text>
            ) : (
              <View style={styles.togglePlaceholder} />
            )}
            <View style={[styles.iconBox, {borderColor: iconBorderColor}]}>
              {node.item?.icon ? (
                <Image
                  source={{uri: node.item.icon}}
                  style={styles.icon}
                  resizeMode="contain"
                />
              ) : (
                <Text style={styles.iconFallback}>?</Text>
              )}
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1}>
                {node.item?.name ?? `Item #${node.itemId}`}
              </Text>
              <View style={styles.badges}>
                {node.item?.rarity && (
                  <RarityBadge rarityName={node.item.rarity} size="sm" />
                )}
                {node.shouldCraft && !node.isMysticForge && (
                  <View style={styles.craftBadge}>
                    <Text style={styles.craftBadgeText}>CRAFT</Text>
                  </View>
                )}
                {node.isMysticForge && (
                  <View style={styles.mfBadge}>
                    <Text style={styles.mfBadgeText}>✦ MF</Text>
                  </View>
                )}
                {!node.shouldCraft && node.buyCost > 0 && (
                  <View style={styles.buyBadge}>
                    <Text style={styles.buyBadgeText}>BUY</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={styles.right}>
            <Text style={styles.count}>×{node.count}</Text>
            {node.shouldCraft ? (
              <GoldDisplay copper={node.craftCost} size="sm" />
            ) : node.buyCost > 0 ? (
              <GoldDisplay copper={node.buyCost} size="sm" />
            ) : null}
          </View>
        </View>
      </TouchableOpacity>

      {expanded && hasChildren && (
        <View style={styles.children}>
          {node.children.map((child, i) => (
            <RecipeTree
              key={`${child.itemId}-${i}`}
              node={child}
              depth={depth + 1}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginBottom: 4,
  },
  craftRow: {
    borderColor: colors.gold + '88',
    backgroundColor: colors.gold + '11',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.xs,
  },
  toggle: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    width: 12,
    textAlign: 'center',
  },
  togglePlaceholder: {
    width: 12,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderWidth: 1.5,
    borderRadius: radius.sm,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  icon: {
    width: 28,
    height: 28,
  },
  iconFallback: {
    color: colors.border,
    fontSize: fontSize.sm,
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  badges: {
    flexDirection: 'row',
    gap: 4,
  },
  craftBadge: {
    backgroundColor: colors.gold + '22',
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: radius.sm,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  craftBadgeText: {
    color: colors.gold,
    fontSize: 9,
    fontWeight: '800',
  },
  buyBadge: {
    backgroundColor: colors.blue + '22',
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: radius.sm,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  buyBadgeText: {
    color: colors.blue,
    fontSize: 9,
    fontWeight: '800',
  },
  mfBadge: {
    backgroundColor: '#7b2fff22',
    borderWidth: 1,
    borderColor: '#7b2fff',
    borderRadius: radius.sm,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  mfBadgeText: {
    color: '#a855f7',
    fontSize: 9,
    fontWeight: '800',
  },
  right: {
    alignItems: 'flex-end',
    gap: 2,
  },
  count: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  children: {
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    marginLeft: spacing.sm,
    paddingLeft: spacing.sm,
  },
});
