'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  Bus, 
  Users, 
  GraduationCap, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Receipt,
  BookOpen,
  FileText,
  AlertCircle
} from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'
import { useSchool } from '@/contexts/SchoolContext'
import { formatRupee, formatDateReadable, getTodayISO } from '@/lib/utils/format'
import { generateDailyReport, generateMonthlyReport } from '@/lib/utils/reports'
import { parseISO, isSameMonth, startOfMonth } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export default function AdminDashboard() {
  const { transactions, students, feePlans, settings, isLoading } = useSchool()

  const today = getTodayISO()
  const todayReport = useMemo(() => generateDailyReport(transactions, today), [transactions, today])
  
  const currentMonth = useMemo(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  }, [])
  
  const monthReport = useMemo(() => generateMonthlyReport(transactions, currentMonth), [transactions, currentMonth])

  const busStudents = useMemo(() => {
    return students.filter((s) => s.busOpted).length
  }, [students])

  // Calculate pending fee collection
  const pendingFeeCollection = useMemo(() => {
    let totalPending = 0
    let studentsWithPendingFees = 0

    students.forEach((student) => {
      if (student.status !== 'Active') return

      const feePlan = feePlans.find((p) => p.studentId === student.id)
      if (!feePlan) return

      // Get all fee transactions for this student
      const studentTransactions = transactions.filter(
        (t) =>
          t.type === 'fee_collection' &&
          (t.studentId === student.id || t.admissionNo === student.admissionNo)
      )

      const paid = studentTransactions.reduce((sum, t) => sum + t.amount, 0)

      // Calculate expected fees (annual fee + exam fee + book fee + uniform fee + misc fee - discount)
      const expectedFees = feePlan.annualFee + feePlan.examFee + feePlan.bookFee + feePlan.uniformFee + (feePlan.miscFee || 0) - (feePlan.discount || 0)
      const remaining = expectedFees - paid

      if (remaining > 0) {
        totalPending += remaining
        studentsWithPendingFees++
      }
    })

    return {
      amount: totalPending,
      count: studentsWithPendingFees
    }
  }, [students, transactions, feePlans])

  const stats = [
    { 
      title: 'Total Students', 
      value: students.length.toString(), 
      icon: Users, 
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
      valueColor: 'text-primary',
      href: '/admin/students',
      change: null
    },
    { 
      title: 'Pending Fee Collection', 
      value: formatRupee(pendingFeeCollection.amount), 
      icon: null, 
      iconColor: 'text-warning',
      iconBg: 'bg-warning/10',
      valueColor: 'text-warning',
      href: '/admin/fee-due-reports',
      change: `${pendingFeeCollection.count} student(s)`,
    },
    { 
      title: 'Today Income', 
      value: formatRupee(todayReport.income.total), 
      icon: TrendingUp, 
      iconColor: 'text-success',
      iconBg: 'bg-success/10',
      valueColor: 'text-success',
      href: '/admin/reports',
      change: null
    },
    { 
      title: 'Today Expense', 
      value: formatRupee(todayReport.expenses.total), 
      icon: TrendingDown, 
      iconColor: 'text-destructive',
      iconBg: 'bg-destructive/10',
      valueColor: 'text-destructive',
      href: '/admin/reports',
      change: null
    },
    { 
      title: 'Monthly Income', 
      value: formatRupee(monthReport.income.total), 
      icon: TrendingUp, 
      iconColor: 'text-success',
      iconBg: 'bg-success/10',
      valueColor: 'text-success',
      href: '/admin/reports',
      change: currentMonth,
    },
    { 
      title: 'Monthly Expenses', 
      value: formatRupee(monthReport.expenses.total), 
      icon: TrendingDown, 
      iconColor: 'text-destructive',
      iconBg: 'bg-destructive/10',
      valueColor: 'text-destructive',
      href: '/admin/expenses',
      change: currentMonth,
    },
    { 
      title: 'Bus Expenses', 
      value: formatRupee(monthReport.expenses.busExpenses), 
      icon: Bus, 
      iconColor: 'text-destructive',
      iconBg: 'bg-destructive/10',
      valueColor: 'text-destructive',
      href: '/admin/expenses',
      change: currentMonth,
    },
    { 
      title: 'Month Profit', 
      value: formatRupee(monthReport.net), 
      icon: Receipt, 
      iconColor: monthReport.net >= 0 ? 'text-success' : 'text-destructive',
      iconBg: monthReport.net >= 0 ? 'bg-success/10' : 'bg-destructive/10',
      valueColor: monthReport.net >= 0 ? 'text-success' : 'text-destructive',
      href: '/admin/reports',
      change: null
    },
    { 
      title: 'Fee Collection', 
      value: formatRupee(monthReport.income.fees), 
      icon: GraduationCap, 
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
      valueColor: 'text-primary',
      href: '/admin/fees',
      change: null
    },
    { 
      title: 'Bus Management', 
      value: '5 Buses', 
      icon: Bus, 
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
      valueColor: 'text-primary',
      href: '/admin/bus',
      change: null
    },
  ]

  const quickActions = [
    { title: 'Add Student', icon: Users, color: 'bg-primary', href: '/admin/students' },
    { title: 'Fee Collection', icon: GraduationCap, color: 'bg-success', href: '/admin/fees' },
    { title: 'Expenses', icon: Receipt, color: 'bg-destructive', href: '/admin/expenses' },
    { title: 'Bus Management', icon: Bus, color: 'bg-primary', href: '/admin/bus' },
  ]

  const modules = [
    { name: 'Students', description: 'Manage student records and information', icon: Users, href: '/admin/students', bgColor: 'bg-primary/10', borderColor: 'border-primary/30', iconColor: 'text-primary' },
    { name: 'Fee Management', description: 'Fee collection, ledger, and due reports', icon: BookOpen, href: '/admin/fees', bgColor: 'bg-success/10', borderColor: 'border-success/30', iconColor: 'text-success' },
    { name: 'Transport', description: 'Bus fees and transport expenses', icon: Bus, href: '/admin/transport', bgColor: 'bg-primary/10', borderColor: 'border-primary/30', iconColor: 'text-primary' },
    { name: 'Bus Management', description: 'Daily entries, reports, and driver management', icon: Bus, href: '/admin/bus', bgColor: 'bg-primary/10', borderColor: 'border-primary/30', iconColor: 'text-primary' },
    { name: 'Salaries', description: 'Employee salary management', icon: Users, href: '/admin/salaries', bgColor: 'bg-warning/10', borderColor: 'border-warning/30', iconColor: 'text-warning' },
    { name: 'Expenses', description: 'Track school expenses', icon: Receipt, href: '/admin/expenses', bgColor: 'bg-destructive/10', borderColor: 'border-destructive/30', iconColor: 'text-destructive' },
    { name: 'Reports', description: 'Financial reports and analytics', icon: FileText, href: '/admin/reports', bgColor: 'bg-surface-2', borderColor: 'border-border/40', iconColor: 'text-text-muted' },
  ]

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  }, [transactions])

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-muted">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-3 sm:p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-text">School Management Dashboard</h1>
              <p className="text-text-muted mt-2">Welcome to {settings.schoolName} - {settings.academicYear}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {stats.map((stat, index) => (
            <Link key={stat.title} href={stat.href || '#'}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-surface-1 rounded-lg shadow-sm ring-1 ring-border/40 p-4 sm:p-6 hover:shadow-md hover:ring-border/60 transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-text-muted truncate">{stat.title}</p>
                    <p className={`text-xl sm:text-2xl font-bold mt-1 ${stat.valueColor}`}>{stat.value}</p>
                    {stat.change && (
                      <p className="text-xs text-text-dim mt-1">{stat.change}</p>
                    )}
                  </div>
                  {stat.icon && (
                    <div className={`p-2 sm:p-3 rounded-full ${stat.iconBg} flex-shrink-0`}>
                      <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.iconColor}`} />
                    </div>
                  )}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-surface-1 rounded-lg shadow-sm ring-1 ring-border/40 p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-text mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {quickActions.map((action, index) => (
              <Link key={action.title} href={action.href || '#'}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`${action.color} text-white p-3 sm:p-4 rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2 sm:space-x-3 cursor-pointer`}
                >
                  <action.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base truncate">{action.title}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Today's Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Income:</span>
                  <span className="text-lg font-semibold text-success">{formatRupee(todayReport.income.total)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Expenses:</span>
                  <span className="text-lg font-semibold text-destructive">{formatRupee(todayReport.expenses.total)}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-border/20">
                  <span className="text-text font-medium">Net:</span>
                  <span className={`text-xl font-bold ${todayReport.net >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {formatRupee(todayReport.net)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Summary ({currentMonth})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Income:</span>
                  <span className="text-lg font-semibold text-success">{formatRupee(monthReport.income.total)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Expenses:</span>
                  <span className="text-lg font-semibold text-destructive">{formatRupee(monthReport.expenses.total)}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-border/20">
                  <span className="text-text font-medium">Net:</span>
                  <span className={`text-xl font-bold ${monthReport.net >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {formatRupee(monthReport.net)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        {recentTransactions.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto bg-surface-2 rounded-xl ring-1 ring-border/40 p-6">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left py-2 px-4 text-sm font-medium text-text-muted">Date</th>
                      <th className="text-left py-2 px-4 text-sm font-medium text-text-muted">Type</th>
                      <th className="text-right py-2 px-4 text-sm font-medium text-text-muted">Amount</th>
                      <th className="text-left py-2 px-4 text-sm font-medium text-text-muted">Payment Mode</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="py-2 px-4 text-sm text-text-muted">{formatDateReadable(transaction.date)}</td>
                        <td className="py-2 px-4 text-sm text-text">{transaction.type.replace('_', ' ').toUpperCase()}</td>
                        <td className="py-2 px-4 text-sm font-medium text-right text-success">{formatRupee(transaction.amount)}</td>
                        <td className="py-2 px-4 text-sm text-text-muted">{transaction.paymentMode}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modules Grid */}
        <div className="bg-surface-1 rounded-lg shadow-sm ring-1 ring-border/40 p-6">
          <h2 className="text-xl font-semibold text-text mb-6">Management Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module, index) => (
              <Link key={module.name} href={module.href}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`${module.bgColor} ${module.borderColor} border-2 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${module.bgColor}`}>
                      <module.icon className={`w-6 h-6 ${module.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-text mb-1">{module.name}</h3>
                      <p className="text-sm text-text-dim">{module.description}</p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
