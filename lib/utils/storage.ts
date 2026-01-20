// Storage utilities using localStorage

const STORAGE_KEYS = {
  TRANSACTIONS: 'school_transactions',
  STUDENTS: 'school_students',
  FEE_PLANS: 'school_fee_plans',
  SETTINGS: 'school_settings',
  TRANSPORT_DATA: 'schoolTransportData', // For BUS management
} as const

export class StorageService {
  // Transactions
  static getAllTransactions(): any[] {
    if (typeof window === 'undefined') return []
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error reading transactions:', error)
      return []
    }
  }

  static saveTransaction(transaction: any): void {
    const transactions = this.getAllTransactions()
    const index = transactions.findIndex((t) => t.id === transaction.id)
    if (index >= 0) {
      transactions[index] = transaction
    } else {
      transactions.push(transaction)
    }
    this.saveTransactions(transactions)
  }

  static saveTransactions(transactions: any[]): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions))
    } catch (error) {
      console.error('Error saving transactions:', error)
    }
  }

  static deleteTransaction(id: string): void {
    const transactions = this.getAllTransactions()
    const filtered = transactions.filter((t) => t.id !== id)
    this.saveTransactions(filtered)
  }

  // Students
  static getAllStudents(): any[] {
    if (typeof window === 'undefined') return []
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENTS)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error reading students:', error)
      return []
    }
  }

  static saveStudent(student: any): void {
    const students = this.getAllStudents()
    const index = students.findIndex((s) => s.id === student.id)
    if (index >= 0) {
      students[index] = student
    } else {
      students.push(student)
    }
    this.saveStudents(students)
  }

  static saveStudents(students: any[]): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students))
    } catch (error) {
      console.error('Error saving students:', error)
    }
  }

  static deleteStudent(id: string): void {
    const students = this.getAllStudents()
    const filtered = students.filter((s) => s.id !== id)
    this.saveStudents(filtered)
  }

  // Fee Plans
  static getAllFeePlans(): any[] {
    if (typeof window === 'undefined') return []
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FEE_PLANS)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error reading fee plans:', error)
      return []
    }
  }

  static saveFeePlan(feePlan: any): void {
    const feePlans = this.getAllFeePlans()
    const index = feePlans.findIndex((p) => p.id === feePlan.id)
    if (index >= 0) {
      feePlans[index] = feePlan
    } else {
      feePlans.push(feePlan)
    }
    this.saveFeePlans(feePlans)
  }

  static saveFeePlans(feePlans: any[]): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEYS.FEE_PLANS, JSON.stringify(feePlans))
    } catch (error) {
      console.error('Error saving fee plans:', error)
    }
  }

  static deleteFeePlan(id: string): void {
    const feePlans = this.getAllFeePlans()
    const filtered = feePlans.filter((p) => p.id !== id)
    this.saveFeePlans(filtered)
  }

  // Settings
  static getSettings(): any {
    if (typeof window === 'undefined') return this.getDefaultSettings()
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS)
      return data ? JSON.parse(data) : this.getDefaultSettings()
    } catch (error) {
      console.error('Error reading settings:', error)
      return this.getDefaultSettings()
    }
  }

  static saveSettings(settings: any): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
    } catch (error) {
      console.error('Error saving settings:', error)
    }
  }

  static getDefaultSettings() {
    return {
      schoolName: 'Apple Public School',
      academicYear: '2025-2026',
      academicYearStartMonth: 4,
      tuitionMonthsCount: 12,
      classes: ['Nursery', 'LKG', 'UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'],
      buses: [
        { busNumber: 'Winger', route: 'Route A' },
        { busNumber: 'Maximo', route: 'Route B' },
        { busNumber: 'Verito', route: 'Route C' },
        { busNumber: 'Audi', route: 'Route D' },
        { busNumber: 'Fluence', route: 'Route E' },
      ],
      expenseCategories: ['Electricity', 'Rent', 'Stationery', 'Events', 'Repairs', 'Internet', 'Misc'],
      incomeSources: ['Books Fee', 'Uniform', 'Donations', 'Admission forms', 'Other'],
      paymentModes: ['Cash', 'UPI', 'Bank', 'Cheque', 'Online'],
      currency: 'INR',
      theme: 'light',
    }
  }

  // Clear all data
  static clearAll(): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS)
      localStorage.removeItem(STORAGE_KEYS.STUDENTS)
      localStorage.removeItem(STORAGE_KEYS.FEE_PLANS)
      localStorage.removeItem('schoolTransportData') // Clear bus entries
      // Keep settings and admin users
    } catch (error) {
      console.error('Error clearing data:', error)
    }
  }
}
