import gw2Api from './client';

export interface Account {
  id: string;
  name: string;
  age: number;
  world: number;
  guilds: string[];
  guild_leader: string[];
  created: string;
  access: string[];
  commander: boolean;
  fractal_level: number;
  daily_ap: number;
  monthly_ap: number;
  wvw_rank: number;
}

export interface Wallet {
  id: number;
  value: number;
}

export interface WizardVaultObjective {
  id: number;
  title: string;
  track: string;
  acclaim: number;
  progress_current: number;
  progress_complete: number;
  claimed: boolean;
}

export interface WizardVaultData {
  meta_progress_current: number;
  meta_progress_complete: number;
  meta_reward_item_id: number;
  meta_reward_astral: number;
  meta_reward_claimed: boolean;
  objectives: WizardVaultObjective[];
}

export const CURRENCY_IDS = {
  GOLD: 1,
  KARMA: 2,
  LAURELS: 3,
  GEMS: 4,
  FRACTAL_RELICS: 7,
  PRISTINE_FRACTAL_RELICS: 24,
  SPIRIT_SHARDS: 23,
  ASTRAL_ACCLAIM: 32,
};

export interface PvpStats {
  pvp_rank: number;
  pvp_rank_points: number;
}

export async function getPvpStats(): Promise<PvpStats> {
  const res = await gw2Api.get('/pvp/stats');
  return res.data;
}

export async function getAccount(): Promise<Account> {
  const res = await gw2Api.get('/account');
  return res.data;
}

export async function getWallet(): Promise<Wallet[]> {
  const res = await gw2Api.get('/account/wallet');
  return res.data;
}

export async function getWizardVaultDaily(): Promise<WizardVaultData> {
  const res = await gw2Api.get('/account/wizardsvault/daily');
  return res.data;
}

export async function getWizardVaultWeekly(): Promise<WizardVaultData> {
  const res = await gw2Api.get('/account/wizardsvault/weekly');
  return res.data;
}

export async function getWizardVaultSeasonal(): Promise<WizardVaultData> {
  const res = await gw2Api.get('/account/wizardsvault/seasonal');
  return res.data;
}

export async function getRaids(): Promise<string[]> {
  const res = await gw2Api.get('/account/raids');
  return res.data;
}

export async function getDungeons(): Promise<string[]> {
  const res = await gw2Api.get('/account/dungeons');
  return res.data;
}

export async function getStrikeMissions(): Promise<string[]> {
  const res = await gw2Api.get('/account/strikes');
  return res.data;
}

export async function getHomeNodes(): Promise<string[]> {
  const res = await gw2Api.get('/account/home/nodes');
  return res.data;
}

export async function getMountSkins(): Promise<number[]> {
  const res = await gw2Api.get('/account/mounts/skins');
  return res.data;
}

export async function getAccountGliders(): Promise<number[]> {
  const res = await gw2Api.get('/account/gliders');
  return res.data;
}

export async function getAccountTitles(): Promise<number[]> {
  const res = await gw2Api.get('/account/titles');
  return res.data;
}

export async function getAccountEmotes(): Promise<string[]> {
  const res = await gw2Api.get('/account/emotes');
  return res.data;
}

export interface GemExchangeRate {
  quantity: number;
  coins_per_gem: number;
}

export async function getGemsForCoins(coins: number): Promise<GemExchangeRate> {
  const res = await gw2Api.get(`/commerce/exchange/coins?quantity=${coins}`);
  return res.data;
}

export async function getCoinsForGems(gems: number): Promise<GemExchangeRate> {
  const res = await gw2Api.get(`/commerce/exchange/gems?quantity=${gems}`);
  return res.data;
}
