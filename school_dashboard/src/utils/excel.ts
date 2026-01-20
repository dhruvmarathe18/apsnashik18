import * as XLSX from 'xlsx';
import { Transaction, AppSettings } from '@/types';
import { Student, FeePlan } from '@/models/student';

export async function exportToExcel(
  transactions: Transaction[],
  settings: AppSettings,
  students?: Student[],
  feePlans?: FeePlan[]
): Promise<void> {
  const workbook = XLSX.utils.book_new();

  // Separate transactions by type
  const feeCollections = transactions.filter((t) => t.type === 'fee_collection');
  const busFeeCollections = transactions.filter((t) => t.type === 'bus_fee_collection');
  const busExpenses = transactions.filter((t) => t.type === 'bus_expense');
  const salaries = transactions.filter((t) => t.type === 'salary');
  const otherExpenses = transactions.filter((t) => t.type === 'other_expense');
  const otherIncomes = transactions.filter((t) => t.type === 'other_income');

  // Fee Collection sheet
  if (feeCollections.length > 0) {
    const feeData = feeCollections.map((t) => ({
      Date: t.date,
      'Student ID': t.studentId || '',
      'Admission No': t.admissionNo || '',
      Class: t.class,
      'Student Name': t.studentName || '',
      'Fee Type': t.feeType,
      'Fee For Month': t.feeForMonth || '',
      Amount: t.amount,
      'Payment Mode': t.paymentMode,
      Status: t.status || 'Paid',
      Notes: t.notes || '',
      'Created At': t.createdAt,
    }));
    const feeSheet = XLSX.utils.json_to_sheet(feeData);
    XLSX.utils.book_append_sheet(workbook, feeSheet, 'FeeCollection');
  }

  // Bus Fee Collection sheet
  if (busFeeCollections.length > 0) {
    const busFeeData = busFeeCollections.map((t) => ({
      Date: t.date,
      'Bus Number': t.busNumber,
      'Bus Route': t.busRoute,
      'Student Name': t.studentName || '',
      Amount: t.amount,
      'Payment Mode': t.paymentMode,
      Notes: t.notes || '',
      'Created At': t.createdAt,
    }));
    const busFeeSheet = XLSX.utils.json_to_sheet(busFeeData);
    XLSX.utils.book_append_sheet(workbook, busFeeSheet, 'BusFeeCollection');
  }

  // Bus Expenses sheet
  if (busExpenses.length > 0) {
    const busExpenseData = busExpenses.map((t) => ({
      Date: t.date,
      'Bus Number': t.busNumber,
      'Expense Type': t.expenseType,
      Amount: t.amount,
      'Payment Mode': t.paymentMode,
      Vendor: t.vendor || '',
      Notes: t.notes || '',
      'Created At': t.createdAt,
    }));
    const busExpenseSheet = XLSX.utils.json_to_sheet(busExpenseData);
    XLSX.utils.book_append_sheet(workbook, busExpenseSheet, 'BusExpenses');
  }

  // Salaries sheet
  if (salaries.length > 0) {
    const salaryData = salaries.map((t) => ({
      Date: t.date,
      'Employee Type': t.employeeType,
      'Employee Name': t.employeeName,
      'Salary Month': t.salaryMonth,
      Amount: t.amount,
      'Payment Mode': t.paymentMode,
      Notes: t.notes || '',
      'Created At': t.createdAt,
    }));
    const salarySheet = XLSX.utils.json_to_sheet(salaryData);
    XLSX.utils.book_append_sheet(workbook, salarySheet, 'Salaries');
  }

  // Other Expenses sheet
  if (otherExpenses.length > 0) {
    const expenseData = otherExpenses.map((t) => ({
      Date: t.date,
      Category: t.category,
      Amount: t.amount,
      'Payment Mode': t.paymentMode,
      Notes: t.notes || '',
      'Created At': t.createdAt,
    }));
    const expenseSheet = XLSX.utils.json_to_sheet(expenseData);
    XLSX.utils.book_append_sheet(workbook, expenseSheet, 'OtherExpenses');
  }

  // Other Incomes sheet
  if (otherIncomes.length > 0) {
    const incomeData = otherIncomes.map((t) => ({
      Date: t.date,
      'Income Source': t.incomeSource,
      Amount: t.amount,
      'Payment Mode': t.paymentMode,
      Notes: t.notes || '',
      'Created At': t.createdAt,
    }));
    const incomeSheet = XLSX.utils.json_to_sheet(incomeData);
    XLSX.utils.book_append_sheet(workbook, incomeSheet, 'OtherIncomes');
  }

  // Summary Monthly sheet
  const monthlySummary: Record<string, any> = {};
  transactions.forEach((t) => {
    const month = t.date.substring(0, 7);
    if (!monthlySummary[month]) {
      monthlySummary[month] = { Month: month, Income: 0, Expense: 0, Net: 0 };
    }
    const isIncome =
      t.type === 'fee_collection' ||
      t.type === 'bus_fee_collection' ||
      t.type === 'other_income';
    if (isIncome) {
      monthlySummary[month].Income += t.amount;
    } else {
      monthlySummary[month].Expense += t.amount;
    }
    monthlySummary[month].Net = monthlySummary[month].Income - monthlySummary[month].Expense;
  });
  const summaryData = Object.values(monthlySummary);
  if (summaryData.length > 0) {
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'SummaryMonthly');
  }

  // Students sheet
  if (students && students.length > 0) {
    const studentData = students.map((s) => ({
      'Admission No': s.admissionNo,
      'Roll No': s.rollNo || '',
      'Full Name': s.fullName,
      Gender: s.gender || '',
      'Date of Birth': s.dateOfBirth || '',
      Class: s.className,
      Section: s.section || '',
      'Academic Year': s.academicYear,
      'Father Name': s.fatherName || '',
      'Mother Name': s.motherName || '',
      'Guardian Name': s.guardianName || '',
      'Primary Phone': s.phonePrimary,
      'Secondary Phone': s.phoneSecondary || '',
      'Address Line 1': s.addressLine1 || '',
      'Address Line 2': s.addressLine2 || '',
      City: s.city || '',
      State: s.state || '',
      Pincode: s.pincode || '',
      'Bus Opted': s.busOpted ? 'Yes' : 'No',
      'Bus Route ID': s.busRouteId || '',
      'Bus Fee Monthly': s.busFeeMonthly || 0,
      Status: s.status,
      'Created At': s.createdAt,
      'Updated At': s.updatedAt,
    }));
    const studentSheet = XLSX.utils.json_to_sheet(studentData);
    XLSX.utils.book_append_sheet(workbook, studentSheet, 'Students');
  }

  // FeePlans sheet
  if (feePlans && feePlans.length > 0) {
    const feePlanData = feePlans.map((fp) => ({
      'Student ID': fp.studentId,
      'Monthly Tuition Fee': fp.tuitionFeeMonthly,
      'Annual Fee': fp.annualFee,
      'Exam Fee': fp.examFee,
      'Book Fee': fp.bookFee,
      'Uniform Fee': fp.uniformFee,
      Discount: fp.discount,
      'Misc Fee': fp.miscFee,
      'Fee Frequency': fp.feeFrequency,
      'Created At': fp.createdAt,
      'Updated At': fp.updatedAt,
    }));
    const feePlanSheet = XLSX.utils.json_to_sheet(feePlanData);
    XLSX.utils.book_append_sheet(workbook, feePlanSheet, 'FeePlans');
  }

  // AppSettings sheet
  const settingsData = [
    { Key: 'School Name', Value: settings.schoolName },
    { Key: 'Academic Year', Value: settings.academicYear },
    { Key: 'Academic Year Start Month', Value: settings.academicYearStartMonth || 4 },
    { Key: 'Tuition Months Count', Value: settings.tuitionMonthsCount || 12 },
    { Key: 'Currency', Value: settings.currency },
    { Key: 'Classes', Value: settings.classes.join(', ') },
    { Key: 'Buses', Value: settings.buses.map((b) => `${b.busNumber} - ${b.route}`).join('; ') },
  ];
  const settingsSheet = XLSX.utils.json_to_sheet(settingsData);
  XLSX.utils.book_append_sheet(workbook, settingsSheet, 'AppSettings');

  // Write file
  const fileName = `School_Finance_Export_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

export async function importFromExcel(file: File): Promise<{
  transactions: Transaction[];
  settings?: AppSettings;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const transactions: Transaction[] = [];
        let settings: AppSettings | undefined;

        // Process each sheet
        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);

          if (sheetName === 'FeeCollection') {
            jsonData.forEach((row: any) => {
              transactions.push({
                id: `fee_${Date.now()}_${Math.random()}`,
                type: 'fee_collection',
                date: row.Date || new Date().toISOString().split('T')[0],
                studentId: row['Student ID'] || undefined,
                admissionNo: row['Admission No'] || undefined,
                class: row.Class || '',
                studentName: row['Student Name'] || undefined,
                feeType: row['Fee Type'] || 'Tuition',
                feeForMonth: row['Fee For Month'] || undefined,
                amount: Number(row.Amount) || 0,
                paymentMode: row['Payment Mode'] || 'Cash',
                status: row.Status || 'Paid',
                notes: row.Notes || undefined,
                createdAt: row['Created At'] || new Date().toISOString(),
              } as Transaction);
            });
          } else if (sheetName === 'Students') {
            // Students import would be handled separately
          } else if (sheetName === 'FeePlans') {
            // FeePlans import would be handled separately
          } else if (sheetName === 'BusFeeCollection') {
            jsonData.forEach((row: any) => {
              transactions.push({
                id: `busfee_${Date.now()}_${Math.random()}`,
                type: 'bus_fee_collection',
                date: row.Date || new Date().toISOString().split('T')[0],
                busNumber: row['Bus Number'] || '',
                busRoute: row['Bus Route'] || '',
                studentName: row['Student Name'] || undefined,
                amount: Number(row.Amount) || 0,
                paymentMode: row['Payment Mode'] || 'Cash',
                notes: row.Notes || undefined,
                createdAt: row['Created At'] || new Date().toISOString(),
              } as Transaction);
            });
          } else if (sheetName === 'BusExpenses') {
            jsonData.forEach((row: any) => {
              transactions.push({
                id: `busexp_${Date.now()}_${Math.random()}`,
                type: 'bus_expense',
                date: row.Date || new Date().toISOString().split('T')[0],
                busNumber: row['Bus Number'] || '',
                expenseType: row['Expense Type'] || 'Other',
                amount: Number(row.Amount) || 0,
                paymentMode: row['Payment Mode'] || 'Cash',
                vendor: row.Vendor || undefined,
                notes: row.Notes || undefined,
                createdAt: row['Created At'] || new Date().toISOString(),
              } as Transaction);
            });
          } else if (sheetName === 'Salaries') {
            jsonData.forEach((row: any) => {
              transactions.push({
                id: `salary_${Date.now()}_${Math.random()}`,
                type: 'salary',
                date: row.Date || new Date().toISOString().split('T')[0],
                employeeType: row['Employee Type'] || 'Teacher',
                employeeName: row['Employee Name'] || '',
                salaryMonth: row['Salary Month'] || '',
                amount: Number(row.Amount) || 0,
                paymentMode: row['Payment Mode'] || 'Bank',
                notes: row.Notes || undefined,
                createdAt: row['Created At'] || new Date().toISOString(),
              } as Transaction);
            });
          } else if (sheetName === 'OtherExpenses') {
            jsonData.forEach((row: any) => {
              transactions.push({
                id: `exp_${Date.now()}_${Math.random()}`,
                type: 'other_expense',
                date: row.Date || new Date().toISOString().split('T')[0],
                category: row.Category || 'Misc',
                amount: Number(row.Amount) || 0,
                paymentMode: row['Payment Mode'] || 'Cash',
                notes: row.Notes || undefined,
                createdAt: row['Created At'] || new Date().toISOString(),
              } as Transaction);
            });
          } else if (sheetName === 'OtherIncomes') {
            jsonData.forEach((row: any) => {
              transactions.push({
                id: `inc_${Date.now()}_${Math.random()}`,
                type: 'other_income',
                date: row.Date || new Date().toISOString().split('T')[0],
                incomeSource: row['Income Source'] || 'Other',
                amount: Number(row.Amount) || 0,
                paymentMode: row['Payment Mode'] || 'Cash',
                notes: row.Notes || undefined,
                createdAt: row['Created At'] || new Date().toISOString(),
              } as Transaction);
            });
          } else if (sheetName === 'AppSettings') {
            // Parse settings if available
            const settingsMap: Record<string, string> = {};
            jsonData.forEach((row: any) => {
              settingsMap[row.Key] = row.Value;
            });
            // Note: Full settings import would require more complex parsing
          }
        });

        resolve({ transactions, settings });
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
