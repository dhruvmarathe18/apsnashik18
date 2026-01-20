'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Transaction, Student, FeePlan, AppSettings } from '@/types/school'
import { StorageService } from '@/lib/utils/storage'
import { generateUUID, getTodayISO } from '@/lib/utils/format'
import { transactionService, studentService, feePlanService, settingsService, busEntryService } from '@/lib/supabase/services'
import toast from 'react-hot-toast'

interface SchoolContextType {
  // Data
  transactions: Transaction[]
  students: Student[]
  feePlans: FeePlan[]
  settings: AppSettings
  isLoading: boolean

  // Transactions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void

  // Students
  addStudent: (student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Student>
  addStudentsBatch: (students: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>[], feePlans: Array<Omit<FeePlan, 'id' | 'createdAt' | 'updatedAt'> & { admissionNo: string }>) => Promise<{ students: Student[]; feePlans: FeePlan[] }>
  updateStudent: (id: string, updates: Partial<Student>) => void
  deleteStudent: (id: string) => void
  getStudentById: (id: string) => Student | undefined
  getStudentByAdmissionNo: (admissionNo: string) => Student | undefined

  // Fee Plans
  addFeePlan: (feePlan: Omit<FeePlan, 'id' | 'createdAt' | 'updatedAt'>) => Promise<FeePlan>
  updateFeePlan: (id: string, updates: Partial<FeePlan>) => void
  deleteFeePlan: (id: string) => void
  getFeePlanByStudentId: (studentId: string) => FeePlan | undefined

  // Settings
  updateSettings: (updates: Partial<AppSettings>) => void

  // Utilities
  refreshData: () => void
  resetAllData: () => Promise<void>
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined)

export function SchoolProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [feePlans, setFeePlans] = useState<FeePlan[]>([])
  const [settings, setSettings] = useState<AppSettings>(() => StorageService.getDefaultSettings() as AppSettings)
  const [isLoading, setIsLoading] = useState(true)

  const refreshData = async () => {
    setIsLoading(true)
    try {
      const [transactionsData, studentsData, feePlansData, settingsData] = await Promise.all([
        transactionService.getAll(),
        studentService.getAll(),
        feePlanService.getAll(),
        settingsService.get(),
      ])
      setTransactions(transactionsData)
      setStudents(studentsData)
      setFeePlans(feePlansData)
      setSettings(settingsData)
    } catch (error) {
      console.error('Error refreshing data:', error)
      // Fallback to localStorage
      setTransactions(StorageService.getAllTransactions())
      setStudents(StorageService.getAllStudents())
      setFeePlans(StorageService.getAllFeePlans())
      setSettings(StorageService.getSettings())
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshData()
  }, [])

  // Transaction methods
  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'createdAt'>) => {
    try {
      const transaction = await transactionService.create(transactionData)
      setTransactions((prev) => [transaction, ...prev])
    } catch (error) {
      console.error('Error adding transaction:', error)
      // Fallback to localStorage
      const transaction: Transaction = {
        ...transactionData,
        id: generateUUID(),
        createdAt: new Date().toISOString(),
      } as Transaction
      StorageService.saveTransaction(transaction)
      refreshData()
    }
  }

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      await transactionService.update(id, updates)
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } as Transaction : t))
      )
    } catch (error) {
      console.error('Error updating transaction:', error)
      // Fallback to localStorage
      const transactions = StorageService.getAllTransactions()
      const index = transactions.findIndex((t) => t.id === id)
      if (index >= 0) {
        transactions[index] = { ...transactions[index], ...updates }
        StorageService.saveTransactions(transactions)
        refreshData()
      }
    }
  }

  const deleteTransaction = async (id: string) => {
    try {
      await transactionService.delete(id)
      setTransactions((prev) => prev.filter((t) => t.id !== id))
    } catch (error) {
      console.error('Error deleting transaction:', error)
      // Fallback to localStorage
      StorageService.deleteTransaction(id)
      refreshData()
    }
  }

  // Student methods
  const addStudent = async (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Promise<Student> => {
    try {
      const student = await studentService.create(studentData)
      setStudents((prev) => [student, ...prev])
      return student
    } catch (error) {
      console.error('Error adding student:', error)
      // Fallback to localStorage
      const now = getTodayISO()
      const student: Student = {
        ...studentData,
        id: generateUUID(),
        createdAt: now,
        updatedAt: now,
      }
      StorageService.saveStudent(student)
      refreshData()
      return student
    }
  }

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    try {
      await studentService.update(id, updates)
      setStudents((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updates, updatedAt: getTodayISO() } : s))
      )
    } catch (error) {
      console.error('Error updating student:', error)
      // Fallback to localStorage
      const students = StorageService.getAllStudents()
      const index = students.findIndex((s) => s.id === id)
      if (index >= 0) {
        students[index] = {
          ...students[index],
          ...updates,
          updatedAt: getTodayISO(),
        }
        StorageService.saveStudents(students)
        refreshData()
      }
    }
  }

  const deleteStudent = async (id: string) => {
    try {
      const student = students.find((s) => s.id === id)
      if (!student) return

      // Delete all related transactions (fee collections, bus fees, etc.)
      const relatedTransactions = transactions.filter((t) => {
        if (t.type === 'fee_collection' && (t.studentId === id || t.admissionNo === student.admissionNo)) {
          return true
        }
        if (t.type === 'bus_fee_collection' && t.studentName === student.fullName) {
          return true
        }
        return false
      })

      // Delete all related transactions
      for (const transaction of relatedTransactions) {
        try {
          await transactionService.delete(transaction.id)
        } catch (error) {
          console.error(`Error deleting transaction ${transaction.id}:`, error)
        }
      }

      // Delete associated fee plan
      const feePlan = feePlans.find((p) => p.studentId === id)
      if (feePlan) {
        try {
          await feePlanService.delete(feePlan.id)
        } catch (error) {
          console.error('Error deleting fee plan:', error)
        }
      }

      // Finally delete the student (this will also trigger database CASCADE deletes)
      await studentService.delete(id)

      // Update local state
      setStudents((prev) => prev.filter((s) => s.id !== id))
      setFeePlans((prev) => prev.filter((p) => p.studentId !== id))
      setTransactions((prev) => prev.filter((t) => {
        if (t.type === 'fee_collection' && (t.studentId === id || t.admissionNo === student.admissionNo)) {
          return false
        }
        return true
      }))

      toast.success('Student and all related data deleted successfully')
    } catch (error) {
      console.error('Error deleting student:', error)
      // Fallback to localStorage
      const student = students.find((s) => s.id === id)
      if (student) {
        // Delete related transactions
        const relatedTransactions = transactions.filter((t) => {
          if (t.type === 'fee_collection' && (t.studentId === id || t.admissionNo === student.admissionNo)) {
            return true
          }
          return false
        })
        relatedTransactions.forEach((t) => StorageService.deleteTransaction(t.id))

        // Delete fee plan
        const feePlan = feePlans.find((p) => p.studentId === id)
        if (feePlan) {
          StorageService.deleteFeePlan(feePlan.id)
        }

        // Delete student
        StorageService.deleteStudent(id)
        refreshData()
        toast.success('Student and all related data deleted successfully')
      }
    }
  }

  const getStudentById = (id: string) => {
    return students.find((s) => s.id === id)
  }

  const getStudentByAdmissionNo = (admissionNo: string) => {
    return students.find((s) => s.admissionNo === admissionNo)
  }

  // Batch add students with fee plans
  const addStudentsBatch = async (
    studentsData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>[],
    feePlansData: Array<Omit<FeePlan, 'id' | 'createdAt' | 'updatedAt'> & { admissionNo: string }>
  ): Promise<{ students: Student[]; feePlans: FeePlan[] }> => {
    try {
      // Create students batch
      const createdStudents = await studentService.createBatch(studentsData)
      setStudents((prev) => [...createdStudents, ...prev])

      // Match fee plans with students by admission number and create batch
      const feePlansToCreate: Omit<FeePlan, 'id' | 'createdAt' | 'updatedAt'>[] = []
      
      for (const feePlanData of feePlansData) {
        // Find the corresponding student by admission number
        const matchingStudent = createdStudents.find((s) => s.admissionNo === feePlanData.admissionNo)
        
        if (matchingStudent) {
          const { admissionNo, ...feePlanWithoutAdmissionNo } = feePlanData
          feePlansToCreate.push({
            ...feePlanWithoutAdmissionNo,
            studentId: matchingStudent.id,
          })
        }
      }
      
      // Create fee plans batch
      const createdFeePlans = await feePlanService.createBatch(feePlansToCreate)
      setFeePlans((prev) => [...createdFeePlans, ...prev])
      
      toast.success(`Successfully added ${createdStudents.length} students with ${createdFeePlans.length} fee plans`)
      
      return { students: createdStudents, feePlans: createdFeePlans }
    } catch (error: any) {
      console.error('Error adding students batch:', error)
      toast.error(error.message || 'Failed to add students batch')
      throw error
    }
  }

  // Fee Plan methods
  const addFeePlan = async (feePlanData: Omit<FeePlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<FeePlan> => {
    try {
      const feePlan = await feePlanService.create(feePlanData)
      setFeePlans((prev) => [...prev, feePlan])
      return feePlan
    } catch (error) {
      console.error('Error adding fee plan:', error)
      // Fallback to localStorage
      const now = getTodayISO()
      const feePlan: FeePlan = {
        ...feePlanData,
        id: generateUUID(),
        createdAt: now,
        updatedAt: now,
      }
      StorageService.saveFeePlan(feePlan)
      refreshData()
      return feePlan
    }
  }

  const updateFeePlan = async (id: string, updates: Partial<FeePlan>) => {
    try {
      await feePlanService.update(id, updates)
      setFeePlans((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: getTodayISO() } : p))
      )
    } catch (error) {
      console.error('Error updating fee plan:', error)
      // Fallback to localStorage
      const feePlans = StorageService.getAllFeePlans()
      const index = feePlans.findIndex((p) => p.id === id)
      if (index >= 0) {
        feePlans[index] = {
          ...feePlans[index],
          ...updates,
          updatedAt: getTodayISO(),
        }
        StorageService.saveFeePlans(feePlans)
        refreshData()
      }
    }
  }

  const deleteFeePlan = async (id: string) => {
    try {
      await feePlanService.delete(id)
      setFeePlans((prev) => prev.filter((p) => p.id !== id))
    } catch (error) {
      console.error('Error deleting fee plan:', error)
      // Fallback to localStorage
      StorageService.deleteFeePlan(id)
      refreshData()
    }
  }

  const getFeePlanByStudentId = (studentId: string) => {
    return feePlans.find((p) => p.studentId === studentId)
  }

  // Settings methods
  const updateSettings = async (updates: Partial<AppSettings>) => {
    try {
      await settingsService.update(updates)
      setSettings((prev) => ({ ...prev, ...updates }))
    } catch (error) {
      console.error('Error updating settings:', error)
      // Fallback to localStorage
      const newSettings = { ...settings, ...updates }
      StorageService.saveSettings(newSettings)
      setSettings(newSettings)
    }
  }

  const resetAllData = async () => {
    try {
      // Delete all transactions first (to avoid foreign key constraints)
      await transactionService.deleteAll()
      
      // Delete all bus entries
      await busEntryService.deleteAll()
      
      // Delete all students (this will cascade delete fee plans)
      await studentService.deleteAll()
      
      // Delete all fee plans (in case cascade didn't work)
      await feePlanService.deleteAll()
      
      // Clear localStorage as well
      StorageService.clearAll()
      
      // Refresh data to update UI
      await refreshData()
      
      toast.success('All data has been reset successfully')
    } catch (error) {
      console.error('Error resetting data:', error)
      toast.error('Failed to reset all data. Please try again.')
      throw error
    }
  }

  const value: SchoolContextType = {
    transactions,
    students,
    feePlans,
    settings,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addStudent,
    addStudentsBatch,
    updateStudent,
    deleteStudent,
    getStudentById,
    getStudentByAdmissionNo,
    addFeePlan,
    updateFeePlan,
    deleteFeePlan,
    getFeePlanByStudentId,
    updateSettings,
    refreshData,
    resetAllData,
  }

  return <SchoolContext.Provider value={value}>{children}</SchoolContext.Provider>
}

export function useSchool() {
  const context = useContext(SchoolContext)
  if (!context) {
    throw new Error('useSchool must be used within SchoolProvider')
  }
  return context
}
