import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {colors, fontSize, spacing} from '../constants/theme';
import RecipesScreen from './RecipesScreen';
import LegendaryCraftingScreen from './LegendaryCraftingScreen';

type Tab = 'recipes' | 'legendary';

export default function CraftingScreen() {
  const [tab, setTab] = useState<Tab>('legendary');

  return (
    <View style={styles.root}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, tab === 'legendary' && styles.tabActive]}
          onPress={() => setTab('legendary')}>
          <Text style={[styles.tabTxt, tab === 'legendary' && styles.tabTxtActive]}>
            💎 Legendary
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'recipes' && styles.tabActive]}
          onPress={() => setTab('recipes')}>
          <Text style={[styles.tabTxt, tab === 'recipes' && styles.tabTxtActive]}>
            ⚒️ Recipes
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        {tab === 'legendary' ? <LegendaryCraftingScreen /> : <RecipesScreen />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.bg},
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.gold,
  },
  tabTxt: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  tabTxtActive: {
    color: colors.gold,
  },
  body: {flex: 1},
});
