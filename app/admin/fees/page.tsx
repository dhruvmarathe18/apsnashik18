'use client'

import React, { useState, useMemo, useEffect, Suspense } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { GraduationCap, Plus, BookOpen, FileText, DollarSign, Trash2, Search, User, Calendar, AlertCircle, X, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useSchool } from '@/contexts/SchoolContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatRupee, formatDateReadable, getTodayISO, formatDateReadable as formatDate } from '@/lib/utils/format'
import { generateClassWiseFeeReport } from '@/lib/utils/reports'
import { FeeCollection, FeeType, PaymentMode } from '@/types/school'
import toast from 'react-hot-toast'
import { parseISO, isSameMonth } from 'date-fns'
import { useSearchParams, useRouter } from 'next/navigation'

function FeesPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { transactions, addTransaction, deleteTransaction, students, settings, feePlans, getStudentById } = useSchool()
  const [selectedMonth, setSelectedMonth] = useState('')
  const [filterClass, setFilterClass] = useState('')
  const [filterFeeType, setFilterFeeType] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const [formData, setFormData] = useState<any>({
    date: getTodayISO(),
    amount: '',
    paymentMode: 'Cash',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [studentSearchTerm, setStudentSearchTerm] = useState('')
  const [studentSearchClass, setStudentSearchClass] = useState('')
  const [showStudentSearch, setShowStudentSearch] = useState(false)

  // Handle studentId from URL query params
  useEffect(() => {
    const studentId = searchParams?.get('studentId')
    if (studentId && !showAddModal) {
      const student = getStudentById(studentId)
      if (student) {
        setShowAddModal(true)
        setFormData((prev: any) => ({
          ...prev,
          studentId: student.id,
          admissionNo: student.admissionNo,
          class: student.className,
          studentName: student.fullName,
        }))
      }
    }
  }, [searchParams, getStudentById, showAddModal])

  const feeTransactions = useMemo(() => {
    return transactions.filter((t): t is FeeCollection => t.type === 'fee_collection')
  }, [transactions])

  // Helper functions - defined before useMemo hooks that use them
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
  }, [feeTransactions, selectedMonth, filterClass, filterFeeType, searchTerm, students])

  const classWiseReport = useMemo(() => {
    return generateClassWiseFeeReport(transactions)
  }, [transactions])

  const stats = {
    totalCollected: feeTransactions.reduce((sum, t) => sum + t.amount, 0),
    thisMonth: filteredTransactions.reduce((sum, t) => sum + t.amount, 0),
    pending: 0, // Would need fee ledger calculation
    defaulters: 0, // Would need fee ledger calculation
  }

  const selectedStudent = useMemo(() => {
    if (formData.studentId) {
      return students.find((s) => s.id === formData.studentId)
    }
    if (formData.admissionNo) {
      return students.find((s) => s.admissionNo === formData.admissionNo)
    }
    return null
  }, [formData.studentId, formData.admissionNo, students])

  // Calculate student fee details
  const studentFeeDetails = useMemo(() => {
    if (!selectedStudent) return null

    const feePlan = feePlans.find((p) => p.studentId === selectedStudent.id)
    if (!feePlan) return null

    const studentTransactions = transactions.filter(
      (t) =>
        t.type === 'fee_collection' &&
        (t.studentId === selectedStudent.id || t.admissionNo === selectedStudent.admissionNo)
    )

    const paid = studentTransactions.reduce((sum, t) => sum + t.amount, 0)
    const expectedFees = feePlan.annualFee + feePlan.examFee + feePlan.bookFee + feePlan.uniformFee + (feePlan.miscFee || 0) - (feePlan.discount || 0)
    const remaining = expectedFees - paid
    const paidPercentage = expectedFees > 0 ? (paid / expectedFees) * 100 : 0

    return {
      feePlan,
      expectedFees,
      paid,
      remaining,
      paidPercentage,
      transactionCount: studentTransactions.length,
      lastPayment: studentTransactions.length > 0 
        ? studentTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
        : null
    }
  }, [selectedStudent, feePlans, transactions])

  // Calculate students with pending fees for search
  const studentsWithPendingFees = useMemo(() => {
    return students
      .filter((student) => {
        if (student.status !== 'Active') return false

        if (studentSearchTerm) {
          const term = studentSearchTerm.toLowerCase()
          const matchesName = student.fullName.toLowerCase().includes(term)
          const matchesAdmission = student.admissionNo.toLowerCase().includes(term)
          if (!matchesName && !matchesAdmission) return false
        }

        if (studentSearchClass && student.className !== studentSearchClass) return false

        const feePlan = feePlans.find((p) => p.studentId === student.id)
        if (!feePlan) return false

        const studentTransactions = transactions.filter(
          (t) =>
            t.type === 'fee_collection' &&
            (t.studentId === student.id || t.admissionNo === student.admissionNo)
        )

        const paid = studentTransactions.reduce((sum, t) => sum + t.amount, 0)
        const expectedFees = feePlan.annualFee + feePlan.examFee + feePlan.bookFee + feePlan.uniformFee + (feePlan.miscFee || 0) - (feePlan.discount || 0)
        const remaining = expectedFees - paid

        return remaining > 0
      })
      .map((student) => {
        const feePlan = feePlans.find((p) => p.studentId === student.id)!
        const studentTransactions = transactions.filter(
          (t) =>
            t.type === 'fee_collection' &&
            (t.studentId === student.id || t.admissionNo === student.admissionNo)
        )
        const paid = studentTransactions.reduce((sum, t) => sum + t.amount, 0)
        const expectedFees = feePlan.annualFee + feePlan.examFee + feePlan.bookFee + feePlan.uniformFee + (feePlan.miscFee || 0) - (feePlan.discount || 0)
        const remaining = expectedFees - paid

        return {
          student,
          feePlan,
          remaining,
          paid,
          expectedFees,
        }
      })
      .sort((a, b) => b.remaining - a.remaining)
  }, [students, feePlans, transactions, studentSearchTerm, studentSearchClass])

  const handleSelectStudent = (studentId: string) => {
    const student = students.find((s) => s.id === studentId)
    if (student) {
      setFormData((prev: any) => ({
        ...prev,
        studentId: student.id,
        admissionNo: student.admissionNo,
        class: student.className,
        studentName: student.fullName,
      }))
      setShowStudentSearch(false)
      setStudentSearchTerm('')
      setStudentSearchClass('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    if (!formData.class && !selectedStudent && !formData.admissionNo) {
      toast.error('Please select a student or enter admission number/class')
      return
    }

    setIsSubmitting(true)

    try {
      const transaction = {
        date: formData.date,
        amount: parseFloat(formData.amount),
        paymentMode: formData.paymentMode as PaymentMode,
        notes: formData.notes || undefined,
        type: 'fee_collection' as const,
        studentId: formData.studentId || selectedStudent?.id || undefined,
        admissionNo: formData.admissionNo || selectedStudent?.admissionNo || undefined,
        class: selectedStudent?.className || formData.class || '',
        studentName: selectedStudent?.fullName || formData.studentName || undefined,
        feeType: (formData.feeType || 'Tuition') as FeeType,
        status: formData.status || 'Paid',
      }

      await addTransaction(transaction)
      
      // Show success animation
      setShowSuccessAnimation(true)
      toast.success('Fee collected successfully!', {
        icon: '✅',
        duration: 2000,
      })
      
      // Wait for animation, then close and navigate
      setTimeout(() => {
        handleCloseModal(true)
      }, 1500)
    } catch (error: any) {
      toast.error(error.message || 'Failed to add entry')
      setIsSubmitting(false)
    }
  }

  const handleCloseModal = (navigateBack = false) => {
    setIsClosing(true)
    setShowSuccessAnimation(false)
    
    setTimeout(() => {
      setShowAddModal(false)
      setIsClosing(false)
      
      // Reset form
      setFormData({
        date: getTodayISO(),
        amount: '',
        paymentMode: 'Cash',
        notes: '',
      })
      setStudentSearchTerm('')
      setStudentSearchClass('')
      setShowStudentSearch(false)
      
      // Navigate back to fee due reports if came from there
      if (navigateBack && searchParams?.get('from') === 'fee-due-reports') {
        router.push('/admin/fee-due-reports')
      }
    }, 300) // Match animation duration
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

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Fee Management</h1>
              <p className="text-gray-600 mt-2">Manage fee collection, ledger, and due reports</p>
            </div>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Add Fee Entry
            </Button>
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
                    <Button onClick={() => setShowAddModal(true)}>
                      <Plus className="w-5 h-5 mr-2" />
                      Add Fee Entry
                    </Button>
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

          </div>
        </div>
      </div>

      {/* Fee Collection Modal */}
      {showAddModal && (
        <div 
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
            isClosing ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={() => handleCloseModal()}
        >
          <div 
            className={`bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transition-all duration-300 ease-in-out ${
              isClosing 
                ? 'transform translate-x-[100%] opacity-0 scale-95' 
                : 'transform translate-x-0 opacity-100 scale-100'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Success Animation Overlay */}
            {showSuccessAnimation && (
              <div className="absolute inset-0 bg-green-500 bg-opacity-95 flex items-center justify-center z-10 rounded-lg animate-pulse">
                <div className="text-center">
                  <div className="mb-4">
                    <CheckCircle className="w-20 h-20 text-white mx-auto animate-bounce" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Fee Collected!</h3>
                  <p className="text-white text-lg">₹{formatRupee(parseFloat(formData.amount || '0'))}</p>
                </div>
              </div>
            )}
            
            <div className="p-6 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                {searchParams?.get('from') === 'fee-due-reports' && (
                  <button
                    onClick={() => handleCloseModal(true)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Go back"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                )}
                <h2 className="text-2xl font-bold text-gray-900">Collect Fee</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleCloseModal()}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              {/* Student Fee Details Card */}
              {selectedStudent && studentFeeDetails && (
                <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      Student Fee Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700 mb-3">Student Information</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-600">Name:</span>
                            <span className="text-sm text-gray-900">{selectedStudent.fullName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-600">Admission No:</span>
                            <span className="text-sm text-gray-900 font-mono">{selectedStudent.admissionNo}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-600">Class:</span>
                            <span className="text-sm text-gray-900">{selectedStudent.className}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700 mb-3">Fee Plan</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Annual Fee:</span>
                            <span className="text-sm font-medium text-gray-900">{formatRupee(studentFeeDetails.feePlan.annualFee)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Exam Fee:</span>
                            <span className="text-sm font-medium text-gray-900">{formatRupee(studentFeeDetails.feePlan.examFee)}</span>
                          </div>
                          {studentFeeDetails.feePlan.bookFee > 0 && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Books:</span>
                              <span className="text-sm font-medium text-gray-900">{formatRupee(studentFeeDetails.feePlan.bookFee)}</span>
                            </div>
                          )}
                          {studentFeeDetails.feePlan.uniformFee > 0 && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Uniform:</span>
                              <span className="text-sm font-medium text-gray-900">{formatRupee(studentFeeDetails.feePlan.uniformFee)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-blue-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-blue-100">
                          <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-600">Total Expected</span>
                          </div>
                          <p className="text-xl font-bold text-gray-900">{formatRupee(studentFeeDetails.expectedFees)}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-green-100">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-600">Total Paid</span>
                          </div>
                          <p className="text-xl font-bold text-green-600">{formatRupee(studentFeeDetails.paid)}</p>
                          <p className="text-xs text-gray-500 mt-1">{studentFeeDetails.paidPercentage.toFixed(1)}% paid</p>
                        </div>
                        <div className={`bg-white rounded-lg p-4 border ${studentFeeDetails.remaining > 0 ? 'border-red-100' : 'border-green-100'}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className={`w-4 h-4 ${studentFeeDetails.remaining > 0 ? 'text-red-600' : 'text-green-600'}`} />
                            <span className="text-sm font-medium text-gray-600">Pending Amount</span>
                          </div>
                          <p className={`text-xl font-bold ${studentFeeDetails.remaining > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {formatRupee(studentFeeDetails.remaining)}
                          </p>
                          {studentFeeDetails.lastPayment && (
                            <p className="text-xs text-gray-500 mt-1">
                              Last payment: {formatDate(studentFeeDetails.lastPayment.date)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Student Search Section */}
              {!selectedStudent && (
                <Card className="mb-6 border-2 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="w-5 h-5 text-blue-600" />
                      Search Students with Pending Fees
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          type="text"
                          placeholder="Search by student name or admission number..."
                          value={studentSearchTerm}
                          onChange={(e) => setStudentSearchTerm(e.target.value)}
                          className="pl-10"
                          onFocus={() => setShowStudentSearch(true)}
                        />
                      </div>
                      <Select
                        label="Filter by Class"
                        value={studentSearchClass}
                        onChange={(e) => {
                          setStudentSearchClass(e.target.value)
                          setShowStudentSearch(true)
                        }}
                        options={[
                          { value: '', label: 'All Classes' },
                          ...settings.classes.map((cls) => ({ value: cls, label: cls })),
                        ]}
                      />
                    </div>

                    {showStudentSearch && (studentSearchTerm || studentSearchClass) && studentsWithPendingFees.length > 0 && (
                      <div className="border rounded-lg max-h-64 overflow-y-auto">
                        <div className="divide-y">
                          {studentsWithPendingFees.map((item) => (
                            <button
                              key={item.student.id}
                              type="button"
                              onClick={() => handleSelectStudent(item.student.id)}
                              className="w-full text-left p-3 hover:bg-blue-50 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-gray-900">{item.student.fullName}</p>
                                  <p className="text-sm text-gray-600">
                                    {item.student.admissionNo} - {item.student.className}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-semibold text-red-600">
                                    Pending: {formatRupee(item.remaining)}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Paid: {formatRupee(item.paid)} / {formatRupee(item.expectedFees)}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {showStudentSearch && (studentSearchTerm || studentSearchClass) && studentsWithPendingFees.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <p>No students found with pending fees matching your search.</p>
                      </div>
                    )}

                    {!studentSearchTerm && !studentSearchClass && (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        <p>Enter a search term or select a class to find students with pending fees.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Form Fields */}
              <div className="space-y-4">
                <Input
                  label="Date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Admission No"
                    type="text"
                    value={formData.admissionNo || ''}
                    onChange={(e) => {
                      const admissionNo = e.target.value
                      setFormData({ ...formData, admissionNo, studentId: '' })
                      const student = students.find((s) => s.admissionNo === admissionNo)
                      if (student) {
                        setFormData((prev: any) => ({
                          ...prev,
                          admissionNo,
                          studentId: student.id,
                          class: student.className,
                          studentName: student.fullName,
                        }))
                      } else {
                        setFormData((prev: any) => ({
                          ...prev,
                          studentId: '',
                          studentName: '',
                        }))
                      }
                    }}
                    placeholder="Enter admission number"
                  />
                  <Select
                    label="Class"
                    value={formData.class || ''}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    options={[
                      { value: '', label: 'Select Class' },
                      ...settings.classes.map((cls) => ({ value: cls, label: cls })),
                    ]}
                  />
                </div>
                {selectedStudent && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
                    <p className="text-sm text-blue-800">
                      <strong>Student Found:</strong> {selectedStudent.fullName} - {selectedStudent.className}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFormData((prev: any) => ({
                          ...prev,
                          studentId: '',
                          admissionNo: '',
                          class: '',
                          studentName: '',
                        }))
                        setShowStudentSearch(true)
                      }}
                    >
                      Change Student
                    </Button>
                  </div>
                )}
                <Input
                  label="Student Name"
                  type="text"
                  value={formData.studentName || selectedStudent?.fullName || ''}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                />
                <Input
                  label="Amount (₹)"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  required
                />
                <Select
                  label="Payment Mode"
                  value={formData.paymentMode}
                  onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                  options={settings.paymentModes.map((mode) => ({ value: mode, label: mode }))}
                  required
                />
                <Select
                  label="Fee Type"
                  value={formData.feeType || 'Tuition'}
                  onChange={(e) => setFormData({ ...formData, feeType: e.target.value })}
                  options={[
                    { value: 'Tuition', label: 'Tuition' },
                    { value: 'Exam', label: 'Exam' },
                    { value: 'Annual', label: 'Annual' },
                    { value: 'Books', label: 'Books' },
                    { value: 'Uniform', label: 'Uniform' },
                    { value: 'Other', label: 'Other' },
                  ]}
                />
                <Input
                  label="Notes"
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Optional notes..."
                />
              </div>

              <div className="flex gap-4 mt-6">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? 'Saving...' : 'Collect Fee'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false)
                    setFormData({
                      date: getTodayISO(),
                      amount: '',
                      paymentMode: 'Cash',
                      notes: '',
                    })
                    setStudentSearchTerm('')
                    setStudentSearchClass('')
                    setShowStudentSearch(false)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default function FeesPage() {
  return (
    <Suspense fallback={
      <AdminLayout>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    }>
      <FeesPageContent />
    </Suspense>
  )
}
