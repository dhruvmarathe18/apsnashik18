'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import { Bus, Plus, FileText, TrendingUp, TrendingDown } from 'lucide-react'
import { useSchool } from '@/contexts/SchoolContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatRupee } from '@/lib/utils/format'
import { generateTransportReport } from '@/lib/utils/reports'
import { BusFeeCollection, BusExpense, FeeCollection } from '@/types/school'

export default function TransportPage() {
  const { transactions, settings, students } = useSchool()

  const busFeeTransactions = useMemo(() => {
    // Include both bus_fee_collection transactions and fee_collection transactions with feeType 'Bus'
    return transactions.filter((t) => {
      if (t.type === 'bus_fee_collection') {
        return true
      }
      if (t.type === 'fee_collection') {
        const feeCollection = t as FeeCollection
        return feeCollection.feeType === 'Bus'
      }
      return false
    })
  }, [transactions])

  const busExpenseTransactions = useMemo(() => {
    return transactions.filter((t): t is BusExpense => t.type === 'bus_expense')
  }, [transactions])

  const transportReports = useMemo(() => {
    return generateTransportReport(transactions, undefined, students, settings)
  }, [transactions, students, settings])

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
            <h1 className="text-3xl font-bold text-text">Transport Management</h1>
            <p className="text-text-muted mt-2">Manage bus fees, expenses, and transport operations</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-muted">Total Bus Fees</p>
                    <p className="text-2xl font-bold text-success mt-2">{formatRupee(stats.totalBusFees)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-success" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-muted">Total Bus Expenses</p>
                    <p className="text-2xl font-bold text-destructive mt-2">{formatRupee(stats.totalBusExpenses)}</p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-destructive" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-muted">Net Amount</p>
                    <p className={`text-2xl font-bold mt-2 ${stats.net >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {formatRupee(stats.net)}
                    </p>
                  </div>
                  <Bus className="w-8 h-8 text-primary" />
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
                      <h3 className="text-lg font-semibold text-text">Bus Fee Collection</h3>
                      <p className="text-sm text-text-muted mt-1">Record and track bus fee collections from students</p>
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
                      <h3 className="text-lg font-semibold text-text">Bus Expenses</h3>
                      <p className="text-sm text-text-dim mt-1">Track diesel, maintenance, and other bus expenses</p>
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
              <CardContent className="p-0">
                <div className="overflow-x-auto bg-surface-2 rounded-xl ring-1 ring-border/40 p-6">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Bus Number</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Route</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-text-muted">Fee Collection</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-text-muted">Expenses</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-text-muted">Net</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transportReports.map((report) => (
                        <tr key={report.busNumber}>
                          <td className="py-3 px-4 text-sm font-medium text-text">{report.busNumber}</td>
                          <td className="py-3 px-4 text-sm text-text-muted">{report.busRoute}</td>
                          <td className="py-3 px-4 text-sm font-semibold text-right text-success">
                            {formatRupee(report.feeCollection)}
                          </td>
                          <td className="py-3 px-4 text-sm font-semibold text-right text-destructive">
                            {formatRupee(report.expenses.total)}
                          </td>
                          <td className={`py-3 px-4 text-sm font-semibold text-right ${report.net >= 0 ? 'text-success' : 'text-destructive'}`}>
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
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-text">Bus Operations Management</CardTitle>
                  <p className="text-sm text-text-muted mt-1">Complete bus management system with daily entries, reports, and driver management</p>
                </div>
                <Link href="/admin/bus">
                  <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2">
                    <Bus className="w-5 h-5" />
                    <span>Go to Bus Management</span>
                  </button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <Link href="/admin/bus/daily-entry">
                  <div className="bg-surface-2 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <p className="font-medium text-text">Daily Entry</p>
                    <p className="text-xs text-text-dim mt-1">Record daily transport data</p>
                  </div>
                </Link>
                <Link href="/admin/bus/bus-report">
                  <div className="bg-surface-1 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <p className="font-medium text-text">Bus Reports</p>
                    <p className="text-xs text-text-muted mt-1">Monthly bus reports</p>
                  </div>
                </Link>
                <Link href="/admin/bus/driver-report">
                  <div className="bg-surface-1 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <p className="font-medium text-text">Driver Reports</p>
                    <p className="text-xs text-text-muted mt-1">Driver performance</p>
                  </div>
                </Link>
                <Link href="/admin/bus/driver-salary">
                  <div className="bg-surface-1 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <p className="font-medium text-text">Driver Salary</p>
                    <p className="text-xs text-text-muted mt-1">Manage salaries</p>
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
