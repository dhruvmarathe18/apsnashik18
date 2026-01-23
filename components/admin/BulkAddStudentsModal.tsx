'use client'

import React, { useState, useRef } from 'react'
import { X, Download, Upload, AlertCircle, CheckCircle, Edit2, Save } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import {
  downloadStudentTemplate,
  parseStudentExcel,
  bulkStudentToStudent,
  BulkStudentRow,
  BulkStudentValidation,
} from '@/lib/utils/bulkStudentImport'
import { useSchool } from '@/contexts/SchoolContext'
import { Student, FeePlan, AppSettings, Gender, StudentStatus } from '@/types/school'
import toast from 'react-hot-toast'

function StudentEditRow({
  student,
  validation,
  settings,
  onSave,
  onCancel,
}: {
  student: BulkStudentRow
  validation: BulkStudentValidation
  settings: AppSettings
  onSave: (updated: BulkStudentRow) => void
  onCancel: () => void
}) {
  const [editedStudent, setEditedStudent] = useState<BulkStudentRow>({ ...student })

  const handleSave = () => {
    onSave(editedStudent)
  }

  return (
    <tr className="bg-blue-50">
      <td colSpan={7} className="px-4 py-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Admission No*"
              value={editedStudent.admissionNo}
              onChange={(e) => setEditedStudent({ ...editedStudent, admissionNo: e.target.value })}
            />
            <Input
              label="Full Name*"
              value={editedStudent.fullName}
              onChange={(e) => setEditedStudent({ ...editedStudent, fullName: e.target.value })}
            />
            <Input
              label="Roll No"
              value={editedStudent.rollNo || ''}
              onChange={(e) => setEditedStudent({ ...editedStudent, rollNo: e.target.value || undefined })}
            />
            <Input
              label="Aadhar Number (12 digits)"
              value={editedStudent.aadharNumber || ''}
              onChange={(e) =>
                setEditedStudent({
                  ...editedStudent,
                  aadharNumber: e.target.value || undefined,
                })
              }
            />
            <Select
              label="Gender"
              value={editedStudent.gender || ''}
              onChange={(e) => setEditedStudent({ ...editedStudent, gender: e.target.value as Gender | undefined })}
              options={[
                { value: '', label: 'Select Gender' },
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' },
              ]}
            />
            <Input
              label="Date of Birth (YYYY-MM-DD)"
              value={editedStudent.dateOfBirth || ''}
              onChange={(e) => setEditedStudent({ ...editedStudent, dateOfBirth: e.target.value || undefined })}
            />
            <Select
              label="Class*"
              value={editedStudent.className}
              onChange={(e) => setEditedStudent({ ...editedStudent, className: e.target.value })}
              options={[
                { value: '', label: 'Select Class' },
                ...settings.classes.map((cls) => ({ value: cls, label: cls })),
              ]}
            />
            <Input
              label="Section"
              value={editedStudent.section || ''}
              onChange={(e) => setEditedStudent({ ...editedStudent, section: e.target.value || undefined })}
            />
            <Input
              label="Previous School Name"
              value={editedStudent.previousSchoolName || ''}
              onChange={(e) =>
                setEditedStudent({
                  ...editedStudent,
                  previousSchoolName: e.target.value || undefined,
                })
              }
            />
            <Select
              label="Blood Group"
              value={editedStudent.bloodGroup || ''}
              onChange={(e) =>
                setEditedStudent({
                  ...editedStudent,
                  bloodGroup: e.target.value as any,
                })
              }
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
              value={editedStudent.casteCategory || ''}
              onChange={(e) =>
                setEditedStudent({
                  ...editedStudent,
                  casteCategory: e.target.value as any,
                })
              }
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
            {editedStudent.casteCategory === 'Other' && (
              <Input
                label="Caste Other (Specify)"
                value={editedStudent.casteOther || ''}
                onChange={(e) =>
                  setEditedStudent({
                    ...editedStudent,
                    casteOther: e.target.value || undefined,
                  })
                }
              />
            )}
            <Input
              label="Birth Place"
              value={editedStudent.birthPlace || ''}
              onChange={(e) =>
                setEditedStudent({
                  ...editedStudent,
                  birthPlace: e.target.value || undefined,
                })
              }
            />
            <Input
              label="Phone Primary*"
              value={editedStudent.phonePrimary}
              onChange={(e) => setEditedStudent({ ...editedStudent, phonePrimary: e.target.value })}
            />
            <Input
              label="Phone Secondary"
              value={editedStudent.phoneSecondary || ''}
              onChange={(e) => setEditedStudent({ ...editedStudent, phoneSecondary: e.target.value || undefined })}
            />
            <Select
              label="Status"
              value={editedStudent.status}
              onChange={(e) => setEditedStudent({ ...editedStudent, status: e.target.value as StudentStatus })}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
                { value: 'Left', label: 'Left' },
              ]}
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={editedStudent.busOpted}
                onChange={(e) => setEditedStudent({ ...editedStudent, busOpted: e.target.checked })}
                className="rounded border-border/40"
              />
              <span className="text-sm font-medium text-text">Bus Opted</span>
            </div>
            {editedStudent.busOpted && (
              <>
                <Input
                  label="Bus Route ID"
                  value={editedStudent.busRouteId || ''}
                  onChange={(e) => setEditedStudent({ ...editedStudent, busRouteId: e.target.value || undefined })}
                />
                <Input
                  label="Bus Route Address"
                  value={editedStudent.busRouteAddress || ''}
                  onChange={(e) =>
                    setEditedStudent({
                      ...editedStudent,
                      busRouteAddress: e.target.value || undefined,
                    })
                  }
                />
                <Input
                  label="Bus Fee Monthly"
                  type="number"
                  value={editedStudent.busFeeMonthly || ''}
                  onChange={(e) =>
                    setEditedStudent({
                      ...editedStudent,
                      busFeeMonthly: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                />
              </>
            )}
          </div>
          
          {/* Fee Plan Fields */}
          <div className="border-t border-border/20 pt-4">
            <h4 className="font-semibold text-text mb-3">Fee Plan Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                label="Tuition Fee"
                type="number"
                value={editedStudent.annualFee || 0}
                onChange={(e) => setEditedStudent({ ...editedStudent, annualFee: parseFloat(e.target.value) || 0 })}
              />
              <Input
                label="Exam Fee"
                type="number"
                value={editedStudent.examFee || 0}
                onChange={(e) => setEditedStudent({ ...editedStudent, examFee: parseFloat(e.target.value) || 0 })}
              />
              <Input
                label="Book Fee"
                type="number"
                value={editedStudent.bookFee || 0}
                onChange={(e) => setEditedStudent({ ...editedStudent, bookFee: parseFloat(e.target.value) || 0 })}
              />
              <Input
                label="Uniform Fee"
                type="number"
                value={editedStudent.uniformFee || 0}
                onChange={(e) => setEditedStudent({ ...editedStudent, uniformFee: parseFloat(e.target.value) || 0 })}
              />
              <Input
                label="Discount"
                type="number"
                value={editedStudent.discount || 0}
                onChange={(e) => setEditedStudent({ ...editedStudent, discount: parseFloat(e.target.value) || 0 })}
              />
              <Input
                label="Misc Fee"
                type="number"
                value={editedStudent.miscFee || 0}
                onChange={(e) => setEditedStudent({ ...editedStudent, miscFee: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </td>
    </tr>
  )
}

interface BulkAddStudentsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function BulkAddStudentsModal({ isOpen, onClose }: BulkAddStudentsModalProps) {
  const { settings, addStudentsBatch, refreshData, students: existingStudents, updateStudent, feePlans, updateFeePlan, addFeePlan } = useSchool()
  const [step, setStep] = useState<'upload' | 'preview'>('upload')
  const [validations, setValidations] = useState<BulkStudentValidation[]>([])
  const [students, setStudents] = useState<BulkStudentRow[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleDownloadTemplate = () => {
    downloadStudentTemplate(settings.academicYear, settings.classes, existingStudents, feePlans)
    toast.success('Template downloaded successfully')
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error('Please upload an Excel file (.xlsx or .xls)')
      return
    }

    try {
      // Get existing admission numbers
      const existingAdmissionNos = new Set(
        existingStudents.map((s: Student) => s.admissionNo)
      )

      const result = await parseStudentExcel(file, settings.academicYear, existingAdmissionNos)
      
      setStudents(result.students)
      setValidations(result.validations)
      setStep('preview')

      if (result.isValid) {
        toast.success(`Successfully parsed ${result.students.length} students. Review and submit.`)
      } else {
        const errorCount = result.validations.filter((v) => v.errors.length > 0).length
        toast.error(`Found ${errorCount} rows with errors. Please fix them before submitting.`)
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to parse Excel file')
    }
  }

  const handleEdit = (index: number) => {
    setEditingIndex(index)
  }

  const handleSaveEdit = (index: number, updatedStudent: BulkStudentRow) => {
    const updatedStudents = [...students]
    updatedStudents[index] = updatedStudent
    
    // Re-validate
    const errors: string[] = []
    const warnings: string[] = []
    
    if (!updatedStudent.admissionNo) errors.push('Admission No is required')
    if (!updatedStudent.fullName) errors.push('Full Name is required')
    if (!updatedStudent.className) errors.push('Class is required')
    if (!updatedStudent.phonePrimary) errors.push('Phone Primary is required')
    
    // Check for duplicates
    const duplicateInFile = updatedStudents.some((s, idx) => 
      idx !== index && s.admissionNo === updatedStudent.admissionNo
    )
    if (duplicateInFile) errors.push('Duplicate Admission No in file')
    
    // Validate phone
    if (updatedStudent.phonePrimary && !/^\d{10}$/.test(updatedStudent.phonePrimary.replace(/\D/g, ''))) {
      errors.push('Phone Primary must be 10 digits')
    }
    
    const updatedValidations = [...validations]
    updatedValidations[index] = {
      row: validations[index].row,
      student: updatedStudent,
      errors,
      warnings,
    }
    
    setStudents(updatedStudents)
    setValidations(updatedValidations)
    setEditingIndex(null)
    toast.success('Student updated successfully')
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
  }

  const handleSubmit = async () => {
    // Check if all validations pass
    const hasErrors = validations.some((v) => v.errors.length > 0)
    if (hasErrors) {
      toast.error('Please fix all errors before submitting')
      return
    }

    setIsSubmitting(true)
    try {
      // Separate new students from updates
      const newStudents: BulkStudentRow[] = []
      const updates: Array<{ student: Student; updates: Partial<Student> }> = []

      for (const bulkStudent of students) {
        const existingStudent = existingStudents.find((s) => s.admissionNo === bulkStudent.admissionNo)
        
        if (existingStudent) {
          // This is an update - include all fields
          const studentUpdate = bulkStudentToStudent(bulkStudent, settings.academicYear)
          updates.push({
            student: existingStudent,
            updates: {
              rollNo: studentUpdate.rollNo,
              fullName: studentUpdate.fullName,
              gender: studentUpdate.gender,
              dateOfBirth: studentUpdate.dateOfBirth,
              aadharNumber: studentUpdate.aadharNumber,
              className: studentUpdate.className,
              section: studentUpdate.section,
              fatherName: studentUpdate.fatherName,
              motherName: studentUpdate.motherName,
              guardianName: studentUpdate.guardianName,
              previousSchoolName: studentUpdate.previousSchoolName,
              bloodGroup: studentUpdate.bloodGroup,
              casteCategory: studentUpdate.casteCategory,
              casteOther: studentUpdate.casteOther,
              birthPlace: studentUpdate.birthPlace,
              phonePrimary: studentUpdate.phonePrimary,
              phoneSecondary: studentUpdate.phoneSecondary,
              addressLine1: studentUpdate.addressLine1,
              addressLine2: studentUpdate.addressLine2,
              city: studentUpdate.city,
              state: studentUpdate.state,
              pincode: studentUpdate.pincode,
              busOpted: studentUpdate.busOpted,
              busRouteId: studentUpdate.busRouteId,
              busFeeMonthly: studentUpdate.busFeeMonthly,
              busRouteAddress: studentUpdate.busRouteAddress,
              status: studentUpdate.status,
            },
          })
        } else {
          // This is a new student
          newStudents.push(bulkStudent)
        }
      }

      // Update existing students and their fee plans
      let updateCount = 0
      for (const { student, updates: studentUpdates } of updates) {
        try {
          await updateStudent(student.id, studentUpdates)
          
          // Also update fee plan if provided
          const bulkStudent = students.find((s) => s.admissionNo === student.admissionNo)
          if (bulkStudent && (bulkStudent.annualFee !== undefined || bulkStudent.examFee !== undefined || 
              bulkStudent.bookFee !== undefined || bulkStudent.uniformFee !== undefined || 
              bulkStudent.discount !== undefined || bulkStudent.miscFee !== undefined)) {
            const existingFeePlan = feePlans.find((p) => p.studentId === student.id)
            if (existingFeePlan) {
              await updateFeePlan(existingFeePlan.id, {
                annualFee: bulkStudent.annualFee ?? existingFeePlan.annualFee,
                examFee: bulkStudent.examFee ?? existingFeePlan.examFee,
                bookFee: bulkStudent.bookFee ?? existingFeePlan.bookFee,
                uniformFee: bulkStudent.uniformFee ?? existingFeePlan.uniformFee,
                discount: bulkStudent.discount ?? existingFeePlan.discount,
                miscFee: bulkStudent.miscFee ?? existingFeePlan.miscFee,
              })
            } else if (bulkStudent.annualFee || bulkStudent.examFee || bulkStudent.bookFee || 
                       bulkStudent.uniformFee || bulkStudent.discount || bulkStudent.miscFee) {
              // Create fee plan if it doesn't exist
              await addFeePlan({
                studentId: student.id,
                annualFee: bulkStudent.annualFee || 0,
                examFee: bulkStudent.examFee || 0,
                bookFee: bulkStudent.bookFee || 0,
                uniformFee: bulkStudent.uniformFee || 0,
                discount: bulkStudent.discount || 0,
                miscFee: bulkStudent.miscFee || 0,
              })
            }
          }
          
          updateCount++
        } catch (error) {
          console.error(`Error updating student ${student.admissionNo}:`, error)
          toast.error(`Failed to update student ${student.admissionNo}`)
        }
      }

      // Create new students
      if (newStudents.length > 0) {
        const studentsData = newStudents.map((s) => bulkStudentToStudent(s, settings.academicYear))
        const feePlansData = newStudents.map((s) => ({
          admissionNo: s.admissionNo,
          studentId: '', // Will be set after student creation
          annualFee: s.annualFee || 0,
          examFee: s.examFee || 0,
          bookFee: s.bookFee || 0,
          uniformFee: s.uniformFee || 0,
          discount: s.discount || 0,
          miscFee: s.miscFee || 0,
        }))

        await addStudentsBatch(studentsData, feePlansData)
      }

      await refreshData()
      
      const messages = []
      if (updateCount > 0) messages.push(`${updateCount} student(s) updated`)
      if (newStudents.length > 0) messages.push(`${newStudents.length} student(s) added`)
      
      toast.success(messages.join(', '))
      handleClose()
    } catch (error: any) {
      toast.error(error.message || 'Failed to process students')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setStep('upload')
    setStudents([])
    setValidations([])
    setEditingIndex(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onClose()
  }

  const validCount = validations.filter((v) => v.errors.length === 0).length
  const errorCount = validations.filter((v) => v.errors.length > 0).length
  const warningCount = validations.filter((v) => v.warnings.length > 0).length

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col ring-1 ring-border/40">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border/20">
          <h2 className="text-2xl font-bold text-text">Bulk Add Students</h2>
          <button
            onClick={handleClose}
            className="text-text-muted hover:text-text transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'upload' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-text mb-4">Step 1: Download Template</h3>
                <p className="text-text-muted mb-4">
                  Download the Excel template, fill in student information, and upload it back.
                </p>
                <Button onClick={handleDownloadTemplate} className="w-full sm:w-auto">
                  <Download className="w-5 h-5 mr-2" />
                  Download Excel Template
                </Button>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-text mb-4">Step 2: Upload Filled Template</h3>
                <div className="border-2 border-dashed border-border/40 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-text-muted mx-auto mb-4" />
                  <p className="text-text-muted mb-4">Upload your filled Excel file</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Upload className="w-5 h-5 mr-2" />
                      Choose File
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-success/20 border border-success/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-success">Valid</p>
                      <p className="text-2xl font-bold text-success">{validCount}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-success" />
                  </div>
                </div>
                <div className="bg-destructive/20 border border-destructive/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-destructive">Errors</p>
                      <p className="text-2xl font-bold text-destructive">{errorCount}</p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-destructive" />
                  </div>
                </div>
                <div className="bg-warning/20 border border-warning/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-warning">Warnings</p>
                      <p className="text-2xl font-bold text-warning">{warningCount}</p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-warning" />
                  </div>
                </div>
              </div>

              {/* Students List */}
              <div className="border border-border/20 rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-[500px]">
                  <table className="w-full">
                    <thead className="bg-surface-2 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Row</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Admission No</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Class</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Phone</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {students.map((student, index) => {
                        const validation = validations[index]
                        const isEditing = editingIndex === index
                        
                        if (isEditing) {
                          return <StudentEditRow
                            key={index}
                            student={student}
                            validation={validation}
                            settings={settings}
                            onSave={(updated) => handleSaveEdit(index, updated)}
                            onCancel={handleCancelEdit}
                          />
                        }
                        
                        return (
                          <tr
                            key={index}
                            className={validation.errors.length > 0 ? 'bg-destructive/10' : validation.warnings.length > 0 ? 'bg-warning/10' : 'bg-surface-1'}
                          >
                            <td className="px-4 py-3 text-sm text-text">{validation.row}</td>
                            <td className="px-4 py-3 text-sm text-text">{student.admissionNo}</td>
                            <td className="px-4 py-3 text-sm text-text">{student.fullName}</td>
                            <td className="px-4 py-3 text-sm text-text">{student.className}</td>
                            <td className="px-4 py-3 text-sm text-text">{student.phonePrimary}</td>
                            <td className="px-4 py-3">
                              {validation.errors.length > 0 ? (
                                <span className="px-2 py-1 text-xs font-medium bg-destructive/20 text-destructive rounded">
                                  {validation.errors.length} Error(s)
                                </span>
                              ) : validation.warnings.length > 0 ? (
                                <span className="px-2 py-1 text-xs font-medium bg-warning/20 text-warning rounded">
                                  {validation.warnings.length} Warning(s)
                                </span>
                              ) : (
                                <span className="px-2 py-1 text-xs font-medium bg-success/20 text-success rounded">
                                  Valid
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleEdit(index)}
                                className="text-primary hover:text-primary/80"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Error/Warning Details */}
              {validations.some((v) => v.errors.length > 0 || v.warnings.length > 0) && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-text">Validation Details</h4>
                  {validations.map((validation, index) => {
                    if (validation.errors.length === 0 && validation.warnings.length === 0) return null
                    
                    return (
                      <div
                        key={index}
                        className={`border rounded-lg p-4 ${
                          validation.errors.length > 0 ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'
                        }`}
                      >
                        <p className="font-medium text-gray-900 mb-2">
                          Row {validation.row}: {validation.student.fullName} ({validation.student.admissionNo})
                        </p>
                        {validation.errors.length > 0 && (
                          <div className="mb-2">
                            <p className="text-sm font-medium text-red-700 mb-1">Errors:</p>
                            <ul className="list-disc list-inside text-sm text-red-600">
                              {validation.errors.map((error, i) => (
                                <li key={i}>{error}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {validation.warnings.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-yellow-700 mb-1">Warnings:</p>
                            <ul className="list-disc list-inside text-sm text-yellow-600">
                              {validation.warnings.map((warning, i) => (
                                <li key={i}>{warning}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 flex justify-end space-x-4">
          {step === 'preview' && (
            <>
              <Button variant="outline" onClick={() => setStep('upload')}>
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || errorCount > 0}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Submitting...' : `Submit ${validCount} Students`}
              </Button>
            </>
          )}
          <Button variant="outline" onClick={handleClose}>
            {step === 'upload' ? 'Cancel' : 'Close'}
          </Button>
        </div>
      </div>
    </div>
  )
}
