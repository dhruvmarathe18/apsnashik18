'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import { Bus, Plus, FileText, TrendingUp, TrendingDown } from 'lucide-react'
import { useSchool } from '@/contexts/SchoolContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatRupee } from '@/lib/utils/format'
import { generateTransportReport } from '@/lib/utils/reports'
import { BusFeeCollection, BusExpense } from '@/types/school'

export default function TransportPage() {
  const { transactions, settings } = useSchool()

  const busFeeTransactions = useMemo(() => {
    return transactions.filter((t): t is BusFeeCollection => t.type === 'bus_fee_collection')
  }, [transactions])

  const busExpenseTransactions = useMemo(() => {
    return transactions.filter((t): t is BusExpense => t.type === 'bus_expense')
  }, [transactions])

  const transportReports = useMemo(() => {
    return generateTransportReport(transactions)
  }, [transactions])

  const stats = {
    totalBusFees: busFeeTransactions.reduce((sum, t) => sum + t.amount, 0),
    totalBusExpenses: busExpenseTransactions.reduce((sum, t) => sum + t.amount, 0),
    net: busFeeTransactions.reduce((sum, t) => sum + t.amount, 0) - busExpenseTransactions.reduce((sum, t) => sum + t.amount, 0),
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Transport Management</h1>
            <p className="text-gray-600 mt-2">Manage bus fees, expenses, and transport operations</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Bus Fees</p>
                    <p className="text-2xl font-bold text-green-600 mt-2">{formatRupee(stats.totalBusFees)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Bus Expenses</p>
                    <p className="text-2xl font-bold text-red-600 mt-2">{formatRupee(stats.totalBusExpenses)}</p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Net Amount</p>
                    <p className={`text-2xl font-bold mt-2 ${stats.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatRupee(stats.net)}
                    </p>
                  </div>
                  <Bus className="w-8 h-8 text-primary-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transport Modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link href="/admin/expenses">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-green-500">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Bus className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">Bus Fee Collection</h3>
                      <p className="text-sm text-gray-600 mt-1">Record and track bus fee collections from students</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/expenses">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-red-500">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <FileText className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">Bus Expenses</h3>
                      <p className="text-sm text-gray-600 mt-1">Track diesel, maintenance, and other bus expenses</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Bus-wise Summary */}
          {transportReports.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Bus-wise Summary</CardTitle>
              </CardHeader>
              <CardContent>
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
                      {transportReports.map((report) => (
                        <tr key={report.busNumber} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">{report.busNumber}</td>
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
              </CardContent>
            </Card>
          )}

          {/* Bus Management Integration */}
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Bus Operations Management</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Complete bus management system with daily entries, reports, and driver management</p>
                </div>
                <Link href="/admin/bus">
                  <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2">
                    <Bus className="w-5 h-5" />
                    <span>Go to Bus Management</span>
                  </button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <Link href="/admin/bus/daily-entry">
                  <div className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <p className="font-medium text-gray-900">Daily Entry</p>
                    <p className="text-xs text-gray-600 mt-1">Record daily transport data</p>
                  </div>
                </Link>
                <Link href="/admin/bus/bus-report">
                  <div className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <p className="font-medium text-gray-900">Bus Reports</p>
                    <p className="text-xs text-gray-600 mt-1">Monthly bus reports</p>
                  </div>
                </Link>
                <Link href="/admin/bus/driver-report">
                  <div className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <p className="font-medium text-gray-900">Driver Reports</p>
                    <p className="text-xs text-gray-600 mt-1">Driver performance</p>
                  </div>
                </Link>
                <Link href="/admin/bus/driver-salary">
                  <div className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <p className="font-medium text-gray-900">Driver Salary</p>
                    <p className="text-xs text-gray-600 mt-1">Manage salaries</p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
