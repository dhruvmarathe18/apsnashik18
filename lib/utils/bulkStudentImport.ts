import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { Student, Gender, StudentStatus } from '@/types/school'
import { generateUUID, getTodayISO } from './format'

export interface BulkStudentRow {
  admissionNo: string
  rollNo?: string
  fullName: string
  gender?: Gender
  dateOfBirth?: string
  className: string
  section?: string
  fatherName?: string
  motherName?: string
  guardianName?: string
  phonePrimary: string
  phoneSecondary?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  pincode?: string
  busOpted: boolean
  busRouteId?: string
  busFeeMonthly?: number
  status: StudentStatus
  // Fee Plan fields
  annualFee?: number
  examFee?: number
  bookFee?: number
  uniformFee?: number
  discount?: number
  miscFee?: number
}

export interface BulkStudentValidation {
  row: number
  student: Partial<BulkStudentRow>
  errors: string[]
  warnings: string[]
}

/**
 * Download Excel template for bulk student import
 */
export function downloadStudentTemplate(academicYear: string, classes: string[]): void {
  const wb = XLSX.utils.book_new()

  // Create template data with headers and example row
  const headers = [
    'Admission No*',
    'Roll No',
    'Full Name*',
    'Gender (Male/Female/Other)',
    'Date of Birth (YYYY-MM-DD)',
    'Class*',
    'Section',
    'Father Name',
    'Mother Name',
    'Guardian Name',
    'Phone Primary*',
    'Phone Secondary',
    'Address Line 1',
    'Address Line 2',
    'City',
    'State',
    'Pincode',
    'Bus Opted (Yes/No)',
    'Bus Route ID',
    'Bus Fee Monthly',
    'Status (Active/Inactive/Left)',
    'Annual Fee',
    'Exam Fee',
    'Book Fee',
    'Uniform Fee',
    'Discount',
    'Misc Fee'
  ]

  const exampleRow = [
    'STU001',
    '1',
    'John Doe',
    'Male',
    '2010-05-15',
    '5th',
    'A',
    'Father Name',
    'Mother Name',
    '',
    '9876543210',
    '9876543211',
    '123 Main Street',
    'Near Park',
    'Nashik',
    'Maharashtra',
    '422001',
    'Yes',
    'Route A',
    '500',
    'Active',
    '5000',
    '500',
    '1000',
    '800',
    '0',
    '0'
  ]

  const instructions = [
    ['Instructions:'],
    ['1. Fill in all required fields marked with *'],
    ['2. Gender: Male, Female, or Other'],
    ['3. Bus Opted: Yes or No'],
    ['4. Status: Active, Inactive, or Left'],
    ['5. Date format: YYYY-MM-DD (e.g., 2010-05-15)'],
    ['7. Academic Year will be set to: ' + academicYear],
    ['8. Do not modify the header row'],
    [''],
    ['Available Classes: ' + classes.join(', ')],
    [''],
    ...headers.map((h, i) => [h, exampleRow[i]])
  ]

  // Instructions sheet
  const instructionsSheet = XLSX.utils.aoa_to_sheet(instructions)
  XLSX.utils.book_append_sheet(wb, instructionsSheet, 'Instructions')

  // Template sheet with headers and example
  const templateData = [headers, exampleRow]
  const templateSheet = XLSX.utils.aoa_to_sheet(templateData)
  
  // Set column widths
  const colWidths = headers.map(() => ({ wch: 20 }))
  templateSheet['!cols'] = colWidths

  XLSX.utils.book_append_sheet(wb, templateSheet, 'Students')

  // Download
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([wbout], { type: 'application/octet-stream' })
  saveAs(blob, `Student_Import_Template_${academicYear}.xlsx`)
}

/**
 * Parse Excel file and validate student data
 */
export function parseStudentExcel(
  file: File,
  academicYear: string,
  existingAdmissionNos: Set<string>
): Promise<{
  students: BulkStudentRow[]
  validations: BulkStudentValidation[]
  isValid: boolean
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })

        // Try to find the Students sheet (case insensitive)
        let sheetName = workbook.SheetNames.find(
          (name) => name.toLowerCase().includes('student') || name.toLowerCase() === 'sheet1'
        ) || workbook.SheetNames[0]

        const worksheet = workbook.Sheets[sheetName]
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' })

        if (jsonData.length === 0) {
          reject(new Error('Excel file is empty or has no data'))
          return
        }

        const students: BulkStudentRow[] = []
        const validations: BulkStudentValidation[] = []

        jsonData.forEach((row: any, index: number) => {
          const rowNum = index + 2 // +2 because Excel is 1-indexed and we skip header
          const errors: string[] = []
          const warnings: string[] = []

          // Map Excel columns to student fields (handle various column name formats)
          const admissionNo = String(row['Admission No'] || row['Admission No*'] || row['admissionNo'] || row['AdmissionNo'] || '').trim()
          const rollNo = String(row['Roll No'] || row['rollNo'] || row['RollNo'] || '').trim()
          const fullName = String(row['Full Name'] || row['Full Name*'] || row['fullName'] || row['FullName'] || '').trim()
          const gender = String(row['Gender'] || row['gender'] || '').trim()
          const dateOfBirth = String(row['Date of Birth'] || row['dateOfBirth'] || row['DateOfBirth'] || '').trim()
          const className = String(row['Class'] || row['Class*'] || row['class'] || row['className'] || '').trim()
          const section = String(row['Section'] || row['section'] || '').trim()
          const fatherName = String(row['Father Name'] || row['fatherName'] || row['FatherName'] || '').trim()
          const motherName = String(row['Mother Name'] || row['motherName'] || row['MotherName'] || '').trim()
          const guardianName = String(row['Guardian Name'] || row['guardianName'] || row['GuardianName'] || '').trim()
          const phonePrimary = String(row['Phone Primary'] || row['Phone Primary*'] || row['phonePrimary'] || row['PhonePrimary'] || '').trim()
          const phoneSecondary = String(row['Phone Secondary'] || row['phoneSecondary'] || row['PhoneSecondary'] || '').trim()
          const addressLine1 = String(row['Address Line 1'] || row['addressLine1'] || row['AddressLine1'] || '').trim()
          const addressLine2 = String(row['Address Line 2'] || row['addressLine2'] || row['AddressLine2'] || '').trim()
          const city = String(row['City'] || row['city'] || '').trim()
          const state = String(row['State'] || row['state'] || '').trim()
          const pincode = String(row['Pincode'] || row['pincode'] || '').trim()
          const busOptedStr = String(row['Bus Opted'] || row['busOpted'] || row['BusOpted'] || 'No').trim().toLowerCase()
          const busRouteId = String(row['Bus Route ID'] || row['busRouteId'] || row['BusRouteId'] || '').trim()
          const busFeeMonthly = row['Bus Fee Monthly'] || row['busFeeMonthly'] || row['BusFeeMonthly'] || ''
          const statusStr = String(row['Status'] || row['status'] || 'Active').trim()
          const annualFee = row['Annual Fee'] || row['annualFee'] || row['AnnualFee'] || 0
          const examFee = row['Exam Fee'] || row['examFee'] || row['ExamFee'] || 0
          const bookFee = row['Book Fee'] || row['bookFee'] || row['BookFee'] || 0
          const uniformFee = row['Uniform Fee'] || row['uniformFee'] || row['UniformFee'] || 0
          const discount = row['Discount'] || row['discount'] || 0
          const miscFee = row['Misc Fee'] || row['miscFee'] || row['MiscFee'] || 0

          // Validation
          if (!admissionNo) errors.push('Admission No is required')
          if (!fullName) errors.push('Full Name is required')
          if (!className) errors.push('Class is required')
          if (!phonePrimary) errors.push('Phone Primary is required')

          // Check for duplicate admission numbers in file
          const duplicateInFile = students.some((s) => s.admissionNo === admissionNo)
          if (duplicateInFile) errors.push('Duplicate Admission No in file')

          // Check for existing admission numbers
          if (admissionNo && existingAdmissionNos.has(admissionNo)) {
            errors.push('Admission No already exists in database')
          }

          // Validate phone number
          if (phonePrimary && !/^\d{10}$/.test(phonePrimary.replace(/\D/g, ''))) {
            errors.push('Phone Primary must be 10 digits')
          }

          // Validate gender
          let validGender: Gender | undefined
          if (gender) {
            const genderLower = gender.toLowerCase()
            if (genderLower === 'male' || genderLower === 'm') {
              validGender = 'Male'
            } else if (genderLower === 'female' || genderLower === 'f') {
              validGender = 'Female'
            } else if (genderLower === 'other' || genderLower === 'o') {
              validGender = 'Other'
            } else {
              errors.push('Gender must be Male, Female, or Other')
            }
          }

          // Validate date of birth
          let validDateOfBirth: string | undefined
          if (dateOfBirth) {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/
            if (!dateRegex.test(dateOfBirth)) {
              errors.push('Date of Birth must be in YYYY-MM-DD format')
            } else {
              const date = new Date(dateOfBirth)
              if (isNaN(date.getTime())) {
                errors.push('Invalid Date of Birth')
              } else {
                validDateOfBirth = dateOfBirth
              }
            }
          }

          // Validate bus opted
          const busOpted = busOptedStr === 'yes' || busOptedStr === 'y' || busOptedStr === 'true' || busOptedStr === '1'

          // Validate status
          let validStatus: StudentStatus = 'Active'
          const statusLower = statusStr.toLowerCase()
          if (statusLower === 'active' || statusLower === 'a') {
            validStatus = 'Active'
          } else if (statusLower === 'inactive' || statusLower === 'i') {
            validStatus = 'Inactive'
          } else if (statusLower === 'left' || statusLower === 'l') {
            validStatus = 'Left'
          } else if (statusStr) {
            errors.push('Status must be Active, Inactive, or Left')
          }

          // Validate numeric fields
          const numBusFee = busFeeMonthly ? parseFloat(String(busFeeMonthly)) : undefined
          const numAnnual = annualFee ? parseFloat(String(annualFee)) : 0
          const numExam = examFee ? parseFloat(String(examFee)) : 0
          const numBook = bookFee ? parseFloat(String(bookFee)) : 0
          const numUniform = uniformFee ? parseFloat(String(uniformFee)) : 0
          const numDiscount = discount ? parseFloat(String(discount)) : 0
          const numMisc = miscFee ? parseFloat(String(miscFee)) : 0

          if (numBusFee !== undefined && isNaN(numBusFee)) {
            warnings.push('Invalid Bus Fee Monthly, will be set to 0')
          }
          if (isNaN(numAnnual)) warnings.push('Invalid Annual Fee, will be set to 0')
          if (isNaN(numExam)) warnings.push('Invalid Exam Fee, will be set to 0')
          if (isNaN(numBook)) warnings.push('Invalid Book Fee, will be set to 0')
          if (isNaN(numUniform)) warnings.push('Invalid Uniform Fee, will be set to 0')
          if (isNaN(numDiscount)) warnings.push('Invalid Discount, will be set to 0')
          if (isNaN(numMisc)) warnings.push('Invalid Misc Fee, will be set to 0')

          const student: BulkStudentRow = {
            admissionNo,
            rollNo: rollNo || undefined,
            fullName,
            gender: validGender,
            dateOfBirth: validDateOfBirth,
            className,
            section: section || undefined,
            fatherName: fatherName || undefined,
            motherName: motherName || undefined,
            guardianName: guardianName || undefined,
            phonePrimary,
            phoneSecondary: phoneSecondary || undefined,
            addressLine1: addressLine1 || undefined,
            addressLine2: addressLine2 || undefined,
            city: city || undefined,
            state: state || undefined,
            pincode: pincode || undefined,
            busOpted,
            busRouteId: busRouteId || undefined,
            busFeeMonthly: numBusFee !== undefined && !isNaN(numBusFee) ? numBusFee : undefined,
            status: validStatus,
            annualFee: !isNaN(numAnnual) ? numAnnual : 0,
            examFee: !isNaN(numExam) ? numExam : 0,
            bookFee: !isNaN(numBook) ? numBook : 0,
            uniformFee: !isNaN(numUniform) ? numUniform : 0,
            discount: !isNaN(numDiscount) ? numDiscount : 0,
            miscFee: !isNaN(numMisc) ? numMisc : 0,
          }

          students.push(student)
          validations.push({
            row: rowNum,
            student,
            errors,
            warnings,
          })
        })

        const isValid = validations.every((v) => v.errors.length === 0)

        resolve({
          students,
          validations,
          isValid,
        })
      } catch (error: any) {
        reject(new Error(`Failed to parse Excel file: ${error.message}`))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsArrayBuffer(file)
  })
}

/**
 * Convert BulkStudentRow to Student format (without id, createdAt, updatedAt)
 */
export function bulkStudentToStudent(
  bulkStudent: BulkStudentRow,
  academicYear: string
): Omit<Student, 'id' | 'createdAt' | 'updatedAt'> {
  const now = getTodayISO()
  return {
    admissionNo: bulkStudent.admissionNo,
    rollNo: bulkStudent.rollNo,
    fullName: bulkStudent.fullName,
    gender: bulkStudent.gender,
    dateOfBirth: bulkStudent.dateOfBirth,
    className: bulkStudent.className,
    section: bulkStudent.section,
    academicYear,
    fatherName: bulkStudent.fatherName,
    motherName: bulkStudent.motherName,
    guardianName: bulkStudent.guardianName,
    phonePrimary: bulkStudent.phonePrimary,
    phoneSecondary: bulkStudent.phoneSecondary,
    addressLine1: bulkStudent.addressLine1,
    addressLine2: bulkStudent.addressLine2,
    city: bulkStudent.city,
    state: bulkStudent.state,
    pincode: bulkStudent.pincode,
    busOpted: bulkStudent.busOpted,
    busRouteId: bulkStudent.busRouteId,
    busFeeMonthly: bulkStudent.busFeeMonthly,
    status: bulkStudent.status,
  }
}
