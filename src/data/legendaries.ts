export interface LegendaryEntry {
  id: number;
  name: string;
  type: 'weapon' | 'armor' | 'trinket' | 'back';
  weaponType?: string;
  slot?: string;                          // armor: Helm|Shoulders|Chest|Gloves|Legs|Boots; trinket: Ring|Accessory|Amulet
  armorWeight?: 'Heavy' | 'Medium' | 'Light';
  armorSet?: string;                      // e.g. 'Perfected Envoy', "Triumphant Hero's"
  generation: 1 | 2 | 3;
  wikiSlug: string;
}

export const LEGENDARIES: LegendaryEntry[] = [

  // ─── Generation 1 Weapons ────────────────────────────────────────────────────
  // Original legendary weapons (2012–2015), crafted via Mystic Forge collections
  {id: 30684, name: 'The Juggernaut',            type: 'weapon', weaponType: 'Hammer',     generation: 1, wikiSlug: 'The_Juggernaut'},
  {id: 30685, name: 'Kudzu',                      type: 'weapon', weaponType: 'Longbow',    generation: 1, wikiSlug: 'Kudzu'},
  {id: 30686, name: 'Meteorlogicus',              type: 'weapon', weaponType: 'Scepter',    generation: 1, wikiSlug: 'Meteorlogicus'},
  {id: 30687, name: 'Bolt',                       type: 'weapon', weaponType: 'Sword',      generation: 1, wikiSlug: 'Bolt'},
  {id: 30688, name: 'The Predator',               type: 'weapon', weaponType: 'Rifle',      generation: 1, wikiSlug: 'The_Predator'},
  {id: 30689, name: 'Quip',                       type: 'weapon', weaponType: 'Pistol',     generation: 1, wikiSlug: 'Quip'},
  {id: 30690, name: 'Rodgort',                    type: 'weapon', weaponType: 'Torch',      generation: 1, wikiSlug: 'Rodgort'},
  {id: 30691, name: 'The Bifrost',                type: 'weapon', weaponType: 'Staff',      generation: 1, wikiSlug: 'The_Bifrost'},
  {id: 30692, name: 'Incinerator',                type: 'weapon', weaponType: 'Dagger',     generation: 1, wikiSlug: 'Incinerator'},
  {id: 30693, name: 'The Flameseeker Prophecies', type: 'weapon', weaponType: 'Shield',     generation: 1, wikiSlug: 'The_Flameseeker_Prophecies'},
  {id: 30694, name: 'Howler',                     type: 'weapon', weaponType: 'Warhorn',    generation: 1, wikiSlug: 'Howler'},
  {id: 30695, name: 'Kraitkin',                   type: 'weapon', weaponType: 'Trident',    generation: 1, wikiSlug: 'Kraitkin'},
  {id: 30696, name: 'Frostfang',                  type: 'weapon', weaponType: 'Axe',        generation: 1, wikiSlug: 'Frostfang'},
  {id: 30697, name: "Kamohoali'i Kotaki",         type: 'weapon', weaponType: 'Spear',      generation: 1, wikiSlug: "Kamohoali%27i_Kotaki"},
  {id: 30698, name: 'The Dreamer',                type: 'weapon', weaponType: 'Shortbow',   generation: 1, wikiSlug: 'The_Dreamer'},
  {id: 30699, name: 'Twilight',                   type: 'weapon', weaponType: 'Greatsword', generation: 1, wikiSlug: 'Twilight'},
  {id: 30700, name: 'Frenzy',                     type: 'weapon', weaponType: 'Mace',       generation: 1, wikiSlug: 'Frenzy'},
  {id: 30701, name: 'The Minstrel',               type: 'weapon', weaponType: 'Focus',      generation: 1, wikiSlug: 'The_Minstrel'},
  {id: 30703, name: 'Sunrise',                    type: 'weapon', weaponType: 'Greatsword', generation: 1, wikiSlug: 'Sunrise'},
  {id: 30704, name: 'Eternity',                   type: 'weapon', weaponType: 'Greatsword', generation: 1, wikiSlug: 'Eternity'},

  // ─── Generation 2 Weapons ────────────────────────────────────────────────────
  // HoT/PoF/LS era (2015–2019), collection achievement-based
  {id: 71766, name: 'The Shining Blade',          type: 'weapon', weaponType: 'Sword',      generation: 2, wikiSlug: 'The_Shining_Blade'},
  {id: 74155, name: 'Astralaria',                 type: 'weapon', weaponType: 'Axe',        generation: 2, wikiSlug: 'Astralaria'},
  {id: 74286, name: 'Nevermore',                  type: 'weapon', weaponType: 'Staff',      generation: 2, wikiSlug: 'Nevermore'},
  {id: 74412, name: 'Caladbolg',                  type: 'weapon', weaponType: 'Sword',      generation: 2, wikiSlug: 'Caladbolg'},
  {id: 76158, name: 'Chuka and Champawat',        type: 'weapon', weaponType: 'Shortbow',   generation: 2, wikiSlug: 'Chuka_and_Champawat'},
  {id: 76292, name: 'Exordium',                   type: 'weapon', weaponType: 'Greatsword', generation: 2, wikiSlug: 'Exordium'},
  {id: 76368, name: 'The Moot',                   type: 'weapon', weaponType: 'Mace',       generation: 2, wikiSlug: 'The_Moot'},
  {id: 76393, name: 'H.O.P.E.',                   type: 'weapon', weaponType: 'Pistol',     generation: 2, wikiSlug: 'HOPE'},
  {id: 77705, name: 'Eureka',                     type: 'weapon', weaponType: 'Hammer',     generation: 2, wikiSlug: 'Eureka'},
  {id: 80634, name: 'Shooshadoo',                 type: 'weapon', weaponType: 'Warhorn',    generation: 2, wikiSlug: 'Shooshadoo'},
  {id: 80516, name: 'Xiuquatl',                   type: 'weapon', weaponType: 'Torch',      generation: 2, wikiSlug: 'Xiuquatl'},
  {id: 80583, name: 'Viper',                      type: 'weapon', weaponType: 'Dagger',     generation: 2, wikiSlug: 'Viper'},

  // ─── Generation 3 Weapons — Aurene Set (EoD) ─────────────────────────────────
  // End of Dragons (2022), Prismatic dragon weapons, collection-based
  {id: 95612, name: "Aurene's Argument",          type: 'weapon', weaponType: 'Pistol',     generation: 3, wikiSlug: "Aurene%27s_Argument"},
  {id: 95672, name: "Aurene's Bite",              type: 'weapon', weaponType: 'Axe',        generation: 3, wikiSlug: "Aurene%27s_Bite"},
  {id: 95696, name: "Aurene's Scale",             type: 'weapon', weaponType: 'Shortbow',   generation: 3, wikiSlug: "Aurene%27s_Scale"},
  {id: 96028, name: "Aurene's Rending",           type: 'weapon', weaponType: 'Greatsword', generation: 3, wikiSlug: "Aurene%27s_Rending"},
  {id: 96115, name: "Aurene's Crest",             type: 'weapon', weaponType: 'Focus',      generation: 3, wikiSlug: "Aurene%27s_Crest"},
  {id: 96203, name: "Aurene's Gaze",              type: 'weapon', weaponType: 'Scepter',    generation: 3, wikiSlug: "Aurene%27s_Gaze"},
  {id: 96221, name: "Aurene's Claw",              type: 'weapon', weaponType: 'Dagger',     generation: 3, wikiSlug: "Aurene%27s_Claw"},
  {id: 96356, name: "Aurene's Persuasion",        type: 'weapon', weaponType: 'Shield',     generation: 3, wikiSlug: "Aurene%27s_Persuasion"},
  {id: 96499, name: "Aurene's Tail",              type: 'weapon', weaponType: 'Longbow',    generation: 3, wikiSlug: "Aurene%27s_Tail"},
  {id: 96662, name: "Aurene's Voice",             type: 'weapon', weaponType: 'Warhorn',    generation: 3, wikiSlug: "Aurene%27s_Voice"},
  {id: 96785, name: "Aurene's Torch",             type: 'weapon', weaponType: 'Torch',      generation: 3, wikiSlug: "Aurene%27s_Torch"},
  {id: 96937, name: "Aurene's Fang",              type: 'weapon', weaponType: 'Sword',      generation: 3, wikiSlug: "Aurene%27s_Fang"},
  {id: 97165, name: "Aurene's Eruption",          type: 'weapon', weaponType: 'Hammer',     generation: 3, wikiSlug: "Aurene%27s_Eruption"},
  {id: 97267, name: "Aurene's Razor",             type: 'weapon', weaponType: 'Mace',       generation: 3, wikiSlug: "Aurene%27s_Razor"},
  {id: 97783, name: "Aurene's Insight",           type: 'weapon', weaponType: 'Staff',      generation: 3, wikiSlug: "Aurene%27s_Insight"},
  {id: 97943, name: "Aurene's Wing",              type: 'weapon', weaponType: 'Rifle',      generation: 3, wikiSlug: "Aurene%27s_Wing"},

  // ─── Legendary Back Items ─────────────────────────────────────────────────────
  {id: 77474, name: 'Ad Infinitum',               type: 'back',   generation: 2, wikiSlug: 'Ad_Infinitum'},
  {id: 81908, name: 'The Ascension',              type: 'back',   generation: 2, wikiSlug: 'The_Ascension'},
  {id: 81916, name: 'Warbringer',                 type: 'back',   generation: 2, wikiSlug: 'Warbringer'},

  // ─── Legendary Trinkets — Rings ───────────────────────────────────────────────
  {id: 79895, name: 'Aurora',     type: 'trinket', slot: 'Ring', generation: 2, wikiSlug: 'Aurora'},
  {id: 89897, name: 'Vision',     type: 'trinket', slot: 'Ring', generation: 2, wikiSlug: 'Vision'},
  {id: 91327, name: 'Coalescence',type: 'trinket', slot: 'Ring', generation: 2, wikiSlug: 'Coalescence'},
  {id: 93781, name: 'Conflux',    type: 'trinket', slot: 'Ring', generation: 3, wikiSlug: 'Conflux'},

  // ─── Legendary Armor — Perfected Envoy (Raid) ────────────────────────────────
  // Introduced with Heart of Thorns raids (2015). Requires Legendary Insights.
  {id: 80254, name: 'Perfected Envoy Regalia',        type: 'armor', slot: 'Helm',      armorWeight: 'Light',  armorSet: 'Perfected Envoy', generation: 2, wikiSlug: 'Perfected_Envoy_Regalia_(headgear)'},
  {id: 80296, name: 'Perfected Envoy Epaulets',       type: 'armor', slot: 'Shoulders', armorWeight: 'Light',  armorSet: 'Perfected Envoy', generation: 2, wikiSlug: 'Perfected_Envoy_Epaulets'},
  {id: 80248, name: 'Perfected Envoy Vestments',      type: 'armor', slot: 'Chest',     armorWeight: 'Light',  armorSet: 'Perfected Envoy', generation: 2, wikiSlug: 'Perfected_Envoy_Vestments_(coat)'},
  {id: 80131, name: 'Perfected Envoy Gloves',         type: 'armor', slot: 'Gloves',    armorWeight: 'Light',  armorSet: 'Perfected Envoy', generation: 2, wikiSlug: 'Perfected_Envoy_Gloves_(light)'},
  {id: 80190, name: 'Perfected Envoy Pants',          type: 'armor', slot: 'Legs',      armorWeight: 'Light',  armorSet: 'Perfected Envoy', generation: 2, wikiSlug: 'Perfected_Envoy_Pants'},
  {id: 80111, name: 'Perfected Envoy Shoes',          type: 'armor', slot: 'Boots',     armorWeight: 'Light',  armorSet: 'Perfected Envoy', generation: 2, wikiSlug: 'Perfected_Envoy_Shoes'},

  {id: 80557, name: 'Perfected Envoy Mask',           type: 'armor', slot: 'Helm',      armorWeight: 'Medium', armorSet: 'Perfected Envoy', generation: 2, wikiSlug: 'Perfected_Envoy_Mask'},
  {id: 80578, name: 'Perfected Envoy Shoulderpads',   type: 'armor', slot: 'Shoulders', armorWeight: 'Medium', armorSet: 'Perfected Envoy', generation: 2, wikiSlug: 'Perfected_Envoy_Shoulderpads'},
  {id: 80145, name: 'Perfected Envoy Coat',           type: 'armor', slot: 'Chest',     armorWeight: 'Medium', armorSet: 'Perfected Envoy', generation: 2, wikiSlug: 'Perfected_Envoy_Coat'},
  {id: 80161, name: 'Perfected Envoy Gloves',         type: 'armor', slot: 'Gloves',    armorWeight: 'Medium', armorSet: 'Perfected Envoy', generation: 2, wikiSlug: 'Perfected_Envoy_Gloves_(medium)'},
  {id: 80270, name: 'Perfected Envoy Leggings',       type: 'armor', slot: 'Legs',      armorWeight: 'Medium', armorSet: 'Perfected Envoy', generation: 2, wikiSlug: 'Perfected_Envoy_Leggings'},
  {id: 80200, name: 'Perfected Envoy Boots',          type: 'armor', slot: 'Boots',     armorWeight: 'Medium', armorSet: 'Perfected Envoy', generation: 2, wikiSlug: 'Perfected_Envoy_Boots_(medium)'},

  {id: 80384, name: 'Perfected Envoy Helm',           type: 'armor', slot: 'Helm',      armorWeight: 'Heavy',  armorSet: 'Perfected Envoy', generation: 2, wikiSlug: 'Perfected_Envoy_Helm'},
  {id: 80435, name: 'Perfected Envoy Pauldrons',      type: 'armor', slot: 'Shoulders', armorWeight: 'Heavy',  armorSet: 'Perfected Envoy', generation: 2, wikiSlug: 'Perfected_Envoy_Pauldrons'},
  {id: 80576, name: 'Perfected Envoy Breastplate',    type: 'armor', slot: 'Chest',     armorWeight: 'Heavy',  armorSet: 'Perfected Envoy', generation: 2, wikiSlug: 'Perfected_Envoy_Breastplate'},
  {id: 80508, name: 'Perfected Envoy Gauntlets',      type: 'armor', slot: 'Gloves',    armorWeight: 'Heavy',  armorSet: 'Perfected Envoy', generation: 2, wikiSlug: 'Perfected_Envoy_Gauntlets'},
  {id: 80517, name: 'Perfected Envoy Tassets',        type: 'armor', slot: 'Legs',      armorWeight: 'Heavy',  armorSet: 'Perfected Envoy', generation: 2, wikiSlug: 'Perfected_Envoy_Tassets'},
  {id: 80398, name: 'Perfected Envoy Greaves',        type: 'armor', slot: 'Boots',     armorWeight: 'Heavy',  armorSet: 'Perfected Envoy', generation: 2, wikiSlug: 'Perfected_Envoy_Greaves'},

  // ─── Legendary Armor — Triumphant Hero's (WvW) ────────────────────────────────
  // Purchased with WvW Skirmish Claim Tickets + Legendary Shards.
  {id: 81938, name: "Triumphant Hero's Regalia",      type: 'armor', slot: 'Helm',      armorWeight: 'Light',  armorSet: "Triumphant Hero's", generation: 2, wikiSlug: "Triumphant_Hero%27s_Regalia_(headgear)"},
  {id: 81957, name: "Triumphant Hero's Epaulets",     type: 'armor', slot: 'Shoulders', armorWeight: 'Light',  armorSet: "Triumphant Hero's", generation: 2, wikiSlug: "Triumphant_Hero%27s_Epaulets"},
  {id: 82002, name: "Triumphant Hero's Vestments",    type: 'armor', slot: 'Chest',     armorWeight: 'Light',  armorSet: "Triumphant Hero's", generation: 2, wikiSlug: "Triumphant_Hero%27s_Vestments_(coat)"},
  {id: 81962, name: "Triumphant Hero's Gloves",       type: 'armor', slot: 'Gloves',    armorWeight: 'Light',  armorSet: "Triumphant Hero's", generation: 2, wikiSlug: "Triumphant_Hero%27s_Gloves_(light)"},
  {id: 81987, name: "Triumphant Hero's Pants",        type: 'armor', slot: 'Legs',      armorWeight: 'Light',  armorSet: "Triumphant Hero's", generation: 2, wikiSlug: "Triumphant_Hero%27s_Pants"},
  {id: 81944, name: "Triumphant Hero's Shoes",        type: 'armor', slot: 'Boots',     armorWeight: 'Light',  armorSet: "Triumphant Hero's", generation: 2, wikiSlug: "Triumphant_Hero%27s_Shoes"},

  {id: 82031, name: "Triumphant Hero's Mask",         type: 'armor', slot: 'Helm',      armorWeight: 'Medium', armorSet: "Triumphant Hero's", generation: 2, wikiSlug: "Triumphant_Hero%27s_Mask"},
  {id: 81893, name: "Triumphant Hero's Shoulderpads", type: 'armor', slot: 'Shoulders', armorWeight: 'Medium', armorSet: "Triumphant Hero's", generation: 2, wikiSlug: "Triumphant_Hero%27s_Shoulderpads"},
  {id: 82060, name: "Triumphant Hero's Coat",         type: 'armor', slot: 'Chest',     armorWeight: 'Medium', armorSet: "Triumphant Hero's", generation: 2, wikiSlug: "Triumphant_Hero%27s_Coat"},
  {id: 81887, name: "Triumphant Hero's Gloves",       type: 'armor', slot: 'Gloves',    armorWeight: 'Medium', armorSet: "Triumphant Hero's", generation: 2, wikiSlug: "Triumphant_Hero%27s_Gloves_(medium)"},
  {id: 81889, name: "Triumphant Hero's Leggings",     type: 'armor', slot: 'Legs',      armorWeight: 'Medium', armorSet: "Triumphant Hero's", generation: 2, wikiSlug: "Triumphant_Hero%27s_Leggings"},
  {id: 81897, name: "Triumphant Hero's Boots",        type: 'armor', slot: 'Boots',     armorWeight: 'Medium', armorSet: "Triumphant Hero's", generation: 2, wikiSlug: "Triumphant_Hero%27s_Boots_(medium)"},

  {id: 81964, name: "Triumphant Hero's Helm",         type: 'armor', slot: 'Helm',      armorWeight: 'Heavy',  armorSet: "Triumphant Hero's", generation: 2, wikiSlug: "Triumphant_Hero%27s_Helm"},
  {id: 82132, name: "Triumphant Hero's Pauldrons",    type: 'armor', slot: 'Shoulders', armorWeight: 'Heavy',  armorSet: "Triumphant Hero's", generation: 2, wikiSlug: "Triumphant_Hero%27s_Pauldrons"},
  {id: 82080, name: "Triumphant Hero's Breastplate",  type: 'armor', slot: 'Chest',     armorWeight: 'Heavy',  armorSet: "Triumphant Hero's", generation: 2, wikiSlug: "Triumphant_Hero%27s_Breastplate"},
  {id: 82084, name: "Triumphant Hero's Gauntlets",    type: 'armor', slot: 'Gloves',    armorWeight: 'Heavy',  armorSet: "Triumphant Hero's", generation: 2, wikiSlug: "Triumphant_Hero%27s_Gauntlets"},
  {id: 82107, name: "Triumphant Hero's Tassets",      type: 'armor', slot: 'Legs',      armorWeight: 'Heavy',  armorSet: "Triumphant Hero's", generation: 2, wikiSlug: "Triumphant_Hero%27s_Tassets"},
  {id: 82108, name: "Triumphant Hero's Greaves",      type: 'armor', slot: 'Boots',     armorWeight: 'Heavy',  armorSet: "Triumphant Hero's", generation: 2, wikiSlug: "Triumphant_Hero%27s_Greaves"},

  // ─── Legendary Armor — Glorious Hero's (PvP) ─────────────────────────────────
  // Purchased with Legendary Shards from PvP League Vendor.
  {id: 80299, name: "Glorious Hero's Regalia",        type: 'armor', slot: 'Helm',      armorWeight: 'Light',  armorSet: "Glorious Hero's", generation: 2, wikiSlug: "Glorious_Hero%27s_Regalia_(headgear)"},
  {id: 80281, name: "Glorious Hero's Epaulets",       type: 'armor', slot: 'Shoulders', armorWeight: 'Light',  armorSet: "Glorious Hero's", generation: 2, wikiSlug: "Glorious_Hero%27s_Epaulets"},
  {id: 80553, name: "Glorious Hero's Vestments",      type: 'armor', slot: 'Chest',     armorWeight: 'Light',  armorSet: "Glorious Hero's", generation: 2, wikiSlug: "Glorious_Hero%27s_Vestments_(coat)"},
  {id: 80218, name: "Glorious Hero's Gloves",         type: 'armor', slot: 'Gloves',    armorWeight: 'Light',  armorSet: "Glorious Hero's", generation: 2, wikiSlug: "Glorious_Hero%27s_Gloves_(light)"},
  {id: 80241, name: "Glorious Hero's Pants",          type: 'armor', slot: 'Legs',      armorWeight: 'Light',  armorSet: "Glorious Hero's", generation: 2, wikiSlug: "Glorious_Hero%27s_Pants"},
  {id: 80542, name: "Glorious Hero's Shoes",          type: 'armor', slot: 'Boots',     armorWeight: 'Light',  armorSet: "Glorious Hero's", generation: 2, wikiSlug: "Glorious_Hero%27s_Shoes"},

  {id: 80312, name: "Glorious Hero's Mask",           type: 'armor', slot: 'Helm',      armorWeight: 'Medium', armorSet: "Glorious Hero's", generation: 2, wikiSlug: "Glorious_Hero%27s_Mask"},
  {id: 80243, name: "Glorious Hero's Shoulderpads",   type: 'armor', slot: 'Shoulders', armorWeight: 'Medium', armorSet: "Glorious Hero's", generation: 2, wikiSlug: "Glorious_Hero%27s_Shoulderpads"},
  {id: 80334, name: "Glorious Hero's Coat",           type: 'armor', slot: 'Chest',     armorWeight: 'Medium', armorSet: "Glorious Hero's", generation: 2, wikiSlug: "Glorious_Hero%27s_Coat"},
  {id: 80275, name: "Glorious Hero's Gloves",         type: 'armor', slot: 'Gloves',    armorWeight: 'Medium', armorSet: "Glorious Hero's", generation: 2, wikiSlug: "Glorious_Hero%27s_Gloves_(medium)"},
  {id: 80262, name: "Glorious Hero's Leggings",       type: 'armor', slot: 'Legs',      armorWeight: 'Medium', armorSet: "Glorious Hero's", generation: 2, wikiSlug: "Glorious_Hero%27s_Leggings"},
  {id: 80337, name: "Glorious Hero's Boots",          type: 'armor', slot: 'Boots',     armorWeight: 'Medium', armorSet: "Glorious Hero's", generation: 2, wikiSlug: "Glorious_Hero%27s_Boots_(medium)"},

  {id: 80345, name: "Glorious Hero's Helm",           type: 'armor', slot: 'Helm',      armorWeight: 'Heavy',  armorSet: "Glorious Hero's", generation: 2, wikiSlug: "Glorious_Hero%27s_Helm"},
  {id: 80210, name: "Glorious Hero's Pauldrons",      type: 'armor', slot: 'Shoulders', armorWeight: 'Heavy',  armorSet: "Glorious Hero's", generation: 2, wikiSlug: "Glorious_Hero%27s_Pauldrons"},
  {id: 80356, name: "Glorious Hero's Breastplate",    type: 'armor', slot: 'Chest',     armorWeight: 'Heavy',  armorSet: "Glorious Hero's", generation: 2, wikiSlug: "Glorious_Hero%27s_Breastplate"},
  {id: 80392, name: "Glorious Hero's Gauntlets",      type: 'armor', slot: 'Gloves',    armorWeight: 'Heavy',  armorSet: "Glorious Hero's", generation: 2, wikiSlug: "Glorious_Hero%27s_Gauntlets"},
  {id: 80230, name: "Glorious Hero's Tassets",        type: 'armor', slot: 'Legs',      armorWeight: 'Heavy',  armorSet: "Glorious Hero's", generation: 2, wikiSlug: "Glorious_Hero%27s_Tassets"},
  {id: 80319, name: "Glorious Hero's Greaves",        type: 'armor', slot: 'Boots',     armorWeight: 'Heavy',  armorSet: "Glorious Hero's", generation: 2, wikiSlug: "Glorious_Hero%27s_Greaves"},

  // ─── Legendary Armor — Obsidian (Secrets of the Obscure) ─────────────────────
  // Introduced with SotO (2023). Crafted with Antique Summoning Stones.
  {id: 100947, name: 'Obsidian Hat',                  type: 'armor', slot: 'Helm',      armorWeight: 'Light',  armorSet: 'Obsidian', generation: 3, wikiSlug: 'Obsidian_Hat'},
  {id: 100887, name: 'Obsidian Epaulets',             type: 'armor', slot: 'Shoulders', armorWeight: 'Light',  armorSet: 'Obsidian', generation: 3, wikiSlug: 'Obsidian_Epaulets'},
  {id: 101006, name: 'Obsidian Vestments',            type: 'armor', slot: 'Chest',     armorWeight: 'Light',  armorSet: 'Obsidian', generation: 3, wikiSlug: 'Obsidian_Vestments'},
  {id: 100883, name: 'Obsidian Gloves',               type: 'armor', slot: 'Gloves',    armorWeight: 'Light',  armorSet: 'Obsidian', generation: 3, wikiSlug: 'Obsidian_Gloves_(light)'},
  {id: 100965, name: 'Obsidian Pants',                type: 'armor', slot: 'Legs',      armorWeight: 'Light',  armorSet: 'Obsidian', generation: 3, wikiSlug: 'Obsidian_Pants'},
  {id: 100912, name: 'Obsidian Shoes',                type: 'armor', slot: 'Boots',     armorWeight: 'Light',  armorSet: 'Obsidian', generation: 3, wikiSlug: 'Obsidian_Shoes'},

  {id: 100960, name: 'Obsidian Mask',                 type: 'armor', slot: 'Helm',      armorWeight: 'Medium', armorSet: 'Obsidian', generation: 3, wikiSlug: 'Obsidian_Mask'},
  {id: 100928, name: 'Obsidian Shoulderpads',         type: 'armor', slot: 'Shoulders', armorWeight: 'Medium', armorSet: 'Obsidian', generation: 3, wikiSlug: 'Obsidian_Shoulderpads'},
  {id: 100916, name: 'Obsidian Coat',                 type: 'armor', slot: 'Chest',     armorWeight: 'Medium', armorSet: 'Obsidian', generation: 3, wikiSlug: 'Obsidian_Coat'},
  {id: 100943, name: 'Obsidian Gloves',               type: 'armor', slot: 'Gloves',    armorWeight: 'Medium', armorSet: 'Obsidian', generation: 3, wikiSlug: 'Obsidian_Gloves_(medium)'},
  {id: 100932, name: 'Obsidian Leggings',             type: 'armor', slot: 'Legs',      armorWeight: 'Medium', armorSet: 'Obsidian', generation: 3, wikiSlug: 'Obsidian_Leggings'},
  {id: 100899, name: 'Obsidian Boots',                type: 'armor', slot: 'Boots',     armorWeight: 'Medium', armorSet: 'Obsidian', generation: 3, wikiSlug: 'Obsidian_Boots_(medium)'},

  {id: 100976, name: 'Obsidian Helm',                 type: 'armor', slot: 'Helm',      armorWeight: 'Heavy',  armorSet: 'Obsidian', generation: 3, wikiSlug: 'Obsidian_Helm'},
  {id: 100905, name: 'Obsidian Pauldrons',            type: 'armor', slot: 'Shoulders', armorWeight: 'Heavy',  armorSet: 'Obsidian', generation: 3, wikiSlug: 'Obsidian_Pauldrons'},
  {id: 100988, name: 'Obsidian Breastplate',          type: 'armor', slot: 'Chest',     armorWeight: 'Heavy',  armorSet: 'Obsidian', generation: 3, wikiSlug: 'Obsidian_Breastplate'},
  {id: 100919, name: 'Obsidian Gauntlets',            type: 'armor', slot: 'Gloves',    armorWeight: 'Heavy',  armorSet: 'Obsidian', generation: 3, wikiSlug: 'Obsidian_Gauntlets'},
  {id: 100951, name: 'Obsidian Tassets',              type: 'armor', slot: 'Legs',      armorWeight: 'Heavy',  armorSet: 'Obsidian', generation: 3, wikiSlug: 'Obsidian_Tassets'},
  {id: 100938, name: 'Obsidian Greaves',              type: 'armor', slot: 'Boots',     armorWeight: 'Heavy',  armorSet: 'Obsidian', generation: 3, wikiSlug: 'Obsidian_Greaves'},
];

// Deduplicate by ID
const seen = new Set<number>();
export const LEGENDARIES_DEDUPED = LEGENDARIES.filter(l => {
  if (seen.has(l.id)) return false;
  seen.add(l.id);
  return true;
});

export const LEGENDARY_BY_ID = new Map(LEGENDARIES_DEDUPED.map(l => [l.id, l]));
