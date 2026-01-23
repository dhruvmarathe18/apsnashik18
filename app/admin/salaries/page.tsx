'use client'

import React, { useState, useMemo } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { UserCog, Plus, Trash2, Edit, ArrowLeft } from 'lucide-react'
import { useSchool } from '@/contexts/SchoolContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatRupee, formatDateReadable, getTodayISO } from '@/lib/utils/format'
import { Transaction, Salary, EmployeeType } from '@/types/school'
import toast from 'react-hot-toast'

export default function SalariesPage() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction, settings } = useSchool()
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingSalary, setEditingSalary] = useState<Salary | null>(null)
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
              <h1 className="text-3xl font-bold text-text">Salary Management</h1>
              <p className="text-text-muted mt-2">Manage employee salaries and payments</p>
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
                    <p className="text-sm font-medium text-text-muted">Total Salaries</p>
                    <p className="text-2xl font-bold text-text mt-2">{formatRupee(stats.total)}</p>
                  </div>
                  <UserCog className="w-8 h-8 text-text-muted" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-muted">Teachers</p>
                    <p className="text-2xl font-bold text-primary mt-2">{formatRupee(stats.teachers)}</p>
                  </div>
                  <UserCog className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-muted">Staff</p>
                    <p className="text-2xl font-bold text-purple-500 mt-2">{formatRupee(stats.staff)}</p>
                  </div>
                  <UserCog className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-muted">This Month</p>
                    <p className="text-2xl font-bold text-success mt-2">{formatRupee(stats.thisMonth)}</p>
                  </div>
                  <UserCog className="w-8 h-8 text-success" />
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
            <CardContent className="p-0">
              {filteredSalaries.length === 0 ? (
                <div className="text-center py-12 px-6">
                  <UserCog className="w-16 h-16 text-text-subtle mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-text mb-2">No Salary Records Found</h3>
                  <p className="text-text-muted mb-4">
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
                <div className="overflow-x-auto bg-surface-2 rounded-xl ring-1 ring-border/40 p-6">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Employee Name</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Type</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Salary Month</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-text-muted">Amount</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Payment Mode</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-text-muted">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSalaries.map((salary) => (
                        <tr key={salary.id}>
                          <td className="py-3 px-4 text-sm text-text-muted">{formatDateReadable(salary.date)}</td>
                          <td className="py-3 px-4 text-sm font-medium text-text">{salary.employeeName}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                salary.employeeType === 'Teacher'
                                  ? 'bg-primary/20 text-primary'
                                  : 'bg-purple-500/20 text-purple-400'
                              }`}
                            >
                              {salary.employeeType}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-text-muted">{salary.salaryMonth || '-'}</td>
                          <td className="py-3 px-4 text-sm font-semibold text-right text-success">
                            {formatRupee(salary.amount)}
                          </td>
                          <td className="py-3 px-4 text-sm text-text-muted">{salary.paymentMode}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => {
                                  setEditingSalary(salary)
                                  setShowAddModal(true)
                                }}
                              >
                                <Edit className="w-4 h-4 text-primary" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(salary.id)}>
                                <Trash2 className="w-4 h-4 text-destructive" />
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

      {/* Add/Edit Salary Modal */}
      {showAddModal && (
        <SalaryModal
          salary={editingSalary}
          onClose={() => {
            setShowAddModal(false)
            setEditingSalary(null)
          }}
        />
      )}
    </AdminLayout>
  )
}

function SalaryModal({ salary, onClose }: { salary: Salary | null; onClose: () => void }) {
  const { addTransaction, updateTransaction, settings, transactions } = useSchool()
  const [formData, setFormData] = useState({
    date: salary?.date || getTodayISO(),
    employeeName: salary?.employeeName || '',
    employeeType: (salary?.employeeType || 'Teacher') as EmployeeType,
    salaryMonth: salary?.salaryMonth || '',
    amount: salary?.amount.toString() || '',
    paymentMode: (salary?.paymentMode || 'Cash') as any,
    notes: salary?.notes || '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [useDropdown, setUseDropdown] = useState(true)
  const [isClosing, setIsClosing] = useState(false)

  // Get unique employee names from previous salary records
  const previousEmployees = useMemo(() => {
    const salaryTransactions = transactions.filter((t): t is Salary => t.type === 'salary')
    const employeeMap = new Map<string, { name: string; type: EmployeeType; lastDate: string }>()
    
    salaryTransactions.forEach((salary) => {
      if (salary.employeeName) {
        const existing = employeeMap.get(salary.employeeName)
        // Store the most recent entry for each employee
        if (!existing || new Date(salary.date) > new Date(existing.lastDate)) {
          employeeMap.set(salary.employeeName, {
            name: salary.employeeName,
            type: salary.employeeType,
            lastDate: salary.date,
          })
        }
      }
    })
    
    return Array.from(employeeMap.values())
      .map(({ name, type }) => ({ name, type }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [transactions])

  const handleEmployeeSelect = (employeeName: string) => {
    const employee = previousEmployees.find((e) => e.name === employeeName)
    if (employee) {
      setFormData((prev) => ({
        ...prev,
        employeeName: employee.name,
        employeeType: employee.type,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.employeeName || !formData.amount) {
      toast.error('Please fill all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      if (salary) {
        // Update existing salary
        await updateTransaction(salary.id, {
          type: 'salary',
          date: formData.date,
          amount: parseFloat(formData.amount),
          paymentMode: formData.paymentMode,
          notes: formData.notes || undefined,
          employeeType: formData.employeeType,
          employeeName: formData.employeeName,
          salaryMonth: formData.salaryMonth || '',
        } as Partial<Transaction>)
        toast.success('Salary entry updated successfully')
      } else {
        // Add new salary
        addTransaction({
          type: 'salary',
          date: formData.date,
          amount: parseFloat(formData.amount),
          paymentMode: formData.paymentMode,
          notes: formData.notes || undefined,
          employeeType: formData.employeeType,
          employeeName: formData.employeeName,
          salaryMonth: formData.salaryMonth || '',
        } as Omit<Transaction, 'id' | 'createdAt'>)
        toast.success('Salary entry added successfully')
      }

      // Close with animation
      handleClose()
    } catch (error: any) {
      toast.error(error.message || `Failed to ${salary ? 'update' : 'add'} salary entry`)
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setFormData({
        date: getTodayISO(),
        employeeName: '',
        employeeType: 'Teacher' as EmployeeType,
        salaryMonth: '',
        amount: '',
        paymentMode: 'Cash' as any,
        notes: '',
      })
      setUseDropdown(true)
      setIsClosing(false)
      onClose()
    }, 300) // Match animation duration
  }

  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`bg-card rounded-lg shadow-xl max-w-2xl w-full transition-all duration-300 ease-in-out ring-1 ring-border/40 ${
          isClosing 
            ? 'transform translate-x-[100%] opacity-0 scale-95' 
            : 'transform translate-x-0 opacity-100 scale-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-border/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {salary && (
              <button
                onClick={handleClose}
                className="p-1 hover:bg-surface-3 rounded-full transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-text-muted" />
              </button>
            )}
            <h2 className="text-2xl font-bold text-text">
              {salary ? 'Edit Salary Entry' : 'Add Salary Entry'}
            </h2>
          </div>
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
            {previousEmployees.length > 0 && useDropdown ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-text">Employee Name</label>
                  <button
                    type="button"
                    onClick={() => setUseDropdown(false)}
                    className="text-xs text-primary hover:opacity-80"
                  >
                    Enter manually
                  </button>
                </div>
                <Select
                  value={formData.employeeName}
                  onChange={(e) => {
                    const selectedName = e.target.value
                    handleEmployeeSelect(selectedName)
                  }}
                  options={[
                    { value: '', label: 'Select Employee' },
                    ...previousEmployees.map((emp) => ({
                      value: emp.name,
                      label: `${emp.name} (${emp.type})`,
                    })),
                  ]}
                  required
                />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-text">Employee Name</label>
                  {previousEmployees.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setUseDropdown(true)}
                      className="text-xs text-primary hover:opacity-80"
                    >
                      Select from list
                    </button>
                  )}
                </div>
                <Input
                  type="text"
                  value={formData.employeeName}
                  onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                  placeholder="Enter employee name"
                  required
                />
              </div>
            )}
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
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
