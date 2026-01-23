'use client'

import React, { useState, useMemo } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { FileText, Download, AlertCircle, Search } from 'lucide-react'
import { useSchool } from '@/contexts/SchoolContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatRupee } from '@/lib/utils/format'
import Link from 'next/link'
import { DatePickerWithRange } from '@/components/ui/DatePickerWithRange'
import { type DateRange } from 'react-day-picker'
import { parseISO } from 'date-fns'

export default function FeeDueReportsPage() {
  const { students, transactions, feePlans, settings } = useSchool()
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [filterClass, setFilterClass] = useState('')
  const [searchName, setSearchName] = useState('')

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

      // Filter by student name search
      if (searchName) {
        const searchTerm = searchName.toLowerCase()
        const studentName = student.fullName.toLowerCase()
        const admissionNo = student.admissionNo.toLowerCase()
        if (!studentName.includes(searchTerm) && !admissionNo.includes(searchTerm)) {
          return
        }
      }

      const feePlan = feePlans.find((p) => p.studentId === student.id)
      if (!feePlan) return

      // Get all fee transactions for this student
      let studentTransactions = transactions.filter(
        (t) =>
          t.type === 'fee_collection' &&
          (t.studentId === student.id || t.admissionNo === student.admissionNo)
      )

      // Filter by date range if provided
      if (dateRange?.from || dateRange?.to) {
        studentTransactions = studentTransactions.filter((t) => {
          const tDate = parseISO(t.date)
          const transactionDate = new Date(tDate.getFullYear(), tDate.getMonth(), tDate.getDate())
          
          if (dateRange.from && dateRange.to) {
            const startDateObj = new Date(dateRange.from.getFullYear(), dateRange.from.getMonth(), dateRange.from.getDate())
            const endDateObj = new Date(dateRange.to.getFullYear(), dateRange.to.getMonth(), dateRange.to.getDate())
            return transactionDate >= startDateObj && transactionDate <= endDateObj
          } else if (dateRange.from) {
            const startDateObj = new Date(dateRange.from.getFullYear(), dateRange.from.getMonth(), dateRange.from.getDate())
            return transactionDate >= startDateObj
          } else if (dateRange.to) {
            const endDateObj = new Date(dateRange.to.getFullYear(), dateRange.to.getMonth(), dateRange.to.getDate())
            return transactionDate <= endDateObj
          }
          return true
        })
      }

      const paid = studentTransactions.reduce((sum, t) => sum + t.amount, 0)

      // Calculate expected fees (annual fee + exam fee + book fee + uniform fee + misc fee - discount)
      const expectedFees = feePlan.annualFee + feePlan.examFee + feePlan.bookFee + feePlan.uniformFee + (feePlan.miscFee || 0) - (feePlan.discount || 0)
      const remaining = expectedFees - paid

      if (remaining > 0) {
        dues.push({
          student,
          feePlan,
          totalDue: expectedFees,
          paid,
          remaining,
          unpaidMonths: 0, // No longer tracking unpaid months since we removed monthly tuition
        })
      }
    })

    return dues.sort((a, b) => b.remaining - a.remaining)
  }, [students, transactions, feePlans, filterClass, searchName, dateRange])

  const totalDue = useMemo(() => {
    return feeDues.reduce((sum, d) => sum + d.remaining, 0)
  }, [feeDues])

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text">Fee Due Reports</h1>
            <p className="text-text-muted mt-2">View students with pending fee payments</p>
          </div>

          {/* Summary Card */}
          <Card className="mb-6 bg-destructive/10 border-destructive/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-destructive">Total Outstanding Fees</p>
                  <p className="text-3xl font-bold text-destructive mt-2">{formatRupee(totalDue)}</p>
                  <p className="text-sm text-destructive/80 mt-1">{feeDues.length} student(s) with pending fees</p>
                </div>
                <AlertCircle className="w-12 h-12 text-destructive" />
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-dim w-5 h-5 z-10 pointer-events-none" />
                  <Input
                    label="Search by Student Name"
                    type="text"
                    placeholder="Search by name or admission number..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
                <DatePickerWithRange
                  date={dateRange}
                  onDateChange={setDateRange}
                  label="Filter by Date Range"
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
                <FileText className="w-16 h-16 text-text-subtle mx-auto mb-4" />
                <h3 className="text-lg font-medium text-text mb-2">No Fee Dues Found</h3>
                <p className="text-text-muted">All students have cleared their fees or no fee plans are set.</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Students with Fee Dues ({feeDues.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto bg-surface-2 rounded-xl ring-1 ring-border/40 p-6">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Admission No</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Student Name</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Class</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-text-muted">Total Due</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-text-muted">Paid</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-text-muted">Remaining</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-text-muted">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feeDues.map((due) => (
                        <tr key={due.student.id}>
                          <td className="py-3 px-4 text-sm font-medium text-text">{due.student.admissionNo}</td>
                          <td className="py-3 px-4 text-sm text-text">{due.student.fullName}</td>
                          <td className="py-3 px-4 text-sm text-text-muted">{due.student.className}</td>
                          <td className="py-3 px-4 text-sm text-right text-text">{formatRupee(due.totalDue)}</td>
                          <td className="py-3 px-4 text-sm text-right text-success">{formatRupee(due.paid)}</td>
                          <td className="py-3 px-4 text-sm font-semibold text-right text-destructive">
                            {formatRupee(due.remaining)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <Link href={`/admin/students/${due.student.id}`}>
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                              </Link>
                              <Link href={`/admin/fees?studentId=${due.student.id}&from=fee-due-reports`}>
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
