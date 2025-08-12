'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Save, 
  Edit, 
  FileText, 
  Home, 
  Info, 
  Users, 
  Phone,
  Settings
} from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface ContentSection {
  id: string
  title: string
  content: string
  lastUpdated: string
}

export default function ContentManagement() {
  const [activeSection, setActiveSection] = useState('homepage')
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const authToken = localStorage.getItem('adminAuth')
      if (authToken !== 'true') {
        router.push('/admin/login')
        return
      }
      setIsAuthenticated(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const contentSections = {
    homepage: {
      title: 'Homepage Content',
      sections: [
        {
          id: 'hero-title',
          title: 'Hero Section Title',
          content: 'Welcome to Apple Public School',
          lastUpdated: '2024-01-15'
        },
        {
          id: 'hero-description',
          title: 'Hero Section Description',
          content: 'Nurturing minds, building character, and shaping futures. Join us in providing quality education that prepares students for life\'s challenges.',
          lastUpdated: '2024-01-15'
        },
        {
          id: 'why-choose-us',
          title: 'Why Choose Us Section',
          content: 'We focus on holistic development with experienced teachers, modern facilities, and a nurturing environment that prepares students for life.',
          lastUpdated: '2024-01-15'
        }
      ]
    },
    about: {
      title: 'About Page Content',
      sections: [
        {
          id: 'about-description',
          title: 'About Description',
          content: 'Apple Public School has been providing quality education since 2009. We are committed to academic excellence and character development.',
          lastUpdated: '2024-01-15'
        },
        {
          id: 'mission',
          title: 'Mission Statement',
          content: 'To provide comprehensive education that nurtures intellectual, physical, and moral development of students.',
          lastUpdated: '2024-01-15'
        },
        {
          id: 'vision',
          title: 'Vision Statement',
          content: 'To be a leading educational institution that prepares students for global challenges and opportunities.',
          lastUpdated: '2024-01-15'
        }
      ]
    },
    contact: {
      title: 'Contact Page Content',
      sections: [
        {
          id: 'contact-description',
          title: 'Contact Description',
          content: 'Get in touch with us for any inquiries about admissions, programs, or general information.',
          lastUpdated: '2024-01-15'
        },
        {
          id: 'office-hours',
          title: 'Office Hours',
          content: 'Monday - Friday: 8:00 AM - 4:00 PM\nSaturday: 8:00 AM - 12:00 PM',
          lastUpdated: '2024-01-15'
        }
      ]
    }
  }

  const handleEdit = (content: string) => {
    setEditedContent(content)
    setIsEditing(true)
  }

  const handleSave = () => {
    // In a real app, you would save to a database
    toast.success('Content updated successfully!')
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedContent('')
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content management...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null
  }

  const currentSections = contentSections[activeSection as keyof typeof contentSections]

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600 mt-2">Edit website content and manage page information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Page Sections</h2>
              <nav className="space-y-2">
                {Object.entries(contentSections).map(([key, section]) => (
                  <button
                    key={key}
                    onClick={() => setActiveSection(key)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === key
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {key === 'homepage' && <Home className="w-4 h-4" />}
                      {key === 'about' && <Info className="w-4 h-4" />}
                      {key === 'contact' && <Phone className="w-4 h-4" />}
                      <span>{section.title}</span>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">{currentSections.title}</h2>
                  <div className="flex items-center space-x-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSave}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEdit('')}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit All</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  {currentSections.sections.map((section) => (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            Last updated: {section.lastUpdated}
                          </span>
                          <button
                            onClick={() => handleEdit(section.content)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {isEditing ? (
                        <textarea
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          rows={6}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Enter content..."
                        />
                      ) : (
                        <div className="prose max-w-none">
                          <p className="text-gray-700 whitespace-pre-line">{section.content}</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-primary-600" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Export Content</p>
                      <p className="text-sm text-gray-600">Download all content</p>
                    </div>
                  </div>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Settings className="w-5 h-5 text-primary-600" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">SEO Settings</p>
                      <p className="text-sm text-gray-600">Manage meta tags</p>
                    </div>
                  </div>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-primary-600" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Team Info</p>
                      <p className="text-sm text-gray-600">Update staff details</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
