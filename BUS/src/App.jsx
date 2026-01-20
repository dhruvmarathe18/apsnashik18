import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { TransportProvider } from './context/TransportContext'
import Home from './pages/Home'
import DailyEntry from './pages/DailyEntry'
import BusReport from './pages/BusReport'
import DriverReport from './pages/DriverReport'
import DriverSalary from './pages/DriverSalary'
import './App.css'

function Navigation() {
  const location = useLocation()
  
  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-gradient-to-r from-primary-500 to-primary-700 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold hover:text-primary-100 transition">
              🚌 Transport Management
            </Link>
            <div className="flex space-x-4">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg transition ${
                  isActive('/') 
                    ? 'bg-white text-primary-600 font-semibold' 
                    : 'hover:bg-primary-600'
                }`}
              >
                Home
              </Link>
              <Link
                to="/daily-entry"
                className={`px-4 py-2 rounded-lg transition ${
                  isActive('/daily-entry') 
                    ? 'bg-white text-primary-600 font-semibold' 
                    : 'hover:bg-primary-600'
                }`}
              >
                Daily Entry
              </Link>
              <Link
                to="/bus-report"
                className={`px-4 py-2 rounded-lg transition ${
                  isActive('/bus-report') 
                    ? 'bg-white text-primary-600 font-semibold' 
                    : 'hover:bg-primary-600'
                }`}
              >
                Bus Report
              </Link>
              <Link
                to="/driver-report"
                className={`px-4 py-2 rounded-lg transition ${
                  isActive('/driver-report') 
                    ? 'bg-white text-primary-600 font-semibold' 
                    : 'hover:bg-primary-600'
                }`}
              >
                Driver Report
              </Link>
              <Link
                to="/driver-salary"
                className={`px-4 py-2 rounded-lg transition ${
                  isActive('/driver-salary') 
                    ? 'bg-white text-primary-600 font-semibold' 
                    : 'hover:bg-primary-600'
                }`}
              >
                Driver Salary
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <TransportProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/daily-entry" element={<DailyEntry />} />
              <Route path="/bus-report" element={<BusReport />} />
              <Route path="/driver-report" element={<DriverReport />} />
              <Route path="/driver-salary" element={<DriverSalary />} />
            </Routes>
          </main>
          <footer className="bg-white border-t border-gray-200 mt-12">
            <div className="container mx-auto px-4 py-6 text-center text-gray-600">
              <p>School Transport Management System - Offline Version</p>
            </div>
          </footer>
        </div>
      </Router>
    </TransportProvider>
  )
}

export default App
