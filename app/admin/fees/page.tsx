'use client'

import React, { useState, useMemo } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { GraduationCap, Plus, BookOpen, FileText, DollarSign, Trash2, Search } from 'lucide-react'
import Link from 'next/link'
import { useSchool } from '@/contexts/SchoolContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatRupee, formatDateReadable } from '@/lib/utils/format'
import { generateClassWiseFeeReport } from '@/lib/utils/reports'
import { FeeCollection } from '@/types/school'
import toast from 'react-hot-toast'
import { parseISO, isSameMonth } from 'date-fns'

export default function FeesPage() {
  const { transactions, deleteTransaction, students, settings } = useSchool()
  const [selectedMonth, setSelectedMonth] = useState('')
  const [filterClass, setFilterClass] = useState('')
  const [filterFeeType, setFilterFeeType] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const feeTransactions = useMemo(() => {
    return transactions.filter((t): t is FeeCollection => t.type === 'fee_collection')
  }, [transactions])

  const filteredTransactions = useMemo(() => {
    let filtered = feeTransactions

    if (selectedMonth) {
      const [year, month] = selectedMonth.split('-').map(Number)
      const monthStart = new Date(year, month - 1, 1)
      filtered = filtered.filter((t) => {
        const tDate = parseISO(t.date)
        return isSameMonth(tDate, monthStart)
      })
    }

    if (filterClass) {
      filtered = filtered.filter((t) => t.class === filterClass)
    }

    if (filterFeeType) {
      filtered = filtered.filter((t) => t.feeType === filterFeeType)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter((t) => {
        const admissionNo = getAdmissionNo(t).toLowerCase()
        const studentName = getStudentName(t).toLowerCase()
        const className = (t.class || '').toLowerCase()
        return admissionNo.includes(term) || studentName.includes(term) || className.includes(term)
      })
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [feeTransactions, selectedMonth, filterClass, filterFeeType, searchTerm])

  const classWiseReport = useMemo(() => {
    return generateClassWiseFeeReport(transactions)
  }, [transactions])

  const stats = {
    totalCollected: feeTransactions.reduce((sum, t) => sum + t.amount, 0),
    thisMonth: filteredTransactions.reduce((sum, t) => sum + t.amount, 0),
    pending: 0, // Would need fee ledger calculation
    defaulters: 0, // Would need fee ledger calculation
  }

  const handleDelete = async (id: string) => {
    const transaction = feeTransactions.find((t) => t.id === id)
    const studentName = transaction ? getStudentName(transaction) : 'this entry'
    
    if (confirm(`Are you sure you want to delete this fee entry for ${studentName}?\n\nThis action cannot be undone.`)) {
      try {
        await deleteTransaction(id)
        toast.success('Fee entry deleted successfully')
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete entry')
      }
    }
  }

  const getStudentName = (transaction: FeeCollection) => {
    if (transaction.studentId) {
      const student = students.find((s) => s.id === transaction.studentId)
      return student?.fullName || transaction.studentName || '-'
    }
    return transaction.studentName || '-'
  }

  const getAdmissionNo = (transaction: FeeCollection) => {
    if (transaction.studentId) {
      const student = students.find((s) => s.id === transaction.studentId)
      return student?.admissionNo || transaction.admissionNo || '-'
    }
    return transaction.admissionNo || '-'
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Fee Management</h1>
              <p className="text-gray-600 mt-2">Manage fee collection, ledger, and due reports</p>
            </div>
            <Link href="/admin/quick-entry">
              <Button>
                <Plus className="w-5 h-5 mr-2" />
                Add Fee Entry
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Collected</p>
                    <p className="text-2xl font-bold text-green-600 mt-2">{formatRupee(stats.totalCollected)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-blue-600 mt-2">{formatRupee(stats.thisMonth)}</p>
                  </div>
                  <GraduationCap className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Fees</p>
                    <p className="text-2xl font-bold text-red-600 mt-2">{formatRupee(stats.pending)}</p>
                  </div>
                  <FileText className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Defaulters</p>
                    <p className="text-2xl font-bold text-orange-600 mt-2">{stats.defaulters}</p>
                  </div>
                  <FileText className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search by admission number, student name, or class..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Filter by Month"
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  />
                  <Select
                    label="Filter by Class"
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                    options={[
                      { value: '', label: 'All Classes' },
                      ...settings.classes.map((cls) => ({ value: cls, label: cls })),
                    ]}
                  />
                  <Select
                    label="Filter by Fee Type"
                    value={filterFeeType}
                    onChange={(e) => setFilterFeeType(e.target.value)}
                    options={[
                      { value: '', label: 'All Types' },
                      { value: 'Tuition', label: 'Tuition' },
                      { value: 'Exam', label: 'Exam' },
                      { value: 'Annual', label: 'Annual' },
                      { value: 'Books', label: 'Books' },
                      { value: 'Uniform', label: 'Uniform' },
                      { value: 'Other', label: 'Other' },
                    ]}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Class-wise Summary */}
          {classWiseReport.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Class-wise Fee Collection</CardTitle>
              </CardHeader>
              <CardContent>
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
                        <tr key={report.class} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">{report.class}</td>
                          <td className="py-3 px-4 text-sm font-semibold text-right text-green-600">
                            {formatRupee(report.total)}
                          </td>
                          <td className="py-3 px-4 text-sm text-right text-gray-600">{report.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Fee Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Fee Collection Records ({filteredTransactions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Fee Records Found</h3>
                  <p className="text-gray-600 mb-4">
                    {selectedMonth || filterClass || filterFeeType
                      ? 'Try adjusting your filters'
                      : 'Get started by adding your first fee entry'}
                  </p>
                  {!selectedMonth && !filterClass && !filterFeeType && (
                    <Link href="/admin/quick-entry">
                      <Button>
                        <Plus className="w-5 h-5 mr-2" />
                        Add Fee Entry
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Admission No</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Student Name</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Class</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Fee Type</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Amount</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Payment Mode</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-600">{formatDateReadable(transaction.date)}</td>
                          <td className="py-3 px-4 text-sm text-gray-900">{getAdmissionNo(transaction)}</td>
                          <td className="py-3 px-4 text-sm text-gray-900">{getStudentName(transaction)}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{transaction.class}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{transaction.feeType}</td>
                          <td className="py-3 px-4 text-sm font-semibold text-right text-green-600">
                            {formatRupee(transaction.amount)}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{transaction.paymentMode}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                transaction.status === 'Paid'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {transaction.status || 'Paid'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(transaction.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Link href="/admin/fee-ledger">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">Fee Ledger</h3>
                      <p className="text-sm text-gray-600 mt-1">View student fee payment history</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/fee-due-reports">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-red-500">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <FileText className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">Fee Due Reports</h3>
                      <p className="text-sm text-gray-600 mt-1">Generate fee due reports</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/quick-entry">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-green-500">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Plus className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">Quick Entry</h3>
                      <p className="text-sm text-gray-600 mt-1">Add new fee entry quickly</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
