'use client'

import React, { useState, useMemo, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Users, Plus, Search, FileText, Edit, Trash2, Eye, Upload } from 'lucide-react'
import { useSchool } from '@/contexts/SchoolContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatDateReadable, formatRupee } from '@/lib/utils/format'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Student, StudentStatus } from '@/types/school'

import BulkAddStudentsModal from '@/components/admin/BulkAddStudentsModal'

export default function StudentsPage() {
  const { students, deleteStudent, settings } = useSchool()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterClass, setFilterClass] = useState('')
  const [filterStatus, setFilterStatus] = useState<StudentStatus | ''>('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showBulkAddModal, setShowBulkAddModal] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)

  const filteredStudents = useMemo(() => {
    let result = students

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (s) =>
          s.fullName.toLowerCase().includes(term) ||
          s.admissionNo.toLowerCase().includes(term) ||
          s.phonePrimary.includes(term) ||
          (s.rollNo && s.rollNo.toLowerCase().includes(term))
      )
    }

    if (filterClass) {
      result = result.filter((s) => s.className === filterClass)
    }

    if (filterStatus) {
      result = result.filter((s) => s.status === filterStatus)
    }

    return result
  }, [students, searchTerm, filterClass, filterStatus])

  const stats = {
    total: students.length,
    active: students.filter((s) => s.status === 'Active').length,
    withBus: students.filter((s) => s.busOpted).length,
    defaulters: 0, // Would need fee ledger calculation
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?\n\nThis will also delete:\n- All fee collection transactions\n- Fee plan\n- All related data\n\nThis action cannot be undone!`)) {
      try {
        await deleteStudent(id)
        // Toast is shown in deleteStudent function
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete student')
      }
    }
  }

  return (
    <AdminLayout>
      <div className="p-3 sm:p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-text">Student Management</h1>
              <p className="text-text-muted mt-2">Manage student records, admissions, and information</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setShowBulkAddModal(true)}>
                <Upload className="w-5 h-5 mr-2" />
                Bulk Add
              </Button>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="w-5 h-5 mr-2" />
                Add Student
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-muted">Total Students</p>
                    <p className="text-2xl font-bold text-text mt-2">{stats.total}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-muted">Active Students</p>
                    <p className="text-2xl font-bold text-green-600 mt-2">{stats.active}</p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-muted">With Bus</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2">{stats.withBus}</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-muted">Fee Defaulters</p>
                    <p className="text-2xl font-bold text-red-600 mt-2">{stats.defaulters}</p>
                  </div>
                  <FileText className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-dim w-5 h-5 z-10 pointer-events-none" />
                  <Input
                    type="text"
                    placeholder="Search by name, admission number, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
                <Select
                  value={filterClass}
                  onChange={(e) => setFilterClass(e.target.value)}
                  options={[
                    { value: '', label: 'All Classes' },
                    ...settings.classes.map((cls) => ({ value: cls, label: cls })),
                  ]}
                />
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as StudentStatus | '')}
                  options={[
                    { value: '', label: 'All Status' },
                    { value: 'Active', label: 'Active' },
                    { value: 'Inactive', label: 'Inactive' },
                    { value: 'Left', label: 'Left' },
                  ]}
                />
              </div>
            </CardContent>
          </Card>

          {/* Students Table */}
          <Card>
            <CardHeader>
              <CardTitle>Student List ({filteredStudents.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredStudents.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-text-subtle mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-text mb-2">No Students Found</h3>
                  <p className="text-text-muted mb-4">
                    {searchTerm || filterClass || filterStatus
                      ? 'Try adjusting your search filters'
                      : 'Get started by adding your first student'}
                  </p>
                  {!searchTerm && !filterClass && !filterStatus && (
                    <Button onClick={() => setShowAddModal(true)}>
                      <Plus className="w-5 h-5 mr-2" />
                      Add Your First Student
                    </Button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6">
                  <div className="min-w-full inline-block align-middle">
                    <div className="overflow-hidden bg-surface-2 rounded-xl ring-1 ring-border/40 p-4">
                      <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-text-muted whitespace-nowrap">Admission No</th>
                        <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-text-muted whitespace-nowrap">Name</th>
                        <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-text-muted whitespace-nowrap">Class</th>
                        <th className="hidden sm:table-cell text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-text-muted whitespace-nowrap">Phone</th>
                        <th className="hidden md:table-cell text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-text-muted whitespace-nowrap">Bus</th>
                        <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-text-muted whitespace-nowrap">Status</th>
                        <th className="text-right py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-text-muted whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student) => (
                        <tr key={student.id}>
                          <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-text whitespace-nowrap">{student.admissionNo}</td>
                          <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm text-text">{student.fullName}</td>
                          <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm text-text-muted">{student.className}{student.section ? ` - ${student.section}` : ''}</td>
                          <td className="hidden sm:table-cell py-3 px-2 sm:px-4 text-xs sm:text-sm text-text-muted">{student.phonePrimary}</td>
                          <td className="hidden md:table-cell py-3 px-2 sm:px-4 text-xs sm:text-sm text-text-muted">
                            {student.busOpted ? (
                              <span className="text-success font-medium">Yes</span>
                            ) : (
                              <span className="text-text-subtle">No</span>
                            )}
                          </td>
                          <td className="py-3 px-2 sm:px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                student.status === 'Active'
                                  ? 'bg-success/20 text-success'
                                  : student.status === 'Inactive'
                                  ? 'bg-warning/20 text-warning'
                                  : 'bg-muted text-text-muted'
                              }`}
                            >
                              {student.status}
                            </span>
                          </td>
                          <td className="py-3 px-2 sm:px-4">
                            <div className="flex items-center justify-end gap-1 sm:gap-2">
                              <Link href={`/admin/students/${student.id}`}>
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingStudent(student)
                                  setShowAddModal(true)
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(student.id, student.fullName)}
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
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add/Edit Modal */}
          {showAddModal && (
            <StudentModal
              student={editingStudent}
              onClose={() => {
                setShowAddModal(false)
                setEditingStudent(null)
              }}
            />
          )}

          {/* Bulk Add Modal */}
          {showBulkAddModal && (
            <BulkAddStudentsModal
              isOpen={showBulkAddModal}
              onClose={() => setShowBulkAddModal(false)}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

function StudentModal({ student, onClose }: { student: Student | null; onClose: () => void }) {
  const { addStudent, updateStudent, addFeePlan, updateFeePlan, getFeePlanByStudentId, settings } = useSchool()
  const existingFeePlan = student ? getFeePlanByStudentId(student.id) : null
  
  const [formData, setFormData] = useState<any>({
    admissionNo: student?.admissionNo || '',
    rollNo: student?.rollNo || '',
    fullName: student?.fullName || '',
    gender: student?.gender || '',
    dateOfBirth: student?.dateOfBirth || '',
    aadharNumber: student?.aadharNumber || '',
    className: student?.className || '',
    section: student?.section || '',
    academicYear: student?.academicYear || settings.academicYear,
    fatherName: student?.fatherName || '',
    motherName: student?.motherName || '',
    guardianName: student?.guardianName || '',
    previousSchoolName: student?.previousSchoolName || '',
    bloodGroup: student?.bloodGroup || '',
    casteCategory: student?.casteCategory || '',
    casteOther: student?.casteOther || '',
    birthPlace: student?.birthPlace || '',
    phonePrimary: student?.phonePrimary || '',
    phoneSecondary: student?.phoneSecondary || '',
    addressLine1: student?.addressLine1 || '',
    addressLine2: student?.addressLine2 || '',
    city: student?.city || '',
    state: student?.state || '',
    pincode: student?.pincode || '',
    busOpted: student?.busOpted || false,
    busRouteId: student?.busRouteId || '',
    busFeeMonthly: student?.busFeeMonthly || '',
    busRouteAddress: student?.busRouteAddress || '',
    status: student?.status || 'Active',
    // Fee Plan fields
    annualFee: existingFeePlan?.annualFee || '',
    examFee: existingFeePlan?.examFee || '',
    bookFee: existingFeePlan?.bookFee || '',
    uniformFee: existingFeePlan?.uniformFee || '',
    discount: existingFeePlan?.discount || '',
    miscFee: existingFeePlan?.miscFee || '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update form data when student prop changes (for edit mode)
  useEffect(() => {
    if (student) {
      const currentFeePlan = getFeePlanByStudentId(student.id)
      setFormData({
        admissionNo: student.admissionNo || '',
        rollNo: student.rollNo || '',
        fullName: student.fullName || '',
        gender: student.gender || '',
        dateOfBirth: student.dateOfBirth || '',
        aadharNumber: student.aadharNumber || '',
        className: student.className || '',
        section: student.section || '',
        academicYear: student.academicYear || settings.academicYear,
        fatherName: student.fatherName || '',
        motherName: student.motherName || '',
        guardianName: student.guardianName || '',
        previousSchoolName: student.previousSchoolName || '',
        bloodGroup: student.bloodGroup || '',
        casteCategory: student.casteCategory || '',
        casteOther: student.casteOther || '',
        birthPlace: student.birthPlace || '',
        phonePrimary: student.phonePrimary || '',
        phoneSecondary: student.phoneSecondary || '',
        addressLine1: student.addressLine1 || '',
        addressLine2: student.addressLine2 || '',
        city: student.city || '',
        state: student.state || '',
        pincode: student.pincode || '',
        busOpted: student.busOpted || false,
        busRouteId: student.busRouteId || '',
        busFeeMonthly: student.busFeeMonthly || '',
        busRouteAddress: student.busRouteAddress || '',
        status: student.status || 'Active',
        // Fee Plan fields
        annualFee: currentFeePlan?.annualFee || '',
        examFee: currentFeePlan?.examFee || '',
        bookFee: currentFeePlan?.bookFee || '',
        uniformFee: currentFeePlan?.uniformFee || '',
        discount: currentFeePlan?.discount || '',
        miscFee: currentFeePlan?.miscFee || '',
      })
    } else {
      // Reset form for new student
      setFormData({
        admissionNo: '',
        rollNo: '',
        fullName: '',
        gender: '',
        dateOfBirth: '',
        aadharNumber: '',
        className: '',
        section: '',
        academicYear: settings.academicYear,
        fatherName: '',
        motherName: '',
        guardianName: '',
        previousSchoolName: '',
        bloodGroup: '',
        casteCategory: '',
        casteOther: '',
        birthPlace: '',
        phonePrimary: '',
        phoneSecondary: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        busOpted: false,
        busRouteId: '',
        busFeeMonthly: '',
        busRouteAddress: '',
        status: 'Active',
        annualFee: '',
        examFee: '',
        bookFee: '',
        uniformFee: '',
        discount: '',
        miscFee: '',
      })
    }
    setErrors({})
  }, [student, settings.academicYear, getFeePlanByStudentId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validation
    if (!formData.admissionNo) {
      setErrors({ admissionNo: 'Admission number is required' })
      return
    }
    if (!formData.fullName) {
      setErrors({ fullName: 'Full name is required' })
      return
    }
    if (!formData.className) {
      setErrors({ className: 'Class is required' })
      return
    }
    if (!formData.phonePrimary) {
      setErrors({ phonePrimary: 'Primary phone is required' })
      return
    }

    // Aadhaar validation (optional but strict if provided)
    if (formData.aadharNumber) {
      const digits = String(formData.aadharNumber).replace(/\D/g, '')
      if (!/^\d{12}$/.test(digits)) {
        setErrors({ aadharNumber: 'Aadhar Number must be exactly 12 digits' })
        return
      }
      formData.aadharNumber = digits
    }

    setIsSubmitting(true)

    try {
      const studentData = {
        ...formData,
        busFeeMonthly: formData.busFeeMonthly ? parseFloat(formData.busFeeMonthly) : undefined,
      }

      // Remove fee plan fields from student data
      const { annualFee, examFee, bookFee, uniformFee, discount, miscFee, ...studentInfo } = studentData

      let savedStudent: Student

      if (student) {
        updateStudent(student.id, studentInfo)
        savedStudent = student
        toast.success('Student updated successfully')
      } else {
        savedStudent = await addStudent(studentInfo)
        toast.success('Student added successfully')
      }

      // Create or update fee plan
      const feePlanData = {
        studentId: savedStudent.id,
        annualFee: parseFloat(annualFee) || 0,
        examFee: parseFloat(examFee) || 0,
        bookFee: parseFloat(bookFee) || 0,
        uniformFee: parseFloat(uniformFee) || 0,
        discount: parseFloat(discount) || 0,
        miscFee: parseFloat(miscFee) || 0,
      }

      if (existingFeePlan) {
        updateFeePlan(existingFeePlan.id, feePlanData)
      } else {
        addFeePlan(feePlanData)
      }

      onClose()
    } catch (error: any) {
      toast.error(error.message || 'Failed to save student')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto ring-1 ring-border/40">
        <div className="p-4 sm:p-6 border-b border-border/20 sticky top-0 bg-surface z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-text">
            {student ? 'Edit Student' : 'Add New Student'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <Input
              label="Admission Number"
              value={formData.admissionNo}
              onChange={(e) => setFormData({ ...formData, admissionNo: e.target.value })}
              error={errors.admissionNo}
              required
            />
            <Input
              label="Roll Number"
              value={formData.rollNo}
              onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
            />
            <Input
              label="Aadhar Number (12 digits)"
              value={formData.aadharNumber}
              onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
              error={errors.aadharNumber}
            />
            <Input
              label="Full Name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              error={errors.fullName}
              required
            />
            <Select
              label="Gender"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              options={[
                { value: '', label: 'Select Gender' },
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' },
              ]}
            />
            <Input
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            />
            <Select
              label="Class"
              value={formData.className}
              onChange={(e) => setFormData({ ...formData, className: e.target.value })}
              options={[
                { value: '', label: 'Select Class' },
                ...settings.classes.map((cls) => ({ value: cls, label: cls })),
              ]}
              error={errors.className}
              required
            />
            <Input
              label="Section"
              value={formData.section}
              onChange={(e) => setFormData({ ...formData, section: e.target.value })}
            />
            <Input
              label="Academic Year"
              value={formData.academicYear}
              onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
              required
            />
            <Input
              label="Father's Name"
              value={formData.fatherName}
              onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
            />
            <Input
              label="Mother's Name"
              value={formData.motherName}
              onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
            />
            <Input
              label="Guardian Name"
              value={formData.guardianName}
              onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
            />
            <Input
              label="Previous School Name"
              value={formData.previousSchoolName}
              onChange={(e) => setFormData({ ...formData, previousSchoolName: e.target.value })}
            />
            <Select
              label="Blood Group"
              value={formData.bloodGroup}
              onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              options={[
                { value: '', label: 'Select Blood Group' },
                { value: 'A+', label: 'A+' },
                { value: 'A-', label: 'A-' },
                { value: 'B+', label: 'B+' },
                { value: 'B-', label: 'B-' },
                { value: 'AB+', label: 'AB+' },
                { value: 'AB-', label: 'AB-' },
                { value: 'O+', label: 'O+' },
                { value: 'O-', label: 'O-' },
                { value: 'Not Known', label: 'Not Known' },
              ]}
            />
            <Select
              label="Caste Belongs To"
              value={formData.casteCategory}
              onChange={(e) => setFormData({ ...formData, casteCategory: e.target.value })}
              options={[
                { value: '', label: 'Select Caste Category' },
                { value: 'General', label: 'General' },
                { value: 'OBC', label: 'OBC' },
                { value: 'SC', label: 'SC' },
                { value: 'ST', label: 'ST' },
                { value: 'VJNT', label: 'VJNT' },
                { value: 'SBC', label: 'SBC' },
                { value: 'EWS', label: 'EWS' },
                { value: 'Other', label: 'Other' },
              ]}
            />
            {formData.casteCategory === 'Other' && (
              <Input
                label="Caste Other (Specify)"
                value={formData.casteOther}
                onChange={(e) => setFormData({ ...formData, casteOther: e.target.value })}
              />
            )}
            <Input
              label="Birth Place"
              value={formData.birthPlace}
              onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
            />
            <Input
              label="Primary Phone"
              value={formData.phonePrimary}
              onChange={(e) => setFormData({ ...formData, phonePrimary: e.target.value })}
              error={errors.phonePrimary}
              required
            />
            <Input
              label="Secondary Phone"
              value={formData.phoneSecondary}
              onChange={(e) => setFormData({ ...formData, phoneSecondary: e.target.value })}
            />
            <Input
              label="Address Line 1"
              value={formData.addressLine1}
              onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
            />
            <Input
              label="Address Line 2"
              value={formData.addressLine2}
              onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
            />
            <Input
              label="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
            <Input
              label="State"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            />
            <Input
              label="Pincode"
              value={formData.pincode}
              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
            />
            <div className="md:col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.busOpted}
                  onChange={(e) => setFormData({ ...formData, busOpted: e.target.checked })}
                  className="rounded border-border/40"
                />
                <span className="text-sm font-medium text-text">Opted for Bus Transport</span>
              </label>
            </div>
            {formData.busOpted && (
              <>
                <Select
                  label="Bus Route"
                  value={formData.busRouteId || ''}
                  onChange={(e) => setFormData({ ...formData, busRouteId: e.target.value })}
                  options={[
                    { value: '', label: 'Select Bus Route' },
                    ...settings.buses.map((bus) => ({ value: bus.busNumber, label: `${bus.busNumber} - ${bus.route}` })),
                  ]}
                />
                <Input
                  label="Bus Route Address"
                  value={formData.busRouteAddress}
                  onChange={(e) => setFormData({ ...formData, busRouteAddress: e.target.value })}
                />
                <Input
                  label="Monthly Bus Fee (₹)"
                  type="number"
                  step="0.01"
                  value={formData.busFeeMonthly}
                  onChange={(e) => setFormData({ ...formData, busFeeMonthly: e.target.value })}
                />
              </>
            )}
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
                { value: 'Left', label: 'Left' },
              ]}
            />
          </div>

          {/* Fee Plan Section */}
          <div className="mt-8 pt-8 border-t border-border/20">
            <h3 className="text-lg font-semibold text-text mb-4">Fee Plan Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tuition Fee (₹)"
                type="number"
                step="0.01"
                min="0"
                value={formData.annualFee}
                onChange={(e) => setFormData({ ...formData, annualFee: e.target.value })}
                placeholder="0.00"
              />
              <Input
                label="Exam Fee (₹)"
                type="number"
                step="0.01"
                min="0"
                value={formData.examFee}
                onChange={(e) => setFormData({ ...formData, examFee: e.target.value })}
                placeholder="0.00"
              />
              <Input
                label="Book Fee (₹)"
                type="number"
                step="0.01"
                min="0"
                value={formData.bookFee}
                onChange={(e) => setFormData({ ...formData, bookFee: e.target.value })}
                placeholder="0.00"
              />
              <Input
                label="Uniform Fee (₹)"
                type="number"
                step="0.01"
                min="0"
                value={formData.uniformFee}
                onChange={(e) => setFormData({ ...formData, uniformFee: e.target.value })}
                placeholder="0.00"
              />
              <Input
                label="Discount (₹)"
                type="number"
                step="0.01"
                min="0"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                placeholder="0.00"
              />
              <Input
                label="Miscellaneous Fee (₹)"
                type="number"
                step="0.01"
                min="0"
                value={formData.miscFee}
                onChange={(e) => setFormData({ ...formData, miscFee: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Saving...' : student ? 'Update Student' : 'Add Student'}
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
