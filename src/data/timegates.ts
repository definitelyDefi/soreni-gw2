export interface TimegateInfo {
  itemId: number;
  name: string;
  dailyCap: number;     // max craftable per day
  source: string;       // where it comes from
  farmingTip: string;
  wikiSlug: string;
}

export interface SpecialAcquisition {
  source: string;
  shortNote: string;
  fullNote: string;
  wikiSlug: string;
  isWvW?: boolean;
  isRng?: boolean;
  isMapCompletion?: boolean;
}

// ─── Timegated crafted materials ──────────────────────────────────────────────
// These have a 1-per-day crafting cap via cooking/crafting disciplines.

export const TIMEGATED_ITEMS: Record<number, TimegateInfo> = {
  // Pre-HoT daily refinement (Huntsman/Weaponsmith/Artificer/etc. 500)
  46731: {
    itemId: 46731, name: 'Bloodstone Brick', dailyCap: 1,
    source: 'Artificer / Scribe 500 (daily limit)',
    farmingTip: 'Craft 1 per day from Bloodstone Dust × 100 + Thermocatalytic Reagent × 1. Dust drops from champions, world bosses, and fractals. Store surplus dust.',
    wikiSlug: 'Bloodstone_Brick',
  },
  46733: {
    itemId: 46733, name: 'Dragonite Ingot', dailyCap: 1,
    source: 'Weaponsmith / Armorsmith / Leatherworker 500 (daily limit)',
    farmingTip: 'Craft 1 per day from Dragonite Ore × 100 + Thermocatalytic Reagent. Farm ore from world bosses (Tequatl, triple wurm) and Dragon meta chains.',
    wikiSlug: 'Dragonite_Ingot',
  },
  46735: {
    itemId: 46735, name: 'Empyreal Star', dailyCap: 1,
    source: 'Huntsman / Tailor / Cook 500 (daily limit)',
    farmingTip: 'Craft 1 per day from Empyreal Fragments × 100 + Thermocatalytic Reagent. Farm fragments from fractals, Silverwastes chests, and SW/Dry Top events.',
    wikiSlug: 'Empyreal_Star',
  },
  46740: {
    itemId: 46740, name: 'Deldrimor Steel Ingot', dailyCap: 1,
    source: 'Weaponsmith / Armorsmith 500 (daily limit)',
    farmingTip: 'Craft 1 per day from Mithril Ore × 2 + Dark Energy × 1 + Thermocatalytic Reagent. Buy Mithril from TP or mine in high-level zones.',
    wikiSlug: 'Deldrimor_Steel_Ingot',
  },
  46742: {
    itemId: 46742, name: 'Elonian Leather Square', dailyCap: 1,
    source: 'Leatherworker 500 (daily limit)',
    farmingTip: 'Craft 1 per day from Hardened Leather Section × 2 + Dark Energy × 1 + Thermocatalytic Reagent. Buy Hardened Leather from TP.',
    wikiSlug: 'Elonian_Leather_Square',
  },
  46744: {
    itemId: 46744, name: 'Spiritwood Plank', dailyCap: 1,
    source: 'Huntsman / Artificer 500 (daily limit)',
    farmingTip: 'Craft 1 per day from Ancient Wood Log × 2 + Dark Energy × 1 + Thermocatalytic Reagent. Buy Ancient Wood from TP or chop in Orr.',
    wikiSlug: 'Spiritwood_Plank',
  },
  46746: {
    itemId: 46746, name: 'Damask Patch', dailyCap: 1,
    source: 'Tailor 500 (daily limit)',
    farmingTip: 'Craft 1 per day from Gossamer Scrap × 2 + Dark Energy × 1 + Thermocatalytic Reagent. Buy Gossamer from TP.',
    wikiSlug: 'Damask_Patch',
  },
  // HoT daily refinement (Scribe / from HoT metas)
  69434: {
    itemId: 69434, name: 'Glob of Elder Spirit Residue', dailyCap: 3,
    source: 'Heart of Thorns meta events (3/day cap)',
    farmingTip: 'Obtain from HoT meta event chests: Verdant Brink Night, Auric Basin Octovine, Tangled Depths, Dragon Stand. Up to 3 per day total.',
    wikiSlug: 'Glob_of_Elder_Spirit_Residue',
  },
  // Daily charge
  43772: {
    itemId: 43772, name: 'Charged Quartz Crystal', dailyCap: 1,
    source: 'Artificer (charge 1 Quartz Crystal per day)',
    farmingTip: 'Craft by charging 1 Quartz Crystal per day in sunlight. Quartz Crystals drop throughout Tyria.',
    wikiSlug: 'Charged_Quartz_Crystal',
  },
};

// ─── Special acquisition items ────────────────────────────────────────────────
// Stop recipe recursion here; these are obtained via non-standard methods.

export const SPECIAL_ACQUISITION: Record<number, SpecialAcquisition> = {
  // Mystic Forge RNG
  19675: {
    source: 'Mystic Forge (33% chance)',
    shortNote: '~33% chance per attempt',
    fullNote: 'Combine 3 Glob of Ectoplasm + 3 Obsidian Shard + 3 Philosopher\'s Stone + 3 T6 Fine Material in the Mystic Forge. Average ~3 clovers per 10-material attempt. Need 77 clovers for Gift of Fortune → budget ~330 ecto + 330 shards + 1100 Philosopher\'s Stones.',
    wikiSlug: 'Mystic_Clover',
    isRng: true,
  },
  // Karma vendor — Obsidian Shard (confirmed GW2 API ID 19925)
  19925: {
    source: 'Karma Vendor (3,000 karma each)',
    shortNote: 'Buy with karma from Pact Supply Network Agent or Orr temples',
    fullNote: 'Buy Obsidian Shards from the Master of Karma in Lion\'s Arch or Pact Supply Network agents for 3,000 karma each. Earn karma from meta events, story missions, and daily achievements.',
    wikiSlug: 'Obsidian_Shard',
  },
  // WvW Reward Track — Gift of Battle (confirmed GW2 API ID 19678)
  19678: {
    source: 'WvW Reward Track: Gift of Battle',
    shortNote: 'Complete the Gift of Battle WvW reward track',
    fullNote: 'Complete the "Gift of Battle" reward track in World vs World. Takes roughly 8–12 hours of active WvW participation. Apply Reward Track Potions or Boosters to speed it up significantly.',
    wikiSlug: 'Gift_of_Battle',
    isWvW: true,
  },
  // Map completion — Gift of Exploration (confirmed GW2 API ID 19677)
  19677: {
    source: 'Map Completion (100% World Completion)',
    shortNote: 'Complete all POIs, waypoints, vistas & hero challenges on a character',
    fullNote: 'Requires 100% core Tyria map completion on any character (all waypoints, POIs, vistas, and hero challenges). Roughly 15–30 hours for a new character depending on experience.',
    wikiSlug: 'Gift_of_Exploration',
    isMapCompletion: true,
  },
  // Gift of Magic / Might  (from Mystic Forge with T6 mats)
  // Leave these to the recipe tree resolution
};

// Item IDs where we should stop recursion entirely
export const LEAF_ITEM_IDS = new Set<number>([
  ...Object.keys(TIMEGATED_ITEMS).map(Number),
  ...Object.keys(SPECIAL_ACQUISITION).map(Number),
  // Common base materials we don't need to recurse into
  19721, // Glob of Ectoplasm
  24356, // Ancient Bone
  24355, // Large Bone
  24354, // Bone Shard
  24353, // Bone
  24352, // Bone Chip
  24358, // Vicious Claw
  24357, // Large Claw
  24351, // Claw
  24350, // Sharp Claw
  24349, // Small Claw
  24361, // Vicious Fang
  24360, // Large Fang
  24359, // Fang
  24348, // Sharp Fang
  24347, // Small Fang
  24364, // Powerful Venom Sac
  24363, // Full Venom Sac
  24362, // Venom Sac
  24346, // Venom Sac (alt)
  24345, // Small Venom Sac
  24368, // Intricate Totem
  24367, // Elaborate Totem
  24366, // Engraved Totem
  24365, // Totemic Infusion
  24344, // Soft Totem
  24371, // Powerful Blood
  24370, // Potent Blood
  24369, // Thick Blood
  24343, // Blood
  24342, // Tiny Blood Cell
  76839, // Pile of Crystalline Dust (T6)
  24277, // Pile of Incandescent Dust (T5)
  24276, // Pile of Luminous Dust
  // Currency / misc items we never want to recurse into
  19976, // Mystic Coin
  20796, // Philosopher's Stone
]);

// ─── Farming guide tips for common materials ─────────────────────────────────

export const FARMING_TIPS: Record<number, {tip: string; wikiSlug: string}> = {
  19721: {
    tip: 'Salvage rare (yellow) items level 68+ with a Master\'s or Mystic Salvage Kit. Buy cheap yellows from the TP for ~50s each.',
    wikiSlug: 'Glob_of_Ectoplasm',
  },
  24356: {tip: 'Farm from Risen enemies in Orr (Cursed Shore, Malchor\'s Leap). T6 bones drop from champions and events.', wikiSlug: 'Ancient_Bone'},
  24358: {tip: 'Farm from harpies, wyverns, and eagle-type enemies in high-level zones. Dry Top and Silverwastes drop T5-T6 claws.', wikiSlug: 'Vicious_Claw'},
  24361: {tip: 'Farm from krait and shark enemies in Orr or Frostgorge Sound. World bosses also drop T6 fangs.', wikiSlug: 'Vicious_Fang'},
  24364: {tip: 'Farm from spider and insect enemies in Orr. The Cursed Shore spiders and catacombs events are good sources.', wikiSlug: 'Powerful_Venom_Sac'},
  24368: {tip: 'Farm from dredge, Inquest, and golem-type enemies. Diessa Plateau and Iron Marches have good dredge camps.', wikiSlug: 'Intricate_Totem'},
  24371: {tip: 'Farm from Risen and undead enemies in Orr. Blood drops from a wide variety of enemies; Cursed Shore events are efficient.', wikiSlug: 'Powerful_Blood'},
  76839: {tip: 'Farm from Risen in Orr or buy from TP. Crystal Dust drops from undead at higher rates.', wikiSlug: 'Pile_of_Crystalline_Dust'},
};
