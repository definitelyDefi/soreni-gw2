import {Recipe, Item, Price} from '../types';
import {
  getRecipe,
  searchRecipesByOutput,
  getItems,
  getPrices,
} from '../api/items';

export interface RecipeNode {
  itemId: number;
  count: number;
  item?: Item;
  price?: Price;
  recipe?: Recipe;
  children: RecipeNode[];
  craftCost: number;
  buyCost: number;
  shouldCraft: boolean;
  isMysticForge?: boolean;
}

type LocalItem = {name: string; icon?: string; rarity: string};

// Phase 1: walk the recipe graph collecting all item IDs and caching recipes.
// Only does recipe lookups — no item detail fetches yet.
async function gatherRecipes(
  itemId: number,
  depth: number,
  recipeCache: Map<number, Recipe | null>,
  itemIds: Set<number>,
  recipeOverrides?: Map<number, Recipe>,
): Promise<void> {
  itemIds.add(itemId);
  if (depth >= 5) return;

  if (recipeCache.has(itemId)) {
    const recipe = recipeCache.get(itemId);
    if (recipe) {
      await Promise.all(
        recipe.ingredients.map(ing =>
          gatherRecipes(ing.item_id, depth + 1, recipeCache, itemIds, recipeOverrides),
        ),
      );
    }
    return;
  }

  // Check caller-supplied overrides first (e.g. Mystic Forge recipes from wiki)
  if (recipeOverrides?.has(itemId)) {
    const recipe = recipeOverrides.get(itemId)!;
    recipeCache.set(itemId, recipe);
    await Promise.all(
      recipe.ingredients.map(ing =>
        gatherRecipes(ing.item_id, depth + 1, recipeCache, itemIds, recipeOverrides),
      ),
    );
    return;
  }

  try {
    const recipeIds = await searchRecipesByOutput(itemId);
    if (recipeIds.length > 0) {
      const recipe = await getRecipe(recipeIds[0]);
      recipeCache.set(itemId, recipe);
      await Promise.all(
        recipe.ingredients.map(ing =>
          gatherRecipes(ing.item_id, depth + 1, recipeCache, itemIds, recipeOverrides),
        ),
      );
    } else {
      recipeCache.set(itemId, null);
    }
  } catch {
    recipeCache.set(itemId, null);
  }
}

// Phase 3: build the final node tree synchronously from pre-fetched maps.
function buildNode(
  itemId: number,
  count: number,
  depth: number,
  recipeCache: Map<number, Recipe | null>,
  itemMap: Map<number, Item>,
  priceMap: Map<number, Price>,
  localItemMap?: Map<number, LocalItem>,
): RecipeNode {
  const apiItem = itemMap.get(itemId);
  const local = localItemMap?.get(itemId);

  // Prefer API data; fall back to local index for name/icon/rarity
  let item: Item | undefined = apiItem;
  if (!item && local) {
    item = {
      id: itemId,
      name: local.name,
      icon: local.icon,
      rarity: local.rarity,
      type: '',
      level: 0,
      vendor_value: 0,
    };
  }

  const price = priceMap.get(itemId);
  const buyCost = (price?.sells?.unit_price ?? 0) * count;

  const node: RecipeNode = {
    itemId,
    count,
    item,
    price,
    children: [],
    craftCost: 0,
    buyCost,
    shouldCraft: false,
  };

  if (depth >= 5) return node;

  const recipe = recipeCache.get(itemId);
  if (recipe) {
    node.recipe = recipe;
    node.isMysticForge = recipe.type === 'MysticForge';
    const scaledIngredients = recipe.ingredients.map(ing => ({
      ...ing,
      count: Math.ceil((ing.count * count) / recipe.output_item_count),
    }));

    node.children = scaledIngredients.map(ing =>
      buildNode(
        ing.item_id,
        ing.count,
        depth + 1,
        recipeCache,
        itemMap,
        priceMap,
        localItemMap,
      ),
    );

    node.craftCost = node.children.reduce(
      (sum, child) =>
        sum + (child.shouldCraft ? child.craftCost : child.buyCost),
      0,
    );
    node.shouldCraft = node.craftCost > 0 && node.craftCost < node.buyCost;
  }

  return node;
}

export async function buildRecipeTree(
  itemId: number,
  count: number = 1,
  localItemMap?: Map<number, LocalItem>,
  recipeOverrides?: Map<number, Recipe>,
): Promise<RecipeNode> {
  const recipeCache = new Map<number, Recipe | null>();
  const itemIds = new Set<number>();

  // Phase 1: collect all item IDs and cache recipes
  await gatherRecipes(itemId, 0, recipeCache, itemIds, recipeOverrides);

  // Phase 2: batch-fetch all item details and prices in one request each.
  // Batch requests return partial results for unknown IDs — no 404 throws.
  const idArray = Array.from(itemIds);
  const [items, prices] = await Promise.all([
    getItems(idArray).catch(() => [] as Item[]),
    getPrices(idArray).catch(() => [] as Price[]),
  ]);

  const itemMap = new Map<number, Item>(items.map(i => [i.id, i]));
  const priceMap = new Map<number, Price>(prices.map(p => [p.id, p]));

  // Phase 3: build tree from cached data
  return buildNode(itemId, count, 0, recipeCache, itemMap, priceMap, localItemMap);
}

export function flattenTree(node: RecipeNode): RecipeNode[] {
  const result: RecipeNode[] = [node];
  for (const child of node.children) {
    result.push(...flattenTree(child));
  }
  return result;
}

export function getShoppingList(
  node: RecipeNode,
): Map<number, {item?: Item; count: number}> {
  const list = new Map<number, {item?: Item; count: number}>();

  function traverse(n: RecipeNode) {
    if (n.children.length === 0 || !n.shouldCraft) {
      const existing = list.get(n.itemId);
      if (existing) {
        existing.count += n.count;
      } else {
        list.set(n.itemId, {item: n.item, count: n.count});
      }
      return;
    }
    for (const child of n.children) {
      traverse(child);
    }
  }

  traverse(node);
  return list;
}
