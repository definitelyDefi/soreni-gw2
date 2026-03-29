import gw2Api from './client';
import {Character, InventorySlot} from '../types';

export async function getCharacters(): Promise<string[]> {
  const res = await gw2Api.get('/characters');
  return res.data;
}

export async function getCharacter(name: string): Promise<Character> {
  const res = await gw2Api.get(`/characters/${encodeURIComponent(name)}`);
  return res.data;
}

export async function getCharacterInventory(name: string): Promise<{
  bags: Array<{id: number; size: number; inventory: InventorySlot[]}>;
}> {
  const res = await gw2Api.get(
    `/characters/${encodeURIComponent(name)}/inventory`,
  );
  return res.data;
}

export async function getAllCharacters(): Promise<Character[]> {
  const names = await getCharacters();
  const characters = await Promise.all(names.map(name => getCharacter(name)));
  return characters;
}
export async function getCharacterEquipmentTabs(name: string) {
  const res = await gw2Api.get(
    `/characters/${encodeURIComponent(name)}/equipmenttabs?tabs=all`,
  );
  return res.data;
}

export async function getCharacterBuildTabs(name: string) {
  const res = await gw2Api.get(
    `/characters/${encodeURIComponent(name)}/buildtabs?tabs=all`,
  );
  return res.data;
}
