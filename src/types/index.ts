export interface Character {
  name: string;
  race: string;
  gender: string;
  profession: string;
  level: number;
  age: number;
  created: string;
  deaths: number;
  crafting: CraftingDiscipline[];
}

export interface CraftingDiscipline {
  discipline: string;
  rating: number;
  active: boolean;
}

export interface Item {
  id: number;
  name: string;
  description?: string;
  type: string;
  rarity: string;
  level: number;
  icon?: string;
  vendor_value: number;
}

export interface InventorySlot {
  id: number;
  count: number;
  item?: Item;
}

export interface Price {
  id: number;
  buys: {quantity: number; unit_price: number};
  sells: {quantity: number; unit_price: number};
}

export interface Recipe {
  id: number;
  type: string;
  output_item_id: number;
  output_item_count: number;
  ingredients: RecipeIngredient[];
}

export interface RecipeIngredient {
  item_id: number;
  count: number;
}

export interface WorldBoss {
  id: string;
  name: string;
  schedule: number[]; // minutes from midnight UTC
  duration: number; // minutes
  mapName: string;
  waypoint?: string;
}

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

export type DailyCategory = 'pve' | 'pvp' | 'wvw' | 'fractals' | 'special';
export type WeeklyCategory = 'pve' | 'pvp' | 'wvw' | 'fractals' | 'special';

export const ALL_DAILY_CATEGORIES: DailyCategory[] = ['pve', 'pvp', 'wvw', 'fractals', 'special'];
export const ALL_WEEKLY_CATEGORIES: WeeklyCategory[] = ['pve', 'pvp', 'wvw', 'fractals', 'special'];

export const ALL_WIDGET_IDS = [
  'account',
  'wealth',
  'reset_countdown',
  'next_boss',
  'daily_checklist',
  'wizard_vault',
  'characters',
  'mastery',
  'tp_delivery',
  'wallet_history',
] as const;
export type WidgetId = (typeof ALL_WIDGET_IDS)[number];

export interface WidgetInfo {
  id: WidgetId;
  label: string;
  emoji: string;
  requiresApiKey: boolean;
}

export const WIDGET_CATALOG: WidgetInfo[] = [
  {id: 'account',         label: 'Account Summary',  emoji: '👤', requiresApiKey: true},
  {id: 'wealth',          label: 'Account Wealth',   emoji: '💰', requiresApiKey: true},
  {id: 'reset_countdown', label: 'Reset Timers',      emoji: '⏰', requiresApiKey: false},
  {id: 'next_boss',       label: 'World Boss Timer',  emoji: '🐉', requiresApiKey: false},
  {id: 'daily_checklist', label: 'Daily Checklist',   emoji: '✅', requiresApiKey: true},
  {id: 'wizard_vault',    label: "Wizard's Vault",    emoji: '🧙', requiresApiKey: true},
  {id: 'characters',      label: 'Characters',        emoji: '⚔️', requiresApiKey: true},
  {id: 'mastery',         label: 'Mastery Points',    emoji: '⭐', requiresApiKey: true},
  {id: 'tp_delivery',     label: 'TP Delivery Box',   emoji: '📦', requiresApiKey: true},
  {id: 'wallet_history',  label: 'Gold Trend',        emoji: '📈', requiresApiKey: true},
];

export const DEFAULT_WIDGETS: WidgetId[] = [
  'account', 'reset_countdown', 'next_boss', 'daily_checklist', 'wizard_vault',
];

export interface AppSettings {
  apiKey: string;
  notifications: boolean;
  notifyMinutesBefore: number;
  notifyEventIds: string[];
  dailyCategories: DailyCategory[];
  weeklyCategories: WeeklyCategory[];
  dashboardWidgets: WidgetId[];
}
export interface MetaStage {
  name: string;
  duration: number; // minutes
  type: 'preparation' | 'event' | 'boss' | 'reward';
}

export interface MetaEvent {
  id: string;
  name: string;
  schedule: number[];
  duration: number;
  mapName: string;
  category:
    | 'core'
    | 'ls1'
    | 'ls2'
    | 'ls3'
    | 'ls4'
    | 'ls5'
    | 'hot'
    | 'pof'
    | 'eod'
    | 'soto'
    | 'janthir';
  waypoint?: string;
  stages?: MetaStage[];
}
