import React, { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { generateDailyReport, generateMonthlyReport, generateClassWiseFeeReport, generateTransportReport, generateSalaryReport } from '@/utils/reports';
import { format, parseISO } from 'date-fns';
import { exportToExcel } from '@/utils/excel';
import { Download, Printer } from 'lucide-react';

export const Reports: React.FC = () => {
  const { transactions, settings } = useStore();
  const [reportType, setReportType] = useState<'daily' | 'monthly' | 'classwise' | 'transport' | 'salary'>('daily');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));

  const dailyReport = useMemo(() => {
    return generateDailyReport(transactions, selectedDate);
  }, [transactions, selectedDate]);

  const monthlyReport = useMemo(() => {
    return generateMonthlyReport(transactions, selectedMonth);
  }, [transactions, selectedMonth]);

  const classWiseReport = useMemo(() => {
    return generateClassWiseFeeReport(transactions, selectedMonth);
  }, [transactions, selectedMonth]);

  const transportReport = useMemo(() => {
    return generateTransportReport(transactions);
  }, [transactions]);

  const salaryReport = useMemo(() => {
    return generateSalaryReport(transactions, selectedMonth);
  }, [transactions, selectedMonth]);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = async () => {
    await exportToExcel(transactions, settings);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Generate and view financial reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={reportType === 'daily' ? 'primary' : 'outline'}
              onClick={() => setReportType('daily')}
            >
              Daily Report
            </Button>
            <Button
              variant={reportType === 'monthly' ? 'primary' : 'outline'}
              onClick={() => setReportType('monthly')}
            >
              Monthly Report
            </Button>
            <Button
              variant={reportType === 'classwise' ? 'primary' : 'outline'}
              onClick={() => setReportType('classwise')}
            >
              Class-wise Fees
            </Button>
            <Button
              variant={reportType === 'transport' ? 'primary' : 'outline'}
              onClick={() => setReportType('transport')}
            >
              Transport Report
            </Button>
            <Button
              variant={reportType === 'salary' ? 'primary' : 'outline'}
              onClick={() => setReportType('salary')}
            >
              Salary Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {reportType === 'daily' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Income</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      ₹{dailyReport.income.total.toLocaleString('en-IN')}
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Fees: ₹{dailyReport.income.fees.toLocaleString('en-IN')}
                      <br />
                      Bus Fees: ₹{dailyReport.income.busFees.toLocaleString('en-IN')}
                      <br />
                      Other: ₹{dailyReport.income.otherIncome.toLocaleString('en-IN')}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Expenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      ₹{dailyReport.expenses.total.toLocaleString('en-IN')}
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Bus: ₹{dailyReport.expenses.busExpenses.toLocaleString('en-IN')}
                      <br />
                      Salaries: ₹{dailyReport.expenses.salaries.toLocaleString('en-IN')}
                      <br />
                      Other: ₹{dailyReport.expenses.otherExpenses.toLocaleString('en-IN')}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Net</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`text-2xl font-bold ${
                        dailyReport.net >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      ₹{dailyReport.net.toLocaleString('en-IN')}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {reportType === 'monthly' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Month</label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Income</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      ₹{monthlyReport.income.total.toLocaleString('en-IN')}
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Fees: ₹{monthlyReport.income.fees.toLocaleString('en-IN')}
                      <br />
                      Bus Fees: ₹{monthlyReport.income.busFees.toLocaleString('en-IN')}
                      <br />
                      Other: ₹{monthlyReport.income.otherIncome.toLocaleString('en-IN')}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Expenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      ₹{monthlyReport.expenses.total.toLocaleString('en-IN')}
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Bus: ₹{monthlyReport.expenses.busExpenses.toLocaleString('en-IN')}
                      <br />
                      Salaries: ₹{monthlyReport.expenses.salaries.toLocaleString('en-IN')}
                      <br />
                      Other: ₹{monthlyReport.expenses.otherExpenses.toLocaleString('en-IN')}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Net</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`text-2xl font-bold ${
                        monthlyReport.net >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      ₹{monthlyReport.net.toLocaleString('en-IN')}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {monthlyReport.transactions.length} transactions
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {reportType === 'classwise' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Month</label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Class</th>
                      <th className="text-right p-2">Total</th>
                      <th className="text-right p-2">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classWiseReport.map((report) => (
                      <tr key={report.class} className="border-b">
                        <td className="p-2 font-medium">{report.class}</td>
                        <td className="p-2 text-right">₹{report.total.toLocaleString('en-IN')}</td>
                        <td className="p-2 text-right">{report.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {reportType === 'transport' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Bus Number</th>
                    <th className="text-left p-2">Route</th>
                    <th className="text-right p-2">Fee Collection</th>
                    <th className="text-right p-2">Expenses</th>
                    <th className="text-right p-2">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {transportReport.map((report) => (
                    <tr key={report.busNumber} className="border-b">
                      <td className="p-2 font-medium">{report.busNumber}</td>
                      <td className="p-2">{report.busRoute}</td>
                      <td className="p-2 text-right text-green-600">
                        ₹{report.feeCollection.toLocaleString('en-IN')}
                      </td>
                      <td className="p-2 text-right text-red-600">
                        ₹{report.expenses.total.toLocaleString('en-IN')}
                      </td>
                      <td
                        className={`p-2 text-right font-medium ${
                          report.net >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        ₹{report.net.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {reportType === 'salary' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Month</label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Month</th>
                      <th className="text-right p-2">Teachers</th>
                      <th className="text-right p-2">Staff</th>
                      <th className="text-right p-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salaryReport.map((report) => (
                      <tr key={report.month} className="border-b">
                        <td className="p-2 font-medium">{report.month}</td>
                        <td className="p-2 text-right">
                          ₹{report.teachers.total.toLocaleString('en-IN')} ({report.teachers.count})
                        </td>
                        <td className="p-2 text-right">
                          ₹{report.staff.total.toLocaleString('en-IN')} ({report.staff.count})
                        </td>
                        <td className="p-2 text-right font-medium">
                          ₹{report.total.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
