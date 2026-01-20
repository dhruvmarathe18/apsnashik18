'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const [email] = useState('admin@apsnashik.com') // Auto-fill email
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Check if already logged in
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuth')
    if (isAuthenticated === 'true') {
      router.push('/admin')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Clear any previous error messages
    toast.dismiss()

    // Development mode: Simple local authentication (no backend required)
    const DEV_EMAIL = 'admin@apsnashik.com'
    const DEV_PASSWORD = 'admin123456'
    
    // Check if using development credentials
    if (email === DEV_EMAIL && password === DEV_PASSWORD) {
      toast.success('Login successful!')
      // Store auth token in localStorage
      localStorage.setItem('adminAuth', 'true')
      localStorage.setItem('adminToken', 'dev-token')
      localStorage.setItem('adminEmail', DEV_EMAIL)
      localStorage.setItem('adminName', 'Admin User')
      localStorage.setItem('loginTime', new Date().toISOString())
      
      // Small delay to show success message
      setTimeout(() => {
        router.push('/admin')
      }, 1000)
      setIsLoading(false)
      return
    }

    // Try Supabase authentication via API route
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success('Login successful!')
        // Store auth token in localStorage
        localStorage.setItem('adminAuth', 'true')
        localStorage.setItem('adminToken', data.token)
        localStorage.setItem('adminEmail', data.user.email)
        localStorage.setItem('adminName', data.user.name)
        localStorage.setItem('loginTime', new Date().toISOString())
        
        // Small delay to show success message
        setTimeout(() => {
          router.push('/admin')
        }, 1000)
      } else {
        toast.error(data.error || 'Invalid credentials. Please try again.')
        setPassword('')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed. Please check your connection and try again.')
      setPassword('')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-8"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-2xl bg-white border-2 border-primary-200 flex items-center justify-center shadow-lg overflow-hidden">
                <img 
                  src="/images/aps.jpg" 
                  alt="APS Nashik" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Enter your password to continue</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hidden email field - auto-filled */}
            <input
              type="hidden"
              name="email"
              value={email}
            />

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  className="block w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 cursor-pointer">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-4 px-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed transform hover:scale-[1.02] disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center">
                  <Lock className="w-5 h-5 mr-2" />
                  Sign In
                </div>
              )}
            </button>
          </form>

          {/* Email Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Logging in as <span className="font-semibold text-gray-700">admin@apsnashik.com</span>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Protected by secure authentication
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
