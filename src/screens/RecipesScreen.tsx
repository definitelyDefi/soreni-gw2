import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {buildRecipeTree, getShoppingList, RecipeNode} from '../utils/recipes';
import {searchRecipesByOutput} from '../api/items';
import {fetchWikiMysticForgeRecipe} from '../api/wiki';
import {Recipe} from '../types';
import RecipeTree from '../components/recipes/RecipeTree';
import GoldDisplay from '../components/ui/GoldDisplay';
import Card from '../components/ui/Card';
import {
  colors,
  fontSize,
  spacing,
  radius,
  rarity as rarityColors,
} from '../constants/theme';

interface SearchResult {
  id: number;
  name: string;
  icon?: string;
  rarity: string;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ITEM_INDEX: SearchResult[] = require('../data/items.json');

// Built lazily on first recipe analysis — avoids blocking the module load.
let _localItemMap: Map<number, SearchResult> | null = null;
function getLocalItemMap() {
  if (!_localItemMap) {
    _localItemMap = new Map(ITEM_INDEX.map(i => [i.id, i]));
  }
  return _localItemMap;
}

// Reverse lookup: item name (lowercase) → item id
let _nameToIdMap: Map<string, number> | null = null;
function getNameToIdMap() {
  if (!_nameToIdMap) {
    _nameToIdMap = new Map(ITEM_INDEX.map(i => [i.name.toLowerCase(), i.id]));
  }
  return _nameToIdMap;
}

function searchItems(query: string): SearchResult[] {
  if (query.length < 2) return [];
  try {
    const q = query.toLowerCase();
    const results: SearchResult[] = [];
    for (const item of ITEM_INDEX) {
      if (item.name?.toLowerCase().includes(q)) {
        results.push(item);
        if (results.length >= 200) break;
      }
    }
    return results;
  } catch {
    return [];
  }
}
export default function RecipesScreen() {
  const [searchPage, setSearchPage] = useState(0);
  const PAGE_SIZE = 10;
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedItem, setSelectedItem] = useState<SearchResult | null>(null);
  const [count, setCount] = useState('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tree, setTree] = useState<RecipeNode | null>(null);

  const handleSearch = useCallback((text: string) => {
    setQuery(text);
    setSelectedItem(null);
    setTree(null);
    setSearchPage(0);
    if (text.length < 2) {
      setSearchResults([]);
      return;
    }
    const results = searchItems(text);
    setSearchResults(results);
  }, []);

  async function handleSelectItem(item: SearchResult) {
    setSelectedItem(item);
    setSearchResults([]);
    setQuery(item.name);
    await analyzeRecipe(item.id, item.name);
  }

  async function analyzeRecipe(itemId: number, itemName?: string) {
    setLoading(true);
    setError('');
    setTree(null);
    try {
      const recipeIds = await searchRecipesByOutput(itemId);
      let recipeOverrides: Map<number, Recipe> | undefined;

      if (recipeIds.length === 0) {
        // GW2 API has no recipe — try Mystic Forge lookup from the wiki
        if (!itemName) {
          setError('No recipe found for this item.');
          setLoading(false);
          return;
        }

        const wikiRecipe = await fetchWikiMysticForgeRecipe(itemName);
        if (!wikiRecipe) {
          setError(
            'No recipe found for this item.\n\nThe GW2 API has no crafting recipe, and no Mystic Forge recipe was found on the wiki.',
          );
          setLoading(false);
          return;
        }

        // Resolve ingredient names → item IDs using local index
        const nameMap = getNameToIdMap();
        const resolvedIngredients = wikiRecipe.ingredients
          .map(ing => ({
            item_id: nameMap.get(ing.name.toLowerCase()) ?? -1,
            count: ing.count,
          }))
          .filter(ing => ing.item_id !== -1);

        if (resolvedIngredients.length === 0) {
          setError(
            'Found a Mystic Forge recipe on the wiki, but could not match ingredients to GW2 item IDs.',
          );
          setLoading(false);
          return;
        }

        const syntheticRecipe: Recipe = {
          id: 0,
          type: 'MysticForge',
          output_item_id: itemId,
          output_item_count: 1,
          ingredients: resolvedIngredients,
        };
        recipeOverrides = new Map([[itemId, syntheticRecipe]]);
      }

      const qty = parseInt(count) || 1;
      const result = await buildRecipeTree(
        itemId,
        qty,
        getLocalItemMap(),
        recipeOverrides,
      );
      setTree(result);
    } catch {
      setError('Failed to load recipe.');
    } finally {
      setLoading(false);
    }
  }

  const shoppingList = tree ? getShoppingList(tree) : null;

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.input}
            value={query}
            onChangeText={handleSearch}
            placeholder="Search item name..."
            placeholderTextColor={colors.textMuted}
            autoCorrect={false}
          />
          <TextInput
            style={styles.countInput}
            value={count}
            onChangeText={setCount}
            placeholder="Qty"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
          />
        </View>

      </View>

      {searchResults.length > 0 && (
        <View style={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <Text style={styles.dropdownCount}>
              {searchResults.length} results
            </Text>
            <View style={styles.paginationBtns}>
              <TouchableOpacity
                style={[
                  styles.pageBtn,
                  searchPage === 0 && styles.pageBtnDisabled,
                ]}
                onPress={() => setSearchPage(p => Math.max(0, p - 1))}
                disabled={searchPage === 0}>
                <Text style={styles.pageBtnText}>◀</Text>
              </TouchableOpacity>
              <Text style={styles.pageText}>
                {searchPage + 1}/{Math.ceil(searchResults.length / PAGE_SIZE)}
              </Text>
              <TouchableOpacity
                style={[
                  styles.pageBtn,
                  (searchPage + 1) * PAGE_SIZE >= searchResults.length &&
                    styles.pageBtnDisabled,
                ]}
                onPress={() =>
                  setSearchPage(p =>
                    (p + 1) * PAGE_SIZE < searchResults.length ? p + 1 : p,
                  )
                }
                disabled={(searchPage + 1) * PAGE_SIZE >= searchResults.length}>
                <Text style={styles.pageBtnText}>▶</Text>
              </TouchableOpacity>
            </View>
          </View>

          {searchResults
            .slice(searchPage * PAGE_SIZE, (searchPage + 1) * PAGE_SIZE)
            .map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.resultItem}
                onPress={() => handleSelectItem(item)}>
                <View style={styles.dropdownLeft}>
                  <Text style={styles.dropdownName}>{item.name}</Text>
                  <Text style={styles.dropdownId}>ID: {item.id}</Text>
                </View>
                <Text
                  style={[
                    styles.dropdownRarity,
                    {
                      color:
                        rarityColors[
                          item.rarity as keyof typeof rarityColors
                        ] ?? colors.textMuted,
                    },
                  ]}>
                  {item.rarity}
                </Text>
              </TouchableOpacity>
            ))}
        </View>
      )}

      <ScrollView contentContainerStyle={styles.content}>
        {loading && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.gold} />
            <Text style={styles.loadingText}>Analyzing recipe...</Text>
          </View>
        )}

        {error ? (
          <Card style={styles.errorCard}>
            <Text style={styles.error}>{error}</Text>
          </Card>
        ) : null}

        {tree && (
          <>
            <Card style={styles.summaryCard}>
              <Text style={styles.sectionTitle}>📊 Cost Summary</Text>
              {selectedItem && (
                <Text style={styles.itemName}>{selectedItem.name}</Text>
              )}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Craft cost</Text>
                <GoldDisplay copper={tree.craftCost} size="md" />
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Buy cost</Text>
                <GoldDisplay copper={tree.buyCost} size="md" />
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Savings</Text>
                <GoldDisplay copper={tree.buyCost - tree.craftCost} size="md" />
              </View>
              <View
                style={[
                  styles.recommendation,
                  {
                    backgroundColor: tree.shouldCraft
                      ? colors.green + '22'
                      : colors.gold + '22',
                    borderColor: tree.shouldCraft ? colors.green : colors.gold,
                  },
                ]}>
                <Text
                  style={[
                    styles.recommendationText,
                    {
                      color: tree.shouldCraft ? colors.green : colors.gold,
                    },
                  ]}>
                  {tree.shouldCraft
                    ? '⚒ Crafting is cheaper — make it!'
                    : '🛒 Buying is cheaper — skip crafting'}
                </Text>
              </View>
            </Card>

            <View style={styles.treeSection}>
              <Text style={styles.sectionTitle}>🌳 Recipe Tree</Text>
              <RecipeTree node={tree} />
            </View>

            {shoppingList && shoppingList.size > 0 && (
              <Card style={styles.shoppingCard}>
                <Text style={styles.sectionTitle}>🛒 Shopping List</Text>
                {Array.from(shoppingList.entries()).map(
                  ([id, {item, count}]) => (
                    <View key={id} style={styles.shoppingItem}>
                      {item?.icon ? (
                        <Image
                          source={{uri: item.icon}}
                          style={styles.shoppingIcon}
                          resizeMode="contain"
                        />
                      ) : (
                        <View style={styles.shoppingIconEmpty} />
                      )}
                      <Text style={styles.shoppingName} numberOfLines={1}>
                        {item?.name ?? `Item #${id}`}
                      </Text>
                      <Text style={styles.shoppingCount}>×{count}</Text>
                    </View>
                  ),
                )}
              </Card>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  searchContainer: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    padding: spacing.md,
    zIndex: 100,
  },
  searchRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    color: colors.text,
    fontSize: fontSize.sm,
  },
  countInput: {
    width: 60,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    color: colors.text,
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
  resultsContainer: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownLeft: {
    flex: 1,
  },
  dropdownName: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  dropdownId: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  dropdownRarity: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    marginLeft: spacing.sm,
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
  },
  centered: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  errorCard: {
    borderColor: colors.red,
  },
  error: {
    color: colors.red,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  summaryCard: {
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.gold,
    fontSize: fontSize.md,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  itemName: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  recommendation: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  recommendationText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  treeSection: {
    gap: spacing.sm,
  },
  shoppingCard: {
    gap: spacing.sm,
  },
  shoppingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  shoppingIcon: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    backgroundColor: colors.bg,
  },
  shoppingIconEmpty: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    backgroundColor: colors.border,
  },
  shoppingName: {
    color: colors.text,
    fontSize: fontSize.sm,
    flex: 1,
  },
  shoppingCount: {
    color: colors.gold,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownCount: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  paginationBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pageBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    backgroundColor: colors.border,
    borderRadius: radius.sm,
  },
  pageBtnDisabled: {
    opacity: 0.3,
  },
  pageBtnText: {
    color: colors.text,
    fontSize: fontSize.xs,
  },
  pageText: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    minWidth: 40,
    textAlign: 'center',
  },
});
