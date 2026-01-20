import Dexie, { Table } from 'dexie';
import { Transaction } from '@/types';
import { Student, FeePlan } from '@/models/student';
import { AppSettings } from '@/types';

export class SchoolFinanceDB extends Dexie {
  transactions!: Table<Transaction, string>;
  students!: Table<Student, string>;
  feePlans!: Table<FeePlan, string>;
  settings!: Table<AppSettings, string>;

  constructor() {
    super('SchoolFinanceDB');
    
    this.version(1).stores({
      transactions: 'id, date, type, createdAt',
      settings: 'id',
    });

    this.version(2).stores({
      transactions: 'id, date, type, createdAt',
      students: 'id, admissionNo, className, academicYear, status, createdAt',
      feePlans: 'id, studentId, createdAt',
      settings: 'id',
    }).upgrade(async (tx) => {
      // Migration: Move existing data from idb-keyval to Dexie
      const { get } = await import('idb-keyval');
      const existingTransactions = await get<Transaction[]>('transactions');
      const existingSettings = await get<AppSettings>('settings');
      
      if (existingTransactions) {
        await tx.table('transactions').bulkAdd(existingTransactions);
      }
      if (existingSettings) {
        await tx.table('settings').put(existingSettings, 'main');
      }
    });
  }
}

export const db = new SchoolFinanceDB();

// Helper functions for backward compatibility
export async function getAllTransactions(): Promise<Transaction[]> {
  return await db.transactions.toArray();
}

export async function saveTransaction(transaction: Transaction): Promise<void> {
  await db.transactions.put(transaction);
}

export async function saveTransactions(transactions: Transaction[]): Promise<void> {
  await db.transactions.bulkPut(transactions);
}

export async function deleteTransaction(id: string): Promise<void> {
  await db.transactions.delete(id);
}

export async function getSettings(): Promise<AppSettings | undefined> {
  return await db.settings.get('main');
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await db.settings.put(settings, 'main');
}
