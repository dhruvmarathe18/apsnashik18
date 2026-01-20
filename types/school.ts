// School Management System Types

export type TransactionType =
  | 'fee_collection'
  | 'bus_fee_collection'
  | 'bus_expense'
  | 'salary'
  | 'other_expense'
  | 'other_income'

export type PaymentMode = 'Cash' | 'UPI' | 'Bank' | 'Cheque' | 'Online'

export type FeeType = 'Tuition' | 'Exam' | 'Annual' | 'Books' | 'Uniform' | 'Other'

export type BusExpenseType =
  | 'Diesel'
  | 'Maintenance'
  | 'Driver Salary'
  | 'Cleaner Salary'
  | 'Toll'
  | 'Tyre'
  | 'Repair'
  | 'Other'

export type ExpenseCategory =
  | 'Electricity'
  | 'Rent'
  | 'Stationery'
  | 'Events'
  | 'Repairs'
  | 'Internet'
  | 'Misc'

export type IncomeSource =
  | 'Books Fee'
  | 'Uniform'
  | 'Donations'
  | 'Admission forms'
  | 'Other'

export type EmployeeType = 'Teacher' | 'Staff'

export interface BaseTransaction {
  id: string
  type: TransactionType
  date: string // ISO date string YYYY-MM-DD
  amount: number
  paymentMode: PaymentMode
  notes?: string
  createdAt: string // ISO timestamp
}

export interface FeeCollection extends BaseTransaction {
  type: 'fee_collection'
  studentId?: string
  admissionNo?: string
  class: string
  studentName?: string
  feeType: FeeType
  feeForMonth?: string // YYYY-MM format
  status?: 'Paid' | 'Pending'
}

export interface BusFeeCollection extends BaseTransaction {
  type: 'bus_fee_collection'
  busRoute: string
  busNumber: string
  studentName?: string
}

export interface BusExpense extends BaseTransaction {
  type: 'bus_expense'
  busNumber: string
  expenseType: BusExpenseType
  vendor?: string
}

export interface Salary extends BaseTransaction {
  type: 'salary'
  employeeType: EmployeeType
  employeeName: string
  salaryMonth: string // YYYY-MM format
}

export interface OtherExpense extends BaseTransaction {
  type: 'other_expense'
  category: ExpenseCategory
}

export interface OtherIncome extends BaseTransaction {
  type: 'other_income'
  incomeSource: IncomeSource
}

export type Transaction =
  | FeeCollection
  | BusFeeCollection
  | BusExpense
  | Salary
  | OtherExpense
  | OtherIncome

// Student Types
export type StudentStatus = 'Active' | 'Inactive' | 'Left'
export type Gender = 'Male' | 'Female' | 'Other'
export type FeeFrequency = 'Monthly' | 'Quarterly' | 'Yearly'

export interface Student {
  id: string
  admissionNo: string
  rollNo?: string
  fullName: string
  gender?: Gender
  dateOfBirth?: string
  className: string
  section?: string
  academicYear: string
  fatherName?: string
  motherName?: string
  guardianName?: string
  phonePrimary: string
  phoneSecondary?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  pincode?: string
  busOpted: boolean
  busRouteId?: string
  busFeeMonthly?: number
  status: StudentStatus
  createdAt: string
  updatedAt: string
}

export interface FeePlan {
  id: string
  studentId: string
  annualFee: number
  examFee: number
  bookFee: number
  uniformFee: number
  discount: number
  miscFee: number
  createdAt: string
  updatedAt: string
}

export interface StudentWithFeePlan extends Student {
  feePlan?: FeePlan
}

// Settings
export interface BusInfo {
  busNumber: string
  route: string
}

export interface AppSettings {
  schoolName: string
  academicYear: string
  academicYearStartMonth: number // 1-12, default 4 (April)
  tuitionMonthsCount: number // Default 12
  classes: string[]
  buses: BusInfo[]
  expenseCategories: ExpenseCategory[]
  incomeSources: IncomeSource[]
  paymentModes: PaymentMode[]
  currency: string
  theme: 'light' | 'dark'
  defaultFeePlanByClass?: Record<string, {
    tuitionFeeMonthly: number
    annualFee: number
    examFee: number
    bookFee: number
    uniformFee: number
  }>
  defaulterThreshold?: {
    remainingAmount: number
    unpaidMonths: number
  }
}

// Report Types
export interface DailyReport {
  date: string
  income: {
    fees: number
    busFees: number
    otherIncome: number
    total: number
  }
  expenses: {
    busExpenses: number
    salaries: number
    otherExpenses: number
    total: number
  }
  net: number
  transactions: Transaction[]
}

export interface MonthlyReport {
  month: string // YYYY-MM
  income: {
    fees: number
    busFees: number
    otherIncome: number
    total: number
  }
  expenses: {
    busExpenses: number
    salaries: number
    otherExpenses: number
    total: number
  }
  net: number
  transactions: Transaction[]
}

export interface ClassWiseFeeReport {
  class: string
  total: number
  count: number
  transactions: FeeCollection[]
}

export interface TransportReport {
  busNumber: string
  busRoute: string
  feeCollection: number
  expenses: {
    diesel: number
    maintenance: number
    driverSalary: number
    cleanerSalary: number
    toll: number
    tyre: number
    repair: number
    other: number
    total: number
  }
  net: number
}

export interface SalaryReport {
  month: string
  teachers: {
    total: number
    count: number
    transactions: Salary[]
  }
  staff: {
    total: number
    count: number
    transactions: Salary[]
  }
  total: number
}
