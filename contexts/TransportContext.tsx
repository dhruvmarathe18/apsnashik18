'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { busEntryService, BusDailyEntry } from '@/lib/supabase/services'

const TransportContext = createContext<any>(null)

const BUS_NAMES = ['Winger', 'Maximo', 'Verito', 'Audi', 'Fluence']
const STORAGE_KEY = 'schoolTransportData'

// Convert BusDailyEntry to legacy format for backward compatibility
const entryToLegacyFormat = (entry: BusDailyEntry): any => {
  return {
    id: entry.id,
    Date: entry.entryDate,
    'Driver Name': entry.driverName,
    'Start KM': entry.startKm,
    'End KM': entry.endKm,
    'Daily KM': entry.dailyKm,
    'Diesel Filled': entry.dieselFilled,
    'Diesel Rate': entry.dieselRate,
    'Diesel Amount': entry.dieselAmount,
    'Expense Description': entry.expenseDescription,
    'Other Expense': entry.otherExpense,
    'Running KM': entry.runningKm,
    'Actual Average': entry.actualAverage,
    'Remarks': entry.remarks,
    Bus: entry.busName,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
  }
}

// Convert legacy format to BusDailyEntry
const legacyToEntryFormat = (entry: any, busName: string): Omit<BusDailyEntry, 'id' | 'createdAt' | 'updatedAt'> => {
  return {
    busName: busName || entry.Bus,
    entryDate: entry.Date,
    driverName: entry['Driver Name'],
    startKm: parseFloat(entry['Start KM'] || 0),
    endKm: parseFloat(entry['End KM'] || 0),
    dailyKm: parseFloat(entry['Daily KM'] || 0),
    dieselFilled: parseFloat(entry['Diesel Filled'] || 0),
    dieselRate: parseFloat(entry['Diesel Rate'] || 0),
    dieselAmount: parseFloat(entry['Diesel Amount'] || 0),
    expenseDescription: entry['Expense Description'],
    otherExpense: parseFloat(entry['Other Expense'] || 0),
    runningKm: parseFloat(entry['Running KM'] || 0),
    actualAverage: parseFloat(entry['Actual Average'] || 0),
    remarks: entry['Remarks'],
  }
}

// Initialize default data structure
const initializeData = () => {
  const data: any = {}
  BUS_NAMES.forEach(bus => {
    data[bus] = []
  })
  return data
}

// Load data from localStorage (fallback)
const loadDataFromLocalStorage = () => {
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

// Convert entries array to legacy format
const entriesToLegacyFormat = (entries: BusDailyEntry[]): any => {
  const data: any = initializeData()
  entries.forEach((entry) => {
    if (!data[entry.busName]) {
      data[entry.busName] = []
    }
    data[entry.busName].push(entryToLegacyFormat(entry))
  })
  // Sort by date for each bus
  BUS_NAMES.forEach((bus) => {
    if (data[bus]) {
      data[bus].sort((a: any, b: any) => {
        const dateA = new Date(a.Date)
        const dateB = new Date(b.Date)
        return dateA.getTime() - dateB.getTime()
      })
    }
  })
  return data
}

export function TransportProvider({ children }: { children: ReactNode }) {
  const [transportData, setTransportData] = useState(initializeData)
  const [isLoading, setIsLoading] = useState(true)

  // Load data from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const entries = await busEntryService.getAll()
        const legacyData = entriesToLegacyFormat(entries)
        setTransportData(legacyData)
      } catch (error) {
        console.error('Error loading bus entries:', error)
        // Fallback to localStorage
        const localData = loadDataFromLocalStorage()
        setTransportData(localData)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

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
  const addEntry = async (entry: any) => {
    const busName = entry.Bus
    if (!BUS_NAMES.includes(busName)) {
      throw new Error('Invalid bus name')
    }

    // Calculate fields before saving
    const busData = transportData[busName] || []
    const calculatedEntry = calculateEntryFields({ ...entry }, busData)
    
    // Convert to BusDailyEntry format
    const entryData = legacyToEntryFormat(calculatedEntry, busName)
    entryData.runningKm = calculatedEntry['Running KM']
    entryData.actualAverage = calculatedEntry['Actual Average']

    try {
      // Save to Supabase
      const savedEntry = await busEntryService.create(entryData)
      
      // Update local state
      setTransportData((prev: any) => {
        const newData = { ...prev }
        if (!newData[busName]) {
          newData[busName] = []
        }
        newData[busName] = [...newData[busName], entryToLegacyFormat(savedEntry)]
        return newData
      })

      return true
    } catch (error) {
      console.error('Error adding entry:', error)
      // Fallback to localStorage
      const newData = { ...transportData }
      if (!newData[busName]) {
        newData[busName] = []
      }
      calculatedEntry.id = Date.now().toString()
      calculatedEntry.createdAt = new Date().toISOString()
      calculatedEntry.updatedAt = new Date().toISOString()
      newData[busName] = [...newData[busName], calculatedEntry]
      setTransportData(newData)
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
      }
      return true
    }
  }

  // Update existing entry
  const updateEntry = async (busName: string, entryIndex: number, updatedEntry: any) => {
    if (!BUS_NAMES.includes(busName)) {
      throw new Error('Invalid bus name')
    }

    const busData = transportData[busName] || []
    if (!busData[entryIndex]) {
      throw new Error('Entry not found')
    }

    const oldEntry = busData[entryIndex]
    const entryId = oldEntry.id

    // Recalculate fields for the updated entry and all subsequent entries
    const updatedData = [...busData]
    updatedEntry = calculateEntryFields({ ...updatedEntry }, updatedData.slice(0, entryIndex))

    // Recalculate all entries after this one (in case dates/KM changed)
    for (let i = entryIndex + 1; i < updatedData.length; i++) {
      updatedData[i] = calculateEntryFields(
        { ...updatedData[i] },
        updatedData.slice(0, i)
      )
    }

    try {
      // Update in Supabase
      const entryData = legacyToEntryFormat(updatedEntry, busName)
      entryData.runningKm = updatedEntry['Running KM']
      entryData.actualAverage = updatedEntry['Actual Average']
      
      if (entryId) {
        await busEntryService.update(entryId, entryData)
      }

      // Update local state
      setTransportData((prev: any) => {
        const newData = { ...prev }
        newData[busName] = updatedData
        return newData
      })

      return true
    } catch (error) {
      console.error('Error updating entry:', error)
      // Fallback to localStorage
      setTransportData((prev: any) => {
        const newData = { ...prev }
        newData[busName] = updatedData
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
        }
        return newData
      })
      return true
    }
  }

  // Delete entry
  const deleteEntry = async (busName: string, entryIndex: number) => {
    if (!BUS_NAMES.includes(busName)) {
      throw new Error('Invalid bus name')
    }

    const busData = transportData[busName] || []
    if (!busData[entryIndex]) {
      throw new Error('Entry not found')
    }

    const entryId = busData[entryIndex].id

    // Remove the entry
    const updatedData = [...busData]
    updatedData.splice(entryIndex, 1)

    // Recalculate all entries after the deleted one
    for (let i = entryIndex; i < updatedData.length; i++) {
      updatedData[i] = calculateEntryFields(
        { ...updatedData[i] },
        updatedData.slice(0, i)
      )
    }

    try {
      // Delete from Supabase
      if (entryId) {
        await busEntryService.delete(entryId)
      }

      // Update local state
      setTransportData((prev: any) => {
        const newData = { ...prev }
        newData[busName] = updatedData
        return newData
      })

      return true
    } catch (error) {
      console.error('Error deleting entry:', error)
      // Fallback to localStorage
      setTransportData((prev: any) => {
        const newData = { ...prev }
        newData[busName] = updatedData
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
        }
        return newData
      })
      return true
    }
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

    BUS_NAMES.forEach((bus: string) => {
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

    BUS_NAMES.forEach((bus: string) => {
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
  const importFromExcel = async (data: any) => {
    // Clear existing data
    const allEntries = await busEntryService.getAll()
    for (const entry of allEntries) {
      try {
        await busEntryService.delete(entry.id)
      } catch (error) {
        console.error('Error deleting entry during import:', error)
      }
    }

    // Import new data
    const BUS_NAMES = ['Winger', 'Maximo', 'Verito', 'Audi', 'Fluence']
    for (const busName of BUS_NAMES) {
      const entries = data[busName] || []
      for (const entry of entries) {
        try {
          const entryData = legacyToEntryFormat(entry, busName)
          await busEntryService.create(entryData)
        } catch (error) {
          console.error('Error importing entry:', error)
        }
      }
    }

    // Reload data
    const newEntries = await busEntryService.getAll()
    const legacyData = entriesToLegacyFormat(newEntries)
    setTransportData(legacyData)
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
