'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, Mail, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function TestLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [testResults, setTestResults] = useState<any>(null)

  const validEmail = 'admin@apsnashik.com'
  const validPassword = 'admin123456'

  const runTest = () => {
    const results = {
      emailMatch: email === validEmail,
      passwordMatch: password === validPassword,
      bothMatch: email === validEmail && password === validPassword,
      emailInput: email,
      passwordInput: password,
      validEmail,
      validPassword
    }
    
    setTestResults(results)
    
    if (results.bothMatch) {
      toast.success('✅ Credentials are correct!')
    } else {
      toast.error('❌ Credentials are incorrect!')
    }
  }

  const clearTest = () => {
    setTestResults(null)
    setEmail('')
    setPassword('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img 
                src="/images/aps.jpg" 
                alt="APS Nashik" 
                className="w-16 h-16 rounded-lg"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Login Test Page</h1>
            <p className="text-gray-600 mt-2">Test your login credentials</p>
          </div>

          {/* Test Form */}
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="admin@apsnashik.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={runTest}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Test Credentials
              </button>
              <button
                onClick={clearTest}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Expected Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Expected Credentials:</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Email:</strong> {validEmail}</p>
              <p><strong>Password:</strong> {validPassword}</p>
            </div>
          </div>

          {/* Test Results */}
          {testResults && (
            <div className="mt-6 p-4 border rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Test Results:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  {testResults.emailMatch ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span>Email Match: {testResults.emailMatch ? '✅' : '❌'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {testResults.passwordMatch ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span>Password Match: {testResults.passwordMatch ? '✅' : '❌'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {testResults.bothMatch ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span>Overall Result: {testResults.bothMatch ? '✅ PASS' : '❌ FAIL'}</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
                <p><strong>Your Input:</strong></p>
                <p>Email: "{testResults.emailInput}"</p>
                <p>Password: "{testResults.passwordInput}"</p>
                <p><strong>Expected:</strong></p>
                <p>Email: "{testResults.validEmail}"</p>
                <p>Password: "{testResults.validPassword}"</p>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => {
                setEmail(validEmail)
                setPassword(validPassword)
              }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
            >
              Fill Correct Credentials
            </button>
            <a
              href="/admin/login"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm text-center"
            >
              Go to Login Page
            </a>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              This page helps debug login issues
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
