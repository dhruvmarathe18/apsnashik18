'use client'

import React, { useState, useRef } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Download, Upload, AlertCircle, CheckCircle } from 'lucide-react'
import { useSchool } from '@/contexts/SchoolContext'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import toast from 'react-hot-toast'
import { Transaction, Student, FeePlan } from '@/types/school'

export default function ExportImportPage() {
  const { transactions, students, feePlans, settings, refreshData, addTransaction, addStudent, addFeePlan } = useSchool()
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const wb = XLSX.utils.book_new()

      // Export Students
      if (students.length > 0) {
        const studentData = students.map((s) => ({
          'Admission No': s.admissionNo,
          'Roll No': s.rollNo || '',
          'Full Name': s.fullName,
          'Gender': s.gender || '',
          'Date of Birth': s.dateOfBirth || '',
          'Aadhar Number': s.aadharNumber || '',
          'Class': s.className,
          'Section': s.section || '',
          'Academic Year': s.academicYear,
          "Father's Name": s.fatherName || '',
          "Mother's Name": s.motherName || '',
          'Guardian Name': s.guardianName || '',
          'Previous School Name': s.previousSchoolName || '',
          'Blood Group': s.bloodGroup || '',
          'Caste Belongs To': s.casteCategory || '',
          'Caste Other': s.casteOther || '',
          'Birth Place': s.birthPlace || '',
          'Primary Phone': s.phonePrimary,
          'Secondary Phone': s.phoneSecondary || '',
          'Address Line 1': s.addressLine1 || '',
          'Address Line 2': s.addressLine2 || '',
          'City': s.city || '',
          'State': s.state || '',
          'Pincode': s.pincode || '',
          'Bus Opted': s.busOpted ? 'Yes' : 'No',
          'Bus Route ID': s.busRouteId || '',
          'Bus Route Address': s.busRouteAddress || '',
          'Bus Fee Monthly': s.busFeeMonthly || '',
          'Status': s.status,
        }))
        const wsStudents = XLSX.utils.json_to_sheet(studentData)
        XLSX.utils.book_append_sheet(wb, wsStudents, 'Students')
      }

      // Export Fee Plans
      if (feePlans.length > 0) {
        const feePlanData = feePlans.map((fp) => {
          const student = students.find((s) => s.id === fp.studentId)
          return {
            'Admission No': student?.admissionNo || '',
            'Student Name': student?.fullName || '',
            'Tuition Fee': fp.annualFee,
            'Exam Fee': fp.examFee,
            'Book Fee': fp.bookFee,
            'Uniform Fee': fp.uniformFee,
            'Discount': fp.discount,
            'Misc Fee': fp.miscFee,
          }
        })
        const wsFeePlans = XLSX.utils.json_to_sheet(feePlanData)
        XLSX.utils.book_append_sheet(wb, wsFeePlans, 'Fee Plans')
      }

      // Export Transactions
      if (transactions.length > 0) {
        const transactionData = transactions.map((t) => {
          const base: any = {
            'ID': t.id,
            'Type': t.type,
            'Date': t.date,
            'Amount': t.amount,
            'Payment Mode': t.paymentMode,
            'Notes': t.notes || '',
          }

          if (t.type === 'fee_collection') {
            const fee = t as any
            base['Student ID'] = fee.studentId || ''
            base['Admission No'] = fee.admissionNo || ''
            base['Class'] = fee.class || ''
            base['Student Name'] = fee.studentName || ''
            base['Fee Type'] = fee.feeType || ''
            base['Status'] = fee.status || 'Paid'
          } else if (t.type === 'bus_fee_collection') {
            const busFee = t as any
            base['Bus Route'] = busFee.busRoute || ''
            base['Bus Number'] = busFee.busNumber || ''
            base['Student Name'] = busFee.studentName || ''
          } else if (t.type === 'bus_expense') {
            const busExp = t as any
            base['Bus Number'] = busExp.busNumber || ''
            base['Expense Type'] = busExp.expenseType || ''
            base['Vendor'] = busExp.vendor || ''
          } else if (t.type === 'salary') {
            const salary = t as any
            base['Employee Type'] = salary.employeeType || ''
            base['Employee Name'] = salary.employeeName || ''
            base['Salary Month'] = salary.salaryMonth || ''
          } else if (t.type === 'other_expense') {
            const exp = t as any
            base['Category'] = exp.category || ''
          } else if (t.type === 'other_income') {
            const inc = t as any
            base['Income Source'] = inc.incomeSource || ''
          }

          return base
        })
        const wsTransactions = XLSX.utils.json_to_sheet(transactionData)
        XLSX.utils.book_append_sheet(wb, wsTransactions, 'Transactions')
      }

      // Export Settings
      const settingsData = [
        ['Setting', 'Value'],
        ['School Name', settings.schoolName],
        ['Academic Year', settings.academicYear],
        ['Classes', settings.classes.join(', ')],
        ['Payment Modes', settings.paymentModes.join(', ')],
        ['Expense Categories', settings.expenseCategories.join(', ')],
      ]
      const wsSettings = XLSX.utils.aoa_to_sheet(settingsData)
      XLSX.utils.book_append_sheet(wb, wsSettings, 'Settings')

      // Download
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([wbout], { type: 'application/octet-stream' })
      const fileName = `SchoolData_Export_${new Date().toISOString().split('T')[0]}.xlsx`
      saveAs(blob, fileName)

      toast.success('Data exported successfully!')
    } catch (error: any) {
      console.error('Export error:', error)
      toast.error('Failed to export data: ' + (error.message || 'Unknown error'))
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data, { type: 'array' })

      let importedCount = 0
      let errorCount = 0

      // Import Students
      if (workbook.SheetNames.includes('Students')) {
        const ws = workbook.Sheets['Students']
        const studentData: any[] = XLSX.utils.sheet_to_json(ws)
        
        for (const row of studentData) {
          try {
            await addStudent({
              admissionNo: row['Admission No'] || '',
              rollNo: row['Roll No'] || '',
              fullName: row['Full Name'] || '',
              gender: row['Gender'] || undefined,
              dateOfBirth: row['Date of Birth'] || undefined,
              className: row['Class'] || '',
              section: row['Section'] || undefined,
              academicYear: row['Academic Year'] || settings.academicYear,
              fatherName: row["Father's Name"] || undefined,
              motherName: row["Mother's Name"] || undefined,
              guardianName: row['Guardian Name'] || undefined,
              phonePrimary: row['Primary Phone'] || '',
              phoneSecondary: row['Secondary Phone'] || undefined,
              addressLine1: row['Address Line 1'] || undefined,
              addressLine2: row['Address Line 2'] || undefined,
              city: row['City'] || undefined,
              state: row['State'] || undefined,
              pincode: row['Pincode'] || undefined,
              busOpted: row['Bus Opted'] === 'Yes',
              busRouteId: row['Bus Route ID'] || undefined,
              busFeeMonthly: row['Bus Fee Monthly'] ? parseFloat(row['Bus Fee Monthly']) : undefined,
              status: (row['Status'] as any) || 'Active',
            })
            importedCount++
          } catch (error) {
            console.error('Error importing student:', error)
            errorCount++
          }
        }
      }

      // Refresh data after importing students to get updated student list
      if (workbook.SheetNames.includes('Students')) {
        await refreshData()
        // Small delay to ensure state is updated
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      // Import Fee Plans (after students are imported)
      if (workbook.SheetNames.includes('Fee Plans')) {
        const ws = workbook.Sheets['Fee Plans']
        const feePlanData: any[] = XLSX.utils.sheet_to_json(ws)
        
        // Get fresh students list after refresh
        await refreshData()
        await new Promise(resolve => setTimeout(resolve, 300))
        
        for (const row of feePlanData) {
          try {
            // Use the students from context which should be updated by now
            const student = students.find((s) => s.admissionNo === row['Admission No'])
            if (student) {
              await addFeePlan({
                studentId: student.id,
                      annualFee: parseFloat(row['Tuition Fee'] || row['Annual Fee'] || 0),
                examFee: parseFloat(row['Exam Fee'] || 0),
                bookFee: parseFloat(row['Book Fee'] || 0),
                uniformFee: parseFloat(row['Uniform Fee'] || 0),
                discount: parseFloat(row['Discount'] || 0),
                miscFee: parseFloat(row['Misc Fee'] || 0),
              })
              importedCount++
            } else {
              console.warn(`Student not found for admission no: ${row['Admission No']}`)
              errorCount++
            }
          } catch (error) {
            console.error('Error importing fee plan:', error)
            errorCount++
          }
        }
      }

      // Import Transactions
      if (workbook.SheetNames.includes('Transactions')) {
        const ws = workbook.Sheets['Transactions']
        const transactionData: any[] = XLSX.utils.sheet_to_json(ws)
        
        for (const row of transactionData) {
          try {
            const baseTransaction: any = {
              type: row['Type'],
              date: row['Date'],
              amount: parseFloat(row['Amount'] || 0),
              paymentMode: row['Payment Mode'],
              notes: row['Notes'] || undefined,
            }

            if (row['Type'] === 'fee_collection') {
              baseTransaction.studentId = row['Student ID'] || undefined
              baseTransaction.admissionNo = row['Admission No'] || undefined
              baseTransaction.class = row['Class'] || ''
              baseTransaction.studentName = row['Student Name'] || undefined
              baseTransaction.feeType = row['Fee Type'] || undefined
              baseTransaction.status = row['Status'] || 'Paid'
            } else if (row['Type'] === 'bus_fee_collection') {
              baseTransaction.busRoute = row['Bus Route'] || ''
              baseTransaction.busNumber = row['Bus Number'] || ''
              baseTransaction.studentName = row['Student Name'] || undefined
            } else if (row['Type'] === 'bus_expense') {
              baseTransaction.busNumber = row['Bus Number'] || ''
              baseTransaction.expenseType = row['Expense Type'] || undefined
              baseTransaction.vendor = row['Vendor'] || undefined
            } else if (row['Type'] === 'salary') {
              baseTransaction.employeeType = row['Employee Type'] || undefined
              baseTransaction.employeeName = row['Employee Name'] || ''
              baseTransaction.salaryMonth = row['Salary Month'] || ''
            } else if (row['Type'] === 'other_expense') {
              baseTransaction.category = row['Category'] || undefined
            } else if (row['Type'] === 'other_income') {
              baseTransaction.incomeSource = row['Income Source'] || undefined
            }

            addTransaction(baseTransaction as Omit<Transaction, 'id' | 'createdAt'>)
            importedCount++
          } catch (error) {
            console.error('Error importing transaction:', error)
            errorCount++
          }
        }
      }

      // Refresh data
      await refreshData()

      if (errorCount > 0) {
        toast.success(`Imported ${importedCount} records. ${errorCount} errors occurred.`)
      } else {
        toast.success(`Successfully imported ${importedCount} records!`)
      }
    } catch (error: any) {
      console.error('Import error:', error)
      toast.error('Failed to import data: ' + (error.message || 'Unknown error'))
    } finally {
      setIsImporting(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text">Export / Import</h1>
            <p className="text-text-muted mt-2">Export and import your school data</p>
          </div>

          {/* Data Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-text-muted">Students</p>
                <p className="text-2xl font-bold text-text">{students.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-text-muted">Transactions</p>
                <p className="text-2xl font-bold text-text">{transactions.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-text-muted">Fee Plans</p>
                <p className="text-2xl font-bold text-text">{feePlans.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-text-muted">Settings</p>
                <p className="text-2xl font-bold text-text">✓</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Export Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-6 h-6 text-green-600" />
                  Export Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-muted mb-4">
                  Export all your school data to an Excel file. This includes:
                </p>
                <ul className="list-disc list-inside text-text-muted mb-6 space-y-1 ml-2">
                  <li>All students and their information</li>
                  <li>All fee plans</li>
                  <li>All transactions (fees, expenses, salaries, etc.)</li>
                  <li>School settings</li>
                </ul>
                <Button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isExporting ? 'Exporting...' : 'Export to Excel'}
                </Button>
              </CardContent>
            </Card>

            {/* Import Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-6 h-6 text-blue-600" />
                  Import Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-muted mb-4">
                  Import data from an Excel file. The file should match the export format.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">Important:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Importing will add new records to your existing data</li>
                        <li>Duplicate entries may be created if IDs don't match</li>
                        <li>Always backup your data before importing</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleImport}
                  className="hidden"
                  id="import-file-input"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isImporting}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isImporting ? 'Importing...' : 'Import from Excel'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
