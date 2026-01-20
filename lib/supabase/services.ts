import { supabase, isSupabaseConfigured } from './client'
import { Transaction, Student, FeePlan, AppSettings } from '@/types/school'
import { generateUUID } from '@/lib/utils/format'

// Transaction Services
export const transactionService = {
  async getAll(): Promise<Transaction[]> {
    if (!isSupabaseConfigured()) {
      // Fallback to localStorage
      const data = localStorage.getItem('school_transactions')
      return data ? JSON.parse(data) : []
    }

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching transactions:', error)
      return []
    }

    return (data || []).map(transformTransaction)
  },

  async create(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
    const newTransaction: Transaction = {
      ...transaction,
      id: generateUUID(),
      createdAt: new Date().toISOString(),
    } as Transaction

    if (!isSupabaseConfigured()) {
      // Fallback to localStorage
      const transactions = await this.getAll()
      transactions.push(newTransaction)
      localStorage.setItem('school_transactions', JSON.stringify(transactions))
      return newTransaction
    }

    const dbTransaction = transformToDbTransaction(newTransaction)
    const { data, error } = await supabase
      .from('transactions')
      .insert(dbTransaction)
      .select()
      .single()

    if (error) {
      console.error('Error creating transaction:', error)
      throw error
    }

    return transformTransaction(data)
  },

  async update(id: string, updates: Partial<Transaction>): Promise<void> {
    if (!isSupabaseConfigured()) {
      // Fallback to localStorage
      const transactions = await this.getAll()
      const index = transactions.findIndex((t) => t.id === id)
      if (index >= 0) {
        transactions[index] = { ...transactions[index], ...updates } as Transaction
        localStorage.setItem('school_transactions', JSON.stringify(transactions))
      }
      return
    }

    const dbUpdates = transformToDbTransaction(updates as Transaction)
    const { error } = await supabase
      .from('transactions')
      .update(dbUpdates)
      .eq('id', id)

    if (error) {
      console.error('Error updating transaction:', error)
      throw error
    }
  },

  async delete(id: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      // Fallback to localStorage
      const transactions = await this.getAll()
      const filtered = transactions.filter((t) => t.id !== id)
      localStorage.setItem('school_transactions', JSON.stringify(filtered))
      return
    }

    // Delete the transaction
    // Note: Related data cleanup is handled by database constraints or application logic
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting transaction:', error)
      throw error
    }
  },
}

// Student Services
export const studentService = {
  async getAll(): Promise<Student[]> {
    if (!isSupabaseConfigured()) {
      const data = localStorage.getItem('school_students')
      return data ? JSON.parse(data) : []
    }

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching students:', error)
      return []
    }

    return (data || []).map(transformStudent)
  },

  async create(student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Promise<Student> {
    const newStudent = {
      ...student,
      id: generateUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (!isSupabaseConfigured()) {
      const students = await this.getAll()
      students.push(newStudent)
      localStorage.setItem('school_students', JSON.stringify(students))
      return newStudent
    }

    const dbStudent = transformToDbStudent(newStudent)
    const { data, error } = await supabase
      .from('students')
      .insert(dbStudent)
      .select()
      .single()

    if (error) {
      console.error('Error creating student:', error)
      throw error
    }

    return transformStudent(data)
  },

  async update(id: string, updates: Partial<Student>): Promise<void> {
    if (!isSupabaseConfigured()) {
      const students = await this.getAll()
      const index = students.findIndex((s) => s.id === id)
      if (index >= 0) {
        students[index] = { ...students[index], ...updates, updatedAt: new Date().toISOString() }
        localStorage.setItem('school_students', JSON.stringify(students))
      }
      return
    }

    const dbUpdates = transformToDbStudent(updates as Student)
    const { error } = await supabase
      .from('students')
      .update(dbUpdates)
      .eq('id', id)

    if (error) {
      console.error('Error updating student:', error)
      throw error
    }
  },

  async delete(id: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      const students = await this.getAll()
      const filtered = students.filter((s) => s.id !== id)
      
      // Get student info before deleting
      const studentToDelete = students.find((s) => s.id === id)
      if (!studentToDelete) return
      
      // Also delete related transactions and fee plans from localStorage
      const transactions = await transactionService.getAll()
      const admissionNo = studentToDelete.admissionNo
      
      const filteredTransactions = transactions.filter((t) => {
        // Delete fee collection transactions for this student
        if (t.type === 'fee_collection') {
          if (t.studentId === id) return false
          if (t.admissionNo === admissionNo) return false
        }
        // Delete bus fee collections if student name matches
        if (t.type === 'bus_fee_collection' && t.studentName === studentToDelete.fullName) {
          return false
        }
        return true
      })
      localStorage.setItem('school_transactions', JSON.stringify(filteredTransactions))
      
      const feePlans = await feePlanService.getAll()
      const filteredFeePlans = feePlans.filter((p) => p.studentId !== id)
      localStorage.setItem('school_fee_plans', JSON.stringify(filteredFeePlans))
      
      // Now delete the student
      localStorage.setItem('school_students', JSON.stringify(filtered))
      return
    }

    // Get student admission number before deleting
    const { data: studentData } = await supabase
      .from('students')
      .select('admission_no')
      .eq('id', id)
      .single()

    // Delete related transactions (by student_id or admission_no)
    if (studentData) {
      const { error: transactionError } = await supabase
        .from('transactions')
        .delete()
        .or(`student_id.eq.${id},admission_no.eq.${studentData.admission_no}`)

      if (transactionError) {
        console.error('Error deleting related transactions:', transactionError)
        // Continue anyway - transactions might not exist
      }
    }

    // Delete related fee plans (CASCADE should handle this, but we'll do it explicitly)
    const { error: feePlanError } = await supabase
      .from('fee_plans')
      .delete()
      .eq('student_id', id)

    if (feePlanError) {
      console.error('Error deleting related fee plans:', feePlanError)
      // Continue anyway
    }

    // Finally delete the student
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting student:', error)
      throw error
    }
  },
}

// Fee Plan Services
export const feePlanService = {
  async getAll(): Promise<FeePlan[]> {
    if (!isSupabaseConfigured()) {
      const data = localStorage.getItem('school_fee_plans')
      return data ? JSON.parse(data) : []
    }

    const { data, error } = await supabase
      .from('fee_plans')
      .select('*')

    if (error) {
      console.error('Error fetching fee plans:', error)
      return []
    }

    return (data || []).map(transformFeePlan)
  },

  async create(feePlan: Omit<FeePlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<FeePlan> {
    const newFeePlan = {
      ...feePlan,
      id: generateUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (!isSupabaseConfigured()) {
      const feePlans = await this.getAll()
      feePlans.push(newFeePlan)
      localStorage.setItem('school_fee_plans', JSON.stringify(feePlans))
      return newFeePlan
    }

    const dbFeePlan = transformToDbFeePlan(newFeePlan)
    const { data, error } = await supabase
      .from('fee_plans')
      .insert(dbFeePlan)
      .select()
      .single()

    if (error) {
      console.error('Error creating fee plan:', error)
      throw error
    }

    return transformFeePlan(data)
  },

  async update(id: string, updates: Partial<FeePlan>): Promise<void> {
    if (!isSupabaseConfigured()) {
      const feePlans = await this.getAll()
      const index = feePlans.findIndex((p) => p.id === id)
      if (index >= 0) {
        feePlans[index] = { ...feePlans[index], ...updates, updatedAt: new Date().toISOString() }
        localStorage.setItem('school_fee_plans', JSON.stringify(feePlans))
      }
      return
    }

    const dbUpdates = transformToDbFeePlan(updates as FeePlan)
    const { error } = await supabase
      .from('fee_plans')
      .update(dbUpdates)
      .eq('id', id)

    if (error) {
      console.error('Error updating fee plan:', error)
      throw error
    }
  },

  async delete(id: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      const feePlans = await this.getAll()
      const filtered = feePlans.filter((p) => p.id !== id)
      localStorage.setItem('school_fee_plans', JSON.stringify(filtered))
      return
    }

    const { error } = await supabase
      .from('fee_plans')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting fee plan:', error)
      throw error
    }
  },
}

// Settings Service
export const settingsService = {
  async get(): Promise<AppSettings> {
    if (!isSupabaseConfigured()) {
      const data = localStorage.getItem('school_settings')
      return data ? JSON.parse(data) : this.getDefaultSettings()
    }

    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 'main')
      .single()

    if (error || !data) {
      console.error('Error fetching settings:', error)
      return this.getDefaultSettings()
    }

    return transformSettings(data)
  },

  async update(updates: Partial<AppSettings>): Promise<void> {
    if (!isSupabaseConfigured()) {
      const current = await this.get()
      const updated = { ...current, ...updates }
      localStorage.setItem('school_settings', JSON.stringify(updated))
      return
    }

    const dbUpdates = transformToDbSettings(updates as AppSettings)
    const { error } = await supabase
      .from('settings')
      .update(dbUpdates)
      .eq('id', 'main')

    if (error) {
      console.error('Error updating settings:', error)
      throw error
    }
  },

  getDefaultSettings(): AppSettings {
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
  },
}

// Transformation functions
function transformTransaction(dbRow: any): Transaction {
  // Normalize date to YYYY-MM-DD format
  let normalizedDate = dbRow.date
  if (normalizedDate && typeof normalizedDate === 'string') {
    // If date includes time, extract just the date part
    normalizedDate = normalizedDate.split('T')[0]
  } else if (normalizedDate instanceof Date) {
    // Convert Date object to YYYY-MM-DD string
    const year = normalizedDate.getFullYear()
    const month = String(normalizedDate.getMonth() + 1).padStart(2, '0')
    const day = String(normalizedDate.getDate()).padStart(2, '0')
    normalizedDate = `${year}-${month}-${day}`
  }
  
  const base: any = {
    id: dbRow.id,
    type: dbRow.type,
    date: normalizedDate,
    amount: parseFloat(dbRow.amount),
    paymentMode: dbRow.payment_mode,
    notes: dbRow.notes,
    createdAt: dbRow.created_at,
  }

  // Add type-specific fields
  if (dbRow.type === 'fee_collection') {
    return {
      ...base,
      studentId: dbRow.student_id,
      admissionNo: dbRow.admission_no,
      class: dbRow.class,
      studentName: dbRow.student_name,
      feeType: dbRow.fee_type,
      feeForMonth: dbRow.fee_for_month,
      status: dbRow.status,
    } as Transaction
  }

  if (dbRow.type === 'bus_fee_collection') {
    return {
      ...base,
      busNumber: dbRow.bus_number,
      busRoute: dbRow.bus_route,
      studentName: dbRow.student_name,
    } as Transaction
  }

  if (dbRow.type === 'bus_expense') {
    return {
      ...base,
      busNumber: dbRow.bus_number,
      expenseType: dbRow.expense_type,
      vendor: dbRow.vendor,
    } as Transaction
  }

  if (dbRow.type === 'salary') {
    return {
      ...base,
      employeeType: dbRow.employee_type,
      employeeName: dbRow.employee_name,
      salaryMonth: dbRow.salary_month,
    } as Transaction
  }

  if (dbRow.type === 'other_expense') {
    return {
      ...base,
      category: dbRow.category,
    } as Transaction
  }

  if (dbRow.type === 'other_income') {
    return {
      ...base,
      incomeSource: dbRow.income_source,
    } as Transaction
  }

  return base as Transaction
}

function transformToDbTransaction(transaction: Transaction | Partial<Transaction>): any {
  const dbRow: any = {
    type: transaction.type,
    date: transaction.date,
    amount: transaction.amount,
    payment_mode: transaction.paymentMode,
    notes: transaction.notes || null,
  }

  // Add type-specific fields
  if (transaction.type === 'fee_collection') {
    const fee = transaction as any
    dbRow.student_id = fee.studentId || null
    dbRow.admission_no = fee.admissionNo || null
    dbRow.class = fee.class || null
    dbRow.student_name = fee.studentName || null
    dbRow.fee_type = fee.feeType || null
    dbRow.fee_for_month = fee.feeForMonth || null
    dbRow.status = fee.status || 'Paid'
  } else if (transaction.type === 'bus_fee_collection') {
    const busFee = transaction as any
    dbRow.bus_number = busFee.busNumber || null
    dbRow.bus_route = busFee.busRoute || null
    dbRow.student_name = busFee.studentName || null
  } else if (transaction.type === 'bus_expense') {
    const busExp = transaction as any
    dbRow.bus_number = busExp.busNumber || null
    dbRow.expense_type = busExp.expenseType || null
    dbRow.vendor = busExp.vendor || null
  } else if (transaction.type === 'salary') {
    const salary = transaction as any
    dbRow.employee_type = salary.employeeType || null
    dbRow.employee_name = salary.employeeName || null
    dbRow.salary_month = salary.salaryMonth || null
  } else if (transaction.type === 'other_expense') {
    const exp = transaction as any
    dbRow.category = exp.category || null
  } else if (transaction.type === 'other_income') {
    const inc = transaction as any
    dbRow.income_source = inc.incomeSource || null
  }

  return dbRow
}

function transformStudent(dbRow: any): Student {
  return {
    id: dbRow.id,
    admissionNo: dbRow.admission_no,
    rollNo: dbRow.roll_no,
    fullName: dbRow.full_name,
    gender: dbRow.gender,
    dateOfBirth: dbRow.date_of_birth,
    className: dbRow.class_name,
    section: dbRow.section,
    academicYear: dbRow.academic_year,
    fatherName: dbRow.father_name,
    motherName: dbRow.mother_name,
    guardianName: dbRow.guardian_name,
    phonePrimary: dbRow.phone_primary,
    phoneSecondary: dbRow.phone_secondary,
    addressLine1: dbRow.address_line1,
    addressLine2: dbRow.address_line2,
    city: dbRow.city,
    state: dbRow.state,
    pincode: dbRow.pincode,
    busOpted: dbRow.bus_opted,
    busRouteId: dbRow.bus_route_id,
    busFeeMonthly: dbRow.bus_fee_monthly ? parseFloat(dbRow.bus_fee_monthly) : undefined,
    status: dbRow.status,
    createdAt: dbRow.created_at,
    updatedAt: dbRow.updated_at,
  }
}

function transformToDbStudent(student: Student | Partial<Student>): any {
  return {
    admission_no: (student as Student).admissionNo,
    roll_no: (student as Student).rollNo || null,
    full_name: (student as Student).fullName,
    gender: (student as Student).gender || null,
    date_of_birth: (student as Student).dateOfBirth || null,
    class_name: (student as Student).className,
    section: (student as Student).section || null,
    academic_year: (student as Student).academicYear,
    father_name: (student as Student).fatherName || null,
    mother_name: (student as Student).motherName || null,
    guardian_name: (student as Student).guardianName || null,
    phone_primary: (student as Student).phonePrimary,
    phone_secondary: (student as Student).phoneSecondary || null,
    address_line1: (student as Student).addressLine1 || null,
    address_line2: (student as Student).addressLine2 || null,
    city: (student as Student).city || null,
    state: (student as Student).state || null,
    pincode: (student as Student).pincode || null,
    bus_opted: (student as Student).busOpted || false,
    bus_route_id: (student as Student).busRouteId || null,
    bus_fee_monthly: (student as Student).busFeeMonthly || null,
    status: (student as Student).status || 'Active',
  }
}

function transformFeePlan(dbRow: any): FeePlan {
  return {
    id: dbRow.id,
    studentId: dbRow.student_id,
    tuitionFeeMonthly: parseFloat(dbRow.tuition_fee_monthly),
    annualFee: parseFloat(dbRow.annual_fee),
    examFee: parseFloat(dbRow.exam_fee),
    bookFee: parseFloat(dbRow.book_fee),
    uniformFee: parseFloat(dbRow.uniform_fee),
    discount: parseFloat(dbRow.discount),
    miscFee: parseFloat(dbRow.misc_fee),
    feeFrequency: dbRow.fee_frequency,
    createdAt: dbRow.created_at,
    updatedAt: dbRow.updated_at,
  }
}

function transformToDbFeePlan(feePlan: FeePlan | Partial<FeePlan>): any {
  return {
    student_id: (feePlan as FeePlan).studentId,
    tuition_fee_monthly: (feePlan as FeePlan).tuitionFeeMonthly || 0,
    annual_fee: (feePlan as FeePlan).annualFee || 0,
    exam_fee: (feePlan as FeePlan).examFee || 0,
    book_fee: (feePlan as FeePlan).bookFee || 0,
    uniform_fee: (feePlan as FeePlan).uniformFee || 0,
    discount: (feePlan as FeePlan).discount || 0,
    misc_fee: (feePlan as FeePlan).miscFee || 0,
    fee_frequency: (feePlan as FeePlan).feeFrequency || 'Monthly',
  }
}

function transformSettings(dbRow: any): AppSettings {
  return {
    schoolName: dbRow.school_name,
    academicYear: dbRow.academic_year,
    academicYearStartMonth: dbRow.academic_year_start_month,
    tuitionMonthsCount: dbRow.tuition_months_count,
    classes: dbRow.classes || [],
    buses: dbRow.buses || [],
    expenseCategories: dbRow.expense_categories || [],
    incomeSources: dbRow.income_sources || [],
    paymentModes: dbRow.payment_modes || [],
    currency: dbRow.currency,
    theme: dbRow.theme,
  }
}

function transformToDbSettings(settings: AppSettings | Partial<AppSettings>): any {
  return {
    school_name: (settings as AppSettings).schoolName,
    academic_year: (settings as AppSettings).academicYear,
    academic_year_start_month: (settings as AppSettings).academicYearStartMonth,
    tuition_months_count: (settings as AppSettings).tuitionMonthsCount,
    classes: (settings as AppSettings).classes,
    buses: (settings as AppSettings).buses,
    expense_categories: (settings as AppSettings).expenseCategories,
    income_sources: (settings as AppSettings).incomeSources,
    payment_modes: (settings as AppSettings).paymentModes,
    currency: (settings as AppSettings).currency,
    theme: (settings as AppSettings).theme,
  }
}

// Bus Daily Entry type
export interface BusDailyEntry {
  id: string
  busName: string
  entryDate: string // YYYY-MM-DD
  driverName?: string
  startKm?: number
  endKm?: number
  dailyKm: number
  dieselFilled: number
  dieselRate: number
  dieselAmount: number
  expenseDescription?: string
  otherExpense: number
  runningKm: number
  actualAverage: number
  remarks?: string
  createdAt: string
  updatedAt: string
}

// Bus Daily Entries Service
export const busEntryService = {
  async getAll(): Promise<BusDailyEntry[]> {
    if (!isSupabaseConfigured()) {
      // Fallback to localStorage
      const data = localStorage.getItem('schoolTransportData')
      if (!data) return []
      const transportData = JSON.parse(data)
      const entries: BusDailyEntry[] = []
      const BUS_NAMES = ['Winger', 'Maximo', 'Verito', 'Audi', 'Fluence']
      
      BUS_NAMES.forEach((busName) => {
        const busEntries = transportData[busName] || []
        busEntries.forEach((entry: any) => {
          entries.push({
            id: entry.id || generateUUID(),
            busName,
            entryDate: entry.Date,
            driverName: entry['Driver Name'],
            startKm: parseFloat(entry['Start KM'] || 0),
            endKm: parseFloat(entry['End KM'] || 0),
            dailyKm: parseFloat(entry['Daily KM'] || 0),
            dieselFilled: parseFloat(entry['Diesel Filled'] || 0),
            dieselRate: parseFloat(entry['Diesel Rate'] || 0),
            dieselAmount: parseFloat(entry['Diesel Amount'] || 0),
            expenseDescription: entry['Expense Description'],
            otherExpense: parseFloat(entry['Other Expense'] || 0),
            runningKm: parseFloat(entry['Running KM'] || 0),
            actualAverage: parseFloat(entry['Actual Average'] || 0),
            remarks: entry['Remarks'],
            createdAt: entry.createdAt || new Date().toISOString(),
            updatedAt: entry.updatedAt || new Date().toISOString(),
          })
        })
      })
      return entries
    }

    const { data, error } = await supabase
      .from('bus_daily_entries')
      .select('*')
      .order('entry_date', { ascending: false })
      .order('bus_name', { ascending: true })

    if (error) {
      console.error('Error fetching bus entries:', error)
      return []
    }

    return (data || []).map(transformBusEntry)
  },

  async create(entry: Omit<BusDailyEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<BusDailyEntry> {
    // Use IST for timestamps
    const now = new Date()
    const istOffset = 5.5 * 60 * 60 * 1000
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60 * 1000)
    const istTime = new Date(utcTime + istOffset)
    
    const newEntry: BusDailyEntry = {
      ...entry,
      id: generateUUID(),
      createdAt: istTime.toISOString(),
      updatedAt: istTime.toISOString(),
    } as BusDailyEntry

    if (!isSupabaseConfigured()) {
      // Fallback to localStorage
      const data = localStorage.getItem('schoolTransportData')
      const transportData = data ? JSON.parse(data) : {}
      if (!transportData[entry.busName]) {
        transportData[entry.busName] = []
      }
      transportData[entry.busName].push({
        id: newEntry.id,
        Date: entry.entryDate,
        'Driver Name': entry.driverName,
        'Start KM': entry.startKm,
        'End KM': entry.endKm,
        'Daily KM': entry.dailyKm,
        'Diesel Filled': entry.dieselFilled,
        'Diesel Rate': entry.dieselRate,
        'Diesel Amount': entry.dieselAmount,
        'Expense Description': entry.expenseDescription,
        'Other Expense': entry.otherExpense,
        'Running KM': entry.runningKm,
        'Actual Average': entry.actualAverage,
        'Remarks': entry.remarks,
        createdAt: newEntry.createdAt,
        updatedAt: newEntry.updatedAt,
      })
      localStorage.setItem('schoolTransportData', JSON.stringify(transportData))
      return newEntry
    }

    const dbEntry = transformToDbBusEntry(newEntry)
    const { data, error } = await supabase
      .from('bus_daily_entries')
      .insert(dbEntry)
      .select()
      .single()

    if (error) {
      console.error('Error creating bus entry:', error)
      throw error
    }

    return transformBusEntry(data)
  },

  async update(id: string, updates: Partial<BusDailyEntry>): Promise<void> {
    if (!isSupabaseConfigured()) {
      // Fallback to localStorage
      const data = localStorage.getItem('schoolTransportData')
      if (!data) return
      const transportData = JSON.parse(data)
      const BUS_NAMES = ['Winger', 'Maximo', 'Verito', 'Audi', 'Fluence']
      
      for (const busName of BUS_NAMES) {
        const entries = transportData[busName] || []
        const index = entries.findIndex((e: any) => e.id === id)
        if (index >= 0) {
          entries[index] = { ...entries[index], ...updates, updatedAt: new Date().toISOString() }
          localStorage.setItem('schoolTransportData', JSON.stringify(transportData))
          return
        }
      }
      return
    }

    const dbUpdates = transformToDbBusEntry(updates as BusDailyEntry)
    const { error } = await supabase
      .from('bus_daily_entries')
      .update(dbUpdates)
      .eq('id', id)

    if (error) {
      console.error('Error updating bus entry:', error)
      throw error
    }
  },

  async delete(id: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      // Fallback to localStorage
      const data = localStorage.getItem('schoolTransportData')
      if (!data) return
      const transportData = JSON.parse(data)
      const BUS_NAMES = ['Winger', 'Maximo', 'Verito', 'Audi', 'Fluence']
      
      for (const busName of BUS_NAMES) {
        const entries = transportData[busName] || []
        const filtered = entries.filter((e: any) => e.id !== id)
        if (filtered.length !== entries.length) {
          transportData[busName] = filtered
          localStorage.setItem('schoolTransportData', JSON.stringify(transportData))
          return
        }
      }
      return
    }

    const { error } = await supabase
      .from('bus_daily_entries')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting bus entry:', error)
      throw error
    }
  },

  async getByBus(busName: string): Promise<BusDailyEntry[]> {
    const allEntries = await this.getAll()
    return allEntries.filter((e) => e.busName === busName)
  },
}

function transformBusEntry(dbRow: any): BusDailyEntry {
  return {
    id: dbRow.id,
    busName: dbRow.bus_name,
    entryDate: dbRow.entry_date,
    driverName: dbRow.driver_name,
    startKm: dbRow.start_km ? parseFloat(dbRow.start_km) : undefined,
    endKm: dbRow.end_km ? parseFloat(dbRow.end_km) : undefined,
    dailyKm: parseFloat(dbRow.daily_km || 0),
    dieselFilled: parseFloat(dbRow.diesel_filled || 0),
    dieselRate: parseFloat(dbRow.diesel_rate || 0),
    dieselAmount: parseFloat(dbRow.diesel_amount || 0),
    expenseDescription: dbRow.expense_description,
    otherExpense: parseFloat(dbRow.other_expense || 0),
    runningKm: parseFloat(dbRow.running_km || 0),
    actualAverage: parseFloat(dbRow.actual_average || 0),
    remarks: dbRow.remarks,
    createdAt: dbRow.created_at,
    updatedAt: dbRow.updated_at,
  }
}

function transformToDbBusEntry(entry: BusDailyEntry | Partial<BusDailyEntry>): any {
  return {
    bus_name: (entry as BusDailyEntry).busName,
    entry_date: (entry as BusDailyEntry).entryDate,
    driver_name: (entry as BusDailyEntry).driverName || null,
    start_km: (entry as BusDailyEntry).startKm || null,
    end_km: (entry as BusDailyEntry).endKm || null,
    daily_km: (entry as BusDailyEntry).dailyKm || 0,
    diesel_filled: (entry as BusDailyEntry).dieselFilled || 0,
    diesel_rate: (entry as BusDailyEntry).dieselRate || 0,
    diesel_amount: (entry as BusDailyEntry).dieselAmount || 0,
    expense_description: (entry as BusDailyEntry).expenseDescription || null,
    other_expense: (entry as BusDailyEntry).otherExpense || 0,
    running_km: (entry as BusDailyEntry).runningKm || 0,
    actual_average: (entry as BusDailyEntry).actualAverage || 0,
    remarks: (entry as BusDailyEntry).remarks || null,
  }
}
