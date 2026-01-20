import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export function exportBusReportToExcel(reportData) {
  const { totals, entries, bus, month, year } = reportData

  // Create new workbook
  const wb = XLSX.utils.book_new()

  // Summary sheet
  const summaryData = [
    ['Bus Monthly Report'],
    ['Bus:', bus],
    ['Month:', `${month}/${year}`],
    [],
    ['Summary'],
    ['Total KM', totals.totalKM],
    ['Total Diesel (Liters)', totals.totalDiesel],
    ['Diesel Amount', totals.totalDieselAmount],
    ['Other Expenses', totals.totalOtherExpense],
    ['Total Expenses', totals.totalExpense],
    ['Monthly Average (KM/L)', totals.monthlyAverage],
    [],
    ['Daily Entries'],
    ['Date', 'Driver Name', 'Start KM', 'End KM', 'Daily KM', 'Diesel Filled', 'Diesel Rate', 'Diesel Amount', 'Expense Description', 'Other Expense', 'Running KM', 'Actual Average', 'Remarks']
  ]

  entries.forEach(entry => {
    summaryData.push([
      entry.Date,
      entry['Driver Name'] || '',
      entry['Start KM'] || 0,
      entry['End KM'] || 0,
      entry['Daily KM'] || 0,
      entry['Diesel Filled'] || 0,
      entry['Diesel Rate'] || 0,
      entry['Diesel Amount'] || 0,
      entry['Expense Description'] || '',
      entry['Other Expense'] || 0,
      entry['Running KM'] || 0,
      entry['Actual Average'] || 0,
      entry['Remarks'] || ''
    ])
  })

  const summaryWS = XLSX.utils.aoa_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(wb, summaryWS, 'Monthly Report')

  // Download
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([wbout], { type: 'application/octet-stream' })
  const fileName = `BusReport_${bus}_${month}_${year}.xlsx`
  saveAs(blob, fileName)
}

export function exportDriverReportToExcel(reportData) {
  const { totals, entries, driver } = reportData

  // Create new workbook
  const wb = XLSX.utils.book_new()

  // Summary sheet
  const summaryData = [
    ['Driver Report'],
    ['Driver:', driver],
    [],
    ['Summary'],
    ['Total KM Driven', totals.totalKM],
    ['Total Diesel Amount', totals.totalDieselAmount],
    ['Total Expenses', totals.totalExpense],
    [],
    ['All Entries'],
    ['Date', 'Bus', 'Driver Name', 'Start KM', 'End KM', 'Daily KM', 'Diesel Filled', 'Diesel Rate', 'Diesel Amount', 'Expense Description', 'Other Expense', 'Running KM', 'Actual Average', 'Remarks']
  ]

  entries.forEach(entry => {
    summaryData.push([
      entry.Date,
      entry.Bus,
      entry['Driver Name'] || '',
      entry['Start KM'] || 0,
      entry['End KM'] || 0,
      entry['Daily KM'] || 0,
      entry['Diesel Filled'] || 0,
      entry['Diesel Rate'] || 0,
      entry['Diesel Amount'] || 0,
      entry['Expense Description'] || '',
      entry['Other Expense'] || 0,
      entry['Running KM'] || 0,
      entry['Actual Average'] || 0,
      entry['Remarks'] || ''
    ])
  })

  const summaryWS = XLSX.utils.aoa_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(wb, summaryWS, 'Driver Report')

  // Download
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([wbout], { type: 'application/octet-stream' })
  const fileName = `DriverReport_${driver.replace(/\s+/g, '_')}.xlsx`
  saveAs(blob, fileName)
}

export function exportAllDataToExcel(transportData, BUS_NAMES) {
  const wb = XLSX.utils.book_new()

  BUS_NAMES.forEach(bus => {
    const data = transportData[bus] || []
    if (data.length > 0) {
      const headers = [
        'Date', 'Driver Name', 'Start KM', 'End KM', 'Daily KM',
        'Diesel Filled', 'Diesel Rate', 'Diesel Amount',
        'Expense Description', 'Other Expense', 'Running KM',
        'Actual Average', 'Remarks'
      ]
      const sheetData = [headers, ...data.map(entry => [
        entry.Date,
        entry['Driver Name'] || '',
        entry['Start KM'] || 0,
        entry['End KM'] || 0,
        entry['Daily KM'] || 0,
        entry['Diesel Filled'] || 0,
        entry['Diesel Rate'] || 0,
        entry['Diesel Amount'] || 0,
        entry['Expense Description'] || '',
        entry['Other Expense'] || 0,
        entry['Running KM'] || 0,
        entry['Actual Average'] || 0,
        entry['Remarks'] || ''
      ])]
      const ws = XLSX.utils.aoa_to_sheet(sheetData)
      XLSX.utils.book_append_sheet(wb, ws, bus)
    }
  })

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([wbout], { type: 'application/octet-stream' })
  saveAs(blob, 'SchoolTransport_Backup.xlsx')
}
