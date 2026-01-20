// Utility functions for formatting

/**
 * Format number as Indian Rupee currency
 * @param amount - Amount to format
 * @param showSymbol - Whether to show ₹ symbol (default: true)
 * @returns Formatted string like "₹1,23,456.78"
 */
export function formatRupee(amount: number | string, showSymbol: boolean = true): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(numAmount)) return showSymbol ? '₹0' : '0'
  
  // Format with Indian numbering system (lakhs, crores)
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount)
  
  return showSymbol ? `₹${formatted}` : formatted
}

/**
 * Format number as Indian Rupee currency without decimals
 */
export function formatRupeeNoDecimals(amount: number | string, showSymbol: boolean = true): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(numAmount)) return showSymbol ? '₹0' : '0'
  
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(numAmount)
  
  return showSymbol ? `₹${formatted}` : formatted
}

/**
 * Parse rupee string to number
 * @param rupeeString - String like "₹1,23,456.78" or "123456.78"
 * @returns Number
 */
export function parseRupee(rupeeString: string): number {
  if (!rupeeString) return 0
  const cleaned = rupeeString.replace(/[₹,\s]/g, '')
  return parseFloat(cleaned) || 0
}

/**
 * Convert date string (YYYY-MM-DD) to Date object
 * YYYY-MM-DD strings are timezone-agnostic, so we parse them as local date
 */
function parseDateString(dateStr: string): Date {
  if (!dateStr) return new Date()
  // If it's already in YYYY-MM-DD format, parse it as local date (will be treated as IST in India)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split('-').map(Number)
    // Create date in local timezone (which is IST in India)
    return new Date(year, month - 1, day)
  }
  return new Date(dateStr)
}

/**
 * Format date to Indian format (DD/MM/YYYY) using IST
 */
export function formatDate(date: string | Date): string {
  let d: Date
  if (typeof date === 'string') {
    d = parseDateString(date)
  } else {
    d = date
  }
  if (isNaN(d.getTime())) return ''
  
  // For Date objects with time, convert to IST for display
  // For YYYY-MM-DD strings, they're already in local timezone (IST in India)
  const utcTime = d.getTime() + (d.getTimezoneOffset() * 60 * 1000)
  const istOffset = 5.5 * 60 * 60 * 1000
  const istTime = new Date(utcTime + istOffset)
  
  const day = String(istTime.getDate()).padStart(2, '0')
  const month = String(istTime.getMonth() + 1).padStart(2, '0')
  const year = istTime.getFullYear()
  
  return `${day}/${month}/${year}`
}

/**
 * Format date to readable format (DD MMM YYYY) using IST
 */
export function formatDateReadable(date: string | Date): string {
  let d: Date
  if (typeof date === 'string') {
    d = parseDateString(date)
  } else {
    d = date
  }
  if (isNaN(d.getTime())) return ''
  
  // For Date objects with time, convert to IST for display
  // For YYYY-MM-DD strings, they're already in local timezone (IST in India)
  const utcTime = d.getTime() + (d.getTimezoneOffset() * 60 * 1000)
  const istOffset = 5.5 * 60 * 60 * 1000
  const istTime = new Date(utcTime + istOffset)
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const day = istTime.getDate()
  const month = months[istTime.getMonth()]
  const year = istTime.getFullYear()
  
  return `${day} ${month} ${year}`
}

/**
 * Get current date/time in Indian Standard Time (IST - UTC+5:30)
 */
export function getISTDate(): Date {
  const now = new Date()
  // IST is UTC+5:30
  // Get UTC time
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60 * 1000)
  // Add IST offset (5 hours 30 minutes)
  const istOffset = 5.5 * 60 * 60 * 1000
  const istTime = new Date(utcTime + istOffset)
  return istTime
}

/**
 * Get IST timestamp as ISO string (for createdAt, updatedAt)
 */
export function getISTTimestamp(): string {
  return getISTDate().toISOString()
}

/**
 * Format date to ISO string (YYYY-MM-DD) using IST
 * For date strings in YYYY-MM-DD format, returns as-is (timezone-agnostic)
 * For Date objects, converts to IST before extracting date components
 */
export function formatDateISO(date: Date | string): string {
  if (typeof date === 'string') {
    // If it's already in YYYY-MM-DD format, return as is (timezone-agnostic)
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date
    }
    // Parse the date string and convert to IST
    const d = new Date(date)
    if (isNaN(d.getTime())) return ''
    
    const utcTime = d.getTime() + (d.getTimezoneOffset() * 60 * 1000)
    const istOffset = 5.5 * 60 * 60 * 1000
    const istTime = new Date(utcTime + istOffset)
    
    const year = istTime.getFullYear()
    const month = String(istTime.getMonth() + 1).padStart(2, '0')
    const day = String(istTime.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  
  // For Date objects, convert to IST
  if (isNaN(date.getTime())) return ''
  
  const utcTime = date.getTime() + (date.getTimezoneOffset() * 60 * 1000)
  const istOffset = 5.5 * 60 * 60 * 1000
  const istTime = new Date(utcTime + istOffset)
  
  const year = istTime.getFullYear()
  const month = String(istTime.getMonth() + 1).padStart(2, '0')
  const day = String(istTime.getDate()).padStart(2, '0')
  
  return `${year}-${month}-${day}`
}

/**
 * Get today's date in ISO format (YYYY-MM-DD) using IST
 */
export function getTodayISO(): string {
  const istDate = getISTDate()
  const year = istDate.getFullYear()
  const month = String(istDate.getMonth() + 1).padStart(2, '0')
  const day = String(istDate.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Generate UUID v4
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Format class name (e.g., "1st", "2nd", etc.)
 */
export function formatClassName(className: string): string {
  const classMap: Record<string, string> = {
    '1': '1st',
    '2': '2nd',
    '3': '3rd',
    '4': '4th',
    '5': '5th',
    '6': '6th',
    '7': '7th',
    '8': '8th',
    '9': '9th',
    '10': '10th',
    '11': '11th',
    '12': '12th',
  }
  
  return classMap[className] || className
}

/**
 * Calculate percentage
 */
export function calculatePercentage(part: number, total: number): number {
  if (total === 0) return 0
  return (part / total) * 100
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}
