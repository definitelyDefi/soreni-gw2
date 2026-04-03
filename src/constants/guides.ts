export interface GuideSection {
  title?: string;
  content: string;
  tips?: string[];
  warnings?: string[];
  list?: string[];
}

export interface Guide {
  id: string;
  categoryId: string;
  title: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  summary: string;
  readTime: number; // minutes
  image?: string; // optional wiki header image URL
  sections: GuideSection[];
}

export interface GuideCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export const GUIDE_CATEGORIES: GuideCategory[] = [
  {id: 'start',      label: 'Getting Started',       icon: '🌱', color: '#4caf50'},
  {id: 'combat',     label: 'Combat Mechanics',       icon: '⚔️', color: '#f44336'},
  {id: 'openworld',  label: 'Open World',             icon: '🗺️', color: '#2196f3'},
  {id: 'fractals',   label: 'Fractals',               icon: '🌀', color: '#9c27b0'},
  {id: 'raids',      label: 'Raids',                  icon: '👑', color: '#ff9800'},
  {id: 'strikes',    label: 'Strike Missions',        icon: '🏛️', color: '#795548'},
  {id: 'wvw',        label: 'World vs World',         icon: '🏰', color: '#607d8b'},
  {id: 'pvp',        label: 'PvP',                    icon: '🏆', color: '#e91e63'},
  {id: 'economy',    label: 'Economy & TP',           icon: '💹', color: '#009688'},
  {id: 'crafting',   label: 'Crafting & Legendaries', icon: '⚒️', color: '#c8972b'},
  {id: 'events',     label: 'Seasonal Events',        icon: '🎉', color: '#e040fb'},
];

export const GUIDES: Guide[] = [
  // ─── Getting Started ────────────────────────────────────────────────────────

  {
    id: 'gw2-overview',
    categoryId: 'start',
    title: 'What is Guild Wars 2?',
    icon: '🌍',
    difficulty: 'beginner',
    summary: 'A quick overview of GW2 — its philosophy, what makes it unique, and what to expect.',
    readTime: 4,
    image: 'https://wiki.guildwars2.com/images/thumb/d/df/GW2Logo_new.png/400px-GW2Logo_new.png',
    sections: [
      {
        title: 'The World of Tyria',
        content:
          'Guild Wars 2 is a massively multiplayer online role-playing game set in the fantasy world of Tyria. Unlike most MMOs, it emphasises dynamic events over static quests, and cooperative play over competition — every player in an area benefits when a meta event succeeds, so helping strangers is always worth it.',
      },
      {
        title: 'No Subscription, No Pay-to-Win',
        content:
          'The base game (Core Tyria) is completely free to play. Expansions — Heart of Thorns (2015), Path of Fire (2017), End of Dragons (2022), Secrets of the Obscure (2023), Janthir Wilds (2024), and Visions of Eternity (2025) — are paid one-time purchases. The Gem Store sells cosmetics and convenience items, but nothing that gives a gameplay advantage.',
        tips: [
          'Free accounts have some restrictions (map chat, mail, TP). Buying any expansion or 2000 Gems removes them.',
          'Sales happen frequently. Check the Gem Store weekly.',
        ],
      },
      {
        title: 'Key Differences from Other MMOs',
        content:
          'There is no dedicated healer trinity — every class can deal damage and support simultaneously. Gear progression is horizontal: once you reach Exotic or Ascended tier, upgrading is about refining your build, not chasing higher item levels. Endgame content includes raids, fractals, WvW, PvP, legendary crafting, and map completion.',
        list: [
          'No gear treadmill — Ascended gear is the best stat tier and never gets replaced',
          'Downscaling: high-level players are scaled down in low-level zones',
          'Personal story + Living World episodes advance the narrative',
          'Hundreds of achievements and collections to pursue',
        ],
      },
    ],
  },

  {
    id: 'first-character',
    categoryId: 'start',
    title: 'Choosing Your First Character',
    icon: '🧙',
    difficulty: 'beginner',
    summary: 'Race and profession choices, what actually matters, and tips for new players.',
    readTime: 5,
    sections: [
      {
        title: 'Race Choice',
        content:
          'There are five races: Human, Norn, Charr, Asura, and Sylvari. Race affects your starting zone, personal story chapters, and a few racial skills — but has zero impact on combat performance. Pick whatever appeals to you aesthetically or story-wise.',
        tips: ['You can have up to 69 character slots. Your first character is just a starting point.'],
      },
      {
        title: 'Profession (Class) Overview',
        content:
          'There are nine core professions. Each plays very differently. Core professions are free; elite specializations (which significantly change playstyle) require the relevant expansion.',
        list: [
          'Warrior — tough frontliner, strong support with banners. Beginner-friendly.',
          'Guardian — holy warrior with blocks and barriers. Very popular in all content.',
          'Revenant — channels legendary heroes. Complex but powerful. Core profession (free to all accounts since June 2022; elite specs still require expansions).',
          'Ranger — pet-based, good at kiting. Druid healer spec is a raid staple.',
          'Thief — mobile, high burst. High skill floor but very rewarding.',
          'Engineer — turrets and kits, highly versatile. Scrapper is great for support.',
          'Elementalist — four attunements, extremely high ceiling. Very squishy.',
          'Mesmer — illusions and portals, unique utility. Portal is irreplaceable in raids.',
          'Necromancer — death shroud as a second HP pool. Very forgiving for beginners.',
        ],
        tips: [
          'For beginners: Warrior, Guardian, and Necromancer are the most forgiving.',
          'For endgame: check Snowcrows (snowcrows.com) for current meta builds.',
        ],
      },
      {
        title: 'Does It Matter What I Pick?',
        content:
          "Not for leveling. All professions can complete open world content comfortably. Endgame group content does have meta roles, but every profession has multiple viable builds. Play what you enjoy — you can always make more characters.",
        warnings: ['Do not delete a character to remake it. You can change your build at any time for free at a Build Template.'],
      },
    ],
  },

  {
    id: 'reaching-80',
    categoryId: 'start',
    title: 'Reaching Level 80',
    icon: '📈',
    difficulty: 'beginner',
    summary: 'The fastest and most enjoyable ways to get to the level cap.',
    readTime: 4,
    sections: [
      {
        title: 'How Leveling Works',
        content:
          'The level cap is 80. You gain XP from almost everything: events, hearts, kills, crafting, gathering, and map exploration. The game is designed so that playing normally is enough — you do not need to grind.',
        tips: [
          'Use XP Boosters from the Gem Store or login rewards to speed things up.',
          'Crafting all disciplines to max level gives a massive XP burst — enough to reach 80 from level 1 alone.',
        ],
      },
      {
        title: 'Best Methods',
        content:
          'The quickest method is to follow the Personal Story alongside open world events. Daily achievements give a large bonus XP reward each day. Expansion stories require level 80 — focus on core Tyria first.',
        list: [
          'Crafting: Level all 8 disciplines to max for ~10+ levels of XP total',
          'Events: Dynamic events give great XP per time spent',
          'Daily achievements: Complete 3 dailies for a large bonus chest',
          'Personal Story: Follow the story naturally while exploring',
        ],
      },
      {
        title: 'Level 80 Boost',
        content:
          'Each account gets one free Level-80 Boost from the Gem Store. Use it on a character you want to try but not your first — your first playthrough is more enjoyable leveled naturally since it teaches you the game.',
        warnings: [
          'The Level-80 Boost also provides a starter set of gear and a build template. Read the tooltip carefully before using it.',
        ],
      },
    ],
  },

  {
    id: 'daily-routine',
    categoryId: 'start',
    title: 'The Daily Routine',
    icon: '📋',
    difficulty: 'beginner',
    summary: 'What to do every day to maximize rewards and progress efficiently.',
    readTime: 5,
    sections: [
      {
        title: 'Daily Achievements',
        content:
          'Each day at 00:00 UTC, a new set of daily achievements resets. Completing three awards a Daily Achievement Chest containing Gold, Laurels, and Mystic Coins. These are among the most reliable daily income sources in the game.',
        tips: [
          'The easiest dailies are usually crafting, gathering, or killing a specific enemy type.',
          'Dailies reset at midnight UTC — plan accordingly for your timezone.',
        ],
      },
      {
        title: "Wizard's Vault",
        content:
          "The Wizard's Vault replaced the old daily/weekly reward track. It offers a set of daily and weekly objectives that award Astral Acclaim — a currency you spend on cosmetics, materials, gold, and more. Check it daily and complete the easy objectives first.",
        list: [
          'Daily objectives reset at 00:00 UTC',
          'Weekly objectives reset on Monday at 07:30 UTC',
          'Astral Acclaim has a hard cap of 1,300 — you stop earning from objectives once at cap',
          'Astral Acclaim can be converted into Gold (Bag of Gold), Mystic Coins (very high value per AA), Laurels, and unique skins',
        ],
        warnings: [
          'Spending Astral Acclaim regularly is important — the 1,300 cap means you lose earned AA from daily/weekly objectives if you don\'t clear space. Spend before hitting the cap.',
        ],
        tips: [
          'Best spends: Mystic Coins (very high gold/AA ratio) and Bag of Gold (800 AA = 100 gold in coins) when at cap.',
        ],
      },
      {
        title: 'World Boss Train',
        content:
          'World Bosses spawn on a fixed schedule and award excellent loot including Exotic gear, crafting materials, and rare drops. The "World Boss Train" refers to hopping between maps to kill as many bosses as possible in sequence. Check the Timers tab in this app for the current schedule.',
        tips: ['The Shatterer, Tequatl, and Triple Trouble have the best loot tables.'],
      },
      {
        title: 'Home Instance Gathering',
        content:
          'Your home instance (in your race\'s capital city) contains gathering nodes that respawn daily. By unlocking additional nodes (via achievements or Gem Store), this becomes a passive daily source of valuable crafting materials including Flax, Bloodstone Dust, and more.',
      },
    ],
  },

  {
    id: 'hud-explained',
    categoryId: 'start',
    title: 'The HUD Explained',
    icon: '🖥️',
    difficulty: 'beginner',
    summary: 'A walkthrough of every UI element you\'ll see on screen.',
    readTime: 4,
    sections: [
      {
        title: 'Skills Bar',
        content:
          'The bottom center shows your 10 skills: slots 1–5 are weapon skills (auto-attack + 4 more), slot 6 is a Healing Skill, slots 7–9 are Utility Skills, and slot 10 is your Elite Skill. Some professions have special mechanics displayed above this bar (Warrior Adrenaline, Elementalist Attunements, etc.).',
        tips: [
          'Press F1–F5 to swap between weapon sets or trigger profession mechanics.',
          'Hold Alt and click to lock skills so you don\'t accidentally overwrite them.',
        ],
      },
      {
        title: 'Boon and Condition Bars',
        content:
          'Green icons above your health bar are Boons (buffs). Red/purple icons are Conditions (debuffs). Hover over any icon to see its name and remaining duration. Learning which boons and conditions matter is key to understanding combat.',
        list: [
          'Might: increases power and condition damage',
          'Quickness: reduces skill activation time by 50%',
          'Alacrity: reduces skill recharge time',
          'Fury: increases critical hit chance by 20%',
          'Vulnerability: target takes more damage per stack',
          'Burning, Bleeding, Poison, Confusion, Torment: damage over time conditions',
        ],
      },
      {
        title: 'Minimap and Compass',
        content:
          'The minimap in the top right shows your immediate surroundings. Yellow stars are nearby events. Green circles are heart NPCs. Blue/cyan markers are Points of Interest and Vistas. Click the minimap to expand it to full screen. Right-click anywhere on the world map to set a personal waypoint.',
        tips: [
          'Press M to open the full world map.',
          'You can double-click a waypoint on the map to travel there (costs a small amount of gold).',
        ],
      },
    ],
  },

  // ─── Combat & Builds ────────────────────────────────────────────────────────

  {
    id: 'combat-basics',
    categoryId: 'combat',
    title: 'The Combat System',
    icon: '⚔️',
    difficulty: 'beginner',
    summary: 'Action combat, skill combos, and how GW2 fights work at a fundamental level.',
    readTime: 5,
    sections: [
      {
        title: 'Action-Style Combat',
        content:
          'GW2 uses a hybrid action combat system. You can move while casting most skills (no "stand still to cast" penalty for most abilities). Positioning matters — facing your target, being behind them, or flanking can trigger backstab bonuses and break line of sight.',
        tips: [
          'Hold right-click to enter "action camera" mode for a more traditional action game feel.',
          'You can strafe and dodge while auto-attacking.',
        ],
      },
      {
        title: 'Dodging',
        content:
          'Double-tap a movement key or press the dodge key (default V) to dodge. This grants 0.75 seconds of Evade — you take no damage and apply no conditions during this window. Evade is shown as a brief golden outline on your character. Endurance (the two yellow bars below health) fuels dodges and regenerates over time.',
        warnings: [
          'Dodging at the wrong time wastes endurance. Watch for red AoE circles and boss wind-up animations before dodging.',
          'Some skills and traits enhance or replace dodges — explore trait lines for dodge upgrades.',
        ],
      },
      {
        title: 'Combo Fields and Finishers',
        content:
          'Many skills create "combo fields" on the ground (fire, water, lightning, smoke, etc.) and other skills are "combo finishers" (blast, leap, projectile, whirl). Using a finisher inside a matching field produces a bonus effect. For example: Blast inside a Fire Field grants nearby allies Might; Leap through a Water Field grants Regeneration.',
        tips: [
          'Even if you don\'t understand combos fully, blasting fire fields for Might stacks is one of the most impactful things you can do in a group.',
          'Press Ctrl+click an enemy to share their target with your group.',
        ],
        list: [
          'Fire Field + Blast → 3 stacks of Might to nearby allies',
          'Water Field + Blast → Regeneration to nearby allies',
          'Smoke Field + Blast → Stealth to nearby allies',
          'Light Field + Blast → Remove a condition from nearby allies',
        ],
      },
      {
        title: 'Breakbars (Defiance)',
        content:
          'Many powerful enemies have a Breakbar — a blue bar below their health bar. Using Crowd Control (CC) skills depletes this bar. When the breakbar is broken, the enemy is stunned and takes 50% more damage for a short window. This is one of the most impactful mechanics in the game and is often ignored by new players.',
        warnings: [
          'Hard CC skills (stun, daze, knockdown, knockback, pull, launch, float, sink, fear, taunt) deal large breakbar damage.',
          'Soft CC (chill, cripple, immobilize, slow, blind, weakness) deal very small breakbar damage.',
        ],
      },
    ],
  },

  {
    id: 'boons-conditions',
    categoryId: 'combat',
    title: 'Boons & Conditions',
    icon: '✨',
    difficulty: 'beginner',
    summary: 'A complete reference to every boon and condition in the game.',
    readTime: 5,
    sections: [
      {
        title: 'Key Offensive Boons',
        content: 'These boons on yourself increase your damage output and are worth maintaining at all times in group content.',
        list: [
          'Might (stacks, max 25) — each stack adds 30 Power and 30 Condition Damage',
          'Fury — +20% critical hit chance',
          'Quickness — reduces skill activation time by 50%',
          'Alacrity — reduces skill recharge rate by 25%',
        ],
      },
      {
        title: 'Vulnerability — Key Condition to Apply on Enemies',
        content: 'Vulnerability is a condition placed on enemies (not a boon on yourself). It is the most universally important debuff in the game.',
        list: [
          'Vulnerability (stacks, max 25) — each stack increases all damage the enemy takes by 1% (at 25 stacks = +25% incoming damage)',
          'Virtually every group DPS build contributes Vulnerability to the target',
          'Cannot be removed by your own condition cleanse — it is on the enemy, not on you',
        ],
      },
      {
        title: 'Key Defensive Boons',
        content: 'These boons help you or your group survive.',
        list: [
          'Protection — -33% incoming damage',
          'Aegis — blocks the next incoming attack',
          'Regeneration — heals over time',
          'Stability — cannot be knocked down, stunned, or launched',
          'Resistance — immune to conditions while active',
          'Swiftness — +33% movement speed',
        ],
      },
      {
        title: 'Damaging Conditions',
        content: 'Conditions tick damage over time and are the foundation of condition builds.',
        list: [
          'Burning — highest DPS condition, scales with Condition Damage',
          'Bleeding — moderate DPS, stacks separately',
          'Poison — DoT + reduces healing received by 33%',
          'Confusion — damage on skill use',
          'Torment — damage while stationary, double while moving',
        ],
      },
      {
        title: 'Crowd Control Conditions',
        content: 'These conditions impair movement and deal breakbar damage.',
        list: [
          'Cripple — -50% movement speed',
          'Chill — -66% movement speed, -66% skill recharge',
          'Immobilize — cannot move',
          'Slow — -50% skill activation speed',
          'Weakness — -50% endurance regeneration, attacks have 50% chance to glance (50% less damage)',
          'Blind — next attack misses',
          'Fear — forced movement away from source',
        ],
      },
    ],
  },

  // ─── Open World ─────────────────────────────────────────────────────────────

  {
    id: 'map-completion',
    categoryId: 'openworld',
    title: 'Map Completion',
    icon: '🗺️',
    difficulty: 'beginner',
    summary: 'How map completion works, what rewards you get, and efficient strategies.',
    readTime: 4,
    sections: [
      {
        title: 'What is Map Completion?',
        content:
          'Every map has a completion percentage shown in the top right of the minimap. Completion requires visiting all Points of Interest, unlocking all Waypoints, viewing all Vistas, and completing all Hero Challenges (Skill Points) on the map. Completing a map awards bonus rewards including crafting materials and Transmutation Charges.',
        tips: [
          'Blue diamonds are Points of Interest — just walk through them.',
          'Vistas require a short jumping puzzle or climbing section to reach the view.',
          'Hero Challenges (gold star icons) award Hero Points used to unlock skills and traits.',
        ],
      },
      {
        title: 'World Completion',
        content:
          'Completing every map in the base game (Core Tyria, including PvP and WvW maps) awards the "Cartographer" title and two Gifts of Exploration — a key component in legendary weapon crafting. This is a long-term goal that takes dozens of hours.',
        list: [
          '2× Gift of Exploration awarded on world completion',
          'WvW map completion requires capturing enemy objectives — do this during a winning match for best results',
          'PvP map completion is done in the Heart of the Mists (safe zone, no actual PvP required)',
        ],
        warnings: [
          'World completion requires visiting maps from both enemy WvW teams. This is possible solo but easier when your team is winning.',
        ],
      },
      {
        title: 'Efficient Completion Tips',
        content:
          'Start with maps you enjoy or that have good meta events. Use a mount (unlocked in Path of Fire) to move faster. Join a mentor tag or commander tag group for unfamiliar areas.',
        tips: [
          'The Skyscale (flying mount) makes reaching hard Vistas trivial. Worth unlocking eventually.',
          'Install the TacO overlay (PC) to see completion markers on your screen.',
        ],
      },
    ],
  },

  {
    id: 'meta-events',
    categoryId: 'openworld',
    title: 'World Bosses & Meta Events',
    icon: '🐉',
    difficulty: 'beginner',
    summary: 'The best open world events, their schedules, and how to maximize loot.',
    readTime: 4,
    image: 'https://wiki.guildwars2.com/images/thumb/9/9f/Meta_event_interface.jpg/300px-Meta_event_interface.jpg',
    sections: [
      {
        title: 'World Bosses',
        content:
          'World Bosses are large, powerful enemies that spawn on a fixed 2-hour timer. They reward a Bonus Chest once per day per boss with guaranteed Exotic-level loot. The most commonly farmed bosses are The Shatterer, Tequatl the Sunless, and the Triple Trouble Wurm.',
        tips: [
          'Use the Timers tab in this app to track upcoming world bosses.',
          'Most bosses can be soloed at level 80, but bringing a group makes them faster.',
        ],
      },
      {
        title: 'Meta Events',
        content:
          'Meta Events are large-scale, map-wide event chains that culminate in a major boss or objective. They offer the best loot in the game outside of raids. Key metas include Auric Basin Octovine, Dragon Stand, Verdant Brink Night, and Istan/Palawadan.',
        list: [
          'Dragonfall (LW4) — #1 open-world farm; 25–40 gold/hour; Dragonfall Keys earned from events open Dragon Response Caches; Volatile Magic → Trophy Shipments for T6 materials',
          'Auric Basin (HoT) — 4 Octovine bosses, loot room with guaranteed rewards; quick cycle, rarely fails',
          'Dragon Stand (HoT) — requires map-wide coordination, very high reward',
          'Domain of Istan (PoF) — Palawadan event, excellent gold/loot per hour',
          'Drizzlewood Coast (IBS) — two back-to-back metas; Charr Commendations → Cash Keys → chests; Base Camp Waypoint [&BH8LAAA=]',
          'Gyala Delve (EoD) — 20–30 gold/hour; Jade Miner\'s Key Cards + unidentified gear; consistent without hard DPS checks',
          'Silverwastes RIBA — ~20 gold/hour; great beginner farm; Bandit Bags + Buried Treasure chests',
        ],
      },
      {
        title: 'Loot Stacking',
        content:
          'Many experienced players chain multiple metas by timing map joins. Loot from most metas can only be earned once per day per account, but the passive loot from enemies and events is unlimited. Join maps with active commanders for the best experience.',
        tips: [
          'Use the LFG (Looking For Group) tool under the party icon to find active meta maps.',
          'Event loot scales with your participation — deal more damage, heal more, or revive downed players for better rewards.',
        ],
      },
    ],
  },

  {
    id: 'home-instance',
    categoryId: 'openworld',
    title: 'Home Instance & Daily Gathering',
    icon: '🌿',
    difficulty: 'beginner',
    summary: 'How to maximize your home instance as a passive daily income source.',
    readTime: 3,
    sections: [
      {
        title: 'What is the Home Instance?',
        content:
          'Every account has a Home Instance in their race\'s capital city. It starts nearly empty, but can be filled with gathering nodes that respawn daily. Once unlocked, these provide free passive materials every day you log in.',
      },
      {
        title: 'Unlocking Nodes',
        content:
          'Nodes are unlocked through achievements, story progress, or purchased from the Gem Store. Once unlocked on your account, any character can gather them. Valuable nodes include:',
        list: [
          'Flax Seed Node (LS3) — Flax Fibers for Ascended crafting',
          'Bloodstone Node — Bloodstone Dust for refinement',
          'Sprocket Node (HoT) — Airship Parts / Ley Line Crystals',
          'Orichalcum/Ancient nodes — high-level metals and wood',
          'Black Lion Chest nodes — chance for rare drops',
          'Seasonal nodes — holiday-specific materials',
        ],
        tips: [
          'The Order of Whispers Home Instance node gives a chance at a Rare or Exotic drop daily.',
          'Unlocking all Story step nodes is free and should be done as you progress the story.',
        ],
      },
      {
        title: 'Daily Routine',
        content:
          'Visit your home instance daily to gather all nodes. With a full instance this takes about 3–5 minutes and provides materials worth 5–15 gold per day depending on market prices. Keep the materials or sell them on the Trading Post.',
      },
    ],
  },

  // ─── Fractals ───────────────────────────────────────────────────────────────

  {
    id: 'fractals-intro',
    categoryId: 'fractals',
    title: 'What Are Fractals?',
    icon: '🌀',
    difficulty: 'beginner',
    summary: 'An introduction to Fractals of the Mists — GW2\'s 5-player instanced content.',
    readTime: 4,
    sections: [
      {
        title: 'Overview',
        content:
          'Fractals of the Mists are 5-player instanced dungeons accessible from Lion\'s Arch. Each "fractal" is a self-contained scenario ranging from a pirate ship attack to a volcanic island survival. They scale in difficulty from Level 1 to Level 100 and are among the most popular endgame activities in the game.',
        tips: [
          'Enter Fractals via the portal in Lion\'s Arch or the "Fractals" button in the LFG panel.',
        ],
      },
      {
        title: 'Fractal Scales and Tiers',
        content:
          'Fractal difficulty is determined by the Fractal Scale (1–100). These are grouped into four tiers:',
        list: [
          'T1 (Scales 1–25): Beginner tier, no Agony required, great for learning',
          'T2 (Scales 26–50): Moderate Agony Resistance needed (~30 AR)',
          'T3 (Scales 51–75): Higher AR required (~60 AR), more mechanics',
          'T4 (Scales 76–100): Maximum difficulty, 150 AR required, daily rewards',
        ],
        tips: ['Daily T4 Fractals are the main goal for most fractal players — they give the best loot.'],
      },
      {
        title: 'Personal Fractal Level',
        content:
          'Your Personal Fractal Level determines the maximum scale you can access. It increases automatically by completing fractals at or above your current level. You don\'t need to complete every scale — you can jump to higher scales with a group that has unlocked them.',
      },
    ],
  },

  {
    id: 'agony-infusions',
    categoryId: 'fractals',
    title: 'Agony & Infusion Guide',
    icon: '💉',
    difficulty: 'intermediate',
    summary: 'Understanding Agony Resistance, infusion slots, and how to gear up for T4.',
    readTime: 5,
    sections: [
      {
        title: 'What is Agony?',
        content:
          'At higher fractal scales, enemies inflict the Agony condition — a rapid health drain that cannot be cleansed by normal means. The only counter is Agony Resistance (AR), provided by Infusions slotted into Ascended gear.',
        warnings: [
          'Agony is not present in T1 fractals. You have time to gear up before needing AR.',
          'Without sufficient AR, Agony will kill you quickly regardless of your skill level.',
        ],
      },
      {
        title: 'AR Requirements',
        content: 'These are the approximate AR values needed for each fractal tier:',
        list: [
          'T1 (1–25): 0 AR needed',
          'T2 (26–50): 30 AR recommended',
          'T3 (51–75): 60 AR recommended',
          'T4 (76–100): 150 AR required (to survive at Scale 100)',
        ],
      },
      {
        title: 'Building AR: Infusion Slots',
        content:
          'Ascended gear has Infusion Slots. Weapons have 2 slots, armor pieces have 1 each, and trinkets have 1–2. Total Ascended gear gives you 18 infusion slots. Filling them with +9 Agony Infusions gives 162 AR — enough for Scale 100.',
        tips: [
          'Start with +5 Agony Infusions for T2/T3, upgrade to +9 for T4.',
          'You can also use Versatile Infusions which have both AR and a secondary stat.',
          'The Mist Attunement mastery passively increases effective AR by 5/10/15/25 — unlock it early.',
        ],
      },
      {
        title: 'Getting Ascended Gear',
        content:
          'Ascended gear is required for infusion slots. You can obtain it from:',
        list: [
          'Crafting (most reliable, but requires Ascended crafting materials)',
          'Fractal reward boxes (random drop from daily fractal chests)',
          'Raids and Strike Missions (token-based)',
          'Stat-selectable pieces from laurel vendors',
          'WvW and PvP reward tracks',
        ],
        tips: ['Prioritize trinkets first — rings and accessories have the most infusion slots per slot.'],
      },
    ],
  },

  {
    id: 'fractal-daily',
    categoryId: 'fractals',
    title: 'Daily Fractal Routine',
    icon: '📅',
    difficulty: 'intermediate',
    summary: 'How to run the daily fractals efficiently for maximum rewards.',
    readTime: 4,
    sections: [
      {
        title: 'The Daily Rotation',
        content:
          'Each day, three T4 Fractals and one Recommended Fractal are featured. Completing all three T4 dailies and the recommended gives the most rewards. A full daily run typically takes 45–90 minutes depending on the fractals and group composition.',
        tips: [
          'The Recommended Fractal can be from any tier — check your Achievements panel (Y) for the daily fractal tab.',
          'Use the Fractals screen in this app to track your daily completion status.',
          'Never vendor Fractal Encryption boxes from T4 chests. Buy Fractal Encryption Keys from the Mist Trader for 10 Fractal Relics each and open them — the vendor junk inside (Vial of Condensed Mist Essence, etc.) sells to the Mist Trader for a fixed high gold value and is a major source of fractal income.',
        ],
        warnings: [
          'Opening T4 and CM daily chests without Fractal Encryption Keys means leaving significant gold on the table. Save or buy keys before running.',
        ],
      },
      {
        title: 'Challenge Mode Fractals (CMs)',
        content:
          'Six fractals have Challenge Mode (CM) versions: Nightmare (MAMA), Shattered Observatory (Arkk), Sunqua Peak, Silent Surf (EoD), Lonely Tower (SotO), and Kinfall (Janthir Wilds, added June 2025). CMs are significantly harder and require good builds, communication, and knowledge of specific mechanics. They give the best fractal rewards including exclusive skins and titles.',
        warnings: [
          'CMs are considered endgame content. Learn normal modes thoroughly before attempting CMs.',
          'Most CM groups require LI (Legendary Insights / Log Ingots) as proof of experience.',
        ],
        list: [
          'Nightmare CM (Scale 96): MAMA, Siax, Ensolyss — strict DPS check on Siax',
          'Shattered Observatory CM (Scale 97): Skorvald, Artsariiv, Arkk — most popular, great rewards',
          'Sunqua Peak CM (Scale 98): Elemental bosses — unique storm phase; Scourge and Virtuoso excel here',
          'Silent Surf CM (Scale 99): EoD fractal — Aetherblade bosses, unique kite mechanics',
          'Lonely Tower CM (Scale 100): SotO fractal — Eparch, Kryptis boss with intense condition pressure',
          'Kinfall CM (Scale 95): JW fractal — Cryoflash and Wintry Orb mechanics; instantly lethal attacks in CM',
        ],
      },
      {
        title: 'Fractal Masteries',
        content:
          'Unlock Fractal Mastery tracks to gain powerful passive bonuses in fractals:',
        list: [
          'Fractal Attunement: passively increases AR',
          'Mist Attunement 1–4: strong passive AR bonuses (max +25 AR)',
          'Agony Channeler: allows +1 Agony Infusions to be upgraded',
          'Fractal Savant/Expert/Master: reduces Agony impact and boosts fractal rewards',
        ],
      },
    ],
  },

  // ─── Raids ──────────────────────────────────────────────────────────────────

  {
    id: 'raids-intro',
    categoryId: 'raids',
    title: 'Getting Started with Raids',
    icon: '👑',
    difficulty: 'advanced',
    summary: 'What raids are, how they work, and how to break into the raiding scene.',
    readTime: 5,
    image: 'https://wiki.guildwars2.com/images/thumb/d/da/Raid_portal.jpg/300px-Raid_portal.jpg',
    sections: [
      {
        title: 'What Are Raids?',
        content:
          'Raids are 10-player instanced content representing the hardest PvE content in Guild Wars 2. As of 2026 there are 8 raid wings (Spirit Vale, Salvation Pass, Stronghold of the Faithful, Bastion of the Penitent, Hall of Chains, Mythwright Gambit, The Key of Ahdashim, and Mount Balrior) plus the standalone Guardian\'s Glade encounter (added February 2026). Raids and Strike Missions were merged into a unified system in February 2026. Completing bosses awards Legendary Insights — a currency for Legendary Armor.',
      },
      {
        title: 'Roles in Raids',
        content:
          'Raids require a balanced composition. Unlike other MMOs, GW2 raids don\'t have a strict tank/healer/DPS trinity — but roles do exist:',
        list: [
          'Chronomancer (Mesmer) — Boon support, used to provide Quickness or Alacrity',
          'Firebrand (Guardian) — Quickness support + condition cleanse',
          'Druid (Ranger) — Healing + Spirits, boon support',
          'Alacrigade / Renegade — Alacrity support via Revenant',
          'DPS — Power or Condition damage dealers, filling the remaining spots',
          'Healer — Dedicated healer for progression content',
        ],
        tips: [
          'The meta changes with balance patches. Check Snowcrows for the current raid meta.',
          'You don\'t need to play a meta build to raid — many groups are open to all builds.',
        ],
      },
      {
        title: 'Finding Your First Raid Group',
        content:
          'The hardest part of raiding is finding a group as a new player. Options include:',
        list: [
          'Training runs: Look in LFG under "Raids" for [Train] tags — these groups teach mechanics',
          'Raid Academy (Discord): Community server dedicated to helping new raiders learn',
          'Static groups: A regular 10-player group you commit to. Best for progression.',
          'PUG (Pick Up Groups): Randoms from LFG — requires experience and proof (KP)',
        ],
        warnings: [
          'Many PUG groups require Kill Proof (KP) — Legendary Insights or Tokens as proof you\'ve completed the content before. Don\'t be discouraged; everyone starts at 0.',
        ],
      },
      {
        title: 'Raid Preparation',
        content:
          'Before your first raid: have full Ascended gear in a meta build, understand the boon and role you\'re bringing, and read or watch a guide for the specific boss. Websites like Raid Guides (by Snow Crows) have detailed boss strategies.',
        tips: [
          'The Golem in the Special Forces Training Area (in the raid lobby) lets you test your DPS benchmark before entering real content.',
          'Most raid groups expect 10–15k DPS minimum for DPS roles.',
        ],
      },
    ],
  },

  {
    id: 'legendary-armor',
    categoryId: 'raids',
    title: 'Legendary Armor',
    icon: '🛡️',
    difficulty: 'advanced',
    summary: 'How to obtain Legendary Armor — the ultimate gear goal for serious players.',
    readTime: 5,
    sections: [
      {
        title: 'Why Legendary Armor?',
        content:
          'Legendary Armor is the highest tier of gear in GW2. It has the same stats as Ascended armor but allows you to freely change stats and rune sets at any time, at no cost. This makes theorycrafting and build experimentation much easier.',
      },
      {
        title: 'Sources of Legendary Armor',
        content: 'There are four sets of Legendary Armor, each from a different content type:',
        list: [
          'Perfected Envoy Armor (Raids) — requires Legendary Insights from raid wings',
          'Legendary Renegade Armor (WvW) — requires WvW Skirmish Claim Tickets',
          'Legendary Triumphant Hero\'s Armor (PvP) — requires PvP League Tokens',
          'Legendary Obsidian Armor (SotO) — requires Fractal/Strike/Open World participation',
        ],
        tips: ['You only need one set of Legendary Armor across all characters — it is account-bound and sharable via the Legendary Armory.'],
      },
      {
        title: 'Raid Legendary Armor Path',
        content:
          'The raid path requires completing raid wings and accumulating Legendary Insights. You need to craft three sets of armor pieces through progressively more expensive recipes: Envoy Armor I, Envoy Armor II, and finally Perfected Envoy Armor. As of 2026, there are 8 raid wings plus Guardian\'s Glade — all now part of the unified instanced content system.',
        warnings: [
          'This is a long-term grind. Most players take months to complete a full set.',
          'Focus on one weight class first (light/medium/heavy).',
        ],
      },
    ],
  },

  // ─── Strikes ────────────────────────────────────────────────────────────────

  {
    id: 'strikes-overview',
    categoryId: 'strikes',
    title: 'Strike Mission Overview',
    icon: '🏛️',
    difficulty: 'intermediate',
    summary: 'What strike missions are, why you should do them, and which ones to prioritize.',
    readTime: 4,
    sections: [
      {
        title: 'What Are Strike Missions?',
        content:
          'Strike Missions are 10-player instanced encounters introduced as a bridge between open world and raids. They have Story, Normal, and Challenge Mode (CM) difficulties. They\'re more accessible than raids — no strict role requirements for Story/Normal modes — but still reward good gear and unique currencies.',
      },
      {
        title: 'Strike Currencies and Rewards',
        content: 'Each Strike Mission series has its own currency:',
        list: [
          'Icebrood Saga Strikes — Frozen Stormcaller weapons, relics',
          'End of Dragons Strikes — Strike Mission tokens for Legendary Armor components',
          'Secrets of the Obscure Strikes — SotO-specific currencies',
        ],
        tips: [
          'EoD Strike CMs are among the best sources of Legendary Armor materials (Conflux, Mystic Tribute components).',
        ],
      },
      {
        title: 'Recommended Strike Order',
        content:
          'For beginners, start with the Icebrood Saga strikes — they\'re easier and teach group mechanics. Then progress to End of Dragons normal modes. CMs are significantly harder and should be attempted with an experienced group.',
        list: [
          'IBS: Shiverpeaks Pass, Voice & Claw, Fraenir, Boneskinner, Whisper of Jormag, Cold War',
          'EoD: Old Lion\'s Court, Aetherblade Hideout, Xunlai Jade Junkyard, Kaineng Overlook, Harvest Temple',
          'SotO: Cosmic Observatory, Temple of Febe',
        ],
      },
    ],
  },

  // ─── WvW ────────────────────────────────────────────────────────────────────

  {
    id: 'wvw-basics',
    categoryId: 'wvw',
    title: 'WvW Basics',
    icon: '🏰',
    difficulty: 'beginner',
    summary: 'An introduction to World vs World — GW2\'s large-scale PvP and siege warfare mode.',
    readTime: 5,
    image: 'https://wiki.guildwars2.com/images/thumb/2/21/World_versus_World_map.jpg/300px-World_versus_World_map.jpg',
    sections: [
      {
        title: 'What is WvW?',
        content:
          'World vs World is a large-scale PvP mode where three servers (worlds) battle across four maps for control of objectives: towers, keeps, castles, and camps. Holding objectives earns your world Pips (WvW currency) and Victory Points. WvW runs 24/7 in a weekly cycle with a new matchup every week.',
        tips: [
          'WvW has a gear normalization mechanic — stats are partially equalized so skill matters more than gear.',
          'Players receive a WvW Rank that unlocks passive stat bonuses via the WvW abilities system.',
        ],
      },
      {
        title: 'The Maps',
        content: 'WvW consists of four maps:',
        list: [
          'Eternal Battlegrounds (center) — contains Stonemist Castle, the most contested objective',
          'Red Alpine Borderlands — home map of the red world',
          'Blue/Green Desert Borderlands — home maps for other two worlds',
          'Edge of the Mists — overflow map with extra objectives and rewards',
        ],
      },
      {
        title: 'Objectives and Siege',
        content:
          'Objectives (camps, towers, keeps, castles) can be captured by defeating enemy guards and standing in the capture circle. Defenders can use Siege Weapons — ballistas, catapults, arrow carts, trebuchets — to defend their walls. Attackers use rams to breach gates and catapults to destroy walls.',
        tips: [
          'Always contest supply camps — supply is needed to build and repair siege weapons.',
          'Dolyak caravans carry supply from camps to structures. Killing them is effective sabotage.',
        ],
      },
      {
        title: 'Getting Started',
        content:
          'New players should join a Commander tag (blue/yellow/purple star icon on the minimap) and follow their group. Learn the calls in map chat: "INC" means enemies incoming, "X" marks an objective. Don\'t scout alone until you know the maps.',
        list: [
          'Join a Commander for your first sessions',
          'Carry Supply (up to 10 units) — it\'s needed everywhere',
          'Revive fallen allies — WvW rewards reviving',
          'Mark camps and watch dolyak routes',
        ],
      },
    ],
  },

  {
    id: 'wvw-roaming',
    categoryId: 'wvw',
    title: 'Roaming in WvW',
    icon: '🐺',
    difficulty: 'advanced',
    summary: 'Solo and small-group WvW: builds, strategy, and how to fight outnumbered.',
    readTime: 5,
    sections: [
      {
        title: 'What is Roaming?',
        content:
          'Roaming means fighting solo or in a small group (2–5 players) outside of organized zergs. Roamers hunt enemy scouts, defend camps, kill dolyaks, and engage small groups. It requires strong knowledge of your build, high mobility, and fast decision-making.',
      },
      {
        title: 'Best Roaming Professions',
        content: 'Some professions roam more effectively than others due to mobility and self-sustain:',
        list: [
          'Thief (Deadeye/Daredevil) — extreme mobility, high burst, hard to catch',
          'Mesmer (Mirage) — clones confuse enemies, great sustain',
          'Ranger (Soulbeast) — ranged damage, self-heal, nature magic',
          'Warrior (Spellbreaker) — Full Counter and boon removal make Spellbreaker the dominant WvW roaming Warrior spec post-2024; high sustain and disruptive in 1v1',
          'Engineer (Holosmith) — burst damage and flexibility',
        ],
        tips: [
          'Mobility is king in roaming. Prioritize builds with teleports, leaps, or stealth.',
          'Carry Smoke Screens, Mesmer Decoy, or another stealth ability to disengage losing fights.',
        ],
      },
      {
        title: 'Roaming Strategy',
        content:
          'Good roamers pick fights they can win and disengage from bad ones. Learn to recognize when you\'re outnumbered and retreat before the fight starts. Target scouts, supply lines, and camps — high-value targets without large defender groups.',
        warnings: [
          'Avoid fighting near enemy towers/keeps — reinforcements can portal to you instantly.',
          'If a culled (invisible) enemy appears, disengage immediately — they\'re likely setting up for a gank.',
        ],
      },
    ],
  },

  {
    id: 'wvw-rewards',
    categoryId: 'wvw',
    title: 'WvW Rewards & Currency',
    icon: '🎁',
    difficulty: 'beginner',
    summary: 'How to earn WvW currencies, Skirmish Tickets, and progress toward Legendary gear.',
    readTime: 4,
    sections: [
      {
        title: 'Pips and Reward Tracks',
        content:
          'You earn Pips while playing in WvW (more Pips for winning matchups). Pips fill a Skirmish Reward Track that resets each week. Tracks award Skirmish Claim Tickets — the primary currency for WvW Legendary armor and weapons.',
        tips: [
          'Maximize Pips by playing during off-hours when your world is winning.',
          'Outnumbered bonus gives extra Pips — this is when a map has far fewer defenders.',
        ],
      },
      {
        title: 'WvW Currencies',
        content: '',
        list: [
          'Skirmish Claim Tickets — from weekly Skirmish Track, used for Legendary Armor',
          'WvW Memories of Battle — from objectives and chests, for Legendary gear crafting',
          'Badges of Honor — from combat, capped per week, used for misc purchases',
          'Testimonies of Heroics — from weekly skirmish track, for hero point unlocks',
          'WvW Rank — passive unlocks via the WvW Ability panel',
        ],
      },
      {
        title: 'Daily WvW Achievements',
        content:
          'Check the WvW daily achievements each day — they award bonus WvW currencies and track toward weekly milestones. Common objectives include defending objectives, escorting dolyaks, killing enemies, and capturing camps.',
      },
    ],
  },

  // ─── PvP ────────────────────────────────────────────────────────────────────

  {
    id: 'pvp-basics',
    categoryId: 'pvp',
    title: 'PvP Basics',
    icon: '🏆',
    difficulty: 'beginner',
    summary: 'An introduction to structured PvP — conquest, roles, and game flow.',
    readTime: 4,
    image: 'https://wiki.guildwars2.com/images/thumb/7/75/FINISH-THEM.jpg/300px-FINISH-THEM.jpg',
    sections: [
      {
        title: 'Structured PvP Overview',
        content:
          'Structured PvP (sPvP) is a 5v5 game mode played in the Heart of the Mists. All participants are equalized to the same stat level — gear doesn\'t matter. Only your skill, build choices, and teamwork determine the outcome. The primary game mode is Conquest (capture-point based).',
        tips: [
          'Stats are fully equalized in sPvP — a new player has the same power level as a veteran.',
          'Build templates can be pre-set for PvP. The game provides free access to all skills and traits in PvP.',
        ],
      },
      {
        title: 'Conquest Basics',
        content:
          'In Conquest, two teams of 5 fight over 3 control points (usually called Home, Mid, and Far). Holding a point generates score. The first team to 500 points (or with the most points when time expires) wins. Killing enemies generates score too, but points are the primary win condition.',
        list: [
          'Always contest the node — standing on an unguarded point wins games',
          'Roaming between nodes is called "+1ing" — rotate to help teammates on other points',
          'Decapping (neutralizing) an enemy node is valuable even if you can\'t hold it',
          'Mid node is usually the most contested — winning mid often wins the game',
        ],
      },
      {
        title: 'Roles in Conquest',
        content:
          'Teams generally have defined roles:',
        list: [
          'Far Point Holder (Bunker) — tanky build that holds the far node alone',
          'Teamfighter — specializes in winning 2v2/3v3 fights at mid',
          'Roamer — mobile build that +1s and decaps',
          'Side Noder — wins 1v1 on home or far point',
        ],
        tips: [
          'In unranked play, don\'t worry about roles — just play and learn the maps.',
          'Best PvP builds: check Metabattle (metabattle.com) for the current sPvP meta.',
        ],
      },
    ],
  },

  {
    id: 'pvp-ranked',
    categoryId: 'pvp',
    title: 'Ranked PvP & Seasons',
    icon: '🎖️',
    difficulty: 'intermediate',
    summary: 'How the ranked ladder works, how seasons progress, and rewards for climbing.',
    readTime: 3,
    sections: [
      {
        title: 'Rank System',
        content:
          'Ranked PvP uses a division-based ladder: Bronze, Silver, Gold, Platinum, Diamond, and Legendary. You earn rating (MMR) from wins and lose it from losses. Division reflects your approximate skill bracket.',
        tips: [
          'Play Unranked to learn before entering Ranked — rank decay and placement matches mean first impressions matter.',
          'Duo-queueing with a trusted teammate increases your win rate significantly.',
        ],
      },
      {
        title: 'Seasons and Rewards',
        content:
          'PvP seasons run for roughly two months. At the end of a season, rewards are distributed based on your final division. Higher divisions earn more PvP League Tokens, which are used to craft Legendary PvP Armor.',
        list: [
          'PvP League Tokens — the primary currency for Legendary PvP Armor',
          'Unique titles for reaching Legendary division',
          'Unique finisher effects for high placements',
        ],
      },
    ],
  },

  // ─── Economy ────────────────────────────────────────────────────────────────

  {
    id: 'trading-post-guide',
    categoryId: 'economy',
    title: 'Trading Post Guide',
    icon: '💹',
    difficulty: 'beginner',
    summary: 'How to buy and sell on the Trading Post efficiently.',
    readTime: 4,
    image: 'https://wiki.guildwars2.com/images/thumb/1/18/Trading_Post_home.jpg/400px-Trading_Post_home.jpg',
    sections: [
      {
        title: 'Buy Orders vs Sell Listings',
        content:
          'The Trading Post (TP) is GW2\'s player-driven auction house. You can either post a Sell Listing at your price and wait for a buyer, or instantly sell to the highest existing Buy Order. Similarly, you can post a Buy Order at your price and wait, or instantly buy from the lowest Sell Listing.',
        tips: [
          'Selling to buy orders gives you instant gold minus a 15% fee (5% listing + 10% transaction).',
          'Posting a sell listing may get you more gold, but it might sit unsold for a long time.',
        ],
        warnings: ['The 15% TP tax is significant. Factor it into every trade calculation.'],
      },
      {
        title: 'Finding Profitable Items',
        content:
          'The "spread" between buy orders and sell listings is the profit potential for flippers. Items with high volume and reasonable spreads are easiest to flip. Use gw2efficiency.com or gw2tp.net to analyze market trends.',
        list: [
          'High-volume crafting materials (T5/T6 leather, cloth, wood, ore)',
          'Food and utility consumables used in endgame content',
          'Dungeon and fractal tokens turned into equipment',
          'Black Lion Chest drops that fluctuate with new content releases',
        ],
      },
      {
        title: 'Undercutting and Patience',
        content:
          'When listing a sell order, players often undercut the current lowest listing by 1 copper to appear first. This is common practice. For expensive items, patience often pays — a listing 5–10% above the instant sell price often fills within hours or days.',
        tips: ['For items worth under 1 silver, just sell to buy orders. The time cost of managing listings isn\'t worth it.'],
      },
    ],
  },

  {
    id: 'gold-farming',
    categoryId: 'economy',
    title: 'Gold Farming Methods',
    icon: '🪙',
    difficulty: 'intermediate',
    summary: 'The most reliable ways to earn gold in GW2, from casual to dedicated farming.',
    readTime: 5,
    sections: [
      {
        title: 'Daily Sources (Low Effort)',
        content: 'These methods take under 30 minutes per day and provide consistent gold:',
        list: [
          "Wizard's Vault dailies — fastest daily baseline; 3–5 gold equivalent from Astral Acclaim rewards",
          'Daily Achievements — ~2–3 gold equivalent per day via login chest',
          'Home Instance gathering — 5–15 gold/day depending on unlocked nodes',
          'Login Rewards — Mystic Coins, crafting materials, boosters',
          'World Boss Train — 5–10+ gold equivalent per day; one bonus chest per boss',
        ],
        tips: [
          'Combine Wizard\'s Vault dailies + home instance gathering as your minimum daily routine — takes under 15 minutes.',
          'Check fast.farming-community.eu for current meta farm tracking and builds.',
        ],
      },
      {
        title: 'Active Farming Methods (Gold Per Hour)',
        content: 'These require active play but have high gold per hour. Estimates include material values at current market prices — check fast.farming-community.eu for live numbers:',
        list: [
          'Dragonfall meta (LW4, S4) — 25–40 gold/hour; #1 open-world farm; Volatile Magic + event chests + Dragonfall Keys (earned from events); join via LFG',
          'Fractal T4 dailies — 15–25 gold per session (30–45 min); add CMs for 30–40+ gold; most consistent daily income',
          'Gyala Delve meta (EoD) — 20–30 gold/hour; Jade Miner\'s Key Cards + unidentified gear; strong and consistent',
          'Drizzlewood Coast meta (IBS) — 15–25 gold/hour; Charr Commendations + chest keys; organized community daily runs',
          'Silverwastes RIBA — ~20 gold/hour; Bandit bags + Buried Treasure; good beginner farm; open 24/7',
          'Auric Basin Octovine (HoT) — 15–20 gold/hour; fast cycle, rarely fails; loot room after',
          'Raids (experienced squad) — ~30 gold/hour not counting Ascended drops',
          'Fishing in EoD — 20–30 gold/hour; process fish into Trophy Shipments for T6 materials',
          'Dungeons (CoF P1 chain) — ~25 gold/hour; accessible with any gear',
          'TP flipping — passive gold while offline; consistent for patient traders',
        ],
        tips: [
          'Never vendor Fractal Encryption boxes — buy Fractal Encryption Keys from the Mist Trader (10 Fractal Relics each) and open them. The Mist Trader vendor junk inside is a major income source.',
          'Use Magic Find food, Celebration Boosters, and guild MF banners to increase loot quality from all sources.',
          'Meta trains depend on rhythm — join an organized commander tag via LFG and don\'t wander off.',
          'fast.farming-community.eu tracks current meta profitability updated with live TP prices.',
          'For new players: start with Silverwastes RIBA or Auric Basin — no special gear required.',
        ],
      },
      {
        title: 'Long-Term Investments',
        content:
          'Some items appreciate over time. Mystic Coins are used in almost every legendary recipe and are consistently valuable. Crafting materials used in Ascended and Legendary gear tend to rise in price over the long term.',
        warnings: [
          'Market speculation is risky. Prices can crash with game updates. Only invest gold you can afford to lose.',
        ],
        tips: [
          'Mystic Coins from login rewards accumulate quickly. Many players hoard them for legendary crafting.',
        ],
      },
    ],
  },

  // ─── Crafting & Legendaries ──────────────────────────────────────────────────

  {
    id: 'crafting-disciplines',
    categoryId: 'crafting',
    title: 'Crafting Disciplines Guide',
    icon: '⚒️',
    difficulty: 'beginner',
    summary: 'All eight crafting disciplines, what they make, and which to prioritize.',
    readTime: 4,
    sections: [
      {
        title: 'The Nine Disciplines',
        content:
          'There are nine crafting disciplines total. Every character can have two active at once. Switching is free and your rating is always preserved. Each discipline produces specific gear types and materials. Leveling all disciplines to max rewards large amounts of XP.',
        list: [
          'Armorsmith — heavy armor (Warrior, Guardian, Revenant)',
          'Leatherworker — medium armor (Thief, Ranger, Engineer)',
          'Tailor — light armor (Elementalist, Mesmer, Necromancer)',
          'Weaponsmith — swords, axes, hammers, greatswords',
          'Huntsman — ranged weapons, torches, warhorns',
          'Artificer — staves, scepters, focuses, tridents',
          'Jeweler — rings, amulets, earrings',
          'Chef — food consumables (powerful combat buffs)',
          'Scribe — guild decorations, guild hall items (guild use only; requires HoT; cannot be leveled by individual players, only via guild hall)',
        ],
        tips: [
          'Leveling crafting disciplines to 400 can take a character from level 1 to 80 using crafting XP alone.',
          'You can have all disciplines at max on a single account — just swap active disciplines per character.',
          'Scribe is a special case — it is leveled collectively by the guild, not by individual characters.',
        ],
      },
      {
        title: 'Ascended Crafting',
        content:
          'At 500 rating (requires expansions), disciplines can craft Ascended gear — the second-highest tier. Ascended crafting requires time-gated materials including Bolts of Damask, Deldrimor Steel, Elonian Leather, and more. These materials have daily/weekly crafting limits.',
        warnings: [
          'Some Ascended materials have daily crafting limits — plan your crafting schedule accordingly.',
          'Ascended gear is expensive to craft. Research prices on the Trading Post before investing.',
        ],
      },
    ],
  },

  {
    id: 'mystic-forge',
    categoryId: 'crafting',
    title: 'Mystic Forge Guide',
    icon: '🔮',
    difficulty: 'intermediate',
    summary: 'How the Mystic Forge works, bulk promotion, and key recipes.',
    readTime: 4,
    sections: [
      {
        title: 'Mystic Forge Basics',
        content:
          'The Mystic Forge is a special crafting station in Lion\'s Arch (and the Mystic Toilet in major cities). It combines 4 items into 1 result. Results range from garbage to extremely valuable — the outcome is often randomized within a result table.',
        tips: [
          'Access the Mystic Forge remotely using a Mystic Forge Conduit (Gem Store item).',
        ],
      },
      {
        title: 'Key Recipes',
        content: '',
        list: [
          'Precursor crafting: 4 same-rarity weapons → chance for a higher-rarity or precursor weapon',
          'Mystic Clover: Mystic Coins + Globs of Ectoplasm + Philosopher\'s Stone + Mystic Crystal → ~1/3 chance of Mystic Clover (Legendary component)',
          'Sigil/Rune upgrade: 3 same sigils/runes + 1 upgrade → chance for a better version',
          'Exotic armor promotion: 4 Exotic pieces of same type → chance for different Exotic',
          'Legendary weapons: Final step to combine precursor + gifts',
        ],
      },
      {
        title: 'Mystic Clovers',
        content:
          'Mystic Clovers are one of the most important Legendary crafting materials. The recipe is: 1 Philosopher\'s Stone + 1 Mystic Crystal + 1 Mystic Coin + 1 Glob of Ectoplasm (1:1:1:1 ratio). Each attempt gives either 1 Mystic Clover (~33% chance) or a mix of other materials. Most Legendary items require 77 Mystic Clovers.',
        warnings: [
          'The Clover recipe is random — budget for ~3× the materials needed on average.',
          'Mystic Coins are the primary bottleneck. They can be bought on the Trading Post, but are expensive — earning them through dailies and login rewards is more cost-effective.',
        ],
        tips: [
          'Mystic Coins come from Daily Achievement login rewards (1 per day) and the Wizard\'s Vault.',
          'Buying Clovers from the Wizard\'s Vault or Laurel Vendors is an alternative if you have surplus.',
        ],
      },
    ],
  },

  {
    id: 'legendary-weapons',
    categoryId: 'crafting',
    title: 'Legendary Weapon Crafting',
    icon: '⚔️',
    difficulty: 'advanced',
    summary: 'The complete path to crafting your first Legendary weapon.',
    readTime: 6,
    image: 'https://wiki.guildwars2.com/images/1/18/Frostfang.png',
    sections: [
      {
        title: 'Why Legendary Weapons?',
        content:
          'Legendary weapons have the same stats as Ascended but allow free stat swapping at any time. They also have unique visual effects, footfalls, and animations. A Legendary weapon is shared via the Legendary Armory — one weapon can be used by all characters simultaneously.',
      },
      {
        title: 'The Four Components',
        content: 'Every Generation 1 and 2 Legendary weapon requires four components:',
        list: [
          '1× The Precursor — a specific Exotic weapon, either dropped, crafted (Gen 2), or bought on TP',
          '1× Gift of Fortune — requires Mystic Clovers, Ecto, Bloodstone Dust, and T6 materials',
          '1× Gift of Mastery — requires Gift of Battle (WvW) + Obsidian Shards + Gift of Exploration (world completion)',
          '1× Gift of the weapon — specific crafting materials unique to each legendary',
        ],
      },
      {
        title: 'Gift of Fortune',
        content:
          'Gift of Fortune is the most material-intensive component. It requires 77 Mystic Clovers, 250 Glob of Ectoplasm, 250 Bloodstone Dust, 250 Empyreal Fragments, and 250 Dragonite Ore. Plan to gather these materials over weeks or months.',
        tips: [
          'T6 materials (Vicious Claws, Powerful Blood, etc.) are required in large quantities for Gift of Fortune.',
          'Use salvage kits on Exotic gear for Ectos. Mystic Salvage Kit gives the best return.',
        ],
      },
      {
        title: 'The Precursor',
        content:
          'Getting the precursor is often the most expensive step. Options:',
        list: [
          'Buy from Trading Post — most reliable, prices vary from 50g to 1000g+',
          'Random drop from Mystic Forge (4 same-rarity weapons) — expensive and unreliable',
          'Crafted (Gen 2 only) — requires a specific account-wide collection',
          'Acquired through a Precursor Collection (most Gen 2 weapons)',
        ],
        warnings: ['Don\'t spam the Mystic Forge hoping for a precursor — it\'s almost always cheaper to buy it on the TP.'],
      },
      {
        title: 'Planning Your First Legendary',
        content:
          'Choose a weapon type you use frequently across builds and characters. Check the current TP price vs crafting cost using GW2Efficiency. Some Legendaries are significantly cheaper to craft than buy (and vice versa). Budget 500–2000 gold depending on the weapon.',
        tips: [
          'Sunrise (Greatsword) and The Dreamer (Shortbow) are popular first Legendaries — accessible price and widely useful.',
          'Track your progress using the Legendary Crafting Planner in this app.',
        ],
      },
    ],
  },

  {
    id: 'precursor-collections',
    categoryId: 'crafting',
    title: 'Precursor Collections (Gen 2)',
    icon: '📚',
    difficulty: 'advanced',
    summary: 'How to craft Generation 2 precursors through their account-wide collections.',
    readTime: 4,
    sections: [
      {
        title: 'What are Precursor Collections?',
        content:
          'Generation 2 Legendary weapons (introduced in Heart of Thorns) have their precursors crafted through a three-tier collection. Each tier involves completing a set of achievements that tell a story and reward crafting materials.',
      },
      {
        title: 'The Three Tiers',
        content:
          'Each Gen 2 precursor has three collections (Tier 1, 2, and 3). Completing Tier 1 gives you a weaker version of the precursor; Tier 2 upgrades it; Tier 3 produces the final precursor ready for the Legendary combine step.',
        tips: [
          'The collections often require map exploration, dungeon tokens, crafted components, and materials from multiple content types.',
          'Many collection steps can be purchased on the Trading Post if you prefer to skip the content.',
        ],
      },
      {
        title: 'Is it Worth It?',
        content:
          'For many Gen 2 precursors, completing the collection is cheaper than buying them on the TP — especially if you already have the materials or have completed the content. Use GW2Efficiency to compare crafting cost vs TP buy price before committing.',
      },
    ],
  },

  // ─── Getting Started (additional) ───────────────────────────────────────────

  {
    id: 'mounts-overview',
    categoryId: 'start',
    title: 'Mounts Overview',
    icon: '🐎',
    difficulty: 'beginner',
    summary: 'Every mount in the game, how to unlock them, and what each one is best at.',
    readTime: 5,
    image: 'https://wiki.guildwars2.com/images/thumb/f/f4/Mounts.png/400px-Mounts.png',
    sections: [
      {
        title: 'How Mounts Work',
        content:
          'Mounts are unlocked through Path of Fire and later expansions. Unlike most MMOs, each mount has a unique ability that also applies on foot — they are tools as much as transport. You keep mounts across all characters on your account.',
        tips: [
          'The Raptor is the first mount you get and covers most basic needs.',
          'Most mounts cannot be used in WvW. The Warclaw received a full rework in Janthir Wilds (2024) and is now also the primary traversal mount in JW open-world zones, with new abilities and a dedicated mastery track.',
        ],
      },
      {
        title: 'Path of Fire Mounts',
        content: 'These five mounts are the core set, unlocked through the PoF story and collections:',
        list: [
          'Raptor — long horizontal jumps, great all-purpose mount for flat terrain',
          'Springer — high vertical jumps, best for reaching elevated areas and cliffs',
          'Skimmer — hovers over water, sand, and lava; can skim over hazardous ground',
          'Jackal — teleports short distances, passes through sand portals in PoF',
          'Griffon — soaring glider mount, requires PoF story completion + 250g gold secret collection',
        ],
      },
      {
        title: 'Additional Mounts',
        content: 'More mounts were added in later content:',
        list: [
          'Roller Beetle (LS4) — fastest land mount, excellent for races and open-world travel',
          'Warclaw — reworked in Janthir Wilds (2024); double-jump, dash-strike, and traversal abilities; now used in JW open-world zones as well as WvW',
          'Skyscale (LS4 Episode 6) — flying mount, can hover and climb walls, the best all-around mount',
          'Siege Turtle (EoD) — two-player mount, one drives and one operates a cannon',
        ],
      },
      {
        title: 'Mount Masteries',
        content:
          'Each mount has its own mastery track that upgrades its ability. Unlock these using Mastery Points earned in the relevant expansion. For example, the Raptor Mastery increases jump distance; the Skyscale Mastery enables better climbing.',
        tips: [
          'Prioritize the Raptor masteries first — they give the most immediate quality-of-life improvement.',
          'The Skyscale is widely considered the best mount for general use once you have it.',
        ],
      },
    ],
  },

  {
    id: 'masteries-system',
    categoryId: 'start',
    title: 'The Masteries System',
    icon: '📖',
    difficulty: 'beginner',
    summary: 'How Masteries work, why they matter, and which to prioritize at level 80.',
    readTime: 4,
    image: 'https://wiki.guildwars2.com/images/thumb/e/e6/Mastery_interface.jpg/300px-Mastery_interface.jpg',
    sections: [
      {
        title: 'What Are Masteries?',
        content:
          'Masteries are account-wide progression unlocks for level 80 characters. Instead of gaining standard XP after level 80, you earn Mastery Experience that fills tracks in each expansion. Mastery Points are the unlock currency — earned from achievements, hearts, and story.',
        tips: [
          'Mastery XP is shared across all expansion zones you are currently in. Go to the relevant map to earn XP for that expansion.',
        ],
      },
      {
        title: 'Core Tyria Masteries',
        content: 'These masteries improve the base game experience:',
        list: [
          'Pact Commander — improved commander tag and squad features',
          'Fractal Attunement — AR bonuses for fractals',
          'Legendary Crafting — unlocks the ability to craft Legendary equipment',
          'Advanced Logistics — increased gathering and loot quality bonuses',
        ],
      },
      {
        title: 'Expansion Masteries',
        content: 'Each expansion adds its own mastery set with dedicated Mastery Points:',
        list: [
          'Heart of Thorns — Gliding (essential), Updraft Use, Lean Techniques, Stealth Gliding; Itzel/Nuhoch/Exalted/Pact languages; Mushroom Bouncing; Ley-Line Gliding',
          'Path of Fire — Raptor (Canyon Jumping), Springer (High Vault), Skimmer (Riding the Wind), Jackal (Shifting Sands), Griffon (Rising Wind); Bounty Hunter',
          'Living World Season 4 (Core mastery) — Skyscale (Rising Flame); requires LS4 Episode 6 "War Eternal"',
          'Icebrood Saga (Season 5) — Warclaw combat upgrades (original WvW mastery track)',
          'End of Dragons — Jade Bot (tier upgrades), Skiff (sailing), Siege Turtle (siege skills), Fishing, Jade Tech',
          'Secrets of the Obscure — Rift Scanning, Rift Mastery (tiers 1–3), Convergence access, Kryptis equipment',
          'Janthir Wilds — Homestead, Trailblazer movement',
          'WvW — Warclaw combat abilities, Warclaw mastery upgrades',
        ],
        tips: [
          'Gliding (HoT) is the highest priority — it is essential for HoT maps and useful everywhere.',
          'Path of Fire mounts are required for many open-world activities — unlock all five mounts before working on other PoF masteries.',
          'Rift Scanning (SotO) is a must-unlock immediately on entering SotO — it shows Rifts on your minimap.',
        ],
      },
    ],
  },

  {
    id: 'personal-story',
    categoryId: 'start',
    title: 'The Personal Story & Living World',
    icon: '📜',
    difficulty: 'beginner',
    summary: 'How GW2\'s story is structured and how to experience it in the right order.',
    readTime: 4,
    sections: [
      {
        title: 'Personal Story',
        content:
          'Your Personal Story begins at character creation and spans eight chapters as you level from 1 to 80. Choices made during character creation affect early story chapters but the main narrative converges regardless of choice.',
        tips: [
          'The Personal Story is instanced — you can revisit it any time via the hero panel.',
          'Completing story chapters awards good gear and XP.',
        ],
      },
      {
        title: 'Living World Seasons',
        content:
          'After the Personal Story, the narrative continues through Living World episodes. Season 1 occurred in real-time in 2013 and is no longer playable. Seasons 2 onward are permanently accessible (free if you logged in during the original release; purchasable otherwise):',
        list: [
          'Season 2 — bridge between Personal Story and Heart of Thorns',
          'Season 3 — post-HoT story, set in core Tyria maps with new zones',
          'Season 4 — post-PoF story, introduces new mounts and Joko arc',
          'Icebrood Saga (Season 5) — Charr civil war and Jormag arc',
        ],
        warnings: [
          'Do not skip Living World — it contains important story context and some episodes unlock permanent content and rewards.',
        ],
      },
      {
        title: 'Recommended Play Order',
        content: 'For the best story experience, follow this order:',
        list: [
          '1. Personal Story (levels 1–80)',
          '2. Living World Season 2',
          '3. Heart of Thorns expansion story',
          '4. Living World Season 3',
          '5. Path of Fire expansion story',
          '6. Living World Season 4',
          '7. Icebrood Saga (LW Season 5)',
          '8. End of Dragons expansion story',
          '9. Secrets of the Obscure expansion story',
          '10. Janthir Wilds expansion story',
          '11. Visions of Eternity expansion story',
        ],
      },
    ],
  },

  {
    id: 'hero-panel',
    categoryId: 'start',
    title: 'Hero Panel & Character Progression',
    icon: '🧝',
    difficulty: 'beginner',
    summary: 'Your character sheet, equipment tab, skills, traits, and build templates.',
    readTime: 4,
    sections: [
      {
        title: 'Opening the Hero Panel',
        content:
          'Press H to open the Hero Panel. It contains your equipment, build, achievements, masteries, wardrobe, and more. Familiarize yourself early — most character management happens here.',
      },
      {
        title: 'Equipment Tab',
        content:
          'The Equipment tab shows all 16 gear slots: helmet, shoulders, chest, gloves, legs, boots (armor); main hand, offhand, aquatic weapon (weapons); back, amulet, 2× ring, 2× accessory (trinkets). Each slot accepts a specific gear tier — Exotic and Ascended are endgame choices.',
        tips: [
          'Hover over stats to see the exact numbers they provide.',
          'Use the Wardrobe tab to change the appearance of your gear without affecting stats (Transmutation Charges required).',
        ],
      },
      {
        title: 'Build Tab',
        content:
          'The Build tab lets you set trait lines (3 active from your available pool), skills (1 healing, 3 utility, 1 elite), and specializations. You can save up to 3 Build Templates (6 with expansions) and 3 Equipment Templates. Templates are free to swap outside combat.',
        tips: [
          'Unlock traits and skills by spending Hero Points — earned from Hero Challenges on each map.',
          'You need 250 Hero Points to unlock all core skills and traits. Expansion specs require more.',
        ],
      },
      {
        title: 'Achievements Tab',
        content:
          'Achievements track almost everything you can do in the game. Many award Achievement Points (AP), titles, or cosmetic rewards. Daily and Special categories reset on a timer. Meta-Achievements reward exclusive skins or other bonuses when you complete enough sub-achievements.',
      },
    ],
  },

  {
    id: 'account-features',
    categoryId: 'start',
    title: 'Account Features: Bank, Wardrobe & More',
    icon: '🏦',
    difficulty: 'beginner',
    summary: 'Shared storage, the wardrobe system, the Legendary Armory, and account-wide unlocks.',
    readTime: 3,
    sections: [
      {
        title: 'Bank and Shared Inventory',
        content:
          'Your Account Bank (accessible at any Bank NPC or Bank Access Express) has 30 slots by default, expandable with Gems. Shared Inventory Slots appear at the top of every character\'s inventory and are accessible to all characters simultaneously — great for keys, boosters, or salvage kits.',
        tips: [
          'Shared inventory slots are among the best Gem Store purchases for quality of life.',
          'Materials are stored in the Material Storage (tab in your inventory) and do not count toward bank space.',
        ],
      },
      {
        title: 'Wardrobe System',
        content:
          'Every skin you unlock (by equipping an item, using a Skin Unlock, or completing content) is permanently account-wide in the Wardrobe. You can apply any unlocked skin to any gear piece of the same type using Transmutation Charges. This means cosmetics never expire.',
        tips: [
          'Transmutation Charges are earned from PvP, WvW, map completion, and the Gem Store.',
        ],
      },
      {
        title: 'Legendary Armory',
        content:
          'Legendary gear is stored in the Legendary Armory (accessible from your inventory). A single Legendary weapon or armor piece can be equipped by all your characters simultaneously. This means one Legendary greatsword can be used by your Warrior, Guardian, and Mesmer at the same time.',
        warnings: [
          'Placing gear in the Legendary Armory is irreversible. Make sure you want to share it before doing so.',
        ],
      },
    ],
  },

  {
    id: 'skyscale-guide',
    categoryId: 'start',
    title: 'Getting the Skyscale',
    icon: '🐉',
    difficulty: 'advanced',
    summary: 'The complete acquisition path for the Skyscale flying mount.',
    readTime: 6,
    image: 'https://wiki.guildwars2.com/images/thumb/b/bd/Skyscale.png/450px-Skyscale.png',
    sections: [
      {
        title: 'What You Need First',
        content:
          'The Skyscale requires Living World Season 4 Episode 6 "War Eternal" — you must have completed (or purchased) this episode. The quest begins after the episode\'s story mission "Descent." You also need roughly 30–50 gold and several hours across multiple days.',
        warnings: [
          'Skyscale acquisition involves multiple time-gated steps. Plan to spend 2–3 days minimum.',
        ],
      },
      {
        title: 'Collection Chain',
        content:
          'The Skyscale has a three-stage collection: Skyscale Lost (find 10 Skyscale eggs in Dragonfall), Skyscale Eggs (care for each egg with items from specific maps), and finally Skyscale of the [element] unlocks. Each egg requires specific items tied to different LS4 maps.',
        tips: [
          'Join a commander tag doing Skyscale runs — groups form regularly and cover multiple eggs quickly.',
          'The wiki\'s Skyscale page has an interactive checklist — use it to track each egg.',
        ],
      },
      {
        title: 'Final Steps',
        content:
          'After completing the egg collection, you craft the Skyscale Saddle (requires materials from the collection) and complete the "Return to" achievement. The Skyscale is then permanently added to your account.',
      },
      {
        title: 'Is it Worth It?',
        content:
          'Absolutely. The Skyscale is the most versatile mount in the game — it can fly, hover, scale vertical walls, and reach locations impossible with any other mount. It effectively replaces the Griffon for all but the fastest horizontal travel.',
      },
    ],
  },

  // ─── Combat & Builds (additional) ───────────────────────────────────────────

  {
    id: 'breakbar-guide',
    categoryId: 'combat',
    title: 'Breakbar Mastery (CC Guide)',
    icon: '💥',
    difficulty: 'intermediate',
    summary: 'Which skills break defiance bars, when to use them, and how CC rotations work in groups.',
    readTime: 4,
    sections: [
      {
        title: 'Why the Breakbar Matters',
        content:
          'When a breakbar is depleted, the target is stunned and takes 50% bonus damage (Exposed debuff). On a DPS-intensive boss, a well-timed break can cut the fight duration by 20–30%. Many mechanics are also locked behind breaking the bar.',
        tips: [
          'The best time to use big CC skills is just as the bar appears — not at the start of the bar.',
        ],
      },
      {
        title: 'Hard CC Skills by Class',
        content: 'Hard CC deals significant breakbar damage and is irreplaceable in group play:',
        list: [
          'Warrior — Skull Crack (Mace), Headbutt (elite), Earthshaker (Hammer)',
          'Guardian — Hammer of Wisdom (Staff trait), Sanctuary (Staff elite)',
          'Revenant — Surge of the Mists (Staff 5), Jade Winds (Shiro elite)',
          'Ranger — Path of Scars (Axe 4), Hilt Bash (Sword 3 with trait)',
          'Mesmer — Diversion (Shatter F3), Mind Wrack with trait modifiers',
          'Engineer — Launch Turret (Rifle Turret), Throw Wrench (Hammer)',
          'Elementalist — Magnetic Wave (Earth/Warhorn), Updraft (Air)',
          'Thief — Basilisk Venom (Stun on hit, venom share for groups)',
          'Necromancer — Spectral Grasp (Pull), Wail of Doom (Daze), Charge (Fear — hard CC), Grasping Dead (Cripple)',
        ],
      },
      {
        title: 'CC Rotation in Groups',
        content:
          'Coordinate with your group — using all CC at once is wasteful. Typically one player pre-assigns "CC duty." If the group is casual, just call out in chat when the bar appears and everyone presses their CC skills simultaneously.',
        warnings: [
          'Crowd control skills used outside of breakbar windows are largely wasted in PvE. Save them for the bar.',
        ],
      },
    ],
  },

  {
    id: 'condition-uptime',
    categoryId: 'combat',
    title: 'Condition Uptime & Expertise',
    icon: '🩸',
    difficulty: 'advanced',
    summary: 'How Expertise works, why condition duration matters, and how to cap it.',
    readTime: 4,
    sections: [
      {
        title: 'What is Condition Duration?',
        content:
          'Every condition applied has a base duration. Condition Duration % (provided by Expertise stat) extends this. At 100% condition duration, all conditions last twice as long — effectively doubling their damage output. This is why condi builds run Expertise-heavy stats like Viper.',
        list: [
          '0% Expertise: conditions last their base duration',
          '100% Expertise (213 Expertise stat): conditions last 2× base duration',
          'Individual sources stack: stat + runes + food + traits',
        ],
        tips: [
          'Most meta condi builds reach 100% duration on their primary condition through Viper stats + Superior Rune of Tormenting or similar.',
          'Burning is capped at 100% duration by default in many Firebrand builds via Superior Rune of Balthazar.',
        ],
      },
      {
        title: 'Stack Limits',
        content:
          'Conditions stack differently depending on their type:',
        list: [
          'Bleeding and Vulnerability stack in intensity — more stacks = more damage',
          'Burning, Poison, Confusion, Torment also stack in intensity',
          'Regeneration, Swiftness, Protection stack in duration only',
          'Maximum stacks per condition: Bleeding 1500, Burning 1500, Vulnerability 25',
        ],
        warnings: [
          'Vulnerability is a condition applied to enemies (not a boon) — it increases all incoming damage on the target by 1% per stack. It can be cleansed from enemies by boon-strip effects, but it is not removed by condition cleansing from your own bar.',
        ],
      },
    ],
  },

  // ─── Open World (additional) ─────────────────────────────────────────────────

  {
    id: 'heart-of-thorns',
    categoryId: 'openworld',
    title: 'Heart of Thorns Guide',
    icon: '🌿',
    difficulty: 'intermediate',
    summary: 'Navigating the vertical jungles of Maguuma, key metas, and HoT-specific mechanics.',
    readTime: 5,
    image: 'https://wiki.guildwars2.com/images/thumb/5/52/HoT_Texture_Centered_Trans.png/400px-HoT_Texture_Centered_Trans.png',
    sections: [
      {
        title: 'The Maguuma Jungle',
        content:
          'HoT zones (Verdant Brink, Auric Basin, Tangled Depths, Dragon Stand) are vertical, multi-layered maps. They require Gliding (HoT mastery) to navigate efficiently. Without Gliding unlocked, many areas are inaccessible.',
        warnings: [
          'Unlock the basic Gliding mastery immediately when you arrive in HoT. It costs 1 Mastery Point and is essential.',
        ],
      },
      {
        title: 'Key Meta Events',
        content: 'HoT has some of the best meta events in the game:',
        list: [
          'Verdant Brink — Night Meta: three-phase event leading to a massive airship battle with great loot',
          'Auric Basin — Octovine: four simultaneous Octovine bosses, ends with a loot room',
          'Tangled Depths — King of the Jungle: multi-lane coordination event',
          'Dragon Stand — Mordremoth: map-wide push toward the Elder Dragon, fantastic rewards',
        ],
        tips: [
          'Dragon Stand requires a well-coordinated map. Join an organized squad via LFG.',
          'Auric Basin Octovine runs on a roughly 2-hour timer — use the Timers tab to track it.',
        ],
      },
      {
        title: 'HoT Currencies',
        content:
          'HoT maps use unique currencies for their vendors:',
        list: [
          'Airship Parts — from Verdant Brink events, for VB gear and accessories',
          'Ley-Line Crystals — from Auric Basin events, for AB rewards',
          'Lumps of Aurillium — from Tangled Depths events',
          'Unbound Magic (LS3) — general HoT-era currency from LS3 maps; spend at map vendors',
          'Volatile Magic (LS4) — earned from Dragonfall, Istan, Thunderhead Peaks and other LW4 maps; convert at any LW4 vendor into Trophy Shipments (mixed T6 materials — best gold conversion) or Leather Shipments (targeted leather farm)',
        ],
        tips: [
          'Volatile Magic has no cap — accumulate as much as you want during Dragonfall meta runs, then convert via Trophy Shipments for consistent T6 material income.',
        ],
      },
    ],
  },

  {
    id: 'path-of-fire',
    categoryId: 'openworld',
    title: 'Path of Fire Guide',
    icon: '🏜️',
    difficulty: 'intermediate',
    summary: 'The Crystal Desert, mounts, and what to prioritize in PoF content.',
    readTime: 4,
    image: 'https://wiki.guildwars2.com/images/thumb/0/0e/GW2-PoF_Texture_Centered_Trans.png/400px-GW2-PoF_Texture_Centered_Trans.png',
    sections: [
      {
        title: 'Getting Started in PoF',
        content:
          'Path of Fire begins in Amnoon (Crystal Oasis). You immediately receive a Raptor mount, which is your primary tool for navigating the large desert maps. Unlock mount masteries as you go — each mastery track unlocks a new mount or improves an existing one.',
        tips: [
          'PoF maps are large and flat — the Raptor\'s long jump covers ground quickly.',
          'The Jackal (unlocked in Elon Riverlands) can pass through sand portals to reach hidden areas.',
        ],
      },
      {
        title: 'Key Metas and Events',
        content: 'PoF has several high-reward events:',
        list: [
          'Palawadan / Domain of Istan (LS4) — one of the best gold-per-hour events in the game',
          'Thunderhead Peaks meta (LS4) — Chain of Defeat + Thunderhead meta, great drops',
          'Kourna Octovine equivalent — Domain of Kourna meta with excellent rewards',
        ],
      },
      {
        title: 'Griffon Secret Collection',
        content:
          'The Griffon is a hidden mount unlocked through a secret collection called "Joy of Flight." After completing the PoF story and all 5 hearts in Vabbi, you can purchase the collection. It costs 250 gold total across several steps.',
        tips: [
          'The Griffon excels at high-speed soaring and diving — it\'s a fun mount for exploration even after you get the Skyscale.',
        ],
      },
    ],
  },

  {
    id: 'end-of-dragons',
    categoryId: 'openworld',
    title: 'End of Dragons Guide',
    icon: '🐲',
    difficulty: 'intermediate',
    summary: 'Cantha, new mechanics, and what to do in EoD as a new level 80.',
    readTime: 4,
    image: 'https://wiki.guildwars2.com/images/thumb/c/cc/EoD_Texture_Trans.png/400px-EoD_Texture_Trans.png',
    sections: [
      {
        title: 'What\'s New in EoD',
        content:
          'End of Dragons introduces Cantha — an Asian-inspired continent. New mechanics include Skiffs (boats for water navigation), the Jade Bot (a utility companion), and the Siege Turtle (two-player mount). EoD also adds 9 elite specializations — one for each profession.',
        tips: [
          'The Jade Bot can be upgraded with Jade Bot Modules for passive stat bonuses and utility effects.',
          'Skiffs are useful for fishing and reaching some coastal events.',
        ],
      },
      {
        title: 'EoD Meta Events',
        content: 'EoD has multiple worthwhile metas:',
        list: [
          'Seitung Province — Aetherblade Hideout meta (also a Strike Mission)',
          'New Kaineng City — Jade Brotherhood meta, urban multi-phase event',
          'Dragon\'s End — Soo-Won meta, the flagship EoD meta with excellent rewards',
          'Gyala Delves — multi-tiered underground mine meta',
        ],
        warnings: [
          'Dragon\'s End (Soo-Won) is one of the hardest open-world metas — it requires significant community coordination and has a hard enrage timer.',
        ],
      },
      {
        title: 'EoD Fishing',
        content:
          'EoD introduced fishing as a standalone activity. Fish using a fishing rod (crafted or purchased) from a skiff or specific fishing spots. Fisher achievements reward skins, titles, and materials. You can also fish with friends from the same skiff.',
      },
    ],
  },

  {
    id: 'jumping-puzzles',
    categoryId: 'openworld',
    title: 'Jumping Puzzles Guide',
    icon: '🧗',
    difficulty: 'beginner',
    summary: 'What jumping puzzles are, tips for completing them, and the best ones to try.',
    readTime: 3,
    sections: [
      {
        title: 'What are Jumping Puzzles?',
        content:
          'Jumping Puzzles are hidden platforming challenges scattered across Tyria. Each has a unique visual marker (a puzzle-piece icon) and a chest reward at the end. Completing a puzzle for the first time awards Transmutation Charges, crafting materials, and Achievement Points.',
        tips: [
          'Jumping Puzzles have a once-per-day chest reward. You can replay the puzzle, but the chest only gives items once daily.',
          'Mounts are disabled inside most jumping puzzles.',
        ],
      },
      {
        title: 'Beginner Recommendations',
        content: 'Good jumping puzzles to start with:',
        list: [
          'Urmaug\'s Secret (Lion\'s Arch) — very short, good introduction',
          'Skipping Stones (Caledon Forest) — gentle, beginner-friendly',
          'Goemm\'s Lab (Metrica Province) — portal-based, unique gimmick',
          'Spekks\'s Laboratory (Rata Sum) — Asura lab theme, moderate difficulty',
          'Chalice of Tears (Dry Top) — desert theme, moderate',
          'Weyandt\'s Revenge (Lion\'s Arch) — long and challenging, worthwhile reward',
        ],
      },
      {
        title: 'Tips for Completion',
        content:
          'Watch your camera angle — awkward camera angles cause most deaths. Keep your camera zoomed out to see upcoming platforms. Mesmer Portal is useful: a Mesmer can escort you by placing a portal at a hard jump so you can retry without starting over.',
        warnings: [
          'Some jumping puzzles have enemy interference (players can knock you off in WvW JP zones). Check if a puzzle is in WvW before entering with a new character.',
        ],
      },
    ],
  },

  {
    id: 'dungeons-guide',
    categoryId: 'openworld',
    title: 'Dungeons Overview',
    icon: '⚔️',
    difficulty: 'intermediate',
    summary: 'GW2\'s original 5-player instanced content — still worth doing for lore, skins, and gold.',
    readTime: 4,
    sections: [
      {
        title: 'What are Dungeons?',
        content:
          'Dungeons are 5-player instanced content with a Story Mode and 2–3 Explorable (Exp) paths each. They were the original endgame at launch. While no longer the gold meta, they reward unique dungeon skins and tokens that can be exchanged for Exotic gear.',
        list: [
          'Ascalonian Catacombs (AC) — easiest, great for learning, ghosts theme',
          'Caudecus\'s Manor (CM) — short, multiple paths, garden/manor',
          'Twilight Arbor (TA) — Nightmare Court, requires some coordination',
          'Sorrow\'s Embrace (SE) — Inquest lab, more complex mechanics',
          'Citadel of Flame (CoF) — fast paths, very popular for quick gold farm',
          'Honor of the Waves (HotW) — Kodan theme, slightly harder',
          'Crucible of Eternity (CoE) — Inquest boss, complex',
          'Ruined City of Arah (Arah) — hardest dungeon, Elder Dragon lore',
        ],
      },
      {
        title: 'Why Run Dungeons?',
        content: 'Despite not being the meta gold farm, dungeons offer:',
        list: [
          'Unique skin sets — some are unavailable anywhere else',
          'Cultural armor sets unlock — used in legendary precursor collections',
          'Map completion contribution',
          'Quick gold in about 20–40 minutes per path',
          'Fun group content that teaches basic instanced mechanics',
        ],
        tips: ['CoF Path 1 is famous for being the fastest gold-per-minute dungeon run.'],
      },
    ],
  },

  {
    id: 'gathering-economy',
    categoryId: 'openworld',
    title: 'Gathering & Resource Nodes',
    icon: '⛏️',
    difficulty: 'beginner',
    summary: 'How gathering works, what tools to use, and how to maximize material income.',
    readTime: 3,
    sections: [
      {
        title: 'Gathering Basics',
        content:
          'Every map has gathering nodes: Ore Veins (mining pick), Lumber Saplings (logging axe), and Plant Patches (sickle). Each character can gather every node once per day per map. Use the correct gathering tool tier — you cannot mine Rich nodes with a low-tier pick.',
        tips: [
          'Unbreakable gathering tools (Gem Store) never need replacement and are worth the investment.',
          'Some tools have bonus effects — the Copper-Fed Salvage-o-Matic (Gem Store) auto-salvages junk loot.',
        ],
      },
      {
        title: 'Most Valuable Nodes',
        content: 'Not all nodes are equally valuable. Prioritize:',
        list: [
          'Rich Orichalcum Veins — highest-tier ore; found in Frostgorge Sound, Cursed Shore, PoF maps',
          'Rich Ancient Wood — top-tier lumber; found in Malchor\'s Leap, Cursed Shore',
          'Mithril Ore — mid-tier, extremely high demand for Ascended crafting components',
          'Flax Seed — from LS3 maps (Ember Bay, Bitterfrost Frontier, etc.), used in Ascended crafting',
          'Maguuma Lily and Lotus — PoF plants used in food and LS4 crafting',
          'Porous Bone / Maguuma Wasps — cloth and leather components from HoT gathering',
        ],
      },
      {
        title: 'Best Daily Gathering Routes',
        content: 'Efficient routes to hit the most valuable nodes per character per day:',
        list: [
          'Cursed Shore (Core) — Rich Orichalcum + Rich Ancient Wood; densest high-tier node map; Desmina\'s Hallows area for least mob interference',
          'Frostgorge Sound (Core) — Orichalcum at Arundon Vale [&BPIFAAA=]; Ancient Wood via swim from Slough of Despond Waypoint [&BDMGAAA=] northwest',
          'Malchor\'s Leap (Core) — Rich Ancient Wood + Orichalcum; good secondary route to Cursed Shore',
          'Verdant Brink (HoT) — 8 Flax nodes at Jaka Itzel (base of the great tree)',
          'Draconis Mons (LS3) — 10 Flax nodes at Savage Rise / Druid\'s Grotto cave; use updrafts to speed through',
          'Drizzlewood Coast (IBS) — Winter Root Vegetables + nodes at Base Camp [&BH8LAAA=]; combine with meta for maximum efficiency',
          'Thunderhead Peaks (LS4) — 8 Iron + 7 Platinum Ore nodes on clifftops; one of best density mid-tier routes',
          'Domain of Vabbi (PoF) — Mithril + Hardwood + PoF plants; flat Raptor-friendly map',
        ],
        tips: [
          'Use an unbreakable gathering tool from the Gem Store — it never expires and some have bonus procs.',
          'Run gathering routes on multiple characters to multiply daily income from the same nodes.',
          'BlishHUD + Tekkit\'s Workshop marker packs show node positions on-screen — dramatically speeds up routes.',
          'Home instance gathering + one external route per character is the most time-efficient daily setup.',
        ],
      },
    ],
  },

  // ─── Fractals (additional) ───────────────────────────────────────────────────

  {
    id: 'fractal-instabilities',
    categoryId: 'fractals',
    title: 'Fractal Instabilities Guide',
    icon: '⚠️',
    difficulty: 'intermediate',
    summary: 'Every Instability explained, how to counter them, and how they affect your builds.',
    readTime: 5,
    sections: [
      {
        title: 'What are Instabilities?',
        content:
          'At T2 and above, Fractal Scales have Instabilities — modifiers that change the rules of combat for that run. Each scale has a fixed set of 1–3 Instabilities. Understanding them is key to not dying to mechanics that seem random.',
        tips: [
          'Check instabilities in the Fractals panel before entering to prepare your build.',
          'The Fractals screen in this app shows the current daily instabilities.',
        ],
      },
      {
        title: 'Common Instabilities and Counters',
        content: '',
        list: [
          'Afflicted — enemies apply random conditions every few seconds. Counter: bring condition cleanses.',
          'Boon Overload — having more than one boon applies Burning. Counter: run fewer boons or bring a healer to handle the burning.',
          'Flux Bomb — random players get a bomb debuff that explodes for AoE. Counter: run away from the group when you get it.',
          'Hamstrung — dodging deals damage to yourself. Counter: dodge less, use blocks and invulnerability instead.',
          'Last Laugh — enemies explode on death. Counter: spread out, use condition cleanse after kills.',
          'Mirage — enemies create illusions. Counter: focus on the real enemy (no green glowing effect).',
          'No Pain, No Gain — enemies gain boons when hit. Counter: bring boon removal (Scourge, Mesmer, Renegade).',
          'Outflanked — flanking attacks deal +50% damage. Counter: face the boss away from your group.',
          'Slippery Slope — movement skills cause enemies to gain Stability. Counter: avoid movement skills near enemies.',
          'Social Awkwardness — spread out from allies or take damage. Counter: keep distance from teammates.',
          'Toxic Trail — enemies leave a poison trail. Counter: reposition carefully, avoid standing in trails.',
          'Vengeance — downed enemies regenerate. Counter: stomp/finish downed enemies immediately.',
          'Volcanic — meteors fall periodically. Counter: watch for shadow on the ground and move.',
          'We Bleed Fire — critical hits apply Burning. Counter: run Sigil of Cleansing or bring condition removal.',
        ],
      },
    ],
  },

  {
    id: 'fractal-recs',
    categoryId: 'fractals',
    title: 'Recommended Fractal Builds',
    icon: '🌀',
    difficulty: 'intermediate',
    summary: 'Best builds and compositions for T4 fractals and Challenge Modes.',
    readTime: 4,
    sections: [
      {
        title: 'General T4 Composition',
        content:
          'A standard T4 group uses: 1 Quickness support (usually Firebrand), 1 Alacrity support (Renegade or Mechanist), 1 Healer (if needed for CMs), and 3–4 DPS. Groups with a dedicated healer are safer; experienced groups often run "boon DPS" — supports who also deal significant damage.',
        tips: [
          'Quickbrand (Firebrand with Quickness build) is the most common fractal support and is beginner-friendly.',
          'Virtuoso (Bladesong Mesmer) is an excellent DPS choice for fractals due to high portal utility.',
        ],
      },
      {
        title: 'Role by Tier',
        content: '',
        list: [
          'T1 (learning): Any build works. Focus on mechanics, not optimization.',
          'T2: Consider adding some Toughness or Vitality for survivability. Build for your class\'s basic rotation.',
          'T3: Bring full meta builds. Know your instabilities. Bring at least one condition cleanser.',
          'T4: Full Ascended gear, 150 AR, meta builds, food and utilities, good knowledge of each fractal.',
          'CM: Top-tier builds, perfect rotations, full Ascended with WvW/fractal infusions.',
        ],
      },
    ],
  },

  {
    id: 'shattered-observatory',
    categoryId: 'fractals',
    title: 'Shattered Observatory — Fractal Guide',
    icon: '🔭',
    difficulty: 'advanced',
    summary: 'Mechanics and tips for the Shattered Observatory fractal including Arkk CM.',
    readTime: 5,
    sections: [
      {
        title: 'Overview',
        content:
          'The Shattered Observatory fractal has three bosses: Skorvald, Artsariiv, and Arkk. It is one of the most popular fractals and has a Challenge Mode (CM) version for Arkk. Among the six fractal CMs, SO CM is considered the most popular entry point; Lonely Tower CM (Eparch) is generally considered the hardest overall.',
      },
      {
        title: 'Skorvald the Shattered',
        content:
          'Skorvald teleports around and throws projectiles. At 66% and 33% HP, he teleports to four islands — you must follow him quickly (bring a teleport skill). Key mechanic: Solar Bolt projectiles that must be avoided or reflected.',
        tips: [
          'Bring Feedback (Mesmer) or Wall of Reflection (Guardian) to reflect Solar Bolts.',
        ],
      },
      {
        title: 'Artsariiv',
        content:
          'Artsariiv creates clones and uses orbs. Key mechanic: Spectral Shockwaves — these must be jumped over or they knock you off the platform. At 50%, she splits into multiple copies. Kill the real one (no copy aura).',
        warnings: [
          'Standing on the edge of the platform is dangerous — shockwaves will knock you off.',
        ],
      },
      {
        title: 'Arkk (Normal & CM)',
        content:
          'Arkk is the final boss with one of the most complex mechanics in fractals: the Temporal Anomaly. A purple orb appears — it must be killed before it reaches Arkk or the group wipes. He also uses Starburst Cascade (AoE rings) and launches bombs at players.',
        warnings: [
          'Arkk CM adds a Pulsing Shockwave phase — all five players must synchronize jumps or take lethal damage.',
          'Kill the Temporal Anomaly as your highest priority at all times.',
        ],
      },
    ],
  },

  {
    id: 'nightmare-fractal',
    categoryId: 'fractals',
    title: 'Nightmare CM — Fractal Guide',
    icon: '👿',
    difficulty: 'advanced',
    summary: 'MAMA, Siax, and Ensolyss — the Nightmare CM explained.',
    readTime: 5,
    sections: [
      {
        title: 'Overview',
        content:
          'The Nightmare fractal takes place inside the Nightmare Court\'s facility. Three bosses: MAMA, Siax the Corrupted, and Ensolyss of the Endless Torment. CM versions add significantly more mechanics and require tight DPS checks.',
      },
      {
        title: 'MAMA',
        content:
          'MAMA creates green circles (stand in them to remove stacks). Her key mechanic is the Knight spawns — small adds that fixate on players and must be CC\'d (breakbar) before they reach the group.',
        tips: ['Stack tightly in the green circle to share stacks. Everyone in the circle at once clears it.'],
      },
      {
        title: 'Siax the Corrupted',
        content:
          'Siax has one of the strictest DPS checks in fractals. He echoes player actions — any skills you use, he uses back. Key mechanic: Volatile Nightmares spawn adds that buff Siax. Two players should always intercept and kill them immediately.',
        warnings: [
          'Failing the DPS check on Siax CM (not killing him fast enough) is the most common wipe cause. Bring full meta builds.',
        ],
      },
      {
        title: 'Ensolyss of the Endless Torment',
        content:
          'Ensolyss teleports to the center at 80%/60%/40% HP and must be caught and CC\'d quickly. His Shockwave must be jumped. In CM, he gains a Boon Overload and increased damage at lower health.',
      },
    ],
  },

  // ─── Raids (additional) ──────────────────────────────────────────────────────

  {
    id: 'spirit-vale',
    categoryId: 'raids',
    title: 'Spirit Vale — Wing 1 Guide',
    icon: '👻',
    difficulty: 'advanced',
    summary: 'Bosses and mechanics of Spirit Vale, the first raid wing and best entry point.',
    readTime: 6,
    sections: [
      {
        title: 'Overview',
        content:
          'Spirit Vale is the first raid wing and is recommended as the starting point for new raiders. It has three bosses: Vale Guardian, Spirit Woods (event), and Gorseval the Multifarious.',
        tips: ['Spirit Vale is generally considered the easiest wing — use it to learn raid mechanics.'],
      },
      {
        title: 'Vale Guardian',
        content:
          'Vale Guardian splits into three colored guardians (Red, Blue, Green) at 66% and 33% HP. Each deals unique mechanics: Blue teleports, Green creates a deadly field, Red spawns seekers. Key rule: each guardian should be tanked on their matching color floor tile.',
        list: [
          'Red Guardian — seeker spawns, tank on red tiles',
          'Blue Guardian — teleports, tank on blue tiles',
          'Green Guardian — pulsing death field, kill quickly',
          'Seekers chase players — lead them away from the group',
        ],
        warnings: ['If guardians overlap on wrong tiles, the raid group takes devastating damage.'],
      },
      {
        title: 'Spirit Woods (Event)',
        content:
          'Between bosses, the group must navigate Spirit Woods — a dangerous forest with spirits that drain health. Move quickly and stay together. One player must carry the special light orb to open the path forward.',
      },
      {
        title: 'Gorseval the Multifarious',
        content:
          'Gorseval cannot be damaged while his protective shield is up. To remove it, kill the four Charged Souls at the edges of the arena. He slams with Ghastly Rampage (green AoE) and World Eater (massive wipe mechanic on low HP). Precast CC to break his bar during the shield phase.',
        warnings: [
          'World Eater will wipe the group if not enough damage is dealt before the cast completes. This is a DPS check.',
        ],
      },
    ],
  },

  {
    id: 'raid-kill-proof',
    categoryId: 'raids',
    title: 'Kill Proof & Finding Raid Groups',
    icon: '🏅',
    difficulty: 'intermediate',
    summary: 'How Kill Proof works, how to earn it, and how to break into PUG raiding.',
    readTime: 4,
    sections: [
      {
        title: 'What is Kill Proof?',
        content:
          'Kill Proof (KP) is community shorthand for evidence that you\'ve completed raid content. PUG groups use KP to filter for experienced players since there\'s no official GW2 kill history. KP is typically shown by linking Legendary Insights or specific tokens in chat.',
        list: [
          'Legendary Insights (LI) — drop from each wing clear, most universal KP currency',
          'Legendary Divinations — from Wing 7, equivalent to LI',
          'Boss Tokens — unique drops per wing (e.g., Dhuum\'s Soul Energy, Dhuum Coins)',
        ],
        tips: [
          'killproof.me is a community website that lets you share your raid KP publicly.',
          'Link your killproof.me profile in LFG groups as a shortcut instead of manually linking items.',
        ],
      },
      {
        title: 'How to Get Your First KP',
        content: 'The chicken-and-egg problem: you need KP to get into groups, but need groups to get KP. Solutions:',
        list: [
          'Training runs — LFG often has [Train] groups that explicitly welcome new players',
          'Raid Academy Discord — dedicated community for teaching raids, no KP required',
          'Bring a friend who already raids — one experienced player can get a training group to take you',
          'Guild raids — many guilds run weekly raids open to members regardless of experience',
        ],
        warnings: [
          'Never misrepresent your experience in a PUG. Getting caught wastes the entire group\'s time. Be honest about your skill level.',
        ],
      },
    ],
  },

  // ─── Strikes (additional) ────────────────────────────────────────────────────

  {
    id: 'ibs-strikes',
    categoryId: 'strikes',
    title: 'Icebrood Saga Strikes — Full Guide',
    icon: '❄️',
    difficulty: 'intermediate',
    summary: 'All six IBS strike missions: mechanics, rewards, and which to prioritize.',
    readTime: 5,
    sections: [
      {
        title: 'Why Do IBS Strikes?',
        content:
          'Icebrood Saga strikes are the easiest strike missions and ideal for beginners learning group instanced content. They drop unique weapons and materials. Even at endgame, some players run them for fast completion and daily rewards.',
      },
      {
        title: 'Strike Bosses Overview',
        content: '',
        list: [
          'Shiverpeaks Pass — Fraenir (Ice boss), two-phase fight, pull adds with CC',
          'Voice and Claw of the Inquisition — dual bosses fought simultaneously, cleave both down at the same HP %',
          'Fraenir of Jormag — same Fraenir encounter extended, adds a freeze mechanic',
          'Boneskinner — horror boss, stay in the light rings or die instantly',
          'Whisper of Jormag — reflections phase, kill the copies in order',
          'Cold War — defend the braziers while fighting two bosses',
        ],
        tips: [
          'The Boneskinner is the most unique and punishing — groups that don\'t understand the Light Ring mechanic will wipe repeatedly.',
        ],
      },
      {
        title: 'Rewards',
        content: 'IBS strikes award unique weapons from the "Icebrood" weapon set and Striker\'s Coins. Coins can be exchanged at the Stormcaller\'s vendor for stat-selectable gear.',
      },
    ],
  },

  {
    id: 'eod-strikes',
    categoryId: 'strikes',
    title: 'End of Dragons Strikes — Full Guide',
    icon: '🐉',
    difficulty: 'intermediate',
    summary: 'All five EoD strike missions and their Challenge Modes.',
    readTime: 5,
    sections: [
      {
        title: 'Overview',
        content:
          'EoD strike missions are 10-player content set in the EoD story locations. They drop unique gear, currencies for Legendary Armor components, and EoD-specific materials. Challenge Modes are significantly harder and are considered mini-raid content.',
      },
      {
        title: 'Strike Bosses',
        content: '',
        list: [
          'Aetherblade Hideout — Ankka & Minister Li: dual bosses with shared HP, alternating mechanics',
          'Xunlai Jade Junkyard — Jade Mech CE-74 "Godspit": junk-launching boss, avoid the salvage waves',
          'Kaineng Overlook — Mai Trin & Scarlet: Mai Trin exerts Scarlet\'s influence, breakbar-heavy fight',
          'Harvest Temple — The Dragonvoid: multi-phase encounter, probably the most complex normal-mode strike',
          'Old Lion\'s Court — Watchknights (3 bosses): fight three White Mantle constructs simultaneously',
        ],
        tips: [
          'Harvest Temple has the most complex mechanics of any normal-mode strike — watch a guide video before your first attempt.',
        ],
      },
      {
        title: 'Challenge Modes',
        content:
          'EoD CM strikes are among the best sources of Legendary Armor materials. They require meta builds, coordinated CC, and mechanics knowledge. Expect to wipe repeatedly when learning.',
        list: [
          'CM Aetherblade Hideout — adds reflect bubbles and faster DPS requirement',
          'CM Kaineng Overlook — Scarlet\'s Ghosts add a dodge-intensive phase',
          'CM Harvest Temple — adds multiple simultaneous void mechanics',
        ],
        warnings: [
          'Most CM groups require prior experience and/or Kill Proof. Use the [Train] LFG tag to find teaching runs.',
        ],
      },
    ],
  },

  // ─── WvW (additional) ────────────────────────────────────────────────────────

  {
    id: 'wvw-zerg',
    categoryId: 'wvw',
    title: 'Zerg Gameplay & Commander Calls',
    icon: '⚔️',
    difficulty: 'intermediate',
    summary: 'How to play in a WvW zerg effectively — positioning, calls, and group builds.',
    readTime: 5,
    sections: [
      {
        title: 'What is a Zerg?',
        content:
          'A zerg is a large group of players (typically 20–80) moving and fighting together under a Commander tag. Zergs contest large objectives, siege keeps, and fight enemy zergs in open-field battles called "blobs." Zerg play requires coordination but is the core of organized WvW.',
      },
      {
        title: 'Commander Calls',
        content: 'Learn these common commander calls used in map chat and voice comms:',
        list: [
          '"Stack" or "Stay stacked" — cluster tightly on the commander for AoE heals and boons',
          '"Blast" — use blast finishers on the designated combo field for Might stacks',
          '"Split" or "Spread" — spread out to avoid AoE damage',
          '"Push" — move forward aggressively to engage the enemy',
          '"Pull back" / "Retreat" — disengage from the current fight',
          '"Bomb" — coordinated burst of damage skills all used simultaneously',
          '"Spike [target]" — instantly focus all DPS on a single target',
          '"INC [direction/gate]" — enemies incoming, specific location',
        ],
        tips: [
          'Follow the tag. If you don\'t know what to do, stay near the commander.',
          'Put away weapons when running — it\'s faster.',
        ],
      },
      {
        title: 'Meta Zerg Builds',
        content:
          'WvW zerg meta changes frequently but generally favors:',
        list: [
          'Scourge (Necromancer) — barrier spam, condition application in large AoE',
          'Spellbreaker (Warrior) — full counter boon strip, disrupts boon balls',
          'Scrapper (Engineer) — gyro-based heals and stability',
          'Firebrand (Guardian) — boons + Tome of Courage for mass Aegis',
          'Specter (Thief) — shadowstep to allies for healing',
        ],
        warnings: [
          'Glass cannon builds (Berserker gear) are punishing in zergs — one bad position and you\'re dead. Run some Toughness or Vitality in your first zerg builds.',
        ],
      },
    ],
  },

  {
    id: 'wvw-guilds',
    categoryId: 'wvw',
    title: 'Guilds & Guild Missions in WvW',
    icon: '🏰',
    difficulty: 'intermediate',
    summary: 'How guilds participate in WvW, claim objectives, and run coordinated content.',
    readTime: 3,
    sections: [
      {
        title: 'Guild Claims',
        content:
          'Guilds can claim WvW objectives (towers, keeps, castles). A claimed objective shows the guild\'s emblem on the map and earns the guild Guild Commendations over time. Claimed structures get a slight buff from the guild\'s Guild Upgrades.',
        tips: ['You can only claim objectives your server currently controls.'],
      },
      {
        title: 'Guild Upgrades',
        content:
          'Guilds can slot upgrades into claimed WvW objectives: additional guards, siege stockpiles, emergency waypoints, and more. Higher-tier guild halls unlock stronger upgrades.',
      },
      {
        title: 'WvW Guild Halls',
        content:
          'Every guild can have a Guild Hall (unlocked in HoT). WvW activities contribute Guild Commendations used to purchase WvW upgrades in the Guild Hall. Active WvW guilds often have a designated "WvW Night" to maximize coordinated objective captures.',
      },
    ],
  },

  // ─── PvP (additional) ────────────────────────────────────────────────────────

  {
    id: 'pvp-maps',
    categoryId: 'pvp',
    title: 'PvP Maps & Node Strategies',
    icon: '🗺️',
    difficulty: 'intermediate',
    summary: 'Every Conquest map, its layout, and the key strategy differences between them.',
    readTime: 4,
    sections: [
      {
        title: 'Standard Conquest Maps',
        content:
          'All ranked maps use the Conquest format with three nodes. The positioning and layout of nodes changes the optimal rotation strategy on each map:',
        list: [
          'Battle of Kyhlo — three nodes at corners of a triangle, clock tower mid is common burst position',
          'Forest of Niflhel — mid node is open, two large beasts (Lord Killers) can tip the score',
          'Legacy of the Foefire — ghosts on the map, killing the lord is a viable secondary win condition',
          'Temple of the Silent Storm — vertical map, special shrines reduce incoming damage',
          'Skyhammer — ledge with a cannon mechanic, knockback plays are decisive',
          'Stronghold — unique mode: attack enemy Lord instead of holding capture points',
        ],
        tips: [
          'Niflhel: killing the Beast early can swing a close match — watch for teams roaming to the Beast.',
          'Skyhammer: position away from ledges. One knockback ends your fight.',
        ],
      },
      {
        title: '+1 Rotations',
        content:
          'The basic PvP rotation is: send one player to Far, two to Mid, and two to Home. Once your team has two nodes, rotate to +1 the third. When winning, fight near the enemy\'s home to slow them from decapping yours.',
        warnings: [
          'Do not chase kills across the map. Killing someone while losing your node is almost always the wrong call.',
        ],
      },
    ],
  },

  {
    id: 'pvp-tips',
    categoryId: 'pvp',
    title: 'PvP Tips for Improvement',
    icon: '📈',
    difficulty: 'intermediate',
    summary: 'Practical advice for improving your ranked PvP rating.',
    readTime: 4,
    sections: [
      {
        title: 'Minimap Awareness',
        content:
          'The minimap is your most important tool. Watch it every few seconds. If the enemy roamer disappears from mid, they\'re rotating — warn your teammates. Proactive communication wins more games than individual skill.',
        tips: [
          'Ping the minimap (hold Alt + click) to signal enemy positions to teammates without typing.',
        ],
      },
      {
        title: 'Knowing When to Disengage',
        content:
          'Fighting a 1v1 forever on a point you\'re losing is throwing the match. If you\'re losing your node and the fight, disengage and rotate. Giving up one point is recoverable; wasting 60 seconds in a losing fight is not.',
        list: [
          'Disengage if: you\'re below 30% health and no help is coming',
          'Disengage if: your team is losing two other nodes while you\'re stuck in a 1v1',
          'Re-engage if: your CD skills are available and enemy is also low',
        ],
      },
      {
        title: 'Build Consistency',
        content:
          'Switching builds every session prevents you from developing muscle memory. Pick one build from Metabattle, play it for 20–30 matches, and learn its strengths and weaknesses before evaluating it.',
        warnings: [
          'Playing off-meta builds in ranked is fine but accept that you\'re accepting a harder climb. Coordinate with a duo queue partner if running niche builds.',
        ],
      },
    ],
  },

  // ─── Economy (additional) ────────────────────────────────────────────────────

  {
    id: 'tp-flipping',
    categoryId: 'economy',
    title: 'Trading Post Flipping',
    icon: '📈',
    difficulty: 'advanced',
    summary: 'How to profit from buying low and selling high on the TP.',
    readTime: 5,
    sections: [
      {
        title: 'What is Flipping?',
        content:
          'Flipping means posting buy orders below the current sell price and then relisting those items at a higher sell price once your order fills. The spread between the two prices minus the 15% TP fee is your profit. Successful flipping requires knowing the price history of items.',
        tips: [
          'Use gw2efficiency.com or gw2tp.net to analyze price history. Look for items where the spread is 20%+ to account for the 15% tax and have your profit margin.',
        ],
      },
      {
        title: 'Best Items to Flip',
        content: 'These categories have historically good flip potential:',
        list: [
          'T5 and T6 crafting materials — high volume, consistent demand, small but reliable margins',
          'Cooking ingredients (Vanilla Bean, Saffron Thread, etc.) — low visibility, less competition',
          'Dungeon tokens turned into equipment — requires effort but good margins',
          'Unidentified gear (Rare/Exotic) — bulk buy and salvage for Ectos or sell during price spikes',
          'Black Lion items after a new chest key season — prices often drop on release and recover',
        ],
      },
      {
        title: 'Risk Management',
        content:
          'Flipping has risks. A game update can crash prices overnight. Never put more than 20% of your gold into a single flip. Diversify across multiple items. Monitor your listings daily — an undercut can mean your items sit unsold.',
        warnings: [
          'Market speculation (buying items hoping the price rises) can result in significant losses. Stick to high-volume items with stable demand until you understand the market.',
        ],
      },
    ],
  },

  {
    id: 'gem-to-gold',
    categoryId: 'economy',
    title: 'Gem Store & Currency Conversion',
    icon: '💎',
    difficulty: 'beginner',
    summary: 'Converting between Gems and Gold, and getting value from the Gem Store.',
    readTime: 3,
    sections: [
      {
        title: 'Gems to Gold (and Back)',
        content:
          'You can convert Gold to Gems or Gems to Gold at any Gem Store kiosk. The exchange rate fluctuates with supply and demand. Converting Gems to Gold is a valid way to turn real-money purchases into in-game currency, but be aware the exchange rate varies significantly.',
        tips: [
          'Gem prices tend to be lower after major game releases and higher near holidays.',
          'Check the current rate at the Gem Store kiosk before converting large amounts.',
        ],
      },
      {
        title: 'Best Gem Store Purchases for Gold Value',
        content: 'These items provide lasting value and are commonly recommended:',
        list: [
          'Permanent Bank Access Express — saves countless trips to a bank',
          'Permanent Trading Post Express — buy/sell anywhere',
          'Shared Inventory Slots — account-wide open inventory slots, extremely convenient',
          'Copper-Fed Salvage-o-Matic — never run out of salvage kits again',
          'Mystic Forge Conduit — access the Forge from anywhere',
          'Expansions — these are the best value, adding massive amounts of content',
        ],
      },
    ],
  },

  {
    id: 'salvaging-ectos',
    categoryId: 'economy',
    title: 'Salvaging & Ectos',
    icon: '🔮',
    difficulty: 'beginner',
    summary: 'How to salvage gear efficiently and maximize Glob of Ectoplasm yield.',
    readTime: 3,
    sections: [
      {
        title: 'Salvage Kit Types',
        content:
          'Salvage kits convert gear into crafting materials. Higher-tier kits have better chances at rare materials and upgrade extraction:',
        list: [
          'Basic Salvage Kit — for White/Blue gear, low cost',
          'Fine Salvage Kit — better chance at crafting materials from Blue/Green gear',
          'Journeyman\'s Salvage Kit — Green/Blue gear, good value',
          'Master\'s Salvage Kit — for Yellow (Rare) gear to extract upgrades',
          'Mystic Salvage Kit (Mystic Forge) — best overall returns, 250 charges',
          'Black Lion Salvage Kit — guaranteed upgrade extraction, use on Exotics only',
        ],
      },
      {
        title: 'Maximizing Ectos',
        content:
          'Globs of Ectoplasm drop from salvaging Rare (Yellow) and Exotic (Orange) gear level 68+. They are one of the most important crafting materials in the game, required for almost all Legendary gear. Use Master\'s or Mystic Salvage Kits on Rare gear — Basic kits have very poor Ecto rates.',
        tips: [
          'Always use Master\'s Salvage Kit or better on Rare items level 68+.',
          'Check the Ecto price on the TP. If a Rare item costs less than ~18 silver on the TP, it\'s usually better to buy and salvage than to sell.',
          'Exotic gear can be sold or salvaged — compare sell price vs expected Ecto + material value.',
        ],
      },
    ],
  },

  {
    id: 'material-storage',
    categoryId: 'economy',
    title: 'Material Storage & Crafting Economy',
    icon: '📦',
    difficulty: 'intermediate',
    summary: 'Managing your material storage, what to keep, and what to sell.',
    readTime: 3,
    sections: [
      {
        title: 'What to Keep',
        content:
          'Material Storage holds up to 2500 stacks of each material. Some items are always worth keeping:',
        list: [
          'T6 Fine Crafting Materials (Vicious Claws, Powerful Blood, etc.) — Legendary gear components',
          'Globs of Ectoplasm — universal crafting ingredient',
          'Mystic Coins — slow to accumulate, used in most Legendary recipes',
          'Ascended crafting materials (Deldrimor Steel, Elonian Leather, etc.)',
          'Rare and Exotic equipment — salvage or sell depending on TP prices',
          'Bloodstone Dust / Empyreal Fragments / Dragonite Ore — needed for Legendary',
        ],
      },
      {
        title: 'What to Sell',
        content:
          'These items are generally better sold than stockpiled unless you have a specific use for them:',
        list: [
          'T5 materials — unless you need them for crafting',
          'Dungeon tokens you\'ve already converted',
          'Duplicate skins (sell to get gold for the ones you actually want)',
          'Food and utility buffs you won\'t use',
        ],
        tips: ['Check gw2efficiency.com\'s "Value of Your Materials" tool for a snapshot of what your storage is worth.'],
      },
    ],
  },

  // ─── Crafting & Legendaries (additional) ────────────────────────────────────

  {
    id: 'ascended-crafting',
    categoryId: 'crafting',
    title: 'Ascended Gear Crafting',
    icon: '🌟',
    difficulty: 'intermediate',
    summary: 'Everything you need to know about crafting Ascended weapons and armor.',
    readTime: 5,
    sections: [
      {
        title: 'Why Craft Ascended?',
        content:
          'Ascended gear is required for Infusion Slots (needed for Agony Resistance in fractals) and provides roughly 5% better stats than Exotic. It is also required to craft Legendary weapons and armor. While not mandatory for most content, it\'s a long-term progression goal.',
        tips: [
          'For most content, Exotic gear is sufficient. Don\'t rush Ascended until you\'re running T3+ fractals or raiding.',
        ],
      },
      {
        title: 'Raising Crafting to 500',
        content:
          'Most crafting disciplines cap at 400 by default. Expanding to 500 (Artificer, Huntsman, Weaponsmith, Armorsmith, Leatherworker, Tailor) requires the Heart of Thorns or Path of Fire expansion. Level the discipline using standard crafting recipes to 400, then use "Thermocatalytic Reagent" to craft items in the 400–500 range.',
      },
      {
        title: 'Time-Gated Materials',
        content:
          'Ascended materials have daily/weekly crafting limits — plan accordingly:',
        list: [
          'Deldrimor Steel Ingot — 1 per character per day (requires 10 Mithril + 10 Thermocatalytic Reagent)',
          'Elonian Leather Square — 1 per character per day',
          'Bolt of Damask — 1 per character per day',
          'Spiritwood Plank — 1 per character per day',
          'Charged Quartz Crystal — 1 per character per day (from 25 Quartz Crystals + daylight)',
        ],
        warnings: [
          'You can use multiple characters to craft more per day, but each character has its own daily limit.',
          'Always check gw2efficiency.com for current crafting cost vs TP price before mass-crafting Ascended.',
        ],
      },
      {
        title: 'Prioritizing Ascended Slots',
        content:
          'Not all slots need Ascended at once. For fractals, prioritize:',
        list: [
          '1. Trinkets (rings/accessories) — most infusion slots, can be obtained from fractals and Living World',
          '2. Weapon(s) — large stat contribution',
          '3. Armor — expensive to craft, upgrade last',
        ],
      },
    ],
  },

  {
    id: 'legendary-trinkets',
    categoryId: 'crafting',
    title: 'Legendary Trinkets Guide',
    icon: '💍',
    difficulty: 'advanced',
    summary: 'Aurora, Vision, Coalescence — how to craft the Legendary trinkets.',
    readTime: 5,
    sections: [
      {
        title: 'Why Legendary Trinkets?',
        content:
          'Like Legendary weapons and armor, Legendary trinkets allow free stat swapping and are shared via the Legendary Armory. A ring used by your Guardian can simultaneously be equipped on your Elementalist.',
        list: [
          'Aurora (Amulet) — LS3 collections, requires LS3 episodes',
          'Vision (Accessory) — LS4 collections, requires LS4 episodes',
          'Coalescence (Ring) — Raid drop + collection',
          'Prismatium Ring — Janthir Wilds-specific Legendary',
        ],
      },
      {
        title: 'Aurora',
        content:
          'Aurora is crafted through a set of 6 Living World Season 3 meta-achievements (one per episode). Each meta requires completing events and collection steps in the LS3 maps. It culminates in combining the components at a Mystic Forge recipe.',
        tips: [
          'Aurora\'s collection steps require time in LS3 maps — plan to spend 1–2 weeks doing the prerequisite achievements.',
          'Completing Aurora is also a prerequisite for Vision.',
        ],
      },
      {
        title: 'Vision',
        content:
          'Vision follows the same format as Aurora but uses LS4 maps and episodes. It requires completing Vision\'s components (six collections from LS4) AND owning Aurora. The combined "The Gift of Research" is a component for Vision.',
        warnings: ['You must have Aurora completed before crafting Vision.'],
      },
    ],
  },

  {
    id: 'legendary-backpack',
    categoryId: 'crafting',
    title: 'Legendary Backpacks Guide',
    icon: '🎒',
    difficulty: 'advanced',
    summary: 'How to obtain Ad Infinitum (fractals) and The Ascension (PvP) — the Legendary backpieces.',
    readTime: 4,
    sections: [
      {
        title: 'Ad Infinitum',
        content:
          'Ad Infinitum is a fractal-themed Legendary back item. It requires completing a four-tier collection (Unbound → Finite Loop → Ad Infinitum Tier 3 → Ad Infinitum) that involves running all fractal scales, acquiring specific items, and completing fractal achievements.',
        list: [
          'Requires completing all 100 fractal scales at least once',
          'Requires specific drops from fractal chests',
          'Final tier requires Legendary Insights (raid currency) or an alternative source',
        ],
        tips: [
          'Ad Infinitum is a long-term project but is passively progressed while doing regular fractal dailies.',
        ],
      },
      {
        title: 'The Ascension',
        content:
          'The Ascension is the PvP Legendary back item. It requires completing the "PvP Legendary Backpack" achievement track, which involves reaching high PvP ranks, winning ranked matches, and completing specific PvP meta-achievements.',
        tips: [
          'The Ascension is purely PvP-based — it is one of the best reasons to engage with ranked PvP.',
        ],
      },
    ],
  },

  {
    id: 'gift-of-exploration',
    categoryId: 'crafting',
    title: 'Gift of Exploration',
    icon: '🗺️',
    difficulty: 'intermediate',
    summary: 'Why you need Gift of Exploration, what world completion involves, and tips for efficiency.',
    readTime: 4,
    sections: [
      {
        title: 'What is the Gift of Exploration?',
        content:
          'The Gift of Exploration is awarded twice when you achieve 100% world completion in core Tyria. It is a required component in every Generation 1 Legendary weapon and many other Legendary recipes. Completing the world map is a significant time investment but unlocks a huge amount of content knowledge.',
        tips: [
          'You receive 2× Gift of Exploration per character that completes the world — use an alt for your second legendary if needed.',
          'World completion includes WvW map completion, which can be done during off-hours.',
        ],
      },
      {
        title: 'What Counts Toward Completion',
        content: 'Core Tyria world completion includes:',
        list: [
          'All Points of Interest in every core Tyria map',
          'All Waypoints in every core Tyria map',
          'All Vistas in every core Tyria map',
          'All Hero Challenges in every core Tyria map',
          'PvP Heart of the Mists map (just explore it, no actual PvP)',
          'All four WvW maps (Eternal Battlegrounds + 3 Borderlands)',
        ],
        warnings: [
          'WvW maps require visiting objectives in enemy territory. Go during times when your world controls those areas or use the stealth approach.',
        ],
      },
    ],
  },

  {
    id: 'legendary-runes-sigils',
    categoryId: 'crafting',
    title: 'Legendary Runes & Sigils',
    icon: '✨',
    difficulty: 'advanced',
    summary: 'The Legendary rune and sigil sets — what they do and how to unlock them.',
    readTime: 3,
    sections: [
      {
        title: 'Legendary Runes',
        content:
          'The Legendary Rune set (Rune of the Legendary Defender, etc.) provides a mix of all stat combinations and allows you to freely change which 6-piece rune bonus you use at any time. This is extremely useful for players who switch builds frequently.',
        tips: [
          'Legendary Runes are crafted from multiple sources including raid tokens, fractal currencies, and crafting materials.',
          'A full set of 6 Legendary Runes requires significant investment — prioritize other Legendaries first.',
        ],
      },
      {
        title: 'Legendary Sigils',
        content:
          'The Legendary Sigil works similarly — one sigil slot that can be freely changed to any sigil effect. Most useful for players who frequently swap between power and condition builds on the same character.',
      },
      {
        title: 'Are They Worth It?',
        content:
          'If you actively swap builds on multiple characters, Legendary runes and sigils are excellent quality-of-life investments. If you have one main build per character, buying regular Superior runes and sigils on the TP is far more cost-efficient.',
      },
    ],
  },

  {
    id: 'infusion-fashion',
    categoryId: 'crafting',
    title: 'Cosmetic Infusions',
    icon: '💫',
    difficulty: 'intermediate',
    summary: 'What cosmetic infusions are, how to get them, and which are most popular.',
    readTime: 3,
    sections: [
      {
        title: 'What are Cosmetic Infusions?',
        content:
          'Cosmetic infusions are special infusions that add visual effects to your character (auras, particle effects, color shifts) in addition to their stats. They slot into infusion slots just like Agony Infusions and can be combined with AR infusions using the Mystic Forge.',
        tips: [
          'Cosmetic infusions can be stacked — multiple infusions of the same type increase the visual intensity.',
        ],
      },
      {
        title: 'Popular Cosmetic Infusions',
        content: '',
        list: [
          'Chak Infusion — green mist surrounding your character (from Auric Basin achievements)',
          'Ghostly Infusion — ghostly, ethereal glow (from Wintersday and TP)',
          'Polysaturating Infusion — color-shifting visual overlay',
          'Liquid Aurillium Infusion — gold sparkle aura (from Auric Basin collections)',
          'Phospholuminescent Infusion — bioluminescent glow (TP or rare drop)',
          'Winter\'s Heart Infusion — snow and cold effect',
        ],
        warnings: [
          'Popular cosmetic infusions can cost hundreds or thousands of gold on the TP. Many are time-limited during specific game events.',
        ],
      },
    ],
  },

  // ─── Additional Getting Started ───────────────────────────────────────────────

  {
    id: 'guilds-guide',
    categoryId: 'start',
    title: 'Joining & Using a Guild',
    icon: '🛡️',
    difficulty: 'beginner',
    summary: 'What guilds offer, how to find a good one, and how guild perks work.',
    readTime: 3,
    sections: [
      {
        title: 'Why Join a Guild?',
        content:
          'Guilds provide passive stat buffs (Guild Banners, upgrades), access to the Guild Hall (crafting stations, special merchants), and a community. You can be in up to 5 guilds simultaneously, but only one can be your "represented" guild at a time for contributions.',
        tips: [
          'Represent your most active guild to contribute Guild Merit to that guild\'s upgrades.',
        ],
      },
      {
        title: 'Guild Perks and Hall',
        content:
          'Active guilds unlock their Guild Hall — a large, customizable space with crafting stations, merchants, and access to guild missions. Guild missions (bounties, puzzles, rushes, etc.) award Guild Commendations used for exclusive cosmetics.',
        list: [
          'Guild Mission rewards include unique skins and cosmetics unavailable elsewhere',
          'Guild Banners provide 30-minute buffs (XP, MF, etc.) that all guild members can use',
          'Guild Hall crafting stations allow you to craft without traveling to a city',
        ],
      },
      {
        title: 'Finding a Guild',
        content:
          'Use the in-game LFG system, the GW2 subreddit (r/guildwars2), or the official GW2 Discord to find a guild that matches your playstyle. Casual guilds focus on social play and open world; progression guilds focus on raids or fractals; WvW guilds focus on PvP content.',
      },
    ],
  },

  {
    id: 'currencies-explained',
    categoryId: 'start',
    title: 'Currencies Explained',
    icon: '💰',
    difficulty: 'beginner',
    summary: 'Every major currency in GW2 — what it\'s used for and how to earn it.',
    readTime: 5,
    sections: [
      {
        title: 'Core Currencies',
        content: '',
        list: [
          'Gold — primary currency for the Trading Post, vendors, and crafting',
          'Gems — premium currency purchased with real money or converted from Gold',
          'Laurels — from login rewards and Daily achievements, used for Ascended trinkets',
          'Mystic Coins — from login rewards and Wizard\'s Vault, required for Legendary crafting',
          'Karma — from events and story, used at karma vendors for gear and materials',
          'Spirit Shards — earned at level 80, used in Mystic Forge recipes',
        ],
      },
      {
        title: 'Content-Specific Currencies',
        content: '',
        list: [
          'Fractal Relics — from fractal chests, spent at the fractal vendor for Ascended gear',
          'Pristine Fractal Relics — from fractal daily chests, spent on infusions and gear',
          'Badges of Honor — from WvW combat, capped weekly',
          'WvW Skirmish Claim Tickets — from weekly WvW Skirmish Track, for Legendary gear',
          'PvP League Tokens — from ranked PvP seasons, for PvP Legendary Armor',
          'Astral Acclaim — from Wizard\'s Vault objectives, spent on various rewards',
          'Guild Commendations — from guild missions, for exclusive guild rewards',
        ],
      },
      {
        title: 'Expansion Currencies',
        content: '',
        list: [
          'Airship Parts / Ley-Line Crystals — HoT zone currencies',
          'Volatile Magic — LS3 and LS4 currency for vendors',
          'Unbound Magic — LS3 currency',
          'Research Notes — EoD currency from salvaging specific items',
          'Kryptis Motivation — SotO currency from rifts',
        ],
        tips: [
          'Don\'t stress about collecting every currency. Focus on the ones relevant to your current goals.',
        ],
      },
    ],
  },

  {
    id: 'wvw-progression',
    categoryId: 'wvw',
    title: 'WvW Rank & Abilities',
    icon: '⭐',
    difficulty: 'beginner',
    summary: 'How WvW rank works, which abilities to prioritize, and long-term WvW progression.',
    readTime: 3,
    sections: [
      {
        title: 'WvW Rank',
        content:
          'WvW Rank is your personal progression level in WvW. You earn rank XP from almost every WvW activity: capturing objectives, killing players, defending structures, killing guards. Each rank gives WvW Ability Points to spend.',
        tips: [
          'WvW rank is account-wide and persists across server transfers.',
          'Higher ranks unlock the "Warclaw Master" ability track and more powerful passive bonuses.',
        ],
      },
      {
        title: 'Priority Ability Unlocks',
        content: 'Spend your early WvW Ability Points on these first:',
        list: [
          'Defense Mastery — increased guard respawn suppression when defending',
          'Siege Bunker — reduced siege damage taken (useful for all players)',
          'Supply Mastery — carry more supply (up to 15 instead of 10)',
          'Armor Mastery — increased armor stat in WvW',
          'Battle Historian — increased Kill reward scaling',
        ],
        tips: [
          'Maxing one track is better than spreading points early. Focus on Armor or Supply Mastery first.',
        ],
      },
    ],
  },

  // ─── Combat: Profession Mechanics ───────────────────────────────────────────

  // ─── Open World: Secrets of the Obscure & More ───────────────────────────────

  {
    id: 'soto-guide',
    categoryId: 'openworld',
    title: 'Secrets of the Obscure Overview',
    icon: '🔭',
    difficulty: 'intermediate',
    summary: 'The SotO expansion — Rifts, Kryptis, the Wizard\'s Tower, and Convergences explained.',
    readTime: 5,
    image: 'https://wiki.guildwars2.com/images/4/44/Secrets_of_the_Obscure_logo.png',
    sections: [
      {
        title: 'What is Secrets of the Obscure?',
        content:
          'Secrets of the Obscure (SotO) is GW2\'s fourth expansion, set in the Skywatch Archipelago and Amnytas. The central threat is the Kryptis — a demonic race breaking through Rifts from their realm. The Wizard\'s Tower (home base) floats above Tyria and acts as the new hub.',
        tips: [
          'SotO introduced "Weaponmaster Training" — a mastery allowing professions to use existing weapon types previously exclusive to their elite specs. This is NOT a new weapon type; it unlocks access to already-existing weapons. Janthir Wilds (2024) was the first expansion to add a truly new weapon type: the Spear (land-based).',
          'The Wizard\'s Vault daily/weekly objectives system replaces the old Daily Achievement reward track.',
        ],
      },
      {
        title: 'Rifts',
        content:
          'Rifts are tears in the sky that periodically appear across SotO maps. They spawn Kryptis enemies and must be closed by killing enough mobs. Tier 1, 2, and 3 Rifts have increasing difficulty and reward quality. Higher-tier rifts require Rift Mastery unlocks and drop better Kryptis Motivation and materials for Legendary Armor.',
        list: [
          'Tier 1 Rifts — solo-able, good for beginners learning the mechanic',
          'Tier 2 Rifts — small group content, require Rift Mastery rank 2',
          'Tier 3 Rifts — group content, best rewards, require Rift Mastery rank 3',
        ],
      },
      {
        title: 'Convergences',
        content:
          'Convergences are large-scale instanced open-world events (40 players) that occur on a timer in SotO maps. They involve multiple phases of Kryptis waves and culminate in a powerful boss fight. Convergences are the primary source of SotO Legendary Armor materials (Antique Summoning Stones) and rank among the best content in the expansion.',
        tips: [
          'Use the Timers tab in this app to track the next Convergence spawn.',
          'Convergences have a lockout per account per day — completing one gives the full rewards chest.',
        ],
      },
    ],
  },

  {
    id: 'rift-hunting',
    categoryId: 'openworld',
    title: 'Rift Hunting Guide',
    icon: '🌀',
    difficulty: 'beginner',
    summary: 'What Rifts are in SotO, how to find them, complete them, and what they reward.',
    readTime: 3,
    sections: [
      {
        title: 'Finding Rifts',
        content:
          'Rifts appear as red swirling portals visible from a distance in SotO maps. Your minimap shows nearby Rift icons once you unlock the "Rift Scanning" mastery. Rifts pulse and emit a sound cue when nearby. They spawn in semi-random locations across the map and remain active for several minutes.',
        tips: [
          'The "Rift Scanning" mastery is the first thing to unlock in SotO — it places Rift icons on your minimap.',
          'Squad up with other players for faster Rift completion and to tackle higher tiers.',
        ],
      },
      {
        title: 'Completing a Rift',
        content:
          'Enter the Rift\'s radius to begin. Kryptis enemies spawn in waves — kill them all to close the Rift. The event ends with a "Seal the Rift" phase where players interact with the closing portal. Higher-tier Rifts add additional mechanics such as shielded enemies that must be CC\'d first.',
        list: [
          'Tier 1 — 1-3 waves of Kryptis, fully solo-friendly',
          'Tier 2 — more waves, champion-level enemies, benefits from 2-3 players',
          'Tier 3 — elite Kryptis including Legendary enemies, best done with a group',
        ],
      },
      {
        title: 'Rift Rewards',
        content:
          'Rifts drop Kryptis Motivation (currency for the SotO vendor), crafting materials, and occasionally Antique Summoning Stones (Legendary Armor component). Higher-tier Rifts have better drop rates. The vendor accepts Kryptis Motivation for stat-selectable gear, upgrade components, and SotO map currencies.',
        tips: [
          'Running daily Rifts is one of the more efficient ways to accumulate Legendary Armor components in SotO.',
        ],
      },
    ],
  },

  {
    id: 'fishing-guide',
    categoryId: 'openworld',
    title: 'Fishing in End of Dragons',
    icon: '🎣',
    difficulty: 'beginner',
    summary: 'How to fish in EoD — rods, bait, fishing holes, achievements, and what you can catch.',
    readTime: 4,
    image: 'https://wiki.guildwars2.com/images/thumb/1/19/Fishing.png/450px-Fishing.png',
    sections: [
      {
        title: 'Getting Started',
        content:
          'Fishing is introduced in End of Dragons. To fish, you need a Fishing Rod (crafted by a Chef or purchased from vendors) and Bait (various types from vendors and drops). Mount a Skiff or stand at a designated Fishing Hole on shore, then cast with the fishing action skill. A minigame begins — press the button again when the bobber dips.',
        tips: [
          'Open-water fishing (from a Skiff) gives access to more fish species than shore fishing.',
          'Fishing is faster with multiple players on the same Skiff — up to five players can fish from one skiff simultaneously.',
        ],
      },
      {
        title: 'Bait and Fishing Holes',
        content:
          'Different bait attracts different fish. Common bait types include Fishing Lures (all-purpose), Chumline (attracts schooling fish), and special baits from the fishing vendor. Fishing Holes are glowing patches of water with enhanced fish spawns and better chances for rare fish.',
        list: [
          'Standard Lure — works anywhere, lowest chance for rare fish',
          'Glowminnow — good for fishing holes in deep water',
          'Chumline — increases catch rate in school fishing holes',
          'Special EoD baits — tied to specific fish species and achievements',
        ],
        tips: [
          'Fishing in a Fishing Hole with appropriate bait dramatically increases chances for rare and achievement fish.',
        ],
      },
      {
        title: 'Fishing Achievements and Rewards',
        content:
          'Fishing achievements are tracked in the EoD achievement category. Catching all fish species in each area contributes to "Fisher of Cantha" and similar meta-achievements. Rewards include unique fishing-themed skins, a Legendary fishing rod skin (Chasing Tales), titles, and crafting materials. Fish can be used in Chef recipes for food buffs.',
        warnings: [
          'Some rare fish only appear in specific Fishing Holes during certain in-game weather or time-of-day conditions.',
        ],
      },
    ],
  },

  {
    id: 'convergences',
    categoryId: 'openworld',
    title: 'Convergences Guide',
    icon: '🌌',
    difficulty: 'advanced',
    summary: 'The large-scale instanced SotO events — mechanics, rewards, and how to prepare.',
    readTime: 5,
    image: 'https://wiki.guildwars2.com/images/thumb/a/a7/Convergences_loading_screen.png/330px-Convergences_loading_screen.png',
    sections: [
      {
        title: 'What are Convergences?',
        content:
          'Convergences are 40-player instanced open-world events unique to Secrets of the Obscure. They take place in special Convergence instances separate from the main map. Players queue via a portal that opens on a fixed timer. Each Convergence lasts 15–20 minutes and ends with a major Kryptis boss.',
        tips: [
          'Convergences have a daily lockout — you can earn the full reward chest once per day per Convergence.',
          'Check the Timers screen in this app for the next Convergence time.',
        ],
      },
      {
        title: 'Convergence Structure',
        content:
          'A Convergence has three phases: an initial defense phase (hold a central point against Kryptis waves), a mid-phase where multiple sub-objectives must be completed simultaneously across the map, and a final boss phase. Coordination between multiple squads is needed for the mid-phase objectives.',
        list: [
          'Phase 1 — defend the Stormcaller apparatus against waves of Kryptis',
          'Phase 2 — split into sub-groups to complete 3 simultaneous objectives (varied per Convergence)',
          'Phase 3 — large Kryptis boss with unique mechanics; DPS check with an enrage timer',
        ],
        warnings: [
          'Failing Phase 2 objectives reduces the time available in Phase 3 and weakens the group\'s buffs. Coordinate with squad leaders.',
        ],
      },
      {
        title: 'Rewards',
        content:
          'Convergences are the best source of Antique Summoning Stones — a key component for SotO Generation 3 Legendary weapons. They also drop SotO Ascended gear boxes, high-tier crafting materials, and exclusive cosmetics. The daily chest scales in quality with performance (how many phases were completed successfully).',
        tips: [
          'Join a commander-led squad for best results — unorganized maps frequently fail Phase 2.',
          'The GW2 LFG tool lists Convergence squads under the "Secrets of the Obscure" category.',
        ],
      },
    ],
  },

  // ─── Getting Started: Cosmetics & Social ─────────────────────────────────────

  {
    id: 'dye-system',
    categoryId: 'start',
    title: 'The Dye System',
    icon: '🎨',
    difficulty: 'beginner',
    summary: 'How dyes work, how to unlock them, and tips for building your dye collection.',
    readTime: 3,
    sections: [
      {
        title: 'How Dyes Work',
        content:
          'Every armor skin has three dye channels. You can apply any unlocked dye to each channel independently, changing the color of that portion of the skin. Dyes are account-wide unlocks — once you unlock a dye, every character on your account can use it.',
        tips: [
          'Open the Hero Panel (H), go to the Wardrobe tab, and click the dye icon on a skin to access the dye panel.',
          'You can preview dye combinations before applying them — experiment freely.',
        ],
      },
      {
        title: 'Unlocking Dyes',
        content:
          'Dyes drop from almost every activity: Dye Kits (common), Black Lion Dye Kits (uncommon), Living World rewards, and the Trading Post. Common dyes are cheap on the TP. Rare and exclusive dyes (like the Unbreakable set or Chaos dyes) can cost hundreds of gold.',
        list: [
          'Common Dye Kit — standard dye drop, most colors available for under 1 silver each',
          'Rare Dye Kit — chance for uncommon colors',
          'Exclusive Dye Kit — chance for rare/exclusive colors (Trading Post for hundreds of gold)',
          'Black Lion Dye Kit — guaranteed uncommon+ dye; obtained from BLC chests',
        ],
      },
      {
        title: 'Building a Palette',
        content:
          'Check gw2efficiency.com for a full account dye collection tracker. Focus on building a strong neutral palette (black, white, grey, gold, silver) first — these work with almost any armor set. Then expand into color families that match your character\'s aesthetic.',
        tips: [
          'Celestial Dye (gold/white sheen) and Abyss (deep black) are the two most popular dyes in GW2.',
        ],
      },
    ],
  },

  {
    id: 'fashion-wars',
    categoryId: 'start',
    title: 'Fashion Wars — GW2 Cosmetics Guide',
    icon: '👗',
    difficulty: 'beginner',
    summary: 'Transmutation Charges, Outfits, finishers, gliders, and the full cosmetic ecosystem.',
    readTime: 4,
    sections: [
      {
        title: 'Transmutation Charges',
        content:
          'Transmutation Charges let you apply any unlocked skin to a piece of gear without affecting its stats. Open the Wardrobe in the Hero Panel, right-click a gear piece, and choose a new skin. Each transmutation costs 1 Charge. Charges are earned from PvP, WvW, map completion, and the Gem Store.',
        tips: [
          'Transmutation Charges can be purchased directly from the Gem Store — they are a popular convenience purchase.',
          'Free-to-play accounts start with a small supply from map completion; do not overspend them early.',
        ],
      },
      {
        title: 'Outfits',
        content:
          'Outfits are full-body cosmetic sets that overlay your entire armor appearance without replacing your gear. They are toggled on/off from the Wardrobe tab. Outfits are purchased from the Gem Store, earned from achievements, or rarely found in Black Lion Chests. They are completely separate from your gear skins — great for quick look changes without using Transmutation Charges.',
        warnings: [
          'Outfits apply to the entire body and cannot be mixed with individual armor skins. You either wear the full outfit or none of it.',
        ],
      },
      {
        title: 'Finishers and Gliders',
        content:
          'Finishers are animations played when you stomp a downed enemy in PvP/WvW. They are cosmetic only and do not change combat stats. Gliders (Heart of Thorns) have their own skin collection — your glider skin is separate from your armor. Both finishers and glider skins are in the Wardrobe under their respective tabs.',
        list: [
          'Finishers — unlocked from achievements, Living World, Gem Store, Black Lion Chests',
          'Glider Skins — from Black Lion Chests, Gem Store, and some achievement rewards',
          'Mount Skins — separate from gear; purchased via Gem Store or Black Lion Statuettes',
        ],
      },
    ],
  },

  {
    id: 'social-features',
    categoryId: 'start',
    title: 'Friends, Guilds & the LFG Tool',
    icon: '🤝',
    difficulty: 'beginner',
    summary: 'How to use the Friends list, join groups with LFG, form squads, and connect with other players.',
    readTime: 3,
    sections: [
      {
        title: 'Friends List and Contacts',
        content:
          'Press Y to open the Contacts panel. Add players to your Friends list to see when they are online and which map they are on. You can also Whisper (/w PlayerName.1234) or use the mail system for private messages. Your account ID is your display name plus a 4-digit number.',
        tips: [
          'Block players using the Block function if you experience harassment — they cannot contact you while blocked.',
        ],
      },
      {
        title: 'Party and Squad System',
        content:
          'A Party holds up to 5 players and is the standard group for dungeons, fractals, and instanced content. A Squad holds up to 50 players and is used for WvW, large meta events, and raids. Squads have sub-groups (1–5 players each) for coordination. Commanders (blue tag) lead squads; Lieutenants (green tag) assist.',
        tips: [
          'Join squads via the LFG tool or by clicking on a Commander\'s tag on the map.',
          'Commanders can make their tag public (visible on map) or private (squad only).',
        ],
      },
      {
        title: 'Looking for Group (LFG)',
        content:
          'The LFG tool (press Y, select LFG tab, or use the compass icon on your minimap) lists groups looking for players across all content types. Browse categories for the content you want to join. You can also post your own listing to recruit.',
        list: [
          'Fractals — T1/T2/T3/T4 daily groups form constantly',
          'Raids — look for [Train] groups if you\'re learning; [LFM KP] groups want experienced players',
          'Open World Metas — large meta events like Dragon\'s End or Convergences often have LFG squads',
          'Strikes — EoD and SotO strikes listed separately',
        ],
      },
    ],
  },

  // ─── Crafting: Additional Guides ─────────────────────────────────────────────

  {
    id: 'cooking-guide',
    categoryId: 'crafting',
    title: 'Chef Discipline Guide',
    icon: '🍳',
    difficulty: 'intermediate',
    summary: 'Leveling Chef efficiently, the best food buffs, and profitable cooking recipes.',
    readTime: 4,
    sections: [
      {
        title: 'Why Invest in Cooking?',
        content:
          'Chef produces food consumables that give combat buffs lasting 30–60 minutes. High-quality food significantly increases your DPS or survivability. Meta food such as Cilantro Lime Sous-Vide Steak (+100 Power, +70 Ferocity) or Plate of Beef Rendang (condition damage + expertise) are staples in endgame builds.',
        tips: [
          'Using food in combat is expected in T4 fractals, raids, and strikes. Always carry appropriate food.',
          'The "+10% Magic Find" food from simple recipes is useful early on for increased loot quality.',
        ],
      },
      {
        title: 'Leveling Chef Efficiently',
        content:
          'Chef levels 1–400 is best done by crafting large quantities of cheap ingredients into simple dishes. Common efficient paths:',
        list: [
          'Level 1–75: Bread (flour + butter) — cheap ingredients, fast XP',
          'Level 75–150: Salads — lettuce + simple vegetables',
          'Level 150–225: Soups — combine with broth ingredients',
          'Level 225–300: Pies and desserts — flour + fruit',
          'Level 300–400: Feast/large meal recipes — bulk cooking for XP',
          'Use gw2efficiency.com\'s crafting guide for current cheapest leveling paths based on live TP prices',
        ],
        warnings: [
          'Cooking ingredient prices fluctuate significantly. Always check the TP before buying materials in bulk for leveling.',
        ],
      },
      {
        title: 'Valuable Recipes to Know',
        content:
          'Some Chef recipes produce items with high demand on the Trading Post:',
        list: [
          'Cilantro Lime Sous-Vide Steak — top power food for raids/fractals, consistently expensive',
          'Plate of Beef Rendang — top condition DPS food, high demand',
          'Bowl of Fancy Potato and Leek Soup — popular open-world food for survivalability',
          'Sharpening Stone / Tuning Crystal / Potent Potion — utility buff items (technically Crafting discipline overlap)',
          'Omnomberry Ghost — popular WvW roamer food for sustain',
        ],
        tips: [
          'Check gw2efficiency.com\'s "Mystic Forge Profit" and crafting profit pages for which food is currently profitable to craft and sell.',
        ],
      },
    ],
  },

  {
    id: 'ascended-trinkets',
    categoryId: 'crafting',
    title: 'Ascended Trinkets Without Crafting',
    icon: '💍',
    difficulty: 'intermediate',
    summary: 'How to obtain Ascended rings, accessories, amulets, and back items without crafting them.',
    readTime: 4,
    sections: [
      {
        title: 'Why Get Trinkets First?',
        content:
          'Trinkets (rings, accessories, amulet, back piece) provide a large portion of your total stats. Unlike armor, many Ascended trinkets can be obtained without crafting — saving significant gold and time. For most players, filling trinkets first via non-crafting sources is the most efficient Ascended upgrade path.',
      },
      {
        title: 'Rings and Accessories',
        content: 'Multiple sources offer Ascended trinkets with flexible stats:',
        list: [
          'Fractal Relics — buy Ascended rings from the Fractal Vendor in Mistlock Observatory (requires T2+ fractals)',
          'Pristine Fractal Relics — from the daily fractal chests; a ring costs 10 Pristine Relics',
          'Living World Season 3 maps — each LS3 map has a vendor selling Ascended accessories for the map\'s currency (Unbound Magic + zone tokens)',
          'Living World Season 4 maps — similar vendors in each LS4 map',
          'WvW Laurel Vendor — in the WvW lobby, sells Ascended amulets and accessories for Laurels + Badges of Honor',
          'Laurel Vendor (PvE) — sells Ascended amulets for Laurels (earned from Wizard\'s Vault and Daily achievements)',
        ],
        tips: [
          'LS3 and LS4 map currencies are easy to accumulate while doing open-world content — great for free Ascended trinkets over time.',
          'The fractal ring vendor gives +5 Agony Infusion slots, making fractal-sourced rings better for fractal players.',
        ],
      },
      {
        title: 'Amulets and Back Items',
        content:
          'Ascended amulets are available from Laurel vendors (25 Laurels each). Laurels accumulate from Wizard\'s Vault weekly objectives and login rewards. For back items: Living World Season 3 and 4 both include obtainable Ascended back items via collections or vendors. The "Warbringer" (WvW) and "Ad Infinitum" (fractals) are Legendary backpieces for long-term goals.',
      },
    ],
  },

  {
    id: 'gen3-legendaries',
    categoryId: 'crafting',
    title: 'Generation 3 Legendary Weapons',
    icon: '⚔️',
    difficulty: 'advanced',
    summary: 'How SotO\'s Antique Summoning Stones work and what makes Gen 3 Legendaries different.',
    readTime: 4,
    sections: [
      {
        title: 'What are Gen 3 Legendaries?',
        content:
          'Generation 3 Legendary weapons were introduced in Secrets of the Obscure. Unlike Gen 1 and 2 Legendaries which craft specific named weapons (e.g., Twilight, Quip), Gen 3 uses a different system: Antique Summoning Stones allow you to choose which weapon type to create. They are not tied to a specific lore weapon skin — instead the skin is unlocked as part of the crafting process.',
        tips: [
          'Gen 3 Legendaries have unique SotO-themed skins with Kryptis-influenced visual effects.',
          'The crafting process is gated behind SotO content, primarily Convergences and Rift hunting.',
        ],
      },
      {
        title: 'Antique Summoning Stones',
        content:
          'Antique Summoning Stones are the primary currency/component for Gen 3 Legendary weapons. They drop from Convergences, high-tier Rifts, and the SotO achievement track. Accumulating the required number (varies by weapon tier) is the main time gate for Gen 3 Legendaries.',
        list: [
          'Earned from: Convergence daily chests, Tier 3 Rifts, SotO achievement rewards',
          'Not tradable on the Trading Post — must be earned through SotO content',
          'Required alongside standard Legendary components: Mystic Clovers, T6 materials, etc.',
        ],
        warnings: [
          'Gen 3 Legendary crafting requires active participation in SotO content. Unlike Gen 1 where you can buy most components on the TP, Gen 3 gates progress behind instanced content.',
        ],
      },
      {
        title: 'Comparing Gen 1, 2, and 3',
        content: '',
        list: [
          'Gen 1 — specific named skins (Twilight, Sunrise, etc.); precursor buyable on TP; no expansion required for the combine step',
          'Gen 2 — specific named skins (HoT expansion); precursor crafted through three-tier collection; requires HoT',
          'Gen 3 — SotO-themed skins; uses Antique Summoning Stones; requires SotO content; more flexible weapon type selection',
        ],
        tips: [
          'For players who want a Legendary without heavy instanced content, Gen 1 remains the most accessible option.',
        ],
      },
    ],
  },

  {
    id: 'legendary-armory',
    categoryId: 'crafting',
    title: 'The Legendary Armory Explained',
    icon: '🏛️',
    difficulty: 'beginner',
    summary: 'How the Legendary Armory lets you share one Legendary across all your characters simultaneously.',
    readTime: 3,
    sections: [
      {
        title: 'What is the Legendary Armory?',
        content:
          'The Legendary Armory is an account-wide storage system for all your Legendary equipment. Once you place a Legendary item into the Armory, every character on your account can equip it simultaneously — you do not need multiple copies of the same Legendary for multiple characters.',
        tips: [
          'The Legendary Armory was added in 2021 and replaced the old system where Legendaries could only be on one character at a time.',
          'Access the Armory from your inventory — it appears as a gold book icon.',
        ],
      },
      {
        title: 'How Sharing Works',
        content:
          'Each character can equip the Legendary from their Build or Equipment Template. When you log in on a different character, the same Legendary is available to equip. The Armory does not remove the item from one character when another equips it — all can use it at the same time. Stat changes (free-swapping stats) work per-character — changing stats on your Warrior\'s version does not affect your Guardian\'s.',
        list: [
          'One Legendary greatsword → usable by Warrior, Guardian, Mesmer, Chronomancer simultaneously',
          'Free stat swapping works independently per character',
          'Infusion slots on Legendary items are also available to all characters',
        ],
        warnings: [
          'Placing gear in the Legendary Armory is irreversible — you cannot take it back out as a regular item. It will only exist as an Armory entry going forward.',
        ],
      },
      {
        title: 'Armory and Build Templates',
        content:
          'The Armory integrates with the Build and Equipment Template system. You can assign a Legendary to different stat sets across different Equipment Templates on the same character. For example, Template A uses your greatsword in Berserker stats; Template B uses the same greatsword in Grieving stats for a condi build — all without crafting a second weapon.',
        tips: [
          'This is the single biggest quality-of-life feature for multi-build players. One Legendary weapon covers all your build variants.',
        ],
      },
    ],
  },

  // ─── Fractals: Additional Guides ─────────────────────────────────────────────

  {
    id: 'sunqua-peak',
    categoryId: 'fractals',
    title: 'Sunqua Peak — Fractal Guide',
    icon: '⛰️',
    difficulty: 'advanced',
    summary: 'The four elemental encounters and storm phase in the Sunqua Peak fractal.',
    readTime: 5,
    sections: [
      {
        title: 'Overview',
        content:
          'Sunqua Peak is a fractal set in a mountain landscape corrupted by elemental energy. It consists of four elemental phases (Air, Earth, Fire, Water) leading to the final boss — the Sorrowful Spellcaster — a powerful Nightmare Duchess. There is also a Challenge Mode variant that significantly increases the difficulty of the final boss.',
        tips: [
          'Sunqua Peak has a unique aesthetic — it rewards players who enjoy beautiful visuals alongside challenging mechanics.',
        ],
      },
      {
        title: 'Elemental Phases',
        content:
          'Each elemental phase is a mini-encounter that must be resolved before proceeding:',
        list: [
          'Air Phase — dodge lightning strikes that leave persistent AoE fields on the ground; a central platform is the safe zone',
          'Earth Phase — avoid rock pillars that emerge and slam; avoid the knockback from the central geyser',
          'Fire Phase — spreading fire fields that must be navigated around; players who get the "fire debuff" should move away from the group',
          'Water Phase — swim underwater; avoid the jellyfish-like enemies and the tidal wave slam',
        ],
      },
      {
        title: 'The Sorrowful Spellcaster (Final Boss)',
        content:
          'The final boss uses a combination of all four elements. Key mechanics: she summons Woe (a dangerous AoE ring that must be dodged), channels Storm (players must hide behind rocks during this phase), and periodically roots all players with Paralysis. Regular mode requires good DPS; CM mode has significantly more damage output and tighter enrage timers.',
        warnings: [
          'The Storm phase in CM is a hard mechanic — standing behind a rock is mandatory or players take lethal damage.',
          'Do not let players get rooted in dangerous AoE zones. Bring condition cleanse for Paralysis removal.',
        ],
      },
    ],
  },

  {
    id: 'fractal-skips',
    categoryId: 'fractals',
    title: 'Common Fractal Skips & Portal Usage',
    icon: '🚀',
    difficulty: 'intermediate',
    summary: 'Which fractals have skips, how to use Mesmer Portal, and where stealth skips save time.',
    readTime: 4,
    sections: [
      {
        title: 'Why Skips Matter',
        content:
          'Fractals are time-sensitive for T4 daily runners. Skipping non-boss enemy sections saves 2–5 minutes per fractal, which adds up to 10–20+ minutes across a full daily T4 set. Many groups consider portal and stealth skips standard knowledge for T4 players.',
        tips: [
          'If your group doesn\'t have a Mesmer for portals, use stealth sources (Thief, Scrapper Smoke Field) or simply outrun enemies with mounts disabled.',
        ],
      },
      {
        title: 'Mesmer Portal Skips',
        content:
          'The Mesmer Utility skill "Portal Entre" (and its exit "Portal Exeunt") teleports the entire group instantly. Key uses:',
        list: [
          'Aquatic Ruins (underwater fractal) — portal across the large underwater section',
          'Cliffside — portal past the long initial run and the pre-boss trash section',
          'Chaos fractal — portal past the maze section early on',
          'Snowblind — portal past the blizzard and initial enemy group',
          'Urban Battleground — portal past the opening trash fight to the barricades',
        ],
        tips: [
          'The Mesmer should place Portal Entre at the beginning of the skip route, run to the destination, then drop Portal Exeunt while the group enters.',
          'Chronomancer gets a shorter Portal cooldown via traits, making it the preferred portal spec.',
        ],
      },
      {
        title: 'Stealth Skips',
        content:
          'Some fractal sections can be skipped by entering stealth and running through enemy groups, as mobs will not aggro stealthed players. Key stealth sources:',
        list: [
          'Thief Shadow Refuge or Smoke Screen (create Smoke Fields for group stealth via blasting)',
          'Scrapper Smoke Screen (Tool Kit): creates a Smoke Field; blast it with Blunderbuss or another blast finisher to grant group stealth — the old "Function Gyro" stealth was removed in the Scrapper rework',
          'Mesmer Mass Invisibility (Elite) grants group stealth',
        ],
        warnings: [
          'Stealth skips require the group to stay within the stealth radius. Players who leave the stealth will break and aggro enemies — communicate clearly.',
        ],
      },
    ],
  },

  // ─── WvW: Additional Guides ───────────────────────────────────────────────────

  {
    id: 'siege-tactics',
    categoryId: 'wvw',
    title: 'Siege Weapon Tactics',
    icon: '🏹',
    difficulty: 'intermediate',
    summary: 'How to place and use rams, catapults, ballistas, and arrow carts effectively.',
    readTime: 4,
    sections: [
      {
        title: 'Supply and Blueprints',
        content:
          'Siege weapons require Blueprints (purchased from the WvW vendor for Badges of Honor and Gold) and Supply to build. You carry Supply (up to 10 by default, upgradeable via WvW abilities). Dolyaks (supply caravans from camps) refill Supply at objectives. Place siege near the target using the Blueprint item.',
        tips: [
          'Always carry a few Blueprints when participating in an organized zerg.',
          'Ram Blueprints are the most important to carry — most gate attacks need multiple rams.',
        ],
      },
      {
        title: 'Siege Weapons by Role',
        content: '',
        list: [
          'Battering Ram — destroys gates quickly; place close to the gate; 3–5 rams simultaneously breaks gates fast',
          'Catapult — long-range indirect fire; good for hitting walls or interior enemies over barriers; requires mastery',
          'Ballista — long-range direct fire; excellent vs enemy siege and large targets; counter-siege weapon',
          'Arrow Cart — anti-personnel AoE; place inside a gate or on walls to punish attackers swarming a choke',
          'Trebuchet — maximum range; can hit objectives from very far; slow and requires setup time',
          'Flame Ram — same function as regular Ram but also applies Burning stacks to defenders at the gate',
          'Shield Generator — projects a shield bubble that absorbs damage; key for protecting rams from enemy siege',
        ],
      },
      {
        title: 'Placement Tips',
        content:
          'Placement is everything for siege effectiveness:',
        list: [
          'Rams: place as close to the gate as possible, spread side by side to maximize simultaneous hits',
          'Arrow Carts: inside your own gate threshold to hit enemies trying to enter, or on inner walls',
          'Ballistas: on high ground or walls, angled to hit enemy siege across the objective',
          'Shield Generator: directly over your rams to absorb incoming projectiles',
        ],
        warnings: [
          'Enemy players can destroy your siege if they reach it. Protect your siege with your group and position defenders nearby.',
        ],
      },
    ],
  },

  {
    id: 'wvw-pips-guide',
    categoryId: 'wvw',
    title: 'Maximizing WvW Pips',
    icon: '📈',
    difficulty: 'beginner',
    summary: 'How the Skirmish Ticket pip system works and how to earn the maximum each week.',
    readTime: 3,
    sections: [
      {
        title: 'What are Pips?',
        content:
          'Pips are earned every 5 minutes while actively playing WvW (must be in combat or interacting with WvW objects). They fill a reward track. Each track tier awards Skirmish Claim Tickets — the primary currency for WvW Legendary equipment. Pips per tick depend on multiple factors.',
        tips: [
          'Pips only accumulate while you are active in WvW maps. AFK-standing does not earn pips.',
          'The weekly track has tier-based thresholds — to reach the maximum (Tier 6 / "Chest of Wonders") requires roughly 1,300–1,500 pips per week depending on your bonuses. There is no hard "365 pip" cap; completing Tier 6 is the weekly goal.',
        ],
      },
      {
        title: 'How to Earn More Pips Per Tick',
        content: 'Your pip rate per 5-minute tick is determined by:',
        list: [
          'Loyalty Bonus (up to +4 pips) — from playing consistently each week without missing too many days',
          'WvW Rank Bonus (up to +5 pips) — higher WvW rank provides more pips',
          'Outnumbered Bonus (+2 pips) — active when your server has fewer players on a given map',
          'Commander Tag Active (+1 pip) — if you have a Commander Tag and are tagged up',
          'World Score Bonus (+1 pip) — if your server is in first place for the current skirmish',
        ],
        tips: [
          'The Outnumbered bonus is one of the most consistent ways to boost pips — play on a less-populated map or during off-hours.',
          'WvW Rank matters a lot long-term. Higher rank = more pips per tick permanently.',
        ],
      },
      {
        title: 'Weekly Skirmish Ticket Strategy',
        content:
          'To earn maximum Skirmish Tickets each week, complete the weekly pip track to tier 6 (the maximum). This requires roughly 1,300–1,500 pips depending on bonuses. At 6 ticks per 30 minutes of active play, a dedicated player can complete the track in about 10–12 hours per week.',
        warnings: [
          'Skirmish Tickets are also used for WvW Legendary Armor — the full armor set requires hundreds of weeks worth of tickets, so prioritize them from the start of your WvW journey.',
        ],
      },
    ],
  },

  // ─── PvP: Additional Guide ────────────────────────────────────────────────────

  {
    id: 'pvp-stronghold',
    categoryId: 'pvp',
    title: 'Stronghold Mode',
    icon: '🏯',
    difficulty: 'intermediate',
    summary: 'How Stronghold differs from Conquest — objectives, Guards, and killing the enemy Lord.',
    readTime: 3,
    sections: [
      {
        title: 'Stronghold Overview',
        content:
          'Stronghold is a PvP game mode available in custom arenas and some ranked queues. Unlike Conquest\'s capture-point scoring, Stronghold has one objective: kill the enemy team\'s Lord. The map (Hall of the Mists) has lanes, supply nodes, Guards, and controllable doors.',
        tips: [
          'Stronghold is less commonly played than Conquest but has its own achievement track and rewards unique PvP skins.',
        ],
      },
      {
        title: 'Core Mechanics',
        content:
          'Supply is gathered from nodes at the edges of the map. Players spend Supply to hire Doorbreakers (NPCs that attack enemy doors) or Reapers (NPCs that attack the enemy Lord). Killing enemy Guards opens passages. The enemy Lord has a massive health pool — direct player attacks combined with hired Reapers are needed to kill it.',
        list: [
          'Supply Nodes (flanks) — gather supply by standing on them; used to hire NPCs',
          'Doorbreakers — hired NPCs that break through enemy doors; a prerequisite to reaching the Lord',
          'Reapers — powerful hired NPCs that deal massive damage to the Lord; coordinate hiring these for a final push',
          'Guards — defend doors and passages; killing them opens routes to the Lord',
        ],
      },
      {
        title: 'Strategy Differences from Conquest',
        content:
          'Stronghold rewards split-pushing and objective focus over raw kills. Killing enemies earns no direct score — only objective completion matters. A 5v5 teamfight in the middle while both teams ignore supply nodes wastes time. Assign roles: some players gather supply while others pressure or defend.',
        warnings: [
          'Do not exclusively chase kills. Players who focus entirely on combat without collecting supply or hiring NPCs will cost their team the match.',
        ],
      },
    ],
  },

  // ─── Economy: Additional Guides ───────────────────────────────────────────────

  {
    id: 'dungeon-farming',
    categoryId: 'economy',
    title: 'Dungeon Farming for Gold',
    icon: '🏰',
    difficulty: 'intermediate',
    summary: 'Best dungeon paths, speed run tips, and why CoF P1 remains a classic gold farm.',
    readTime: 4,
    sections: [
      {
        title: 'Are Dungeons Still Worth Running?',
        content:
          'Dungeons are no longer the gold meta (most open-world metas and fractals out-earn them), but they remain a viable and fun way to earn 3–6 gold per run. They are excellent for new players learning group mechanics, and some paths can be completed in under 10 minutes by experienced groups.',
        tips: [
          'Dungeons award a "Dungeon Frequenter" bonus chest after each unique path completed per day.',
          'Some dungeons reward unique weapon and armor skins — worth running for collection purposes.',
        ],
      },
      {
        title: 'Best Paths for Speed Farming',
        content: '',
        list: [
          'Citadel of Flame (CoF) P1 — fastest dungeon path in the game; experienced groups finish in 3–5 minutes; fire theme',
          'Citadel of Flame P2 — slightly longer but still fast; good for additional daily bonus',
          'Ascalonian Catacombs (AC) P1 — beginner-friendly, good gold for new players',
          'Twilight Arbor (TA) Aetherpath — unique path with story context, moderate speed',
          'Arah P2 — slowest but gives the most unique dungeon tokens; only worth it for Arah skins',
        ],
        tips: [
          'CoF P1 requires burning through a fire trail — bring condition cleanse or food that removes burning.',
          'Speed runs use group composition optimized for AoE damage. Warrior + Guardian + 3 DPS is the classic setup.',
        ],
      },
      {
        title: 'Dungeon Token Value',
        content:
          'Dungeon tokens can be traded at each dungeon\'s NPC for Exotic gear pieces. Some Exotic pieces from dungeon vendors have unique stats (e.g., Rabid — Condition Damage + Toughness + Precision) and can be sold on the TP for 10–30 gold each, making token farming profitable when demand is high.',
      },
    ],
  },

  {
    id: 'black-lion-economy',
    categoryId: 'economy',
    title: 'Black Lion Trading Company Economy',
    icon: '🦁',
    difficulty: 'intermediate',
    summary: 'How to get value from Black Lion Chests, keys, and statuettes without spending excessively.',
    readTime: 4,
    sections: [
      {
        title: 'Black Lion Chests and Keys',
        content:
          'Black Lion Chests (BLC) are loot boxes dropped from enemies and purchased in the Gem Store. They require Black Lion Keys to open. Keys are earned from completing your weekly character story step (1 free key per account per week), or purchased with Gems. Chest contents rotate with each major game update.',
        tips: [
          'The weekly story key is the most efficient free key source — complete it every week on a level 10–79 character.',
          'Never buy large amounts of keys purely for RNG items. Buy specific items from the TP if you can afford them.',
        ],
      },
      {
        title: 'What Black Lion Chests Contain',
        content:
          'Chest contents typically include:',
        list: [
          'Black Lion Statuettes — currency for a vendor with rotating premium items; never expire',
          'Black Lion Claim Tickets — directly exchange for exclusive weapon skins from the current set',
          'Dye Kits — rare chance for exclusive dyes',
          'Cosmetic items (mount skins, miniatures, finishers) — low probability',
          'Boosters and consumables — common; tradable on TP',
          'Black Lion Keys (rarely) — can be re-used',
        ],
        warnings: [
          'Black Lion Chests use randomized drop tables. The most desirable items (full Claim Ticket sets, exclusive mounts) have very low drop rates. Set a budget and stick to it.',
        ],
      },
      {
        title: 'Black Lion Statuettes',
        content:
          'Statuettes are the safest BLC currency — they accumulate across all chests and can be exchanged at the Black Lion Statuette vendor. The vendor always has permanent items including Transmutation Charges, gathering tools, and cosmetic items. Some items rotate monthly. Hoarding Statuettes until a desirable item appears is a valid strategy.',
        tips: [
          'Transmutation Charges from the Statuette vendor are a consistent use if you have no specific target item.',
          'Watch for limited-time items at the Statuette vendor that are unavailable elsewhere.',
        ],
      },
    ],
  },

  {
    id: 'dragonfall-farm',
    categoryId: 'economy',
    title: 'Dragonfall — #1 Open World Farm',
    icon: '🐉',
    difficulty: 'intermediate',
    summary: 'The current best open-world gold farm in GW2: how to run Dragonfall efficiently for 25–40 gold/hour.',
    readTime: 5,
    sections: [
      {
        title: 'Why Dragonfall?',
        content:
          'Dragonfall (Living World Season 4, Episode 6) is consistently ranked as the best open-world gold farm in GW2 as of 2025, yielding 25–40 gold per hour for organized groups. It combines dense Volatile Magic income, Dragonfall Keys earned in-map, event chest rewards, and unidentified gear drops.',
        tips: [
          'Dragonfall requires Living World Season 4, Episode 6 "War Eternal" to access.',
          'Join via LFG → Open World → Dragonfall. Organized squads run this map throughout the day.',
          'fast.farming-community.eu shows live gold/hour calculations for Dragonfall based on current TP prices.',
        ],
      },
      {
        title: 'The Meta Structure',
        content:
          'The Dragonfall meta is a chain of events across three camps: Skimmer Ranch, Pact Encampment, and Cavalier Outpost. Players rotate between camps completing events, earning Volatile Magic and Dragonfall Keys throughout. The meta culminates in a Kralkatorrik encounter.',
        list: [
          'Three-camp rotation — events spread across the map; follow the commander tag',
          'Dragonfall Keys — dropped from events throughout the meta (NOT purchased); save them for end-of-meta caches',
          'Dragon Response Caches — the main reward chests at the end; opened with Dragonfall Keys',
          'Volatile Magic — earned from every event and kill; convert at the LW4 vendor',
        ],
      },
      {
        title: 'Maximizing Income',
        content:
          'To get the most from each Dragonfall run:',
        list: [
          'Convert Volatile Magic → Trophy Shipments at any LW4 vendor (mixed T6 materials — best average gold per Magic)',
          'Alternatively convert to Leather Shipments if leather prices are high (check TP before deciding)',
          'Open Dragon Response Caches after the meta — each Key gives one cache',
          'Salvage unidentified gear drops from events using a Mystic Salvage Kit for Ectos and materials',
          'Tag as many events as possible — event participation scales your loot; bring a ranged weapon',
        ],
        tips: [
          'Magic Find food (e.g., Plate of Truffle Steak Dinner) significantly increases loot quality.',
          'Use BlishHUD with [fast] Farming Community overlays to see event markers on-screen.',
          'If you miss the meta, the inter-meta event period still drops Volatile Magic from map enemies.',
        ],
      },
    ],
  },

  {
    id: 'silverwastes-riba',
    categoryId: 'economy',
    title: 'Silverwastes RIBA Farm',
    icon: '🌵',
    difficulty: 'beginner',
    summary: 'The classic beginner-friendly meta farm in Silverwastes — ~20 gold/hour with no gear requirements.',
    readTime: 4,
    sections: [
      {
        title: 'What is RIBA?',
        content:
          'RIBA stands for the order in which you defend the four Silverwastes bases: Red → Indigo → Blue → Amber. It is the fastest pattern for completing base defense events before the Vinewrath meta boss. After Vinewrath, the commander leads a Chest Dig route across the map to open buried treasure.',
        tips: [
          'Join via LFG → Open World → Silverwastes and look for a commander running "RIBA."',
          'No gear requirements — works from level 1 with any build thanks to downscaling.',
        ],
      },
      {
        title: 'The Farming Loop',
        content:
          'Follow the commander through the RIBA rotation, tagging as many events as possible by dealing at least one hit to each enemy. After Vinewrath:',
        list: [
          '1. Vinewrath meta boss kill — defend three lane bosses simultaneously, then final boss',
          '2. Chest Dig — commander uses Silverwastes Shovel to unearth Buried Supplies across the map',
          '3. Open all loot bags earned from Bandit Crests and events',
          '4. Wait for the next RIBA cycle to begin (roughly 30 minutes between full cycles)',
        ],
        tips: [
          'Open loot bags at level 80 for maximum contents — Bandit Bags scale with character level, so a level 80 character gets the best loot. The old "level 49 alt" trick was relevant for Halloween bags only and does not apply here.',
          'Bandit Crests earned from bags can be exchanged at the Bandit vendor for additional items.',
        ],
        warnings: [
          'RIBA yields approximately 60% of the gold/hour of current top farms like Dragonfall. It\'s great for learning the game and as a warm-up farm, but experienced farmers usually move on to LW4 and EoD metas.',
        ],
      },
    ],
  },

  {
    id: 'world-boss-train',
    categoryId: 'openworld',
    title: 'The World Boss Train',
    icon: '🚂',
    difficulty: 'beginner',
    summary: 'What the World Boss Train is, how to follow it, and which bosses are most valuable.',
    readTime: 3,
    sections: [
      {
        title: 'What is the World Boss Train?',
        content:
          'World Bosses spawn on a fixed timer across Tyria. The "World Boss Train" is the community practice of chaining multiple bosses back-to-back using the boss timer to teleport from one boss to the next with minimal downtime. Each boss gives a once-per-day reward chest with Exotic gear, materials, and other loot.',
        tips: [
          'Use the Timers tab in this app to track boss spawn times and plan your rotation.',
          'World Boss trains are an easy way to earn several gold equivalent per day with minimal effort or gear requirement.',
        ],
      },
      {
        title: 'Key World Bosses',
        content: '',
        list: [
          'Tequatl the Sunless (Sparkfly Fen) — large multi-phase dragon fight; turret defense + DPS; good loot',
          'Triple Trouble (Bloodtide Coast) — three simultaneous Wurm bosses; requires coordination; excellent loot',
          'The Shatterer (Blazeridge Steppes) — dragon boss, periodic knockbacks; moderate loot',
          'Fire Elemental (Metrica Province) — easy introductory boss; good for beginners',
          'Shadow Behemoth (Queensdale) — earliest world boss; beginner-friendly',
          'Megadestroyer (Mount Maelstrom) — volcanic boss with destroyers; moderate challenge',
          'Golem Mark II (Metrica Province) — Inquest golem encounter; straightforward',
        ],
      },
      {
        title: 'Tips for the Train',
        content:
          'Most bosses take 10–15 minutes. Use the downtime between bosses to sell loot, check the TP, or grab food. Large groups (20–50 players) form automatically around Commander tags for major bosses. Join any visible Commander tag near the boss timer.',
        tips: [
          'Triple Trouble requires an organized squad — use the LFG tool to find a Triple Trouble group rather than trying it with a random map.',
          'Magic Find food and the "Easter Egg Hunt"-style Magic Find buff from guild banners increases loot quality from boss chests.',
        ],
      },
    ],
  },

  // ─── Combat: Relics, Enrichments & Infusions ─────────────────────────────────

  {
    id: 'enrichments-guide',
    categoryId: 'combat',
    title: 'Enrichments — Amulet Upgrades',
    icon: '💎',
    difficulty: 'intermediate',
    summary: 'What Enrichments are, which ones exist, and how to add them to your amulet.',
    readTime: 3,
    sections: [
      {
        title: 'What are Enrichments?',
        content:
          'Enrichments are a special upgrade type that can only be placed in the enrichment slot of an Ascended or Legendary Amulet. They are different from Infusions — each amulet has exactly one enrichment slot and it cannot hold an Agony Infusion. Enrichments provide passive effects or stat bonuses.',
        tips: [
          'Only Ascended and Legendary Amulets have an enrichment slot. Exotic amulets do not.',
          'You can remove an Enrichment with an Upgrade Extractor (Gem Store or drop).',
        ],
      },
      {
        title: 'Types of Enrichments',
        content: 'Several Enrichments exist, each offering a different passive bonus:',
        list: [
          'Magical Enrichment — +15% Magic Find',
          'Karmic Enrichment — +15% Karma gain',
          'Koi Enrichment — +15% XP from kills',
          'Celestial Enrichment — +15% to all experience sources',
          'Peerless Infusion (enrichment variant) — cosmetic aura effect for the amulet slot',
          'Festive Enrichment — seasonal cosmetic particle effect',
          'Watchwork Enrichment — clockwork particle cosmetic',
        ],
        tips: [
          'Magical Enrichment (+15% MF) is the most popular choice — Magic Find increases loot quality from all sources.',
          'Enrichments are sold on the Trading Post and occasionally available from the Gem Store or special events.',
        ],
        warnings: [
          'Enrichments do not provide Agony Resistance — they cannot substitute for Infusions in fractal content.',
        ],
      },
    ],
  },

  {
    id: 'infusion-types-guide',
    categoryId: 'combat',
    title: 'Infusion Types — Complete Reference',
    icon: '💉',
    difficulty: 'intermediate',
    summary: 'Every type of infusion in the game: Agony, stat, cosmetic, WvW, swim speed, and account.',
    readTime: 5,
    sections: [
      {
        title: 'Agony Infusions (Fractal)',
        content:
          'Agony Infusions provide Agony Resistance (AR) for Fractals of the Mists and go into the infusion slots on Ascended gear. They range from +1 AR to +9 AR each. Combine smaller infusions using Thermocatalytic Reagents in the Mystic Forge to create higher-value ones.',
        list: [
          '+1 Agony Infusion — crafted or bought from the fractal vendor with Fractal Relics',
          '+5 Agony Infusion — sufficient for T2/T3; can be purchased with Pristine Fractal Relics',
          '+9 Agony Infusion — max single infusion; combine two +8 infusions at the Mystic Forge',
          'Versatile Simple Infusion — provides AR + a secondary stat (Power, Precision, etc.)',
        ],
        tips: [
          'Buy +1 infusions from the fractal vendor and combine them in the Mystic Forge. Buying +9 directly on the TP is expensive.',
          'The Mist Attunement mastery track provides +5/+10/+15/+25 bonus effective AR — unlock it to reduce how many infusions you need.',
        ],
      },
      {
        title: 'Stat Infusions (WvW)',
        content:
          'WvW Stat Infusions provide a secondary stat bonus in addition to a small stat boost. They are used in PvE and WvW to fill infusion slots with useful stats rather than pure AR (which is useless outside fractals). These can be purchased from the WvW vendor or crafted.',
        list: [
          'Mighty Infusion (+5 Power) — from WvW reward tracks, common for power builds',
          'Precise Infusion (+5 Precision) — crit-focused builds',
          'Vital Infusion (+5 Vitality) — survivability',
          'Resilient Infusion (+5 Toughness) — toughness builds',
          'Malign Infusion (+5 Condition Damage) — condi builds',
          'Healing Infusion (+5 Healing Power) — support builds',
          'Versatile Simple Infusion — stat + AR, usable in fractal AND WvW/PvE content',
        ],
        tips: [
          'For non-fractal content (raids, strikes, open world, WvW), use stat infusions instead of pure Agony Infusions to gain actual DPS or survivability benefits.',
        ],
      },
      {
        title: 'Cosmetic Infusions',
        content:
          'Cosmetic infusions add visual aura effects to your character. They can be combined with AR infusions in the Mystic Forge to create hybrid infusions that provide both AR and the cosmetic effect.',
        list: [
          'Chak Infusion — green bioluminescent mist aura (from Auric Basin achievements/events)',
          'Ghostly Infusion — spectral glow (Wintersday event, TP)',
          'Phospholuminescent Infusion — bioluminescent blue-green glow (TP or rare drops)',
          'Liquid Aurillium Infusion — golden sparkle aura (Auric Basin collection)',
          'Winter\'s Heart Infusion — ice and snow aura (Wintersday)',
          'Polysaturating Infusion (Red/Green/Blue) — color-shifting overlay (rare TP items)',
          'Peerless Infusion — amulet enrichment slot cosmetic',
          'Celestial Infusion (Blue/Red) — galaxy-like particle effect (very rare, expensive TP)',
        ],
        warnings: [
          'Cosmetic infusions can cost hundreds to tens of thousands of gold on the TP. Many are only available during limited events.',
          'Stacking multiple of the same cosmetic infusion increases visual intensity — some players use 18× the same infusion for maximum effect.',
        ],
      },
      {
        title: 'Swim-Speed Infusions',
        content:
          'Swim-Speed Infusions increase your underwater movement speed. They slot into infusion slots like any other infusion and are useful for underwater fractal sections or underwater content in general.',
        list: [
          'Swim-Speed Infusion +10 — standard swim speed infusion, craftable via Jeweler or TP',
          'Swim-Speed Infusion +20 — improved version, combined from two +10 in Mystic Forge',
          'Swim-Speed Infusion +30 — maximum tier, further combined',
        ],
        tips: [
          'Swim-speed infusions are primarily useful in the Aquatic Ruins fractal. Most players carry one or two for underwater sections.',
          'You can freely swap infusions out of combat to use swim-speed infusions only when needed.',
        ],
      },
    ],
  },

  {
    id: 'relics-guide',
    categoryId: 'combat',
    title: 'Relics — The 6th Bonus Slot',
    icon: '🔮',
    difficulty: 'intermediate',
    summary: 'How the Relic system (introduced in SotO) works and which Relics to use for your build.',
    readTime: 4,
    sections: [
      {
        title: 'What are Relics?',
        content:
          'Relics were introduced in Secrets of the Obscure as a dedicated equipment slot on every character. Before SotO, the 6th bonus of Superior Runes provided a powerful unique effect (like the Scholar Rune\'s +10% damage above 90% HP). That effect was removed from runes and moved to separate Relic items, giving players more build flexibility.',
        tips: [
          'Every level 60+ character gets a free Relic slot. You do not need an Ascended item — any character can use Relics.',
          'Relics are shared via the Legendary Armory if you craft a Legendary Relic.',
        ],
      },
      {
        title: 'Equipping a Relic',
        content:
          'Open the Hero Panel (H) → Equipment tab. The Relic slot is at the bottom of the equipment panel. Relics can be placed directly from your inventory or obtained from vendors, achievements, and crafting. Each Relic provides a unique on-demand or passive effect separate from your rune set.',
      },
      {
        title: 'Top Relics by Role',
        content: '',
        list: [
          'Relic of the Scholar — +10% damage when above 90% HP; staple for power DPS builds (replaces the old Scholar Rune 6th bonus)',
          'Relic of the Thief — on steal/shadowstep: strike a target and gain Might; good for Thief builds',
          'Relic of the Fractal — after inflicting a condition: deal bonus damage; excellent in fractal condition builds',
          'Relic of Fireworks — on elite skill use: launch fireworks that deal AoE damage; solid all-purpose DPS relic',
          'Relic of the Monk — on healing skill use: grant Regeneration to nearby allies; healer/support relic',
          'Relic of the Scourge — grant Barrier to nearby allies on skill use; WvW/support Scourge builds',
          'Relic of Evasion — on dodge: create a combo field; great for high-mobility builds',
          'Relic of the Zephyrite — create a Lightning combo field on dodge; strong for builds with frequent dodges',
        ],
        tips: [
          'Relics are typically cheaper than full rune sets. Experiment freely on a character before buying expensive rune sets.',
          'Check Snowcrows (snowcrows.com) and Metabattle for the recommended Relic for your specific build.',
        ],
      },
      {
        title: 'Obtaining Relics',
        content:
          'Relics can be obtained from multiple sources:',
        list: [
          'Crafting — most Superior Relics are craftable by the Jeweler discipline',
          'Trading Post — buy Relics directly from other players',
          'Wizard\'s Vault — some Relics are purchasable with Astral Acclaim',
          'Achievement rewards — certain content completions reward specific Relics',
          'Legendary Relic (crafting) — a single Legendary Relic lets you freely change which Relic effect you use at any time',
        ],
      },
    ],
  },

  {
    id: 'jade-bot-guide',
    categoryId: 'start',
    title: 'Jade Bot — Modules & Upgrades',
    icon: '🤖',
    difficulty: 'beginner',
    summary: 'What the Jade Bot is, how to power it, and which modules to prioritize.',
    readTime: 4,
    sections: [
      {
        title: 'What is the Jade Bot?',
        content:
          'The Jade Bot is a personal companion device introduced in End of Dragons. It is unlocked early in the EoD story and provides passive utility effects through slotted Modules. It also powers the Jade Tech Waypoints on Cantha maps and enables the Skiff (boat) and Siege Turtle mechanics in EoD.',
        tips: [
          'Unlock the Jade Bot Mastery track early — each tier increases the power slot available for modules.',
          'The Jade Bot is account-wide and functions on all characters once unlocked.',
        ],
      },
      {
        title: 'Jade Bot Core Tiers',
        content:
          'The Jade Bot has a Core that determines how many modules you can equip simultaneously. Cores are upgradeable with Research Notes (EoD currency from salvaging items):',
        list: [
          'Standard Core (tier 1) — 1 module slot; free from EoD story',
          'Polished Core (tier 2) — 2 module slots; crafted or purchased',
          'Hardened Core (tier 3) — 3 module slots',
          'Tempered Core (tier 4) — 4 module slots',
          'Masterwork Core (tier 5) — 5 module slots',
          'Exquisite Core (tier 6) — 6 module slots; maximum, requires significant Research Notes',
        ],
        tips: ['Research Notes are earned by salvaging EoD crafted items — level up crafting disciplines in EoD zones to generate them.'],
      },
      {
        title: 'Key Jade Bot Modules',
        content: 'These modules are the most useful for most players:',
        list: [
          'Jade Dynamo Module — provides a supply of free Jade Fuel cells; reduces the cost of using Jade Tech waypoints',
          'Superior Jade Bot Fuel Module — extends the bot\'s active duration and fuel efficiency',
          'Jade Tech Overcharge Module — increases Jade Waypoint discount in Cantha maps',
          'Extractor Module — chance to salvage extra materials from nodes you gather',
          'Defense Protocol Module — grants Barrier when struck below a health threshold',
          'Aerial Assault Module — the bot occasionally fires at nearby enemies for minor damage',
          'Jade Beacon Module — the bot pulses Regeneration to nearby allies periodically',
        ],
        tips: [
          'The Extractor Module is highly valued for gathering-focused play — extra materials from each node add up quickly.',
          'Jade Dynamo and Jade Tech modules are best for players who frequently use Cantha maps and their Jade Waypoints.',
        ],
      },
    ],
  },

  {
    id: 'achievement-farming',
    categoryId: 'economy',
    title: 'Achievement Points Farming',
    icon: '🏆',
    difficulty: 'intermediate',
    summary: 'Efficient ways to earn Achievement Points and what milestone rewards await.',
    readTime: 4,
    sections: [
      {
        title: 'Why Farm AP?',
        content:
          'Achievement Points (AP) are earned from nearly every activity in the game. They accumulate permanently and unlock milestone rewards at regular intervals. Beyond the rewards, high AP is a status symbol — players with 10,000+ AP are considered veterans. AP also unlocks quality-of-life items at certain thresholds.',
        tips: [
          'AP is purely additive — you never lose AP. Every achievement completed, no matter how small, contributes.',
          'Check your current AP total in the Hero Panel (H) under the Achievements tab.',
        ],
      },
      {
        title: 'Best Sources of AP',
        content: '',
        list: [
          "Daily Achievements — legacy classic dailies award 10 AP per set (up to 3,650 AP/year); these still exist alongside the Wizard's Vault system. The Wizard's Vault gives Astral Acclaim (not AP directly) but completing objectives also unlocks AP-rewarding tracks",
          'Living World Episodes — completing story + achievements from each episode gives 300–600 AP each',
          'Map Completion — each core Tyria, HoT, PoF, EoD, and SotO map rewards AP on completion',
          'Collections — most collections award 5–20 AP on completion; finishing many collections adds up fast',
          'Dungeon Completions — each path awards AP; "Daily Dungeon" bonus provides daily AP',
          'Fractal Achievements — completing milestones in fractals gives substantial AP',
          'Jumping Puzzles — each JP awards AP the first time you complete it',
        ],
        tips: [
          'Living World episode achievements are one of the highest AP-per-hour activities for players who have purchased the episodes.',
          'Sort achievements by "By Type" and filter "Incomplete" to find easy AP you may have missed.',
        ],
      },
      {
        title: 'AP Milestone Rewards',
        content:
          'Every 500 AP unlocks a milestone chest from the Achievement Rewards NPC in major cities. Key milestone rewards include:',
        list: [
          '500 AP — Black Lion Chest Key',
          '1,000 AP — Transmutation Charge (5×)',
          '2,500 AP — Unique title + Transmutation Charges',
          '5,000 AP — Unique "Champion" title prefix unlocked',
          '10,000 AP — Permanent "Legendary" status milestone, unique rewards',
          '15,000+ AP — Ongoing chests including Mystic Coins, Black Lion Goods, and cosmetics',
        ],
        warnings: [
          'The AP NPC only gives out chest rewards when you visit them — do not forget to claim your milestone rewards periodically.',
        ],
      },
    ],
  },

  // ─── Always-Relevant Resource Farming ────────────────────────────────────────

  {
    id: 'mystic-coin-farming',
    categoryId: 'economy',
    title: 'Mystic Coin Farming',
    icon: '🪙',
    difficulty: 'beginner',
    summary: 'How to earn Mystic Coins reliably — the single most valuable crafting material over time.',
    readTime: 4,
    sections: [
      {
        title: 'Why Mystic Coins Matter',
        content:
          'Mystic Coins are used in nearly every Legendary item recipe and many high-end crafts. Their price fluctuates but they are consistently valuable. Unlike most materials, Mystic Coins cannot be crafted — they must be earned or purchased.',
        tips: [
          'Never spend Mystic Coins on low-value recipes. Save them for Legendaries or sell when price spikes.',
          'Current price fluctuates heavily — check the Trading Post before bulk buying.',
        ],
      },
      {
        title: 'Reliable Coin Sources',
        content: '',
        list: [
          'Login Rewards — the most consistent source; Day 28 of each login track awards 35 Mystic Coins (roughly 1.25 coins/day average across the cycle)',
          "Wizard's Vault — seasonal and daily objectives occasionally reward Mystic Coin bundles as purchasable Astral Acclaim items",
          'Achievement Milestones — certain AP thresholds reward Mystic Coins',
          'Black Lion Chests — low drop rate, not reliable as primary farm',
          'Trading Post — buy directly; watch for dips when login reward tracks reset across many players simultaneously',
        ],
        tips: [
          'Log in every day even if not playing — the Login Reward track advances daily and Day 28 is the biggest payout.',
          'The gap between Day 1–27 (small rewards) and Day 28 (35 coins) means missing one day delays your payout significantly.',
        ],
      },
      {
        title: 'Mystic Coins vs. Mystic Clovers',
        content:
          'Mystic Clovers require 1 Mystic Coin per roll in the Mystic Forge (1 Philosopher\'s Stone + 1 Mystic Crystal + 1 Mystic Coin + 1 Glob of Ectoplasm). Each roll has a ~33% chance to produce a Clover. Crafting a single Legendary weapon typically requires 77 Clovers — plan accordingly.',
        warnings: [
          'Do not convert all your Coins into Clovers immediately — save a buffer of 50–100 coins for unexpected crafting needs.',
        ],
      },
    ],
  },

  {
    id: 'ecto-farming',
    categoryId: 'economy',
    title: 'Glob of Ectoplasm Farming',
    icon: '🔮',
    difficulty: 'beginner',
    summary: 'The most important crafting material for end-game gear — how to farm ectos efficiently.',
    readTime: 3,
    sections: [
      {
        title: 'What are Ectos?',
        content:
          'Globs of Ectoplasm (Ectos) are obtained by salvaging Rare (yellow) or Exotic (orange) equipment level 68+. They are used in Ascended crafting, Legendary recipes, and Mystic Forge crafting. Ectos are one of the most traded items on the Trading Post.',
        tips: [
          'Always salvage Rares level 68+ with a Master\'s Salvage Kit or better — lower level Rares do not drop Ectos.',
          'Exotics level 68+ also yield Ectos and often yield more on average — but check TP price vs crafting cost first.',
        ],
      },
      {
        title: 'Best Ecto Farming Methods',
        content: '',
        list: [
          'Dragonfall — highest Exotic/Rare drop rate of any open-world map; 30-minute meta yields 20–40 Ectos worth of salvageable gear',
          'Silverwastes RIBA — dense loot bags (Bandit Bags) each contain Rares at a good rate',
          'Dungeon runs (AC/CoE) — cheap Exotic gear available via dungeon tokens; buy Exotic armor with tokens and salvage for Ectos',
          'Unidentified Gear — buy blue/green Unidentified Gear from vendors and identify at the Mystic Forge for Rares (cost-effective when Ecto price is high)',
          'World Bosses — each boss chest can contain Rares/Exotics; chain them with the world boss train',
        ],
        tips: [
          'Use a Black Lion Salvage Kit on Exotics to guarantee Ecto + chance at Rune/Sigil (sell separately).',
          'When Ecto price is high (>40s), identify and salvage Unidentified Gear is often the most gold-efficient method.',
        ],
      },
      {
        title: 'Ecto Stockpiling',
        content:
          'For Legendary crafting, you will need 250–500+ Ectos depending on which Legendary you craft. Start stockpiling early by salvaging rather than selling every Rare you earn. Material Storage holds up to 250 Ectos — stack materials and overflow into your bank.',
        warnings: [
          'Do not sell Ectos below 30 silver — this is considered near their historical floor and a poor time to sell.',
        ],
      },
    ],
  },

  {
    id: 't6-material-farming',
    categoryId: 'economy',
    title: 'Tier 6 Material Farming',
    icon: '⚙️',
    difficulty: 'intermediate',
    summary: 'Farm the most valuable crafting materials: Ancient Bones, Powerful Blood, Vicious Claws, etc.',
    readTime: 4,
    sections: [
      {
        title: 'What are T6 Materials?',
        content:
          'Tier 6 (T6) crafting materials are the highest tier of common crafting mats. They drop from level 80 enemies and are required in large quantities for Ascended armor, Legendary weapons, and high-end crafting. The six T6 Fine materials are: Powerful Blood, Vicious Claws, Elaborate Totem, Ancient Bones, Armored Scales, and Piles of Crystalline Dust.',
        tips: [
          'Prices shift constantly — check gw2efficiency.com or the TP for current relative values before deciding which mat to target.',
          'Crystalline Dust is usually the cheapest T6 Fine mat; Powerful Blood is often the most expensive.',
        ],
      },
      {
        title: 'Best T6 Farming Routes',
        content: '',
        list: [
          'Frostgorge Sound — Jormag pre-event chain drops large quantities of T6 mats from Risen and Icebrood enemies; one of the oldest and most reliable T6 farms',
          'Dragonfall — best all-around T6 source alongside Ectos; the meta event rewards T6 mat bags',
          'Verdant Brink Night meta — airship loot bags contain T6 mats; best Armored Scales source',
          'Dry Top — Geode vendor sells T6 mat bags during Tier 4+ events; good AFK-friendly option',
          'Silverwastes — Chest of the Maguuma can contain T6 Fine mats; secondary yield alongside Bandit Bag loot',
          'Bitterfrost Frontier — efficient Powerful Blood farm from the Svanir/Icebrood enemies in the north',
        ],
        tips: [
          'Use a Looting Node build with Sigil of Bounty to maximize mob loot.',
          'Stack Magic Find (MF) via Celebration Boosters — MF improves T6 drop rates on Rares and Exotics.',
        ],
      },
      {
        title: 'Mystic Forge T6 Promotion',
        content:
          'You can promote T5 Fine materials to T6 using the Mystic Forge: 4 T5 mats + 1 Thermocatalytic Reagent + other components. This is rarely profitable on its own but can be useful when a specific T6 mat is much more expensive than others.',
        warnings: [
          'Always compare T5→T6 promotion cost vs direct T6 TP purchase before using the Mystic Forge — direct purchase is usually cheaper.',
        ],
      },
    ],
  },

  {
    id: 'karma-farming',
    categoryId: 'economy',
    title: 'Karma Farming & Usage',
    icon: '🙏',
    difficulty: 'beginner',
    summary: 'How to earn and efficiently spend Karma — the most overlooked progression currency.',
    readTime: 3,
    sections: [
      {
        title: 'What is Karma?',
        content:
          'Karma is an account currency earned from Dynamic Events, World Bosses, and daily rewards. It is stored in your wallet (no cap). Karma vendors sell exotic gear, ascended recipes, and unique items. Many players accumulate millions of Karma without spending it.',
        tips: [
          'Karma cannot be converted directly to gold — you must spend it on items and then sell those items on the Trading Post.',
          'Use a Karma booster to double Karma income during active farming.',
        ],
      },
      {
        title: 'Best Karma Conversion Methods',
        content: '',
        list: [
          'Orrian Temples (Cursed Shore/Straits of Devastation) — buy Exotic equipment from temple vendors at ~42k Karma each; salvage for Ectos or sell',
          'Bloodtide Coast — Exotic equipment vendor near Laughing Gull Island meta; consistent gold conversion rate',
          'Iron Marches / Fireheart Rise — karma gear vendors for mid-tier exotic weapons; decent salvage value',
          'Istan (Path of Fire) — the Renowned Vendor (Follower Xunn) sells materials for Karma; specifically Shovels of Maguuma useful for Volatile Magic/Karma conversion',
          'Malchor\'s Leap — Exotic vendor with armor pieces; combine with temple events for large Karma dumps',
        ],
        tips: [
          'The Orrian Temple vendors give the best Karma-to-gold conversion in base game — buy Exotics and salvage for Ectos.',
          'Check current Exotic prices before buying from Karma vendors — only buy items worth more than their vendor cost in gold equivalent.',
        ],
      },
      {
        title: 'Karma Income Sources',
        content: '',
        list: [
          'Dynamic Events — 100–2,500 Karma per event depending on participation and bonuses',
          'World Bosses — 3,000–10,000 Karma per boss with Karma boosters',
          'Dailies and Wizard\'s Vault — Astral Acclaim can be exchanged for Karma booster bundles',
          'Guild Missions — weekly missions award large Karma packages',
          'Bonus Event Weeks — ArenaNet occasionally runs "Karma Bonus" weeks; check the game client',
        ],
      },
    ],
  },

  {
    id: 'volatile-magic-farming',
    categoryId: 'economy',
    title: 'Volatile Magic & Unbound Magic',
    icon: '✨',
    difficulty: 'beginner',
    summary: 'Expansion-specific currencies used to buy materials and ascended gear boxes.',
    readTime: 3,
    sections: [
      {
        title: 'What are These Currencies?',
        content:
          'Volatile Magic (VM) is earned in Path of Fire and later maps. Unbound Magic (UM) is earned in Living World Season 3 maps. Both are stored in your wallet and spent at vendors in their respective maps. They are used to buy crafting materials, ascended salvage tools, and node-unlock items.',
        tips: [
          'Both currencies have no cap and persist forever — accumulate them during normal play and dump when you need specific materials.',
        ],
      },
      {
        title: 'Best Volatile Magic Farms',
        content: '',
        list: [
          'Istan (PoF) — the Palawadan meta event + chest train is the highest VM income per hour in the game; also very high gold/hour',
          'Dragonfall (PoF) — meta event provides VM alongside T6 mats and Ectos; best all-in-one map',
          'Domain of Kourna — Grothmar Wardowns event chain; good VM with karma',
          'Sandswept Isles — continuous event chains; lower VM but very fast event cycling',
        ],
        tips: [
          'At the Istan Renowned Vendor, spend VM on Bags of Rare Materials — these contain T6 Fine mats and are a strong gold-to-VM conversion.',
          'Unbound Magic is best spent at Bitterfrost Frontier (Verdant Brink rates are similar) for Volatile/Unbound Weapons to sell or convert.',
        ],
      },
      {
        title: 'Spending VM Wisely',
        content: '',
        list: [
          'Bags of Rare Materials (Istan vendor) — T6 Fine mats; excellent value',
          'Ascended Salvage Tools (various vendors) — allows salvaging ascended gear for crafting components; required for re-rolling ascended stats',
          'Node Licenses — some vendors sell home instance node licenses purchasable with VM; check gw2efficiency.com for current best VM purchases',
        ],
      },
    ],
  },

  // ─── Raid Wing Guides (Wings 2–7) ────────────────────────────────────────────

  {
    id: 'salvation-pass',
    categoryId: 'raids',
    title: 'Salvation Pass — Wing 2 Guide',
    icon: '🐍',
    difficulty: 'advanced',
    summary: 'Full mechanics breakdown for Wing 2: Slothasor, Bandit Trio, and Matthias Gabrel.',
    readTime: 8,
    sections: [
      {
        title: 'Wing Overview',
        content:
          'Salvation Pass (W2) is set in a White Mantle prison complex deep in the Maguuma Jungle. It contains three encounters and is considered moderate difficulty — a strong step up from Wing 1 due to Matthias Gabrel, one of the most mechanically demanding bosses in the entire raid. Required masteries: Glider Basics.',
        tips: [
          'W2 is commonly run after W1 for new raid squads. Slothasor teaches toughness-based tanking; Matthias teaches every type of punishment for failing mechanics.',
        ],
      },
      {
        title: 'Boss 1 — Slothasor',
        content:
          'Slothasor is a giant slubling whose fight begins when one player eats the Imbued Mushroom and transforms into a slubling themselves. The transformed player must eat mushrooms scattered around the arena to prevent an arena-wide wipe mechanic (Nourishment). Slothasor fixates on the highest-toughness player (the tank), and fixate switches every 30 seconds.',
        list: [
          'Volatile Poison — Slothasor marks a random player with a green circle; that player must run away from the group and drop the poison puddle before it detonates',
          'Tantrum — Slothasor flails and does heavy AoE damage around himself; dodge or move away',
          'Fire Breath — cone attack facing the tank; tanks should face Slothasor away from the group at all times',
          'Spore Release (below 50%) — spreads a deadly poison cloud; the transformed slubling must eat the spores before they reach the group',
          'Fixate switch — when fixate transfers, the new tank must immediately position themselves correctly',
        ],
        tips: [
          'Assign one player (typically a Druid or Chronomancer) as the dedicated slubling eater — they run mushrooms the entire fight.',
          'Use Condition Cleanse to handle Poison stacks from dropped puddles.',
          'Stand on the correct side of Slothasor to avoid being hit by Fire Breath if you are not the tank.',
        ],
        warnings: [
          'If Slothasor is not nourished in time, he wipes the entire raid. The mushroom eater role is the most critical role in this fight.',
        ],
      },
      {
        title: 'Encounter 2 — Bandit Trio (Prison Camp)',
        content:
          'The Bandit Trio is not a traditional boss fight — it is a timed event in which you must protect White Mantle prisoners while killing three overseer mini-bosses: Berg (melee brute), Zane (ranged marksman), and Narella (caster). A 10-minute timer runs from the moment you jump into the camp; if prisoners die or the timer expires, the encounter fails.',
        list: [
          'Berg — a melee berserker; interrupt his Rampage with CC to prevent heavy AoE damage',
          'Zane — a sniper who one-shots targeted players; the marked player should dodge or use invulnerability',
          'Narella — casts AoE fire; stack on her to pressure her down quickly; she enrages if Berg or Zane die first',
          'Prisoners — additional White Mantle guards will attack prisoners; some players must peel off to defend them',
          'Land Mines — scattered through the camp; visible red outline triggers on contact; avoid or carefully clear them',
        ],
        tips: [
          'Kill order matters: bring Berg → Zane → Narella all to low HP before finishing any one.',
          'Assign at least 2–3 players to prisoner defense at all times.',
          'Narella has a soft enrage mechanic if not killed quickly after the others.',
        ],
        warnings: [
          'Narella enrages if Berg or Zane die before her. Coordinate kill timing carefully — bring all three bosses to low HP before finishing any one of them.',
        ],
      },
      {
        title: 'Boss 3 — Matthias Gabrel',
        content:
          'Matthias Gabrel is a former Vigil soldier consumed by the bloodstone. He is widely regarded as one of the hardest individual bosses in raids due to constant sustained pressure from multiple simultaneous mechanics. He cycles through three elemental phases (Snowstorm → Firestorm → Unfocused) based on HP thresholds.',
        list: [
          'Purge (Special Action Skill) — every 10 seconds, a random player gains Purge and takes pulsing damage; they must immediately run to a wall between the fountains and drop the Well of the Profane there — never in the center',
          'Blood Sacrifice — every 45 seconds Matthias marks a player for sacrifice; the squad must break his defiance bar (3,000 strength) within 10 seconds or that player dies instantly',
          'Unstable Blood Magic — Matthias shoots projectiles; reflect these back at him to strip his Blood Shield; do NOT reflect the spinning shard attack as each reflected shard buffs his damage by 10% (up to 250%)',
          'Abomination Phase (below 40%) — Matthias transforms; Spirits run across the arena dealing massive damage; side-step their path (cannot be dodged)',
          'Shards of Rage — spinning AoE in the center; stand at max range or in specific safe spots',
        ],
        tips: [
          'Assign 3–4 players as dedicated CC bursters to reliably break the Blood Sacrifice bar every 45 seconds.',
          'The Purge drop spots along the outer wall need to be memorized — drop them between the fountains, never in high-traffic areas.',
          'Condition builds are favored because all three phases allow conditions to tick without phase resets.',
          'Do not attempt Matthias without a skilled healer; the sustained incoming damage is very high.',
        ],
        warnings: [
          'Never reflect the Shards of Rage (spinning attack). Each reflected shard permanently buffs Matthias\'s damage by 10%, stacking up to 250% — this will wipe the group.',
          'Failing Blood Sacrifice (not breaking the defiance bar in time) kills the targeted player instantly.',
        ],
      },
    ],
  },

  {
    id: 'stronghold-of-the-faithful',
    categoryId: 'raids',
    title: 'Stronghold of the Faithful — Wing 3 Guide',
    icon: '🏯',
    difficulty: 'advanced',
    summary: 'Full mechanics for Wing 3: Escort, Keep Construct, Twisted Castle, and Xera.',
    readTime: 10,
    sections: [
      {
        title: 'Wing Overview',
        content:
          'Stronghold of the Faithful (W3) is set in a White Mantle fortress. It has four encounters and requires Glider Basics, Bouncing Mushrooms, and Ley Line Gliding masteries (the last is required for Xera). The wing tells the story of breaching the Stronghold to rescue Rytlock and Canach.',
        tips: [
          'Ley Line Gliding is mandatory for all 10 players for the Xera fight — make sure every squad member has it before pulling.',
        ],
      },
      {
        title: 'Encounter 1 — Escort (Siege the Stronghold)',
        content:
          'The Escort is a timed event, not a traditional boss fight. Your goal is to escort Scholar Glenna through the White Mantle outer complex, capturing five towers, disabling Bloodstone Turrets, and defeating waves of enemies. Glenna must survive — if she dies, the encounter fails.',
        list: [
          'Surveilled stacks — Glenna loses 1 stack per second when no player is within 1,000 range of her; at 0 stacks four Seekers spawn and attack her; keep someone near her at all times',
          'Land Mines — scattered throughout the path; their red outline triggers instantly and deals lethal damage to Glenna and nearby players; disable or avoid them',
          'Towers — five towers must be captured by outnumbering enemies inside the capture point to disable turrets that suppress your advance',
          'McLeod the Silent — a mini-boss at the end; interrupt his Throw Boulder with CC',
        ],
        tips: [
          'Split the squad: ~5 players escort Glenna, ~5 players rush ahead to cap towers and clear mines.',
          'At least one player needs Bouncing Mushrooms to reach certain towers; one needs Glider Basics for shortcuts.',
        ],
        warnings: ['If Glenna dies at any point, the entire encounter fails immediately. Never let her get surrounded.'],
      },
      {
        title: 'Boss 2 — Keep Construct',
        content:
          'Keep Construct is a golem boss protected by Xera\'s Embrace. The fight cycles through three sub-phases and punishes slow DPS with an escalating damage buff gained every minute. Two types of phantasms spawn and only players with the matching attunement color can damage them.',
        list: [
          'Xera\'s Embrace Phase — two white projections orbit Keep Construct; kill both to reveal its defiance bar (3,500 strength); CC to break the bar and advance the phase',
          'Attunement Phantasms — five Radiant and five Crimson phantasms spawn; players must kill only their matching color within 15 seconds or take massive damage',
          'Orb AoE detonation — 30 seconds in, every player has a slow-filling AoE that detonates after 10 seconds for 20% max HP per overlapping AoE; spread out',
          'Exposed Core Phase — three invulnerable phantasms appear at north, SE, SW with emptying green circles; at least 2 players must stand in each circle before it empties',
        ],
        tips: [
          'Assign Radiant and Crimson players before the pull — confusion during the attunement phase is the most common wipe cause.',
          'Spread slightly during the orb detonation phase; stacking tight is only safe during DPS windows.',
          'The escalating damage buff makes this a soft DPS check — slow groups will be overwhelmed over time.',
        ],
        warnings: ['Failing to kill all 10 color phantasms within 15 seconds causes lethal raid-wide damage. This is the most common wipe in KC.'],
      },
      {
        title: 'Encounter 3 — Twisted Castle',
        content:
          'The Twisted Castle is a movement/navigation puzzle encounter, not a traditional boss fight. Players must traverse a labyrinthine castle while managing the Madness debuff, which passively accumulates 1 stack every 5 seconds (faster when facing the central spire). At 99 stacks, you die instantly.',
        list: [
          'Madness management — interact with fountains: "Dip your hands" removes 10 stacks; "Drink the water" grants temporary immunity (better for speed)',
          'Haunting Statues — moving statues that teleport you back to the start if they touch you; freeze them by directly facing them; do not attack them',
        ],
        tips: [
          'Move in a group — having someone face a statue protects everyone nearby.',
          'The castle has a fixed optimal path — learn it or follow a commander tag.',
        ],
        warnings: ['At 99 Madness stacks, death is instant and unavoidable. Do not let stacks accumulate if you are unfamiliar with the layout.'],
      },
      {
        title: 'Boss 4 — Xera',
        content:
          'Xera is the final boss of W3. Every player must have Ley Line Gliding to participate. Throughout the fight, Xera applies Derangement — a stacking debuff that adds new conditions every 10 stacks. At 50% HP, the platform partially collapses and all players must glide to outer platforms for an Intermediate Phase before Xera returns.',
        list: [
          'Derangement — gained from various attacks; escalates every 10 stacks from boon loss to bleeding to torment to cripple; does not directly kill but increases sustained damage taken',
          'Crystal Phases — Xera periodically becomes invulnerable and spawns Crimson Phantasms; kill them to make her vulnerable again',
          'Intermediate Phase (50% HP) — central platform collapses; all players Ley Line Glide to three outer platforms and defeat elite enemies before gliding back',
        ],
        tips: [
          'Practice the Ley Line Glide path before entering W3 — panic-gliding off the edge kills you.',
          'Split 3–4 players per outer platform during the intermediate phase and kill enemies quickly.',
        ],
        warnings: ['All 10 players must have Ley Line Gliding mastery. Even one player without it cannot survive the intermediate phase and the encounter will likely fail.'],
      },
    ],
  },

  {
    id: 'bastion-of-the-penitent',
    categoryId: 'raids',
    title: 'Bastion of the Penitent — Wing 4 Guide',
    icon: '⛓️',
    difficulty: 'advanced',
    summary: 'Full mechanics for Wing 4: Cairn, Mursaat Overseer, Samarog, and Deimos.',
    readTime: 10,
    sections: [
      {
        title: 'Wing Overview',
        content:
          'Bastion of the Penitent (W4) is set in a Mursaat fortress used to imprison powerful enemies. It contains four bosses with distinctive mechanics — from a tile board game (Mursaat Overseer) to a multi-phase platform encounter (Deimos). Most bosses are moderate difficulty; Deimos is a major difficulty spike.',
      },
      {
        title: 'Boss 1 — Cairn the Indomitable',
        content:
          'Cairn is one of the simpler raid bosses mechanically but punishes players who neglect movement. Players receive the Celestial Dash Special Action Skill (a 1,200-range targeted evade-dash) before the fight. Every player passively accumulates Unseen Burden (1 stack/second), which slows movement by 1% per stack up to 99 stacks.',
        list: [
          'Celestial Dash — use it every 10 seconds (Countdown timer effect); missing the window auto-triggers it at max range',
          'Unseen Burden — stacks of slowness; cleared by successfully completing Green Circle mechanics',
          'Spatial Manipulation (Green Circles) — multiple green circles appear, each marked with the required player count (gold orbs); correct number of players must stand inside before the circle empties or everyone takes heavy damage',
          'Dark Circles (Displacement) — overlapping purple AoEs teleport players who stand in them to random locations; move out quickly',
        ],
        tips: [
          'Unseen Burden does not affect Celestial Dash or dodges — use both freely even at high stacks.',
          'Pre-position for Green Circles at high Burden stacks — you cannot sprint across the arena.',
        ],
      },
      {
        title: 'Boss 2 — Mursaat Overseer',
        content:
          'Mursaat Overseer is considered the easiest raid boss — essentially a DPS check with board game mechanics. The fight takes place on a 4x4 grid of tiles: half friendly (brown/safe), half enemy (orange, 3,500 damage/second). Three players receive SAKs: Claim, Dispel, and Protect.',
        list: [
          'Claim (SAK) — the Claim player becomes the toughness-based tank and flips enemy tiles to safe tiles with a ground-targeted skill; must also position Mursaat Overseer to cleave Jade Scouts',
          'Dispel (SAK) — removes shields from Jade Scouts at 1,500 range, stunning them; use when scouts have red circles',
          'Protect (SAK) — drops a 5-second damage-immunity bubble at a target location; use for spike rows or Jade Soldier explosions',
          'Jade Scouts — advance from the back of the board each column; transform into Jade Soldiers upon reaching the front, applying Poison/Torment/Slow and exploding on death for high damage',
          'Spike rows — at 75%, 50%, and 25% HP a new row of lethal spikes activates, reducing safe tiles to just 4 by the final phase',
        ],
        tips: [
          'Every player except the three SAK holders simply does their rotation and avoids orange tiles.',
          'Dispel scouts before they reach the front row to prevent lethal Jade Soldier explosions.',
        ],
      },
      {
        title: 'Boss 3 — Samarog',
        content:
          'Samarog is the most CC-demanding boss in all raids (4,500-strength defiance bar, required 8–9 times). The arena is ringed with instant-kill spike walls. Key adds: Rigom (push under Samarog) and Guldhem (shielded until Rigom explodes near him).',
        list: [
          'Spike walls — every knockback risks sending players into instant-kill perimeter spikes; stay near the center',
          'Guldhem/Rigom mechanic — Guldhem is shielded; to remove the shield, a player must knock Rigom under Samarog so Rigom\'s death explosion strips the shield; this repeats every 33% of Guldhem\'s HP',
          'Inevitable Betrayal — every 25 seconds Samarog targets a player with a large orange circle and another with a small green circle; these two players must stack exactly or the orange-circle player takes lethal damage',
          'Spear attacks — Spears of Aggression (Taunt) and Spears of Revulsion (Fear) knockback players; dodge the telegraph AoEs to avoid being thrown into spike walls',
        ],
        tips: [
          'Bring heavy hard CC: Hammer, Skull Crack, Gravity Well, Ranger Spike Trap help break the 4,500-strength bar.',
          'Assign a dedicated pusher with a reliable knockback to manage Rigom consistently.',
        ],
        warnings: [
          'Never stand near the spike walls — knockbacks from Samarog\'s attacks are lethal if they carry you into the perimeter.',
          'Failing Inevitable Betrayal by not stacking with your partner kills the orange-circle player instantly.',
        ],
      },
      {
        title: 'Boss 4 — Deimos',
        content:
          'Deimos is one of the hardest and most punishing bosses in all raids. It requires a dedicated Hand Kiter, careful Demonic Tear management, and protection from Saul during Mind Crush. The encounter fails the squad if the Decay mechanic is mishandled.',
        list: [
          'Pre-Phase — Greeds (small ghosts, 2% HP damage) and Prides (large ghosts, 20–25% HP damage) walk toward the Shackled Prisoner Saul; permanently Immobilize Prides and kill Greeds; Saul dying fails the encounter',
          'Grasping Hands — every 10 seconds five Hands spawn under the farthest player from Deimos; a dedicated Hand Kiter leads these away from the group and AoEs them down',
          'Mind Crush (from 90% HP) — Deimos channels for 5 seconds then deals lethal damage to everyone not inside Saul\'s protective bubble, blocking, or invulnerable; track Saul\'s position',
          'Demonic Tears (from 75% HP) — tears shoot unblockable projectiles; step on the white swirl to close each tear (gaining 1-minute Tear Instability preventing you from closing another)',
          'Demonic Realm phases (at 75%, 50%, 25%) — a green circle transports some players to a demonic realm to break four chains while Deimos tries to knock them off the platform',
          'Final Phase (below 40%) — platform shrinks; Greeds/Prides return at high frequency alongside all other mechanics simultaneously',
        ],
        tips: [
          'Hand Kiting is a specialized role — use the Handkite Soulbeast build from Hardstuck or Snow Crows.',
          'Assign tear closers before the pull and track Tear Instability so tears never accumulate.',
          'Saul\'s Unnatural Signet (~every 60 seconds) gives Deimos 200% more incoming damage — save burst cooldowns for this window.',
        ],
        warnings: [
          'Mind Crush is lethal to anyone not inside Saul\'s bubble. Always track where Saul repositions.',
          'Failing the demonic realm chain-break can cascade into a squad wipe.',
        ],
      },
    ],
  },

  {
    id: 'hall-of-chains',
    categoryId: 'raids',
    title: 'Hall of Chains — Wing 5 Guide',
    icon: '💀',
    difficulty: 'advanced',
    summary: 'Full mechanics for Wing 5: Soulless Horror, River of Souls, Statues of Grenth, and Dhuum.',
    readTime: 10,
    sections: [
      {
        title: 'Wing Overview',
        content:
          'Hall of Chains (W5) is set in the Underworld, home of Grenth. It has four encounters — three are distinct challenge types rather than traditional boss fights. This wing is considered hard; Dhuum is one of the most mechanically complex and punishing bosses in the entire raid roster. Condition DPS is preferred since most encounters have no phase resets.',
      },
      {
        title: 'Boss 1 — Soulless Horror',
        content:
          'Soulless Horror requires two dedicated tanks who share the Necrosis debuff (increases incoming damage by 10% per stack) and alternate fixate via the Issue Challenge Special Action Skill. Walls of green fire (Surging Souls) spawn periodically and are instant death on contact.',
        list: [
          'Necrosis — the active tank gains 1 stack every 12 seconds; swap at ~3 stacks by having the off-tank activate Issue Challenge',
          'Surging Souls (Walls) — rectangular AoEs sweeping from a cardinal direction; instant death on contact; teleport/shadowstep skills can pass through them',
          'Tormented Dead (from 90% HP) — spawn every 20 seconds, follow the off-tank; a dedicated pusher knocks them to the arena edge before they die; their death AoE (Soul Rift) corrupts boons and lasts 1 minute',
          'Platform degradation — at ~30% HP the outer ring of the arena falls away, shrinking safe space',
        ],
        tips: [
          'Condition builds are strongly preferred — no phase transitions mean conditions tick uninterrupted.',
          'The pusher should knock Tormented Dead to the outer edge and wait until conditions are stacked before the killing blow.',
          'Communicate tank swaps clearly over voice — a missed swap leads to a dead tank quickly.',
        ],
        warnings: ['Surging Souls are instant death — there is no surviving them with toughness or healing. You must physically dodge or teleport through them.'],
      },
      {
        title: 'Encounter 2 — River of Souls',
        content:
          'The River of Souls is a movement event. A stream of Enervating Souls flows down a corridor and the squad must walk against the current, defeating waves of enemies while keeping pace to avoid being pushed back off the ledge. Escort Desmina safely to the exit.',
        list: [
          'Enervating Souls — ghost projectiles that apply slowing stacks if too many pass through you',
          'Enemy waves — undead mobs spawn from the sides; kill them to maintain forward movement',
          'Falling behind the soul current causes a squad wipe — stay ahead of it',
        ],
        tips: [
          'Use AoE cleave for enemy waves and keep Movement boons (Swiftness) active throughout.',
          'This event does not require specialized roles — strong AoE DPS and heals are sufficient.',
        ],
      },
      {
        title: 'Encounter 3 — Statues of Grenth',
        content:
          'Three mini-bosses (Broken King, Eater of Souls, Eyes of Darkness) must each be killed using specific conditions rather than raw DPS. Power damage is recommended since you can simply stop your rotation to throttle damage.',
        list: [
          'Broken King (Ice) — must die within 3.5 minutes; at low HP, green circles appear under hailstones; enough players must stand in each circle before the hailstone lands',
          'Eater of Souls (Death) — six torches must be lit on the Jackal portal above; Eater gains a break bar after a green circle; one player may be "eaten" (safely expelled in downstate); during the aerial phase, each player must collect 5 orbs within 30 seconds',
          'Eyes of Darkness (Darkness) — two Throwers on elevated platforms throw orbs at enemy eyes; both Eyes must die simultaneously or the survivor revives its twin',
        ],
        tips: [
          'These mini-bosses can be completed in any order; most groups start with Eater of Souls.',
          'Coordinate the simultaneous kill on Eyes of Darkness — bring both to near-death before finishing either.',
        ],
        warnings: ['Do not kill one Eye of Darkness before the other — the survivor will fully revive its twin, resetting the encounter.'],
      },
      {
        title: 'Boss 4 — Dhuum',
        content:
          'Dhuum is one of the hardest raid bosses in GW2. He requires multiple specialized roles, excellent spatial awareness, and a precise 10-phase ritual to seal him. Dhuum starts at 10% visible HP but is protected; the squad deals his HP from 100% to 10% before triggering the final ritual.',
        list: [
          'Messenger Kiter — a dedicated role; Messengers spawn around the arena and must be continuously kited away from the group and Dhuum',
          'Reaper Mechanic (every 30 seconds) — Dhuum reaches for a Reaper with a green circle; at least one player must stand inside before it empties or the Reaper dies and the raid wipes; three players rotate this duty, each gaining a 90-second Fractured Spirit debuff afterward',
          'Dhuum\'s Orbs — large death orbs fired across the arena; dodge out of their path continuously',
          'Final Ritual Phase (10% HP) — all players enter Spirit form; collect 5 orbs each within 30 seconds; activate all 7 Ethereal Seals simultaneously by channeling them; then burst Dhuum before time expires',
        ],
        tips: [
          'Practice the Reaper rotation before entering — assign players 1, 2, and 3 and cycle them; confusion here causes instant wipes.',
          'The Messenger Kiter should have a build with strong mobility and self-sustain (Druid, Scourge).',
          'Pre-assign seals in the final phase — disorganized seal activation fails the ritual.',
        ],
        warnings: [
          'If no player is inside a Reaper\'s green circle when it empties, that Reaper dies and the raid wipes immediately.',
          'Failing to activate all 7 seals in time during the final ritual resets the phase and Dhuum regains HP.',
        ],
      },
    ],
  },

  {
    id: 'mythwright-gambit',
    categoryId: 'raids',
    title: 'Mythwright Gambit — Wing 6 Guide',
    icon: '🔱',
    difficulty: 'advanced',
    summary: 'Full mechanics for Wing 6: Conjured Amalgamate, Twin Largos, and Qadim.',
    readTime: 9,
    sections: [
      {
        title: 'Wing Overview',
        content:
          'Mythwright Gambit (W6) is set in Qadim\'s personal domain, the Mythwright Cauldron. It contains three encounters of escalating complexity — from a mechanics-puzzle boss to a split-platform fight to a full multi-phase kiting encounter. This wing is considered hard-to-very-hard.',
      },
      {
        title: 'Boss 1 — Conjured Amalgamate',
        content:
          'Conjured Amalgamate is a massive construct made from Mystic Forge items. It is Shielded (invulnerable) and can only be damaged directly after its arms are destroyed. Players must collect weapon bubbles to deal arm damage and shield bubbles to survive the Thunderclap wipe mechanic.',
        list: [
          'Arm targeting — the boss slams the side where most players are standing; the opposite arm becomes targetable; split the squad evenly to expose both arms simultaneously',
          'Sword Bubbles — spawn on the left after each slam; collecting them grants Conjured Sword buff needed to damage the left arm',
          'Shield Bubbles — spawn on the right; collecting them grants Conjured Shield buff providing protection against Thunderclap',
          'Thunderclap — after three arm slams with both arms intact, the boss claps both arms together for lethal arena-wide damage; players MUST have Conjured Shield active to survive',
          'Damage window — after each arm is destroyed, Conjured Amalgamate becomes briefly targetable; colored orbs fly toward it; collect your matching color for a damage bonus',
        ],
        tips: [
          'Assign 5 players per side (left for swords, right for shields) to ensure both arms are attacked and Thunderclap protection is maintained.',
          'Missing shield bubble collection means dying to Thunderclap — treat it as the top priority mechanic.',
        ],
        warnings: ['Thunderclap is lethal to players without Conjured Shield active. If you miss shield collection, use dodge/invulnerability to survive.'],
      },
      {
        title: 'Boss 2 — Twin Largos (Nikare & Kenut)',
        content:
          'Nikare and Kenut are twin Largos assassins fought across multiple platforms with a strict 2-minute timer per platform. Failure to phase a boss before the timer causes an instant squad wipe. The encounter splits the squad at 50% HP for a simultaneous two-platform fight.',
        list: [
          'Platform timer — 2 minutes to phase the boss; failure causes an instant squad wipe; this is a hard DPS check',
          'Aquatic Vortices (Kenut\'s platform) — three roaming water tornadoes deal damage, Chill, Slow, and Waterlogged; weave around them while DPSing',
          'Split phase (50% each) — Kenut moves to a northeast platform, Nikare to a northwest platform; the squad splits into two groups; a portal Mesmer can open instant travel to the second platform',
          'Aquatic Barrage — at set intervals both bosses gain a defiance bar and Barrier and spin shooting water bolts; break the bar to stop the barrage from hitting the other platform',
          'Twin enrage — when one twin dies, the survivor enrages and deals double damage; kill them as simultaneously as possible',
        ],
        tips: [
          'Bring a Mesmer with Portal Entre — a portal during the split phase saves 10–15 seconds and helps both sub-groups meet their timers.',
          'Pre-assign Nikare vs Kenut groups before the pull and pre-stack Might before splitting.',
        ],
        warnings: [
          'The 2-minute timer is unforgiving. If DPS is below target, you will wipe at the timer regardless of surviving all mechanics.',
          'When a twin enrages, many abilities become one-shot. Simultaneous kills are strongly preferred.',
        ],
      },
      {
        title: 'Boss 3 — Qadim',
        content:
          'Qadim is one of the hardest encounters to learn in GW2. The fight has three platform phases, each featuring a legendary creature that must be defeated in Qadim\'s menagerie. A dedicated Qadim Kiter is required to manage Lava Elementals and keep Qadim on his platform. Qadim can only be damaged during brief burn phases.',
        list: [
          'Platform phases — the arena transforms three times (Hydra → Destroyer → Wyvern Matriarch/Patriarch); each phase a menagerie team defeats the legendary creature and "frees" it to assist against Qadim',
          'Lamp mechanic — each phase, destroying the center lamp concludes the menagerie sub-event; the freed creature damages Qadim for up to 80% HP of each phase; only after this does the squad get a burn window',
          'Qadim Kiter — one player kites Qadim continuously around his platform, intercepting Lava Elementals and preventing them from reaching him; requires a mobile self-sustaining build (Druid, Deadeye, Herald)',
          'Wyvern phase (33% HP) — two Wyverns spawn; both must be brought to 75% HP only, not killed; tank them separately',
        ],
        tips: [
          'The Kiter role is specialized — practice it in isolation first. Lava Elementals reaching Qadim is the primary wipe cause for learning groups.',
          'Communicate lamp destruction timing to the main platform — the burn window opens immediately after; precast all DPS cooldowns.',
        ],
        warnings: [
          'Qadim is immune to damage outside of burn phases. Do not waste burst cooldowns while he is protected.',
          'Lava Elementals that reach Qadim can trigger a chain that wipes the squad. The kiter must intercept every one.',
        ],
      },
    ],
  },

  {
    id: 'key-of-ahdashim',
    categoryId: 'raids',
    title: 'The Key of Ahdashim — Wing 7 Guide',
    icon: '💎',
    difficulty: 'advanced',
    summary: 'Full mechanics for Wing 7: Cardinal Adina, Cardinal Sabir, and Qadim the Peerless.',
    readTime: 10,
    sections: [
      {
        title: 'Wing Overview',
        content:
          'The Key of Ahdashim (W7) is set in a djinn palace and is widely regarded as the hardest raid wing in GW2. Cardinal Adina (Earth) and Cardinal Sabir (Air) must both be defeated before Qadim the Peerless can be attempted. QtP requires three dedicated Pylon Kiters — among the most specialized roles in the game. Legendary Divinations drop here and are equivalent to Legendary Insights from other wings.',
        tips: [
          'W7 is generally the final progression wing. Do not attempt it without having cleared W1–W6 and having well-optimized builds and experienced squad members.',
        ],
      },
      {
        title: 'Boss 1 — Cardinal Adina',
        content:
          'Cardinal Adina is the Earth Cardinal, fought on a hexagonal platform surrounded by quicksand and five rock pillars. The fight tests positioning precision above all else. Pillars are a finite defensive resource — once destroyed they cannot be replaced.',
        list: [
          'Boulder Barrage — Earth Elementals launch boulders at the squad; players must hide behind a pillar to survive; each pillar can only absorb 2 barrage hits before shattering permanently',
          'Pillar defense — assign players to kill Earth Elementals before they launch boulders; each prevented barrage saves a pillar charge',
          'Hand of Erosion / Eruption — radial AoE stomp around Adina; dodge out of the quicksand ring when telegraphed',
          'Stalagmites — radial spike waves around the arena; dodge the telegraph AoEs',
          'Petrify — Adina stuns players; maintain Stability uptime via Firebrand or Guardian support to prevent petrification',
        ],
        tips: [
          'Assign 2–3 players per pillar side to reliably kill Earth Elementals before they fire.',
          'Pillar management is the core skill check — losing all pillars leads to a wipe since there is no cover for Boulder Barrage.',
        ],
        warnings: ['Each pillar only absorbs 2 Boulder Barrages total. Once all five pillars are gone, the squad has no protection and will wipe on the next barrage.'],
      },
      {
        title: 'Boss 2 — Cardinal Sabir',
        content:
          'Cardinal Sabir is the Air Cardinal. His mechanics are relatively intuitive but most of them down players on failure. The fight is fast-paced and movement-intensive, rewarding squads that react quickly to wisp spawns.',
        list: [
          'Violent Currents — Sabir\'s auto attacks apply this buff to himself, increasing damage he takes; do NOT cleanse it from him',
          'Paralyzing Wisps — large wisps that Immobilize and build Momentum (increasing attack speed and damage by 5% per stack, up to 20); break their defiance bar immediately to interrupt the chain',
          'Voltaic Wisps — smaller, faster wisps; kill them promptly to avoid being overwhelmed',
          'Stormshard projectiles — large lightning shots that leave ground AoEs; sidestep the path — cannot be blocked or evaded',
          'Lightning Cage — Sabir cages a portion of the arena in lightning walls; stand inside the cage or take continuous lethal damage',
        ],
        tips: [
          'Prioritize Paralyzing Wisps above all — high Momentum stacks combined with Immobilize creates a lethal trap.',
          'Movement boons (Swiftness, Superspeed) are valuable throughout due to the fast-paced nature of the fight.',
        ],
        warnings: ['Failing to break a Paralyzing Wisp\'s bar allows its Momentum to stack to 20, making its attacks nearly guaranteed to down players.'],
      },
      {
        title: 'Boss 3 — Qadim the Peerless',
        content:
          'Qadim the Peerless (QtP) is considered the hardest raid encounter in GW2. It requires three Pylon Kiters, a Tank, and exceptional squad coordination. Every player receives the Flux Disruptor SAK; only the Tank and three Pylon Kiters should ever activate it.',
        list: [
          'Flux Disruptor (SAK) — a flip-skill; activating tethers you to QtP (Tank role) or to a Pylon (Kiter role); deactivating releases the tether; all other players must never activate this skill',
          'Pylon Kiters — each of the three kiters tethers to one pylon; pylons form QtP\'s invulnerability shield; kiters break each pylon\'s defiance bar to "possess" it, stripping QtP\'s shield and making him damageable',
          'Kinetic Abundance — buff from possessing a pylon; grants Alacrity, Fury, Might, Quickness but no sustain; kiters must self-sustain through their build',
          'Orb mechanic — from 95% HP every 5% until 40%, QtP launches an orb falling at one of three marked spots; kiters must intercept the orb before it lands using teleport skills, then immediately return to their pylon',
          'Anomalies — small adds patrolling orb landing zones; if an orb lands on one it deals massive squad-wide damage; kiters must clear Anomalies and catch orbs simultaneously',
          'Final Phase (40% HP) — all three pylons activate simultaneously; kiters must maintain all three strips in sequence while the squad bursts QtP to 0 before the enrage timer',
        ],
        tips: [
          'Pylon Kiter builds: Rifle Deadeye and Condition Scourge are the meta choices; both have strong self-sustain and teleport mobility for orb pickup.',
          'Practice orb pickup routes in an empty instance before progging — the teleport timing is build- and skill-dependent.',
          'Non-kiters should focus on clearing Anomalies in their zone to assist kiters.',
        ],
        warnings: [
          'If a kiter loses their pylon tether, QtP regains his invulnerability shield. Retaking the pylon is possible but loses DPS time — the most common wipe cause in learning runs.',
          'Non-kiters who accidentally activate Flux Disruptor lose a pylon tether. Confirm SAK roles before the pull.',
        ],
      },
    ],
  },

  // ─── Seasonal Events ─────────────────────────────────────────────────────────

  {
    id: 'seasonal-events-overview',
    categoryId: 'events',
    title: 'Seasonal Events Overview',
    icon: '🗓️',
    difficulty: 'beginner',
    summary: 'All recurring annual festivals in GW2 — dates, currencies, key rewards, and what to prioritize.',
    readTime: 8,
    sections: [
      {
        title: 'Why Do Seasonal Events?',
        content:
          'GW2 seasonal events return each year and offer time-limited cosmetics, currencies, and achievements. Many exclusive weapon skins, backpacks, and mini pets are only obtainable during specific festivals. The meta-achievement for each event rewards unique cosmetics and Achievement Points. Even veteran players return for the fresh yearly rewards.',
        tips: [
          'Each event has a meta-achievement — completing it rewards the best cosmetic for that festival.',
          'Currencies from one year typically carry over and are usable in future years\' vendors.',
          'Check wiki.guildwars2.com each year for exact start/end dates — they shift slightly year to year.',
        ],
      },
      {
        title: 'Lunar New Year (January–February)',
        content:
          'Lunar New Year celebrates the Canthan New Year calendar in the Crown Pavilion in Divinity\'s Reach. Each year features a new Chinese zodiac animal theme. The 2026 edition (February 3–24, 2026) celebrated the Year of the Horse.',
        list: [
          'Currency — Divine Lucky Envelopes; Lucky Envelopes drop from activities and reward Essences of Luck, seasonal foods, fireworks, and zodiac-themed collectibles',
          'Luck donation — donate Essences of Luck to Drooburt (5,000 total, repeatable) for bonus rewards',
          'Zodiac Lantern backpacks — a new zodiac-animal themed backpack released each year (e.g., Lucky Great Horse Lantern in 2026)',
          'Daily activities — Crown Pavilion boss blitz, envelope opening, daily Lunar New Year achievements',
        ],
        tips: [
          'Salvaging Globs of Ectoplasm or fine/masterwork gear provides Essences of Luck to supplement envelope gains.',
          'Lunar New Year is one of the shorter festivals (~3 weeks); prioritize the meta-achievement first.',
        ],
      },
      {
        title: 'Super Adventure Box (March–May)',
        content:
          'Super Adventure Box (SAB) is a retro 8-bit themed festival set inside a virtual arcade game. The 2025 SAB ran April 15–May 6, 2025; 2026 is expected in a similar April window. Features World 1 and World 2 zones across Normal, Infantile (easier), and Tribulation (punishing) modes.',
        list: [
          'Currency — Baubles (basic) and Bauble Bubbles (premium); Tribulation Mode rewards special trophies for crafting unique retro weapon skins',
          'Tribulation Mode — nearly every surface and jump is a trap; completing it rewards the most prestigious SAB cosmetics; requires memorizing trap layouts',
          '2025 new rewards — Powered Boots (meta achievement), Retro-Forged Torch/Axe/Trident weapons, Super Rainbow Cloud weapon set with rainbow glow, Mini Super Yellow Ooze',
          'Jumpionships — community speed-running competitions held annually during SAB by community groups',
        ],
        tips: [
          'Normal mode is fully accessible to all players and is where most currency comes from.',
          'Tribulation Mode is optional but rewards the most prestigious SAB cosmetics; expect significant memorization.',
          'SAB is considered one of the most beloved community events in GW2 history.',
        ],
      },
      {
        title: 'Dragon Bash (June)',
        content:
          'Dragon Bash celebrates past victories over Elder Dragons through holograms, fireworks, and dragon-bashing combat in Hoelbrak. The 2025 festival ran June 17–July 8, 2025.',
        list: [
          'Currency — Zhaitaffy (earned by smashing dragon pinatas in Hoelbrak)',
          'Dragon Bash Victory Coffers — contain Holographic Weapon Skins; earned by completing 5 daily achievement days',
          'Meta achievement reward — Victorious Holographic Wings Backpack (7 eligible achievements required) + 50 AP',
          '2025 new rewards — Raven-Blessed Visage, Sacred Raven\'s weapon set, Mini Golden Labrador, three new Uncrowned Legend\'s weapons (warhorn, trident, greatsword)',
          'Activities — Dragon Hologram events, Holographic Dragon Wing races, dragon pinata smashing, Holographic Shockwave mini-game',
        ],
        tips: [
          'Complete 5 days of daily Dragon Bash achievements to earn Victory Coffers.',
          'Smash dragon pinatas in Hoelbrak daily — the primary Zhaitaffy farm.',
          'The Victorious Holographic Wings Backpack is the annual standout cosmetic for holographic aesthetic fans.',
        ],
      },
      {
        title: 'Festival of the Four Winds (July–August)',
        content:
          'Festival of the Four Winds returns the Zephyrite trade ships to Labyrinthine Cliffs and opens the Crown Pavilion. The 2025 festival ran August 5–26, 2025 (slightly shifted from the traditional July timing).',
        list: [
          'Currency — Festival Tokens (from all activities), Geodes (earned in Dry Top during the festival)',
          'Favor of the Zephyrites — tiered standing system from Dry Top events; each tier unlocks new vendor items and discounts from Zephyrite merchants; Tier 4 gives the best prices',
          'Ascended accessories — Zephyrite merchants in Dry Top sell ascended accessories for Geodes; good value for newer players',
          'Meta achievement reward — Cloud Cuirass unique chest armor piece (2025)',
          'Activities — Sanctum Sprint (racing mini-game), Aspect Arena (PvP mini-game), Crown Pavilion Champion boss blitz, Labyrinthine Cliffs exploration',
        ],
        tips: [
          'Dry Top meta events provide the best Geode income — participate in the full event cycle.',
          'Sanctum Sprint achievements give solid AP and are repeatable.',
          'Crown Pavilion Champion bosses are best done with a full group for maximum rewards.',
        ],
      },
      {
        title: 'Halloween — Shadow of the Mad King (October–November)',
        content:
          'Shadow of the Mad King is GW2\'s Halloween festival, running from early October to early November annually. The 2025 edition ran October 7–November 4, 2025. Set in Lion\'s Arch and the Mad King\'s Realm.',
        list: [
          'Currency — Candy Corn (from Trick-or-Treat Bags and Mad King\'s Labyrinth enemies); Candy Corn Cobs (crafted from bulk Candy Corn)',
          'Trick-or-Treat Bags — from trick-or-treating at doors in LA, Labyrinth enemies, and activities; contain seasonal foods, tonics, costumes, and dye kits',
          'Meta achievement reward — Clawing Shadow Plate chest armor (2025); refreshes annually',
          '2025 new rewards — Candy Core weapon set (Candy Corn fuel), Sanguine Focus / Shield / Staff (rare bag drops)',
          'Activities — Mad King\'s Labyrinth (open-world farm), Lunatic Inquisition (PvP hide-and-seek), Reaper\'s Rumble (PvP), Clock Tower jumping puzzle, Haunted Doors trick-or-treating',
        ],
        tips: [
          'The Mad King\'s Labyrinth under a commander tag is the best Candy Corn farm — tag enemies continuously.',
          'Trick-or-treating at LA doors costs nothing and is fast AP; do it every day.',
          'Clock Tower is notoriously difficult but gives unique cosmetics — practice in empty instances during off-peak hours.',
        ],
      },
      {
        title: 'Wintersday (December–January)',
        content:
          'Wintersday is GW2\'s winter holiday festival in Divinity\'s Reach. The 2025 edition ran December 9, 2025–January 6, 2026.',
        list: [
          'Currency — Wintersday Gifts (from nearly every activity), Snowflakes, Snow Diamonds (crafting materials from gifts)',
          'Meta achievement reward — Winter Snow Goggles + choice of a Sugardrift weapon (2025)',
          '2025 new rewards — Plush Jorms Backpack, Mini Plush Tiger, Sugardrift weapon set, new guild hall Wintersday decorations',
          'Activities — Bell Choir (rhythm co-op game; earns Karma and Gifts), Toypocalypse (wave defense), Winter Wonderland jumping puzzle, Snowball Mayhem (PvP), Tixx\'s Infinirarium',
          'Reward tracks — temporary Wintersday WvW and PvP reward tracks active during the festival',
        ],
        tips: [
          'Bell Choir gives good Gift income for minimal time investment and is beginner-friendly.',
          'Toypocalypse is ideal for achievement hunting and accessible to all skill levels.',
          'Save Wintersday Gifts year-over-year — the crafting materials and minis are consistently valuable on the Trading Post.',
        ],
      },
      {
        title: 'New & Noteworthy Events (2025–2026)',
        content:
          'In addition to the six recurring annual festivals, several significant content events and seasonal systems were added or expanded in the 2025–2026 cycle alongside the Janthir Wilds expansion.',
        list: [
          'Return to Janthir Wilds (Feb 24–Mar 10, 2026) — limited-time replay event for the Janthir Wilds expansion story; bonus rewards for completion',
          'Wizard\'s Vault seasonal refreshes — quarterly seasonal updates with new objectives and cosmetic rewards tied to each major content release',
          'Janthir Wilds Vault Season (Aug 2024+) — introduced Falling Star Quest License (earns the ascended Falling Star spear), Onyx Spider weapon collection, and Rot Stalker armor set pieces',
          'Legendary Starter Kit Set 5 — added to the Wizard\'s Vault in 2025; includes two new weapon kits for players pursuing their first legendary weapons',
        ],
        tips: [
          'The Wizard\'s Vault is a permanent daily/weekly/seasonal objective system — check it daily for free rewards including gold, ascended gear, and cosmetics, even outside festival periods.',
          'Quest Licenses are a new acquisition path for specific ascended weapons via guided content chains rather than pure crafting — ideal for players who prefer story-driven progression.',
        ],
      },
    ],
  },

  // ─── Janthir Wilds ───────────────────────────────────────────────────────────

  {
    id: 'janthir-wilds-overview',
    categoryId: 'start',
    title: 'Janthir Wilds — Expansion Overview',
    icon: '🐻',
    difficulty: 'beginner',
    summary: 'Everything added in the Janthir Wilds expansion (August 2024): maps, Spear weapon, Warclaw rework, Homestead, and masteries.',
    readTime: 6,
    image: 'https://wiki.guildwars2.com/images/thumb/6/60/Janthir_Wilds_logo.png/400px-Janthir_Wilds_logo.png',
    sections: [
      {
        title: 'What is Janthir Wilds?',
        content:
          'Janthir Wilds is the fifth Guild Wars 2 expansion, released August 20, 2024. It takes place in the untamed Janthir region north of Kryta, featuring dense wilderness, Kodan settlements, and the ancient threat of the Mursaat returning.',
        list: [
          'Four new open-world maps: Lowland Shore, Janthir Syntri, Mistburned Barrens, Bava Nisos',
          'New weapon type available to all professions: Spear (now usable in open-world, not just underwater)',
          'Full Warclaw mount rework — now usable in open-world PvE as a traversal mount',
          'Homestead system: Hearth\'s Glow, your personal player house with furniture and layouts',
          'Two major meta events: "Of Mists and Monsters" (Decima + Greer titan chain) and Sleuth Brawlfields',
        ],
      },
      {
        title: 'Spear Weapon',
        content:
          'The Spear is a new land-based weapon type added in Janthir Wilds. Each profession received a unique Spear skill set — some melee, some ranged, all with a distinct playstyle. This was the first new weapon type added to GW2 since the original launch.',
        tips: [
          'Each elite spec from Visions of Eternity (2025) also interacts with the Spear in unique ways.',
          'Spear skins are collected separately from standard weapon skins — check the Wardrobe.',
        ],
      },
      {
        title: 'Warclaw Rework',
        content:
          'The Warclaw was originally a WvW-exclusive mount. In Janthir Wilds it was completely redesigned and is now the primary traversal mount in the Janthir Wilds open-world maps, with new abilities, a dedicated 6-tier mastery track, and improved combat mechanics. It remains available in WvW.',
        list: [
          'Warclaw Mastery (6 tiers) — unlock in Janthir Wilds maps',
          'New Warclaw skills for open-world navigation and combat support',
          'Warclaw is earned via the Janthir Wilds story, not the WvW unlock path',
        ],
        tips: [
          'If you already unlocked Warclaw in WvW, you automatically have the base mount — but must still complete the new mastery track for JW abilities.',
        ],
      },
      {
        title: 'Homestead System',
        content:
          'Hearth\'s Glow is your personal player home in Janthir Wilds. It is separate from the Guild Hall system and fully solo-accessible. You can decorate it with furniture, invite friends, and unlock new layouts.',
        list: [
          'Homesteading Mastery (7 tiers) — expands decorating options and layouts',
          'Furniture crafting via the Homestead workbench using Janthir-region materials',
          'Invite up to 10 players to your Homestead at once',
          'Seasonal decorations available from festival merchants',
        ],
      },
      {
        title: 'Masteries',
        content: 'Janthir Wilds adds three new mastery tracks unlocked by earning Mastery Points in JW maps:',
        list: [
          'Warclaw (6 tiers) — Warclaw abilities for JW open world',
          'Lowland Kodan (7 tiers) — navigation and event mechanics in JW maps',
          'Mursaat Shadowcraft (5 tiers) — Mursaat-themed skills for meta events and exploration',
        ],
        tips: [
          'Homesteading is a separate 7-tier track unlocked through the Homestead system, not map mastery points.',
        ],
      },
      {
        title: 'Key Meta Events',
        content: 'Janthir Wilds has two major meta chains:',
        list: [
          'Of Mists and Monsters — hour-long chain culminating in titan battles against Decima and Greer; best source of JW materials and unique weapon drops',
          'Sleuth Brawlfields — PvE arena event where players fight in waves alongside Kodan NPCs; scales to group size',
        ],
        tips: [
          'Use the LFG tool (Y) under "Janthir Wilds" to find active meta groups.',
          'Decima and Greer drop unique Janthir weapon skins and materials used for the new ascended crafting recipes.',
        ],
      },
    ],
  },

  // ─── Visions of Eternity ─────────────────────────────────────────────────────

  {
    id: 'visions-of-eternity-overview',
    categoryId: 'start',
    title: 'Visions of Eternity — Expansion Overview',
    icon: '✨',
    difficulty: 'beginner',
    summary: 'Everything added in the Visions of Eternity expansion (October 2025): new island, 9 elite specs, raid unification, Fashion Templates, and more.',
    readTime: 6,
    sections: [
      {
        title: 'What is Visions of Eternity?',
        content:
          'Visions of Eternity (VoE) is the sixth Guild Wars 2 expansion, released October 28, 2025. It takes place on Castora, a mystical island chain where fragments of past and future timelines converge. The expansion focuses on prophecy, celestial mechanics, and the legacies of past characters.',
        list: [
          'Two new open-world maps: Shipwreck Strand and Starlit Weald',
          'Nine new elite specializations — one for each profession',
          'Guardian\'s Glade standalone raid encounter (added February 3, 2026)',
          'Raid and Strike Mission system unification (February 3, 2026)',
          'Fashion Templates: save and swap entire outfit/dye combinations instantly',
          'New Homestead layouts and Castora-themed decorations',
        ],
      },
      {
        title: 'Raid & Strike Unification',
        content:
          'Effective February 3, 2026, Raids and Strike Missions were merged into a single unified instanced content system. Both now share a common reward track, LFG category, and can be accessed from the same interface. The distinction between "Raid" and "Strike" is now cosmetic — all instanced endgame content appears in one place.',
        tips: [
          'Legendary Insights (LI) now drop from Strike CMs as well as Raid wings.',
          'The unified system makes it easier to find groups — one LFG category covers everything.',
        ],
        warnings: [
          'Old-style "Raid-only" KP communities may still request LI specifically — this has not changed, only the UI has been unified.',
        ],
      },
      {
        title: 'Guardian\'s Glade',
        content:
          'Guardian\'s Glade is a standalone instanced encounter added February 3, 2026 alongside the raid/strike unification. It features Seneschal of the Tides, a new boss encounter tied to VoE lore. It drops exclusive rewards including the Tidal Sentinel armor set.',
        list: [
          'Accessible from the unified instanced content panel',
          'Boss: Seneschal of the Tides (10-player, 3 phases)',
          'Rewards: Tidal Sentinel armor (stat-selectable ascended), unique weapon skins, Legendary Insights',
        ],
      },
      {
        title: 'Fashion Templates',
        content:
          'Fashion Templates let you save your entire appearance — equipped armor skins, back item, helm visibility, and dye choices — as a named template. You can swap between templates instantly without spending Transmutation Charges.',
        list: [
          'Up to 6 templates per character',
          'Swapping templates costs no Transmutation Charges',
          'Templates are stored per-character, not account-wide',
        ],
        tips: [
          'You still need Transmutation Charges to initially apply a skin — templates just let you switch back and forth for free after that.',
        ],
      },
      {
        title: 'New Maps',
        content: 'Visions of Eternity adds two new open-world maps on the Castora island chain:',
        list: [
          'Shipwreck Strand — coastal ruins map; home to the Fractured Fleet meta event',
          'Starlit Weald — celestial forest map with the Orrery Convergence meta event; requires VoE masteries to fully navigate',
        ],
        tips: [
          'VoE masteries are separate from JW masteries — start earning Mastery Points in VoE maps as soon as you reach level 80.',
        ],
      },
    ],
  },

];
