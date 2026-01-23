'use client'

import React, { useState, useMemo } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { BookOpen, Search, Download } from 'lucide-react'
import { useSchool } from '@/contexts/SchoolContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatRupee, formatDateReadable } from '@/lib/utils/format'
import { FeeCollection } from '@/types/school'
import Link from 'next/link'

export default function FeeLedgerPage() {
  const { students, transactions, settings } = useSchool()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterClass, setFilterClass] = useState('')
  const [selectedStudentId, setSelectedStudentId] = useState('')

  const feeTransactions = useMemo(() => {
    return transactions.filter((t): t is FeeCollection => t.type === 'fee_collection')
  }, [transactions])

  const studentLedgers = useMemo(() => {
    const ledgerMap: Record<string, { student: any; transactions: FeeCollection[]; total: number }> = {}

    feeTransactions.forEach((transaction) => {
      const studentId = transaction.studentId || transaction.admissionNo || 'unknown'
      
      if (!ledgerMap[studentId]) {
        const student = transaction.studentId
          ? students.find((s) => s.id === transaction.studentId)
          : transaction.admissionNo
          ? students.find((s) => s.admissionNo === transaction.admissionNo)
          : null

        ledgerMap[studentId] = {
          student: student || {
            admissionNo: transaction.admissionNo || '-',
            fullName: transaction.studentName || '-',
            className: transaction.class || '-',
          },
          transactions: [],
          total: 0,
        }
      }

      ledgerMap[studentId].transactions.push(transaction)
      ledgerMap[studentId].total += transaction.amount
    })

    let ledgers = Object.values(ledgerMap)

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      ledgers = ledgers.filter(
        (l) =>
          l.student.fullName.toLowerCase().includes(term) ||
          l.student.admissionNo.toLowerCase().includes(term)
      )
    }

    if (filterClass) {
      ledgers = ledgers.filter((l) => l.student.className === filterClass)
    }

    if (selectedStudentId) {
      ledgers = ledgers.filter((l) => l.student.id === selectedStudentId)
    }

    return ledgers.sort((a, b) => b.total - a.total)
  }, [feeTransactions, students, searchTerm, filterClass, selectedStudentId])

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text">Fee Ledger</h1>
            <p className="text-text-muted mt-2">View student fee payment history and balances</p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-dim w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search by name or admission no..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
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
                  label="Select Student"
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  options={[
                    { value: '', label: 'All Students' },
                    ...students.map((s) => ({ value: s.id, label: `${s.admissionNo} - ${s.fullName}` })),
                  ]}
                />
              </div>
            </CardContent>
          </Card>

          {/* Student Ledgers */}
          {studentLedgers.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="w-16 h-16 text-text-subtle mx-auto mb-4" />
                <h3 className="text-lg font-medium text-text mb-2">No Fee Records Found</h3>
                <p className="text-text-muted">No fee transactions found for the selected filters.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {studentLedgers.map((ledger) => (
                <Card key={ledger.student.id || ledger.student.admissionNo}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg">
                          {ledger.student.fullName} ({ledger.student.admissionNo})
                        </CardTitle>
                        <p className="text-sm text-text-dim mt-1">
                          {ledger.student.className} • {ledger.transactions.length} transaction(s)
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-text-muted">Total Paid</p>
                        <p className="text-2xl font-bold text-success">{formatRupee(ledger.total)}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto bg-surface-2 rounded-xl ring-1 ring-border/40 p-6">
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="text-left py-2 px-4 text-sm font-medium text-text-muted">Date</th>
                            <th className="text-left py-2 px-4 text-sm font-medium text-text-muted">Fee Type</th>
                            <th className="text-right py-2 px-4 text-sm font-medium text-text-muted">Amount</th>
                            <th className="text-left py-2 px-4 text-sm font-medium text-text-muted">Payment Mode</th>
                            <th className="text-left py-2 px-4 text-sm font-medium text-text-muted">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ledger.transactions
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .map((transaction) => (
                              <tr key={transaction.id}>
                                <td className="py-2 px-4 text-sm text-text-muted">{formatDateReadable(transaction.date)}</td>
                                <td className="py-2 px-4 text-sm text-text">{transaction.feeType}</td>
                                <td className="py-2 px-4 text-sm font-semibold text-right text-success">
                                  {formatRupee(transaction.amount)}
                                </td>
                                <td className="py-2 px-4 text-sm text-text-muted">{transaction.paymentMode}</td>
                                <td className="py-2 px-4">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      transaction.status === 'Paid'
                                        ? 'bg-success/20 text-success'
                                        : 'bg-warning/20 text-warning'
                                    }`}
                                  >
                                    {transaction.status || 'Paid'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                    {ledger.student.id && (
                      <div className="mt-4 pt-4 border-t border-border/20 px-6 pb-6">
                        <Link href={`/admin/students/${ledger.student.id}`}>
                          <Button variant="outline" className="w-full">
                            View Full Profile
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
