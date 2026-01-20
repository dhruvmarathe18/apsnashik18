'use client'

import React, { useState, useMemo, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { PlusCircle, Receipt, Bus, UserCog, TrendingUp, GraduationCap } from 'lucide-react'
import { useSchool } from '@/contexts/SchoolContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { TransactionType, FeeType, BusExpenseType, ExpenseCategory, IncomeSource, EmployeeType, PaymentMode } from '@/types/school'
import { formatRupee, getTodayISO, generateUUID } from '@/lib/utils/format'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const entryTypes: { value: TransactionType; label: string; icon: any; color: string }[] = [
  { value: 'fee_collection', label: 'Fee Collection', icon: GraduationCap, color: 'bg-green-500' },
  { value: 'bus_fee_collection', label: 'Bus Fee Collection', icon: Bus, color: 'bg-blue-500' },
  { value: 'bus_expense', label: 'Bus Expense', icon: Bus, color: 'bg-red-500' },
  { value: 'salary', label: 'Salary', icon: UserCog, color: 'bg-purple-500' },
  { value: 'other_expense', label: 'Other Expense', icon: Receipt, color: 'bg-orange-500' },
  { value: 'other_income', label: 'Other Income', icon: TrendingUp, color: 'bg-indigo-500' },
]

export default function QuickEntryPage() {
  const router = useRouter()
  const { addTransaction, settings, students, getStudentById } = useSchool()
  const [selectedType, setSelectedType] = useState<TransactionType | ''>('')
  const [formData, setFormData] = useState<any>({
    date: getTodayISO(),
    amount: '',
    paymentMode: 'Cash',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Handle studentId from URL query params
  useEffect(() => {
    if (isInitialized) return
    
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const studentId = params.get('studentId')
      const type = params.get('type') || 'fee_collection'
      
      if (studentId) {
        const student = getStudentById(studentId)
        if (student) {
          setSelectedType(type as TransactionType)
          setFormData((prev: any) => ({
            ...prev,
            studentId: student.id,
            admissionNo: student.admissionNo,
            class: student.className,
            studentName: student.fullName,
          }))
        }
      }
      setIsInitialized(true)
    }
  }, [getStudentById, isInitialized])

  const selectedStudent = useMemo(() => {
    if (formData.studentId) {
      return students.find((s) => s.id === formData.studentId)
    }
    if (formData.admissionNo) {
      return students.find((s) => s.admissionNo === formData.admissionNo)
    }
    return null
  }, [formData.studentId, formData.admissionNo, students])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedType) {
      toast.error('Please select an entry type')
      return
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setIsSubmitting(true)

    try {
      const baseTransaction = {
        date: formData.date,
        amount: parseFloat(formData.amount),
        paymentMode: formData.paymentMode as PaymentMode,
        notes: formData.notes || undefined,
      }

      let transaction: any

      switch (selectedType) {
      case 'fee_collection':
        if (!formData.class && !selectedStudent && !formData.admissionNo) {
          toast.error('Please select a student or enter admission number/class')
          setIsSubmitting(false)
          return
        }
        transaction = {
          ...baseTransaction,
          type: 'fee_collection',
          studentId: formData.studentId || selectedStudent?.id || undefined,
          admissionNo: formData.admissionNo || selectedStudent?.admissionNo || undefined,
          class: selectedStudent?.className || formData.class || '',
          studentName: selectedStudent?.fullName || formData.studentName || undefined,
          feeType: (formData.feeType || 'Tuition') as FeeType,
          feeForMonth: formData.feeForMonth || undefined,
          status: formData.status || 'Paid',
        }
        break

        case 'bus_fee_collection':
          if (!formData.busNumber) {
            toast.error('Please select a bus')
            setIsSubmitting(false)
            return
          }
          transaction = {
            ...baseTransaction,
            type: 'bus_fee_collection',
            busNumber: formData.busNumber,
            busRoute: formData.busRoute || '',
            studentName: formData.studentName || undefined,
          }
          break

        case 'bus_expense':
          if (!formData.busNumber) {
            toast.error('Please select a bus')
            setIsSubmitting(false)
            return
          }
          transaction = {
            ...baseTransaction,
            type: 'bus_expense',
            busNumber: formData.busNumber,
            expenseType: (formData.expenseType || 'Other') as BusExpenseType,
            vendor: formData.vendor || undefined,
          }
          break

        case 'salary':
          if (!formData.employeeName) {
            toast.error('Please enter employee name')
            setIsSubmitting(false)
            return
          }
          transaction = {
            ...baseTransaction,
            type: 'salary',
            employeeType: (formData.employeeType || 'Teacher') as EmployeeType,
            employeeName: formData.employeeName,
            salaryMonth: formData.salaryMonth || '',
          }
          break

        case 'other_expense':
          transaction = {
            ...baseTransaction,
            type: 'other_expense',
            category: (formData.category || 'Misc') as ExpenseCategory,
          }
          break

        case 'other_income':
          transaction = {
            ...baseTransaction,
            type: 'other_income',
            incomeSource: (formData.incomeSource || 'Other') as IncomeSource,
          }
          break

        default:
          setIsSubmitting(false)
          return
      }

      addTransaction(transaction)
      toast.success('Entry added successfully!')
      
      // Reset form
      setSelectedType('')
      setFormData({
        date: getTodayISO(),
        amount: '',
        paymentMode: 'Cash',
        notes: '',
      })
      
      setTimeout(() => {
        router.push('/admin')
      }, 1000)
    } catch (error: any) {
      toast.error(error.message || 'Failed to add entry')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderFormFields = () => {
    if (!selectedType) return null

    const commonFields = (
      <>
        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
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
        <Input
          label="Notes"
          type="text"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Optional notes..."
        />
      </>
    )

    switch (selectedType) {
      case 'fee_collection':
        return (
          <>
            {commonFields}
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
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Student Found:</strong> {selectedStudent.fullName} - {selectedStudent.className}
                </p>
              </div>
            )}
            <Input
              label="Student Name"
              type="text"
              value={formData.studentName || selectedStudent?.fullName || ''}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
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
              label="Fee For Month (YYYY-MM)"
              type="month"
              value={formData.feeForMonth || ''}
              onChange={(e) => setFormData({ ...formData, feeForMonth: e.target.value })}
            />
          </>
        )

      case 'bus_fee_collection':
        return (
          <>
            {commonFields}
            <Select
              label="Bus Number"
              value={formData.busNumber || ''}
              onChange={(e) => {
                const bus = settings.buses.find((b) => b.busNumber === e.target.value)
                setFormData({
                  ...formData,
                  busNumber: e.target.value,
                  busRoute: bus?.route || '',
                })
              }}
              options={[
                { value: '', label: 'Select Bus' },
                ...settings.buses.map((bus) => ({ value: bus.busNumber, label: bus.busNumber })),
              ]}
              required
            />
            <Input
              label="Bus Route"
              type="text"
              value={formData.busRoute || ''}
              onChange={(e) => setFormData({ ...formData, busRoute: e.target.value })}
            />
            <Input
              label="Student Name"
              type="text"
              value={formData.studentName || ''}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
            />
          </>
        )

      case 'bus_expense':
        return (
          <>
            {commonFields}
            <Select
              label="Bus Number"
              value={formData.busNumber || ''}
              onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
              options={[
                { value: '', label: 'Select Bus' },
                ...settings.buses.map((bus) => ({ value: bus.busNumber, label: bus.busNumber })),
              ]}
              required
            />
            <Select
              label="Expense Type"
              value={formData.expenseType || 'Other'}
              onChange={(e) => setFormData({ ...formData, expenseType: e.target.value })}
              options={[
                { value: 'Diesel', label: 'Diesel' },
                { value: 'Maintenance', label: 'Maintenance' },
                { value: 'Driver Salary', label: 'Driver Salary' },
                { value: 'Cleaner Salary', label: 'Cleaner Salary' },
                { value: 'Toll', label: 'Toll' },
                { value: 'Tyre', label: 'Tyre' },
                { value: 'Repair', label: 'Repair' },
                { value: 'Other', label: 'Other' },
              ]}
            />
            <Input
              label="Vendor"
              type="text"
              value={formData.vendor || ''}
              onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
            />
          </>
        )

      case 'salary':
        return (
          <>
            {commonFields}
            <Select
              label="Employee Type"
              value={formData.employeeType || 'Teacher'}
              onChange={(e) => setFormData({ ...formData, employeeType: e.target.value })}
              options={[
                { value: 'Teacher', label: 'Teacher' },
                { value: 'Staff', label: 'Staff' },
              ]}
            />
            <Input
              label="Employee Name"
              type="text"
              value={formData.employeeName || ''}
              onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
              required
            />
            <Input
              label="Salary Month (YYYY-MM)"
              type="month"
              value={formData.salaryMonth || ''}
              onChange={(e) => setFormData({ ...formData, salaryMonth: e.target.value })}
            />
          </>
        )

      case 'other_expense':
        return (
          <>
            {commonFields}
            <Select
              label="Category"
              value={formData.category || 'Misc'}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={settings.expenseCategories.map((cat) => ({ value: cat, label: cat }))}
            />
          </>
        )

      case 'other_income':
        return (
          <>
            {commonFields}
            <Select
              label="Income Source"
              value={formData.incomeSource || 'Other'}
              onChange={(e) => setFormData({ ...formData, incomeSource: e.target.value })}
              options={settings.incomeSources.map((source) => ({ value: source, label: source }))}
            />
          </>
        )

      default:
        return commonFields
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Quick Entry</h1>
            <p className="text-gray-600 mt-2">Quickly add transactions and entries</p>
          </div>

          {/* Entry Type Selection */}
          {!selectedType && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {entryTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`${type.color} text-white p-6 rounded-lg hover:opacity-90 transition-opacity text-left`}
                >
                  <type.icon className="w-8 h-8 mb-3" />
                  <h3 className="font-semibold text-lg">{type.label}</h3>
                </button>
              ))}
            </div>
          )}

          {/* Form */}
          {selectedType && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {entryTypes.find((t) => t.value === selectedType)?.label}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedType('')
                      setFormData({
                        date: getTodayISO(),
                        amount: '',
                        paymentMode: 'Cash',
                        notes: '',
                      })
                    }}
                  >
                    Change Type
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {renderFormFields()}
                  <div className="flex gap-4 pt-4">
                    <Button type="submit" disabled={isSubmitting} className="flex-1">
                      {isSubmitting ? 'Saving...' : 'Save Entry'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSelectedType('')
                        setFormData({
                          date: getTodayISO(),
                          amount: '',
                          paymentMode: 'Cash',
                          notes: '',
                        })
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
