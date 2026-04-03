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
  TRANSMUTATION_CHARGES: 18,
  RESEARCH_NOTES: 61,
  ASTRAL_ACCLAIM: 63,
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

// Mastery Score = total earned mastery points across all regions.
// Sourced from account.mastery_points.totals (requires progression scope).
// Falls back to summing completed levels from /account/masteries.
export async function getMasteryRank(): Promise<number> {
  const res = await gw2Api.get('/account');
  const totals: {region: string; earned: number; spent: number}[] =
    res.data?.mastery_points?.totals ?? [];

  if (totals.length > 0) {
    return totals.reduce((sum, t) => sum + (t.earned ?? 0), 0);
  }

  // Fallback: sum completed levels if progression scope unavailable
  const fallback = await gw2Api.get('/account/masteries');
  const masteries: {id: number; level: number}[] = fallback.data ?? [];
  return masteries.reduce((sum, m) => sum + (m.level ?? 0), 0);
}

// Returns the true total AP by summing completed achievement tier points.
// Caches well — AP changes infrequently.
export async function getTotalAP(): Promise<number> {
  // Step 1: fetch all account achievement progress
  const progressRes = await gw2Api.get('/account/achievements');
  const progress: {id: number; current: number; done: boolean}[] = progressRes.data;
  if (!progress?.length) return 0;

  // Step 2: batch-fetch achievement definitions (max 200 per request)
  const ids = progress.map(p => p.id);
  const chunks: number[][] = [];
  for (let i = 0; i < ids.length; i += 200) chunks.push(ids.slice(i, i + 200));
  const defResults = await Promise.all(
    chunks.map(chunk =>
      gw2Api.get('/achievements', {params: {ids: chunk.join(',')}}).then(r => r.data).catch(() => []),
    ),
  );
  const defs = new Map<number, {tiers: {count: number; points: number}[]}>();
  defResults.flat().forEach((d: any) => defs.set(d.id, d));

  // Step 3: sum earned points per achievement
  let total = 0;
  for (const p of progress) {
    const def = defs.get(p.id);
    if (!def?.tiers?.length) continue;
    if (p.done) {
      // Completed — earn all tier points
      total += def.tiers.reduce((s, t) => s + t.points, 0);
    } else {
      // In-progress — earn points for each tier whose threshold is met
      for (const tier of def.tiers) {
        if (p.current >= tier.count) total += tier.points;
        else break;
      }
    }
  }
  return total;
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
