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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Student Not Found</h2>
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
                <h1 className="text-3xl font-bold text-gray-900">{student.fullName}</h1>
                <p className="text-gray-600 mt-2">
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
                      <p className="text-sm text-gray-600">Admission Number</p>
                      <p className="font-medium text-gray-900">{student.admissionNo}</p>
                    </div>
                    {student.rollNo && (
                      <div>
                        <p className="text-sm text-gray-600">Roll Number</p>
                        <p className="font-medium text-gray-900">{student.rollNo}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600">Class</p>
                      <p className="font-medium text-gray-900">{student.className}{student.section ? ` - ${student.section}` : ''}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Academic Year</p>
                      <p className="font-medium text-gray-900">{student.academicYear}</p>
                    </div>
                    {student.gender && (
                      <div>
                        <p className="text-sm text-gray-600">Gender</p>
                        <p className="font-medium text-gray-900">{student.gender}</p>
                      </div>
                    )}
                    {student.dateOfBirth && (
                      <div>
                        <p className="text-sm text-gray-600">Date of Birth</p>
                        <p className="font-medium text-gray-900">{formatDateReadable(student.dateOfBirth)}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          student.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : student.status === 'Inactive'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
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
                        <p className="text-sm text-gray-600">Father's Name</p>
                        <p className="font-medium text-gray-900">{student.fatherName}</p>
                      </div>
                    )}
                    {student.motherName && (
                      <div>
                        <p className="text-sm text-gray-600">Mother's Name</p>
                        <p className="font-medium text-gray-900">{student.motherName}</p>
                      </div>
                    )}
                    {student.guardianName && (
                      <div>
                        <p className="text-sm text-gray-600">Guardian Name</p>
                        <p className="font-medium text-gray-900">{student.guardianName}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600">Primary Phone</p>
                      <p className="font-medium text-gray-900">{student.phonePrimary}</p>
                    </div>
                    {student.phoneSecondary && (
                      <div>
                        <p className="text-sm text-gray-600">Secondary Phone</p>
                        <p className="font-medium text-gray-900">{student.phoneSecondary}</p>
                      </div>
                    )}
                    {(student.addressLine1 || student.city || student.state) && (
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-medium text-gray-900">
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
                        <p className="text-sm text-gray-600">Bus Route</p>
                        <p className="font-medium text-gray-900">{student.busRouteId || 'Not assigned'}</p>
                      </div>
                      {student.busFeeMonthly && (
                        <div>
                          <p className="text-sm text-gray-600">Monthly Bus Fee</p>
                          <p className="font-medium text-gray-900">{formatRupee(student.busFeeMonthly)}</p>
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
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Date</th>
                            <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Fee Type</th>
                            <th className="text-right py-2 px-4 text-sm font-medium text-gray-700">Amount</th>
                            <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Payment Mode</th>
                          </tr>
                        </thead>
                        <tbody>
                          {studentTransactions.map((transaction) => (
                            <tr key={transaction.id} className="border-b">
                              <td className="py-2 px-4 text-sm text-gray-600">{formatDateReadable(transaction.date)}</td>
                              <td className="py-2 px-4 text-sm text-gray-900">
                                {transaction.type === 'fee_collection' ? transaction.feeType : '-'}
                              </td>
                              <td className="py-2 px-4 text-sm font-semibold text-right text-green-600">
                                {formatRupee(transaction.amount)}
                              </td>
                              <td className="py-2 px-4 text-sm text-gray-600">{transaction.paymentMode}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">Total Paid:</span>
                        <span className="text-lg font-bold text-green-600">{formatRupee(totalPaid)}</span>
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
                      <p className="text-sm text-gray-600">Total Fee Paid</p>
                      <p className="text-2xl font-bold text-green-600">{formatRupee(totalPaid)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Transactions</p>
                      <p className="text-2xl font-bold text-gray-900">{studentTransactions.length}</p>
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
                        <span className="text-sm text-gray-600">Tuition Fee:</span>
                        <span className="text-sm font-medium">{formatRupee(feePlan.tuitionFeeMonthly)}/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Annual Fee:</span>
                        <span className="text-sm font-medium">{formatRupee(feePlan.annualFee)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Exam Fee:</span>
                        <span className="text-sm font-medium">{formatRupee(feePlan.examFee)}</span>
                      </div>
                      {feePlan.discount > 0 && (
                        <div className="flex justify-between text-red-600">
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
                    <Link href={`/admin/quick-entry?studentId=${student.id}`} className="block">
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
