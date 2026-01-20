'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

const TransportContext = createContext<any>(null)

const BUS_NAMES = ['Winger', 'Maximo', 'Verito', 'Audi', 'Fluence']
const STORAGE_KEY = 'schoolTransportData'

// Initialize default data structure
const initializeData = () => {
  const data: any = {}
  BUS_NAMES.forEach(bus => {
    data[bus] = []
  })
  return data
}

// Load data from localStorage
const loadData = () => {
  if (typeof window === 'undefined') return initializeData()
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error loading data:', error)
  }
  return initializeData()
}

// Save data to localStorage
const saveData = (data: any) => {
  if (typeof window === 'undefined') return false
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch (error) {
    console.error('Error saving data:', error)
    return false
  }
}

export function TransportProvider({ children }: { children: ReactNode }) {
  const [transportData, setTransportData] = useState(loadData)
  const [isLoading, setIsLoading] = useState(false)

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveData(transportData)
  }, [transportData])

  // Calculate running KM since last diesel fill (internal helper)
  const calculateRunningKMInternal = (busData: any[], currentDate: string) => {
    if (!busData || busData.length === 0) return 0

    const sorted = [...busData].sort((a, b) => {
      const dateA = new Date(a.Date)
      const dateB = new Date(b.Date)
      return dateA.getTime() - dateB.getTime()
    })

    const currentDateObj = new Date(currentDate)
    currentDateObj.setHours(0, 0, 0, 0)

    // Find the most recent diesel fill date before current date
    let lastDieselDate: Date | null = null
    for (let i = sorted.length - 1; i >= 0; i--) {
      const entry = sorted[i]
      const entryDate = new Date(entry.Date)
      entryDate.setHours(0, 0, 0, 0)

      if (entryDate.getTime() < currentDateObj.getTime()) {
        const dieselFilled = parseFloat(entry['Diesel Filled'] || 0)
        if (dieselFilled > 0) {
          lastDieselDate = entryDate
          break
        }
      }
    }

    if (!lastDieselDate) return 0

    // Sum all daily KM from last diesel date to current date (exclusive)
    let runningKM = 0
    for (let i = 0; i < sorted.length; i++) {
      const entry = sorted[i]
      const entryDate = new Date(entry.Date)
      entryDate.setHours(0, 0, 0, 0)

      if (entryDate.getTime() >= lastDieselDate.getTime() && entryDate.getTime() < currentDateObj.getTime()) {
        const dailyKM = parseFloat(entry['Daily KM'] || 0)
        runningKM += dailyKM
      }
    }

    return runningKM
  }

  // Helper function to calculate entry fields
  const calculateEntryFields = (entry: any, busData: any[]) => {
    const runningKM = calculateRunningKMInternal(busData, entry.Date)
    entry['Running KM'] = runningKM + entry['Daily KM']

    if (entry['Diesel Filled'] > 0) {
      entry['Actual Average'] = entry['Running KM'] / entry['Diesel Filled']
    } else {
      entry['Actual Average'] = 0
    }
    return entry
  }

  // Add new entry
  const addEntry = (entry: any) => {
    const busName = entry.Bus
    if (!BUS_NAMES.includes(busName)) {
      throw new Error('Invalid bus name')
    }

    setTransportData((prev: any) => {
      const newData = { ...prev }
      if (!newData[busName]) {
        newData[busName] = []
      }
      
      const calculatedEntry = calculateEntryFields({ ...entry }, newData[busName])
      newData[busName] = [...newData[busName], calculatedEntry]
      return newData
    })

    return true
  }

  // Update existing entry
  const updateEntry = (busName: string, entryIndex: number, updatedEntry: any) => {
    if (!BUS_NAMES.includes(busName)) {
      throw new Error('Invalid bus name')
    }

    setTransportData((prev: any) => {
      const newData = { ...prev }
      if (!newData[busName] || !newData[busName][entryIndex]) {
        throw new Error('Entry not found')
      }

      // Recalculate fields for the updated entry and all subsequent entries
      const updatedData = [...newData[busName]]
      updatedData[entryIndex] = calculateEntryFields({ ...updatedEntry }, updatedData.slice(0, entryIndex))

      // Recalculate all entries after this one (in case dates/KM changed)
      for (let i = entryIndex + 1; i < updatedData.length; i++) {
        updatedData[i] = calculateEntryFields(
          { ...updatedData[i] },
          updatedData.slice(0, i)
        )
      }

      newData[busName] = updatedData
      return newData
    })

    return true
  }

  // Delete entry
  const deleteEntry = (busName: string, entryIndex: number) => {
    if (!BUS_NAMES.includes(busName)) {
      throw new Error('Invalid bus name')
    }

    setTransportData((prev: any) => {
      const newData = { ...prev }
      if (!newData[busName] || !newData[busName][entryIndex]) {
        throw new Error('Entry not found')
      }

      // Remove the entry
      const updatedData = [...newData[busName]]
      updatedData.splice(entryIndex, 1)

      // Recalculate all entries after the deleted one
      for (let i = entryIndex; i < updatedData.length; i++) {
        updatedData[i] = calculateEntryFields(
          { ...updatedData[i] },
          updatedData.slice(0, i)
        )
      }

      newData[busName] = updatedData
      return newData
    })

    return true
  }

  // Find entry index by date and bus
  const findEntryIndex = (busName: string, date: string) => {
    const data = getBusData(busName)
    const targetDate = new Date(date).toISOString().split('T')[0]
    return data.findIndex((entry: any) => {
      const entryDate = new Date(entry.Date).toISOString().split('T')[0]
      return entryDate === targetDate
    })
  }

  // Get data for a specific bus
  const getBusData = (busName: string) => {
    return transportData[busName] || []
  }

  // Get last entry for a bus
  const getLastEntry = (busName: string) => {
    const data = getBusData(busName)
    if (data.length === 0) return null

    const sorted = [...data].sort((a, b) => {
      const dateA = new Date(a.Date)
      const dateB = new Date(b.Date)
      return dateB.getTime() - dateA.getTime()
    })

    return sorted[0]
  }

  // Calculate running KM since last diesel fill (public function)
  const calculateRunningKM = (busName: string, currentDate: string) => {
    const busData = getBusData(busName)
    return calculateRunningKMInternal(busData, currentDate)
  }

  // Calculate monthly totals for a bus
  const calculateMonthlyTotals = (busName: string, month: number, year: number) => {
    const data = getBusData(busName)

    let totalKM = 0
    let totalDiesel = 0
    let totalDieselAmount = 0
    let totalOtherExpense = 0

    data.forEach((entry: any) => {
      const entryDate = new Date(entry.Date)
      if (entryDate.getMonth() === month && entryDate.getFullYear() === year) {
        totalKM += parseFloat(entry['Daily KM'] || 0)
        totalDiesel += parseFloat(entry['Diesel Filled'] || 0)
        totalDieselAmount += parseFloat(entry['Diesel Amount'] || 0)
        totalOtherExpense += parseFloat(entry['Other Expense'] || 0)
      }
    })

    const monthlyAverage = totalDiesel > 0 ? totalKM / totalDiesel : 0

    return {
      totalKM: totalKM.toFixed(2),
      totalDiesel: totalDiesel.toFixed(2),
      totalDieselAmount: totalDieselAmount.toFixed(2),
      totalOtherExpense: totalOtherExpense.toFixed(2),
      totalExpense: (totalDieselAmount + totalOtherExpense).toFixed(2),
      monthlyAverage: monthlyAverage.toFixed(2)
    }
  }

  // Calculate driver totals
  const calculateDriverTotals = (driverName: string) => {
    let totalKM = 0
    let totalDieselAmount = 0
    let totalOtherExpense = 0

    BUS_NAMES.forEach(bus => {
      const data = getBusData(bus)
      data.forEach((entry: any) => {
        const driver = entry['Driver Name']
        if (driver && driver.toLowerCase().trim() === driverName.toLowerCase().trim()) {
          totalKM += parseFloat(entry['Daily KM'] || 0)
          totalDieselAmount += parseFloat(entry['Diesel Amount'] || 0)
          totalOtherExpense += parseFloat(entry['Other Expense'] || 0)
        }
      })
    })

    const totalExpense = totalDieselAmount + totalOtherExpense

    return {
      totalKM: totalKM.toFixed(2),
      totalDieselAmount: totalDieselAmount.toFixed(2),
      totalExpense: totalExpense.toFixed(2)
    }
  }

  // Get all unique drivers
  const getAllDrivers = () => {
    const drivers = new Set<string>()

    BUS_NAMES.forEach(bus => {
      const data = getBusData(bus)
      data.forEach((entry: any) => {
        const driver = entry['Driver Name']
        if (driver && driver.trim()) {
          drivers.add(driver.trim())
        }
      })
    })

    return Array.from(drivers).sort()
  }

  // Export to Excel
  const exportToExcel = () => {
    return transportData
  }

  // Import from Excel
  const importFromExcel = (data: any) => {
    setTransportData(data)
  }

  const value = {
    transportData,
    isLoading,
    addEntry,
    updateEntry,
    deleteEntry,
    findEntryIndex,
    getBusData,
    getLastEntry,
    calculateRunningKM,
    calculateMonthlyTotals,
    calculateDriverTotals,
    getAllDrivers,
    exportToExcel,
    importFromExcel,
    BUS_NAMES
  }

  return (
    <TransportContext.Provider value={value}>
      {children}
    </TransportContext.Provider>
  )
}

export function useTransport() {
  const context = useContext(TransportContext)
  if (!context) {
    throw new Error('useTransport must be used within TransportProvider')
  }
  return context
}
