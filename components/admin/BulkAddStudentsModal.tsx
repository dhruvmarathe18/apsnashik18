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
import { Student, FeePlan, AppSettings, Gender, StudentStatus, FeeFrequency } from '@/types/school'
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
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Bus Opted</span>
            </div>
            {editedStudent.busOpted && (
              <>
                <Input
                  label="Bus Route ID"
                  value={editedStudent.busRouteId || ''}
                  onChange={(e) => setEditedStudent({ ...editedStudent, busRouteId: e.target.value || undefined })}
                />
                <Input
                  label="Bus Fee Monthly"
                  type="number"
                  value={editedStudent.busFeeMonthly || ''}
                  onChange={(e) => setEditedStudent({ ...editedStudent, busFeeMonthly: e.target.value ? parseFloat(e.target.value) : undefined })}
                />
              </>
            )}
          </div>
          
          {/* Fee Plan Fields */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-900 mb-3">Fee Plan Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                label="Tuition Fee Monthly"
                type="number"
                value={editedStudent.tuitionFeeMonthly || 0}
                onChange={(e) => setEditedStudent({ ...editedStudent, tuitionFeeMonthly: parseFloat(e.target.value) || 0 })}
              />
              <Input
                label="Annual Fee"
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
              <Select
                label="Fee Frequency"
                value={editedStudent.feeFrequency || 'Monthly'}
                onChange={(e) => setEditedStudent({ ...editedStudent, feeFrequency: e.target.value as FeeFrequency })}
                options={[
                  { value: 'Monthly', label: 'Monthly' },
                  { value: 'Quarterly', label: 'Quarterly' },
                  { value: 'Yearly', label: 'Yearly' },
                ]}
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
  const { settings, addStudentsBatch, refreshData, students: existingStudents } = useSchool()
  const [step, setStep] = useState<'upload' | 'preview'>('upload')
  const [validations, setValidations] = useState<BulkStudentValidation[]>([])
  const [students, setStudents] = useState<BulkStudentRow[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleDownloadTemplate = () => {
    downloadStudentTemplate(settings.academicYear, settings.classes)
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
      // Convert to student and fee plan format
      const studentsData = students.map((s) => bulkStudentToStudent(s, settings.academicYear))
      const feePlansData = students.map((s) => ({
        admissionNo: s.admissionNo,
        studentId: '', // Will be set after student creation
        tuitionFeeMonthly: s.tuitionFeeMonthly || 0,
        annualFee: s.annualFee || 0,
        examFee: s.examFee || 0,
        bookFee: s.bookFee || 0,
        uniformFee: s.uniformFee || 0,
        discount: s.discount || 0,
        miscFee: s.miscFee || 0,
        feeFrequency: s.feeFrequency || 'Monthly',
      }))

      const result = await addStudentsBatch(studentsData, feePlansData)
      await refreshData()
      
      handleClose()
    } catch (error: any) {
      toast.error(error.message || 'Failed to add students')
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Bulk Add Students</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'upload' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 1: Download Template</h3>
                <p className="text-gray-600 mb-4">
                  Download the Excel template, fill in student information, and upload it back.
                </p>
                <Button onClick={handleDownloadTemplate} className="w-full sm:w-auto">
                  <Download className="w-5 h-5 mr-2" />
                  Download Excel Template
                </Button>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 2: Upload Filled Template</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Upload your filled Excel file</p>
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
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600">Valid</p>
                      <p className="text-2xl font-bold text-green-700">{validCount}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-600">Errors</p>
                      <p className="text-2xl font-bold text-red-700">{errorCount}</p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-yellow-600">Warnings</p>
                      <p className="text-2xl font-bold text-yellow-700">{warningCount}</p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-yellow-600" />
                  </div>
                </div>
              </div>

              {/* Students List */}
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-[500px]">
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Row</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Admission No</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Class</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Phone</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
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
                            className={validation.errors.length > 0 ? 'bg-red-50' : validation.warnings.length > 0 ? 'bg-yellow-50' : 'bg-white'}
                          >
                            <td className="px-4 py-3 text-sm text-gray-900">{validation.row}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{student.admissionNo}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{student.fullName}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{student.className}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{student.phonePrimary}</td>
                            <td className="px-4 py-3">
                              {validation.errors.length > 0 ? (
                                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                                  {validation.errors.length} Error(s)
                                </span>
                              ) : validation.warnings.length > 0 ? (
                                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                                  {validation.warnings.length} Warning(s)
                                </span>
                              ) : (
                                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                                  Valid
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleEdit(index)}
                                className="text-blue-600 hover:text-blue-800"
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
                  <h4 className="font-semibold text-gray-900">Validation Details</h4>
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
