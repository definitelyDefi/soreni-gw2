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

export interface AppSettings {
  apiKey: string;
  notifications: boolean;
  notifyMinutesBefore: number;
  notifyEventIds: string[]; // individual boss/event IDs to notify for
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
