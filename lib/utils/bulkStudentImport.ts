import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { Student, Gender, StudentStatus, BloodGroup, CasteCategory, FeePlan } from '@/types/school'
import { generateUUID, getTodayISO } from './format'

export interface BulkStudentRow {
  admissionNo: string
  rollNo?: string
  fullName: string
  gender?: Gender
  dateOfBirth?: string
  aadharNumber?: string
  className: string
  section?: string
  fatherName?: string
  motherName?: string
  guardianName?: string
  previousSchoolName?: string
  bloodGroup?: BloodGroup
  casteCategory?: CasteCategory
  casteOther?: string
  birthPlace?: string
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
  busRouteAddress?: string
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
 * If students and feePlans are provided, populates template with existing data for updates
 */
export function downloadStudentTemplate(
  academicYear: string, 
  classes: string[],
  students?: Student[],
  feePlans?: FeePlan[]
): void {
  const wb = XLSX.utils.book_new()

  // Create template data with headers (use simple names for easier parsing)
  const headers = [
    'Admission No*',
    'Roll No',
    'Full Name*',
    'Gender',
    'Date of Birth',
    'Aadhar Number',
    'Class*',
    'Section',
    'Father Name',
    'Mother Name',
    'Guardian Name',
    'Previous School Name',
    'Blood Group',
    'Caste Belongs To',
    'Caste Other',
    'Birth Place',
    'Phone Primary*',
    'Phone Secondary',
    'Address Line 1',
    'Address Line 2',
    'City',
    'State',
    'Pincode',
    'Bus Opted',
    'Bus Route ID',
    'Bus Route Address',
    'Bus Fee Monthly',
    'Status',
    'Tuition Fee',
    'Exam Fee',
    'Book Fee',
    'Uniform Fee',
    'Discount',
    'Misc Fee'
  ]

  // If students are provided, use existing data; otherwise use example
  let templateRows: any[][] = []
  
  if (students && students.length > 0) {
    // Populate with existing student data
    templateRows = students.map((student) => {
      const feePlan = feePlans?.find((fp) => fp.studentId === student.id)
      return [
        student.admissionNo || '',
        student.rollNo || '',
        student.fullName || '',
        student.gender || '',
        student.dateOfBirth || '',
        student.aadharNumber || '',
        student.className || '',
        student.section || '',
        student.fatherName || '',
        student.motherName || '',
        student.guardianName || '',
        student.previousSchoolName || '',
        student.bloodGroup || '',
        student.casteCategory || '',
        student.casteOther || '',
        student.birthPlace || '',
        student.phonePrimary || '',
        student.phoneSecondary || '',
        student.addressLine1 || '',
        student.addressLine2 || '',
        student.city || '',
        student.state || '',
        student.pincode || '',
        student.busOpted ? 'Yes' : 'No',
        student.busRouteId || '',
        student.busRouteAddress || '',
        student.busFeeMonthly || '',
        student.status || 'Active',
        feePlan?.annualFee || '',
        feePlan?.examFee || '',
        feePlan?.bookFee || '',
        feePlan?.uniformFee || '',
        feePlan?.discount || '',
        feePlan?.miscFee || '',
      ]
    })
  } else {
    // Use example row if no students provided
    const exampleRow = [
      'STU001',
      '1',
      'John Doe',
      'Male',
      '2010-05-15',
      '123412341234',
      '5th',
      'A',
      'Father Name',
      'Mother Name',
      '',
      'ABC Public School',
      'O+',
      'OBC',
      '',
      'Nashik, Maharashtra',
      '9876543210',
      '9876543211',
      '123 Main Street',
      'Near Park',
      'Nashik',
      'Maharashtra',
      '422001',
      'Yes',
      'Route A',
      'Main Road Stop, Nashik',
      '500',
      'Active',
      '5000',
      '500',
      '1000',
      '800',
      '0',
      '0'
    ]
    templateRows = [exampleRow]
  }

  const instructions = [
    ['Instructions:'],
    ['1. Fill in all required fields marked with *'],
    ['2. Gender: Enter "Male", "Female", or "Other" (case insensitive)'],
    ['3. Bus Opted: Enter "Yes" or "No" (case insensitive)'],
    ['4. Status: Enter "Active", "Inactive", or "Left" (case insensitive)'],
    ['5. Date format: YYYY-MM-DD (e.g., 2010-05-15)'],
    ['6. Aadhar Number: Enter exactly 12 digits (numbers only)'],
    ['7. Blood Group: Enter A+, A-, B+, B-, AB+, AB-, O+, O-, or Not Known'],
    ['8. Academic Year will be set to: ' + academicYear],
    ['9. Do not modify the header row'],
    ['10. Existing students will be UPDATED based on Admission No'],
    ['11. New students will be CREATED if Admission No does not exist'],
    [''],
    ['Available Classes: ' + classes.join(', ')],
    [''],
    ...headers.map((h, i) => [h, templateRows[0]?.[i] || ''])
  ]

  // Instructions sheet
  const instructionsSheet = XLSX.utils.aoa_to_sheet(instructions)
  XLSX.utils.book_append_sheet(wb, instructionsSheet, 'Instructions')

  // Template sheet with headers and data
  const templateData = [headers, ...templateRows]
  const templateSheet = XLSX.utils.aoa_to_sheet(templateData)
  
  // Set column widths
  const colWidths = headers.map(() => ({ wch: 20 }))
  templateSheet['!cols'] = colWidths

  XLSX.utils.book_append_sheet(wb, templateSheet, 'Students')

  // Download
  const fileName = students && students.length > 0 
    ? `Student_Update_Template_${academicYear}_${new Date().toISOString().split('T')[0]}.xlsx`
    : `Student_Import_Template_${academicYear}.xlsx`
  
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([wbout], { type: 'application/octet-stream' })
  saveAs(blob, fileName)
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

          // Helper function to get value from row with flexible column name matching
          const getValue = (possibleNames: string[], defaultValue: string = ''): string => {
            for (const name of possibleNames) {
              if (row[name] !== undefined && row[name] !== null && row[name] !== '') {
                return String(row[name]).trim()
              }
            }
            // Try case-insensitive matching
            const rowKeys = Object.keys(row)
            for (const name of possibleNames) {
              const matchingKey = rowKeys.find(key => 
                key.toLowerCase().replace(/[()]/g, '').includes(name.toLowerCase().replace(/[()]/g, ''))
              )
              if (matchingKey && row[matchingKey] !== undefined && row[matchingKey] !== null && row[matchingKey] !== '') {
                return String(row[matchingKey]).trim()
              }
            }
            return defaultValue
          }

          // Map Excel columns to student fields (handle various column name formats)
          const admissionNo = getValue(['Admission No', 'Admission No*', 'admissionNo', 'AdmissionNo'], '')
          const rollNo = getValue(['Roll No', 'rollNo', 'RollNo'], '')
          const fullName = getValue(['Full Name', 'Full Name*', 'fullName', 'FullName'], '')
          const gender = getValue(['Gender', 'Gender (Male/Female/Other)', 'gender'], '')
          const dateOfBirth = getValue(['Date of Birth', 'Date of Birth (YYYY-MM-DD)', 'dateOfBirth', 'DateOfBirth'], '')
          const className = getValue(['Class', 'Class*', 'class', 'className'], '')
          const section = getValue(['Section', 'section'], '')
          const fatherName = getValue(['Father Name', 'fatherName', 'FatherName'], '')
          const motherName = getValue(['Mother Name', 'motherName', 'MotherName'], '')
          const guardianName = getValue(['Guardian Name', 'guardianName', 'GuardianName'], '')
          const aadharRaw = getValue([
            'Aadhar Number',
            'Aadhar Number (12 digits)',
            'Aadhaar Number',
            'Aadhar',
            'Aadhaar',
            'aadharNumber'
          ], '')
          const previousSchoolName = getValue(['Previous School Name', 'previousSchoolName'], '')
          const bloodGroupStr = getValue([
            'Blood Group',
            'Blood Group (A+/A-/B+/B-/AB+/AB-/O+/O-/Not Known)',
            'bloodGroup'
          ], '')
          const casteCategoryStr = getValue([
            'Caste Belongs To',
            'Caste Belongs To (General/OBC/SC/ST/VJNT/SBC/EWS/Other)',
            'Caste',
            'casteCategory'
          ], '')
          const casteOther = getValue([
            'Caste Other',
            'Caste Other (Specify if Other)',
            'casteOther'
          ], '')
          const birthPlace = getValue(['Birth Place', 'birthPlace'], '')
          const phonePrimary = getValue(['Phone Primary', 'Phone Primary*', 'phonePrimary', 'PhonePrimary'], '')
          const phoneSecondary = getValue(['Phone Secondary', 'phoneSecondary', 'PhoneSecondary'], '')
          const addressLine1 = getValue(['Address Line 1', 'addressLine1', 'AddressLine1'], '')
          const addressLine2 = getValue(['Address Line 2', 'addressLine2', 'AddressLine2'], '')
          const city = getValue(['City', 'city'], '')
          const state = getValue(['State', 'state'], '')
          const pincode = getValue(['Pincode', 'pincode'], '')
          const busOptedStr = getValue(['Bus Opted', 'Bus Opted (Yes/No)', 'busOpted', 'BusOpted'], 'No')
          const busRouteId = getValue(['Bus Route ID', 'busRouteId', 'BusRouteId'], '')
          const busRouteAddress = getValue(['Bus Route Address', 'busRouteAddress'], '')
          const busFeeMonthly = row['Bus Fee Monthly'] || row['busFeeMonthly'] || row['BusFeeMonthly'] || ''
          const statusStr = getValue(['Status', 'Status (Active/Inactive/Left)', 'status'], 'Active')
          const annualFee = row['Tuition Fee'] || row['Annual Fee'] || row['annualFee'] || row['AnnualFee'] || 0
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

          // Note: Existing admission numbers will be updated, not treated as errors

          // Validate phone number
          if (phonePrimary && !/^\d{10}$/.test(phonePrimary.replace(/\D/g, ''))) {
            errors.push('Phone Primary must be 10 digits')
          }

          // Validate gender
          let validGender: Gender | undefined
          if (gender) {
            const genderLower = gender.toLowerCase().trim()
            if (genderLower === 'male' || genderLower === 'm' || genderLower === 'male (male/female/other)') {
              validGender = 'Male'
            } else if (genderLower === 'female' || genderLower === 'f' || genderLower === 'female (male/female/other)') {
              validGender = 'Female'
            } else if (genderLower === 'other' || genderLower === 'o' || genderLower === 'other (male/female/other)') {
              validGender = 'Other'
            } else {
              // Don't error, just warn - allow empty gender
              warnings.push(`Gender "${gender}" not recognized, will be left empty`)
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

          // Validate bus opted - handle various formats
          const busOptedLower = String(busOptedStr).toLowerCase().trim()
          const busOpted = busOptedLower === 'yes' || 
                          busOptedLower === 'y' || 
                          busOptedLower === 'true' || 
                          busOptedLower === '1' ||
                          busOptedLower === 'yes (yes/no)' ||
                          busOptedLower === 'true (yes/no)'

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
          if (isNaN(numAnnual)) warnings.push('Invalid Tuition Fee, will be set to 0')
          if (isNaN(numExam)) warnings.push('Invalid Exam Fee, will be set to 0')
          if (isNaN(numBook)) warnings.push('Invalid Book Fee, will be set to 0')
          if (isNaN(numUniform)) warnings.push('Invalid Uniform Fee, will be set to 0')
          if (isNaN(numDiscount)) warnings.push('Invalid Discount, will be set to 0')
          if (isNaN(numMisc)) warnings.push('Invalid Misc Fee, will be set to 0')

          // Validate Aadhar number - extract digits only
          let validAadhar: string | undefined = undefined
          if (aadharRaw) {
            const digitsOnly = String(aadharRaw).replace(/\D/g, '')
            if (digitsOnly.length === 0) {
              // Empty or invalid, just leave it empty
              validAadhar = undefined
            } else if (digitsOnly.length === 12) {
              validAadhar = digitsOnly
            } else {
              errors.push(`Aadhar Number must be exactly 12 digits (found ${digitsOnly.length} digits)`)
            }
          }

          // Validate blood group - handle various formats
          let validBloodGroup: BloodGroup | undefined
          if (bloodGroupStr) {
            const cleaned = bloodGroupStr.trim().toUpperCase().replace(/\s+/g, '')
            const allowed: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Not Known']
            
            // Handle "Not Known" variations
            if (cleaned === 'NOTKNOWN' || cleaned === 'UNKNOWN' || cleaned.includes('NOTKNOWN') || cleaned.includes('UNKNOWN')) {
              validBloodGroup = 'Not Known'
            } else {
              // Try to match exact format
              const match = cleaned.match(/^([ABO]+)([+-])$/)
              if (match) {
                const bloodType = match[1] + match[2]
                if (allowed.includes(bloodType as BloodGroup)) {
                  validBloodGroup = bloodType as BloodGroup
                }
              } else if (allowed.includes(cleaned as BloodGroup)) {
                validBloodGroup = cleaned as BloodGroup
              } else {
                // Try common variations
                const variations: Record<string, BloodGroup> = {
                  'APLUS': 'A+',
                  'AMINUS': 'A-',
                  'BPLUS': 'B+',
                  'BMINUS': 'B-',
                  'ABPLUS': 'AB+',
                  'ABMINUS': 'AB-',
                  'OPLUS': 'O+',
                  'OMINUS': 'O-',
                }
                if (variations[cleaned]) {
                  validBloodGroup = variations[cleaned]
                } else {
                  warnings.push(`Blood Group "${bloodGroupStr}" not recognized, will be left empty`)
                }
              }
            }
          }

          // Validate caste category
          let validCasteCategory: CasteCategory | undefined
          let validCasteOther: string | undefined = casteOther || undefined
          if (casteCategoryStr) {
            const lower = casteCategoryStr.toLowerCase()
            const map: Record<string, CasteCategory> = {
              general: 'General',
              gen: 'General',
              obc: 'OBC',
              'o.b.c': 'OBC',
              sc: 'SC',
              st: 'ST',
              vjnt: 'VJNT',
              sbc: 'SBC',
              ews: 'EWS',
              other: 'Other',
            }
            validCasteCategory = map[lower] || 'Other'
            if (validCasteCategory === 'Other' && !validCasteOther) {
              warnings.push('Caste category set to Other but no description provided')
            }
          }

          const student: BulkStudentRow = {
            admissionNo,
            rollNo: rollNo || undefined,
            fullName,
            gender: validGender,
            dateOfBirth: validDateOfBirth,
            aadharNumber: validAadhar,
            className,
            section: section || undefined,
            fatherName: fatherName || undefined,
            motherName: motherName || undefined,
            guardianName: guardianName || undefined,
            previousSchoolName: previousSchoolName || undefined,
            bloodGroup: validBloodGroup,
            casteCategory: validCasteCategory,
            casteOther: validCasteOther,
            birthPlace: birthPlace || undefined,
            phonePrimary,
            phoneSecondary: phoneSecondary || undefined,
            addressLine1: addressLine1 || undefined,
            addressLine2: addressLine2 || undefined,
            city: city || undefined,
            state: state || undefined,
            pincode: pincode || undefined,
            busOpted,
            busRouteId: busRouteId || undefined,
            busRouteAddress: busRouteAddress || undefined,
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
    aadharNumber: bulkStudent.aadharNumber,
    className: bulkStudent.className,
    section: bulkStudent.section,
    academicYear,
    fatherName: bulkStudent.fatherName,
    motherName: bulkStudent.motherName,
    guardianName: bulkStudent.guardianName,
    previousSchoolName: bulkStudent.previousSchoolName,
    bloodGroup: bulkStudent.bloodGroup,
    casteCategory: bulkStudent.casteCategory,
    casteOther: bulkStudent.casteOther,
    birthPlace: bulkStudent.birthPlace,
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
    busRouteAddress: bulkStudent.busRouteAddress,
    status: bulkStudent.status,
  }
}
