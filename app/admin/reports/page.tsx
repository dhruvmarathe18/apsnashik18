'use client'

import React, { useState, useMemo } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { FileText, Download, Printer } from 'lucide-react'
import { useSchool } from '@/contexts/SchoolContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatRupee, formatDateReadable, getTodayISO } from '@/lib/utils/format'
import { generateDailyReport, generateMonthlyReport, generateClassWiseFeeReport, generateTransportReport, generateSalaryReport } from '@/lib/utils/reports'

export default function ReportsPage() {
  const { transactions, settings } = useSchool()
  const [reportType, setReportType] = useState<'daily' | 'monthly' | 'classwise' | 'transport' | 'salary'>('daily')
  const [selectedDate, setSelectedDate] = useState(getTodayISO())
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  const dailyReport = useMemo(() => {
    return generateDailyReport(transactions, selectedDate)
  }, [transactions, selectedDate])

  const monthlyReport = useMemo(() => {
    return generateMonthlyReport(transactions, selectedMonth)
  }, [transactions, selectedMonth])

  const classWiseReport = useMemo(() => {
    return generateClassWiseFeeReport(transactions, selectedMonth)
  }, [transactions, selectedMonth])

  const transportReport = useMemo(() => {
    return generateTransportReport(transactions)
  }, [transactions])

  const salaryReport = useMemo(() => {
    return generateSalaryReport(transactions, selectedMonth)
  }, [transactions, selectedMonth])

  const handlePrint = () => {
    window.print()
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
              <p className="text-gray-600 mt-2">Generate and view comprehensive financial reports</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </div>

          {/* Report Type Selector */}
          <Card className="mb-6">
            <CardContent className="p-6">
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
            </CardContent>
          </Card>

          {/* Report Content */}
          <Card>
            <CardContent className="p-6">
              {reportType === 'daily' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <Input
                      label="Select Date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="max-w-xs"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Income</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fees:</span>
                          <span className="font-medium">{formatRupee(dailyReport.income.fees)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bus Fees:</span>
                          <span className="font-medium">{formatRupee(dailyReport.income.busFees)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Other Income:</span>
                          <span className="font-medium">{formatRupee(dailyReport.income.otherIncome)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Total Income:</span>
                          <span className="text-green-600">{formatRupee(dailyReport.income.total)}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Expenses</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bus Expenses:</span>
                          <span className="font-medium">{formatRupee(dailyReport.expenses.busExpenses)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Salaries:</span>
                          <span className="font-medium">{formatRupee(dailyReport.expenses.salaries)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Other Expenses:</span>
                          <span className="font-medium">{formatRupee(dailyReport.expenses.otherExpenses)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Total Expenses:</span>
                          <span className="text-red-600">{formatRupee(dailyReport.expenses.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Net Amount:</span>
                      <span className={`text-2xl font-bold ${dailyReport.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatRupee(dailyReport.net)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {reportType === 'monthly' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <Input
                      label="Select Month"
                      type="month"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="max-w-xs"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Income</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fees:</span>
                          <span className="font-medium">{formatRupee(monthlyReport.income.fees)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bus Fees:</span>
                          <span className="font-medium">{formatRupee(monthlyReport.income.busFees)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Other Income:</span>
                          <span className="font-medium">{formatRupee(monthlyReport.income.otherIncome)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Total Income:</span>
                          <span className="text-green-600">{formatRupee(monthlyReport.income.total)}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Expenses</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bus Expenses:</span>
                          <span className="font-medium">{formatRupee(monthlyReport.expenses.busExpenses)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Salaries:</span>
                          <span className="font-medium">{formatRupee(monthlyReport.expenses.salaries)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Other Expenses:</span>
                          <span className="font-medium">{formatRupee(monthlyReport.expenses.otherExpenses)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Total Expenses:</span>
                          <span className="text-red-600">{formatRupee(monthlyReport.expenses.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Net Amount:</span>
                      <span className={`text-2xl font-bold ${monthlyReport.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatRupee(monthlyReport.net)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {reportType === 'classwise' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <Input
                      label="Select Month"
                      type="month"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="max-w-xs"
                    />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Class</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Total Amount</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classWiseReport.map((report) => (
                          <tr key={report.class} className="border-b">
                            <td className="py-3 px-4 text-sm font-medium">{report.class}</td>
                            <td className="py-3 px-4 text-sm font-semibold text-right text-green-600">
                              {formatRupee(report.total)}
                            </td>
                            <td className="py-3 px-4 text-sm text-right">{report.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {reportType === 'transport' && (
                <div className="space-y-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Bus Number</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Route</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Fee Collection</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Expenses</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Net</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transportReport.map((report) => (
                          <tr key={report.busNumber} className="border-b">
                            <td className="py-3 px-4 text-sm font-medium">{report.busNumber}</td>
                            <td className="py-3 px-4 text-sm text-gray-600">{report.busRoute}</td>
                            <td className="py-3 px-4 text-sm font-semibold text-right text-green-600">
                              {formatRupee(report.feeCollection)}
                            </td>
                            <td className="py-3 px-4 text-sm font-semibold text-right text-red-600">
                              {formatRupee(report.expenses.total)}
                            </td>
                            <td className={`py-3 px-4 text-sm font-semibold text-right ${report.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatRupee(report.net)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {reportType === 'salary' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <Input
                      label="Select Month"
                      type="month"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="max-w-xs"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Teachers</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total:</span>
                          <span className="font-medium">{formatRupee(salaryReport.teachers.total)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Count:</span>
                          <span className="font-medium">{salaryReport.teachers.count}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Staff</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total:</span>
                          <span className="font-medium">{formatRupee(salaryReport.staff.total)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Count:</span>
                          <span className="font-medium">{salaryReport.staff.count}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total Salaries:</span>
                      <span className="text-2xl font-bold text-green-600">{formatRupee(salaryReport.total)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
