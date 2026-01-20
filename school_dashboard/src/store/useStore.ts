import { create } from 'zustand';
import { Transaction, AppSettings } from '@/types';
import { db } from '@/services/database';
import { seedTransactions, defaultSettings } from '@/utils/seedData';

interface StoreState {
  transactions: Transaction[];
  settings: AppSettings;
  isLoading: boolean;
  isDemoMode: boolean;
  
  // Actions
  loadData: () => Promise<void>;
  addTransaction: (transaction: Transaction) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  setSettings: (settings: AppSettings) => Promise<void>;
  loadDemoData: () => Promise<void>;
  clearAllData: () => Promise<void>;
  toggleDemoMode: () => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  transactions: [],
  settings: defaultSettings,
  isLoading: true,
  isDemoMode: false,

  loadData: async () => {
    set({ isLoading: true });
    try {
      const [transactions, settings] = await Promise.all([
        db.transactions.toArray(),
        db.settings.get('main'),
      ]);
      set({
        transactions: transactions || [],
        settings: settings || defaultSettings,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading data:', error);
      set({ isLoading: false });
    }
  },

  addTransaction: async (transaction: Transaction) => {
    await db.transactions.put(transaction);
    const transactions = await db.transactions.toArray();
    set({ transactions });
  },

  updateTransaction: async (transaction: Transaction) => {
    await db.transactions.put(transaction);
    const transactions = await db.transactions.toArray();
    set({ transactions });
  },

  deleteTransaction: async (id: string) => {
    await db.transactions.delete(id);
    const transactions = await db.transactions.toArray();
    set({ transactions });
  },

  setSettings: async (settings: AppSettings) => {
    await db.settings.put(settings, 'main');
    set({ settings });
  },

  loadDemoData: async () => {
    await db.transactions.bulkPut(seedTransactions);
    await db.settings.put(defaultSettings, 'main');
    set({ transactions: seedTransactions, settings: defaultSettings, isDemoMode: true });
  },

  clearAllData: async () => {
    await db.transactions.clear();
    await db.students.clear();
    await db.feePlans.clear();
    await db.settings.put(defaultSettings, 'main');
    set({ transactions: [], settings: defaultSettings, isDemoMode: false });
  },

  toggleDemoMode: async () => {
    const { isDemoMode } = get();
    if (!isDemoMode) {
      await get().loadDemoData();
    } else {
      await get().clearAllData();
      await get().loadData();
    }
  },
}));
