import { get, set, del, clear, keys } from 'idb-keyval';
import { Transaction, AppSettings } from '@/types';
import { defaultSettings } from '@/utils/seedData';

const TRANSACTIONS_KEY = 'transactions';
const SETTINGS_KEY = 'settings';
const LAST_BACKUP_KEY = 'last_backup';

export class StorageService {
  // Transactions
  static async getAllTransactions(): Promise<Transaction[]> {
    const transactions = await get<Transaction[]>(TRANSACTIONS_KEY);
    return transactions || [];
  }

  static async saveTransaction(transaction: Transaction): Promise<void> {
    const transactions = await this.getAllTransactions();
    const index = transactions.findIndex((t) => t.id === transaction.id);
    if (index >= 0) {
      transactions[index] = transaction;
    } else {
      transactions.push(transaction);
    }
    await set(TRANSACTIONS_KEY, transactions);
  }

  static async saveTransactions(transactions: Transaction[]): Promise<void> {
    await set(TRANSACTIONS_KEY, transactions);
  }

  static async deleteTransaction(id: string): Promise<void> {
    const transactions = await this.getAllTransactions();
    const filtered = transactions.filter((t) => t.id !== id);
    await set(TRANSACTIONS_KEY, filtered);
  }

  static async clearAllTransactions(): Promise<void> {
    await del(TRANSACTIONS_KEY);
  }

  // Settings
  static async getSettings(): Promise<AppSettings> {
    const settings = await get<AppSettings>(SETTINGS_KEY);
    return settings || defaultSettings;
  }

  static async saveSettings(settings: AppSettings): Promise<void> {
    await set(SETTINGS_KEY, settings);
  }

  // Backup
  static async getLastBackupDate(): Promise<string | null> {
    return await get<string>(LAST_BACKUP_KEY) || null;
  }

  static async updateLastBackupDate(): Promise<void> {
    await set(LAST_BACKUP_KEY, new Date().toISOString());
  }

  // Clear all data
  static async clearAll(): Promise<void> {
    await clear();
  }
}
