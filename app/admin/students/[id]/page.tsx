'use client'

import React, { useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import { useSchool } from '@/contexts/SchoolContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatRupee, formatDateReadable } from '@/lib/utils/format'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function StudentProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { getStudentById, deleteStudent, transactions, getFeePlanByStudentId } = useSchool()
  
  const student = useMemo(() => {
    return getStudentById(params.id as string)
  }, [params.id, getStudentById])

  const feePlan = useMemo(() => {
    if (!student) return null
    return getFeePlanByStudentId(student.id)
  }, [student, getFeePlanByStudentId])

  const studentTransactions = useMemo(() => {
    if (!student) return []
    return transactions.filter(
      (t) => t.type === 'fee_collection' && (t.studentId === student.id || t.admissionNo === student.admissionNo)
    )
  }, [student, transactions])

  const totalPaid = useMemo(() => {
    return studentTransactions.reduce((sum, t) => sum + t.amount, 0)
  }, [studentTransactions])

  if (!student) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-text mb-4">Student Not Found</h2>
            <Link href="/admin/students">
              <Button>Back to Students</Button>
            </Link>
          </div>
        </div>
      </AdminLayout>
    )
  }

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete ${student.fullName}?\n\nThis will also delete:\n- All fee collection transactions\n- Fee plan\n- All related data\n\nThis action cannot be undone!`)) {
      try {
        await deleteStudent(student.id)
        // Toast is shown in deleteStudent function
        setTimeout(() => {
          router.push('/admin/students')
        }, 1000)
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete student')
      }
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/admin/students">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Students
              </Button>
            </Link>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-text">{student.fullName}</h1>
                <p className="text-text-muted mt-2">
                  {student.className}{student.section ? ` - ${student.section}` : ''} • Admission No: {student.admissionNo}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Student Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Student Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-text-dim">Admission Number</p>
                      <p className="font-medium text-text">{student.admissionNo}</p>
                    </div>
                    {student.rollNo && (
                      <div>
                        <p className="text-sm text-text-dim">Roll Number</p>
                        <p className="font-medium text-text">{student.rollNo}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-text-dim">Class</p>
                      <p className="font-medium text-text">{student.className}{student.section ? ` - ${student.section}` : ''}</p>
                    </div>
                    {student.aadharNumber && (
                      <div>
                        <p className="text-sm text-text-dim">Aadhar Number</p>
                        <p className="font-medium text-text">{student.aadharNumber}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-text-dim">Academic Year</p>
                      <p className="font-medium text-text">{student.academicYear}</p>
                    </div>
                    {student.gender && (
                      <div>
                        <p className="text-sm text-text-dim">Gender</p>
                        <p className="font-medium text-text">{student.gender}</p>
                      </div>
                    )}
                    {student.dateOfBirth && (
                      <div>
                        <p className="text-sm text-text-dim">Date of Birth</p>
                        <p className="font-medium text-text">{formatDateReadable(student.dateOfBirth)}</p>
                      </div>
                    )}
                    {student.birthPlace && (
                      <div>
                        <p className="text-sm text-text-dim">Birth Place</p>
                        <p className="font-medium text-text">{student.birthPlace}</p>
                      </div>
                    )}
                    {student.bloodGroup && (
                      <div>
                        <p className="text-sm text-text-dim">Blood Group</p>
                        <p className="font-medium text-text">{student.bloodGroup}</p>
                      </div>
                    )}
                    {student.casteCategory && (
                      <div>
                        <p className="text-sm text-text-dim">Caste Belongs To</p>
                        <p className="font-medium text-text">
                          {student.casteCategory}
                          {student.casteCategory === 'Other' && student.casteOther
                            ? ` - ${student.casteOther}`
                            : ''}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-text-dim">Status</p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          student.status === 'Active'
                            ? 'bg-success/20 text-success'
                            : student.status === 'Inactive'
                            ? 'bg-warning/20 text-warning'
                            : 'bg-muted/50 text-text-dim'
                        }`}
                      >
                        {student.status}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                      <div className="space-y-4">
                    {student.fatherName && (
                      <div>
                        <p className="text-sm text-text-dim">Father's Name</p>
                        <p className="font-medium text-text">{student.fatherName}</p>
                      </div>
                    )}
                    {student.motherName && (
                      <div>
                        <p className="text-sm text-text-dim">Mother's Name</p>
                        <p className="font-medium text-text">{student.motherName}</p>
                      </div>
                    )}
                    {student.guardianName && (
                      <div>
                        <p className="text-sm text-text-dim">Guardian Name</p>
                        <p className="font-medium text-text">{student.guardianName}</p>
                      </div>
                    )}
                    {student.previousSchoolName && (
                      <div>
                        <p className="text-sm text-text-dim">Previous School Name</p>
                        <p className="font-medium text-text">{student.previousSchoolName}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-text-dim">Primary Phone</p>
                      <p className="font-medium text-text">{student.phonePrimary}</p>
                    </div>
                    {student.phoneSecondary && (
                      <div>
                        <p className="text-sm text-text-dim">Secondary Phone</p>
                        <p className="font-medium text-text">{student.phoneSecondary}</p>
                      </div>
                    )}
                    {(student.addressLine1 || student.city || student.state) && (
                      <div>
                        <p className="text-sm text-text-dim">Address</p>
                        <p className="font-medium text-text">
                          {[student.addressLine1, student.addressLine2, student.city, student.state, student.pincode]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Transport Information */}
              {student.busOpted && (
                <Card>
                  <CardHeader>
                    <CardTitle>Transport Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="space-y-4">
                      <div>
                        <p className="text-sm text-text-dim">Bus Route</p>
                        <p className="font-medium text-text">{student.busRouteId || 'Not assigned'}</p>
                      </div>
                      {student.busRouteAddress && (
                        <div>
                          <p className="text-sm text-text-dim">Bus Route Address</p>
                          <p className="font-medium text-text">{student.busRouteAddress}</p>
                        </div>
                      )}
                      {student.busFeeMonthly && (
                        <div>
                          <p className="text-sm text-text-dim">Monthly Bus Fee</p>
                          <p className="font-medium text-text">{formatRupee(student.busFeeMonthly)}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Fee Transactions */}
              {studentTransactions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Fee Payment History</CardTitle>
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
                          </tr>
                        </thead>
                        <tbody>
                          {studentTransactions.map((transaction) => (
                            <tr key={transaction.id}>
                              <td className="py-2 px-4 text-sm text-text-muted">{formatDateReadable(transaction.date)}</td>
                              <td className="py-2 px-4 text-sm text-text">
                                {transaction.type === 'fee_collection' ? transaction.feeType : '-'}
                              </td>
                              <td className="py-2 px-4 text-sm font-semibold text-right text-success">
                                {formatRupee(transaction.amount)}
                              </td>
                              <td className="py-2 px-4 text-sm text-text-muted">{transaction.paymentMode}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border/20 px-6 pb-6">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-text">Total Paid:</span>
                        <span className="text-lg font-bold text-success">{formatRupee(totalPaid)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-text-muted">Total Fee Paid</p>
                      <p className="text-2xl font-bold text-success">{formatRupee(totalPaid)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-text-muted">Transactions</p>
                      <p className="text-2xl font-bold text-text">{studentTransactions.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Fee Plan */}
              {feePlan && (
                <Card>
                  <CardHeader>
                    <CardTitle>Fee Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-text-muted">Tuition Fee:</span>
                        <span className="text-sm font-medium text-text">{formatRupee(feePlan.annualFee)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-text-muted">Exam Fee:</span>
                        <span className="text-sm font-medium text-text">{formatRupee(feePlan.examFee)}</span>
                      </div>
                      {feePlan.discount > 0 && (
                        <div className="flex justify-between text-destructive">
                          <span className="text-sm">Discount:</span>
                          <span className="text-sm font-medium">-{formatRupee(feePlan.discount)}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Link href={`/admin/fees?studentId=${student.id}`} className="block">
                      <Button variant="outline" className="w-full">
                        Collect Fee
                      </Button>
                    </Link>
                    <Link href={`/admin/fee-ledger?studentId=${student.id}`} className="block">
                      <Button variant="outline" className="w-full">
                        View Fee Ledger
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
