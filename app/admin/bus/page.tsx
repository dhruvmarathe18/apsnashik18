'use client'

import React from 'react'
import Link from 'next/link'
import { useTransport } from '@/contexts/TransportContext'
import AdminLayout from '@/components/admin/AdminLayout'

function BusHome() {
  const { transportData, BUS_NAMES } = useTransport()

  // Calculate total entries
  const totalEntries = BUS_NAMES.reduce((sum: number, bus: string) => {
    return sum + (transportData[bus]?.length || 0)
  }, 0)

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-primary-700 mb-4">
              🚌 School Transport Management System
            </h1>
            <p className="text-xl text-text-muted">
              Offline Transport Management with Persistent Data Storage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Link href="/admin/bus/daily-entry">
              <div className="bg-surface-1 rounded-lg shadow-lg p-6 hover:shadow-xl transition cursor-pointer ring-1 ring-border/40">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-primary mb-2">Daily Entry</h3>
                <p className="text-text-muted mb-4">
                  Record daily transport data including KM, diesel, and expenses
                </p>
                <div className="text-primary font-medium">Go to Daily Entry →</div>
              </div>
            </Link>

            <Link href="/admin/bus/bus-report">
              <div className="bg-surface-1 rounded-lg shadow-lg p-6 hover:shadow-xl transition cursor-pointer ring-1 ring-border/40">
                <div className="text-4xl mb-4">🚌</div>
                <h3 className="text-xl font-semibold text-primary mb-2">Bus Report</h3>
                <p className="text-text-muted mb-4">
                  View monthly reports for each bus with totals and averages
                </p>
                <div className="text-primary font-medium">View Bus Reports →</div>
              </div>
            </Link>

            <Link href="/admin/bus/driver-report">
              <div className="bg-surface-1 rounded-lg shadow-lg p-6 hover:shadow-xl transition cursor-pointer ring-1 ring-border/40">
                <div className="text-4xl mb-4">👤</div>
                <h3 className="text-xl font-semibold text-primary mb-2">Driver Report</h3>
                <p className="text-text-muted mb-4">
                  Track driver-wise performance and expenses
                </p>
                <div className="text-primary font-medium">View Driver Reports →</div>
              </div>
            </Link>

            <Link href="/admin/bus/driver-salary">
              <div className="bg-surface-1 rounded-lg shadow-lg p-6 hover:shadow-xl transition cursor-pointer ring-1 ring-border/40">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold text-primary mb-2">Driver Salary</h3>
                <p className="text-text-muted mb-4">
                  Manage monthly salaries for bus drivers
                </p>
                <div className="text-primary font-medium">Manage Salaries →</div>
              </div>
            </Link>
          </div>

          <div className="bg-warning/20 border-l-4 border-warning p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-warning mb-3">⚠️ Important Information</h3>
            <ul className="list-disc list-inside space-y-2 text-text">
              <li>All data is stored locally in your browser (localStorage)</li>
              <li>This system works completely OFFLINE</li>
              <li>Data persists automatically - no need to save manually</li>
              <li>You can export data to Excel for backup</li>
              <li>Total entries stored: <strong>{totalEntries}</strong></li>
            </ul>
          </div>

          <div className="bg-primary/10 border-l-4 border-primary p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-primary mb-3">📊 Quick Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {BUS_NAMES.map((bus: string) => (
                <div key={bus} className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {transportData[bus]?.length || 0}
                  </div>
                  <div className="text-sm text-text-muted">{bus}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default BusHome
