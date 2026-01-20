'use client'

import React, { useState, useMemo } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { UserCog, Plus, Trash2 } from 'lucide-react'
import { useSchool } from '@/contexts/SchoolContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatRupee, formatDateReadable, getTodayISO } from '@/lib/utils/format'
import { Salary, EmployeeType } from '@/types/school'
import toast from 'react-hot-toast'

export default function SalariesPage() {
  const { transactions, addTransaction, deleteTransaction, settings } = useSchool()
  const [showAddModal, setShowAddModal] = useState(false)
  const [filterMonth, setFilterMonth] = useState('')
  const [filterType, setFilterType] = useState<EmployeeType | ''>('')

  const salaryTransactions = useMemo(() => {
    return transactions.filter((t): t is Salary => t.type === 'salary')
  }, [transactions])

  const filteredSalaries = useMemo(() => {
    let filtered = salaryTransactions

    if (filterMonth) {
      const [year, month] = filterMonth.split('-').map(Number)
      const monthStart = new Date(year, month - 1, 1)
      filtered = filtered.filter((t) => {
        const tDate = new Date(t.date)
        return tDate.getMonth() === monthStart.getMonth() && tDate.getFullYear() === monthStart.getFullYear()
      })
    }

    if (filterType) {
      filtered = filtered.filter((t) => t.employeeType === filterType)
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [salaryTransactions, filterMonth, filterType])

  const stats = {
    total: salaryTransactions.reduce((sum, t) => sum + t.amount, 0),
    teachers: salaryTransactions.filter((t) => t.employeeType === 'Teacher').reduce((sum, t) => sum + t.amount, 0),
    staff: salaryTransactions.filter((t) => t.employeeType === 'Staff').reduce((sum, t) => sum + t.amount, 0),
    thisMonth: filteredSalaries.reduce((sum, t) => sum + t.amount, 0),
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this salary entry?')) {
      try {
        deleteTransaction(id)
        toast.success('Salary entry deleted successfully')
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
              <h1 className="text-3xl font-bold text-gray-900">Salary Management</h1>
              <p className="text-gray-600 mt-2">Manage employee salaries and payments</p>
            </div>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Add Salary
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Salaries</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{formatRupee(stats.total)}</p>
                  </div>
                  <UserCog className="w-8 h-8 text-gray-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Teachers</p>
                    <p className="text-2xl font-bold text-blue-600 mt-2">{formatRupee(stats.teachers)}</p>
                  </div>
                  <UserCog className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Staff</p>
                    <p className="text-2xl font-bold text-purple-600 mt-2">{formatRupee(stats.staff)}</p>
                  </div>
                  <UserCog className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-green-600 mt-2">{formatRupee(stats.thisMonth)}</p>
                  </div>
                  <UserCog className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Filter by Month"
                  type="month"
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                />
                <Select
                  label="Filter by Type"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as EmployeeType | '')}
                  options={[
                    { value: '', label: 'All Types' },
                    { value: 'Teacher', label: 'Teacher' },
                    { value: 'Staff', label: 'Staff' },
                  ]}
                />
              </div>
            </CardContent>
          </Card>

          {/* Salary Records */}
          <Card>
            <CardHeader>
              <CardTitle>Salary Records ({filteredSalaries.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredSalaries.length === 0 ? (
                <div className="text-center py-12">
                  <UserCog className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Salary Records Found</h3>
                  <p className="text-gray-600 mb-4">
                    {filterMonth || filterType ? 'Try adjusting your filters' : 'Get started by adding your first salary entry'}
                  </p>
                  {!filterMonth && !filterType && (
                    <Button onClick={() => setShowAddModal(true)}>
                      <Plus className="w-5 h-5 mr-2" />
                      Add Salary Entry
                    </Button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Employee Name</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Type</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Salary Month</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Amount</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Payment Mode</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSalaries.map((salary) => (
                        <tr key={salary.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-600">{formatDateReadable(salary.date)}</td>
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">{salary.employeeName}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                salary.employeeType === 'Teacher'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-purple-100 text-purple-800'
                              }`}
                            >
                              {salary.employeeType}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{salary.salaryMonth || '-'}</td>
                          <td className="py-3 px-4 text-sm font-semibold text-right text-green-600">
                            {formatRupee(salary.amount)}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{salary.paymentMode}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end">
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(salary.id)}>
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
        </div>
      </div>

      {/* Add Salary Modal */}
      {showAddModal && (
        <SalaryModal
          onClose={() => setShowAddModal(false)}
        />
      )}
    </AdminLayout>
  )
}

function SalaryModal({ onClose }: { onClose: () => void }) {
  const { addTransaction, settings } = useSchool()
  const [formData, setFormData] = useState({
    date: getTodayISO(),
    employeeName: '',
    employeeType: 'Teacher' as EmployeeType,
    salaryMonth: '',
    amount: '',
    paymentMode: 'Cash' as any,
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.employeeName || !formData.amount) {
      toast.error('Please fill all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      addTransaction({
        type: 'salary',
        date: formData.date,
        amount: parseFloat(formData.amount),
        paymentMode: formData.paymentMode,
        notes: formData.notes || undefined,
        employeeType: formData.employeeType,
        employeeName: formData.employeeName,
        salaryMonth: formData.salaryMonth || '',
      })

      toast.success('Salary entry added successfully')
      onClose()
    } catch (error: any) {
      toast.error(error.message || 'Failed to add salary entry')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Add Salary Entry</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
            <Input
              label="Employee Name"
              type="text"
              value={formData.employeeName}
              onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
              required
            />
            <Select
              label="Employee Type"
              value={formData.employeeType}
              onChange={(e) => setFormData({ ...formData, employeeType: e.target.value as EmployeeType })}
              options={[
                { value: 'Teacher', label: 'Teacher' },
                { value: 'Staff', label: 'Staff' },
              ]}
              required
            />
            <Input
              label="Salary Month (YYYY-MM)"
              type="month"
              value={formData.salaryMonth}
              onChange={(e) => setFormData({ ...formData, salaryMonth: e.target.value })}
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
            />
          </div>
          <div className="flex gap-4 mt-6">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Saving...' : 'Add Salary'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
