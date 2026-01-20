'use client'

import React, { useState, useEffect } from 'react'
import { useTransport } from '@/contexts/TransportContext'
import AdminLayout from '@/components/admin/AdminLayout'
import { formatRupee } from '@/lib/utils/format'

function DailyEntry() {
  const { addEntry, getLastEntry, calculateRunningKM, BUS_NAMES } = useTransport()

  const [formData, setFormData] = useState({
    Date: new Date().toISOString().split('T')[0],
    Bus: '',
    'Driver Name': '',
    'Start KM': '',
    'End KM': '',
    'Daily KM': 0,
    'Diesel Filled': '',
    'Diesel Rate': '',
    'Diesel Amount': 0,
    'Expense Description': '',
    'Other Expense': '',
    'Remarks': ''
  })

  const [dieselInfo, setDieselInfo] = useState<any>(null)
  const [alert, setAlert] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Load start KM when bus changes - use the most recent End KM for that bus
  useEffect(() => {
    if (formData.Bus) {
      const lastEntry = getLastEntry(formData.Bus)
      if (lastEntry) {
        // Auto-load Start KM from the most recent End KM of this bus
        const lastEndKM = parseFloat(lastEntry['End KM'] || 0)
        setFormData(prev => ({
          ...prev,
          'Start KM': lastEndKM > 0 ? lastEndKM.toString() : ''
        }))
      } else {
        // For first entry of this bus, leave empty so user can enter manually
        setFormData(prev => ({ ...prev, 'Start KM': '' }))
      }
    }
  }, [formData.Bus, getLastEntry])

  // Calculate daily KM
  useEffect(() => {
    const startKM = parseFloat(formData['Start KM']) || 0
    const endKM = parseFloat(formData['End KM']) || 0
    const dailyKM = endKM - startKM
    setFormData(prev => ({
      ...prev,
      'Daily KM': dailyKM >= 0 ? dailyKM : 0
    }))
  }, [formData['Start KM'], formData['End KM']])

  // Calculate diesel amount
  useEffect(() => {
    const dieselFilled = parseFloat(formData['Diesel Filled']) || 0
    const dieselRate = parseFloat(formData['Diesel Rate']) || 0
    const dieselAmount = dieselFilled * dieselRate
    setFormData(prev => ({
      ...prev,
      'Diesel Amount': dieselAmount
    }))
  }, [formData['Diesel Filled'], formData['Diesel Rate']])

  // Update diesel info
  useEffect(() => {
    if (formData.Bus && formData.Date) {
      const runningKM = calculateRunningKM(formData.Bus, formData.Date)
      const dailyKM = parseFloat(formData['Daily KM'].toString()) || 0
      const dieselFilled = parseFloat(formData['Diesel Filled']) || 0

      if (runningKM > 0 || dieselFilled > 0) {
        setDieselInfo({
          runningKM,
          totalKM: runningKM + dailyKM,
          dieselFilled,
          average: dieselFilled > 0 ? (runningKM + dailyKM) / dieselFilled : 0
        })
      } else {
        setDieselInfo(null)
      }
    }
  }, [formData.Bus, formData.Date, formData['Daily KM'], formData['Diesel Filled'], calculateRunningKM])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.Bus || !formData['Driver Name'] || !formData['Start KM'] || !formData['End KM']) {
      setAlert({ type: 'error', message: 'Please fill all required fields (Date, Bus, Driver Name, Start KM, End KM)' })
      setTimeout(() => setAlert(null), 3000)
      return
    }

    const entry = {
      Date: formData.Date,
      Bus: formData.Bus,
      'Driver Name': formData['Driver Name'],
      'Start KM': parseFloat(formData['Start KM']) || 0,
      'End KM': parseFloat(formData['End KM']) || 0,
      'Daily KM': parseFloat(formData['Daily KM'].toString()) || 0,
      'Diesel Filled': parseFloat(formData['Diesel Filled']) || 0,
      'Diesel Rate': parseFloat(formData['Diesel Rate']) || 0,
      'Diesel Amount': parseFloat(formData['Diesel Amount'].toString()) || 0,
      'Expense Description': formData['Expense Description'] || '',
      'Other Expense': parseFloat(formData['Other Expense']) || 0,
      'Remarks': formData['Remarks'] || ''
    }

    setIsSaving(true)
    
    // Simulate save animation delay
    setTimeout(() => {
      try {
        addEntry(entry)
        setIsSaving(false)
        setAlert({ type: 'success', message: 'Entry saved successfully!' })
        
        // Get the End KM from the entry we just saved
        const savedEndKM = parseFloat(entry['End KM'].toString() || '0')
        
        // Reset form (keep date and bus)
        // Set Start KM to the End KM we just saved for next entry
        setFormData(prev => ({
          ...prev,
          'Driver Name': '',
          'Start KM': savedEndKM > 0 ? savedEndKM.toString() : '',
          'End KM': '',
          'Daily KM': 0,
          'Diesel Filled': '',
          'Diesel Rate': '',
          'Diesel Amount': 0,
          'Expense Description': '',
          'Other Expense': '',
          'Remarks': ''
        }))

        setTimeout(() => setAlert(null), 3000)
      } catch (error: any) {
        setIsSaving(false)
        setAlert({ type: 'error', message: error.message })
        setTimeout(() => setAlert(null), 3000)
      }
    }, 800) // Animation duration
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-primary-700 mb-8">📝 Daily Entry</h1>

          {alert && (
            <div className={`mb-6 p-4 rounded-lg ${
              alert.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-400' 
                : 'bg-red-100 text-red-800 border border-red-400'
            }`}>
              {alert.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="Date"
                  value={formData.Date}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bus *
                </label>
                <select
                  name="Bus"
                  value={formData.Bus}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Bus</option>
                  {BUS_NAMES.map((bus: string) => (
                    <option key={bus} value={bus}>{bus}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Driver Name *
                </label>
                <input
                  type="text"
                  name="Driver Name"
                  value={formData['Driver Name']}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start KM *
                </label>
                <input
                  type="number"
                  name="Start KM"
                  value={formData['Start KM']}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {getLastEntry(formData.Bus) 
                    ? 'Auto-loaded from previous day (you can edit if needed)' 
                    : 'Enter starting KM reading'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  End KM *
                </label>
                <input
                  type="number"
                  name="End KM"
                  value={formData['End KM']}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Daily KM
                </label>
                <input
                  type="number"
                  name="Daily KM"
                  value={formData['Daily KM'].toFixed(2)}
                  readOnly
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Diesel Filled (Liters)
                </label>
                <input
                  type="number"
                  name="Diesel Filled"
                  value={formData['Diesel Filled']}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Diesel Rate (per Liter)
                </label>
                <input
                  type="number"
                  name="Diesel Rate"
                  value={formData['Diesel Rate']}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Diesel Amount
                </label>
                <input
                  type="number"
                  name="Diesel Amount"
                  value={formData['Diesel Amount'].toFixed(2)}
                  readOnly
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expense Description
                </label>
                <input
                  type="text"
                  name="Expense Description"
                  value={formData['Expense Description']}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Other Expense Amount
                </label>
                <input
                  type="number"
                  name="Other Expense"
                  value={formData['Other Expense']}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Remarks
                </label>
                <textarea
                  name="Remarks"
                  value={formData['Remarks']}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {dieselInfo && (
              <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                <h4 className="font-semibold text-blue-800 mb-2">Diesel Information</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><strong>Running KM since last diesel:</strong> {dieselInfo.runningKM.toFixed(2)} KM</p>
                  {dieselInfo.dieselFilled > 0 ? (
                    <>
                      <p><strong>Total KM for this fill:</strong> {dieselInfo.totalKM.toFixed(2)} KM</p>
                      <p><strong>Expected Average:</strong> {dieselInfo.average.toFixed(2)} KM/L</p>
                      {formData['Diesel Rate'] && (
                        <p><strong>Diesel Cost:</strong> {formatRupee(parseFloat(formData['Diesel Amount'].toString()))}</p>
                      )}
                    </>
                  ) : (
                    <p><em>No diesel filled today. KM will accumulate until next fill.</em></p>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className={`mt-8 w-full px-6 py-3 rounded-lg transition font-semibold text-lg relative ${
                isSaving 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-primary-500 hover:bg-primary-600 text-white'
              }`}
            >
              {isSaving ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                '💾 Save Entry'
              )}
            </button>
            
            {isSaving && (
              <div className="mt-4 flex items-center justify-center space-x-2 text-primary-600">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            )}
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}

export default DailyEntry
