import { Transaction, DailyReport, MonthlyReport, ClassWiseFeeReport, TransportReport, SalaryReport, Student, AppSettings } from '@/types/school'
import { FeeCollection, BusFeeCollection, BusExpense, Salary } from '@/types/school'
import { parseISO, isSameDay, isSameMonth, startOfMonth, format } from 'date-fns'

export function generateDailyReport(transactions: Transaction[], date: string): DailyReport {
  // Normalize date to YYYY-MM-DD format for comparison
  const normalizedDate = date.includes('T') ? date.split('T')[0] : date
  const dayTransactions = transactions.filter((t) => {
    // Normalize transaction date for comparison
    const tDate = t.date.includes('T') ? t.date.split('T')[0] : t.date
    return tDate === normalizedDate
  })

  const fees = dayTransactions
    .filter((t): t is FeeCollection => t.type === 'fee_collection')
    .reduce((sum, t) => sum + t.amount, 0)

  const busFees = dayTransactions
    .filter((t): t is BusFeeCollection => t.type === 'bus_fee_collection')
    .reduce((sum, t) => sum + t.amount, 0)

  const otherIncome = dayTransactions
    .filter((t) => t.type === 'other_income')
    .reduce((sum, t) => sum + t.amount, 0)

  const busExpenses = dayTransactions
    .filter((t): t is BusExpense => t.type === 'bus_expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const salaries = dayTransactions
    .filter((t): t is Salary => t.type === 'salary')
    .reduce((sum, t) => sum + t.amount, 0)

  const otherExpenses = dayTransactions
    .filter((t) => t.type === 'other_expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalIncome = fees + busFees + otherIncome
  const totalExpenses = busExpenses + salaries + otherExpenses

  return {
    date,
    income: {
      fees,
      busFees,
      otherIncome,
      total: totalIncome,
    },
    expenses: {
      busExpenses,
      salaries,
      otherExpenses,
      total: totalExpenses,
    },
    net: totalIncome - totalExpenses,
    transactions: dayTransactions,
  }
}

export function generateMonthlyReport(transactions: Transaction[], month: string): MonthlyReport {
  const [year, monthNum] = month.split('-').map(Number)
  const monthStart = new Date(year, monthNum - 1, 1)

  const monthTransactions = transactions.filter((t) => {
    const tDate = parseISO(t.date)
    return isSameMonth(tDate, monthStart)
  })

  const fees = monthTransactions
    .filter((t): t is FeeCollection => t.type === 'fee_collection')
    .reduce((sum, t) => sum + t.amount, 0)

  const busFees = monthTransactions
    .filter((t): t is BusFeeCollection => t.type === 'bus_fee_collection')
    .reduce((sum, t) => sum + t.amount, 0)

  const otherIncome = monthTransactions
    .filter((t) => t.type === 'other_income')
    .reduce((sum, t) => sum + t.amount, 0)

  const busExpenses = monthTransactions
    .filter((t): t is BusExpense => t.type === 'bus_expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const salaries = monthTransactions
    .filter((t): t is Salary => t.type === 'salary')
    .reduce((sum, t) => sum + t.amount, 0)

  const otherExpenses = monthTransactions
    .filter((t) => t.type === 'other_expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalIncome = fees + busFees + otherIncome
  const totalExpenses = busExpenses + salaries + otherExpenses

  return {
    month,
    income: {
      fees,
      busFees,
      otherIncome,
      total: totalIncome,
    },
    expenses: {
      busExpenses,
      salaries,
      otherExpenses,
      total: totalExpenses,
    },
    net: totalIncome - totalExpenses,
    transactions: monthTransactions,
  }
}

export function generateClassWiseFeeReport(transactions: Transaction[], month?: string): ClassWiseFeeReport[] {
  const classMap: Record<string, FeeCollection[]> = {}

  let filteredTransactions = transactions.filter((t): t is FeeCollection => t.type === 'fee_collection')

  if (month) {
    const [year, monthNum] = month.split('-').map(Number)
    const monthStart = new Date(year, monthNum - 1, 1)
    filteredTransactions = filteredTransactions.filter((t) => {
      const tDate = parseISO(t.date)
      return isSameMonth(tDate, monthStart)
    })
  }

  filteredTransactions.forEach((t) => {
    if (!classMap[t.class]) {
      classMap[t.class] = []
    }
    classMap[t.class].push(t)
  })

  return Object.entries(classMap).map(([className, classTransactions]) => ({
    class: className,
    total: classTransactions.reduce((sum, t) => sum + t.amount, 0),
    count: classTransactions.length,
    transactions: classTransactions,
  }))
}

export function generateTransportReport(
  transactions: Transaction[], 
  busNumber?: string,
  students?: Student[],
  settings?: AppSettings
): TransportReport[] {
  const busMap: Record<string, { route: string; fees: BusFeeCollection[]; expenses: BusExpense[] }> = {}

  // Collect bus fees from bus_fee_collection transactions
  transactions
    .filter((t): t is BusFeeCollection => t.type === 'bus_fee_collection')
    .forEach((t) => {
      if (busNumber && t.busNumber !== busNumber) return
      if (!busMap[t.busNumber]) {
        busMap[t.busNumber] = { route: t.busRoute, fees: [], expenses: [] }
      }
      busMap[t.busNumber].fees.push(t)
    })

  // Collect bus fees from fee_collection transactions with feeType 'Bus'
  if (students && settings) {
    transactions
      .filter((t): t is FeeCollection => t.type === 'fee_collection' && t.feeType === 'Bus')
      .forEach((t) => {
        // Find student to get busRouteId
        const student = students.find(
          (s) => s.id === t.studentId || s.admissionNo === t.admissionNo
        )
        
        if (student && student.busRouteId) {
          // Find bus info from settings
          const busInfo = settings.buses.find((b) => b.busNumber === student.busRouteId)
          
          if (busInfo) {
            if (busNumber && busInfo.busNumber !== busNumber) return
            
            // Create a pseudo BusFeeCollection for calculation purposes
            const busFee: BusFeeCollection = {
              id: t.id,
              type: 'bus_fee_collection',
              date: t.date,
              amount: t.amount,
              paymentMode: t.paymentMode,
              notes: t.notes,
              createdAt: t.createdAt,
              busNumber: busInfo.busNumber,
              busRoute: busInfo.route,
              studentName: t.studentName,
            }
            
            if (!busMap[busInfo.busNumber]) {
              busMap[busInfo.busNumber] = { route: busInfo.route, fees: [], expenses: [] }
            }
            busMap[busInfo.busNumber].fees.push(busFee)
          }
        }
      })
  }

  // Collect bus expenses
  transactions
    .filter((t): t is BusExpense => t.type === 'bus_expense')
    .forEach((t) => {
      if (busNumber && t.busNumber !== busNumber) return
      if (!busMap[t.busNumber]) {
        busMap[t.busNumber] = { route: '', fees: [], expenses: [] }
      }
      busMap[t.busNumber].expenses.push(t)
    })

  return Object.entries(busMap).map(([busNum, data]) => {
    const feeCollection = data.fees.reduce((sum, t) => sum + t.amount, 0)
    const expenses = {
      diesel: 0,
      maintenance: 0,
      driverSalary: 0,
      cleanerSalary: 0,
      toll: 0,
      tyre: 0,
      repair: 0,
      other: 0,
      total: 0,
    }

    data.expenses.forEach((exp) => {
      const amount = exp.amount
      switch (exp.expenseType) {
        case 'Diesel':
          expenses.diesel += amount
          break
        case 'Maintenance':
          expenses.maintenance += amount
          break
        case 'Driver Salary':
          expenses.driverSalary += amount
          break
        case 'Cleaner Salary':
          expenses.cleanerSalary += amount
          break
        case 'Toll':
          expenses.toll += amount
          break
        case 'Tyre':
          expenses.tyre += amount
          break
        case 'Repair':
          expenses.repair += amount
          break
        case 'Other':
          expenses.other += amount
          break
      }
      expenses.total += amount
    })

    return {
      busNumber: busNum,
      busRoute: data.route,
      feeCollection,
      expenses,
      net: feeCollection - expenses.total,
    }
  })
}

export function generateSalaryReport(transactions: Transaction[], month: string): SalaryReport {
  const [year, monthNum] = month.split('-').map(Number)
  const monthStart = new Date(year, monthNum - 1, 1)

  const monthSalaries = transactions.filter((t): t is Salary => {
    if (t.type !== 'salary') return false
    const tDate = parseISO(t.date)
    return isSameMonth(tDate, monthStart)
  })

  const teachers = monthSalaries.filter((s) => s.employeeType === 'Teacher')
  const staff = monthSalaries.filter((s) => s.employeeType === 'Staff')

  return {
    month,
    teachers: {
      total: teachers.reduce((sum, t) => sum + t.amount, 0),
      count: teachers.length,
      transactions: teachers,
    },
    staff: {
      total: staff.reduce((sum, t) => sum + t.amount, 0),
      count: staff.length,
      transactions: staff,
    },
    total: monthSalaries.reduce((sum, t) => sum + t.amount, 0),
  }
}
