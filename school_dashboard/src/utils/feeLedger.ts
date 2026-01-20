import { FeeCollection } from '@/types';
import { Student, FeePlan } from '@/models/student';
import { AppSettings } from '@/types';
import { parseISO, format, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';

export interface FeeLedgerEntry {
  studentId: string;
  student: Student;
  feePlan: FeePlan | null;
  expected: {
    tuition: number;
    annual: number;
    exam: number;
    books: number;
    uniform: number;
    other: number;
    total: number;
  };
  paid: {
    tuition: number;
    annual: number;
    exam: number;
    books: number;
    uniform: number;
    other: number;
    total: number;
  };
  remaining: {
    tuition: number;
    annual: number;
    exam: number;
    books: number;
    uniform: number;
    other: number;
    total: number;
  };
  paidPercentage: number;
  payments: FeeCollection[];
  monthlyTuition: {
    month: string; // YYYY-MM
    expected: number;
    paid: number;
    remaining: number;
  }[];
}

export interface ClassLedger {
  className: string;
  students: FeeLedgerEntry[];
  totals: {
    expected: number;
    paid: number;
    remaining: number;
    paidPercentage: number;
    studentCount: number;
    dueStudentCount: number;
  };
}

/**
 * Calculate expected fee for a student based on fee plan and academic year
 */
export function calculateExpectedFee(
  feePlan: FeePlan | null,
  academicYear: string,
  settings: AppSettings
): FeeLedgerEntry['expected'] {
  if (!feePlan) {
    return {
      tuition: 0,
      annual: 0,
      exam: 0,
      books: 0,
      uniform: 0,
      other: 0,
      total: 0,
    };
  }

  const tuitionMonths = settings.tuitionMonthsCount || 12;
  const tuitionTotal = feePlan.tuitionFeeMonthly * tuitionMonths;

  const total =
    tuitionTotal +
    feePlan.annualFee +
    feePlan.examFee +
    feePlan.bookFee +
    feePlan.uniformFee +
    feePlan.miscFee -
    feePlan.discount;

  return {
    tuition: tuitionTotal,
    annual: feePlan.annualFee,
    exam: feePlan.examFee,
    books: feePlan.bookFee,
    uniform: feePlan.uniformFee,
    other: feePlan.miscFee,
    total: Math.max(0, total),
  };
}

/**
 * Calculate paid fees from fee collection transactions
 */
export function calculatePaidFees(
  payments: FeeCollection[],
  feePlan: FeePlan | null
): FeeLedgerEntry['paid'] {
  const paid = {
    tuition: 0,
    annual: 0,
    exam: 0,
    books: 0,
    uniform: 0,
    other: 0,
    total: 0,
  };

  payments.forEach((payment) => {
    const amount = payment.amount;
    paid.total += amount;

    switch (payment.feeType) {
      case 'Tuition':
        paid.tuition += amount;
        break;
      case 'Annual':
        paid.annual += amount;
        break;
      case 'Exam':
        paid.exam += amount;
        break;
      case 'Books':
        paid.books += amount;
        break;
      case 'Uniform':
        paid.uniform += amount;
        break;
      case 'Other':
        paid.other += amount;
        break;
    }
  });

  return paid;
}

/**
 * Calculate monthly tuition allocation
 */
export function calculateMonthlyTuition(
  payments: FeeCollection[],
  feePlan: FeePlan | null,
  settings: AppSettings
): FeeLedgerEntry['monthlyTuition'] {
  if (!feePlan || feePlan.tuitionFeeMonthly === 0) {
    return [];
  }

  const tuitionMonths = settings.tuitionMonthsCount || 12;
  const monthlyExpected = feePlan.tuitionFeeMonthly;

  // Group payments by month
  const monthlyPaid: Record<string, number> = {};

  payments
    .filter((p) => p.feeType === 'Tuition')
    .forEach((payment) => {
      const month = payment.feeForMonth || payment.date.substring(0, 7);
      monthlyPaid[month] = (monthlyPaid[month] || 0) + payment.amount;
    });

  // Generate months array (assuming academic year starts from settings)
  const startMonth = settings.academicYearStartMonth || 4; // April
  const currentYear = new Date().getFullYear();
  const months: string[] = [];

  for (let i = 0; i < tuitionMonths; i++) {
    const month = (startMonth + i - 1) % 12;
    const year = startMonth + i > 12 ? currentYear + 1 : currentYear;
    months.push(`${year}-${String(month + 1).padStart(2, '0')}`);
  }

  return months.map((month) => ({
    month,
    expected: monthlyExpected,
    paid: monthlyPaid[month] || 0,
    remaining: Math.max(0, monthlyExpected - (monthlyPaid[month] || 0)),
  }));
}

/**
 * Calculate complete fee ledger for a student
 */
export function calculateStudentLedger(
  student: Student,
  feePlan: FeePlan | null,
  payments: FeeCollection[],
  settings: AppSettings
): FeeLedgerEntry {
  const expected = calculateExpectedFee(feePlan, student.academicYear, settings);
  const paid = calculatePaidFees(payments, feePlan);
  const remaining = {
    tuition: expected.tuition - paid.tuition,
    annual: expected.annual - paid.annual,
    exam: expected.exam - paid.exam,
    books: expected.books - paid.books,
    uniform: expected.uniform - paid.uniform,
    other: expected.other - paid.other,
    total: expected.total - paid.total,
  };

  const paidPercentage =
    expected.total > 0 ? (paid.total / expected.total) * 100 : 0;

  const monthlyTuition = calculateMonthlyTuition(payments, feePlan, settings);

  return {
    studentId: student.id,
    student,
    feePlan,
    expected,
    paid,
    remaining,
    paidPercentage,
    payments: payments.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    ),
    monthlyTuition,
  };
}

/**
 * Calculate class-wise ledger
 */
export function calculateClassLedger(
  students: Student[],
  feePlans: FeePlan[],
  payments: FeeCollection[],
  className: string,
  settings: AppSettings
): ClassLedger {
  const classStudents = students.filter((s) => s.className === className);
  const studentLedgers: FeeLedgerEntry[] = classStudents.map((student) => {
    const plan = feePlans.find((p) => p.studentId === student.id) || null;
    const studentPayments = payments.filter((p) => p.studentId === student.id);
    return calculateStudentLedger(student, plan, studentPayments, settings);
  });

  const totals = studentLedgers.reduce(
    (acc, ledger) => {
      acc.expected += ledger.expected.total;
      acc.paid += ledger.paid.total;
      acc.remaining += ledger.remaining.total;
      if (ledger.remaining.total > 0) {
        acc.dueStudentCount++;
      }
      return acc;
    },
    {
      expected: 0,
      paid: 0,
      remaining: 0,
      paidPercentage: 0,
      studentCount: studentLedgers.length,
      dueStudentCount: 0,
    }
  );

  totals.paidPercentage =
    totals.expected > 0 ? (totals.paid / totals.expected) * 100 : 0;

  return {
    className,
    students: studentLedgers,
    totals,
  };
}

/**
 * Check if student is a defaulter
 */
export function isDefaulter(
  ledger: FeeLedgerEntry,
  settings: AppSettings
): boolean {
  const threshold = settings.defaulterThreshold;
  if (!threshold) return false;

  if (ledger.remaining.total > threshold.remainingAmount) {
    return true;
  }

  // Check unpaid months
  const unpaidMonths = ledger.monthlyTuition.filter(
    (m) => m.remaining > 0
  ).length;
  return unpaidMonths >= threshold.unpaidMonths;
}
