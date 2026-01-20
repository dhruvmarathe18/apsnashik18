import { Transaction, DailyReport, MonthlyReport, ClassWiseFeeReport, TransportReport, SalaryReport } from '@/types';
import { format, startOfMonth, endOfMonth, parseISO, isSameDay, isSameMonth } from 'date-fns';
import { FeeCollection, BusFeeCollection, BusExpense, Salary } from '@/types';

export function generateDailyReport(transactions: Transaction[], date: string): DailyReport {
  const dayTransactions = transactions.filter((t) => t.date === date);

  const fees = dayTransactions
    .filter((t): t is FeeCollection => t.type === 'fee_collection')
    .reduce((sum, t) => sum + t.amount, 0);

  const busFees = dayTransactions
    .filter((t): t is BusFeeCollection => t.type === 'bus_fee_collection')
    .reduce((sum, t) => sum + t.amount, 0);

  const otherIncome = dayTransactions
    .filter((t) => t.type === 'other_income')
    .reduce((sum, t) => sum + t.amount, 0);

  const busExpenses = dayTransactions
    .filter((t): t is BusExpense => t.type === 'bus_expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const salaries = dayTransactions
    .filter((t): t is Salary => t.type === 'salary')
    .reduce((sum, t) => sum + t.amount, 0);

  const otherExpenses = dayTransactions
    .filter((t) => t.type === 'other_expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = fees + busFees + otherIncome;
  const totalExpenses = busExpenses + salaries + otherExpenses;

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
  };
}

export function generateMonthlyReport(transactions: Transaction[], month: string): MonthlyReport {
  const monthDate = parseISO(`${month}-01`);
  const monthTransactions = transactions.filter((t) => {
    const tDate = parseISO(t.date);
    return isSameMonth(tDate, monthDate);
  });

  const fees = monthTransactions
    .filter((t): t is FeeCollection => t.type === 'fee_collection')
    .reduce((sum, t) => sum + t.amount, 0);

  const busFees = monthTransactions
    .filter((t): t is BusFeeCollection => t.type === 'bus_fee_collection')
    .reduce((sum, t) => sum + t.amount, 0);

  const otherIncome = monthTransactions
    .filter((t) => t.type === 'other_income')
    .reduce((sum, t) => sum + t.amount, 0);

  const busExpenses = monthTransactions
    .filter((t): t is BusExpense => t.type === 'bus_expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const salaries = monthTransactions
    .filter((t): t is Salary => t.type === 'salary')
    .reduce((sum, t) => sum + t.amount, 0);

  const otherExpenses = monthTransactions
    .filter((t) => t.type === 'other_expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = fees + busFees + otherIncome;
  const totalExpenses = busExpenses + salaries + otherExpenses;

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
  };
}

export function generateClassWiseFeeReport(transactions: Transaction[], month?: string): ClassWiseFeeReport[] {
  let feeTransactions = transactions.filter(
    (t): t is FeeCollection => t.type === 'fee_collection'
  );

  if (month) {
    const monthDate = parseISO(`${month}-01`);
    feeTransactions = feeTransactions.filter((t) => {
      const tDate = parseISO(t.date);
      return isSameMonth(tDate, monthDate);
    });
  }

  const classMap = new Map<string, FeeCollection[]>();

  feeTransactions.forEach((t) => {
    const existing = classMap.get(t.class) || [];
    existing.push(t);
    classMap.set(t.class, existing);
  });

  return Array.from(classMap.entries()).map(([class_, transactions]) => ({
    class: class_,
    total: transactions.reduce((sum, t) => sum + t.amount, 0),
    count: transactions.length,
    transactions,
  }));
}

export function generateTransportReport(transactions: Transaction[], busNumber?: string): TransportReport[] {
  const buses = new Set<string>();
  
  // Collect all bus numbers
  transactions.forEach((t) => {
    if (t.type === 'bus_fee_collection' || t.type === 'bus_expense') {
      buses.add(t.busNumber);
    }
  });

  const busList = busNumber ? [busNumber] : Array.from(buses);

  return busList.map((bus) => {
    const busFeeTransactions = transactions.filter(
      (t): t is BusFeeCollection => t.type === 'bus_fee_collection' && t.busNumber === bus
    );
    const busExpenseTransactions = transactions.filter(
      (t): t is BusExpense => t.type === 'bus_expense' && t.busNumber === bus
    );

    const feeCollection = busFeeTransactions.reduce((sum, t) => sum + t.amount, 0);
    const busRoute = busFeeTransactions[0]?.busRoute || busExpenseTransactions[0]?.busRoute || '';

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
    };

    busExpenseTransactions.forEach((t) => {
      const expenseTypeMap: Record<string, keyof typeof expenses> = {
        'diesel': 'diesel',
        'maintenance': 'maintenance',
        'driversalary': 'driverSalary',
        'cleanersalary': 'cleanerSalary',
        'toll': 'toll',
        'tyre': 'tyre',
        'repair': 'repair',
        'other': 'other',
      };
      const key = expenseTypeMap[t.expenseType.toLowerCase().replace(/\s/g, '')] || 'other';
      if (key !== 'total') {
        expenses[key] += t.amount;
      }
      expenses.total += t.amount;
    });

    return {
      busNumber: bus,
      busRoute,
      feeCollection,
      expenses,
      net: feeCollection - expenses.total,
    };
  });
}

export function generateSalaryReport(transactions: Transaction[], month?: string): SalaryReport[] {
  let salaryTransactions = transactions.filter(
    (t): t is Salary => t.type === 'salary'
  );

  if (month) {
    salaryTransactions = salaryTransactions.filter((t) => t.salaryMonth === month);
  }

  const monthMap = new Map<string, Salary[]>();

  salaryTransactions.forEach((t) => {
    const existing = monthMap.get(t.salaryMonth) || [];
    existing.push(t);
    monthMap.set(t.salaryMonth, existing);
  });

  return Array.from(monthMap.entries()).map(([month, transactions]) => {
    const teachers = transactions.filter((t) => t.employeeType === 'Teacher');
    const staff = transactions.filter((t) => t.employeeType === 'Staff');

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
      total: transactions.reduce((sum, t) => sum + t.amount, 0),
    };
  });
}
