'use client'

import React from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Download, Upload } from 'lucide-react'

export default function ExportImportPage() {
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Export / Import</h1>
            <p className="text-gray-600 mt-2">Export and import data</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <Download className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Export Data</h3>
              <p className="text-gray-600 mb-4">Export your data to Excel or CSV format</p>
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                Export Data
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <Upload className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Import Data</h3>
              <p className="text-gray-600 mb-4">Import data from Excel or CSV files</p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Import Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
