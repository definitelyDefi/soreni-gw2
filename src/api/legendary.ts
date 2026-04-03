import {
  getItems,
  getPrices,
  getBankContents,
  getMaterials,
  searchRecipesByOutput,
  getRecipes,
} from './items';
import {getCharacters, getCharacterInventory} from './characters';
import {TIMEGATED_ITEMS, SPECIAL_ACQUISITION, LEAF_ITEM_IDS} from '../data/timegates';
import type {TimegateInfo, SpecialAcquisition} from '../data/timegates';
import {
  HARDCODED_RECIPES,
  isSyntheticItemId,
  getSyntheticItemInfo,
} from '../data/legendaryRecipes';

// ─── Types ────────────────────────────────────────────────────────────────────

export type NodeSource =
  | 'craft'
  | 'forge'
  | 'timegated'
  | 'special'
  | 'buy'
  | 'unknown';

export interface RecipeNode {
  itemId: number;
  name: string;
  icon?: string;
  count: number;
  outputCount: number;         // how many the recipe produces
  craftedCount: number;        // how many times the recipe is run
  source: NodeSource;
  recipeType?: string;         // 'Artificer', 'MysticForge', etc.
  children?: RecipeNode[];
  timegateInfo?: TimegateInfo;
  specialInfo?: SpecialAcquisition;
}

export interface FlatMaterial {
  itemId: number;
  name: string;
  icon?: string;
  needed: number;
  haveTotal: number;
  missing: number;
  tpBuyPrice: number;          // per unit (copper)
  tpSellPrice: number;         // per unit (copper)
  totalBuyCost: number;        // missing × tpBuyPrice
  isTimegated: boolean;
  timegateInfo?: TimegateInfo;
  daysRequired: number;
  specialInfo?: SpecialAcquisition;
  source: NodeSource;
  wikiUrl: string;
  recipeChildren?: RecipeNode[];  // sub-ingredients if this item is crafted/forged
}

export interface LegendaryPlan {
  legendaryItemId: number;
  legendaryName: string;
  legendaryIcon?: string;
  tree: RecipeNode;
  flatMaterials: FlatMaterial[];
  timegatedMaterials: FlatMaterial[];
  specialMaterials: FlatMaterial[];
  totalBuyCost: number;        // total copper needed from TP
  minDaysTimegate: number;     // minimum days due to timegating
  mysticCloverCount: number;
  needsMapCompletion: boolean;
  needsWvW: boolean;
  dataWarnings: string[];      // non-fatal fetch failures the UI should surface
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

function wikiUrl(name: string): string {
  return `https://wiki.guildwars2.com/wiki/${encodeURIComponent(name.replace(/ /g, '_'))}`;
}

// ─── Core plan builder ────────────────────────────────────────────────────────

export async function buildLegendaryPlan(
  legendaryItemId: number,
  inventory: Map<number, number>,
): Promise<LegendaryPlan> {
  const dataWarnings: string[] = [];

  // ── Phase 1: BFS to discover all item IDs in the recipe tree ──────────────
  const recipeSearchCache = new Map<number, number[]>();  // itemId → recipeIds
  const recipeDetailsCache = new Map<number, any>();       // recipeId → recipe obj
  const itemDetailsCache = new Map<number, any>();         // itemId → item obj

  const allItemIds = new Set<number>([legendaryItemId]);
  let frontier = [legendaryItemId];
  let safetyIter = 0;

  while (frontier.length > 0 && safetyIter < 20) {
    safetyIter++;

    // Batch-search recipes for all frontier items in parallel
    const searchResults = await Promise.all(
      frontier.map(async id => {
        if (recipeSearchCache.has(id)) return recipeSearchCache.get(id)!;
        if (LEAF_ITEM_IDS.has(id)) {
          recipeSearchCache.set(id, []);
          return [] as number[];
        }
        try {
          const ids = await searchRecipesByOutput(id);
          recipeSearchCache.set(id, ids);
          return ids;
        } catch {
          recipeSearchCache.set(id, []);
          return [] as number[];
        }
      }),
    );

    // Collect recipe IDs we haven't fetched yet
    const newRecipeIds = [
      ...new Set(
        searchResults
          .flat()
          .filter(rid => !recipeDetailsCache.has(rid)),
      ),
    ];

    if (newRecipeIds.length > 0) {
      const batches = chunk(newRecipeIds, 200);
      const fetched = await Promise.all(
        batches.map(b =>
          getRecipes(b).catch(() => {
            dataWarnings.push('Some recipe data could not be loaded — ingredient list may be incomplete.');
            return [];
          }),
        ),
      );
      for (const recipe of fetched.flat()) {
        recipeDetailsCache.set(recipe.id, recipe);
      }
    }

    // Discover next level of item IDs
    const nextFrontier: number[] = [];
    for (let i = 0; i < frontier.length; i++) {
      const frontierItemId = frontier[i];
      const recipeIds = searchResults[i];

      if (recipeIds.length > 0) {
        // Use API recipe
        const recipe = recipeDetailsCache.get(recipeIds[0]);
        if (!recipe?.ingredients) continue;
        for (const ing of recipe.ingredients as any[]) {
          const id: number = ing.item_id;
          if (!allItemIds.has(id)) {
            allItemIds.add(id);
            nextFrontier.push(id);
          }
        }
      } else {
        // No API recipe — check hardcoded recipes
        const hardcoded = HARDCODED_RECIPES.get(frontierItemId);
        if (hardcoded) {
          for (const ing of hardcoded.ingredients) {
            if (!allItemIds.has(ing.itemId) && !isSyntheticItemId(ing.itemId)) {
              allItemIds.add(ing.itemId);
              if (!ing.isLeaf) {
                nextFrontier.push(ing.itemId);
              }
            }
          }
        }
      }
    }
    frontier = nextFrontier;
  }

  // ── Phase 2: Batch-fetch all item details ─────────────────────────────────
  const allIdsBatches = chunk([...allItemIds], 200);
  const itemResults = await Promise.all(
    allIdsBatches.map(b =>
      getItems(b).catch(() => {
        dataWarnings.push('Some item details could not be loaded — item names or icons may be missing.');
        return [];
      }),
    ),
  );
  for (const item of itemResults.flat()) {
    itemDetailsCache.set(item.id, item);
  }

  // ── Phase 3: Build tree locally (no more API calls) ───────────────────────
  function buildNode(
    itemId: number,
    count: number,
    depth: number,
    visited: Set<number>,
  ): RecipeNode {
    // Handle synthetic IDs (items only in hardcoded data, not in GW2 API)
    if (isSyntheticItemId(itemId)) {
      const info = getSyntheticItemInfo(itemId);
      const synthName = info?.name ?? `Unknown Component #${itemId}`;
      const wikiSlug = info?.wikiSlug ?? synthName.replace(/ /g, '_');
      return {
        itemId, name: synthName, count,
        outputCount: 1, craftedCount: count,
        source: 'special',
        specialInfo: {
          source: 'Weapon-Specific Crafted Component',
          shortNote: 'Check GW2 wiki for recipe',
          fullNote: `${synthName} is a weapon-specific crafting component. See the GW2 wiki for the exact ingredients and acquisition method.`,
          wikiSlug,
        },
      };
    }

    const item = itemDetailsCache.get(itemId);
    const name = item?.name ?? `Item #${itemId}`;
    const icon: string | undefined = item?.icon;

    if (TIMEGATED_ITEMS[itemId]) {
      return {
        itemId, name, icon, count,
        outputCount: 1, craftedCount: count,
        source: 'timegated',
        timegateInfo: TIMEGATED_ITEMS[itemId],
      };
    }
    if (SPECIAL_ACQUISITION[itemId]) {
      return {
        itemId, name, icon, count,
        outputCount: 1, craftedCount: count,
        source: 'special',
        specialInfo: SPECIAL_ACQUISITION[itemId],
      };
    }
    if (LEAF_ITEM_IDS.has(itemId) || depth > 14 || visited.has(itemId)) {
      return {itemId, name, icon, count, outputCount: 1, craftedCount: count, source: 'buy'};
    }

    const recipeIds = recipeSearchCache.get(itemId) ?? [];
    if (!recipeIds.length) {
      // Check hardcoded recipes first (Gen 1 legendaries, Gift of Fortune/Mastery, etc.)
      const hardcoded = HARDCODED_RECIPES.get(itemId);
      if (hardcoded) {
        const newVisited = new Set([...visited, itemId]);
        const children: RecipeNode[] = hardcoded.ingredients.map(ing =>
          buildNode(ing.itemId, ing.count, depth + 1, newVisited),
        );
        return {
          itemId,
          name: item?.name ?? hardcoded.name,
          icon,
          count,
          outputCount: hardcoded.outputCount,
          craftedCount: Math.ceil(count / hardcoded.outputCount),
          source: hardcoded.type === 'MysticForge' ? 'forge' : 'craft',
          recipeType: hardcoded.type,
          children,
        };
      }

      // Legendary-rarity items with no crafting recipe and no hardcoded recipe
      // are exotic Mystic Forge items (Gen 2/3 usually have API recipes).
      if (itemDetailsCache.get(itemId)?.rarity === 'Legendary') {
        return {
          itemId, name, icon, count,
          outputCount: 1, craftedCount: count,
          source: 'forge',
          recipeType: 'MysticForge',
          specialInfo: {
            source: 'Mystic Forge',
            shortNote: 'Mystic Forge recipe',
            fullNote: 'Crafted in the Mystic Forge. See the GW2 wiki for exact ingredients.',
            wikiSlug: name.replace(/ /g, '_').replace(/'/g, '%27'),
          },
        };
      }
      return {itemId, name, icon, count, outputCount: 1, craftedCount: count, source: 'buy'};
    }

    const recipe = recipeDetailsCache.get(recipeIds[0]);
    if (!recipe?.ingredients) {
      return {itemId, name, icon, count, outputCount: 1, craftedCount: count, source: 'buy'};
    }

    const outputCount: number = recipe.output_item_count ?? 1;
    const craftedCount = Math.ceil(count / outputCount);
    const newVisited = new Set([...visited, itemId]);

    const children: RecipeNode[] = (recipe.ingredients as any[]).map(ing =>
      buildNode(ing.item_id, ing.count * craftedCount, depth + 1, newVisited),
    );

    return {
      itemId, name, icon, count,
      outputCount, craftedCount,
      source: recipe.type === 'MysticForge' ? 'forge' : 'craft',
      recipeType: recipe.type,
      children,
    };
  }

  const tree = buildNode(legendaryItemId, 1, 0, new Set());

  // ── Phase 4: Flatten tree to base materials ───────────────────────────────
  const flatMap = new Map<number, {needed: number; node: RecipeNode}>();

  function flatten(node: RecipeNode): void {
    const isLeaf =
      !node.children?.length ||
      node.source === 'timegated' ||
      node.source === 'special' ||
      node.source === 'buy' ||
      node.source === 'forge';

    if (isLeaf) {
      const existing = flatMap.get(node.itemId);
      if (existing) {
        existing.needed += node.count;
      } else {
        flatMap.set(node.itemId, {needed: node.count, node});
      }
      return;
    }
    for (const child of node.children!) flatten(child);
  }
  // Start from children so the legendary weapon itself is not in its own shopping list
  if (tree.children?.length) {
    for (const child of tree.children) flatten(child);
  } else {
    flatten(tree);
  }

  // ── Phase 5: Fetch TP prices for all base materials ───────────────────────
  const leafIds = [...flatMap.keys()];
  const prices = await getPrices(leafIds).catch(() => {
    dataWarnings.push('Trading Post prices could not be loaded — all costs are shown as 0. Try refreshing.');
    return [];
  });
  const priceMap = new Map<number, any>(prices.map((p: any) => [p.id, p]));

  // ── Phase 6: Build FlatMaterial list ─────────────────────────────────────
  const legendaryItem = itemDetailsCache.get(legendaryItemId);
  const flatMaterials: FlatMaterial[] = [];

  for (const [itemId, {needed, node}] of flatMap) {
    const item = itemDetailsCache.get(itemId);
    const price = priceMap.get(itemId);
    const haveTotal = inventory.get(itemId) ?? 0;
    const missing = Math.max(0, needed - haveTotal);
    const tpBuyPrice = price?.sells?.unit_price ?? 0;
    const tpSellPrice = price?.buys?.unit_price ?? 0;
    const isTimegated = !!TIMEGATED_ITEMS[itemId];
    const timegateInfo = TIMEGATED_ITEMS[itemId];
    // Prefer static SPECIAL_ACQUISITION, fall back to specialInfo carried on the node itself
    // (e.g. legendary forge nodes set this dynamically in buildNode)
    const specialInfo = SPECIAL_ACQUISITION[itemId] ?? node.specialInfo;
    const daysRequired =
      isTimegated && missing > 0
        ? Math.ceil(missing / (timegateInfo?.dailyCap ?? 1))
        : 0;

    flatMaterials.push({
      itemId,
      name: item?.name ?? node.name,
      icon: item?.icon ?? node.icon,
      needed,
      haveTotal,
      missing,
      tpBuyPrice,
      tpSellPrice,
      totalBuyCost: missing * tpBuyPrice,
      isTimegated,
      timegateInfo,
      daysRequired,
      specialInfo,
      source: node.source,
      wikiUrl: wikiUrl(item?.name ?? node.name),
      recipeChildren: node.children?.length ? node.children : undefined,
    });
  }

  // Sort: timegated → special → missing by cost desc → have → alphabetical
  flatMaterials.sort((a, b) => {
    if (a.isTimegated !== b.isTimegated) return a.isTimegated ? -1 : 1;
    if (!!a.specialInfo !== !!b.specialInfo) return a.specialInfo ? -1 : 1;
    if (a.missing !== b.missing) return b.missing - a.missing;
    return a.name.localeCompare(b.name);
  });

  const timegatedMaterials = flatMaterials.filter(m => m.isTimegated);
  const specialMaterials = flatMaterials.filter(m => !!m.specialInfo);
  const totalBuyCost = flatMaterials
    .filter(m => !m.isTimegated && !m.specialInfo)
    .reduce((s, m) => s + m.totalBuyCost, 0);
  const minDaysTimegate = timegatedMaterials.reduce(
    (mx, m) => Math.max(mx, m.daysRequired),
    0,
  );

  // Detect special flags.
  // GoF (19626) and GoM (19674) are forge-leaves in flatMaterials; their sub-items
  // are hidden. Derive secondary flags from GoF/GoM missing counts.
  const gomMissing = flatMaterials.find(m => m.itemId === 19674)?.missing ?? 0;
  const gofMissing = flatMaterials.find(m => m.itemId === 19626)?.missing ?? 0;
  const mysticCloverEntry = flatMaterials.find(m => m.itemId === 19675);
  // 77 clovers per GoF needed (Gen 1); also count any direct clover entries (Gen 2+)
  const mysticCloverCount = (mysticCloverEntry?.missing ?? 0) + gofMissing * 77;
  // GoM always requires Gift of Exploration (map) + Gift of Battle (WvW)
  const needsMapCompletion = flatMaterials.some(m => m.itemId === 19677 && m.missing > 0) || gomMissing > 0;
  const needsWvW = flatMaterials.some(m => m.itemId === 19678 && m.missing > 0) || gomMissing > 0;

  return {
    legendaryItemId,
    legendaryName: legendaryItem?.name ?? `Item #${legendaryItemId}`,
    legendaryIcon: legendaryItem?.icon,
    tree,
    flatMaterials,
    timegatedMaterials,
    specialMaterials,
    totalBuyCost,
    minDaysTimegate,
    mysticCloverCount,
    needsMapCompletion,
    needsWvW,
    dataWarnings: [...new Set(dataWarnings)],
  };
}

// ─── Aggregate inventory from all sources ────────────────────────────────────

export async function aggregateAllInventory(): Promise<Map<number, number>> {
  const map = new Map<number, number>();

  function add(id: number, count: number) {
    map.set(id, (map.get(id) ?? 0) + count);
  }

  try {
    // Bank + materials in parallel
    const [bank, materials, charNames] = await Promise.all([
      getBankContents().catch(() => []),
      getMaterials().catch(() => []),
      getCharacters().catch(() => [] as string[]),
    ]);

    for (const slot of bank) {
      if (slot?.id && slot.count) add(slot.id, slot.count);
    }
    for (const mat of materials as any[]) {
      if (mat?.id && mat.count) add(mat.id, mat.count);
    }

    // All character inventories in parallel
    const invResults = await Promise.all(
      charNames.map(name =>
        getCharacterInventory(name).catch(() => ({bags: []})),
      ),
    );
    for (const inv of invResults) {
      for (const bag of inv?.bags ?? []) {
        for (const slot of (bag as any)?.inventory ?? []) {
          if (slot?.id && slot.count) add(slot.id, slot.count);
        }
      }
    }
  } catch {
    // Return partial results if something fails
  }

  return map;
}

// ─── Build combined plan for multiple legendaries ─────────────────────────────

export async function buildCombinedPlan(
  legendaryItemIds: number[],
  inventory: Map<number, number>,
): Promise<{plans: LegendaryPlan[]; combined: FlatMaterial[]; totalCost: number; maxDays: number; dataWarnings: string[]}> {
  const plans = await Promise.all(
    legendaryItemIds.map(id => buildLegendaryPlan(id, inventory)),
  );

  // Merge flat materials across all plans
  const merged = new Map<number, FlatMaterial>();
  for (const plan of plans) {
    for (const mat of plan.flatMaterials) {
      const existing = merged.get(mat.itemId);
      if (existing) {
        const needed = existing.needed + mat.needed;
        const haveTotal = inventory.get(mat.itemId) ?? 0;
        const missing = Math.max(0, needed - haveTotal);
        const daysRequired = existing.isTimegated && missing > 0
          ? Math.ceil(missing / (existing.timegateInfo?.dailyCap ?? 1))
          : 0;
        merged.set(mat.itemId, {
          ...existing,
          needed,
          haveTotal,
          missing,
          totalBuyCost: missing * existing.tpBuyPrice,
          daysRequired,
        });
      } else {
        merged.set(mat.itemId, {...mat});
      }
    }
  }

  const combined = [...merged.values()].sort((a, b) => {
    if (a.isTimegated !== b.isTimegated) return a.isTimegated ? -1 : 1;
    if (!!a.specialInfo !== !!b.specialInfo) return a.specialInfo ? -1 : 1;
    if (a.missing !== b.missing) return b.missing - a.missing;
    return a.name.localeCompare(b.name);
  });

  const totalCost = combined
    .filter(m => !m.isTimegated && !m.specialInfo)
    .reduce((s, m) => s + m.totalBuyCost, 0);

  const maxDays = combined
    .filter(m => m.isTimegated)
    .reduce((mx, m) => Math.max(mx, m.daysRequired), 0);

  const dataWarnings = [...new Set(plans.flatMap(p => p.dataWarnings))];
  return {plans, combined, totalCost, maxDays, dataWarnings};
}
