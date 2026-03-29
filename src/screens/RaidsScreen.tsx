import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import {colors, fontSize, spacing, radius} from '../constants/theme';
import {useAccount, useRaids} from '../hooks/useGW2';
import {useAppStore} from '../store/appStore';

// ─── Data Types ───────────────────────────────────────────────────────────────

interface BuildRec {
  role: string;
  specs: string;
  color: string;
}

interface BossGuide {
  id: string;
  name: string;
  cm: boolean;
  roles?: string;
  overview: string;
  mechanics: string[];
  tips: string[];
  builds: BuildRec[];
}

interface ContentGroup {
  id: string;
  name: string;
  short: string;
  label: string;
  bosses: BossGuide[];
}

// ─── Build colour helpers ─────────────────────────────────────────────────────

const BUILD_COLORS = {
  tank: '#4090c8',
  heal: '#40c870',
  dps: '#c84040',
  support: '#c8972b',
  special: '#b679d5',
};

// ─── RAIDS ────────────────────────────────────────────────────────────────────

const RAIDS: ContentGroup[] = [
  {
    id: 'w1',
    name: 'Spirit Vale',
    short: 'W1',
    label: 'Forsaken Thicket',
    bosses: [
      {
        id: 'vale_guardian',
        name: 'Vale Guardian',
        cm: false,
        roles: 'Tank · Seeker kiter',
        overview:
          'An undead guardian split into three aspects. The fight alternates between a single phase and a three-way split. Failing to manage seekers or colour syncing in the split will wipe the group.',
        mechanics: [
          'Three colour aspects spawn at 66 % and 33 % HP. Blue (Mystic) teleports the tank, Green (Shard) drops AoE fields, Red (Magic) pulses damage if seekers touch it.',
          'During split, kill Blue → Green → Red in that order. All three must die before their shared HP pool regenerates.',
          'Seekers (orbs) constantly chase random players. If a seeker reaches the Red guardian it explodes for heavy group damage.',
          'In the main phase, the tank must keep Vale Guardian on matching colour tiles — standing on a mismatched tile inflicts stacking Magic Aura debuffs.',
          'Tri-Attack happens when all three aspects sync their attacks simultaneously — use blocks or invulnerabilities.',
        ],
        tips: [
          'Assign one dedicated seeker kiter whose only job is pulling orbs to the edge and never returning to the stack.',
          'During split, finish each guardian in 20 seconds or the group HP regeneration becomes impossible to outpace.',
          'The tank should pre-position on a colour tile before each split to avoid scrambling.',
          'Chronomancer can pull all three split guardians into one spot for an instant AoE burst — practice the portal timing.',
          'Bring at least one boon-strip build; stripped guardians take 33 % more damage during split.',
        ],
        builds: [
          {role: 'Tank', specs: 'Chronomancer, Dragonhunter', color: BUILD_COLORS.tank},
          {role: 'Healer', specs: 'Druid, Firebrand, Scrapper', color: BUILD_COLORS.heal},
          {role: 'DPS', specs: 'Soulbeast, Virtuoso, Weaver, Specter', color: BUILD_COLORS.dps},
          {role: 'Boon Strip', specs: 'Scourge, Spellbreaker', color: BUILD_COLORS.support},
        ],
      },
      {
        id: 'gorseval',
        name: 'Gorseval the Multifarious',
        cm: false,
        roles: 'Tank · Egg breakers',
        overview:
          'A massive world spirit with three distinct attacks and a punishing egg phase. High DPS and flawless CC execution are mandatory — failing the egg break results in an instant wipe.',
        mechanics: [
          'Ghastly Rampage — Gorseval spins and deals heavy continuous damage to all nearby players. Use blocks, invulns, or move behind him.',
          'World Eater — a slam at 100/66/33 % HP that deals lethal damage. Everyone must leave his hitbox before the animation completes.',
          'Protective Shadow — four Charged Souls spawn around the arena with large CC bars. All four must be broken simultaneously within ~10 seconds or Gorseval becomes immune and regenerates HP.',
          'Egg phase — after Protective Shadow, Gorseval channels Spectral Darkness. Four cocoons appear; destroy all four before the channel ends (~35 s) or wipe.',
          'After the egg phase, players must stack inside Gorseval during Spectral Darkness to share the AoE damage. Players outside die instantly.',
        ],
        tips: [
          'Assign two players per egg and pre-mark which egg each pair goes to before the fight starts.',
          'Mesmer portals or Druid celestial avatars can teleport players directly to their eggs — set up the portal before World Eater.',
          'Stack all CC cooldowns exclusively for Protective Shadow. If the bar fails, your group wipes on the regeneration.',
          'The Spectral Darkness stack spot is always the centre of the arena — pre-move there as soon as eggs die.',
          'High group DPS can skip the second egg phase entirely by bursting Gorseval from 66 % to 0 % before the third Protective Shadow.',
        ],
        builds: [
          {role: 'Tank', specs: 'Chronomancer', color: BUILD_COLORS.tank},
          {role: 'Healer', specs: 'Druid, Mechanist', color: BUILD_COLORS.heal},
          {role: 'DPS', specs: 'Soulbeast, Holosmith, Virtuoso', color: BUILD_COLORS.dps},
          {role: 'Portal / CC', specs: 'Chronomancer (portal eggs + CC)', color: BUILD_COLORS.special},
        ],
      },
      {
        id: 'sabetha',
        name: 'Sabetha the Saboteur',
        cm: false,
        roles: 'Tank · Cannon runners (×4)',
        overview:
          'A vertical platform fight with four cannons that constantly orbit the arena. Runners must continuously destroy cannons while the main group DPSes Sabetha on the central platform. Three lieutenant adds appear at key HP thresholds.',
        mechanics: [
          'Cannons spawn at the N/E/S/W platforms on a fixed rotation. They fire at Sabetha, reducing her mitigation — keeping them destroyed is critical for DPS windows.',
          'Flak Shot — targeted AoE that follows random players. Any player in the AoE when it detonates takes knockdown damage. Move constantly.',
          'Firestorm — a barrage of fire circles covers a large area. Dodge and keep moving; no single safe spot.',
          'Karde (75 %), Elexus (50 %), Narella (25 %) — lieutenants jump to the platform. CC and burst immediately; they deal very high damage to the group if ignored.',
          'Platform edges collapse periodically in the outer ring. Stand on safe tiles only; falling off means instant death.',
        ],
        tips: [
          'Assign one runner per cannon direction (N/E/S/W). Runners never DPS Sabetha; their job is purely cannon destruction.',
          'Fastest runner route: jump down, kill cannon, use a portal or waypoint skill to return. Chronomancer or Mesmer can set a portal at the top before jumping.',
          'Main group should spread slightly to avoid Flak Shot chaining between players.',
          'When a lieutenant appears, call it loudly. Most groups pause cannon runs briefly to burst the lieutenant, then resume.',
          'Narella at 25 % is the hardest lieutenant — she teleports, evades, and hits hard. Save CC and burst cooldowns.',
        ],
        builds: [
          {role: 'Tank', specs: 'Chronomancer (portal utility)', color: BUILD_COLORS.tank},
          {role: 'Healer', specs: 'Druid, Scrapper', color: BUILD_COLORS.heal},
          {role: 'Runners', specs: 'Any mobile build — Soulbeast, Daredevil, Virtuoso', color: BUILD_COLORS.special},
          {role: 'DPS Stack', specs: 'Weaver, Virtuoso, Holosmith', color: BUILD_COLORS.dps},
        ],
      },
    ],
  },
  {
    id: 'w2',
    name: 'Salvation Pass',
    short: 'W2',
    label: 'Forsaken Thicket',
    bosses: [
      {
        id: 'slothasor',
        name: 'Slothasor',
        cm: false,
        roles: 'Tank · Shaman',
        overview:
          'A napping great jungle wurm that becomes enraged when disturbed. The fight revolves around the random Shaman mechanic — one player is chosen to consume a mushroom and cure the group of Narcolepsy (a sleep debuff).',
        mechanics: [
          'Narcolepsy — every ~30 s, Slothasor casts a sleep on the entire group. The current Shaman must eat a mushroom within 2 s to break the sleep, or the whole group is incapacitated.',
          'Tantrum — a large CC bar appears. Failing to break it causes Slothasor to flail and fear everyone repeatedly.',
          'Fear Me — a radial slam that fears players. Dodge or use stability when you see the animation.',
          'Poison Spit — he vomits a trail of poison pools on the ground. Move the boss forward constantly rather than rotating in circles.',
          'At very low HP, Slothasor fixates on one player and chases them relentlessly. This player should kite him while the group finishes the kill.',
        ],
        tips: [
          'Mark the current Shaman with a commander or squad marker so everyone knows who needs protecting.',
          'Mushrooms spawn at six fixed positions in a ring around the room — learn all six locations before the fight.',
          'Pre-designate two backup Shamans in case the primary dies or disconnects.',
          'Save all CC for Tantrum — failing it causes a cascade of fears that often wipes inexperienced groups.',
          'Keep Slothasor moving forward in a figure-8 pattern to avoid the group drowning in poison pools.',
        ],
        builds: [
          {role: 'Tank', specs: 'Chronomancer, Dragonhunter', color: BUILD_COLORS.tank},
          {role: 'Healer', specs: 'Druid, Firebrand', color: BUILD_COLORS.heal},
          {role: 'DPS', specs: 'Soulbeast, Renegade, Specter', color: BUILD_COLORS.dps},
          {role: 'Shaman Backup', specs: 'Any mobile / self-sustain build', color: BUILD_COLORS.special},
        ],
      },
      {
        id: 'bandit_trio',
        name: 'Bandit Trio',
        cm: false,
        roles: 'Trio coordinator',
        overview:
          'Three simultaneous mini-bosses — Berg, Zane, and Narella — each with unique mechanics. All three must die within 15 seconds of each other, otherwise the survivors resurrect.',
        mechanics: [
          'Berg — wields a shield that reflects projectiles. Use melee attacks or wait for the shield to drop before using ranged skills.',
          'Zane — stealths periodically and backstabs random players for enormous damage. Use reveals (Hunter\'s Shot, Null Field, etc.) or spread out so he cannot chain-backstab.',
          'Narella — inflicts Torment on players who do NOT stand inside her fire ring AoE. Standing inside the ring clears the debuff and the torment.',
          'All three resurrect if not killed within 15 s of the first death — the execution window is tight.',
        ],
        tips: [
          'Most efficient kill order: burn Zane first (no reflect, no fire ring, most threatening), then swap to Berg (melee only), finish Narella last.',
          'Pre-stack all burst cooldowns before the fight starts, then chain burst from one target to the next.',
          'Assign one player to watch the 15 s timer and call the swap. Missing the window usually ends the attempt.',
          'Against Berg, position casters at melee range so they are not reflected. Alternatively, a Mesmer can Feedback the reflect back on him.',
          'Narella\'s fire ring changes position — it follows her. Don\'t stand where the ring was; stand where she currently is.',
        ],
        builds: [
          {role: 'Healer', specs: 'Druid, Scrapper', color: BUILD_COLORS.heal},
          {role: 'DPS Burst', specs: 'Holosmith, Bladesworn, Soulbeast', color: BUILD_COLORS.dps},
          {role: 'Reveal', specs: 'Dragonhunter (Hunter\'s Shot), Chrono (Null Field)', color: BUILD_COLORS.support},
        ],
      },
      {
        id: 'matthias',
        name: 'Matthias Gabrel',
        cm: false,
        roles: 'Tank · Sacrifice cage breakers',
        overview:
          'A bloodstone-empowered human cultist with rotating weather phases and a Sacrifice mechanic that requires the group to actively free an imprisoned player. One of the more complex W2 bosses — positioning discipline is essential.',
        mechanics: [
          'Sacrifice — Matthias imprisons a random player in a bubble that shrinks rapidly. 2–3 nearby players must attack the bubble to destroy it before the player inside dies.',
          'Corruption (Unstable Blood Magic) — a targeted AoE creates a blood pool on the floor where it lands. The hit player must move away immediately or they continue taking damage.',
          'Weather Phases cycle every 25 % HP: Fire (Ablaze — step in water puddles to extinguish), Ice (Hypothermia — warming crystals spawn), Storm (lightning strikes random spots — keep moving).',
          'Shards of Rage — large expanding rings originate from Matthias. Dodge outward before they reach full size.',
          'Harrowing Wave — a knockback wave at ~30 % HP. Use stability or be launched into the edge for lethal fall damage.',
        ],
        tips: [
          'Assign 2–3 dedicated cage breakers before the fight. They should always be within 600 range of the group centre.',
          'Blood pools must be dragged to the wall — never in the centre. Cluttered floors cause players to take unnecessary Corruption damage.',
          'During fire phase, designate water puddle positions in advance so players don\'t collide rushing to the same puddle.',
          'Tank Matthias facing the south wall so Shards of Rage expand outward toward the group, giving maximum dodge space.',
          'Burst him through the 25 % threshold as fast as possible — the last phase combines all three weather effects simultaneously.',
        ],
        builds: [
          {role: 'Tank', specs: 'Chronomancer, Willbender', color: BUILD_COLORS.tank},
          {role: 'Healer', specs: 'Druid, Firebrand', color: BUILD_COLORS.heal},
          {role: 'DPS', specs: 'Soulbeast, Virtuoso, Specter', color: BUILD_COLORS.dps},
          {role: 'Cage Breakers', specs: 'Condi builds — Specter, Scourge', color: BUILD_COLORS.special},
        ],
      },
    ],
  },
  {
    id: 'w3',
    name: 'Stronghold of the Faithful',
    short: 'W3',
    label: 'Forsaken Thicket',
    bosses: [
      {
        id: 'escort',
        name: 'Escort (McLeod)',
        cm: false,
        overview:
          'A linear escort through a White Mantle fortress. McLeod the Silent walks a fixed path; your group must clear enemies before he reaches them. No boss at the end — only a final defend.',
        mechanics: [
          'McLeod follows a fixed route and cannot be redirected. If enemies attack him and his HP reaches zero, the mission fails instantly.',
          'Jade Constructs patrol the corridors. They are tough and deal high damage — pull or CC them away from McLeod\'s path before he arrives.',
          'White Mantle waves spawn at fixed checkpoints and swarm McLeod. Use AoE cleave and reflects to burst them.',
          'Final defend: White Mantle siege occurs after McLeod reaches the objective. Hold the area for ~60 s.',
        ],
        tips: [
          'Split into two subgroups: an advance squad (3–4) runs ahead to pre-clear patrols, and an escort squad (6–7) stays with McLeod.',
          'Use reflects (Wall of Reflection, Shield of Absorption) against ranged White Mantle — they deal most of their damage through projectiles.',
          'Do not skip trash in the corridors — wandering patrols will path back to McLeod if left alive.',
          'During the final defend, everyone stacks on the objective marker and uses AoE spam.',
        ],
        builds: [
          {role: 'Healer', specs: 'Druid, Firebrand', color: BUILD_COLORS.heal},
          {role: 'Reflect', specs: 'Dragonhunter, Mesmer, Scrapper', color: BUILD_COLORS.support},
          {role: 'DPS', specs: 'Soulbeast, Holosmith, any AoE build', color: BUILD_COLORS.dps},
        ],
      },
      {
        id: 'keep_construct',
        name: 'Keep Construct',
        cm: true,
        roles: 'Tank · Orb runners (×2)',
        overview:
          'A construct powered by Jade Orbs. Two players are periodically teleported to a side arena to retrieve an Orb and bring it back. Meanwhile, the rest of the group must manage Jade Crystal breakbars and node-standing phases.',
        mechanics: [
          'Orb phase — two random players are teleported to the Jade Orb sub-arena. They must defeat a small group of adds, pick up the Orb, and portal back. The Orb carrier is slowed — movement skills help.',
          'Jade Crystal — a large CC bar appears on KC. Failing to break it gives KC a powerful protective buff that dramatically reduces all incoming damage for 60 s.',
          'Core teleport — KC temporarily invulners. Players must simultaneously stand on two separated node pads to bring him back.',
          'Phantasms orbit KC and deal damage to nearby players — avoid their orbit paths.',
          'CM: Insidious Projection — a lethal orb spawns on the ground. Jump over or portal past it; touching it kills the player.',
        ],
        tips: [
          'Orb runners should practice the sub-arena path before leading a group — the route is not intuitive the first time.',
          'Assign CC roles and quantities: you need approximately 3,000 CC to break the Jade Crystal bar reliably.',
          'Pre-place a Mesmer portal from the orb arena back to the main platform to speed up the return trip.',
          'CM: the Insidious Projection leaves a persistent field — designate one side of the arena for its placement to keep the main DPS area clear.',
          'Keep CC cooldowns specifically for the crystal bar — using them on random phantasms wastes essential break potential.',
        ],
        builds: [
          {role: 'Tank', specs: 'Chronomancer', color: BUILD_COLORS.tank},
          {role: 'Healer', specs: 'Druid, Scrapper', color: BUILD_COLORS.heal},
          {role: 'DPS', specs: 'Soulbeast, Virtuoso, Holosmith', color: BUILD_COLORS.dps},
          {role: 'CC Heavy', specs: 'Hammer Warrior, Hammer Rev, Tempest', color: BUILD_COLORS.support},
        ],
      },
      {
        id: 'xera',
        name: 'Xera',
        cm: false,
        roles: 'Tank · Platform leaders',
        overview:
          'A two-phase fight across floating platforms. Phase one spans three connected platforms with increasing Derangement stacks; phase two is a single arena where Xera becomes vulnerable after players destroy floating Shards.',
        mechanics: [
          'Derangement — a stacking debuff that increases damage taken. It resets when the group moves to the next platform. Do not overstay on a platform.',
          'Platform walls are invisible barriers. Players who walk off the edge are downed — not killed outright, but downed mid-air and very difficult to res.',
          'Phase 2 (50 %) — Xera moves to a central arena. Crimson Attunement orbs orbit her. One designated player must collect all red orbs; touching them if you are not the designated player kills you.',
          'Radiant Shields — Xera summons floating orbs that reflect projectiles. Switch to melee or wait for them to despawn.',
          'Energy Siphon — a channel near the end of phase 2 that deals AoE damage. Interrupt it or stack heavy heals.',
        ],
        tips: [
          'Assign a platform lead for each of the three P1 platforms. They call when to move and ensure everyone crosses together.',
          'In phase 2, the orb collector should call out their position so the rest of the group can avoid them.',
          'Bring stability for the platform transitions — knockback during a jump leads to instant downs.',
          'Pre-set a Mesmer portal at the phase 2 platform entry for fast repositioning.',
          'Tank Xera near the wall in phase 2 so the group has maximum space to dodge Radiant Shards.',
        ],
        builds: [
          {role: 'Tank', specs: 'Chronomancer, Dragonhunter', color: BUILD_COLORS.tank},
          {role: 'Healer', specs: 'Druid, Firebrand', color: BUILD_COLORS.heal},
          {role: 'DPS', specs: 'Soulbeast, Weaver, Virtuoso', color: BUILD_COLORS.dps},
          {role: 'Orb Collector', specs: 'Any high-mobility build — Daredevil, Soulbeast', color: BUILD_COLORS.special},
        ],
      },
    ],
  },
  {
    id: 'w4',
    name: 'Bastion of the Penitent',
    short: 'W4',
    label: 'Bastion of the Penitent',
    bosses: [
      {
        id: 'cairn',
        name: 'Cairn the Indomitable',
        cm: true,
        roles: 'Spread positions (8 players)',
        overview:
          'A pure positioning fight. Cairn deals lethal damage to any player adjacent to another. The entire group must maintain precise spread positions throughout the fight while managing teleports and dodging expanding rings.',
        mechanics: [
          'Shared Agony — continuous lethal AoE to nearby players. Players must maintain at least 300 range from each other at all times.',
          'Displacement — Cairn randomly teleports multiple players to new spots on the platform. You must immediately reorient to your assigned spread position.',
          'Cosmic Ripple — four concentric rings expand from Cairn\'s position. The timing window is critical: dodge on the third expansion, not the first or second.',
          'Seeker orbs orbit Cairn outward toward players — dodge them or kite them away from nearby squad members.',
          'CM: Inevitable Annihilation — seekers and rings both one-shot. Zero margin for error on dodge timing.',
        ],
        tips: [
          'Assign eight fixed spread positions (clock positions: N/NE/E/SE/S/SW/W/NW) before the fight. Call your position after every displacement.',
          'Cosmic Ripple visual cue: dodge when the innermost ring passes your feet — this corresponds to the third expansion.',
          'Practise the dodge timing in a private lobby before the CM. The window is roughly 0.5 s.',
          'CM groups sometimes use Blink/Phase skills to instantly return to position after displacement.',
          'Boon support is essential — Cairn strips boons frequently, so Stability and Protection must be reapplied constantly.',
        ],
        builds: [
          {role: 'Healer', specs: 'Druid, Firebrand, Scrapper', color: BUILD_COLORS.heal},
          {role: 'DPS', specs: 'Soulbeast, Holosmith, Specter', color: BUILD_COLORS.dps},
          {role: 'Boon Support', specs: 'Alacrity Renegade, Quickness Firebrand', color: BUILD_COLORS.support},
        ],
      },
      {
        id: 'mursaat_overseer',
        name: 'Mursaat Overseer',
        cm: true,
        roles: 'Claim · Dispel · Protect',
        overview:
          'A board game fight where players must capture floor tiles before MO performs a kill check. Three roles — Claim, Dispel, Protect — coordinate to control the board while Jade Scouts patrol and threaten to capture tiles for the boss.',
        mechanics: [
          'Board tiles are highlighted periodically. Players must stand on the highlighted tiles before the check timer expires or the unclaimed tiles instantly kill anyone standing on them.',
          'Claim — standing on a tile captures it for the players. Dispel — removing an enemy-held tile. Protect — a player activates a skill that makes their tile immune to Dispel.',
          'Jade Scouts patrol the board on set paths. If a Scout walks over a tile, it claims it for MO. Kill Scouts immediately.',
          'Board check — after the timer, all unclaimed tiles execute players on them. Players on claimed tiles are safe.',
          'CM: tiles must be claimed in a specific numbered order. Claiming out of order = instant death.',
        ],
        tips: [
          'Assign roles before the fight: one Claimer, one Dispeller, one Protector. Remaining players assist with DPS on the boss and Scout kills.',
          'Never stack on a tile — each tile only needs one player. Excess players waste space and slow the Scout hunt.',
          'Scouts follow a predictable patrol. Learn the loop and intercept them before they reach contested tiles.',
          'CM: memorise the tile number sequence. A callout system (someone reads numbers aloud) prevents mistakes.',
          'After a successful board check, immediately return to DPS on MO — the phase is short.',
        ],
        builds: [
          {role: 'Healer', specs: 'Druid, Scrapper', color: BUILD_COLORS.heal},
          {role: 'DPS', specs: 'Soulbeast, Virtuoso, Renegade', color: BUILD_COLORS.dps},
          {role: 'Tile Roles', specs: 'Any mobile build that can spread across the board', color: BUILD_COLORS.special},
        ],
      },
      {
        id: 'samarog',
        name: 'Samarog',
        cm: true,
        roles: 'Tank · Spear kiter',
        overview:
          'A sylvari spear master imprisoned in the Bastion. He summons deadly lances and calls two prisoner adds at key HP thresholds. Managing the lance kiter and the add priority order are the core challenges.',
        mechanics: [
          'Spear of Samarog — a lance spawns beneath a random player (not the tank). That player must immediately run to the arena edge to prevent the lance from impaling group members.',
          'Prisoner adds — Guldhem (shielded, reflects) and Rigom (unshielded, CC-immune) appear at 66 % and 33 %. Kill Rigom first (pure DPS), then Guldhem.',
          'Shockwave — Samarog slams the ground and sends expanding shockwaves outward. The correct dodge is toward Samarog through the wave, not away from it.',
          'Big Slam — a breakbar appears. Breaking it cancels a wide knockback. Missing it launches players to the edge.',
          'CM: Inevitable Annihilation — Guldhem and Rigom must die within 5 s of each other. Holding DPS on one until the other is low is essential.',
        ],
        tips: [
          'Spear kiter: bind a movement skill or dodge the moment you see the orange lance indicator. Sprint to the wall.',
          'During adds phase, entire group swaps to Rigom immediately. Once Rigom dies, everyone to Guldhem.',
          'The Shockwave dodge is counterintuitive — most players dodge away and get caught by the second wave. Dodge into Samarog to avoid both.',
          'CM: hold 20–30 % HP gap maximum between Rigom and Guldhem before simultaneous burst.',
          'Bring Stability or Aegis for the Big Slam — missing the CC and getting launched often cascades into a wipe.',
        ],
        builds: [
          {role: 'Tank', specs: 'Chronomancer, Dragonhunter', color: BUILD_COLORS.tank},
          {role: 'Healer', specs: 'Druid, Firebrand', color: BUILD_COLORS.heal},
          {role: 'DPS', specs: 'Holosmith, Soulbeast, Specter', color: BUILD_COLORS.dps},
          {role: 'CC', specs: 'Hammer Warrior, Hammer Rev (Big Slam)', color: BUILD_COLORS.support},
        ],
      },
      {
        id: 'deimos',
        name: 'Deimos',
        cm: true,
        roles: 'Tank · Pylon runner · Oil manager',
        overview:
          'The final boss of W4 and one of the most mechanically demanding raid bosses. Oil pools, Mind Crushes, and a player-isolated pylon sub-phase all demand individual discipline — a single mistake can cascade into a wipe.',
        mechanics: [
          'Oils — black pools spawn under random players who must immediately move them to the arena wall. Pools left in the centre build up over time and deny the usable floor space.',
          'Mind Crush — a large targeted AoE that knocks down and deals heavy damage. Dodge when you see the red circle form under a player near you.',
          'Tear of Dementia — a trailing red circle that follows a player. They must stay away from all allies until it dissipates.',
          'Pizza phase (25 %) — Deimos becomes untargetable and Dementia Tears radiate outward in a rotating pizza-slice pattern. Dodge through the gaps.',
          'Pylon sub-phase — one player is pulled into an isolated arena with four Prides. They must destroy all four using only their equipped skills.',
        ],
        tips: [
          'Oil discipline is the key to clean Deimos kills. Oils go wall-only, never centre — communicate the same spot (e.g. "oils to north wall") before the fight.',
          'The pylon runner needs a self-sustaining build — they are alone with no healer. Druid, Herald, or Scourge work well.',
          'Pizza phase: stand at mid-range from Deimos and pre-position in a gap before the slices rotate. Do not sprint randomly.',
          'Mind Crush targets a player randomly — the "tell" is a large red ring. Anyone inside must dodge immediately.',
          'Tank holds Deimos on the south edge facing south, so players can always drop oils to the north wall and keep the centre clear.',
        ],
        builds: [
          {role: 'Tank', specs: 'Chronomancer, Dragonhunter', color: BUILD_COLORS.tank},
          {role: 'Healer', specs: 'Druid, Firebrand', color: BUILD_COLORS.heal},
          {role: 'DPS', specs: 'Soulbeast, Virtuoso, Holosmith', color: BUILD_COLORS.dps},
          {role: 'Pylon Runner', specs: 'Druid (self-sustain), Scourge, Herald', color: BUILD_COLORS.special},
        ],
      },
    ],
  },
  {
    id: 'w5',
    name: 'Hall of Chains',
    short: 'W5',
    label: 'Hall of Chains',
    bosses: [
      {
        id: 'desmina',
        name: 'Soulless Horror (Desmina)',
        cm: true,
        roles: 'Dual tanks · Flesh Wall squad',
        overview:
          'A relentless tank-swap fight combined with flesh wall management. The Necrosis debuff accumulates on the active tank and must be swapped every few stacks — miss the swap and the tank dies in seconds.',
        mechanics: [
          'Necrosis — stacks on the highest-toughness player every few seconds. At high stacks it becomes lethal. Two tanks must swap aggro before stacks become fatal.',
          'Scythe attacks — large sweeping AoEs. Dodge diagonally through the scythe, not away, to avoid the second half of the swing.',
          'Torment Wave — concentric rings spread from Desmina. Each ring has a gap — pre-position in the gap and do not dodge until the ring is at your feet.',
          'Flesh Walls — pillars of flesh spawn around the arena edge. If two adjacent walls are left alive, they block all movement routes and box the group in. Destroy them immediately.',
          'CM: Necrosis spreads as a cone to nearby allies. Tank must maintain 600+ range separation from the group at all times.',
        ],
        tips: [
          'Tanks should call out Necrosis count on voice comms ("5 stacks, swap at 7").',
          'Flesh wall priority: a single wall is annoying; two adjacent walls is a wipe. Kill them the moment they spawn.',
          'During Torment Wave, standing still in a gap is safer than dodging if your dodge timing is uncertain.',
          'Healing builds should pre-stack barriers/Protection on tanks before Necrosis reaches high counts.',
          'CM: tanks use ranged skills to maintain distance from the group. Melee DPS players must reposition whenever the tank moves.',
        ],
        builds: [
          {role: 'Tank ×2', specs: 'Chronomancer (alacrity tank), Dragonhunter', color: BUILD_COLORS.tank},
          {role: 'Healer', specs: 'Druid, Firebrand', color: BUILD_COLORS.heal},
          {role: 'DPS', specs: 'Soulbeast, Holosmith, Specter', color: BUILD_COLORS.dps},
          {role: 'Wall Clear', specs: 'AoE builds — Scourge, Tempest, Weaver', color: BUILD_COLORS.support},
        ],
      },
      {
        id: 'river',
        name: 'River of Souls',
        cm: false,
        overview:
          'A movement event with no traditional boss. The group is carried along a spectral river and must dodge Desmina\'s attacks while defeating a Wraith that periodically spawns.',
        mechanics: [
          'The river moves forward automatically. If you fall behind the boundary, it deals rapidly escalating damage and kills you.',
          'Desmina flies alongside and periodically fires projectile volleys at the group. Dodge them; they cannot be outrun.',
          'A Wraith spawns on the river periodically. Kill it immediately — if it reaches the group\'s tail it one-shots players.',
        ],
        tips: [
          'Stay ahead of the river boundary at all times. Do not stop to res downed players — push forward and let them rally from the boundary.',
          'Prioritise the Wraith over everything else. Assign two fast DPS players to burst it the moment it spawns.',
          'Bring swiftness/superspeed — moving faster gives more reaction time for dodge windows.',
        ],
        builds: [
          {role: 'Healer', specs: 'Druid, Scrapper', color: BUILD_COLORS.heal},
          {role: 'DPS', specs: 'Any — burst the Wraith fast', color: BUILD_COLORS.dps},
          {role: 'Mobility', specs: 'Superspeed builds help — Scrapper, Holo', color: BUILD_COLORS.special},
        ],
      },
      {
        id: 'dhuum',
        name: 'Dhuum',
        cm: true,
        roles: 'Tank · Reaper (×1–2) · Cataclysm callers',
        overview:
          'The god of death himself. Dhuum combines a soul-collection minigame, periodic instant-wipe checks (Cataclysm), and an enrage timer into one of the most demanding W5 encounters.',
        mechanics: [
          'Reaper — one player is marked and transformed into the Reaper of Souls. They must move around the arena and collect soul orbs, then deliver them during Judgment.',
          'Judgment — Dhuum channels and deals lethal damage to all players outside his circle. Everyone must immediately stack inside his model.',
          'Cataclysm — a massive AoE that covers the entire arena except small protection circles. Every single player must be inside a circle or they die instantly.',
          'Dhuum\'s Scythe — a radial sweep. Dodge sideways; do not back-pedal.',
          'CM: Judgment timing is faster, Reapers are more frequent, and soul orb density increases significantly.',
        ],
        tips: [
          'Never miss a Cataclysm circle. Assign the loudest voice on comms to call "CATACLYSM STACK" the moment the cast bar appears.',
          'Reaper players: plan your soul route and save movement abilities for the final sprint to deliver souls during Judgment.',
          'DPS players: maintain high output but watch Dhuum\'s cast bar — stopping for Cataclysm saves wipes.',
          'CM: assign a second Reaper backup. If the primary dies or misses a soul, the backup takes over immediately.',
          'Healing builds should pre-fill Barriers before Cataclysm ends so tanks survive the resumption of melee.',
        ],
        builds: [
          {role: 'Tank', specs: 'Chronomancer', color: BUILD_COLORS.tank},
          {role: 'Healer', specs: 'Druid, Firebrand', color: BUILD_COLORS.heal},
          {role: 'DPS', specs: 'Soulbeast, Virtuoso, Specter', color: BUILD_COLORS.dps},
          {role: 'Reaper', specs: 'Mobile build — Daredevil, Soulbeast (Eagle Eye)', color: BUILD_COLORS.special},
        ],
      },
    ],
  },
  {
    id: 'w6',
    name: 'Mythwright Gambit',
    short: 'W6',
    label: 'Mythwright Gambit',
    bosses: [
      {
        id: 'ca',
        name: 'Conjured Amalgamate',
        cm: true,
        roles: 'Sword collectors · Shield collectors',
        overview:
          'A fight against a massive construct powered by conjured weapons. Two teams collect weapons from the arena, using swords to amplify DPS and shields to block devastating arm slams.',
        mechanics: [
          'Conjured Swords — spawn around the arena. Collecting them grants a stacking damage buff to the group. Maximize sword pickups during each DPS window.',
          'Conjured Shields — collecting them grants shield charges. When CA raises an arm for a slam, shield bearers activate their charges to prevent lethal damage to the group.',
          'Arm vulnerability — one arm at a time becomes exposed (the raised arm is shielded; the lowered arm is vulnerable). All DPS must switch immediately.',
          'Swords and shields disappear after a short duration if not collected — missed weapons are lost DPS.',
          'CM: uncollected weapons explode, dealing group-wide damage. Faster collection rotations are mandatory.',
        ],
        tips: [
          'Assign two dedicated collectors per weapon type. Collectors never attack the boss; their rotation is purely pickup.',
          'Sword collector path: start bottom-left, sweep to bottom-right, return. Shield collector: focus on the safe side away from the active arm.',
          'Watch the arm animation carefully — there is a brief "tell" before the slam that indicates which arm to hit.',
          'CM: pre-assign collection paths and do not deviate. Weapons disappear fast and the explosion punishment is severe.',
          'Healers should position centrally so they can reach both collector teams without long travel time.',
        ],
        builds: [
          {role: 'Healer', specs: 'Druid, Firebrand', color: BUILD_COLORS.heal},
          {role: 'DPS', specs: 'Holosmith, Soulbeast, Virtuoso', color: BUILD_COLORS.dps},
          {role: 'Collectors', specs: 'Mobile builds — Daredevil, Soulbeast with Greatsword', color: BUILD_COLORS.special},
        ],
      },
      {
        id: 'twin_largos',
        name: 'Twin Largos',
        cm: true,
        roles: '5/5 split teams',
        overview:
          'The only raid boss where the group fully splits into two independent 5-player sub-squads, each fighting a separate Largos on their own platform. Both platforms must stay alive and kill their Largos within 10 seconds of each other.',
        mechanics: [
          'Each platform operates independently. If your platform wipes, the other platform\'s arena floods — group wipe.',
          'Nikare and Kenut both steal boons. Do not maintain more than 5 boons simultaneously or they use those boons against you.',
          'Tidal Pool — a pulsing blue circle follows a player. Move it to the wall immediately; leaving it in the centre floods the platform faster.',
          'Aquatic Barrage — a spread of projectiles. Block or dodge; standing in them inflicts Waterlogged debuff stack.',
          'Both Largos must die within 10 s of each other. Hold DPS on the faster platform.',
        ],
        tips: [
          'Each subgroup must include a healer, a support (alacrity/quickness), and 3 DPS — treat each platform as a mini-raid.',
          'Boon management is critical. Limit boon buffs to Might, Fury, Quickness, Alacrity maximum. Strip excess boons actively.',
          'Designate a cross-platform coordinator on comms to call HP percentages and manage the kill sync.',
          'CM: boon cap drops to 3. Renegade/Scrapper alacrity builds preferred over Chronomancer due to boon efficiency.',
          'Tidal Pools to the wall, without exception. A cluttered platform surface causes Waterlogged stacks that kill players through healer sustain.',
        ],
        builds: [
          {role: 'Healer ×2', specs: 'One per platform — Druid, Firebrand, Scrapper', color: BUILD_COLORS.heal},
          {role: 'Support ×2', specs: 'Alacrity Renegade, Quickness Firebrand', color: BUILD_COLORS.support},
          {role: 'DPS ×6', specs: 'Soulbeast, Virtuoso, Holosmith, Specter', color: BUILD_COLORS.dps},
        ],
      },
      {
        id: 'qadim',
        name: 'Qadim',
        cm: true,
        roles: 'Tank · Lamp kiter · Pyre Guardians',
        overview:
          'A legendary djinn flanked by three elemental guardians. The group must kill the guardians in sequence to make Qadim vulnerable, while one dedicated player kites a Flame Djinn Lamp to maintain Qadim\'s damage debuff.',
        mechanics: [
          'Elemental Guardians — Hydra (fire), Destroyer (earth), Matriarch (spider). Kill in that order. Matriarch lays eggs that hatch into adds — destroy eggs immediately.',
          'Lamp kiter — one player must keep the lit lamp within 600 range of Qadim at all times. This prevents Qadim\'s Kinetic Abundance immunity. If the kiter moves too far, Qadim becomes immune for 10 s.',
          'Pyre Guardians — two phoenixes fly toward Qadim. They must be killed before reaching him, or Qadim gains a permanent damage buff stack.',
          'Kinetic Abundance — Qadim channels a lethal AoE. Every player must be moving during the channel. Standing still for even 0.5 s kills you.',
          'CM: each guardian death grants Qadim a stacking power buff. DPS windows are short and burst must be maximised.',
        ],
        tips: [
          'Lamp kiter needs awareness of their distance at all times — use a range indicator addon or practice the feel.',
          'Destroy Matriarch eggs the moment they appear. Two eggs hatching simultaneously creates an add swarm that can overwhelm the group.',
          'Assign one player to call Pyre Guardians the moment they spawn on comms.',
          'Kinetic Abundance: bind a strafe key and tap it rhythmically. Even tiny movements count.',
          'CM: after each guardian kill, immediately re-stack and prepare burst for the next vulnerability window.',
        ],
        builds: [
          {role: 'Tank', specs: 'Chronomancer', color: BUILD_COLORS.tank},
          {role: 'Healer', specs: 'Druid, Firebrand', color: BUILD_COLORS.heal},
          {role: 'DPS', specs: 'Soulbeast, Virtuoso, Holosmith', color: BUILD_COLORS.dps},
          {role: 'Lamp Kiter', specs: 'High-mobility — Daredevil, Soulbeast', color: BUILD_COLORS.special},
        ],
      },
    ],
  },
  {
    id: 'w7',
    name: 'The Key of Ahdashim',
    short: 'W7',
    label: 'The Key of Ahdashim',
    bosses: [
      {
        id: 'adina',
        name: 'Cardinal Adina',
        cm: true,
        roles: 'Tank · Hand stompers',
        overview:
          'An earth djinn that combines ground hazards with player-activated pillar stomping. The Hands of Erosion mechanic requires near-constant attention from half the squad while the other half maintains DPS.',
        mechanics: [
          'Hands of Erosion — stone hands erupt from the ground at regular intervals. Players must stand on the hand to stomp it before the countdown ends. If the hand fully erupts, it deals lethal platform-wide damage.',
          'Quantum Quake — shockwaves radiate outward from pillars around the arena. Jump or dodge over each wave; they cannot be outrun.',
          'Radiant Blindness — Adina raises her hand and fires a blinding shot at a targeted player. Block or dodge on the visual cue.',
          'Stalagmites — stone spikes shoot from the floor toward player feet. Keep moving constantly; stopping under Adina is lethal.',
          'CM: Petrify — any player that stands still for more than 1 s is permanently turned to stone. Must be dispelled by an ally.',
        ],
        tips: [
          'Assign two stompers per Hand spawn direction. Pre-call quadrant assignments (e.g. "player A takes north, B takes east").',
          'Jumping over pillar shockwaves is more reliable than dodging. Time your jump when the ring is ~1 character-width away.',
          'CM: never use any skill that roots yourself (Sanctuary, Binding Roots, etc.). Keep strafing at all times.',
          'Tank Adina facing the arena wall so Stalagmites fire toward the wall rather than across the DPS stack.',
          'Bring at least one Aegis/block support — Radiant Blindness is telegraphed but can catch players off-guard during hand stomping.',
        ],
        builds: [
          {role: 'Tank', specs: 'Chronomancer, Dragonhunter', color: BUILD_COLORS.tank},
          {role: 'Healer', specs: 'Druid, Firebrand', color: BUILD_COLORS.heal},
          {role: 'DPS', specs: 'Soulbeast, Virtuoso, Holosmith', color: BUILD_COLORS.dps},
          {role: 'Stompers', specs: 'Mobile builds — Daredevil, Soulbeast, Specter', color: BUILD_COLORS.special},
        ],
      },
      {
        id: 'sabir',
        name: 'Cardinal Sabir',
        cm: true,
        roles: 'Tank · CC squad (~6,000 CC)',
        overview:
          'A lightning djinn with an enormous CC bar that must be broken repeatedly. Failing to break the Ion Shield bar is effectively a 30-second DPS loss. Cyclone phases require precise positioning.',
        mechanics: [
          'Ion Shield — Sabir gains an immunity shield with ~6,000 HP CC bar. Every player must deploy their highest-value CC skill simultaneously to break it within the window.',
          'Fragments of Rage — orbs orbit Sabir in expanding rings. Pre-position in a gap and dodge when the ring reaches you.',
          'Charged Leap — Sabir leaps forward with a massive knockback. Use Stability or dodge backwards before impact.',
          'Cyclone — Sabir generates a tornado that deals lethal damage everywhere except the central eye. Move to the centre immediately.',
          'CM: Static Shield — in addition to CC, players must channel lightning into Sabir during the break. Requires standing next to specific attractor pillars.',
        ],
        tips: [
          'Assign specific CC skills per player and add up the total before the fight ("I have 600, you have 750..."). You need ~6,000.',
          'Do not use CC skills on anything other than Ion Shield — trash adds do not warrant your bar.',
          'Cyclone eye: run to centre the moment the cast bar starts. Do not dodge around — the eye is always the same spot.',
          'CM: split the group into two halves on the two attractor pillars during the Ion Shield break. Call which pillar you are on before the fight.',
          'Bring Stability for Charged Leap — a launched tank during a DPS window is catastrophic.',
        ],
        builds: [
          {role: 'Tank', specs: 'Chronomancer, Dragonhunter', color: BUILD_COLORS.tank},
          {role: 'Healer', specs: 'Druid, Firebrand', color: BUILD_COLORS.heal},
          {role: 'DPS + CC', specs: 'Hammer Warrior, Hammer Rev, Tempest, Virtuoso', color: BUILD_COLORS.dps},
          {role: 'CC Support', specs: 'Spellbreaker (Full Counter), Renegade (Surge of the Mists)', color: BUILD_COLORS.support},
        ],
      },
      {
        id: 'qadim_peerless',
        name: 'Qadim the Peerless',
        cm: true,
        roles: 'Tank · 4 pylon keepers · Anomaly caller',
        overview:
          'Widely considered the hardest raid boss. Four pylon keepers manage independent mini-arenas while the main group DPSes Qadim, calls Anomaly interrupts, and survives lethal raid-wide mechanics.',
        mechanics: [
          'Pylon keepers — four players each maintain a pylon by killing spawning adds. Adds killed near a pylon charge it; a depleted pylon weakens the group\'s damage resistance.',
          'Anomaly — a large entity spawns and walks toward Qadim. If it reaches him it gives him a permanent 10 % damage buff (stacks infinitely). Call and burst it immediately.',
          'Platform phases — periodically a floating platform appears. 2–3 players jump to it and destroy Shards of Chaos within a timer.',
          'Wrath of Qadim — a massive raid-wide AoE. All players (including pylon keepers) must stack inside Qadim\'s model for damage share reduction.',
          'CM: pylon keepers must also collect specific colour orbs from their arena. Requires managing adds, orbs, and Wrath simultaneously.',
        ],
        tips: [
          'Pylon keeper is a dedicated role that requires practice in isolation before attempting the full encounter.',
          'Designate a single Anomaly caller — only one voice should call it to avoid confusion about whether the call has been heard.',
          'Pylon keepers: during Wrath of Qadim, run to the main stack immediately. Missing Wrath as a keeper will kill you and then your pylon collapses.',
          'Platform phase: assign the same 2–3 players every time. Inconsistent platform assignments cause confusion at late-phase timers.',
          'CM: colour orb assignments per pylon must be decided and memorised before entering the instance.',
        ],
        builds: [
          {role: 'Tank', specs: 'Chronomancer', color: BUILD_COLORS.tank},
          {role: 'Healer', specs: 'Druid, Firebrand', color: BUILD_COLORS.heal},
          {role: 'DPS', specs: 'Soulbeast, Virtuoso, Holosmith', color: BUILD_COLORS.dps},
          {role: 'Pylon Keepers', specs: 'Self-sustain — Scourge, Druid, Herald, Willbender', color: BUILD_COLORS.special},
        ],
      },
    ],
  },
];

// ─── STRIKES ──────────────────────────────────────────────────────────────────

const STRIKES: ContentGroup[] = [
  {
    id: 'ibs',
    name: 'Icebrood Saga',
    short: 'IBS',
    label: 'Strike Missions',
    bosses: [
      {
        id: 'shiverpeaks',
        name: 'Shiverpeaks Pass',
        cm: false,
        overview:
          'An introductory strike against the Icebrood and Sons of Svanir. Low difficulty, good for learning strike fundamentals like boon uptime and basic AoE dodging.',
        mechanics: [
          'Veteran Claw of Jormag — the final boss. Deals frost AoE attacks in a predictable pattern.',
          'Ice patches slow movement and apply chill stacks — stay mobile.',
          'Sons of Svanir adds spawn throughout. Prioritise any Shamans that buff other enemies.',
        ],
        tips: [
          'Good beginner strike — run this to learn your DPS rotation before attempting harder content.',
          'CC the Claw\'s breakbar to interrupt his frost channel.',
          'Bring one healer and standard boon support for a comfortable clear.',
        ],
        builds: [
          {role: 'Healer', specs: 'Druid, Scrapper', color: BUILD_COLORS.heal},
          {role: 'DPS', specs: 'Any meta or near-meta build', color: BUILD_COLORS.dps},
        ],
      },
      {
        id: 'voice_claw',
        name: 'Voice and Claw of the Fallen',
        cm: false,
        roles: 'Split teams',
        overview:
          'Two linked bosses — the Voice (a Charr shaman) and the Claw (a wolf) — on separate platforms connected by a bridge. Both must die simultaneously or the survivor revives at full HP.',
        mechanics: [
          'Voice and Claw share an HP bar but must be killed within a few seconds of each other — coordinate kill timing across both platforms.',
          'Voice applies powerful boons to the Claw. Interrupt or strip them to prevent the wolf from becoming unkillable.',
          'Ice AoE puddles accumulate on both platforms — kite bosses to clean areas.',
          'Players can cross the bridge between platforms to reinforce the weaker side.',
        ],
        tips: [
          'Assign 5 players to each platform with independent healers.',
          'Communicate HP percentages on comms — call "I\'m at 30 %" so both sides can sync the kill.',
          'Boon strips on Voice are more impactful than raw DPS — a stripped Voice deals 40 % less damage.',
          'If one platform is slower, the faster team sends 1–2 players across the bridge to assist.',
        ],
        builds: [
          {role: 'Healer ×2', specs: 'Druid or Firebrand (one per platform)', color: BUILD_COLORS.heal},
          {role: 'DPS', specs: 'Any meta build. Boon strip is a bonus — Scourge, Spellbreaker', color: BUILD_COLORS.dps},
        ],
      },
      {
        id: 'fraenir',
        name: 'Fraenir of Jormag',
        cm: false,
        roles: 'Tank',
        overview:
          'An icebrood svanir shaman empowered by Jormag\'s magic. He cycles through ice-shard barrages and a stone colossus transformation phase. Moderate difficulty with a clear breakbar mechanic.',
        mechanics: [
          'Frost Shards — Fraenir summons a ring of icy projectiles that expand outward. Dodge through them as they pass.',
          'Colossus phase — at 66 % and 33 %, Fraenir merges with a Stone Colossus. Break the CC bar to separate them; the colossus deals lethal stomp damage if it catches up to the group.',
          'Frozen ground AoE — patches of ice appear under players. Move immediately; standing in them stacks Frozen and immobilises.',
          'Glacial Barrier — Fraenir creates an ice wall that blocks movement. Destroy the wall or path around it.',
        ],
        tips: [
          'Save all CC for the Colossus bar — breaking it is the fight\'s primary mechanical check.',
          'Kite the Colossus away from the group while the CC bar is broken to avoid stomp damage.',
          'Position the group on the edge of frozen ground patches so they only get one stack before naturally walking out.',
          'High-DPS groups can skip the second Colossus phase by burning Fraenir from 66 % to 0 % quickly.',
        ],
        builds: [
          {role: 'Tank', specs: 'Chronomancer, Dragonhunter', color: BUILD_COLORS.tank},
          {role: 'Healer', specs: 'Druid, Firebrand', color: BUILD_COLORS.heal},
          {role: 'DPS + CC', specs: 'Hammer Warrior, Hammer Rev for CC; any DPS build otherwise', color: BUILD_COLORS.dps},
        ],
      },
      {
        id: 'boneskinner',
        name: 'Boneskinner',
        cm: false,
        roles: 'Lantern holders (×2–3)',
        overview:
          'A horrifying undead creature that is terrified of light. The fight revolves entirely around three Divine Lanterns placed around the arena — players must stand near lit lanterns or the Boneskinner charges through them.',
        mechanics: [
          'Divine Lanterns — three lit lanterns form a triangle. The Boneskinner avoids lit lanterns; moving the fight into their light prevents his terror charge.',
          'Terror Charge — if the Boneskinner leaves the lit area, he charges through the group dealing massive damage and fear.',
          'Darkness — a debuff that stacks on players outside lantern range. At high stacks it blinds and deals damage. Stay inside the light.',
          'Lantern carriers must keep the triangle formation around the boss as he moves.',
        ],
        tips: [
          'Assign 2–3 players as lantern movers. They pick up a lantern and reposition it as the boss moves, maintaining the triangular light cage.',
          'DPS players: never leave the lantern triangle. If you get pulled out, sprint back immediately.',
          'The simplest strategy is to not move the boss — fight him in the centre and have lantern carriers form a static triangle.',
          'Healers can stand just outside the triangle to apply heals to the full group without crowding.',
        ],
        builds: [
          {role: 'Healer', specs: 'Druid, Firebrand', color: BUILD_COLORS.heal},
          {role: 'DPS', specs: 'Any. Ranged builds make lantern management easier', color: BUILD_COLORS.dps},
          {role: 'Lantern Carriers', specs: 'Mobile builds — Daredevil, Soulbeast', color: BUILD_COLORS.special},
        ],
      },
      {
        id: 'whisper',
        name: 'Whisper of Jormag',
        cm: false,
        overview:
          'An ice dragon champion that creates copies of herself. The group must destroy the correct copy while avoiding lethal breath and chill attacks.',
        mechanics: [
          'Copies — the Whisper creates 3–5 identical clones at periodic intervals. One is the real Whisper; the others explode when killed, dealing moderate damage. The real one takes damage normally.',
          'Breath of Jormag — a directional ice breath that deals heavy damage and applies Frozen. Position behind or to the side of the Whisper.',
          'Frigid Vortex — expanding ice rings. Dodge outward through the gaps.',
          'Empowered copies at 50 % HP gain a brief invulnerability shield — wait before attacking.',
        ],
        tips: [
          'Target the copy that is actively attacking the group — the real Whisper is always the one using boss abilities.',
          'Mark the real Whisper immediately with a coloured marker so the whole group knows which one to hit.',
          'Stay behind the Whisper to avoid most breath attacks. Rotate as she turns.',
          'Kill fake copies only when the real one is temporarily invulnerable to avoid wasted burst.',
        ],
        builds: [
          {role: 'Healer', specs: 'Druid, Scrapper', color: BUILD_COLORS.heal},
          {role: 'DPS', specs: 'Any meta build — ranged preferred for copy identification', color: BUILD_COLORS.dps},
        ],
      },
    ],
  },
  {
    id: 'eod',
    name: 'End of Dragons',
    short: 'EoD',
    label: 'Strike Missions',
    bosses: [
      {
        id: 'aetherblade',
        name: 'Aetherblade Hideout',
        cm: true,
        roles: 'Tank · Lightning interceptor',
        overview:
          'Mai Trin and her Aetherblade crew. The fight involves managing a rotating lightning field, a second boss (Ankka) on a separate platform, and requires precise breakbar timing.',
        mechanics: [
          'Rotating Lightning — a wall of lightning rotates around the arena. Everyone must jump over or dodge through the low section of the wall.',
          'Ankka (second boss) — spawns at 66 % and 33 %. She must be damaged on a separate side platform while maintaining the main boss fight.',
          'Focused Lightning — targets a random player with an unavoidable AoE that must be absorbed by standing on a conductive pad.',
          'Breakbar — Mai Trin gains a shield at key HP thresholds. Break it quickly.',
          'CM: lightning rotation speed increases significantly; wall jumps must be precise.',
        ],
        tips: [
          'Practise the lightning jump — the correct window is when the wall height drops to floor level.',
          'During Ankka phase, assign 3–4 players to deal with her while the rest keep pressure on Mai Trin.',
          'Focused Lightning pads have a short duration. Move to the pad the moment the indicator appears under you.',
          'CM: spread out slightly more before each wall rotation to give individual reaction time.',
        ],
        builds: [
          {role: 'Tank', specs: 'Chronomancer, Dragonhunter', color: BUILD_COLORS.tank},
          {role: 'Healer', specs: 'Druid, Firebrand', color: BUILD_COLORS.heal},
          {role: 'DPS', specs: 'Soulbeast, Virtuoso, Holosmith', color: BUILD_COLORS.dps},
        ],
      },
      {
        id: 'xunlai',
        name: 'Xunlai Jade Junkyard',
        cm: true,
        roles: 'Sphere managers (×3)',
        overview:
          'Ankka as the primary boss, surrounded by three Jade Spheres. Sphere debuffs affect players within a certain radius — players must manage which sphere they stand near to avoid lethal stacking.',
        mechanics: [
          'Three Jade Spheres grant debuffs (Blue, Green, Orange). Standing near one sphere clears the other two\'s debuffs but increases that sphere\'s stacks.',
          'Null Zone — Ankka fires a ground AoE. Dodge out before it detonates.',
          'Jade Constructs spawn periodically. Kill them before they activate; activated constructs gain a powerful buff.',
          'Sphere overload — if any sphere reaches maximum stacks, it detonates for lethal group damage.',
          'CM: sphere debuff thresholds are lower; tighter rotation between spheres is required.',
        ],
        tips: [
          'Assign one player per sphere to call stack counts and rotate the group between spheres.',
          'Learn the rotation cycle — typically Blue → Green → Orange → repeat. Consistent rotation prevents any sphere from overloading.',
          'Prioritise Jade Constructs over DPS on Ankka when they spawn.',
          'CM: reduce time spent at each sphere by 1–2 seconds. The rotation must be faster.',
        ],
        builds: [
          {role: 'Healer', specs: 'Druid, Firebrand', color: BUILD_COLORS.heal},
          {role: 'DPS', specs: 'Soulbeast, Holosmith, Virtuoso', color: BUILD_COLORS.dps},
          {role: 'Sphere Callers', specs: 'Any build — this is a communication role, not a build role', color: BUILD_COLORS.special},
        ],
      },
      {
        id: 'kaineng',
        name: 'Kaineng Overlook',
        cm: true,
        roles: 'Tank · Tile defenders',
        overview:
          'Minister Li, a master duelist who commands Jade Mech backup. The fight includes a board-control mechanic where players must maintain control of floor tiles against his mech army.',
        mechanics: [
          'Jade Mechs march onto the platform and try to claim floor tiles. Players must intercept and destroy them before they reach the tile edge.',
          'Minister Li\'s personal attacks are fast combo chains. The tank must face him away from the group.',
          'Ricochet — Li fires bouncing projectiles. Spread slightly to prevent them from chaining to adjacent players.',
          'Charged Strike — Li charges up a heavy blow with a visible orange telegraph. Dodge or block it.',
          'CM: Li gains empowered Jade Mech waves at 66 % and 33 %. Additional CC bars appear.',
        ],
        tips: [
          'Assign 3 players to mech interception duty. Mechs are predictable — learn their entry point and pre-position.',
          'The tank should maintain Li facing north so DPS players always know his back facing and can position for back-attacks.',
          'CM: rotate CC cooldowns specifically for the empowered mech waves. Failing those breaks causes large DPS losses.',
        ],
        builds: [
          {role: 'Tank', specs: 'Chronomancer, Dragonhunter', color: BUILD_COLORS.tank},
          {role: 'Healer', specs: 'Druid, Scrapper', color: BUILD_COLORS.heal},
          {role: 'DPS', specs: 'Holosmith, Virtuoso, Soulbeast', color: BUILD_COLORS.dps},
        ],
      },
      {
        id: 'harvest_temple',
        name: 'Harvest Temple',
        cm: false,
        roles: 'Tank · Dragon Void managers',
        overview:
          'The climactic fight against Soo-Won, the Elder Dragon of Water. A sprawling multi-phase encounter with a Dragon Void corruption mechanic, large environmental AoEs, and a demanding enrage timer.',
        mechanics: [
          'Dragon Void — Soo-Won fires corruption blasts that inflict Dragon Void stacks. Reaching 10 stacks kills the player. Cleanse with a Purified orb.',
          'Tail Swipe — Soo-Won sweeps her tail across the platform. Jump or dodge over it.',
          'Head Slam — she slams her head down with a massive AoE indicator. Sprint away immediately.',
          'Phase transition — at key HP thresholds Soo-Won becomes temporarily invulnerable and the group must collect and deposit three Light Orbs before the timer expires.',
          'Enrage timer is strict. High sustained DPS is required to avoid extra cycles.',
        ],
        tips: [
          'Purified orbs spawn at fixed locations around the arena — memorise them. Purify yourself as soon as you reach 6+ Dragon Void stacks.',
          'During head slam, sprint in the opposite direction of the slam indicator. It covers half the platform.',
          'Assign a strict rotation for Light Orb collection during the transition phase. Orbs on the same side should be paired.',
          'High DPS is essential — each extra cycle adds Dragon Void corruption pressure on the whole group.',
        ],
        builds: [
          {role: 'Tank', specs: 'Chronomancer, Dragonhunter', color: BUILD_COLORS.tank},
          {role: 'Healer', specs: 'Druid, Firebrand', color: BUILD_COLORS.heal},
          {role: 'DPS', specs: 'Soulbeast, Virtuoso, Specter', color: BUILD_COLORS.dps},
        ],
      },
    ],
  },
  {
    id: 'soto',
    name: 'Secrets of the Obscure',
    short: 'SotO',
    label: 'Strike Missions',
    bosses: [
      {
        id: 'cosmic_observatory',
        name: 'Cosmic Observatory',
        cm: true,
        roles: 'Tank · CC squad',
        overview:
          'Dagda, an Astral Ward leader corrupted by the Kryptis. A fast-paced fight with multiple breakbar phases, orb collection, and an expanding void mechanic that shrinks the safe arena.',
        mechanics: [
          'Void Expansion — the safe arena shrinks over time. Groups must maintain DPS output to prevent too many expansion cycles.',
          'Orb Collection — players must pick up specific colour orbs before they expire, or Dagda gains a buff.',
          'Breakbar — appears at regular intervals. Missing breaks allows Dagda to gain stacks that increase her damage output permanently.',
          'Corruption AoE — expanding circles mark random players. Move out of each other\'s circles immediately.',
          'CM: breakbar windows are shorter; void expands faster.',
        ],
        tips: [
          'Save CC cooldowns for breakbars — every missed break accelerates the wipe.',
          'Assign two orb collectors per colour. Do not leave orb collection to chance.',
          'Keep the group mobile — standing in the same spot for more than a few seconds risks the void catching up.',
          'CM requires near-perfect CC execution. Pre-assign CC skills to specific players with total values calculated.',
        ],
        builds: [
          {role: 'Tank', specs: 'Chronomancer, Dragonhunter', color: BUILD_COLORS.tank},
          {role: 'Healer', specs: 'Druid, Firebrand', color: BUILD_COLORS.heal},
          {role: 'DPS + CC', specs: 'Hammer builds essential — Spellbreaker, Hammer Rev, Tempest', color: BUILD_COLORS.dps},
        ],
      },
      {
        id: 'temple_febe',
        name: 'Temple of Febe',
        cm: true,
        roles: 'Tank · Condition managers',
        overview:
          'Cerus, a Kryptis lord. The normal mode is challenging; the CM is one of the hardest pieces of content in GW2, requiring perfect condition management, split-second dodges, and a very high DPS check.',
        mechanics: [
          'Malice — a stacking debuff that accumulates on all players. Cleanse it with Purity orbs scattered around the arena.',
          'Emotion attacks — Cerus sends directed emotion charges at players. Dodge the colour-coded projectiles (each has a different dodge timing).',
          'Aspect portals — Cerus opens dimensional tears that spawn Kryptis adds. Destroy portals quickly before add swarms overwhelm healers.',
          'Envy and Malice combined phase — at 50 %, all conditions become lethal. Cleanse priority must be perfect.',
          'CM: Cerus absorbs aspects permanently during the fight, gaining new lethal attacks with every absorption. Strict DPS check.',
        ],
        tips: [
          'Learn each emotion\'s colour and dodge timing before the CM. Yellow dodges differently than blue — they are not interchangeable.',
          'Purity orbs: designate one player to call their spawn location. Ignoring orbs past 7–8 stacks of Malice will kill the group.',
          'Portal destruction is a soft DPS check — every second of ignored portals adds another add to manage.',
          'CM: this is a progression fight. Expect 30–50 attempts before your first CM kill. Study each aspect\'s attack pattern independently.',
        ],
        builds: [
          {role: 'Tank', specs: 'Chronomancer', color: BUILD_COLORS.tank},
          {role: 'Healer', specs: 'Druid, Firebrand (must have cleanse output)', color: BUILD_COLORS.heal},
          {role: 'DPS', specs: 'Top-tier meta only for CM — Soulbeast, Virtuoso, Specter', color: BUILD_COLORS.dps},
          {role: 'Condition Cleanser', specs: 'Scrapper, Scourge (barrier + cleanse support)', color: BUILD_COLORS.support},
        ],
      },
    ],
  },
];

// ─── CONVERGENCES ─────────────────────────────────────────────────────────────

const CONVERGENCES: ContentGroup[] = [
  {
    id: 'soto_conv',
    name: 'SotO Convergences',
    short: 'Conv',
    label: 'Open World 50-Player Event',
    bosses: [
      {
        id: 'convergence_amnytas',
        name: 'Amnytas Convergence',
        cm: false,
        overview:
          'A large-scale 50-player open world event that takes place in the Amnytas floating realm. Scheduled weekly, it involves coordinated multi-lane defence, boss encounters, and a final Kryptis invasion.',
        mechanics: [
          'Lane Defence — the arena is split into three lanes. Players spread across lanes to defend Ley-Line Conduits from Kryptis assault waves.',
          'Boss Encounters — each lane has a major Kryptis boss that must be killed within a time limit.',
          'Void Rifts — Kryptis rifts spawn periodically. Close them by channelling on the rift to prevent reinforcement waves.',
          'Final Assault — all lanes converge on the central boss. Heavy AoE, breakbars, and platform mechanics.',
          'Contribution score — personal score determines loot quality. Stay active and participate in multiple objectives.',
        ],
        tips: [
          'Join a squad in the LFG ("Looking for Group") panel before entering — organised squads significantly outperform pick-up groups.',
          'Spread across lanes evenly. A 50-player group all rushing one lane fails the others.',
          'Rift closing gives significant contribution score — close every rift you see even during downtime.',
          'For the final boss, stack together and maximise burst — the enrage timer is strict.',
          'Waypoint to failed lanes quickly. The convergence has reduced respawn penalty — use it.',
        ],
        builds: [
          {role: 'Healer', specs: 'Firebrand (tag healer), Scrapper', color: BUILD_COLORS.heal},
          {role: 'DPS', specs: 'High AoE builds — Scourge, Tempest, Reaper, Weaver', color: BUILD_COLORS.dps},
          {role: 'Rift Closer', specs: 'Any self-sustain build. Bring Kryptis weapons for bonus efficiency', color: BUILD_COLORS.special},
        ],
      },
      {
        id: 'convergence_nayos',
        name: 'Nayos Convergence',
        cm: false,
        overview:
          'A Kryptis-realm convergence event in the Realm of Dreams. Similar structure to the Amnytas Convergence but with dream-plane specific mechanics and different boss encounters.',
        mechanics: [
          'Dream Instability — standing still builds a dream-corruption debuff. Keep moving during downtime.',
          'Nightmare constructs — Kryptis manifestations that spawn and buff nearby enemies. Prioritise them.',
          'Lane bosses are tuned harder than Amnytas — coordinate CC bars with your squad.',
          'Final convergence boss uses multi-phase spread mechanics — spread positions must be maintained.',
        ],
        tips: [
          'Coordinate with squad commanders for lane assignments — public zergs without coordination frequently fail the timer.',
          'Keep moving at all times to avoid Dream Instability stacks.',
          'CM equivalent (hardmode timer): shorten your burst rotations and skip self-sustain utilities for raw DPS.',
          'The Nayos convergence requires higher squad coordination than Amnytas — only attempt with an organised group on your first run.',
        ],
        builds: [
          {role: 'Healer', specs: 'Firebrand, Druid', color: BUILD_COLORS.heal},
          {role: 'DPS', specs: 'AoE-heavy — Tempest, Scourge, Weaver, Reaper', color: BUILD_COLORS.dps},
          {role: 'CC Support', specs: 'Hammer Warrior, Hammer Rev for boss breakbars', color: BUILD_COLORS.support},
        ],
      },
    ],
  },
];

// ─── Section Types ─────────────────────────────────────────────────────────────

type Section = 'raids' | 'strikes' | 'convergences' | 'kp';

const SECTIONS: {key: Section; label: string; emoji: string; data: ContentGroup[]}[] = [
  {key: 'raids', label: 'Raids', emoji: '👑', data: RAIDS},
  {key: 'strikes', label: 'Strikes', emoji: '⚔️', data: STRIKES},
  {key: 'convergences', label: 'Convergences', emoji: '🌌', data: CONVERGENCES},
  {key: 'kp', label: 'KP Lookup', emoji: '🔍', data: []},
];

// ─── Components ───────────────────────────────────────────────────────────────

function BuildTag({rec}: {rec: BuildRec}) {
  return (
    <View style={styles.buildTag}>
      <View style={[styles.buildRolePill, {backgroundColor: rec.color + '33', borderColor: rec.color}]}>
        <Text style={[styles.buildRoleText, {color: rec.color}]}>{rec.role}</Text>
      </View>
      <Text style={styles.buildSpecs}>{rec.specs}</Text>
    </View>
  );
}

function BossCard({boss, cleared = false}: {boss: BossGuide; cleared?: boolean}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={[styles.bossCard, cleared && styles.bossCardCleared]}>
      <TouchableOpacity
        style={styles.bossHeader}
        onPress={() => setExpanded(e => !e)}
        activeOpacity={0.7}>
        <View style={styles.bossLeft}>
          <Text style={styles.bossToggle}>{expanded ? '▼' : '▶'}</Text>
          <View style={{flex: 1}}>
            <View style={styles.bossNameRow}>
              <Text style={styles.bossName}>{boss.name}</Text>
              {boss.cm && (
                <View style={styles.cmBadge}>
                  <Text style={styles.cmBadgeText}>CM</Text>
                </View>
              )}
            </View>
            {boss.roles && (
              <Text style={styles.bossRoles}>{boss.roles}</Text>
            )}
          </View>
        </View>
        {cleared && (
          <View style={styles.clearedBadge}>
            <Text style={styles.clearedBadgeText}>✓ Done</Text>
          </View>
        )}
      </TouchableOpacity>

      {expanded && (
        <View style={styles.bossBody}>
          {/* Overview */}
          <View style={styles.overviewBox}>
            <Text style={styles.overviewText}>{boss.overview}</Text>
          </View>

          {/* Mechanics */}
          <Text style={styles.guideLabel}>⚙ Key Mechanics</Text>
          {boss.mechanics.map((m, i) => (
            <View key={i} style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{m}</Text>
            </View>
          ))}

          {/* Tips */}
          <Text style={[styles.guideLabel, {marginTop: spacing.md}]}>💡 Tips & Strategy</Text>
          {boss.tips.map((t, i) => (
            <View key={i} style={styles.bulletRow}>
              <Text style={styles.bulletArrow}>›</Text>
              <Text style={styles.tipText}>{t}</Text>
            </View>
          ))}

          {/* Builds */}
          <Text style={[styles.guideLabel, {marginTop: spacing.md}]}>🛡 Recommended Builds</Text>
          <View style={styles.buildsBlock}>
            {boss.builds.map((b, i) => (
              <BuildTag key={i} rec={b} />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

function GroupCard({group, clearedIds}: {group: ContentGroup; clearedIds: Set<string>}) {
  const [open, setOpen] = useState(false);
  const clearedCount = group.bosses.filter(b => clearedIds.has(b.id)).length;

  return (
    <View style={styles.wingCard}>
      <TouchableOpacity
        style={styles.wingHeader}
        onPress={() => setOpen(o => !o)}
        activeOpacity={0.75}>
        <View style={styles.wingLeft}>
          <View style={styles.wingBadge}>
            <Text style={styles.wingBadgeText}>{group.short}</Text>
          </View>
          <View>
            <Text style={styles.wingName}>{group.name}</Text>
            <Text style={styles.wingLabel}>{group.label}</Text>
          </View>
        </View>
        <View style={styles.wingRight}>
          {clearedCount > 0 && (
            <Text style={styles.wingCleared}>{clearedCount}/{group.bosses.length}</Text>
          )}
          <Text style={styles.wingBossCount}>
            {group.bosses.length} boss{group.bosses.length !== 1 ? 'es' : ''}
          </Text>
          <Text style={styles.wingChevron}>{open ? '▲' : '▼'}</Text>
        </View>
      </TouchableOpacity>

      {open && (
        <View style={styles.wingBody}>
          {group.bosses.map(boss => (
            <BossCard key={boss.id} boss={boss} cleared={clearedIds.has(boss.id)} />
          ))}
        </View>
      )}
    </View>
  );
}

// ─── KP Lookup ────────────────────────────────────────────────────────────────

const KP_HIGHLIGHTS: {id: number; name: string; fullName: string; color: string}[] = [
  {id: 77302, name: 'LI', fullName: 'Legendary Insight', color: '#c8972b'},
  {id: 81743, name: 'LD', fullName: 'Legendary Divination', color: '#fb3e8d'},
  {id: 93781, name: 'UFE', fullName: 'Unstable Fractal Essence', color: '#4090c8'},
  {id: 94020, name: 'UCE', fullName: 'Unstable Cosmic Essence', color: '#9932cc'},
  {id: 88485, name: 'RS', fullName: 'Rift Stabilizer', color: '#40c870'},
];
const KP_HIGHLIGHT_IDS = new Set(KP_HIGHLIGHTS.map(t => t.id));

interface KpToken {id: number; name: string; amount: number}
interface KpResult {
  id: string;
  account: string;
  proof_url: string;
  valid_api_key: boolean;
  tokens?: KpToken[];
  killproofs?: KpToken[];
  titles?: {name: string}[];
  buffs?: {name: string; duration_ms: number}[];
}

function KpLookupTab() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<KpResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {settings} = useAppStore();
  const {data: account} = useAccount();

  async function lookupName(name: string) {
    const q = name.trim();
    if (!q) return;
    Keyboard.dismiss();
    setQuery(q);
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(
        `https://killproof.me/api/kp/${encodeURIComponent(q)}`,
        {headers: {Accept: 'application/json'}},
      );
      if (res.status === 404) {
        setError('Player not found. They may not have a killproofs.me profile.');
        return;
      }
      if (!res.ok) {
        setError(`Request failed (${res.status}). Please try again.`);
        return;
      }
      const data: KpResult = await res.json();
      setResult(data);
    } catch {
      setError('Network error. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  async function lookup() {
    await lookupName(query);
  }

  // Build token map (tokens take priority over killproofs for amounts)
  const tokenMap = new Map<number, KpToken>();
  result?.killproofs?.forEach(t => tokenMap.set(t.id, t));
  result?.tokens?.forEach(t => tokenMap.set(t.id, t));

  const highlights = KP_HIGHLIGHTS.map(h => ({
    ...h,
    amount: tokenMap.get(h.id)?.amount ?? 0,
  })).filter(h => h.amount > 0);

  const otherTokens = [...tokenMap.values()]
    .filter(t => !KP_HIGHLIGHT_IDS.has(t.id) && t.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  return (
    <ScrollView
      contentContainerStyle={styles.kpContent}
      keyboardShouldPersistTaps="handled">
      {/* Search */}
      <View style={styles.kpSearchRow}>
        <TextInput
          style={styles.kpInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Account name or KP.me ID…"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={lookup}
        />
        <TouchableOpacity
          style={[styles.kpSearchBtn, loading && {opacity: 0.5}]}
          onPress={lookup}
          disabled={loading}
          activeOpacity={0.7}>
          <Text style={styles.kpSearchBtnText}>
            {loading ? '…' : '🔍'}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.kpHint}>
        Enter a GW2 account name (e.g. Player.1234) or a killproofs.me ID.
      </Text>

      {/* My KP shortcut */}
      {settings.apiKey && account?.name && (
        <TouchableOpacity
          style={styles.kpMyBtn}
          onPress={() => lookupName(account.name)}
          activeOpacity={0.7}
          disabled={loading}>
          <Text style={styles.kpMyBtnText}>
            🧙 Check My KP — {account.name}
          </Text>
        </TouchableOpacity>
      )}

      {loading && (
        <ActivityIndicator
          color={colors.gold}
          size="large"
          style={{marginTop: 40}}
        />
      )}

      {!!error && (
        <View style={styles.kpErrorBox}>
          <Text style={styles.kpErrorText}>⚠️ {error}</Text>
        </View>
      )}

      {result && (
        <View style={styles.kpResultsCard}>
          {/* Header */}
          <View style={styles.kpResultHeader}>
            <Text style={styles.kpAccountName}>{result.account}</Text>
            <View
              style={[
                styles.kpApiStatus,
                {
                  backgroundColor: result.valid_api_key
                    ? '#0a2a0a'
                    : '#2a0a0a',
                  borderColor: result.valid_api_key
                    ? colors.green
                    : colors.red,
                },
              ]}>
              <Text
                style={[
                  styles.kpApiStatusText,
                  {color: result.valid_api_key ? colors.green : colors.red},
                ]}>
                {result.valid_api_key ? '✓ API Key Linked' : '✗ No API Key'}
              </Text>
            </View>
          </View>

          {/* Highlight tokens (LI, LD, UFE, UCE, RS) */}
          {highlights.length > 0 ? (
            <View style={styles.kpHighlightGrid}>
              {highlights.map(h => (
                <View
                  key={h.id}
                  style={[styles.kpHighlightBox, {borderColor: h.color}]}>
                  <Text style={[styles.kpHighlightCount, {color: h.color}]}>
                    {h.amount}
                  </Text>
                  <Text style={styles.kpHighlightAbbr}>{h.name}</Text>
                  <Text style={styles.kpHighlightFull} numberOfLines={2}>
                    {h.fullName}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.kpNoTokens}>
              <Text style={styles.kpNoTokensText}>
                No tracked tokens recorded yet.
              </Text>
            </View>
          )}

          {/* Other tokens */}
          {otherTokens.length > 0 && (
            <View style={styles.kpSection}>
              <Text style={styles.kpSectionTitle}>Other Tokens</Text>
              {otherTokens.map(t => (
                <View key={t.id} style={styles.kpTokenRow}>
                  <Text style={styles.kpTokenName}>{t.name}</Text>
                  <Text style={styles.kpTokenAmount}>×{t.amount}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Titles */}
          {(result.titles?.length ?? 0) > 0 && (
            <View style={styles.kpSection}>
              <Text style={styles.kpSectionTitle}>Titles</Text>
              <View style={styles.kpTitleWrap}>
                {result.titles!.map((t, i) => (
                  <View key={i} style={styles.kpTitlePill}>
                    <Text style={styles.kpTitleText}>{t.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Profile URL */}
          <View style={styles.kpProfileRow}>
            <Text style={styles.kpProfileLabel}>KP.me profile</Text>
            <Text style={styles.kpProfileUrl} numberOfLines={1}>
              {result.proof_url}
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function RaidsScreen() {
  const [section, setSection] = useState<Section>('raids');
  const current = SECTIONS.find(s => s.key === section)!;
  const {data: raidClears} = useRaids();

  const clearedIds = React.useMemo(
    () => new Set<string>(raidClears ?? []),
    [raidClears],
  );

  const totalBosses = section !== 'kp'
    ? current.data.reduce((s, g) => s + g.bosses.length, 0)
    : 0;
  const cmCount = section !== 'kp'
    ? current.data.reduce((s, g) => s + g.bosses.filter(b => b.cm).length, 0)
    : 0;
  const totalCleared = section === 'raids'
    ? current.data.reduce((s, g) => s + g.bosses.filter(b => clearedIds.has(b.id)).length, 0)
    : 0;

  return (
    <View style={styles.screen}>
      {/* Section switcher — horizontal scroll to fit all 4 sections */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.sectionBarScroll}
        contentContainerStyle={styles.sectionBar}>
        {SECTIONS.map(s => (
          <TouchableOpacity
            key={s.key}
            style={[styles.sectionBtn, section === s.key && styles.sectionBtnActive]}
            onPress={() => setSection(s.key)}
            activeOpacity={0.7}>
            <Text style={[styles.sectionBtnText, section === s.key && styles.sectionBtnTextActive]}>
              {s.emoji} {s.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {section === 'kp' ? (
        <KpLookupTab />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{current.data.length}</Text>
              <Text style={styles.statLabel}>Wings</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{totalBosses}</Text>
              <Text style={styles.statLabel}>Bosses</Text>
            </View>
            {cmCount > 0 && (
              <View style={styles.statBox}>
                <Text style={[styles.statNum, {color: colors.red}]}>{cmCount}</Text>
                <Text style={styles.statLabel}>CM</Text>
              </View>
            )}
            {section === 'raids' && totalCleared > 0 && (
              <View style={styles.statBox}>
                <Text style={[styles.statNum, {color: colors.green}]}>{totalCleared}/{totalBosses}</Text>
                <Text style={styles.statLabel}>Cleared</Text>
              </View>
            )}
          </View>

          {current.data.map(group => (
            <GroupCard key={group.id} group={group} clearedIds={section === 'raids' ? clearedIds : new Set()} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  sectionBarScroll: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexGrow: 0,
  },
  sectionBar: {
    flexDirection: 'row',
    padding: spacing.sm,
    gap: spacing.xs,
  },
  sectionBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionBtnActive: {
    backgroundColor: colors.gold + '22',
    borderColor: colors.gold,
  },
  sectionBtnText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  sectionBtnTextActive: {
    color: colors.gold,
  },
  content: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  statNum: {
    color: colors.gold,
    fontSize: fontSize.xl,
    fontWeight: '800',
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  wingCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  wingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  wingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  wingBadge: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.gold + '22',
    borderWidth: 1,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wingBadgeText: {
    color: colors.gold,
    fontSize: fontSize.sm,
    fontWeight: '800',
  },
  wingName: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  wingLabel: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  wingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  wingBossCount: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  wingChevron: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  wingBody: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing.sm,
    gap: spacing.xs,
  },
  bossCard: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  bossCardCleared: {
    borderColor: colors.green + '66',
    backgroundColor: colors.green + '08',
  },
  bossHeader: {
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bossLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  clearedBadge: {
    backgroundColor: colors.green + '22',
    borderWidth: 1,
    borderColor: colors.green,
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: spacing.sm,
  },
  clearedBadgeText: {
    color: colors.green,
    fontSize: fontSize.xs,
    fontWeight: '800',
  },
  wingCleared: {
    color: colors.green,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  bossToggle: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    width: 12,
  },
  bossNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  bossName: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  cmBadge: {
    backgroundColor: colors.red + '22',
    borderWidth: 1,
    borderColor: colors.red,
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  cmBadgeText: {
    color: colors.red,
    fontSize: fontSize.xs,
    fontWeight: '800',
  },
  bossRoles: {
    color: colors.gold,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  bossBody: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  overviewBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
  },
  overviewText: {
    color: colors.text,
    fontSize: fontSize.md,
    lineHeight: 22,
  },
  guideLabel: {
    color: colors.gold,
    fontSize: fontSize.md,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  bulletDot: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    lineHeight: 22,
    width: 12,
  },
  bulletArrow: {
    color: colors.gold,
    fontSize: fontSize.md,
    lineHeight: 22,
    width: 12,
  },
  bulletText: {
    color: colors.text,
    fontSize: fontSize.md,
    lineHeight: 22,
    flex: 1,
  },
  tipText: {
    color: '#d4b870',
    fontSize: fontSize.md,
    lineHeight: 22,
    flex: 1,
  },
  buildsBlock: {
    gap: spacing.xs,
  },
  buildTag: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: 3,
  },
  buildRolePill: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    minWidth: 90,
    alignItems: 'center',
  },
  buildRoleText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  buildSpecs: {
    color: colors.text,
    fontSize: fontSize.md,
    flex: 1,
    lineHeight: 20,
  },

  // ── KP Lookup styles ──────────────────────────────────────────────────────
  kpContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  kpSearchRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  kpInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text,
    fontSize: fontSize.md,
  },
  kpSearchBtn: {
    backgroundColor: colors.gold,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 48,
  },
  kpSearchBtnText: {
    fontSize: fontSize.lg,
    color: '#000',
  },
  kpHint: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: -spacing.xs,
  },
  kpMyBtn: {
    backgroundColor: colors.gold + '22',
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  kpMyBtnText: {
    color: colors.gold,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  kpErrorBox: {
    backgroundColor: '#2a0a0a',
    borderWidth: 1,
    borderColor: colors.red,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  kpErrorText: {
    color: colors.red,
    fontSize: fontSize.sm,
  },
  kpResultsCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: 'hidden',
    gap: 0,
  },
  kpResultHeader: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.xs,
  },
  kpAccountName: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: '800',
  },
  kpApiStatus: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  kpApiStatusText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
  kpHighlightGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  kpHighlightBox: {
    flex: 1,
    minWidth: 80,
    backgroundColor: colors.bg,
    borderWidth: 1.5,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
    gap: 2,
  },
  kpHighlightCount: {
    fontSize: fontSize.xxl,
    fontWeight: '900',
    lineHeight: 30,
  },
  kpHighlightAbbr: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '800',
  },
  kpHighlightFull: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    textAlign: 'center',
  },
  kpNoTokens: {
    padding: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  kpNoTokensText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  kpSection: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.xs,
  },
  kpSectionTitle: {
    color: colors.gold,
    fontSize: fontSize.sm,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  kpTokenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '66',
  },
  kpTokenName: {
    color: colors.text,
    fontSize: fontSize.sm,
    flex: 1,
  },
  kpTokenAmount: {
    color: colors.gold,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  kpTitleWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  kpTitlePill: {
    backgroundColor: colors.gold + '22',
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  kpTitleText: {
    color: colors.gold,
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  kpProfileRow: {
    padding: spacing.md,
    gap: 4,
  },
  kpProfileLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  kpProfileUrl: {
    color: colors.blue,
    fontSize: fontSize.xs,
  },
});
