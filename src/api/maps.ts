import gw2Api from './client';

export interface GW2MapBasic {
  id: number;
  name: string;
  type: string;
  min_level: number;
  max_level: number;
  default_floor: number;
  floors: number[];
  region_id: number;
  region_name: string;
  continent_id: number;
  continent_name: string;
  map_rect: [[number, number], [number, number]];
  continent_rect: [[number, number], [number, number]];
}

export interface MapObjective {
  id: number | string;
  name: string;
  type: 'waypoint' | 'poi' | 'vista' | 'task' | 'hero';
  coord: [number, number];
  chat_link?: string;
}

export interface ContinentMapDetail {
  id: number;
  name: string;
  min_level: number;
  max_level: number;
  continent_rect: [[number, number], [number, number]];
  objectives: MapObjective[];
}

export interface AchievementCategory {
  id: number;
  name: string;
  description: string;
  order: number;
  icon?: string;
  achievements: number[];
}

export interface AchievementBit {
  type: string;
  id?: number;
  text?: string;
}

export interface AchievementDef {
  id: number;
  name: string;
  requirement?: string;
  bits?: AchievementBit[];
}

export interface AccountAchievement {
  id: number;
  bits?: number[];
  current?: number;
  max?: number;
  done: boolean;
}

const CHUNK = 200;
function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

const PLAYABLE_TYPES = new Set(['Public', 'PublicMini']);

export async function getMaps(): Promise<GW2MapBasic[]> {
  const idsRes = await gw2Api.get('/maps');
  const ids: number[] = idsRes.data;
  const batches = chunk(ids, CHUNK);
  const results = await Promise.all(
    batches.map(b =>
      gw2Api.get('/maps', {params: {ids: b.join(',')}}).then(r => r.data),
    ),
  );
  return (results.flat() as GW2MapBasic[]).filter(
    m => PLAYABLE_TYPES.has(m.type) && m.continent_id === 1,
  );
}

export async function getContinentMapDetail(
  continentId: number,
  floorId: number,
  regionId: number,
  mapId: number,
): Promise<ContinentMapDetail> {
  const res = await gw2Api.get(
    `/continents/${continentId}/floors/${floorId}/regions/${regionId}/maps/${mapId}`,
  );
  const d = res.data;
  const objectives: MapObjective[] = [];

  if (d.points_of_interest) {
    for (const poi of Object.values(d.points_of_interest) as any[]) {
      if (!poi.coord) continue;
      const type: MapObjective['type'] =
        poi.type === 'waypoint'
          ? 'waypoint'
          : poi.type === 'vista'
          ? 'vista'
          : 'poi';
      objectives.push({
        id: poi.id,
        name: poi.name ?? '',
        type,
        coord: poi.coord,
        chat_link: poi.chat_link,
      });
    }
  }

  if (d.tasks) {
    for (const task of Object.values(d.tasks) as any[]) {
      if (!task.coord) continue;
      objectives.push({
        id: task.id,
        name: task.objective ?? `Task #${task.id}`,
        type: 'task',
        coord: task.coord,
        chat_link: task.chat_link,
      });
    }
  }

  if (d.skill_challenges) {
    for (let i = 0; i < (d.skill_challenges as any[]).length; i++) {
      const sc = d.skill_challenges[i] as any;
      if (!sc.coord) continue;
      objectives.push({
        id: sc.id ?? `hero_${i}`,
        name: 'Hero Challenge',
        type: 'hero',
        coord: sc.coord,
      });
    }
  }

  return {
    id: mapId,
    name: d.name,
    min_level: d.min_level,
    max_level: d.max_level,
    continent_rect: d.continent_rect,
    objectives,
  };
}

export async function getAchievementCategories(): Promise<AchievementCategory[]> {
  const idsRes = await gw2Api.get('/achievements/categories');
  const ids: number[] = idsRes.data;
  const batches = chunk(ids, CHUNK);
  const results = await Promise.all(
    batches.map(b =>
      gw2Api
        .get('/achievements/categories', {params: {ids: b.join(',')}})
        .then(r => r.data),
    ),
  );
  return results.flat();
}

export async function getAchievementDefs(ids: number[]): Promise<AchievementDef[]> {
  if (!ids.length) return [];
  const batches = chunk(ids, CHUNK);
  const results = await Promise.all(
    batches.map(b =>
      gw2Api
        .get('/achievements', {params: {ids: b.join(',')}})
        .then(r => r.data),
    ),
  );
  return results.flat();
}

export async function getAccountAchievements(): Promise<AccountAchievement[]> {
  const res = await gw2Api.get('/account/achievements');
  return res.data;
}
