'use client'

import React, { useState, useMemo } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { FileText, Download, AlertCircle } from 'lucide-react'
import { useSchool } from '@/contexts/SchoolContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatRupee } from '@/lib/utils/format'
import Link from 'next/link'

export default function FeeDueReportsPage() {
  const { students, transactions, feePlans, settings } = useSchool()
  const [selectedMonth, setSelectedMonth] = useState('')
  const [filterClass, setFilterClass] = useState('')

  // Calculate fee dues for each student
  const feeDues = useMemo(() => {
    const dues: Array<{
      student: any
      feePlan: any
      totalDue: number
      paid: number
      remaining: number
      unpaidMonths: number
    }> = []

    students.forEach((student) => {
      if (student.status !== 'Active') return

      if (filterClass && student.className !== filterClass) return

      const feePlan = feePlans.find((p) => p.studentId === student.id)
      if (!feePlan) return

      // Get all fee transactions for this student
      const studentTransactions = transactions.filter(
        (t) =>
          t.type === 'fee_collection' &&
          (t.studentId === student.id || t.admissionNo === student.admissionNo)
      )

      const paid = studentTransactions.reduce((sum, t) => sum + t.amount, 0)

      // Calculate expected fees (simplified - would need proper monthly calculation)
      const expectedFees = feePlan.tuitionFeeMonthly * 12 + feePlan.annualFee + feePlan.examFee
      const remaining = expectedFees - paid

      if (remaining > 0) {
        dues.push({
          student,
          feePlan,
          totalDue: expectedFees,
          paid,
          remaining,
          unpaidMonths: Math.ceil(remaining / feePlan.tuitionFeeMonthly),
        })
      }
    })

    return dues.sort((a, b) => b.remaining - a.remaining)
  }, [students, transactions, feePlans, filterClass])

  const totalDue = useMemo(() => {
    return feeDues.reduce((sum, d) => sum + d.remaining, 0)
  }, [feeDues])

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Fee Due Reports</h1>
            <p className="text-gray-600 mt-2">View students with pending fee payments</p>
          </div>

          {/* Summary Card */}
          <Card className="mb-6 bg-red-50 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700">Total Outstanding Fees</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">{formatRupee(totalDue)}</p>
                  <p className="text-sm text-red-600 mt-1">{feeDues.length} student(s) with pending fees</p>
                </div>
                <AlertCircle className="w-12 h-12 text-red-600" />
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
            </CardContent>
          </Card>

          {/* Fee Due List */}
          {feeDues.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Fee Dues Found</h3>
                <p className="text-gray-600">All students have cleared their fees or no fee plans are set.</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Students with Fee Dues ({feeDues.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Admission No</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Student Name</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Class</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Total Due</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Paid</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Remaining</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feeDues.map((due) => (
                        <tr key={due.student.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">{due.student.admissionNo}</td>
                          <td className="py-3 px-4 text-sm text-gray-900">{due.student.fullName}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{due.student.className}</td>
                          <td className="py-3 px-4 text-sm text-right text-gray-900">{formatRupee(due.totalDue)}</td>
                          <td className="py-3 px-4 text-sm text-right text-green-600">{formatRupee(due.paid)}</td>
                          <td className="py-3 px-4 text-sm font-semibold text-right text-red-600">
                            {formatRupee(due.remaining)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <Link href={`/admin/students/${due.student.id}`}>
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                              </Link>
                              <Link href={`/admin/quick-entry?studentId=${due.student.id}&type=fee_collection`}>
                                <Button size="sm">
                                  Collect Fee
                                </Button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
