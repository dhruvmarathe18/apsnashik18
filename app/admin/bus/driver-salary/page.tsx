'use client'

import React, { useState, useEffect } from 'react'
import { useTransport } from '@/contexts/TransportContext'
import AdminLayout from '@/components/admin/AdminLayout'
import { formatRupee } from '@/lib/utils/format'

const SALARY_STORAGE_KEY = 'driverSalaries'

function DriverSalary() {
  const { getAllDrivers, transportData, BUS_NAMES } = useTransport()
  const [drivers, setDrivers] = useState<string[]>([])
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const [salaries, setSalaries] = useState<any>({})
  const [editingSalary, setEditingSalary] = useState<any>(null)
  const [alert, setAlert] = useState<any>(null)

  // Load salaries from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem(SALARY_STORAGE_KEY)
      if (stored) {
        setSalaries(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Error loading salaries:', error)
    }
  }, [])

  // Load drivers
  useEffect(() => {
    const driverList = getAllDrivers()
    setDrivers(driverList)
  }, [getAllDrivers, transportData])

  // Save salaries to localStorage
  const saveSalaries = (newSalaries: any) => {
    if (typeof window === 'undefined') return false
    try {
      localStorage.setItem(SALARY_STORAGE_KEY, JSON.stringify(newSalaries))
      setSalaries(newSalaries)
      return true
    } catch (error) {
      console.error('Error saving salaries:', error)
      return false
    }
  }

  // Calculate driver work days for the month
  const calculateWorkDays = (driverName: string) => {
    const [year, month] = selectedMonth.split('-').map(Number)
    const monthIndex = month - 1
    let workDays = 0

    BUS_NAMES.forEach((bus: string) => {
      const data = transportData[bus] || []
      data.forEach((entry: any) => {
        const entryDate = new Date(entry.Date)
        if (
          entryDate.getMonth() === monthIndex &&
          entryDate.getFullYear() === year &&
          entry['Driver Name'] &&
          entry['Driver Name'].toLowerCase().trim() === driverName.toLowerCase().trim()
        ) {
          workDays++
        }
      })
    })

    return workDays
  }

  // Get salary for driver
  const getSalary = (driverName: string) => {
    const key = `${driverName}_${selectedMonth}`
    return salaries[key] || { amount: '', workDays: 0, total: 0 }
  }

  // Save salary
  const handleSaveSalary = (driverName: string) => {
    if (!editingSalary || !editingSalary.amount) {
      setAlert({ type: 'error', message: 'Please enter salary amount' })
      setTimeout(() => setAlert(null), 3000)
      return
    }

    const key = `${driverName}_${selectedMonth}`
    const workDays = calculateWorkDays(driverName)
    const total = parseFloat(editingSalary.amount) || 0

    const newSalaries = {
      ...salaries,
      [key]: {
        amount: editingSalary.amount,
        workDays,
        total
      }
    }

    if (saveSalaries(newSalaries)) {
      setEditingSalary(null)
      setAlert({ type: 'success', message: 'Salary saved successfully!' })
      setTimeout(() => setAlert(null), 3000)
    } else {
      setAlert({ type: 'error', message: 'Failed to save salary' })
      setTimeout(() => setAlert(null), 3000)
    }
  }

  // Delete salary
  const handleDeleteSalary = (driverName: string) => {
    const key = `${driverName}_${selectedMonth}`
    const newSalaries = { ...salaries }
    delete newSalaries[key]
    
    if (saveSalaries(newSalaries)) {
      setAlert({ type: 'success', message: 'Salary deleted successfully!' })
      setTimeout(() => setAlert(null), 3000)
    }
  }

  // Calculate total salary for the month
  const calculateTotalSalary = () => {
    let total = 0
    drivers.forEach(driver => {
      const salary = getSalary(driver)
      total += parseFloat(salary.total || 0)
    })
    return total.toFixed(2)
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-8">💰 Driver Salary Management</h1>

          {alert && (
            <div className={`mb-6 p-4 rounded-lg ring-1 ring-border/40 ${
              alert.type === 'success' 
                ? 'bg-success/20 text-success border border-success/30' 
                : 'bg-destructive/20 text-destructive border border-destructive/30'
            }`}>
              {alert.message}
            </div>
          )}

          <div className="bg-surface rounded-lg shadow-lg p-6 mb-6 ring-1 ring-border/40">
            <h3 className="text-xl font-semibold mb-4 text-text">Select Month</h3>
            <div className="mb-4">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full md:w-auto px-4 py-2 bg-surface-1 border border-border/40 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary text-text"
              />
            </div>
          </div>

          <div className="bg-surface rounded-lg shadow-lg overflow-hidden mb-6 ring-1 ring-border/40">
            <div className="p-4 bg-surface-2 border-b border-border/20 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-text">Driver Salaries - {selectedMonth}</h3>
              <div className="text-lg font-bold text-primary">
                Total: {formatRupee(parseFloat(calculateTotalSalary()))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary-500 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Driver Name</th>
                    <th className="px-4 py-3 text-right">Work Days</th>
                    <th className="px-4 py-3 text-right">Monthly Salary</th>
                    <th className="px-4 py-3 text-right">Total Amount</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-text-dim">
                        No drivers found. Add entries in Daily Entry to see drivers.
                      </td>
                    </tr>
                  ) : (
                    drivers.map((driver: string, index: number) => {
                      const salary = getSalary(driver)
                      const workDays = calculateWorkDays(driver)
                      const isEditing = editingSalary && editingSalary.driver === driver

                      return (
                        <tr key={index} className="border-b border-border/20 hover:bg-surface-2">
                          <td className="px-4 py-3 font-semibold text-text">{driver}</td>
                          <td className="px-4 py-3 text-right text-text">{workDays}</td>
                          <td className="px-4 py-3 text-right">
                            {isEditing ? (
                              <input
                                type="number"
                                step="0.01"
                                value={editingSalary.amount}
                                onChange={(e) => setEditingSalary({ ...editingSalary, amount: e.target.value })}
                                className="w-32 px-2 py-1 bg-surface-1 border border-border/40 rounded text-right text-text"
                                placeholder="Amount"
                                autoFocus
                              />
                            ) : (
                              <span className="text-text">{salary.amount ? formatRupee(parseFloat(salary.amount)) : '-'}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-text">
                            {salary.total ? formatRupee(parseFloat(salary.total)) : '-'}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2 justify-center">
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={() => handleSaveSalary(driver)}
                                    className="bg-success text-white px-3 py-1 rounded hover:bg-success/90 transition text-sm"
                                  >
                                    ✓ Save
                                  </button>
                                  <button
                                    onClick={() => setEditingSalary(null)}
                                    className="bg-muted text-text px-3 py-1 rounded hover:bg-muted/80 transition text-sm"
                                  >
                                    ✕ Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => setEditingSalary({ driver, amount: salary.amount || '' })}
                                    className="bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/90 transition text-sm"
                                  >
                                    ✏️ Edit
                                  </button>
                                  {salary.amount && (
                                    <button
                                      onClick={() => {
                                        if (window.confirm(`Delete salary for ${driver}?`)) {
                                          handleDeleteSalary(driver)
                                        }
                                      }}
                                      className="bg-destructive text-white px-3 py-1 rounded hover:bg-destructive/90 transition text-sm"
                                    >
                                      🗑️ Delete
                                    </button>
                                  )}
                                </>
                              )}
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

          <div className="bg-primary/10 border-l-4 border-primary p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-primary mb-2">💡 Instructions</h3>
            <ul className="list-disc list-inside space-y-1 text-text">
              <li>Work Days are automatically calculated from daily entries</li>
              <li>Enter monthly salary amount for each driver</li>
              <li>Total amount = Monthly Salary (same for all work days)</li>
              <li>Salaries are saved per month</li>
              <li>You can edit or delete salaries anytime</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default DriverSalary
