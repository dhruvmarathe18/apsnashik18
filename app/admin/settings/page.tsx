'use client'

import React, { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Settings as SettingsIcon, AlertTriangle, Trash2 } from 'lucide-react'
import { useSchool } from '@/contexts/SchoolContext'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { resetAllData, students, transactions } = useSchool()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  const handleReset = async () => {
    if (confirmText !== 'DELETE ALL DATA') {
      toast.error('Please type "DELETE ALL DATA" to confirm')
      return
    }

    setIsResetting(true)
    try {
      await resetAllData()
      setShowConfirmDialog(false)
      setConfirmText('')
    } catch (error) {
      // Error is already handled in resetAllData
    } finally {
      setIsResetting(false)
    }
  }

  const dataStats = {
    students: students.length,
    transactions: transactions.length,
    feePlans: students.filter((s) => s.id).length, // Approximate
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">Configure school settings and preferences</p>
          </div>

          {/* Data Statistics */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Data Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{dataStats.students}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{dataStats.transactions}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Fee Plans</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{dataStats.feePlans}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reset Data Section */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Reset All Data</h3>
                  <p className="text-gray-600 mb-4">
                    This action will permanently delete all user-entered data from the admin panel, including:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4 ml-4">
                    <li>All students and their information</li>
                    <li>All fee plans</li>
                    <li>All transactions (fee collections, expenses, salaries, bus expenses, etc.)</li>
                    <li>All bus daily entries</li>
                  </ul>
                  <p className="text-red-600 font-medium mb-4">
                    ⚠️ This action cannot be undone. Settings and admin accounts will be preserved.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDialog(true)}
                  className="border-red-500 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Reset All Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Confirmation Dialog */}
          {showConfirmDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6 border-b">
                  <h2 className="text-2xl font-bold text-red-600 flex items-center">
                    <AlertTriangle className="w-6 h-6 mr-2" />
                    Confirm Reset
                  </h2>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 mb-4">
                    Are you absolutely sure you want to delete all data? This will permanently remove:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 mb-6 ml-4">
                    <li><strong>{dataStats.students}</strong> students</li>
                    <li><strong>{dataStats.transactions}</strong> transactions</li>
                    <li><strong>{dataStats.feePlans}</strong> fee plans</li>
                    <li>All bus entries</li>
                  </ul>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type <strong className="text-red-600">DELETE ALL DATA</strong> to confirm:
                    </label>
                    <input
                      type="text"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="DELETE ALL DATA"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleReset}
                      disabled={isResetting || confirmText !== 'DELETE ALL DATA'}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      {isResetting ? 'Resetting...' : 'Yes, Delete All Data'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowConfirmDialog(false)
                        setConfirmText('')
                      }}
                      disabled={isResetting}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
