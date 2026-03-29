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
  useAccount,
  useWvWMatch,
  useWvWWorlds,
  useWallet,
  useWvWAbilities,
  useAccountWvWAbilities,
  useWvWObjectiveDefs,
  useWvWRankDefs,
} from '../hooks/useGW2';
import {useAppStore} from '../store/appStore';
import Card from '../components/ui/Card';
import {SkeletonCard} from '../components/ui/Skeleton';
import ErrorMessage from '../components/ui/ErrorMessage';
import {colors, fontSize, spacing, radius} from '../constants/theme';
import type {
  WvWMatch,
  WvWMap,
  WvWObjectiveStatus,
  WvWObjectiveDef,
  WvWRankDef,
  WvWAbility,
  AccountWvWAbility,
} from '../api/wvw';

// ─── Constants ────────────────────────────────────────────────────────────────

const TEAM_COLORS = {red: '#c0392b', blue: '#2980b9', green: '#27ae60'};
const TEAM_LABELS: Record<string, string> = {red: 'Red', blue: 'Blue', green: 'Green'};
const TEAM_ORDER: Array<'red' | 'blue' | 'green'> = ['green', 'blue', 'red'];

const MAP_ORDER = ['Center', 'GreenHome', 'BlueHome', 'RedHome'];
const MAP_LABELS: Record<string, string> = {
  Center:    'Eternal Battlegrounds',
  RedHome:   'Red Borderlands',
  BlueHome:  'Blue Borderlands',
  GreenHome: 'Green Borderlands',
};

// Strategic importance: lower = more important
const OBJ_IMPORTANCE: Record<string, number> = {
  Castle: 0, Keep: 1, Tower: 2, Camp: 3, Ruins: 4, Mercenary: 5, Spawn: 99,
};

const WVW_CURRENCIES: {id: number; label: string; emoji: string}[] = [
  {id: 26,    label: 'Badges of Honor',        emoji: '🏅'},
  {id: 515,   label: 'Proof of Heroics',        emoji: '📜'},
  {id: 563,   label: 'Testimony of Heroics',    emoji: '📋'},
  {id: 1404,  label: 'Skirmish Claim Tickets',  emoji: '🎫'},
  {id: 37307, label: 'Memory of Battle',        emoji: '🧠'},
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function teamOf(match: WvWMatch, worldId: number): 'red' | 'blue' | 'green' | null {
  for (const team of TEAM_ORDER) {
    if (match.worlds[team] === worldId || match.all_worlds[team].includes(worldId))
      return team;
  }
  return null;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function kd(kills: number, deaths: number): string {
  if (deaths === 0) return kills > 0 ? '∞' : '—';
  return (kills / deaths).toFixed(2);
}

function timeHeld(lastFlipped: string): string {
  const secs = Math.floor((Date.now() - new Date(lastFlipped).getTime()) / 1000);
  if (secs < 90) { return 'just captured'; }
  const mins = Math.floor(secs / 60);
  if (mins < 60) { return `${mins}m`; }
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem > 0 ? `${hrs}h ${rem}m` : `${hrs}h`;
}

function daysUntil(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) { return 'ended'; }
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 24) { return `${hrs}h left`; }
  const days = Math.floor(hrs / 24);
  const remHrs = hrs % 24;
  return remHrs > 0 ? `${days}d ${remHrs}h left` : `${days}d left`;
}

function calcPPT(match: WvWMatch): {red: number; blue: number; green: number} {
  const ppt = {red: 0, blue: 0, green: 0};
  for (const map of match.maps) {
    for (const obj of map.objectives) {
      if (obj.owner !== 'Neutral' && obj.points_tick > 0) {
        ppt[obj.owner.toLowerCase() as 'red' | 'blue' | 'green'] += obj.points_tick;
      }
    }
  }
  return ppt;
}

function wvwRankProgress(rank: number, rankDefs: WvWRankDef[]): {
  title: string;
  nextTitle: string | null;
  nextAt: number;
  progress: number;
} {
  if (rankDefs.length === 0) {
    return {title: `Rank ${rank}`, nextTitle: null, nextAt: rank, progress: 1};
  }
  const sorted = [...rankDefs].sort((a, b) => a.min_rank - b.min_rank);
  let cur = sorted[0];
  let nextDef: WvWRankDef | null = null;
  for (let i = 0; i < sorted.length; i++) {
    if (rank >= sorted[i].min_rank) {
      cur = sorted[i];
      nextDef = sorted[i + 1] ?? null;
    } else break;
  }
  if (!nextDef) { return {title: cur.title, nextTitle: null, nextAt: cur.min_rank, progress: 1}; }
  const progress = (rank - cur.min_rank) / (nextDef.min_rank - cur.min_rank);
  return {title: cur.title, nextTitle: nextDef.title, nextAt: nextDef.min_rank, progress: Math.min(1, progress)};
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TeamScoreBar({match, myTeam, worldNames}: {
  match: WvWMatch;
  myTeam: 'red' | 'blue' | 'green' | null;
  worldNames: Map<number, string>;
}) {
  const total = match.scores.red + match.scores.blue + match.scores.green || 1;
  const sorted = [...TEAM_ORDER].sort((a, b) => match.scores[b] - match.scores[a]);

  return (
    <Card style={styles.scoreCard}>
      <Text style={styles.sectionLabel}>MATCH SCORE</Text>
      <View style={styles.totalBar}>
        {TEAM_ORDER.map(team => (
          <View key={team} style={[styles.totalBarSeg, {
            flex: match.scores[team] / total,
            backgroundColor: TEAM_COLORS[team],
          }]} />
        ))}
      </View>
      {sorted.map((team, rank) => {
        const worldId = match.worlds[team];
        const allies = match.all_worlds[team].filter(id => id !== worldId);
        const allyNames = allies.map(id => worldNames.get(id) ?? `${id}`).join(', ');
        const isMe = team === myTeam;
        return (
          <View key={team} style={[styles.teamRow, isMe && {backgroundColor: TEAM_COLORS[team] + '18', borderRadius: radius.md}]}>
            <View style={[styles.teamDot, {backgroundColor: TEAM_COLORS[team]}]} />
            <View style={styles.teamInfo}>
              <View style={styles.teamNameRow}>
                <Text style={[styles.teamName, {color: TEAM_COLORS[team]}]}>
                  {worldNames.get(worldId) ?? `World ${worldId}`}
                </Text>
                {isMe && <Text style={styles.youTag}> YOU</Text>}
                {rank === 0 && <Text style={styles.leadTag}> 🏆</Text>}
              </View>
              {allies.length > 0 && <Text style={styles.teamAllies}>+{allyNames}</Text>}
            </View>
            <View style={styles.teamStats}>
              <Text style={[styles.teamScore, {color: TEAM_COLORS[team]}]}>
                {match.scores[team].toLocaleString()}
              </Text>
              <Text style={styles.teamVP}>{match.victory_points[team]} VP</Text>
            </View>
          </View>
        );
      })}
    </Card>
  );
}

function PPTCard({match, myTeam}: {match: WvWMatch; myTeam: 'red' | 'blue' | 'green' | null}) {
  const ppt = calcPPT(match);
  const max = Math.max(ppt.red, ppt.blue, ppt.green) || 1;
  const sorted = [...TEAM_ORDER].sort((a, b) => ppt[b] - ppt[a]);

  return (
    <Card style={styles.pptCard}>
      <Text style={styles.sectionLabel}>POINTS PER TICK (PPT)</Text>
      {sorted.map(team => (
        <View key={team} style={styles.pptRow}>
          <View style={[styles.teamDot, {backgroundColor: TEAM_COLORS[team]}]} />
          <Text style={[styles.pptLabel, team === myTeam && {color: TEAM_COLORS[team]}]}>
            {TEAM_LABELS[team]}
          </Text>
          <View style={styles.pptBarBg}>
            <View style={[styles.pptBarFill, {
              flex: ppt[team] / max,
              backgroundColor: TEAM_COLORS[team] + (team === myTeam ? 'ff' : '99'),
            }]} />
            <View style={{flex: 1 - ppt[team] / max}} />
          </View>
          <Text style={[styles.pptVal, {color: TEAM_COLORS[team]}]}>{ppt[team]}</Text>
        </View>
      ))}
    </Card>
  );
}

function KDCard({match, myTeam}: {match: WvWMatch; myTeam: 'red' | 'blue' | 'green' | null}) {
  const sorted = [...TEAM_ORDER].sort((a, b) =>
    match.kills[b] / (match.deaths[b] || 1) - match.kills[a] / (match.deaths[a] || 1),
  );
  return (
    <Card style={styles.kdCard}>
      <Text style={styles.sectionLabel}>KILLS / DEATHS</Text>
      {sorted.map(team => (
        <View key={team} style={[
          styles.kdRow,
          team === myTeam && {backgroundColor: TEAM_COLORS[team] + '15', borderRadius: radius.sm},
        ]}>
          <View style={[styles.teamDot, {backgroundColor: TEAM_COLORS[team]}]} />
          <Text style={[styles.kdTeam, {color: TEAM_COLORS[team]}]}>{TEAM_LABELS[team]}</Text>
          <Text style={styles.kdVal}>{match.kills[team].toLocaleString()}</Text>
          <Text style={styles.kdSep}> K / </Text>
          <Text style={styles.kdVal}>{match.deaths[team].toLocaleString()} D</Text>
          <Text style={[styles.kdRatio, {color: colors.gold}]}>
            {kd(match.kills[team], match.deaths[team])}
          </Text>
        </View>
      ))}
    </Card>
  );
}

function SkirmishCard({match, myTeam}: {match: WvWMatch; myTeam: 'red' | 'blue' | 'green' | null}) {
  const recent = [...match.skirmishes].reverse().slice(0, 10);
  if (recent.length === 0) return null;
  const current = recent[0];
  const history = recent.slice(1);
  const maxScore = Math.max(...recent.flatMap(s => TEAM_ORDER.map(t => s.scores[t]))) || 1;

  return (
    <Card style={styles.skirmishCard}>
      <Text style={styles.sectionLabel}>SKIRMISHES</Text>

      {/* Current skirmish */}
      <View style={styles.skirmishCurrent}>
        <Text style={styles.skirmishCurrentLabel}>Current Skirmish #{current.id}</Text>
        <View style={styles.skirmishCurrentScores}>
          {[...TEAM_ORDER].sort((a, b) => current.scores[b] - current.scores[a]).map(team => (
            <View key={team} style={styles.skirmishCurrentTeam}>
              <View style={[styles.teamDot, {backgroundColor: TEAM_COLORS[team]}]} />
              <Text style={[styles.skirmishCurrentScore, {color: TEAM_COLORS[team]}]}>
                {current.scores[team].toLocaleString()}
              </Text>
              {team === myTeam && <Text style={styles.youTag}> ★</Text>}
            </View>
          ))}
        </View>
      </View>

      {/* History */}
      {history.length > 0 && (
        <>
          <Text style={[styles.sectionLabel, {marginTop: spacing.sm}]}>HISTORY</Text>
          {history.map(s => (
            <View key={s.id} style={styles.skirmishRow}>
              <Text style={styles.skirmishId}>#{s.id}</Text>
              {TEAM_ORDER.map(team => (
                <View key={team} style={styles.skirmishTeam}>
                  <View style={styles.skirmishBarBg}>
                    <View style={[styles.skirmishBarFill, {
                      flex: s.scores[team] / maxScore,
                      backgroundColor: TEAM_COLORS[team] + (team === myTeam ? 'ff' : '88'),
                    }]} />
                  </View>
                  <Text style={[styles.skirmishScore, {color: TEAM_COLORS[team]}]}>
                    {s.scores[team]}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </>
      )}
    </Card>
  );
}

function ObjectiveRow({obj, name, myTeam}: {
  obj: WvWObjectiveStatus;
  name: string;
  myTeam: 'red' | 'blue' | 'green' | null;
}) {
  const ownerKey = obj.owner.toLowerCase() as 'red' | 'blue' | 'green' | 'neutral';
  const color = ownerKey === 'neutral' ? colors.textMuted : TEAM_COLORS[ownerKey as 'red' | 'blue' | 'green'];
  const isAllied = myTeam && ownerKey === myTeam;

  return (
    <View style={[styles.objRow, isAllied && {backgroundColor: color + '10'}]}>
      <View style={[styles.objDot, {backgroundColor: color}]} />
      <Text style={[styles.objName, {color: isAllied ? color : colors.text}]} numberOfLines={1}>
        {name}
      </Text>
      {obj.points_tick > 0 && (
        <View style={[styles.pptBadge, {backgroundColor: color + '22'}]}>
          <Text style={[styles.pptBadgeText, {color}]}>{obj.points_tick}</Text>
        </View>
      )}
      {obj.owner !== 'Neutral' && (
        <Text style={styles.objHeld}>{timeHeld(obj.last_flipped)}</Text>
      )}
      {(obj.yaks_delivered ?? 0) > 0 && (
        <Text style={styles.objYaks}>🐂 {obj.yaks_delivered}</Text>
      )}
    </View>
  );
}

function MapCard({map, myTeam, objDefs}: {
  map: WvWMap;
  myTeam: 'red' | 'blue' | 'green' | null;
  objDefs: Map<string, WvWObjectiveDef>;
}) {
  const ppt = {red: 0, blue: 0, green: 0};
  for (const obj of map.objectives) {
    if (obj.owner !== 'Neutral' && obj.points_tick > 0) {
      ppt[obj.owner.toLowerCase() as 'red' | 'blue' | 'green'] += obj.points_tick;
    }
  }

  // Filter out Spawn/Ruins (no strategic value), sort by importance then by PPT descending
  const strategic = map.objectives
    .filter(o => (OBJ_IMPORTANCE[o.type] ?? 99) < 4)
    .sort((a, b) => {
      const typeDiff = (OBJ_IMPORTANCE[a.type] ?? 99) - (OBJ_IMPORTANCE[b.type] ?? 99);
      if (typeDiff !== 0) { return typeDiff; }
      return b.points_tick - a.points_tick;
    });

  const bonuses = map.bonuses.filter(b => b.owner !== 'Neutral');

  return (
    <Card style={styles.mapCard}>
      {/* Header */}
      <Text style={styles.mapName}>{MAP_LABELS[map.type] ?? map.type}</Text>

      {/* Scores + K/D */}
      <View style={styles.mapScoreRow}>
        {TEAM_ORDER.map(team => (
          <View key={team} style={[
            styles.mapScoreCol,
            team === myTeam && {backgroundColor: TEAM_COLORS[team] + '15', borderRadius: radius.sm},
          ]}>
            <Text style={[styles.mapScoreNum, {color: TEAM_COLORS[team]}]}>
              {map.scores[team].toLocaleString()}
            </Text>
            <Text style={[styles.mapPPTNum, {color: TEAM_COLORS[team] + 'cc'}]}>
              {ppt[team]} PPT
            </Text>
            <Text style={styles.mapKD}>
              {map.kills[team]}K / {map.deaths[team]}D
            </Text>
          </View>
        ))}
      </View>

      {/* Bloodlust / bonuses */}
      {bonuses.length > 0 && (
        <View style={styles.bonusRow}>
          {bonuses.map((b, i) => {
            const ownerKey = b.owner.toLowerCase() as 'red' | 'blue' | 'green';
            const color = TEAM_COLORS[ownerKey] ?? colors.textMuted;
            return (
              <View key={i} style={[styles.bonusBadge, {borderColor: color}]}>
                <Text style={[styles.bonusText, {color}]}>
                  {b.type === 'Bloodlust' ? '⚡' : '★'} {b.type}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Objectives */}
      <View style={styles.objSection}>
        {['Castle', 'Keep', 'Tower', 'Camp'].map(type => {
          const group = strategic.filter(o => o.type === type);
          if (group.length === 0) { return null; }
          return (
            <View key={type}>
              <Text style={styles.objTypeHeader}>{type}s</Text>
              {group.map(obj => (
                <ObjectiveRow
                  key={obj.id}
                  obj={obj}
                  name={objDefs.get(obj.id)?.name ?? obj.type}
                  myTeam={myTeam}
                />
              ))}
            </View>
          );
        })}
      </View>
    </Card>
  );
}

function AbilitiesCard() {
  const {data: abilities = []} = useWvWAbilities();
  const {data: accountAbilities = []} = useAccountWvWAbilities();

  const abilityMap = useMemo(() => {
    const m = new Map<number, WvWAbility>();
    abilities.forEach(a => m.set(a.id, a));
    return m;
  }, [abilities]);

  const invested = useMemo(() => {
    return accountAbilities
      .map((a: AccountWvWAbility) => {
        const def = abilityMap.get(a.id);
        if (!def) return null;
        const maxRank = def.ranks?.length ?? 0;
        return {id: a.id, name: def.name, icon: def.icon, rank: a.rank, maxRank};
      })
      .filter((x): x is {id: number; name: string; icon: string; rank: number; maxRank: number} => x !== null)
      .sort((a, b) => b.rank / b.maxRank - a.rank / a.maxRank);
  }, [accountAbilities, abilityMap]);

  if (invested.length === 0) return null;

  return (
    <Card style={styles.abilitiesCard}>
      <Text style={styles.sectionLabel}>WVW ABILITIES</Text>
      {invested.map(ab => (
        <View key={ab.id} style={styles.abilityRow}>
          {ab.icon
            ? <Image source={{uri: ab.icon}} style={styles.abilityIcon} />
            : <View style={styles.abilityIcon} />}
          <View style={styles.abilityInfo}>
            <View style={styles.abilityTopRow}>
              <Text style={styles.abilityName}>{ab.name}</Text>
              <Text style={styles.abilityRank}>{ab.rank}/{ab.maxRank}</Text>
            </View>
            <View style={styles.abilityBarBg}>
              <View style={[styles.abilityBarFill, {width: (`${(ab.rank / ab.maxRank) * 100}%`) as `${number}%`}]} />
            </View>
          </View>
        </View>
      ))}
    </Card>
  );
}

function AccountTab({account, wallet, match, myTeam, worldName, rankDefs}: {
  account: {wvw_rank?: number; world: number};
  wallet: {id: number; value: number}[];
  match: WvWMatch | null;
  myTeam: 'red' | 'blue' | 'green' | null;
  worldName: string;
  rankDefs: WvWRankDef[];
}) {
  const wvwWallet = WVW_CURRENCIES
    .map(c => {const entry = wallet.find(w => w.id === c.id); return entry ? {...c, value: entry.value} : null;})
    .filter((x): x is {id: number; label: string; emoji: string; value: number} => x !== null);

  const rank = account.wvw_rank ?? 0;
  const rankInfo = wvwRankProgress(rank, rankDefs);

  return (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {/* WvW Rank */}
      <Card style={styles.acctCard}>
        <Text style={styles.sectionLabel}>WVW RANK</Text>
        <View style={styles.rankBadgeRow}>
          <View style={styles.rankCircle}>
            <Text style={styles.rankNum}>{rank}</Text>
          </View>
          <View style={styles.rankDetails}>
            <Text style={styles.rankTitle}>{rankInfo.title}</Text>
            {rankInfo.nextTitle ? (
              <>
                <Text style={styles.rankNextLbl}>
                  Next: {rankInfo.nextTitle} at rank {rankInfo.nextAt}
                </Text>
                <View style={styles.rankBarBg}>
                  <View style={[styles.rankBarFill, {width: `${rankInfo.progress * 100}%` as any}]} />
                </View>
                <Text style={styles.rankBarPct}>
                  {rank - (rankInfo.nextAt - (rankDefs.find(r => r.title === rankInfo.title)?.min_rank ?? 0))} / {rankInfo.nextAt - (rankDefs.find(r => r.title === rankInfo.title)?.min_rank ?? 0)} ranks
                </Text>
              </>
            ) : (
              <Text style={styles.rankMaxed}>Max rank title reached</Text>
            )}
          </View>
        </View>
      </Card>

      {/* World & team */}
      <Card style={styles.acctCard}>
        <Text style={styles.sectionLabel}>YOUR WORLD</Text>
        <View style={styles.worldRow}>
          {myTeam && <View style={[styles.teamDot, styles.teamDotLg, {backgroundColor: TEAM_COLORS[myTeam]}]} />}
          <Text style={styles.worldName}>{worldName}</Text>
          {myTeam && (
            <Text style={[styles.worldTeam, {color: TEAM_COLORS[myTeam]}]}>
              {TEAM_LABELS[myTeam]} Team
            </Text>
          )}
        </View>
      </Card>

      {/* This week */}
      {match && myTeam && (
        <Card style={styles.acctCard}>
          <Text style={styles.sectionLabel}>YOUR TEAM THIS WEEK</Text>
          <View style={styles.myTeamGrid}>
            <View style={styles.myStatBox}>
              <Text style={[styles.myStatNum, {color: TEAM_COLORS[myTeam]}]}>
                {match.scores[myTeam].toLocaleString()}
              </Text>
              <Text style={styles.myStatLbl}>Score</Text>
            </View>
            <View style={styles.myStatBox}>
              <Text style={[styles.myStatNum, {color: TEAM_COLORS[myTeam]}]}>
                {match.victory_points[myTeam]}
              </Text>
              <Text style={styles.myStatLbl}>Victory Points</Text>
            </View>
            <View style={styles.myStatBox}>
              <Text style={[styles.myStatNum, {color: colors.green}]}>
                {match.kills[myTeam].toLocaleString()}
              </Text>
              <Text style={styles.myStatLbl}>Kills</Text>
            </View>
            <View style={styles.myStatBox}>
              <Text style={[styles.myStatNum, {color: colors.red}]}>
                {match.deaths[myTeam].toLocaleString()}
              </Text>
              <Text style={styles.myStatLbl}>Deaths</Text>
            </View>
          </View>
          <Text style={styles.kdLine}>
            K/D Ratio: {kd(match.kills[myTeam], match.deaths[myTeam])}
          </Text>
        </Card>
      )}

      {/* Currencies */}
      {wvwWallet.length > 0 && (
        <Card style={styles.acctCard}>
          <Text style={styles.sectionLabel}>WVW CURRENCIES</Text>
          {wvwWallet.map(w => (
            <View key={w.id} style={styles.currRow}>
              <Text style={styles.currEmoji}>{w.emoji}</Text>
              <Text style={styles.currName}>{w.label}</Text>
              <Text style={styles.currValue}>{w.value.toLocaleString()}</Text>
            </View>
          ))}
        </Card>
      )}

      {/* Abilities */}
      <AbilitiesCard />

      {/* Reward tracks note */}
      <Card style={styles.noteCard}>
        <Text style={styles.sectionLabel}>REWARD TRACKS</Text>
        <Text style={styles.noteTxt}>
          WvW reward track progress is not exposed by the GW2 API. Check your active track in-game under WvW → Reward Track.
        </Text>
      </Card>
    </ScrollView>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

// ─── Abilities Tab ────────────────────────────────────────────────────────────

function AbilitiesTab({wallet}: {wallet: {id: number; value: number}[]}) {
  const {data: abilities = []} = useWvWAbilities();
  const {data: accountAbilities = []} = useAccountWvWAbilities();

  const badges = useMemo(() => {
    const entry = wallet.find(w => w.id === 26);
    return entry?.value ?? 0;
  }, [wallet]);

  const enriched = useMemo(() => {
    return abilities
      .map((def: WvWAbility) => {
        const acct = (accountAbilities as AccountWvWAbility[]).find(a => a.id === def.id);
        const currentRank = acct?.rank ?? 0;
        const maxRank = def.ranks?.length ?? 0;
        const isMaxed = currentRank >= maxRank;
        const nextRank = def.ranks?.[currentRank];
        const nextCost = nextRank?.cost ?? null;
        const currentEffect = currentRank > 0
          ? (def.ranks?.[currentRank - 1]?.effect ?? null)
          : null;
        const affordable = !isMaxed && nextCost !== null && nextCost <= badges;
        return {
          id: def.id,
          name: def.name,
          description: def.description,
          currentRank,
          maxRank,
          isMaxed,
          nextCost,
          currentEffect,
          affordable,
        };
      })
      .sort((a, b) => {
        if (a.affordable && !b.affordable) return -1;
        if (!a.affordable && b.affordable) return 1;
        if (a.isMaxed && !b.isMaxed) return 1;
        if (!a.isMaxed && b.isMaxed) return -1;
        const aCost = a.nextCost ?? Infinity;
        const bCost = b.nextCost ?? Infinity;
        return aCost - bCost;
      });
  }, [abilities, accountAbilities, badges]);

  const upgradeableCount = useMemo(
    () => enriched.filter(a => a.affordable).length,
    [enriched],
  );

  const totalToMax = useMemo(() => {
    return enriched.reduce((sum, a) => {
      if (a.isMaxed || !a.maxRank) return sum;
      const def = abilities.find((d: WvWAbility) => d.id === a.id);
      if (!def?.ranks) return sum;
      const remaining = def.ranks.slice(a.currentRank);
      return sum + remaining.reduce((s: number, r: {cost: number; effect: string}) => s + r.cost, 0);
    }, 0);
  }, [enriched, abilities]);

  return (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {/* Currency bar */}
      <Card style={styles.abTabCurrCard}>
        <View style={styles.abTabCurrRow}>
          <Text style={styles.abTabCurrEmoji}>🏅</Text>
          <View style={styles.abTabCurrInfo}>
            <Text style={styles.abTabCurrLabel}>Badges of Honor</Text>
            <Text style={styles.abTabCurrVal}>{badges.toLocaleString()}</Text>
          </View>
          {upgradeableCount > 0 && (
            <View style={styles.abTabUpgradeBadge}>
              <Text style={styles.abTabUpgradeText}>
                {upgradeableCount} upgradeable
              </Text>
            </View>
          )}
        </View>
      </Card>

      {/* Ability list */}
      {enriched.map(ab => (
        <Card
          key={ab.id}
          style={[
            styles.abTabCard,
            ab.affordable && styles.abTabCardAffordable,
          ]}>
          <View style={styles.abTabTopRow}>
            <Text style={[styles.abTabName, ab.affordable && styles.abTabNameAffordable]}>
              {ab.name}
            </Text>
            {ab.isMaxed ? (
              <Text style={styles.abTabMaxed}>✓ Maxed</Text>
            ) : (
              <Text style={styles.abTabRankBadge}>
                {ab.currentRank}/{ab.maxRank}
              </Text>
            )}
          </View>

          {/* Progress bar */}
          {ab.maxRank > 0 && (
            <View style={styles.abTabBarBg}>
              <View
                style={[
                  styles.abTabBarFill,
                  ab.isMaxed && styles.abTabBarFillMaxed,
                  {width: `${Math.round((ab.currentRank / ab.maxRank) * 100)}%` as `${number}%`},
                ]}
              />
            </View>
          )}

          {/* Current effect */}
          {ab.currentEffect ? (
            <Text style={styles.abTabEffect}>{ab.currentEffect}</Text>
          ) : ab.description ? (
            <Text style={styles.abTabDesc} numberOfLines={2}>{ab.description}</Text>
          ) : null}

          {/* Next rank cost */}
          {!ab.isMaxed && ab.nextCost !== null && (
            <View style={styles.abTabCostRow}>
              <Text style={styles.abTabCostEmoji}>🏅</Text>
              <Text style={[styles.abTabCost, ab.affordable && styles.abTabCostAffordable]}>
                {ab.nextCost.toLocaleString()} Badges for rank {ab.currentRank + 1}
              </Text>
            </View>
          )}
        </Card>
      ))}

      {/* Summary */}
      {totalToMax > 0 && (
        <Card style={styles.abTabSummaryCard}>
          <Text style={styles.sectionLabel}>TOTAL COST TO MAX ALL</Text>
          <View style={styles.abTabSummaryRow}>
            <Text style={styles.abTabCurrEmoji}>🏅</Text>
            <Text style={styles.abTabSummaryVal}>
              {totalToMax.toLocaleString()} Badges of Honor
            </Text>
          </View>
          <Text style={styles.abTabSummaryNote}>
            You have {badges.toLocaleString()} — {totalToMax > badges
              ? `need ${(totalToMax - badges).toLocaleString()} more`
              : 'enough to max everything!'}
          </Text>
        </Card>
      )}
    </ScrollView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

type Tab = 'overview' | 'maps' | 'account' | 'abilities';

export default function WvWScreen() {
  const {settings} = useAppStore();
  const [tab, setTab] = useState<Tab>('overview');
  const queryClient = useQueryClient();

  const {data: account, isLoading: accLoading, error: accError, refetch: refetchAcc} = useAccount();
  const {data: match, isLoading: matchLoading, error: matchError, refetch: refetchMatch} = useWvWMatch();
  const {data: wallet = []} = useWallet();
  const {data: worlds = []} = useWvWWorlds();
  const {data: objDefsArr = []} = useWvWObjectiveDefs();
  const {data: rankDefs = []} = useWvWRankDefs();

  const worldNames = useMemo(() => {
    const m = new Map<number, string>();
    (worlds as {id: number; name: string}[]).forEach(w => m.set(w.id, w.name));
    return m;
  }, [worlds]);

  const objDefs = useMemo(() => {
    const m = new Map<string, WvWObjectiveDef>();
    objDefsArr.forEach(d => m.set(d.id, d));
    return m;
  }, [objDefsArr]);

  const myTeam = useMemo(() => {
    if (!match || !account) return null;
    return teamOf(match, account.world);
  }, [match, account]);

  const myWorldName = account
    ? (worldNames.get(account.world) ?? `World ${account.world}`)
    : '—';

  function onRefresh() {
    queryClient.invalidateQueries({queryKey: ['wvw_match']});
    queryClient.invalidateQueries({queryKey: ['wallet']});
  }

  if (!settings.apiKey) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>⚔️</Text>
        <Text style={styles.emptyTitle}>No API Key</Text>
        <Text style={styles.emptyText}>Add your GW2 API key in Settings.</Text>
      </View>
    );
  }

  if (accLoading || matchLoading) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.tabContent}>
        <SkeletonCard /><SkeletonCard /><SkeletonCard />
      </ScrollView>
    );
  }

  if (accError) return <ErrorMessage error={accError} onRetry={refetchAcc} />;
  if (matchError) return <ErrorMessage error={matchError} onRetry={refetchMatch} />;
  if (!match || !account) return null;

  const tabs: {key: Tab; label: string}[] = [
    {key: 'overview',  label: '🏆 Overview'},
    {key: 'maps',      label: '🗺 Maps'},
    {key: 'account',   label: '👤 Account'},
    {key: 'abilities', label: '⚔️ Abilities'},
  ];

  return (
    <View style={styles.container}>
      {/* Tab bar */}
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

      {/* Overview */}
      {tab === 'overview' && (
        <ScrollView
          contentContainerStyle={styles.tabContent}
          refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} tintColor={colors.gold} />}>
          {/* Match timing */}
          <View style={styles.matchTiming}>
            <View>
              <Text style={styles.timingLbl}>STARTED</Text>
              <Text style={styles.timingVal}>{fmtDate(match.start_time)}</Text>
            </View>
            <View style={styles.timingCenter}>
              <Text style={styles.timingCountdown}>{daysUntil(match.end_time)}</Text>
            </View>
            <View style={styles.timingRight}>
              <Text style={styles.timingLbl}>RESETS</Text>
              <Text style={styles.timingVal}>{fmtDate(match.end_time)}</Text>
            </View>
          </View>
          <TeamScoreBar match={match} myTeam={myTeam} worldNames={worldNames} />
          <PPTCard match={match} myTeam={myTeam} />
          <KDCard match={match} myTeam={myTeam} />
          <SkirmishCard match={match} myTeam={myTeam} />
        </ScrollView>
      )}

      {/* Maps */}
      {tab === 'maps' && (
        <ScrollView contentContainerStyle={styles.tabContent}>
          {MAP_ORDER
            .map(type => match.maps.find(m => m.type === type))
            .filter((m): m is WvWMap => m !== undefined)
            .map(m => (
              <MapCard key={m.id} map={m} myTeam={myTeam} objDefs={objDefs} />
            ))}
        </ScrollView>
      )}

      {/* Account */}
      {tab === 'account' && (
        <AccountTab
          account={account as {wvw_rank?: number; world: number}}
          wallet={wallet as {id: number; value: number}[]}
          match={match}
          myTeam={myTeam}
          worldName={myWorldName}
          rankDefs={rankDefs as WvWRankDef[]}
        />
      )}

      {/* Abilities */}
      {tab === 'abilities' && (
        <AbilitiesTab wallet={wallet as {id: number; value: number}[]} />
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bg},
  tabContent: {padding: spacing.md, gap: spacing.sm, paddingBottom: spacing.xl},
  empty: {flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.sm},
  emptyIcon: {fontSize: 40},
  emptyTitle: {color: colors.gold, fontSize: fontSize.lg, fontWeight: '700'},
  emptyText: {color: colors.textMuted, fontSize: fontSize.sm, textAlign: 'center'},

  tabBar: {flexDirection: 'row', backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border},
  tabBtn: {flex: 1, paddingVertical: spacing.sm + 2, alignItems: 'center'},
  tabBtnActive: {borderBottomWidth: 2, borderBottomColor: colors.gold},
  tabTxt: {color: colors.textMuted, fontSize: fontSize.sm, fontWeight: '600'},
  tabTxtActive: {color: colors.gold},

  sectionLabel: {color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: spacing.sm},

  // Match timing
  matchTiming: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginBottom: 0},
  timingLbl: {color: colors.textMuted, fontSize: 9, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2},
  timingVal: {color: colors.text, fontSize: fontSize.xs},
  timingCenter: {alignItems: 'center'},
  timingRight: {alignItems: 'flex-end'},
  timingCountdown: {color: colors.gold, fontSize: fontSize.sm, fontWeight: '800'},

  // Score card
  scoreCard: {gap: spacing.sm},
  totalBar: {flexDirection: 'row', height: 8, borderRadius: radius.sm, overflow: 'hidden', marginBottom: spacing.xs},
  totalBarSeg: {height: 8},
  teamRow: {flexDirection: 'row', alignItems: 'center', padding: spacing.xs, gap: spacing.sm},
  teamDot: {width: 10, height: 10, borderRadius: 5},
  teamDotLg: {width: 14, height: 14, borderRadius: 7},
  teamInfo: {flex: 1},
  teamNameRow: {flexDirection: 'row', alignItems: 'center'},
  teamName: {fontSize: fontSize.md, fontWeight: '700'},
  youTag: {fontSize: fontSize.xs, color: colors.gold, fontWeight: '800'},
  leadTag: {fontSize: fontSize.sm},
  teamAllies: {color: colors.textMuted, fontSize: fontSize.xs, marginTop: 1},
  teamStats: {alignItems: 'flex-end'},
  teamScore: {fontSize: fontSize.lg, fontWeight: '800'},
  teamVP: {color: colors.textMuted, fontSize: fontSize.xs},

  // PPT card
  pptCard: {gap: spacing.xs},
  pptRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 2},
  pptLabel: {width: 34, color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '700'},
  pptBarBg: {flex: 1, height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden', flexDirection: 'row'},
  pptBarFill: {height: 8, borderRadius: 4},
  pptVal: {width: 32, fontSize: fontSize.sm, fontWeight: '800', textAlign: 'right'},

  // KD card
  kdCard: {gap: 4},
  kdRow: {flexDirection: 'row', alignItems: 'center', padding: spacing.xs, gap: spacing.sm},
  kdTeam: {width: 36, fontSize: fontSize.sm, fontWeight: '700'},
  kdVal: {color: colors.text, fontSize: fontSize.sm},
  kdSep: {color: colors.textMuted, fontSize: fontSize.sm},
  kdRatio: {marginLeft: 'auto' as any, fontSize: fontSize.sm, fontWeight: '700'},

  // Skirmish
  skirmishCard: {gap: spacing.xs},
  skirmishCurrent: {backgroundColor: colors.bg, borderRadius: radius.md, padding: spacing.sm, marginBottom: spacing.xs},
  skirmishCurrentLabel: {color: colors.textMuted, fontSize: fontSize.xs, marginBottom: spacing.xs},
  skirmishCurrentScores: {flexDirection: 'row', gap: spacing.md},
  skirmishCurrentTeam: {flexDirection: 'row', alignItems: 'center', gap: 4},
  skirmishCurrentScore: {fontSize: fontSize.lg, fontWeight: '800'},
  skirmishRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 4},
  skirmishId: {color: colors.textMuted, fontSize: fontSize.xs, width: 28},
  skirmishTeam: {flex: 1, gap: 2},
  skirmishBarBg: {height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden', flexDirection: 'row'},
  skirmishBarFill: {height: 6, borderRadius: 3},
  skirmishScore: {fontSize: 9, fontWeight: '700'},

  // Map card
  mapCard: {gap: spacing.sm},
  mapName: {color: colors.gold, fontSize: fontSize.md, fontWeight: '700', marginBottom: 2},
  mapScoreRow: {flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.xs},
  mapScoreCol: {flex: 1, alignItems: 'center', padding: spacing.xs, borderRadius: radius.sm},
  mapScoreNum: {fontSize: fontSize.md, fontWeight: '800'},
  mapPPTNum: {fontSize: fontSize.xs, fontWeight: '700'},
  mapKD: {color: colors.textMuted, fontSize: 9, marginTop: 1},

  bonusRow: {flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap', marginBottom: spacing.xs},
  bonusBadge: {borderWidth: 1, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 2},
  bonusText: {fontSize: fontSize.xs, fontWeight: '700'},

  objSection: {gap: 4},
  objTypeHeader: {color: colors.textMuted, fontSize: 9, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginTop: spacing.xs, marginBottom: 2},
  objRow: {flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 3, paddingHorizontal: 4, borderRadius: radius.sm},
  objDot: {width: 8, height: 8, borderRadius: 4, flexShrink: 0},
  objName: {flex: 1, fontSize: fontSize.xs, fontWeight: '600'},
  pptBadge: {paddingHorizontal: 5, paddingVertical: 1, borderRadius: radius.sm},
  pptBadgeText: {fontSize: 9, fontWeight: '800'},
  objHeld: {color: colors.textMuted, fontSize: 9},
  objYaks: {fontSize: 9, color: colors.textMuted},

  // Account tab
  acctCard: {gap: spacing.sm},
  rankBadgeRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  rankCircle: {width: 64, height: 64, borderRadius: 32, borderWidth: 3, borderColor: colors.gold, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg},
  rankNum: {color: colors.gold, fontSize: fontSize.xl, fontWeight: '900'},
  rankDetails: {flex: 1, gap: 4},
  rankTitle: {color: colors.text, fontSize: fontSize.lg, fontWeight: '700'},
  rankNextLbl: {color: colors.textMuted, fontSize: fontSize.xs},
  rankBarBg: {height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden'},
  rankBarFill: {height: 6, backgroundColor: colors.gold, borderRadius: 3},
  rankBarPct: {color: colors.textMuted, fontSize: 9},
  rankMaxed: {color: colors.gold, fontSize: fontSize.xs},

  worldRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  worldName: {flex: 1, color: colors.text, fontSize: fontSize.lg, fontWeight: '700'},
  worldTeam: {fontSize: fontSize.sm, fontWeight: '600'},

  myTeamGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  myStatBox: {flex: 1, minWidth: '40%', alignItems: 'center', backgroundColor: colors.bg, borderRadius: radius.md, padding: spacing.sm},
  myStatNum: {fontSize: fontSize.xl, fontWeight: '800'},
  myStatLbl: {color: colors.textMuted, fontSize: fontSize.xs, marginTop: 2},
  kdLine: {color: colors.gold, fontSize: fontSize.sm, fontWeight: '700', textAlign: 'center'},

  currRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: 4},
  currEmoji: {width: 26, fontSize: fontSize.md},
  currName: {flex: 1, color: colors.text, fontSize: fontSize.sm},
  currValue: {color: colors.gold, fontSize: fontSize.sm, fontWeight: '700'},

  abilitiesCard: {gap: spacing.sm},
  abilityRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  abilityIcon: {width: 32, height: 32, borderRadius: radius.sm, backgroundColor: colors.border},
  abilityInfo: {flex: 1, gap: 3},
  abilityTopRow: {flexDirection: 'row', justifyContent: 'space-between'},
  abilityName: {color: colors.text, fontSize: fontSize.xs, fontWeight: '600', flex: 1},
  abilityRank: {color: colors.gold, fontSize: fontSize.xs, fontWeight: '700'},
  abilityBarBg: {height: 4, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden'},
  abilityBarFill: {height: 4, backgroundColor: colors.gold, borderRadius: 2},

  noteCard: {gap: spacing.xs},
  noteTxt: {color: colors.textMuted, fontSize: fontSize.xs, lineHeight: 18},

  // Abilities tab
  abTabCurrCard: {gap: spacing.xs},
  abTabCurrRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  abTabCurrEmoji: {fontSize: fontSize.xl, width: 32},
  abTabCurrInfo: {flex: 1},
  abTabCurrLabel: {color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8},
  abTabCurrVal: {color: colors.gold, fontSize: fontSize.xl, fontWeight: '800'},
  abTabUpgradeBadge: {backgroundColor: colors.green + '22', borderRadius: radius.md, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs},
  abTabUpgradeText: {color: colors.green, fontSize: fontSize.xs, fontWeight: '700'},

  abTabCard: {gap: spacing.xs},
  abTabCardAffordable: {borderWidth: 1, borderColor: colors.gold + '55', backgroundColor: colors.gold + '08'},
  abTabTopRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  abTabName: {flex: 1, color: colors.text, fontSize: fontSize.sm, fontWeight: '700'},
  abTabNameAffordable: {color: colors.gold},
  abTabMaxed: {color: colors.green, fontSize: fontSize.xs, fontWeight: '800'},
  abTabRankBadge: {color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '700'},

  abTabBarBg: {height: 5, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden'},
  abTabBarFill: {height: 5, backgroundColor: colors.gold + 'aa', borderRadius: 3},
  abTabBarFillMaxed: {backgroundColor: colors.green},

  abTabEffect: {color: colors.text, fontSize: fontSize.xs, lineHeight: 17},
  abTabDesc: {color: colors.textMuted, fontSize: fontSize.xs, lineHeight: 17},
  abTabCostRow: {flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2},
  abTabCostEmoji: {fontSize: fontSize.xs},
  abTabCost: {color: colors.textMuted, fontSize: fontSize.xs},
  abTabCostAffordable: {color: colors.green, fontWeight: '700'},

  abTabSummaryCard: {gap: spacing.xs},
  abTabSummaryRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  abTabSummaryVal: {color: colors.gold, fontSize: fontSize.lg, fontWeight: '800'},
  abTabSummaryNote: {color: colors.textMuted, fontSize: fontSize.xs},
});
