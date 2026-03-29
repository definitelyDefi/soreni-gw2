import gw2Api from './client';

export interface DailyFractalAchievement {
  id: number;
  level?: {min: number; max: number};
}

export interface DailyAchievements {
  pve: {id: number}[];
  pvp: {id: number}[];
  wvw: {id: number}[];
  fractals: DailyFractalAchievement[];
}

export interface AchievementDef {
  id: number;
  name: string;
  description: string;
  requirement: string;
  type: string;
  flags: string[];
  icon?: string;
  tiers: {count: number; points: number}[];
  rewards?: {type: string; id: number; count: number}[];
}

export interface AccountAchievement {
  id: number;
  done: boolean;
  bits?: number[];
  current?: number;
  max?: number;
  repeated?: number;
}

export interface MasteryLevel {
  name: string;
  description: string;
  instruction: string;
  icon: string;
  point_cost: number;
  exp_cost: number;
}

export interface MasteryDef {
  id: number;
  name: string;
  requirement: string;
  order: number;
  background: string;
  region: string;
  levels: MasteryLevel[];
}

export interface AccountMastery {
  id: number;
  level: number;
}

export async function getDailyAchievements(): Promise<DailyAchievements> {
  const res = await gw2Api.get('/achievements/daily');
  return res.data;
}

export async function getAchievementDefs(ids: number[]): Promise<AchievementDef[]> {
  if (ids.length === 0) {return [];}
  const chunks: AchievementDef[] = [];
  for (let i = 0; i < ids.length; i += 200) {
    const batch = ids.slice(i, i + 200);
    const res = await gw2Api.get(`/achievements?ids=${batch.join(',')}`);
    chunks.push(...res.data);
  }
  return chunks;
}

export async function getAccountAchievements(): Promise<AccountAchievement[]> {
  const res = await gw2Api.get('/account/achievements');
  return res.data;
}

export async function getAllMasteries(): Promise<MasteryDef[]> {
  const res = await gw2Api.get('/masteries?ids=all');
  return res.data;
}

export async function getAccountMasteries(): Promise<AccountMastery[]> {
  const res = await gw2Api.get('/account/masteries');
  return res.data;
}
