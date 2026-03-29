import {useQuery} from '@tanstack/react-query';
import {getAccount, getWallet, getPvpStats, getWizardVaultDaily, getWizardVaultWeekly, getRaids, getDungeons, getStrikeMissions, getHomeNodes, getMountSkins, getAccountGliders, getAccountTitles, getAccountEmotes, getGemsForCoins, getCoinsForGems} from '../api/account';
import {getDailyAchievements, getAllMasteries, getAccountMasteries} from '../api/fractals';
import {getGuild, getGuildTreasury, getGuildLog, getGuildMembers} from '../api/guild';
import {getAllCharacters, getCharacter, getCharacterInventory, getCharacterEquipmentTabs, getCharacterBuildTabs} from '../api/characters';
import {getItems, getPrices, getBankContents, getMaterials} from '../api/items';
import {getSpecializations, getTraits, getSkills} from '../api/skills';
import {getMaps, getContinentMapDetail, getAchievementCategories, getAchievementDefs, getAccountAchievements} from '../api/maps';
import {getTPDelivery, getTPCurrentBuys, getTPCurrentSells, getTPHistoryBuys, getTPHistorySells} from '../api/tradingpost';
import {getWvWMatchByWorld, getWvWWorlds, getWvWAbilities, getAccountWvWAbilities, getPvPStats as getPvPStatsFull, getPvPGames, getPvPStandings, getPvPSeasons, getWvWObjectiveDefs, getWvWRankDefs, getPvPRankDefs} from '../api/wvw';
import {aggregateAllInventory, buildCombinedPlan} from '../api/legendary';
import {useAppStore} from '../store/appStore';

export function useAllInventory() {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['all_inventory'], queryFn: aggregateAllInventory, enabled: !!apiKey, staleTime: 5*60*1000});
}

export function useLegendaryPlan(itemIds: number[]) {
  const apiKey = useAppStore(s => s.settings.apiKey);
  const {data: inventory, isSuccess: invReady} = useAllInventory();
  return useQuery({queryKey: ['legendary_plan', itemIds.slice().sort().join(',')], queryFn: () => buildCombinedPlan(itemIds, inventory ?? new Map()), enabled: !!apiKey && itemIds.length > 0 && invReady, staleTime: 15*60*1000});
}

export function useAccount() {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['account'], queryFn: getAccount, enabled: !!apiKey, staleTime: 5*60*1000});
}

export function useWallet() {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['wallet'], queryFn: getWallet, enabled: !!apiKey, staleTime: 5*60*1000});
}

export function usePvpStats() {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['pvp_stats'], queryFn: getPvpStats, enabled: !!apiKey, staleTime: 30*60*1000});
}

export function useWizardVaultDaily() {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['wizard_vault_daily'], queryFn: getWizardVaultDaily, enabled: !!apiKey, staleTime: 5*60*1000});
}

export function useWizardVaultWeekly() {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['wizard_vault_weekly'], queryFn: getWizardVaultWeekly, enabled: !!apiKey, staleTime: 5*60*1000});
}

export function useCharacters() {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['characters'], queryFn: getAllCharacters, enabled: !!apiKey, staleTime: 10*60*1000});
}

export function useCharacter(name: string) {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['character', name], queryFn: () => getCharacter(name), enabled: !!apiKey && !!name, staleTime: 10*60*1000});
}

export function useCharacterInventory(name: string) {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['character_inventory', name], queryFn: () => getCharacterInventory(name), enabled: !!apiKey && !!name, staleTime: 5*60*1000});
}

export function useCharacterEquipment(name: string) {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['character_equipment', name], queryFn: () => getCharacterEquipmentTabs(name), enabled: !!apiKey && !!name, staleTime: 5*60*1000});
}

export function useCharacterBuilds(name: string) {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['character_builds', name], queryFn: () => getCharacterBuildTabs(name), enabled: !!apiKey && !!name, staleTime: 5*60*1000});
}

export function useBank() {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['bank'], queryFn: getBankContents, enabled: !!apiKey, staleTime: 5*60*1000});
}

export function useMaterials() {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['materials'], queryFn: getMaterials, enabled: !!apiKey, staleTime: 5*60*1000});
}

export function useItemPrices(ids: number[]) {
  return useQuery({queryKey: ['prices', ids], queryFn: () => getPrices(ids), enabled: ids.length > 0, staleTime: 2*60*1000});
}

export function useItems(ids: number[]) {
  return useQuery({queryKey: ['items', ids], queryFn: () => getItems(ids), enabled: ids.length > 0, staleTime: 60*60*1000});
}

export function useSpecializations(ids: number[]) {
  return useQuery({queryKey: ['specializations', ids], queryFn: () => getSpecializations(ids), enabled: ids.length > 0, staleTime: 60*60*1000});
}

export function useTraits(ids: number[]) {
  return useQuery({queryKey: ['traits', ids], queryFn: () => getTraits(ids), enabled: ids.length > 0, staleTime: 60*60*1000});
}

export function useSkills(ids: number[]) {
  return useQuery({queryKey: ['skills', ids], queryFn: () => getSkills(ids), enabled: ids.length > 0, staleTime: 60*60*1000});
}

export function useMaps() {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['maps_list'], queryFn: getMaps, enabled: !!apiKey, staleTime: 60*60*1000});
}

export function useContinentMapDetail(continentId: number, floorId: number, regionId: number, mapId: number) {
  return useQuery({queryKey: ['continent_map', continentId, floorId, regionId, mapId], queryFn: () => getContinentMapDetail(continentId, floorId, regionId, mapId), enabled: mapId > 0 && regionId > 0 && floorId > 0, staleTime: 60*60*1000});
}

export function useAchievementCategories() {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['achievement_categories'], queryFn: getAchievementCategories, enabled: !!apiKey, staleTime: 24*60*60*1000});
}

export function useAchievementDefs(ids: number[]) {
  return useQuery({queryKey: ['achievement_defs', ids], queryFn: () => getAchievementDefs(ids), enabled: ids.length > 0, staleTime: 24*60*60*1000});
}

export function useAccountAchievements() {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['account_achievements'], queryFn: getAccountAchievements, enabled: !!apiKey, staleTime: 5*60*1000});
}

export function useDailyAchievements() {
  return useQuery({queryKey: ['daily_achievements'], queryFn: getDailyAchievements, staleTime: 10*60*1000});
}

export function useMasteries() {
  return useQuery({queryKey: ['masteries_all'], queryFn: getAllMasteries, staleTime: 24*60*60*1000});
}

export function useAccountMasteries() {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['account_masteries'], queryFn: getAccountMasteries, enabled: !!apiKey, staleTime: 10*60*1000});
}

export function useGuild(id: string | null) {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['guild', id], queryFn: () => getGuild(id!), enabled: !!apiKey && !!id, staleTime: 10*60*1000});
}

export function useGuildTreasury(id: string | null) {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['guild_treasury', id], queryFn: () => getGuildTreasury(id!), enabled: !!apiKey && !!id, staleTime: 5*60*1000});
}

export function useGuildLog(id: string | null) {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['guild_log', id], queryFn: () => getGuildLog(id!), enabled: !!apiKey && !!id, staleTime: 5*60*1000});
}

export function useGuildMembers(id: string | null) {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['guild_members', id], queryFn: () => getGuildMembers(id!), enabled: !!apiKey && !!id, staleTime: 5*60*1000});
}

export function useTPDelivery() {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['tp_delivery'], queryFn: getTPDelivery, enabled: !!apiKey, staleTime: 2*60*1000});
}

export function useTPCurrentBuys() {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['tp_current_buys'], queryFn: getTPCurrentBuys, enabled: !!apiKey, staleTime: 2*60*1000});
}

export function useTPCurrentSells() {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['tp_current_sells'], queryFn: getTPCurrentSells, enabled: !!apiKey, staleTime: 2*60*1000});
}

export function useTPHistoryBuys() {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['tp_history_buys'], queryFn: getTPHistoryBuys, enabled: !!apiKey, staleTime: 5*60*1000});
}

export function useTPHistorySells() {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['tp_history_sells'], queryFn: getTPHistorySells, enabled: !!apiKey, staleTime: 5*60*1000});
}

export function useWvWMatch() {
  const apiKey = useAppStore(s => s.settings.apiKey);
  const {data: account} = useAccount();
  return useQuery({queryKey: ['wvw_match', account?.world], queryFn: () => getWvWMatchByWorld(account!.world), enabled: !!apiKey && !!account?.world, staleTime: 2*60*1000, refetchInterval: 2*60*1000});
}

export function useWvWWorlds() {
  return useQuery({queryKey: ['wvw_worlds_all'], queryFn: () => getWvWWorlds(), staleTime: 60*60*1000});
}

export function useWvWAbilities() {
  return useQuery({queryKey: ['wvw_abilities'], queryFn: getWvWAbilities, staleTime: 24*60*60*1000});
}

export function useAccountWvWAbilities() {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['account_wvw_abilities'], queryFn: getAccountWvWAbilities, enabled: !!apiKey, staleTime: 10*60*1000});
}

export function useWvWObjectiveDefs() {
  return useQuery({queryKey: ['wvw_objective_defs'], queryFn: getWvWObjectiveDefs, staleTime: 24*60*60*1000});
}

export function useWvWRankDefs() {
  return useQuery({queryKey: ['wvw_rank_defs'], queryFn: getWvWRankDefs, staleTime: 24*60*60*1000});
}

export function usePvPStatsFull() {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['pvp_stats_full'], queryFn: getPvPStatsFull, enabled: !!apiKey, staleTime: 10*60*1000});
}

export function usePvPGames() {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['pvp_games'], queryFn: getPvPGames, enabled: !!apiKey, staleTime: 5*60*1000});
}

export function usePvPStandings() {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['pvp_standings'], queryFn: getPvPStandings, enabled: !!apiKey, staleTime: 10*60*1000});
}

export function usePvPSeasons() {
  return useQuery({queryKey: ['pvp_seasons'], queryFn: getPvPSeasons, staleTime: 24*60*60*1000});
}

export function usePvPRankDefs() {
  return useQuery({queryKey: ['pvp_rank_defs'], queryFn: getPvPRankDefs, staleTime: 24*60*60*1000});
}

export function useRaids() {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['account_raids'], queryFn: getRaids, enabled: !!apiKey, staleTime: 5*60*1000});
}

export function useDungeons() {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['account_dungeons'], queryFn: getDungeons, enabled: !!apiKey, staleTime: 5*60*1000});
}

export function useStrikeMissions() {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['account_strikes'], queryFn: getStrikeMissions, enabled: !!apiKey, staleTime: 5*60*1000});
}

export function useHomeNodes() {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['home_nodes'], queryFn: getHomeNodes, enabled: !!apiKey, staleTime: 5*60*1000});
}

export function useMountSkins() {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['mount_skins'], queryFn: getMountSkins, enabled: !!apiKey, staleTime: 30*60*1000});
}

export function useAccountGliders() {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['account_gliders'], queryFn: getAccountGliders, enabled: !!apiKey, staleTime: 30*60*1000});
}

export function useAccountTitles() {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['account_titles'], queryFn: getAccountTitles, enabled: !!apiKey, staleTime: 30*60*1000});
}

export function useAccountEmotes() {
  const apiKey = useAppStore(s => s.settings.apiKey);
  return useQuery({queryKey: ['account_emotes'], queryFn: getAccountEmotes, enabled: !!apiKey, staleTime: 30*60*1000});
}

export function useGemsForCoins(coins: number) {
  return useQuery({queryKey: ['gems_for_coins', coins], queryFn: () => getGemsForCoins(coins), enabled: coins > 0, staleTime: 2*60*1000, refetchInterval: 5*60*1000});
}

export function useCoinsForGems(gems: number) {
  return useQuery({queryKey: ['coins_for_gems', gems], queryFn: () => getCoinsForGems(gems), enabled: gems > 0, staleTime: 2*60*1000, refetchInterval: 5*60*1000});
}
