import gw2Api from './client';

export interface TPDelivery {
  coins: number;
  items: {id: number; count: number}[];
}

export interface TPTransaction {
  id: number;
  item_id: number;
  price: number;
  quantity: number;
  created: string;
  purchased?: string;
}

export async function getTPDelivery(): Promise<TPDelivery> {
  const res = await gw2Api.get('/commerce/delivery');
  return res.data;
}

export async function getTPCurrentBuys(): Promise<TPTransaction[]> {
  const res = await gw2Api.get('/commerce/transactions/current/buys');
  return res.data;
}

export async function getTPCurrentSells(): Promise<TPTransaction[]> {
  const res = await gw2Api.get('/commerce/transactions/current/sells');
  return res.data;
}

export async function getTPHistoryBuys(): Promise<TPTransaction[]> {
  const res = await gw2Api.get('/commerce/transactions/history/buys');
  return res.data;
}

export async function getTPHistorySells(): Promise<TPTransaction[]> {
  const res = await gw2Api.get('/commerce/transactions/history/sells');
  return res.data;
}
