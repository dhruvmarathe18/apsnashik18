'use client'

import React, { useState, useMemo } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { TrendingUp, Plus, Trash2 } from 'lucide-react'
import { useSchool } from '@/contexts/SchoolContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatRupee, formatDateReadable, getTodayISO } from '@/lib/utils/format'
import { Transaction, OtherIncome, IncomeSource } from '@/types/school'
import toast from 'react-hot-toast'

export default function IncomePage() {
  const { transactions, addTransaction, deleteTransaction, settings } = useSchool()
  const [showAddModal, setShowAddModal] = useState(false)
  const [filterMonth, setFilterMonth] = useState('')
  const [filterSource, setFilterSource] = useState('')

  const incomeTransactions = useMemo(() => {
    return transactions.filter((t): t is OtherIncome => t.type === 'other_income')
  }, [transactions])

  const filteredIncome = useMemo(() => {
    let filtered = incomeTransactions

    if (filterMonth) {
      const [year, month] = filterMonth.split('-').map(Number)
      const monthStart = new Date(year, month - 1, 1)
      filtered = filtered.filter((t) => {
        const tDate = new Date(t.date)
        return tDate.getMonth() === monthStart.getMonth() && tDate.getFullYear() === monthStart.getFullYear()
      })
    }

    if (filterSource) {
      filtered = filtered.filter((t) => t.incomeSource === filterSource)
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [incomeTransactions, filterMonth, filterSource])

  const sourceTotals = useMemo(() => {
    const totals: Record<string, number> = {}
    incomeTransactions.forEach((inc) => {
      totals[inc.incomeSource] = (totals[inc.incomeSource] || 0) + inc.amount
    })
    return totals
  }, [incomeTransactions])

  const stats = {
    total: incomeTransactions.reduce((sum, t) => sum + t.amount, 0),
    thisMonth: filteredIncome.reduce((sum, t) => sum + t.amount, 0),
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this income entry?')) {
      try {
        deleteTransaction(id)
        toast.success('Income entry deleted successfully')
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
              <h1 className="text-3xl font-bold text-gray-900">Other Income</h1>
              <p className="text-gray-600 mt-2">Track income from sources other than fees</p>
            </div>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Add Income
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Income</p>
                    <p className="text-2xl font-bold text-green-600 mt-2">{formatRupee(stats.total)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
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
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Source Summary */}
          {Object.keys(sourceTotals).length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Source-wise Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(sourceTotals).map(([source, total]) => (
                    <div key={source} className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">{source}</p>
                      <p className="text-lg font-bold text-green-600 mt-1">{formatRupee(total)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

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
                  label="Filter by Source"
                  value={filterSource}
                  onChange={(e) => setFilterSource(e.target.value)}
                  options={[
                    { value: '', label: 'All Sources' },
                    ...settings.incomeSources.map((source) => ({ value: source, label: source })),
                  ]}
                />
              </div>
            </CardContent>
          </Card>

          {/* Income Records */}
          <Card>
            <CardHeader>
              <CardTitle>Income Records ({filteredIncome.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredIncome.length === 0 ? (
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Income Records Found</h3>
                  <p className="text-gray-600 mb-4">
                    {filterMonth || filterSource ? 'Try adjusting your filters' : 'Get started by adding your first income entry'}
                  </p>
                  {!filterMonth && !filterSource && (
                    <Button onClick={() => setShowAddModal(true)}>
                      <Plus className="w-5 h-5 mr-2" />
                      Add Income
                    </Button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Source</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Amount</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Payment Mode</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Notes</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredIncome.map((income) => (
                        <tr key={income.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-600">{formatDateReadable(income.date)}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {income.incomeSource}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm font-semibold text-right text-green-600">
                            {formatRupee(income.amount)}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{income.paymentMode}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{income.notes || '-'}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end">
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(income.id)}>
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

      {/* Add Income Modal */}
      {showAddModal && (
        <IncomeModal
          onClose={() => setShowAddModal(false)}
        />
      )}
    </AdminLayout>
  )
}

function IncomeModal({ onClose }: { onClose: () => void }) {
  const { addTransaction, settings } = useSchool()
  const [formData, setFormData] = useState({
    date: getTodayISO(),
    incomeSource: 'Other' as IncomeSource,
    amount: '',
    paymentMode: 'Cash' as any,
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.amount) {
      toast.error('Please enter amount')
      return
    }

    setIsSubmitting(true)

    try {
      addTransaction({
        type: 'other_income',
        date: formData.date,
        amount: parseFloat(formData.amount),
        paymentMode: formData.paymentMode,
        notes: formData.notes || undefined,
        incomeSource: formData.incomeSource,
      } as Omit<Transaction, 'id' | 'createdAt'>)

      toast.success('Income added successfully')
      onClose()
    } catch (error: any) {
      toast.error(error.message || 'Failed to add income')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Add Income</h2>
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
            <Select
              label="Income Source"
              value={formData.incomeSource}
              onChange={(e) => setFormData({ ...formData, incomeSource: e.target.value as IncomeSource })}
              options={settings.incomeSources.map((source) => ({ value: source, label: source }))}
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
            />
          </div>
          <div className="flex gap-4 mt-6">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Saving...' : 'Add Income'}
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
