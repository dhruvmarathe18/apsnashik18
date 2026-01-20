// Cascade delete utilities

import { Transaction, Student } from '@/types/school'

/**
 * Find all transactions related to a student
 */
export function findRelatedTransactions(
  transactions: Transaction[],
  studentId: string,
  admissionNo: string
): Transaction[] {
  return transactions.filter((t) => {
    // Fee collection transactions
    if (t.type === 'fee_collection') {
      if (t.studentId === studentId) return true
      if (t.admissionNo === admissionNo) return true
    }
    // Bus fee collection with matching student name
    if (t.type === 'bus_fee_collection') {
      // This is harder to match, but we can try by admission no if stored
      if (t.admissionNo === admissionNo) return true
    }
    return false
  })
}

/**
 * Get all transaction IDs that should be deleted when a student is deleted
 */
export function getTransactionIdsToDelete(
  transactions: Transaction[],
  studentId: string,
  admissionNo: string
): string[] {
  return findRelatedTransactions(transactions, studentId, admissionNo).map((t) => t.id)
}
