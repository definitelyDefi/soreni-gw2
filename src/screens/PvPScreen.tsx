import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import {useQueryClient} from '@tanstack/react-query';
import {
  usePvPStatsFull,
  usePvPGames,
  usePvPStandings,
  useWallet,
  usePvPSeasons,
  usePvPRankDefs,
} from '../hooks/useGW2';
import {useAppStore} from '../store/appStore';
import Card from '../components/ui/Card';
import {SkeletonCard} from '../components/ui/Skeleton';
import ErrorMessage from '../components/ui/ErrorMessage';
import {colors, fontSize, spacing, radius, profession as profColors} from '../constants/theme';
import type {PvPGame, PvPStanding, PvPStats, PvPRankDef} from '../api/wvw';

// ─── Constants ────────────────────────────────────────────────────────────────

const PVP_MAP_NAMES: Record<number, string> = {
  894: 'Temple of the Silent Storm',
  795: 'Forest of Niflhel',
  549: 'Legacy of the Foefire',
  968: 'Revenge of the Capricorn',
  1009: 'Eternal Coliseum',
  1099: 'Battle of Kyhlo',
  1110: 'Skyhammer',
  787: 'Spirit Watch',
  873: 'Courtyard',
};

const PROF_EMOJI: Record<string, string> = {
  Guardian: '🛡',
  Warrior: '⚔️',
  Engineer: '🔧',
  Ranger: '🏹',
  Thief: '🗡',
  Elementalist: '🔥',
  Mesmer: '💫',
  Necromancer: '💀',
  Revenant: '🔮',
};

// Actual GW2 PvP rank prestige tiers (rank resets to 1 each rollover, 1–80)
const PVP_TIERS = [
  {min: 1,  max: 9,  name: 'Rabbit',  emoji: '🐇'},
  {min: 10, max: 19, name: 'Deer',    emoji: '🦌'},
  {min: 20, max: 29, name: 'Dolyak',  emoji: '🐂'},
  {min: 30, max: 39, name: 'Wolf',    emoji: '🐺'},
  {min: 40, max: 49, name: 'Tiger',   emoji: '🐯'},
  {min: 50, max: 59, name: 'Bear',    emoji: '🐻'},
  {min: 60, max: 69, name: 'Shark',   emoji: '🦈'},
  {min: 70, max: 79, name: 'Phoenix', emoji: '🔥'},
  {min: 80, max: 80, name: 'Dragon',  emoji: '🐉'},
];

const DIVISION_COLORS = [
  '#cd7f32', // Amber
  '#50c878', // Emerald
  '#4169e1', // Sapphire
  '#e0115f', // Ruby
  '#b9f2ff', // Diamond
  '#ffd700', // Legendary
];

// Currencies earned from structured PvP
const PVP_CURRENCIES: {id: number; label: string; emoji: string}[] = [
  {id: 1101, label: 'Ascended Shards of Glory', emoji: '💠'},
  {id: 30,   label: 'PvP League Ticket',         emoji: '🎟'},
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pvpTier(rank: number): typeof PVP_TIERS[number] {
  return PVP_TIERS.findLast(t => rank >= t.min) ?? PVP_TIERS[0];
}

function pvpTierProgress(rank: number): number {
  const tier = pvpTier(rank);
  if (tier.min === tier.max) { return 1; }
  return (rank - tier.min) / (tier.max - tier.min + 1);
}

function rankIcon(rank: number, rankDefs: PvPRankDef[]): string | null {
  if (rankDefs.length === 0) { return null; }
  const def = [...rankDefs]
    .filter(d => d.min_rank <= rank)
    .sort((a, b) => b.min_rank - a.min_rank)[0];
  return def?.icon_big ?? def?.icon ?? null;
}

function winRate(wins: number, losses: number): string {
  const total = wins + losses;
  if (total === 0) { return '—'; }
  return `${Math.round((wins / total) * 100)}%`;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) { return `${mins}m ago`; }
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) { return `${hrs}h ago`; }
  return `${Math.floor(hrs / 24)}d ago`;
}

function calcStreak(games: PvPGame[]): {type: 'win' | 'loss'; count: number} | null {
  if (games.length === 0) { return null; }
  const first = games[0].result;
  let count = 0;
  for (const g of games) {
    if (g.result === first) { count++; } else { break; }
  }
  if (count < 2) { return null; }
  return {type: first === 'Victory' ? 'win' : 'loss', count};
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'});
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function RankCard({stats, rankDefs}: {stats: PvPStats; rankDefs: PvPRankDef[]}) {
  const rank = stats.pvp_rank;
  const rollovers = stats.pvp_rank_rollovers;
  const tier = pvpTier(rank);
  const progress = pvpTierProgress(rank);
  const icon = rankIcon(rank, rankDefs);

  return (
    <Card style={styles.rankCard}>
      <View style={styles.rankCardRow}>
        {/* Icon or number circle */}
        <View style={styles.rankCircleWrap}>
          {icon ? (
            <Image source={{uri: icon}} style={styles.rankIcon} />
          ) : (
            <View style={styles.rankCircle}>
              <Text style={styles.rankNum}>{rank}</Text>
            </View>
          )}
          {icon && (
            <View style={styles.rankNumBadge}>
              <Text style={styles.rankNumBadgeTxt}>{rank}</Text>
            </View>
          )}
        </View>

        <View style={styles.rankInfo}>
          <View style={styles.rankTierRow}>
            <Text style={styles.rankTierEmoji}>{tier.emoji}</Text>
            <Text style={styles.rankTierName}>{tier.name}</Text>
            {rollovers > 0 && (
              <View style={styles.rolloverBadge}>
                <Text style={styles.rolloverTxt}>✦{rollovers}</Text>
              </View>
            )}
          </View>
          <Text style={styles.rankSub}>
            Rank {rank} · {stats.pvp_rank_points.toLocaleString()} total points
          </Text>
          {tier.min !== tier.max && (
            <>
              <View style={styles.rankBarBg}>
                <View style={[styles.rankBarFill, {width: `${progress * 100}%` as `${number}%`}]} />
              </View>
              <Text style={styles.rankBarLbl}>
                {rank}/{tier.max} → {PVP_TIERS[PVP_TIERS.indexOf(tier) + 1]?.name ?? 'Dragon'}
              </Text>
            </>
          )}
        </View>
      </View>
    </Card>
  );
}

function StreakBanner({streak}: {streak: {type: 'win' | 'loss'; count: number}}) {
  const isWin = streak.type === 'win';
  return (
    <View style={[styles.streakBanner, {backgroundColor: isWin ? colors.green + '22' : colors.red + '22', borderColor: isWin ? colors.green : colors.red}]}>
      <Text style={[styles.streakEmoji]}>{isWin ? '🔥' : '💔'}</Text>
      <Text style={[styles.streakText, {color: isWin ? colors.green : colors.red}]}>
        {isWin ? 'Win' : 'Loss'} Streak: {streak.count}
      </Text>
    </View>
  );
}

function AggregateCard({stats}: {stats: PvPStats}) {
  const agg = stats.aggregate;
  const total = agg.wins + agg.losses;
  const wr = total > 0 ? agg.wins / total : 0;

  return (
    <Card style={styles.aggCard}>
      <Text style={styles.sectionLabel}>OVERALL RECORD</Text>
      <View style={styles.aggRow}>
        <View style={styles.aggStat}>
          <Text style={[styles.aggNum, {color: colors.green}]}>{agg.wins.toLocaleString()}</Text>
          <Text style={styles.aggLbl}>Wins</Text>
        </View>
        <View style={styles.aggStat}>
          <Text style={[styles.aggNum, {color: colors.red}]}>{agg.losses.toLocaleString()}</Text>
          <Text style={styles.aggLbl}>Losses</Text>
        </View>
        <View style={styles.aggStat}>
          <Text style={[styles.aggNum, {color: colors.gold}]}>{winRate(agg.wins, agg.losses)}</Text>
          <Text style={styles.aggLbl}>Win Rate</Text>
        </View>
        <View style={styles.aggStat}>
          <Text style={styles.aggNum}>{total.toLocaleString()}</Text>
          <Text style={styles.aggLbl}>Played</Text>
        </View>
      </View>
      <View style={styles.wrBarBg}>
        <View style={[styles.wrBarFill, {width: `${wr * 100}%` as `${number}%`}]} />
      </View>
      {agg.desertions > 0 && (
        <Text style={styles.desertions}>⚠ {agg.desertions} desertions · {agg.forfeits} forfeits</Text>
      )}
    </Card>
  );
}

function LadderCard({stats}: {stats: PvPStats}) {
  const ladders = stats.ladders ?? {};
  const entries = Object.entries(ladders)
    .map(([key, v]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      wins: v.wins,
      losses: v.losses,
      total: v.wins + v.losses,
    }))
    .filter(e => e.total > 0)
    .sort((a, b) => b.total - a.total);

  if (entries.length === 0) { return null; }

  const maxTotal = entries[0].total;

  return (
    <Card style={styles.ladderCard}>
      <Text style={styles.sectionLabel}>BY LADDER</Text>
      {entries.map(e => (
        <View key={e.name} style={styles.ladderRow}>
          <Text style={styles.ladderName}>{e.name}</Text>
          <View style={styles.ladderBarBg}>
            <View style={[styles.ladderBarWin, {flex: e.wins / maxTotal}]} />
            <View style={[styles.ladderBarLoss, {flex: e.losses / maxTotal}]} />
            <View style={{flex: 1 - e.total / maxTotal}} />
          </View>
          <Text style={[styles.ladderWR, {color: parseFloat(winRate(e.wins, e.losses)) >= 50 ? colors.green : colors.red}]}>
            {winRate(e.wins, e.losses)}
          </Text>
          <Text style={styles.ladderTotal}>{e.total}</Text>
        </View>
      ))}
    </Card>
  );
}

function ProfessionsCard({stats}: {stats: PvPStats}) {
  const profs = Object.entries(stats.professions as Record<string, {wins: number; losses: number}>)
    .map(([name, v]) => ({name, wins: v.wins, losses: v.losses, total: v.wins + v.losses}))
    .filter(p => p.total > 0)
    .sort((a, b) => b.total - a.total);

  if (profs.length === 0) { return null; }

  const maxTotal = profs[0].total;

  return (
    <Card style={styles.profCard}>
      <Text style={styles.sectionLabel}>BY PROFESSION</Text>
      {profs.map(p => {
        const wr = p.total > 0 ? p.wins / p.total : 0;
        const color = (profColors as Record<string, string>)[p.name] ?? colors.text;
        return (
          <View key={p.name} style={styles.profRow}>
            <Text style={styles.profEmoji}>{PROF_EMOJI[p.name] ?? '❓'}</Text>
            <Text style={[styles.profName, {color}]}>{p.name}</Text>
            <View style={styles.profBarBg}>
              <View style={[styles.profBarFill, {width: `${(p.total / maxTotal) * 100}%` as `${number}%`, backgroundColor: color}]} />
            </View>
            <Text style={[styles.profWR, {color: wr >= 0.5 ? colors.green : colors.red}]}>
              {winRate(p.wins, p.losses)}
            </Text>
            <Text style={styles.profGames}>{p.total}</Text>
          </View>
        );
      })}
    </Card>
  );
}

function GameRow({game}: {game: PvPGame}) {
  const isWin = game.result === 'Victory';
  const mapName = PVP_MAP_NAMES[game.map_id] ?? `Map ${game.map_id}`;
  const duration = Math.round(
    (new Date(game.ended).getTime() - new Date(game.started).getTime()) / 60000,
  );
  const profColor = (profColors as Record<string, string>)[game.profession] ?? colors.text;
  const myScore = game.team === 'Red' ? game.scores.red : game.scores.blue;
  const theirScore = game.team === 'Red' ? game.scores.blue : game.scores.red;

  return (
    <View style={[styles.gameRow, {borderLeftColor: isWin ? colors.green : colors.red}]}>
      <View style={[styles.gameResultPill, {backgroundColor: isWin ? colors.green + '22' : colors.red + '22'}]}>
        <Text style={[styles.gameResultTxt, {color: isWin ? colors.green : colors.red}]}>
          {isWin ? 'W' : 'L'}
        </Text>
      </View>
      <Text style={styles.gameProf}>{PROF_EMOJI[game.profession] ?? '❓'}</Text>
      <View style={styles.gameInfo}>
        <View style={styles.gameTopRow}>
          <Text style={[styles.gameProfName, {color: profColor}]}>{game.profession}</Text>
          <Text style={styles.gameScore}>
            <Text style={{color: isWin ? colors.green : colors.red}}>{myScore}</Text>
            <Text style={styles.scoreSep}> – </Text>
            <Text style={{color: isWin ? colors.red : colors.green}}>{theirScore}</Text>
          </Text>
          {game.rating_change !== undefined && (
            <Text style={[styles.ratingChange, {color: game.rating_change >= 0 ? colors.green : colors.red}]}>
              {game.rating_change >= 0 ? '+' : ''}{game.rating_change}
            </Text>
          )}
        </View>
        <View style={styles.gameBotRow}>
          <Text style={styles.gameMap} numberOfLines={1}>{mapName}</Text>
          <Text style={styles.gameMeta}>{duration}m · {timeAgo(game.ended)}</Text>
        </View>
      </View>
    </View>
  );
}

function DivisionVisualizer({
  divisions,
  curDiv,
  curTier,
}: {
  divisions: {name: string; tiers: {points: number}[]}[];
  curDiv: number;
  curTier: number;
}) {
  return (
    <View style={styles.divVis}>
      {divisions.map((div, di) => {
        const isCurrent = di === curDiv;
        const isPast = di < curDiv;
        const color = DIVISION_COLORS[di] ?? colors.gold;
        return (
          <View key={di} style={styles.divVisItem}>
            <View style={[
              styles.divVisDot,
              {backgroundColor: isPast || isCurrent ? color : colors.border},
              isCurrent && {borderWidth: 2, borderColor: color, backgroundColor: 'transparent', width: 14, height: 14, borderRadius: 7},
            ]} />
            {di < divisions.length - 1 && (
              <View style={[styles.divVisLine, {backgroundColor: isPast ? color + '88' : colors.border}]} />
            )}
          </View>
        );
      })}
    </View>
  );
}

function StandingCard({
  standing,
  seasons,
}: {
  standing: PvPStanding;
  seasons: {id: string; name: string; start: string; end: string; active: boolean; divisions: {name: string; flags: string[]; tiers: {points: number}[]}[]}[];
}) {
  const cur = standing.current;
  const best = standing.best;

  const season = seasons.find(s => s.id === standing.season_id);
  const divisions = season?.divisions ?? [];

  const curDivName = divisions[cur.division]?.name ?? `Division ${cur.division}`;
  const bestDivName = divisions[best.division]?.name ?? `Division ${best.division}`;
  const curDivColor = DIVISION_COLORS[cur.division] ?? colors.gold;
  const bestDivColor = DIVISION_COLORS[best.division] ?? colors.gold;

  const curDivDef = divisions[cur.division];
  const tierCount = curDivDef?.tiers?.length ?? 0;
  const tierProgress = tierCount > 0 ? cur.tier / tierCount : 0;

  return (
    <Card style={styles.standingCard}>
      {season && (
        <View style={styles.seasonHeader}>
          <Text style={styles.seasonName}>{season.name}</Text>
          <Text style={styles.seasonDates}>
            {fmtDate(season.start)} – {fmtDate(season.end)}
          </Text>
          {season.active && <View style={styles.activeBadge}><Text style={styles.activeTxt}>ACTIVE</Text></View>}
        </View>
      )}

      {divisions.length > 0 && (
        <DivisionVisualizer divisions={divisions} curDiv={cur.division} curTier={cur.tier} />
      )}

      <View style={styles.divisionRow}>
        {/* Current */}
        <View style={styles.divBox}>
          <Text style={styles.divLabel}>CURRENT</Text>
          <Text style={[styles.divName, {color: curDivColor}]}>{curDivName}</Text>
          <Text style={styles.divTier}>Tier {cur.tier + 1}{tierCount > 0 ? `/${tierCount}` : ''}</Text>
          {tierCount > 0 && (
            <View style={styles.tierBarBg}>
              <View style={[styles.tierBarFill, {width: `${tierProgress * 100}%` as `${number}%`, backgroundColor: curDivColor}]} />
            </View>
          )}
          <Text style={[styles.divPoints, {color: curDivColor}]}>{cur.total_points.toLocaleString()} pts</Text>
          {cur.rating !== undefined && (
            <Text style={styles.divRating}>MMR: {cur.rating}</Text>
          )}
          {(cur.decay ?? 0) > 0 && (
            <Text style={styles.divDecay}>⚠ Decay: {cur.decay}</Text>
          )}
          {cur.repeats > 0 && (
            <Text style={styles.divRepeats}>🐉 ×{cur.repeats}</Text>
          )}
        </View>

        <View style={styles.divDivider} />

        {/* Best */}
        <View style={styles.divBox}>
          <Text style={styles.divLabel}>BEST</Text>
          <Text style={[styles.divName, {color: bestDivColor}]}>{bestDivName}</Text>
          <Text style={styles.divTier}>Tier {best.tier + 1}</Text>
          <Text style={[styles.divPoints, {color: bestDivColor}]}>{best.total_points.toLocaleString()} pts</Text>
          {best.repeats > 0 && (
            <Text style={styles.divRepeats}>🐉 ×{best.repeats}</Text>
          )}
        </View>
      </View>
    </Card>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

type Tab = 'stats' | 'games' | 'season';

export default function PvPScreen() {
  const {settings} = useAppStore();
  const [tab, setTab] = useState<Tab>('stats');
  const queryClient = useQueryClient();

  const {data: stats, isLoading: statsLoading, error: statsError, refetch: refetchStats} = usePvPStatsFull();
  const {data: games = [], isLoading: gamesLoading} = usePvPGames();
  const {data: standings = []} = usePvPStandings();
  const {data: wallet = []} = useWallet();
  const {data: seasons = []} = usePvPSeasons();
  const {data: rankDefs = []} = usePvPRankDefs();

  const pvpWallet = useMemo(() => {
    return PVP_CURRENCIES
      .map(c => {
        const entry = (wallet as {id: number; value: number}[]).find(w => w.id === c.id);
        return entry ? {...c, value: entry.value} : null;
      })
      .filter((x): x is {id: number; label: string; emoji: string; value: number} => x !== null);
  }, [wallet]);

  const streak = useMemo(() => calcStreak(games as PvPGame[]), [games]);

  function onRefresh() {
    queryClient.invalidateQueries({queryKey: ['pvp_stats_full']});
    queryClient.invalidateQueries({queryKey: ['pvp_games']});
    queryClient.invalidateQueries({queryKey: ['wallet']});
  }

  if (!settings.apiKey) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>🏆</Text>
        <Text style={styles.emptyTitle}>No API Key</Text>
        <Text style={styles.emptyText}>Add your GW2 API key in Settings.</Text>
      </View>
    );
  }

  if (statsLoading) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.tabContent}>
        <SkeletonCard /><SkeletonCard /><SkeletonCard />
      </ScrollView>
    );
  }

  if (statsError) { return <ErrorMessage error={statsError} onRetry={refetchStats} />; }
  if (!stats) { return null; }

  const tabs: {key: Tab; label: string}[] = [
    {key: 'stats',  label: '📊 Stats'},
    {key: 'games',  label: '🎮 Games'},
    {key: 'season', label: '🏅 Season'},
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map(t => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tabBtn, tab === t.key && styles.tabBtnActive]}
            onPress={() => setTab(t.key)}
            activeOpacity={0.8}>
            <Text style={[styles.tabTxt, tab === t.key && styles.tabTxtActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats tab */}
      {tab === 'stats' && (
        <ScrollView
          contentContainerStyle={styles.tabContent}
          refreshControl={<RefreshControl refreshing={statsLoading} onRefresh={onRefresh} tintColor={colors.gold} />}>
          <RankCard stats={stats} rankDefs={rankDefs as PvPRankDef[]} />
          {streak && <StreakBanner streak={streak} />}
          <AggregateCard stats={stats} />
          <LadderCard stats={stats} />
          <ProfessionsCard stats={stats} />
          {pvpWallet.length > 0 && (
            <Card style={styles.currCard}>
              <Text style={styles.sectionLabel}>PVP CURRENCIES</Text>
              {pvpWallet.map(w => (
                <View key={w.id} style={styles.currRow}>
                  <Text style={styles.currEmoji}>{w.emoji}</Text>
                  <Text style={styles.currName}>{w.label}</Text>
                  <Text style={styles.currValue}>{w.value.toLocaleString()}</Text>
                </View>
              ))}
            </Card>
          )}
          <Card style={styles.noteCard}>
            <Text style={styles.sectionLabel}>REWARD TRACKS</Text>
            <Text style={styles.noteTxt}>
              The GW2 API does not expose PvP reward track progress. Check your active track in-game under PvP → Reward Tracks.
            </Text>
          </Card>
        </ScrollView>
      )}

      {/* Games tab */}
      {tab === 'games' && (
        <ScrollView
          contentContainerStyle={styles.tabContent}
          refreshControl={<RefreshControl refreshing={gamesLoading} onRefresh={onRefresh} tintColor={colors.gold} />}>
          {streak && (
            <StreakBanner streak={streak} />
          )}
          {(games as PvPGame[]).length === 0 ? (
            <View style={styles.emptyInline}>
              <Text style={styles.emptyText}>No recent games found.</Text>
            </View>
          ) : (
            (games as PvPGame[]).map(g => <GameRow key={g.id} game={g} />)
          )}
        </ScrollView>
      )}

      {/* Season tab */}
      {tab === 'season' && (
        <ScrollView contentContainerStyle={styles.tabContent}>
          {(standings as PvPStanding[]).length === 0 ? (
            <View style={styles.emptyInline}>
              <Text style={styles.emptyIcon}>🏅</Text>
              <Text style={styles.emptyTitle}>No Season Data</Text>
              <Text style={styles.emptyText}>
                Participate in ranked PvP during an active season to see standings.
              </Text>
            </View>
          ) : (
            (standings as PvPStanding[]).map((s, i) => (
              <StandingCard key={i} standing={s} seasons={seasons as Parameters<typeof StandingCard>[0]['seasons']} />
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bg},
  tabContent: {padding: spacing.md, gap: spacing.sm, paddingBottom: spacing.xl},
  empty: {flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.sm},
  emptyInline: {alignItems: 'center', padding: spacing.xl, gap: spacing.sm},
  emptyIcon: {fontSize: 40},
  emptyTitle: {color: colors.gold, fontSize: fontSize.lg, fontWeight: '700'},
  emptyText: {color: colors.textMuted, fontSize: fontSize.sm, textAlign: 'center'},

  tabBar: {flexDirection: 'row', backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border},
  tabBtn: {flex: 1, paddingVertical: spacing.sm + 2, alignItems: 'center'},
  tabBtnActive: {borderBottomWidth: 2, borderBottomColor: colors.gold},
  tabTxt: {color: colors.textMuted, fontSize: fontSize.sm, fontWeight: '600'},
  tabTxtActive: {color: colors.gold},

  sectionLabel: {color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: spacing.sm},

  // Rank card
  rankCard: {},
  rankCardRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  rankCircleWrap: {alignItems: 'center', justifyContent: 'center'},
  rankCircle: {width: 68, height: 68, borderRadius: 34, borderWidth: 3, borderColor: colors.gold, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg},
  rankIcon: {width: 68, height: 68, borderRadius: 34},
  rankNum: {color: colors.gold, fontSize: fontSize.xl, fontWeight: '900'},
  rankNumBadge: {position: 'absolute', bottom: -4, right: -4, backgroundColor: colors.gold, borderRadius: 8, paddingHorizontal: 4, paddingVertical: 1},
  rankNumBadgeTxt: {color: colors.bg, fontSize: 9, fontWeight: '900'},
  rankInfo: {flex: 1, gap: 4},
  rankTierRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs},
  rankTierEmoji: {fontSize: fontSize.lg},
  rankTierName: {color: colors.text, fontSize: fontSize.lg, fontWeight: '800'},
  rolloverBadge: {backgroundColor: colors.gold + '33', borderRadius: radius.sm, paddingHorizontal: 5, paddingVertical: 1},
  rolloverTxt: {color: colors.gold, fontSize: fontSize.xs, fontWeight: '800'},
  rankSub: {color: colors.textMuted, fontSize: fontSize.xs},
  rankBarBg: {height: 5, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden'},
  rankBarFill: {height: 5, backgroundColor: colors.gold, borderRadius: 3},
  rankBarLbl: {color: colors.textMuted, fontSize: 9},

  // Streak banner
  streakBanner: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.sm, borderRadius: radius.md, borderWidth: 1},
  streakEmoji: {fontSize: fontSize.lg},
  streakText: {fontSize: fontSize.md, fontWeight: '800'},

  // Aggregate
  aggCard: {gap: spacing.sm},
  aggRow: {flexDirection: 'row', gap: spacing.sm},
  aggStat: {flex: 1, alignItems: 'center'},
  aggNum: {color: colors.text, fontSize: fontSize.xl, fontWeight: '800'},
  aggLbl: {color: colors.textMuted, fontSize: fontSize.xs},
  wrBarBg: {height: 8, backgroundColor: colors.red + '44', borderRadius: 4, overflow: 'hidden'},
  wrBarFill: {height: 8, backgroundColor: colors.green, borderRadius: 4},
  desertions: {color: colors.red, fontSize: fontSize.xs},

  // Ladder
  ladderCard: {gap: spacing.xs},
  ladderRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  ladderName: {color: colors.text, fontSize: fontSize.xs, fontWeight: '600', width: 60},
  ladderBarBg: {flex: 1, height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden', flexDirection: 'row'},
  ladderBarWin: {height: 8, backgroundColor: colors.green},
  ladderBarLoss: {height: 8, backgroundColor: colors.red + '88'},
  ladderWR: {fontSize: fontSize.xs, fontWeight: '700', width: 36, textAlign: 'right'},
  ladderTotal: {color: colors.textMuted, fontSize: fontSize.xs, width: 28, textAlign: 'right'},

  // Professions
  profCard: {gap: 8},
  profRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  profEmoji: {fontSize: fontSize.md, width: 22},
  profName: {width: 82, fontSize: fontSize.xs, fontWeight: '600'},
  profBarBg: {flex: 1, height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden'},
  profBarFill: {height: 6, borderRadius: 3},
  profWR: {fontSize: fontSize.xs, fontWeight: '700', width: 36, textAlign: 'right'},
  profGames: {color: colors.textMuted, fontSize: fontSize.xs, width: 30, textAlign: 'right'},

  // Game row
  gameRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: radius.md,
    borderLeftWidth: 3, padding: spacing.sm, gap: spacing.sm, marginBottom: spacing.xs,
  },
  gameResultPill: {width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center'},
  gameResultTxt: {fontSize: fontSize.sm, fontWeight: '900'},
  gameProf: {fontSize: fontSize.lg, width: 24},
  gameInfo: {flex: 1, gap: 3},
  gameTopRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  gameProfName: {fontSize: fontSize.xs, fontWeight: '700', flex: 1},
  gameScore: {fontSize: fontSize.sm, fontWeight: '700'},
  scoreSep: {color: colors.textMuted},
  ratingChange: {fontSize: fontSize.xs, fontWeight: '700'},
  gameBotRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  gameMap: {flex: 1, color: colors.textMuted, fontSize: fontSize.xs},
  gameMeta: {color: colors.textMuted, fontSize: fontSize.xs},

  // Standing
  standingCard: {gap: spacing.sm},
  seasonHeader: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap'},
  seasonName: {color: colors.gold, fontSize: fontSize.md, fontWeight: '700', flex: 1},
  seasonDates: {color: colors.textMuted, fontSize: fontSize.xs},
  activeBadge: {backgroundColor: colors.green + '33', borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 2},
  activeTxt: {color: colors.green, fontSize: 9, fontWeight: '800', letterSpacing: 1},

  // Division visualizer
  divVis: {flexDirection: 'row', alignItems: 'center', marginVertical: spacing.xs},
  divVisItem: {flexDirection: 'row', alignItems: 'center', flex: 1},
  divVisDot: {width: 10, height: 10, borderRadius: 5},
  divVisLine: {flex: 1, height: 2},

  divisionRow: {flexDirection: 'row', gap: spacing.md},
  divBox: {flex: 1, gap: 4},
  divDivider: {width: 1, backgroundColor: colors.border},
  divLabel: {color: colors.textMuted, fontSize: 9, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase'},
  divName: {fontSize: fontSize.lg, fontWeight: '800'},
  divTier: {color: colors.textMuted, fontSize: fontSize.sm},
  tierBarBg: {height: 4, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden'},
  tierBarFill: {height: 4, borderRadius: 2},
  divPoints: {fontSize: fontSize.sm, fontWeight: '600'},
  divRating: {color: colors.textMuted, fontSize: fontSize.xs},
  divDecay: {color: colors.red, fontSize: fontSize.xs},
  divRepeats: {color: colors.gold, fontSize: fontSize.xs, fontWeight: '700'},

  // Currencies
  currCard: {gap: spacing.sm},
  currRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: 4},
  currEmoji: {width: 26, fontSize: fontSize.md},
  currName: {flex: 1, color: colors.text, fontSize: fontSize.sm},
  currValue: {color: colors.gold, fontSize: fontSize.sm, fontWeight: '700'},

  // Note
  noteCard: {gap: spacing.xs},
  noteTxt: {color: colors.textMuted, fontSize: fontSize.xs, lineHeight: 18},
});
