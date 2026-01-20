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
 * Format date to Indian format (DD/MM/YYYY)
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return ''
  
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  
  return `${day}/${month}/${year}`
}

/**
 * Format date to readable format (DD MMM YYYY)
 */
export function formatDateReadable(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return ''
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const day = d.getDate()
  const month = months[d.getMonth()]
  const year = d.getFullYear()
  
  return `${day} ${month} ${year}`
}

/**
 * Format date to ISO string (YYYY-MM-DD)
 */
export function formatDateISO(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return ''
  
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  
  return `${year}-${month}-${day}`
}

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 */
export function getTodayISO(): string {
  return formatDateISO(new Date())
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
