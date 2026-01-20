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
      // Bus fee collections don't have admissionNo, so we skip this check
      // They are matched by studentName which is handled separately
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
