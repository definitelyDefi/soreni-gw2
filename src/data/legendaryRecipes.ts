// Hardcoded recipe data for items not accessible via the GW2 crafting API.
// This covers Gen 1 legendary weapons (Mystic Forge special recipes) and shared
// component gifts (Gift of Fortune, Gift of Mastery) which may not be returned
// by /v2/recipes/search.
//
// All item IDs verified against the GW2 API (api.guildwars2.com/v2/items)
// unless marked with "// ?"
//
// SYNTHETIC IDs (only used when real ID is unknown):
//   8_000_000 + legendaryId  →  precursor weapon (unknown real ID)

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface HardcodedIngredient {
  itemId: number;
  name: string;       // Fallback name if API doesn't know this item
  count: number;
  isLeaf?: boolean;   // If true, treat as a terminal node (don't recurse)
}

export interface HardcodedRecipe {
  outputItemId: number;
  name: string;
  type: 'MysticForge' | 'Crafting' | 'Vendor' | 'Achievement';
  outputCount: number;
  ingredients: HardcodedIngredient[];
  note?: string;
}

// ─── Synthetic ID helpers ─────────────────────────────────────────────────────

/** Synthetic ID for a precursor weapon with unknown real item ID. */
export function syntheticPrecursorId(legendaryId: number): number {
  return 8_000_000 + legendaryId;
}

export function isSyntheticItemId(itemId: number): boolean {
  return itemId >= 8_000_000;
}

// ─── Weapon gift info (for display / wiki links) ──────────────────────────────

export const WEAPON_GIFT_INFO: Record<number, {name: string; wikiSlug: string}> = {
  30684: {name: 'Gift of the Juggernaut',             wikiSlug: 'Gift_of_the_Juggernaut'},
  30685: {name: 'Gift of Kudzu',                       wikiSlug: 'Gift_of_Kudzu'},
  30686: {name: 'Gift of Meteorlogicus',               wikiSlug: 'Gift_of_Meteorlogicus'},
  30687: {name: 'Gift of Bolt',                        wikiSlug: 'Gift_of_Bolt'},
  30688: {name: 'Gift of the Predator',                wikiSlug: 'Gift_of_the_Predator'},
  30689: {name: 'Gift of Quip',                        wikiSlug: 'Gift_of_Quip'},
  30690: {name: 'Gift of Rodgort',                     wikiSlug: 'Gift_of_Rodgort'},
  30691: {name: 'Gift of the Bifrost',                 wikiSlug: 'Gift_of_the_Bifrost'},
  30692: {name: 'Gift of Incinerator',                 wikiSlug: 'Gift_of_Incinerator'},
  30693: {name: 'Gift of the Flameseeker Prophecies',  wikiSlug: 'Gift_of_the_Flameseeker_Prophecies'},
  30694: {name: 'Gift of Howler',                      wikiSlug: 'Gift_of_Howler'},
  30695: {name: 'Gift of Kraitkin',                    wikiSlug: 'Gift_of_Kraitkin'},
  30696: {name: 'Gift of Frostfang',                   wikiSlug: 'Gift_of_Frostfang'},
  30697: {name: 'Gift of Kamohoali\'i Kotaki',          wikiSlug: 'Gift_of_Kamohoali%27i_Kotaki'},
  30698: {name: 'Gift of the Dreamer',                 wikiSlug: 'Gift_of_the_Dreamer'},
  30699: {name: 'Gift of Twilight',                    wikiSlug: 'Gift_of_Twilight'},
  30700: {name: 'Gift of Frenzy',                      wikiSlug: 'Gift_of_Frenzy'},
  30701: {name: 'Gift of the Minstrel',                wikiSlug: 'Gift_of_the_Minstrel'},
  30703: {name: 'Gift of Sunrise',                     wikiSlug: 'Gift_of_Sunrise'},
};

// Real GW2 API item IDs for each weapon-specific gift, confirmed via API.
const WEAPON_GIFT_IDS: Record<number, number> = {
  30684: 19649, // Gift of the Juggernaut
  30685: 19644, // Gift of Kudzu
  30686: 19652, // Gift of Meteorlogicus
  30687: 19655, // Gift of Bolt
  30688: 19661, // Gift of the Predator
  30689: 19651, // Gift of Quip
  30690: 19656, // Gift of Rodgort
  30691: 19654, // Gift of the Bifrost
  30692: 19645, // Gift of Incinerator
  30693: 19653, // Gift of the Flameseeker Prophecies
  30694: 19662, // Gift of Howler
  30695: 19658, // Gift of Kraitkin
  30696: 19625, // Gift of Frostfang
  30697: 19657, // Gift of Kamohoali'i Kotaki
  30698: 19660, // Gift of the Dreamer
  30699: 19648, // Gift of Twilight
  30700: 19659, // Gift of Frenzy
  30701: 19646, // Gift of the Minstrel
  30703: 19647, // Gift of Sunrise
};

// ─── Precursor info (for display / wiki links on synthetic IDs) ───────────────

export const GEN1_PRECURSOR_INFO: Record<number, {name: string; wikiSlug: string}> = {
  30684: {name: 'The Colossus',        wikiSlug: 'The_Colossus_(hammer)'},
  30685: {name: 'Leaf of Kudzu',       wikiSlug: 'Leaf_of_Kudzu'},
  30686: {name: 'Storm',               wikiSlug: 'Storm_(scepter)'},
  30687: {name: 'Zap',                 wikiSlug: 'Zap_(sword)'},
  30688: {name: 'The Hunter',          wikiSlug: 'The_Hunter_(rifle)'},
  30689: {name: 'The Anomaly',         wikiSlug: 'The_Anomaly'},
  30690: {name: "Rodgort's Flame",     wikiSlug: 'Rodgort%27s_Flame'},
  30691: {name: 'The Legend',          wikiSlug: 'The_Legend_(staff)'},
  30692: {name: 'Venom',               wikiSlug: 'Venom_(dagger)'},
  30693: {name: 'The Chosen',          wikiSlug: 'The_Chosen_(shield)'},
  30694: {name: 'Howl',                wikiSlug: 'Howl_(warhorn)'},
  30695: {name: 'The Energizer',       wikiSlug: 'The_Energizer'},
  30696: {name: 'Chaos Gun',           wikiSlug: 'Chaos_Gun'},
  30697: {name: 'Carcharias',          wikiSlug: 'Carcharias'},
  30698: {name: 'The Lover',           wikiSlug: 'The_Lover'},
  30699: {name: 'Dusk',                wikiSlug: 'Dusk_(greatsword)'},
  30700: {name: 'Rage',                wikiSlug: 'Rage_(weapon)'},
  30701: {name: 'The Bard',            wikiSlug: 'The_Bard'},
  30703: {name: 'Dawn',                wikiSlug: 'Dawn_(greatsword)'},
};

export function getSyntheticItemInfo(itemId: number): {name: string; wikiSlug: string} | undefined {
  if (itemId >= 8_000_000 && itemId < 8_900_000) {
    return GEN1_PRECURSOR_INFO[itemId - 8_000_000];
  }
  return undefined;
}

// ─── Gen 1 precursor data ─────────────────────────────────────────────────────

interface PrecursorInfo {
  id: number;
  name: string;
  wikiSlug: string;
}

// All IDs confirmed from GW2 API unless marked // ?
const GEN1_PRECURSORS: Record<number, PrecursorInfo> = {
  30684: {id: 29170, name: 'The Colossus',       wikiSlug: 'The_Colossus_(hammer)'},
  30685: {id: 29172, name: 'Leaf of Kudzu',       wikiSlug: 'Leaf_of_Kudzu'},
  30686: {id: 29176, name: 'Storm',               wikiSlug: 'Storm_(scepter)'},
  30687: {id: 29181, name: 'Zap',                 wikiSlug: 'Zap_(sword)'},
  30688: {id: 29175, name: 'The Hunter',          wikiSlug: 'The_Hunter_(rifle)'},
  30689: {id: 31045, name: 'The Anomaly',         wikiSlug: 'The_Anomaly'},
  30690: {id: 29182, name: "Rodgort's Flame",     wikiSlug: 'Rodgort%27s_Flame'},
  30691: {id: 29180, name: 'The Legend',          wikiSlug: 'The_Legend_(staff)'},
  30692: {id: 29183, name: 'Venom',               wikiSlug: 'Venom_(dagger)'},
  30693: {id: 29177, name: 'The Chosen',          wikiSlug: 'The_Chosen_(shield)'},
  30694: {id: 29184, name: 'Howl',                wikiSlug: 'Howl_(warhorn)'},
  30695: {id: 29173, name: 'The Energizer',       wikiSlug: 'The_Energizer'},  // ?
  30696: {id: 29174, name: 'Chaos Gun',           wikiSlug: 'Chaos_Gun'},       // ?
  30697: {id: 29171, name: 'Carcharias',          wikiSlug: 'Carcharias'},      // wiki confirmed → Kotaki
  30698: {id: 29178, name: 'The Lover',           wikiSlug: 'The_Lover'},
  30699: {id: 29185, name: 'Dusk',                wikiSlug: 'Dusk_(greatsword)'},
  30700: {id: 29179, name: 'Rage',                wikiSlug: 'Rage_(weapon)'},
  30701: {id: 29168, name: 'The Bard',            wikiSlug: 'The_Bard'},
  30703: {id: 29169, name: 'Dawn',                wikiSlug: 'Dawn_(greatsword)'},
};

// ─── Verified item ID constants ───────────────────────────────────────────────

export const GW2_LEGENDARY_ITEM_IDS = {
  // Shared legendary gifts
  GIFT_OF_FORTUNE:     19626,
  GIFT_OF_MASTERY:     19674,
  GIFT_OF_MIGHT:       19672,
  GIFT_OF_MAGIC:       19673,

  // Gift of Fortune sub-components
  MYSTIC_CLOVER:       19675,
  GLOB_OF_ECTO:        19721,

  // Gift of Mastery sub-components
  GIFT_OF_EXPLORATION: 19677,
  GIFT_OF_BATTLE:      19678,
  BLOODSTONE_SHARD:    20797,
  OBSIDIAN_SHARD:      19925,

  // Eternity extra ingredients
  CRYSTALLINE_DUST:    24277,
  PHILOSOPHERS_STONE:  20796,
} as const;

// ─── Hardcoded Recipes ────────────────────────────────────────────────────────

function buildGen1LegendaryRecipes(): [number, HardcodedRecipe][] {
  const GEN1_IDS = [
    30684, 30685, 30686, 30687, 30688, 30689, 30690,
    30691, 30692, 30693, 30694, 30695, 30696, 30697,
    30698, 30699, 30700, 30701, 30703,
  ];

  return GEN1_IDS.map(id => {
    const precursor = GEN1_PRECURSORS[id];
    const giftInfo = WEAPON_GIFT_INFO[id];
    const giftId = WEAPON_GIFT_IDS[id];
    return [id, {
      outputItemId: id,
      name: `Gen 1 Legendary #${id}`,  // API will override with real name
      type: 'MysticForge' as const,
      outputCount: 1,
      note: 'Combine in Mystic Forge: Precursor + Gift of Fortune + Gift of Mastery + Weapon Gift',
      ingredients: [
        {itemId: precursor.id,                         name: precursor.name,    count: 1,   isLeaf: true},
        {itemId: GW2_LEGENDARY_ITEM_IDS.GIFT_OF_FORTUNE, name: 'Gift of Fortune', count: 1},
        {itemId: GW2_LEGENDARY_ITEM_IDS.GIFT_OF_MASTERY, name: 'Gift of Mastery', count: 1},
        {itemId: giftId,                               name: giftInfo.name,     count: 1,   isLeaf: true},
      ],
    } satisfies HardcodedRecipe];
  });
}

export const HARDCODED_RECIPES: Map<number, HardcodedRecipe> = new Map([

  // ── Gift of Fortune (ID 19626) ─────────────────────────────────────────────
  // Mystic Forge: 77 Mystic Clover + 250 Glob of Ecto + Gift of Might + Gift of Magic
  [GW2_LEGENDARY_ITEM_IDS.GIFT_OF_FORTUNE, {
    outputItemId: GW2_LEGENDARY_ITEM_IDS.GIFT_OF_FORTUNE,
    name: 'Gift of Fortune',
    type: 'MysticForge',
    outputCount: 1,
    ingredients: [
      {itemId: GW2_LEGENDARY_ITEM_IDS.MYSTIC_CLOVER,  name: 'Mystic Clover',     count: 77},
      {itemId: GW2_LEGENDARY_ITEM_IDS.GLOB_OF_ECTO,   name: 'Glob of Ectoplasm', count: 250},
      {itemId: GW2_LEGENDARY_ITEM_IDS.GIFT_OF_MIGHT,  name: 'Gift of Might',     count: 1},
      {itemId: GW2_LEGENDARY_ITEM_IDS.GIFT_OF_MAGIC,  name: 'Gift of Magic',     count: 1},
    ],
  }],

  // ── Gift of Mastery (ID 19674) ─────────────────────────────────────────────
  // Mystic Forge: Gift of Exploration + Gift of Battle + Bloodstone Shard + 250 Obsidian Shard
  [GW2_LEGENDARY_ITEM_IDS.GIFT_OF_MASTERY, {
    outputItemId: GW2_LEGENDARY_ITEM_IDS.GIFT_OF_MASTERY,
    name: 'Gift of Mastery',
    type: 'MysticForge',
    outputCount: 1,
    ingredients: [
      {itemId: GW2_LEGENDARY_ITEM_IDS.GIFT_OF_EXPLORATION, name: 'Gift of Exploration', count: 1},
      {itemId: GW2_LEGENDARY_ITEM_IDS.GIFT_OF_BATTLE,      name: 'Gift of Battle',      count: 1},
      {itemId: GW2_LEGENDARY_ITEM_IDS.BLOODSTONE_SHARD,    name: 'Bloodstone Shard',    count: 1, isLeaf: true},
      {itemId: GW2_LEGENDARY_ITEM_IDS.OBSIDIAN_SHARD,      name: 'Obsidian Shard',      count: 250},
    ],
  }],

  // ── Eternity (ID 30704) ────────────────────────────────────────────────────
  // Mystic Forge: Twilight + Sunrise + 5 Pile of Crystalline Dust + 10 Philosopher's Stone
  [30704, {
    outputItemId: 30704,
    name: 'Eternity',
    type: 'MysticForge',
    outputCount: 1,
    note: 'Combine in Mystic Forge: Twilight + Sunrise + Crystalline Dust + Philosopher\'s Stone',
    ingredients: [
      {itemId: 30699, name: 'Twilight',                count: 1},
      {itemId: 30703, name: 'Sunrise',                 count: 1},
      {itemId: GW2_LEGENDARY_ITEM_IDS.CRYSTALLINE_DUST,   name: 'Pile of Crystalline Dust', count: 5,  isLeaf: true},
      {itemId: GW2_LEGENDARY_ITEM_IDS.PHILOSOPHERS_STONE, name: "Philosopher's Stone",       count: 10, isLeaf: true},
    ],
  }],

  // ── Gen 1 Legendary Weapon Recipes ─────────────────────────────────────────
  ...buildGen1LegendaryRecipes(),
]);
