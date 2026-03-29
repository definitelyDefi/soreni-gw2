import gw2Api from './client';

export async function getSpecializations(ids: number[]) {
  if (!ids.length) return [];
  const res = await gw2Api.get('/specializations', {
    params: {ids: ids.join(',')},
  });
  return res.data;
}

export async function getTraits(ids: number[]) {
  if (!ids.length) return [];
  const res = await gw2Api.get('/traits', {params: {ids: ids.join(',')}});
  return res.data;
}

export async function getSkills(ids: number[]) {
  if (!ids.length) return [];
  const res = await gw2Api.get('/skills', {params: {ids: ids.join(',')}});
  return res.data;
}
