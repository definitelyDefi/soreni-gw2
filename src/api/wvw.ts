import gw2Api from './client';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WvWTeamValues {
  red: number;
  blue: number;
  green: number;
}

export interface WvWSkirmish {
  id: number;
  scores: WvWTeamValues;
  map_scores: {type: string; scores: WvWTeamValues}[];
}

export interface WvWObjectiveStatus {
  id: string;
  type: string;
  owner: 'Red' | 'Blue' | 'Green' | 'Neutral';
  last_flipped: string;
  claimed_by?: string;
  claimed_at?: string;
  points_tick: number;
  points_capture: number;
  yaks_delivered?: number;
  guild_upgrades?: number[];
}

export interface WvWMap {
  id: number;
  type: 'Center' | 'RedHome' | 'BlueHome' | 'GreenHome';
  scores: WvWTeamValues;
  bonuses: {type: string; owner: string}[];
  objectives: WvWObjectiveStatus[];
  deaths: WvWTeamValues;
  kills: WvWTeamValues;
}

export interface WvWMatch {
  id: string;
  start_time: string;
  end_time: string;
  scores: WvWTeamValues;
  worlds: WvWTeamValues;
  all_worlds: {red: number[]; blue: number[]; green: number[]};
  deaths: WvWTeamValues;
  kills: WvWTeamValues;
  victory_points: WvWTeamValues;
  skirmishes: WvWSkirmish[];
  maps: WvWMap[];
}

export interface WvWWorld {
  id: number;
  name: string;
  population: 'Low' | 'Medium' | 'High' | 'VeryHigh' | 'Full';
}

export interface PvPStats {
  pvp_rank: number;
  pvp_rank_points: number;
  pvp_rank_rollovers: number;
  aggregate: {wins: number; losses: number; desertions: number; byes: number; forfeits: number};
  professions: Record<string, {wins: number; losses: number}>;
  ladders: Record<string, {wins: number; losses: number; desertions: number; byes: number; forfeits: number}>;
}

export interface PvPGame {
  id: string;
  map_id: number;
  started: string;
  ended: string;
  result: 'Victory' | 'Defeat';
  team: 'Red' | 'Blue';
  profession: string;
  scores: {red: number; blue: number};
  rating_type: string;
  rating_change?: number;
}

export interface PvPStanding {
  current: {total_points: number; division: number; tier: number; points: number; repeats: number; rating?: number; decay?: number};
  best: {total_points: number; division: number; tier: number; points: number; repeats: number};
  season_id: string;
}

// ─── WvW ──────────────────────────────────────────────────────────────────────

export async function getWvWMatchByWorld(worldId: number): Promise<WvWMatch> {
  const res = await gw2Api.get('/wvw/matches', {params: {world: worldId}});
  // API returns an array; find the match containing this world
  const matches: WvWMatch[] = Array.isArray(res.data) ? res.data : [res.data];
  const match = matches.find(m =>
    m.worlds.red === worldId ||
    m.worlds.blue === worldId ||
    m.worlds.green === worldId ||
    m.all_worlds.red.includes(worldId) ||
    m.all_worlds.blue.includes(worldId) ||
    m.all_worlds.green.includes(worldId),
  );
  if (!match) throw new Error(`No WvW match found for world ${worldId}`);
  return match;
}

export async function getWvWWorlds(ids?: number[]): Promise<WvWWorld[]> {
  const params = ids ? {ids: ids.join(',')} : {ids: 'all'};
  const res = await gw2Api.get('/worlds', {params});
  return res.data;
}

// ─── PvP ──────────────────────────────────────────────────────────────────────

export async function getPvPStats(): Promise<PvPStats> {
  const res = await gw2Api.get('/pvp/stats');
  return res.data;
}

export async function getPvPGames(): Promise<PvPGame[]> {
  const idsRes = await gw2Api.get('/pvp/games');
  const ids: string[] = idsRes.data;
  if (!Array.isArray(ids) || ids.length === 0) return [];
  // If the first item is already an object, the API returned full records directly
  if (typeof ids[0] === 'object') return ids as unknown as PvPGame[];
  const detailRes = await gw2Api.get('/pvp/games', {params: {ids: ids.join(',')}});
  return detailRes.data;
}

export async function getPvPStandings(): Promise<PvPStanding[]> {
  const res = await gw2Api.get('/pvp/standings');
  return res.data;
}

export async function getPvPSeasons(): Promise<{id: string; name: string; start: string; end: string; active: boolean; divisions: {name: string; flags: string[]; tiers: {points: number}[]}[]}[]> {
  const res = await gw2Api.get('/pvp/seasons?ids=all');
  return res.data;
}

// ─── WvW Abilities ────────────────────────────────────────────────────────────

export interface WvWAbilityRank {
  cost: number;
  effect: string;
}

export interface WvWAbility {
  id: number;
  name: string;
  description: string;
  icon: string;
  ranks: WvWAbilityRank[];
}

export interface AccountWvWAbility {
  id: number;
  rank: number;
}

export async function getWvWAbilities(): Promise<WvWAbility[]> {
  const res = await gw2Api.get('/wvw/abilities?ids=all');
  return res.data;
}

export async function getAccountWvWAbilities(): Promise<AccountWvWAbility[]> {
  const res = await gw2Api.get('/account/wvw/abilities');
  return res.data;
}

// ─── WvW Definitions ──────────────────────────────────────────────────────────

export interface WvWObjectiveDef {
  id: string;
  name: string;
  type: string;
  map_id: number;
  map_type: string;
  marker?: string;
  chat_link: string;
}

export interface WvWRankDef {
  id: number;
  title: string;
  min_rank: number;
}

export async function getWvWObjectiveDefs(): Promise<WvWObjectiveDef[]> {
  const res = await gw2Api.get('/wvw/objectives?ids=all');
  return res.data;
}

export async function getWvWRankDefs(): Promise<WvWRankDef[]> {
  const res = await gw2Api.get('/wvw/ranks?ids=all');
  return res.data;
}

// ─── PvP Rank Definitions ─────────────────────────────────────────────────────

export interface PvPRankDef {
  id: number;
  icon: string;
  icon_big: string;
  min_rank: number;
  max_rank?: number;
}

export async function getPvPRankDefs(): Promise<PvPRankDef[]> {
  const res = await gw2Api.get('/pvp/ranks?ids=all');
  return res.data;
}

