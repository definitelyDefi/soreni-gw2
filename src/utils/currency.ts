export function formatGold(copper: number): {
  gold: number;
  silver: number;
  copper: number;
} {
  const g = Math.floor(Math.abs(copper) / 10000);
  const s = Math.floor((Math.abs(copper) % 10000) / 100);
  const c = Math.abs(copper) % 100;
  return {gold: g, silver: s, copper: c};
}

export function formatGoldString(copper: number): string {
  const {gold, silver, copper: c} = formatGold(copper);
  const parts = [];
  if (gold > 0) parts.push(`${gold}g`);
  if (silver > 0) parts.push(`${silver}s`);
  if (c > 0 || parts.length === 0) parts.push(`${c}c`);
  return parts.join(' ');
}

export function copperToGold(copper: number): number {
  return copper / 10000;
}

export function goldToCopper(gold: number): number {
  return Math.round(gold * 10000);
}

export function formatProfit(
  buyPrice: number,
  sellPrice: number,
): {
  profit: number;
  profitAfterTax: number;
  roi: number;
} {
  const TAX = 0.15; // 15% trading post tax
  const profitAfterTax = Math.floor(sellPrice * (1 - TAX)) - buyPrice;
  const profit = sellPrice - buyPrice;
  const roi = buyPrice > 0 ? (profitAfterTax / buyPrice) * 100 : 0;
  return {profit, profitAfterTax, roi};
}
