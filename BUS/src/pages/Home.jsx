import React from 'react'
import { Link } from 'react-router-dom'
import { useTransport } from '../context/TransportContext'

function Home() {
  const { transportData, BUS_NAMES } = useTransport()

  // Calculate total entries
  const totalEntries = BUS_NAMES.reduce((sum, bus) => {
    return sum + (transportData[bus]?.length || 0)
  }, 0)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-primary-700 mb-4">
          🚌 School Transport Management System
        </h1>
        <p className="text-xl text-gray-600">
          Offline Transport Management with Persistent Data Storage
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-primary-700 mb-2">Daily Entry</h3>
          <p className="text-gray-600 mb-4">
            Record daily transport data including KM, diesel, and expenses
          </p>
          <Link
            to="/daily-entry"
            className="inline-block bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition"
          >
            Go to Daily Entry
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
          <div className="text-4xl mb-4">🚌</div>
          <h3 className="text-xl font-semibold text-primary-700 mb-2">Bus Report</h3>
          <p className="text-gray-600 mb-4">
            View monthly reports for each bus with totals and averages
          </p>
          <Link
            to="/bus-report"
            className="inline-block bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition"
          >
            View Bus Reports
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
          <div className="text-4xl mb-4">👤</div>
          <h3 className="text-xl font-semibold text-primary-700 mb-2">Driver Report</h3>
          <p className="text-gray-600 mb-4">
            Track driver-wise performance and expenses
          </p>
          <Link
            to="/driver-report"
            className="inline-block bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition"
          >
            View Driver Reports
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
          <div className="text-4xl mb-4">💰</div>
          <h3 className="text-xl font-semibold text-primary-700 mb-2">Driver Salary</h3>
          <p className="text-gray-600 mb-4">
            Manage monthly salaries for bus drivers
          </p>
          <Link
            to="/driver-salary"
            className="inline-block bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition"
          >
            Manage Salaries
          </Link>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">⚠️ Important Information</h3>
        <ul className="list-disc list-inside space-y-2 text-yellow-700">
          <li>All data is stored locally in your browser (localStorage)</li>
          <li>This system works completely OFFLINE</li>
          <li>Data persists automatically - no need to save manually</li>
          <li>You can export data to Excel for backup</li>
          <li>Total entries stored: <strong>{totalEntries}</strong></li>
        </ul>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">📊 Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {BUS_NAMES.map(bus => (
            <div key={bus} className="text-center">
              <div className="text-2xl font-bold text-blue-700">
                {transportData[bus]?.length || 0}
              </div>
              <div className="text-sm text-blue-600">{bus}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
