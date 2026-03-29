import gw2Api from './client';
import {Item, InventorySlot, Price, Recipe} from '../types';

export async function getItems(ids: number[]): Promise<Item[]> {
  if (ids.length === 0) return [];
  const chunks = chunkArray(ids, 200);
  const results = await Promise.all(
    chunks.map(chunk =>
      gw2Api.get('/items', {params: {ids: chunk.join(',')}}).then(r => r.data),
    ),
  );
  return results.flat();
}

export async function getItem(id: number): Promise<Item> {
  const res = await gw2Api.get(`/items/${id}`);
  return res.data;
}

export async function getPrices(ids: number[]): Promise<Price[]> {
  if (ids.length === 0) return [];
  const chunks = chunkArray(ids, 200);
  const results = await Promise.all(
    chunks.map(chunk =>
      gw2Api
        .get('/commerce/prices', {params: {ids: chunk.join(',')}})
        .then(r => r.data),
    ),
  );
  return results.flat();
}

export async function getPrice(id: number): Promise<Price> {
  const res = await gw2Api.get(`/commerce/prices/${id}`);
  return res.data;
}

export async function getRecipe(id: number): Promise<Recipe> {
  const res = await gw2Api.get(`/recipes/${id}`);
  return res.data;
}

export async function searchRecipesByOutput(itemId: number): Promise<number[]> {
  const res = await gw2Api.get('/recipes/search', {
    params: {output: itemId},
  });
  return res.data;
}

export async function getRecipes(ids: number[]): Promise<Recipe[]> {
  if (ids.length === 0) return [];
  const chunks = chunkArray(ids, 200);
  const results = await Promise.all(
    chunks.map(chunk =>
      gw2Api
        .get('/recipes', {params: {ids: chunk.join(',')}})
        .then(r => r.data),
    ),
  );
  return results.flat();
}

export async function getBankContents(): Promise<(InventorySlot | null)[]> {
  const res = await gw2Api.get('/account/bank');
  return res.data;
}

export async function getMaterials() {
  const res = await gw2Api.get('/account/materials');
  return res.data;
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}
