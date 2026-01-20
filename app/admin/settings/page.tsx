'use client'

import React from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Settings as SettingsIcon } from 'lucide-react'

export default function SettingsPage() {
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">Configure school settings and preferences</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-center py-12">Settings module coming soon...</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
