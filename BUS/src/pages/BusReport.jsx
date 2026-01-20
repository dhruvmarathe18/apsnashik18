import React, { useState, useEffect } from 'react'
import { useTransport } from '../context/TransportContext'
import { exportBusReportToExcel } from '../utils/excelExport'

function BusReport() {
  const { getBusData, calculateMonthlyTotals, updateEntry, deleteEntry, findEntryIndex, BUS_NAMES } = useTransport()

  const [selectedBus, setSelectedBus] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const [reportData, setReportData] = useState(null)
  const [editingEntry, setEditingEntry] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [alert, setAlert] = useState(null)

  const generateReport = () => {
    if (!selectedBus || !selectedMonth) {
      setAlert({ type: 'error', message: 'Please select both Bus and Month' })
      setTimeout(() => setAlert(null), 3000)
      return
    }

    const [year, month] = selectedMonth.split('-').map(Number)
    const monthIndex = month - 1

    const totals = calculateMonthlyTotals(selectedBus, monthIndex, year)
    const data = getBusData(selectedBus)
    const monthEntries = data
      .filter(entry => {
        const entryDate = new Date(entry.Date)
        return entryDate.getMonth() === monthIndex && entryDate.getFullYear() === year
      })
      .sort((a, b) => {
        const dateA = new Date(a.Date)
        const dateB = new Date(b.Date)
        return dateA - dateB
      })

    setReportData({ totals, entries: monthEntries, bus: selectedBus, month, year, monthIndex })
  }

  // Refresh report after edit/delete - removed to prevent infinite loop
  // Report will refresh when user clicks "Generate Report" again

  const handleEdit = (entry) => {
    setEditingEntry({ ...entry })
  }

  const handleSaveEdit = () => {
    if (!editingEntry) return

    try {
      const entryIndex = findEntryIndex(editingEntry.Bus, editingEntry.Date)
      if (entryIndex === -1) {
        throw new Error('Entry not found')
      }

      // Recalculate Daily KM
      const dailyKM = parseFloat(editingEntry['End KM'] || 0) - parseFloat(editingEntry['Start KM'] || 0)
      editingEntry['Daily KM'] = dailyKM >= 0 ? dailyKM : 0

      // Recalculate Diesel Amount
      const dieselAmount = parseFloat(editingEntry['Diesel Filled'] || 0) * parseFloat(editingEntry['Diesel Rate'] || 0)
      editingEntry['Diesel Amount'] = dieselAmount

      updateEntry(editingEntry.Bus, entryIndex, editingEntry)
      setEditingEntry(null)
      setAlert({ type: 'success', message: 'Entry updated successfully! Please regenerate the report.' })
      setTimeout(() => setAlert(null), 5000)
      // Refresh report
      setTimeout(() => {
        generateReport()
      }, 100)
    } catch (error) {
      setAlert({ type: 'error', message: error.message })
      setTimeout(() => setAlert(null), 3000)
    }
  }

  const handleDelete = (entry) => {
    setDeleteConfirm(entry)
  }

  const confirmDelete = () => {
    if (!deleteConfirm) return

    try {
      const entryIndex = findEntryIndex(deleteConfirm.Bus, deleteConfirm.Date)
      if (entryIndex === -1) {
        throw new Error('Entry not found')
      }

      deleteEntry(deleteConfirm.Bus, entryIndex)
      setDeleteConfirm(null)
      setAlert({ type: 'success', message: 'Entry deleted successfully! Please regenerate the report.' })
      setTimeout(() => setAlert(null), 5000)
      // Refresh report
      setTimeout(() => {
        generateReport()
      }, 100)
    } catch (error) {
      setAlert({ type: 'error', message: error.message })
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  const handleExport = () => {
    if (!reportData) {
      setAlert({ type: 'error', message: 'Please generate report first' })
      setTimeout(() => setAlert(null), 3000)
      return
    }
    exportBusReportToExcel(reportData)
  }

  const handleEditChange = (field, value) => {
    setEditingEntry(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-primary-700 mb-8">🚌 Bus Report</h1>

      {alert && (
        <div className={`mb-6 p-4 rounded-lg ${
          alert.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-400' 
            : 'bg-red-100 text-red-800 border border-red-400'
        }`}>
          {alert.message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Select Report Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Bus *
            </label>
            <select
              value={selectedBus}
              onChange={(e) => setSelectedBus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select Bus</option>
              {BUS_NAMES.map(bus => (
                <option key={bus} value={bus}>{bus}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Month *
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
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
              Monthly Summary - {reportData.bus} ({reportData.month}/{reportData.year})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-sm opacity-90">Total KM</div>
                <div className="text-2xl font-bold">{reportData.totals.totalKM}</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-sm opacity-90">Total Diesel (L)</div>
                <div className="text-2xl font-bold">{reportData.totals.totalDiesel}</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-sm opacity-90">Diesel Amount</div>
                <div className="text-2xl font-bold">₹{reportData.totals.totalDieselAmount}</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-sm opacity-90">Other Expenses</div>
                <div className="text-2xl font-bold">₹{reportData.totals.totalOtherExpense}</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-sm opacity-90">Total Expenses</div>
                <div className="text-2xl font-bold">₹{reportData.totals.totalExpense}</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-sm opacity-90">Monthly Average</div>
                <div className="text-2xl font-bold">{reportData.totals.monthlyAverage} KM/L</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
            <h3 className="text-xl font-semibold p-4 bg-gray-50 border-b">Daily Entries</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary-500 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Driver</th>
                    <th className="px-4 py-3 text-right">Start KM</th>
                    <th className="px-4 py-3 text-right">End KM</th>
                    <th className="px-4 py-3 text-right">Daily KM</th>
                    <th className="px-4 py-3 text-right">Diesel (L)</th>
                    <th className="px-4 py-3 text-right">Diesel Rate</th>
                    <th className="px-4 py-3 text-right">Diesel Amount</th>
                    <th className="px-4 py-3 text-right">Other Expense</th>
                    <th className="px-4 py-3 text-right">Running KM</th>
                    <th className="px-4 py-3 text-right">Average</th>
                    <th className="px-4 py-3 text-left">Remarks</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.entries.length === 0 ? (
                    <tr>
                      <td colSpan="13" className="px-4 py-8 text-center text-gray-500">
                        No entries found for this month
                      </td>
                    </tr>
                  ) : (
                    reportData.entries.map((entry, index) => {
                      const date = new Date(entry.Date)
                      const formattedDate = date.toLocaleDateString('en-GB')
                      return (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">{formattedDate}</td>
                          <td className="px-4 py-3">{entry['Driver Name'] || '-'}</td>
                          <td className="px-4 py-3 text-right">{parseFloat(entry['Start KM'] || 0).toFixed(2)}</td>
                          <td className="px-4 py-3 text-right">{parseFloat(entry['End KM'] || 0).toFixed(2)}</td>
                          <td className="px-4 py-3 text-right">{parseFloat(entry['Daily KM'] || 0).toFixed(2)}</td>
                          <td className="px-4 py-3 text-right">{parseFloat(entry['Diesel Filled'] || 0).toFixed(2)}</td>
                          <td className="px-4 py-3 text-right">{parseFloat(entry['Diesel Rate'] || 0).toFixed(2)}</td>
                          <td className="px-4 py-3 text-right">₹{parseFloat(entry['Diesel Amount'] || 0).toFixed(2)}</td>
                          <td className="px-4 py-3 text-right">₹{parseFloat(entry['Other Expense'] || 0).toFixed(2)}</td>
                          <td className="px-4 py-3 text-right">{parseFloat(entry['Running KM'] || 0).toFixed(2)}</td>
                          <td className="px-4 py-3 text-right">{parseFloat(entry['Actual Average'] || 0).toFixed(2)}</td>
                          <td className="px-4 py-3">{entry['Remarks'] || '-'}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => handleEdit(entry)}
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-sm"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => handleDelete(entry)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </td>
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
            className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition font-semibold text-lg mb-6"
          >
            📊 Export Monthly Report to Excel
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editingEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-primary-700 mb-6">Edit Entry</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={editingEntry.Date}
                  onChange={(e) => handleEditChange('Date', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Driver Name</label>
                <input
                  type="text"
                  value={editingEntry['Driver Name'] || ''}
                  onChange={(e) => handleEditChange('Driver Name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Start KM</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingEntry['Start KM'] || ''}
                  onChange={(e) => handleEditChange('Start KM', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">End KM</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingEntry['End KM'] || ''}
                  onChange={(e) => handleEditChange('End KM', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Diesel Filled</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingEntry['Diesel Filled'] || ''}
                  onChange={(e) => handleEditChange('Diesel Filled', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Diesel Rate</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingEntry['Diesel Rate'] || ''}
                  onChange={(e) => handleEditChange('Diesel Rate', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Expense Description</label>
                <input
                  type="text"
                  value={editingEntry['Expense Description'] || ''}
                  onChange={(e) => handleEditChange('Expense Description', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Other Expense</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingEntry['Other Expense'] || ''}
                  onChange={(e) => handleEditChange('Other Expense', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Remarks</label>
                <textarea
                  value={editingEntry['Remarks'] || ''}
                  onChange={(e) => handleEditChange('Remarks', e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingEntry(null)}
                className="flex-1 bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-red-700 mb-4">Confirm Delete</h2>
            <p className="mb-6">
              Are you sure you want to delete the entry for{' '}
              <strong>{new Date(deleteConfirm.Date).toLocaleDateString()}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BusReport
