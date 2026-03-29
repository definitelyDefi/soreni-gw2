import React, {useMemo, useState} from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {
  useWizardVaultDaily,
  useMasteries,
  useAccountMasteries,
  useAccount,
  useDungeons,
} from '../hooks/useGW2';
import {useAppStore} from '../store/appStore';
import Card from '../components/ui/Card';
import {colors, fontSize, spacing, radius} from '../constants/theme';

const FRACTAL_KEYWORDS = ['fractal', 'nightmare', 'shattered', 'underground', 'aquatic', 'volcanic', 'cliffside', 'swampland', 'urban', 'captain', 'uncategorized', 'aetherblade', 'molten', 'solid', 'chaos', 'snowblind', 'thaumanova', 'mai trin', 'sunqua', 'silent', 'lonely', 'deepstone'];

// ─── Static Data ─────────────────────────────────────────────────────────────

const DUNGEONS = [
  { id: 'ascalonian_catacombs', name: 'Ascalonian Catacombs', emoji: '🏰', paths: [
    {id: 'story', label: 'Story'},
    {id: 'explorable0', label: 'Hodgins'},
    {id: 'explorable1', label: 'Detha'},
    {id: 'explorable2', label: 'Tzark'},
  ]},
  { id: 'caudecus_manor', name: "Caudecus's Manor", emoji: '🏯', paths: [
    {id: 'story', label: 'Story'},
    {id: 'explorable0', label: 'Asura'},
    {id: 'explorable1', label: 'Seraph'},
    {id: 'explorable2', label: 'Butler'},
  ]},
  { id: 'twilight_arbor', name: 'Twilight Arbor', emoji: '🌿', paths: [
    {id: 'story', label: 'Story'},
    {id: 'explorable0', label: 'Up'},
    {id: 'explorable1', label: 'Forward'},
    {id: 'explorable2', label: 'Aetherpath'},
  ]},
  { id: 'sorrows_embrace', name: "Sorrow's Embrace", emoji: '⛏️', paths: [
    {id: 'story', label: 'Story'},
    {id: 'explorable0', label: 'Fergg'},
    {id: 'explorable1', label: 'Rasalov'},
    {id: 'explorable2', label: 'Koptis'},
  ]},
  { id: 'citadel_of_flame', name: 'Citadel of Flame', emoji: '🔥', paths: [
    {id: 'story', label: 'Story'},
    {id: 'explorable0', label: 'Ferrah'},
    {id: 'explorable1', label: 'Magg'},
    {id: 'explorable2', label: 'Rhiannon'},
  ]},
  { id: 'honor_of_the_waves', name: 'Honor of the Waves', emoji: '🌊', paths: [
    {id: 'story', label: 'Story'},
    {id: 'explorable0', label: 'Butcher'},
    {id: 'explorable1', label: 'Plunderer'},
    {id: 'explorable2', label: 'Zealot'},
  ]},
  { id: 'crucible_of_eternity', name: 'Crucible of Eternity', emoji: '⚗️', paths: [
    {id: 'story', label: 'Story'},
    {id: 'explorable0', label: 'Front'},
    {id: 'explorable1', label: 'Middle'},
    {id: 'explorable2', label: 'Back'},
  ]},
  { id: 'the_ruined_city_of_arah', name: 'Ruined City of Arah', emoji: '🏛️', paths: [
    {id: 'story', label: 'Story'},
    {id: 'explorable0', label: 'Jotun'},
    {id: 'explorable1', label: 'Mursaat'},
    {id: 'explorable2', label: 'Forgotten'},
    {id: 'explorable3', label: 'Seer'},
  ]},
];

const FRACTAL_BUILDS = [
  { role: 'Healer', profession: 'Druid', elite: 'Druid', spec: 'Guardian/Druid', description: 'Heal Alacrity. Provide alacrity, healing, and boon support.', traits: ['Ancient Seeds', 'Verdant Etching', 'Natural Mender'], weapons: 'Staff + Warhorn/Axe', food: 'Cilantro Lime Sous-Vide Steak', color: '#40c870' },
  { role: 'Healer', profession: 'Specter', elite: 'Specter', spec: 'Thief/Specter', description: 'Heal Alacrity via Specter shroud. High sustain in fractals.', traits: ['Consume Shadows', 'Traversing Dusk', 'Shadestep'], weapons: 'Scepter/Pistol + Shortbow', food: 'Plate of Sesame Chicken', color: '#40c870' },
  { role: 'Quickness', profession: 'Scrapper', elite: 'Scrapper', spec: 'Engineer/Scrapper', description: 'Quickness DPS. Provide quickness while dealing damage.', traits: ['Gyroscopic Acceleration', 'Perfectly Weighted', 'Adaptive Armor'], weapons: 'Hammer', food: 'Rare Veggie Pizza', color: '#c8972b' },
  { role: 'Quickness', profession: 'Willbender', elite: 'Willbender', spec: 'Guardian/Willbender', description: 'Quickness DPS. Reliable quickness with high damage.', traits: ['Lethal Tempo', "Tyrant's Momentum", 'Vision of Rage'], weapons: 'Sword/Torch + Sword/Focus', food: 'Plate of Truffle Steak', color: '#c8972b' },
  { role: 'Alacrity', profession: 'Renegade', elite: 'Renegade', spec: 'Revenant/Renegade', description: 'Alacrity DPS. Core of fractal groups for decades.', traits: ['Righteous Rebel', 'Lasting Legacy', 'Brutal Momentum'], weapons: 'Shortbow + Sword/Axe', food: 'Plate of Beef Rendang', color: '#9060c0' },
  { role: 'DPS', profession: 'Weaver', elite: 'Weaver', spec: 'Elementalist/Weaver', description: 'Top melee DPS. Complex rotation but exceptional damage.', traits: ['Superior Elements', 'Masters Force', 'Bolt to the Heart'], weapons: 'Sword/Dagger', food: 'Bowl of Poultry Satay', color: '#c84040' },
  { role: 'DPS', profession: 'Virtuoso', elite: 'Virtuoso', spec: 'Mesmer/Virtuoso', description: 'Strong ranged DPS. Good for power builds.', traits: ['Deadly Blade', 'Jagged Mind', 'Phantasmal Blades'], weapons: 'Dagger/Focus + Sword/Focus', food: 'Bowl of Poultry Satay', color: '#c84040' },
  { role: 'DPS', profession: 'Deadeye', elite: 'Deadeye', spec: 'Thief/Deadeye', description: 'Ranged DPS. Excellent for stationary bosses.', traits: ["Death's Retreat", 'Maleficent Seven', 'Be Quick or Be Killed'], weapons: 'Rifle', food: 'Bowl of Poultry Satay', color: '#c84040' },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function ProgressBar({value, max, color = colors.blue}: {value: number; max: number; color?: string}) {
  const pct = max > 0 ? Math.min(1, value / max) : 0;
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, {width: `${pct * 100}%` as any, backgroundColor: color}]} />
    </View>
  );
}

function MasteryCard({region, defs, accountMap}: {
  region: string;
  defs: any[];
  accountMap: Map<number, number>;
}) {
  const regionDefs = defs.filter(d => d.region === region);
  if (regionDefs.length === 0) return null;

  const totalPoints = regionDefs.reduce((s, d) => s + d.levels.reduce((ls: number, l: any) => ls + l.point_cost, 0), 0);
  const earnedPoints = regionDefs.reduce((s, d) => {
    const acct = accountMap.get(d.id) ?? 0;
    return s + d.levels.slice(0, acct).reduce((ls: number, l: any) => ls + l.point_cost, 0);
  }, 0);

  return (
    <Card style={styles.masteryCard} padded>
      <Text style={styles.masteryRegion}>{region}</Text>
      <View style={styles.masteryPointsRow}>
        <Text style={styles.masteryPoints}>{earnedPoints}</Text>
        <Text style={styles.masteryPointsOf}>/{totalPoints} pts</Text>
      </View>
      <ProgressBar value={earnedPoints} max={totalPoints} color={REGION_COLORS[region] ?? colors.blue} />
      <View style={styles.masteryLines}>
        {regionDefs.map(def => {
          const acct = accountMap.get(def.id) ?? 0;
          const maxLevel = def.levels.length;
          const done = acct >= maxLevel;
          return (
            <View key={def.id} style={styles.masteryLine}>
              <Text style={[styles.masteryName, done && styles.masteryNameDone]} numberOfLines={1}>
                {done ? '✓ ' : ''}{def.name}
              </Text>
              <Text style={styles.masteryLevel}>{acct}/{maxLevel}</Text>
            </View>
          );
        })}
      </View>
    </Card>
  );
}

function DungeonCard({dungeon, completedSet}: {
  dungeon: typeof DUNGEONS[number];
  completedSet: Set<string>;
}) {
  const donePaths = dungeon.paths.filter(p => completedSet.has(`${dungeon.id}_${p.id}`));
  const total = dungeon.paths.length;
  const doneCount = donePaths.length;
  const allDone = doneCount === total;

  return (
    <Card style={styles.dungeonCard} padded>
      <View style={styles.dungeonHeader}>
        <Text style={styles.dungeonName}>{dungeon.emoji} {dungeon.name}</Text>
        <Text style={[styles.dungeonFraction, allDone && styles.dungeonFractionDone]}>
          {doneCount}/{total}
        </Text>
      </View>
      <View style={styles.dungeonPaths}>
        {dungeon.paths.map(path => {
          const done = completedSet.has(`${dungeon.id}_${path.id}`);
          return (
            <View key={path.id} style={[styles.pathChip, done ? styles.pathChipDone : styles.pathChipTodo]}>
              <Text style={[styles.pathChipText, done ? styles.pathChipTextDone : styles.pathChipTextTodo]}>
                {done ? '✓ ' : ''}{path.label}
              </Text>
            </View>
          );
        })}
      </View>
    </Card>
  );
}

function BuildCard({build}: {build: typeof FRACTAL_BUILDS[number]}) {
  return (
    <Card style={styles.buildCard} padded>
      <View style={styles.buildHeader}>
        <View style={[styles.roleBadge, {backgroundColor: build.color + '33', borderColor: build.color}]}>
          <Text style={[styles.roleBadgeText, {color: build.color}]}>{build.role}</Text>
        </View>
        <Text style={styles.buildSpec}>{build.spec}</Text>
      </View>
      <Text style={styles.buildDescription}>{build.description}</Text>
      <View style={styles.buildDetail}>
        <Text style={styles.buildDetailLabel}>Weapons</Text>
        <Text style={styles.buildDetailValue}>{build.weapons}</Text>
      </View>
      <View style={styles.buildDetail}>
        <Text style={styles.buildDetailLabel}>Food</Text>
        <Text style={styles.buildDetailValue}>{build.food}</Text>
      </View>
      <View style={styles.buildTraits}>
        {build.traits.map(trait => (
          <View key={trait} style={styles.traitChip}>
            <Text style={styles.traitChipText}>{trait}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

// ─── Tab Bar ─────────────────────────────────────────────────────────────────

type FracTab = 'fractals' | 'dungeons' | 'builds';

const TABS: {key: FracTab; label: string}[] = [
  {key: 'fractals', label: '🌀 Fractals'},
  {key: 'dungeons', label: '⚔️ Dungeons'},
  {key: 'builds', label: '📖 Builds'},
];

function TabBar({active, onChange}: {active: FracTab; onChange: (t: FracTab) => void}) {
  return (
    <View style={styles.tabBar}>
      {TABS.map(tab => {
        const isActive = tab.key === active;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabBtn, isActive && styles.tabBtnActive]}
            onPress={() => onChange(tab.key)}
            activeOpacity={0.7}>
            <Text style={[styles.tabBtnText, isActive && styles.tabBtnTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────

const REGION_COLORS: Record<string, string> = {
  Tyria: '#4090c8',
  Maguuma: '#40c870',
  Desert: '#c8972b',
  Tundra: '#80c8e0',
  Jade: '#c870b0',
  SkyScale: '#c84040',
  Secrets: '#9060c0',
};

const FRACTAL_TIERS = [
  {label: 'T1', min: 1, max: 25, color: '#4090c8'},
  {label: 'T2', min: 26, max: 50, color: '#40c870'},
  {label: 'T3', min: 51, max: 75, color: '#c8972b'},
  {label: 'T4', min: 76, max: 100, color: '#c84040'},
];

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function FractalsScreen() {
  const {settings} = useAppStore();
  const [activeTab, setActiveTab] = useState<FracTab>('fractals');

  const {data: account, isLoading: acctLoading} = useAccount();
  const {data: wvDaily, isLoading: wvLoading, error: wvError, refetch: refetchWv} = useWizardVaultDaily();
  const {data: masteries, isLoading: mastLoading} = useMasteries();
  const {data: accountMasteries} = useAccountMasteries();
  const {data: dungeonData, isLoading: dungeonLoading} = useDungeons();

  // Filter WV daily objectives to fractal-related ones
  const fractalObjectives = useMemo(() => {
    if (!wvDaily?.objectives) return [];
    return wvDaily.objectives.filter(obj =>
      FRACTAL_KEYWORDS.some(kw => obj.title.toLowerCase().includes(kw)),
    );
  }, [wvDaily]);

  // Build mastery account map: id -> level
  const acctMastMap = useMemo(() => {
    const m = new Map<number, number>();
    accountMasteries?.forEach(a => m.set(a.id, a.level));
    return m;
  }, [accountMasteries]);

  // Group masteries by region
  const masteryRegions = useMemo(() => {
    if (!masteries) return [];
    const regions = [...new Set(masteries.map((d: any) => d.region))];
    return regions.sort();
  }, [masteries]);

  // Build dungeon completed set
  const completedDungeons = useMemo(() => {
    return new Set<string>(dungeonData ?? []);
  }, [dungeonData]);

  const fractalLevel = account?.fractal_level ?? 0;
  const currentTier = FRACTAL_TIERS.slice().reverse().find(t => fractalLevel >= t.min) ?? FRACTAL_TIERS[0];

  if (!settings.apiKey) {
    return (
      <View style={styles.center}>
        <Card style={styles.noKeyCard} padded>
          <Text style={styles.noKeyTitle}>🔑 No API Key Set</Text>
          <Text style={styles.noKeyText}>Go to Settings to enter your GW2 API key.</Text>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TabBar active={activeTab} onChange={setActiveTab} />

      {activeTab === 'fractals' && (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>

          {/* Fractal Level Card */}
          <Card style={styles.card} padded>
            <Text style={styles.sectionTitle}>🌀 Fractal Level</Text>
            {acctLoading ? (
              <ActivityIndicator color={colors.gold} />
            ) : (
              <>
                <View style={styles.levelRow}>
                  <Text style={styles.levelNumber}>{fractalLevel}</Text>
                  <View style={[styles.tierBadge, {backgroundColor: currentTier.color + '33', borderColor: currentTier.color}]}>
                    <Text style={[styles.tierText, {color: currentTier.color}]}>{currentTier.label}</Text>
                  </View>
                </View>
                <View style={styles.tierRow}>
                  {FRACTAL_TIERS.map(t => {
                    const unlocked = fractalLevel >= t.min;
                    const active = t.label === currentTier.label;
                    return (
                      <View key={t.label} style={[styles.tierPip, {borderColor: t.color, backgroundColor: unlocked ? t.color + '44' : 'transparent'}]}>
                        <Text style={[styles.tierPipLabel, {color: unlocked ? t.color : colors.textMuted}]}>{t.label}</Text>
                        <Text style={[styles.tierPipRange, {color: unlocked ? colors.text : colors.textMuted}]}>
                          {t.min}–{t.max}
                        </Text>
                        {active && <View style={[styles.tierActiveDot, {backgroundColor: t.color}]} />}
                      </View>
                    );
                  })}
                </View>
              </>
            )}
          </Card>

          {/* Wizard's Vault — Fractal Objectives */}
          <Card style={styles.card} padded>
            <Text style={styles.sectionTitle}>🧙 Wizard's Vault — Fractal Objectives</Text>
            {wvError ? (
              <View style={styles.inlineError}>
                <Text style={styles.inlineErrorText}>⚠️ Could not load Wizard's Vault data.</Text>
                <TouchableOpacity onPress={refetchWv} style={styles.retryBtn}>
                  <Text style={styles.retryBtnText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : wvLoading ? (
              <ActivityIndicator color={colors.gold} style={styles.loader} />
            ) : fractalObjectives.length === 0 ? (
              <Text style={styles.emptyText}>No fractal objectives today.</Text>
            ) : (
              fractalObjectives.map(obj => {
                const done = obj.claimed;
                const pct = obj.progress_complete > 0
                  ? obj.progress_current / obj.progress_complete
                  : 1;
                return (
                  <View key={obj.id} style={[styles.dailyRow, done && styles.dailyRowDone]}>
                    <Text style={styles.dailyDot}>{done ? '✅' : '◯'}</Text>
                    <View style={{flex: 1}}>
                      <Text style={[styles.dailyName, done && styles.dailyNameDone]}>{obj.title}</Text>
                      <View style={styles.dailyProgressRow}>
                        <ProgressBar value={obj.progress_current} max={obj.progress_complete} color={colors.blue} />
                        <Text style={styles.dailyCount}>{obj.progress_current}/{obj.progress_complete}</Text>
                      </View>
                      <Text style={styles.acclaimText}>+{obj.acclaim} Astral Acclaim</Text>
                    </View>
                  </View>
                );
              })
            )}
            <Text style={styles.dailyHint}>Resets daily at 00:00 UTC</Text>
          </Card>

          {/* Mastery Points */}
          <Text style={styles.regionHeader}>🎓 Mastery Progress</Text>
          {mastLoading ? (
            <ActivityIndicator color={colors.gold} style={styles.loader} />
          ) : (
            masteryRegions.map(region => (
              <MasteryCard
                key={region}
                region={region}
                defs={masteries ?? []}
                accountMap={acctMastMap}
              />
            ))
          )}
        </ScrollView>
      )}

      {activeTab === 'dungeons' && (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <Text style={styles.tabSectionHeader}>⚔️ Weekly Dungeon Progress</Text>
          <Text style={styles.tabSectionHint}>Resets weekly on Monday at 07:30 UTC</Text>
          {dungeonLoading ? (
            <ActivityIndicator color={colors.gold} style={styles.loader} />
          ) : (
            DUNGEONS.map(dungeon => (
              <DungeonCard
                key={dungeon.id}
                dungeon={dungeon}
                completedSet={completedDungeons}
              />
            ))
          )}
        </ScrollView>
      )}

      {activeTab === 'builds' && (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <Text style={styles.tabSectionHeader}>📖 Recommended Fractal Builds</Text>
          <Text style={styles.tabSectionHint}>Meta builds for CM and T4 fractal content</Text>
          {FRACTAL_BUILDS.map((build, i) => (
            <BuildCard key={i} build={build} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bg},
  scrollView: {flex: 1},
  content: {padding: spacing.md},
  center: {flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center', padding: spacing.md},
  noKeyCard: {maxWidth: 320},
  noKeyTitle: {fontSize: fontSize.lg, color: colors.gold, fontWeight: '700', marginBottom: spacing.sm},
  noKeyText: {fontSize: fontSize.sm, color: colors.textMuted, lineHeight: 20},
  card: {marginBottom: spacing.md},
  sectionTitle: {fontSize: fontSize.sm, color: colors.textMuted, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: spacing.sm},
  loader: {marginVertical: spacing.md},
  emptyText: {color: colors.textMuted, fontSize: fontSize.sm, textAlign: 'center', paddingVertical: spacing.md},

  // Tab bar
  tabBar: {flexDirection: 'row', backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border},
  tabBtn: {flex: 1, paddingVertical: spacing.sm + 2, alignItems: 'center', justifyContent: 'center'},
  tabBtnActive: {borderBottomWidth: 2, borderBottomColor: colors.gold},
  tabBtnText: {fontSize: fontSize.sm, color: colors.textMuted, fontWeight: '600'},
  tabBtnTextActive: {color: colors.gold},

  // Tab section headers
  tabSectionHeader: {fontSize: fontSize.md, color: colors.text, fontWeight: '700', marginBottom: spacing.xs},
  tabSectionHint: {fontSize: fontSize.xs, color: colors.textMuted, marginBottom: spacing.md},

  // Fractal level
  levelRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm},
  levelNumber: {fontSize: 48, fontWeight: '800', color: colors.gold},
  tierBadge: {paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.md, borderWidth: 1},
  tierText: {fontSize: fontSize.md, fontWeight: '700'},
  tierRow: {flexDirection: 'row', gap: spacing.sm},
  tierPip: {flex: 1, alignItems: 'center', paddingVertical: spacing.sm, borderRadius: radius.sm, borderWidth: 1, position: 'relative'},
  tierActiveDot: {position: 'absolute', top: 4, right: 4, width: 6, height: 6, borderRadius: 3},
  tierPipLabel: {fontSize: fontSize.sm, fontWeight: '700'},
  tierPipRange: {fontSize: fontSize.xs, marginTop: 2},

  // Daily rows
  dailyRow: {flexDirection: 'row', alignItems: 'flex-start', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border, gap: spacing.sm},
  dailyRowDone: {opacity: 0.5},
  dailyDot: {fontSize: 16, marginTop: 1},
  dailyName: {fontSize: fontSize.sm, color: colors.text, flex: 1},
  dailyNameDone: {textDecorationLine: 'line-through'},
  dailyProgressRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 4},
  dailyCount: {fontSize: fontSize.xs, color: colors.textMuted, minWidth: 32, textAlign: 'right'},
  dailyHint: {fontSize: fontSize.xs, color: colors.textMuted, marginTop: spacing.sm},

  // Stat rows
  statRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.border},
  statLabel: {fontSize: fontSize.sm, color: colors.textMuted},
  statValue: {fontSize: fontSize.sm, color: colors.text, fontWeight: '600'},
  statSub: {fontSize: fontSize.xs, color: colors.textMuted},

  // Progress bar
  progressTrack: {height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden', marginVertical: 4},
  progressFill: {height: '100%', borderRadius: 3},

  // Masteries
  regionHeader: {fontSize: fontSize.sm, color: colors.textMuted, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: spacing.sm, marginTop: spacing.xs},
  masteryCard: {marginBottom: spacing.sm},
  masteryRegion: {fontSize: fontSize.md, color: colors.text, fontWeight: '700', marginBottom: 4},
  masteryPointsRow: {flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: 4},
  masteryPoints: {fontSize: fontSize.xl, color: colors.gold, fontWeight: '800'},
  masteryPointsOf: {fontSize: fontSize.sm, color: colors.textMuted},
  masteryLines: {marginTop: spacing.sm, gap: 4},
  masteryLine: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  masteryName: {fontSize: fontSize.xs, color: colors.textMuted, flex: 1},
  masteryNameDone: {color: colors.green},
  masteryLevel: {fontSize: fontSize.xs, color: colors.textMuted, marginLeft: spacing.sm},
  acclaimText: {fontSize: fontSize.xs, color: colors.gold, marginTop: 2},
  inlineError: {paddingVertical: spacing.sm, gap: spacing.sm},
  inlineErrorText: {fontSize: fontSize.sm, color: colors.textMuted, lineHeight: 20},
  retryBtn: {alignSelf: 'flex-start', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.xs},
  retryBtnText: {fontSize: fontSize.xs, color: colors.gold, fontWeight: '600'},

  // Dungeons
  dungeonCard: {marginBottom: spacing.sm},
  dungeonHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm},
  dungeonName: {fontSize: fontSize.md, color: colors.text, fontWeight: '700', flex: 1},
  dungeonFraction: {fontSize: fontSize.sm, color: colors.textMuted, fontWeight: '600', marginLeft: spacing.sm},
  dungeonFractionDone: {color: colors.green},
  dungeonPaths: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs},
  pathChip: {paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radius.sm, borderWidth: 1},
  pathChipDone: {backgroundColor: colors.green + '22', borderColor: colors.green},
  pathChipTodo: {backgroundColor: 'transparent', borderColor: colors.border},
  pathChipText: {fontSize: fontSize.xs, fontWeight: '600'},
  pathChipTextDone: {color: colors.green},
  pathChipTextTodo: {color: colors.textMuted},

  // Builds
  buildCard: {marginBottom: spacing.sm},
  buildHeader: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm},
  roleBadge: {paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.sm, borderWidth: 1},
  roleBadgeText: {fontSize: fontSize.xs, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5},
  buildSpec: {fontSize: fontSize.md, color: colors.text, fontWeight: '700', flex: 1},
  buildDescription: {fontSize: fontSize.sm, color: colors.textMuted, lineHeight: 18, marginBottom: spacing.sm},
  buildDetail: {flexDirection: 'row', gap: spacing.sm, marginBottom: 4},
  buildDetailLabel: {fontSize: fontSize.xs, color: colors.textMuted, fontWeight: '700', minWidth: 52, textTransform: 'uppercase'},
  buildDetailValue: {fontSize: fontSize.xs, color: colors.text, flex: 1},
  buildTraits: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.sm},
  traitChip: {paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border},
  traitChipText: {fontSize: fontSize.xs, color: colors.textMuted},
});
