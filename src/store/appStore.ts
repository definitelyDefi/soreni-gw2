import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppSettings} from '../types';
import {WORLD_BOSSES, META_EVENTS} from '../constants/worldBosses';

export const ALL_EVENT_IDS: string[] = [
  ...WORLD_BOSSES.map(b => b.id),
  ...META_EVENTS.map(e => e.id),
];

export interface TPWatchlistItem {
  itemId: number;
  itemName: string;
  icon?: string;
  rarity?: string;
  targetBuyPrice?: number;   // copper — alert when buy price drops below this
  targetSellPrice?: number;  // copper — alert when sell price rises above this
}

interface AppState {
  settings: AppSettings;
  isLoading: boolean;
  tpWatchlist: TPWatchlistItem[];
  setApiKey: (key: string) => Promise<void>;
  setNotifications: (enabled: boolean) => Promise<void>;
  setNotifyMinutesBefore: (minutes: number) => Promise<void>;
  setNotifyEventIds: (ids: string[]) => Promise<void>;
  loadSettings: () => Promise<void>;
  addToWatchlist: (item: TPWatchlistItem) => Promise<void>;
  updateWatchlistItem: (itemId: number, patch: Partial<TPWatchlistItem>) => Promise<void>;
  removeFromWatchlist: (itemId: number) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  settings: {
    apiKey: '',
    notifications: true,
    notifyMinutesBefore: 15,
    notifyEventIds: ALL_EVENT_IDS,
  },
  isLoading: false,
  tpWatchlist: [],

  setApiKey: async (key: string) => {
    await AsyncStorage.setItem('apiKey', key);
    set(state => ({settings: {...state.settings, apiKey: key}}));
  },

  setNotifications: async (enabled: boolean) => {
    set(state => ({settings: {...state.settings, notifications: enabled}}));
    await AsyncStorage.setItem('notifications', JSON.stringify(enabled));
    if (enabled) {
      const {scheduleAllBossNotifications} = await import('../services/notifications');
      await scheduleAllBossNotifications();
    } else {
      const {cancelAllNotifications} = await import('../services/notifications');
      await cancelAllNotifications();
    }
  },

  setNotifyMinutesBefore: async (minutes: number) => {
    set(state => ({settings: {...state.settings, notifyMinutesBefore: minutes}}));
    await AsyncStorage.setItem('notifyMinutesBefore', String(minutes));
    const {settings} = get();
    if (settings.notifications) {
      const {scheduleAllBossNotifications} = await import('../services/notifications');
      await scheduleAllBossNotifications();
    }
  },

  setNotifyEventIds: async (ids: string[]) => {
    set(state => ({settings: {...state.settings, notifyEventIds: ids}}));
    await AsyncStorage.setItem('notifyEventIds', JSON.stringify(ids));
    const {settings} = get();
    if (settings.notifications) {
      const {scheduleAllBossNotifications} = await import('../services/notifications');
      await scheduleAllBossNotifications();
    }
  },

  loadSettings: async () => {
    set({isLoading: true});
    try {
      const [apiKey, notifications, notifyMinutesBefore, notifyEventIds, tpWatchlist] =
        await Promise.all([
          AsyncStorage.getItem('apiKey'),
          AsyncStorage.getItem('notifications'),
          AsyncStorage.getItem('notifyMinutesBefore'),
          AsyncStorage.getItem('notifyEventIds'),
          AsyncStorage.getItem('tpWatchlist'),
        ]);
      set(state => ({
        settings: {
          ...state.settings,
          apiKey: apiKey ?? '',
          notifications: notifications !== null ? JSON.parse(notifications) : true,
          notifyMinutesBefore: notifyMinutesBefore ? parseInt(notifyMinutesBefore) : 15,
          notifyEventIds: notifyEventIds ? JSON.parse(notifyEventIds) : ALL_EVENT_IDS,
        },
        tpWatchlist: tpWatchlist ? JSON.parse(tpWatchlist) : [],
      }));
    } catch (e) {
      console.error('Failed to load settings', e);
    } finally {
      set({isLoading: false});
    }
  },

  addToWatchlist: async (item: TPWatchlistItem) => {
    const current = get().tpWatchlist;
    if (current.find(w => w.itemId === item.itemId)) {return;}
    const updated = [...current, item];
    set({tpWatchlist: updated});
    await AsyncStorage.setItem('tpWatchlist', JSON.stringify(updated));
  },

  updateWatchlistItem: async (itemId: number, patch: Partial<TPWatchlistItem>) => {
    const updated = get().tpWatchlist.map(w =>
      w.itemId === itemId ? {...w, ...patch} : w,
    );
    set({tpWatchlist: updated});
    await AsyncStorage.setItem('tpWatchlist', JSON.stringify(updated));
  },

  removeFromWatchlist: async (itemId: number) => {
    const updated = get().tpWatchlist.filter(w => w.itemId !== itemId);
    set({tpWatchlist: updated});
    await AsyncStorage.setItem('tpWatchlist', JSON.stringify(updated));
  },
}));
