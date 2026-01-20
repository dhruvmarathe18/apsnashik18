import React, { useState, useEffect } from 'react'
import { useTransport } from '../context/TransportContext'
import { exportDriverReportToExcel } from '../utils/excelExport'

function DriverReport() {
  const { calculateDriverTotals, getAllDrivers, getBusData, BUS_NAMES } = useTransport()

  const [selectedDriver, setSelectedDriver] = useState('')
  const [drivers, setDrivers] = useState([])
  const [reportData, setReportData] = useState(null)

  useEffect(() => {
    const driverList = getAllDrivers()
    setDrivers(driverList)
  }, [getAllDrivers])

  const generateReport = () => {
    if (!selectedDriver) {
      alert('Please select a driver')
      return
    }

    const totals = calculateDriverTotals(selectedDriver)
    const allEntries = []

    BUS_NAMES.forEach(bus => {
      const data = getBusData(bus)
      data.forEach(entry => {
        const driver = entry['Driver Name']
        if (driver && driver.toLowerCase().trim() === selectedDriver.toLowerCase().trim()) {
          allEntries.push({
            ...entry,
            Bus: bus
          })
        }
      })
    })

    allEntries.sort((a, b) => {
      const dateA = new Date(a.Date)
      const dateB = new Date(b.Date)
      return dateA - dateB
    })

    setReportData({ totals, entries: allEntries, driver: selectedDriver })
  }

  const handleExport = () => {
    if (!reportData) {
      alert('Please generate report first')
      return
    }
    exportDriverReportToExcel(reportData)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-primary-700 mb-8">👤 Driver Report</h1>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Select Driver</h3>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Driver *
          </label>
          <select
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select Driver</option>
            {drivers.map(driver => (
              <option key={driver} value={driver}>{driver}</option>
            ))}
          </select>
        </div>
        <button
          onClick={generateReport}
          className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition"
        >
          Generate Report
        </button>
      </div>

      {reportData && (
        <div>
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-2xl font-bold mb-4">
              Driver Summary - {reportData.driver}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-sm opacity-90">Total KM Driven</div>
                <div className="text-3xl font-bold">{reportData.totals.totalKM}</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-sm opacity-90">Total Diesel Amount</div>
                <div className="text-3xl font-bold">₹{reportData.totals.totalDieselAmount}</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-sm opacity-90">Total Expenses</div>
                <div className="text-3xl font-bold">₹{reportData.totals.totalExpense}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
            <h3 className="text-xl font-semibold p-4 bg-gray-50 border-b">All Entries</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary-500 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Bus</th>
                    <th className="px-4 py-3 text-right">Start KM</th>
                    <th className="px-4 py-3 text-right">End KM</th>
                    <th className="px-4 py-3 text-right">Daily KM</th>
                    <th className="px-4 py-3 text-right">Diesel (L)</th>
                    <th className="px-4 py-3 text-right">Diesel Rate</th>
                    <th className="px-4 py-3 text-right">Diesel Amount</th>
                    <th className="px-4 py-3 text-right">Other Expense</th>
                    <th className="px-4 py-3 text-left">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.entries.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="px-4 py-8 text-center text-gray-500">
                        No entries found for this driver
                      </td>
                    </tr>
                  ) : (
                    reportData.entries.map((entry, index) => {
                      const date = new Date(entry.Date)
                      const formattedDate = date.toLocaleDateString('en-GB')
                      return (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">{formattedDate}</td>
                          <td className="px-4 py-3">{entry.Bus}</td>
                          <td className="px-4 py-3 text-right">{parseFloat(entry['Start KM'] || 0).toFixed(2)}</td>
                          <td className="px-4 py-3 text-right">{parseFloat(entry['End KM'] || 0).toFixed(2)}</td>
                          <td className="px-4 py-3 text-right">{parseFloat(entry['Daily KM'] || 0).toFixed(2)}</td>
                          <td className="px-4 py-3 text-right">{parseFloat(entry['Diesel Filled'] || 0).toFixed(2)}</td>
                          <td className="px-4 py-3 text-right">{parseFloat(entry['Diesel Rate'] || 0).toFixed(2)}</td>
                          <td className="px-4 py-3 text-right">₹{parseFloat(entry['Diesel Amount'] || 0).toFixed(2)}</td>
                          <td className="px-4 py-3 text-right">₹{parseFloat(entry['Other Expense'] || 0).toFixed(2)}</td>
                          <td className="px-4 py-3">{entry['Remarks'] || '-'}</td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <button
            onClick={handleExport}
            className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition font-semibold text-lg"
          >
            📊 Export Driver Report to Excel
          </button>
        </div>
      )}
    </div>
  )
}

export default DriverReport
