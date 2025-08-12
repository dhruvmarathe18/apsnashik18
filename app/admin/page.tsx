'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  Image,
  Users,
  FileText,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  Upload,
  BarChart3,
  TrendingUp,
  Activity,
  Award,
  RefreshCw,
  Database,
  AlertCircle
} from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import AddEventModal from '@/components/admin/AddEventModal'
import AddImageModal from '@/components/admin/AddImageModal'
import AddNewsModal from '@/components/admin/AddNewsModal'
import toast from 'react-hot-toast'
import { useData } from '@/contexts/DataContext'

interface Event {
  id: string
  title: string
  date: string
  description: string
  category: string
  status: 'upcoming' | 'ongoing' | 'completed'
}

interface GalleryImage {
  id: string
  title: string
  category: string
  src: string
  alt: string
  uploadDate: string
}

interface NewsArticle {
  id: string
  title: string
  content: string
  publishDate: string
  status: 'draft' | 'published'
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [showAddImage, setShowAddImage] = useState(false)
  const [showAddNews, setShowAddNews] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  const {
    events,
    galleryImages,
    newsArticles,
    addEvent,
    addImage,
    addNews,
    deleteEvent,
    deleteImage,
    deleteNews
  } = useData()

  const stats = [
    { title: 'Total Events', value: events.length, icon: Calendar, color: 'text-blue-600' },
    { title: 'Gallery Images', value: galleryImages.length, icon: Image, color: 'text-green-600' },
    { title: 'News Articles', value: newsArticles.length, icon: FileText, color: 'text-purple-600' },
    { title: 'Published Content', value: newsArticles.filter((n: NewsArticle) => n.status === 'published').length, icon: Eye, color: 'text-orange-600' }
  ]

  const quickActions = [
    { title: 'Add New Event', icon: Plus, action: () => setShowAddEvent(true), color: 'bg-blue-500' },
    { title: 'Upload Image', icon: Upload, action: () => setShowAddImage(true), color: 'bg-green-500' },
    { title: 'Create News', icon: FileText, action: () => setShowAddNews(true), color: 'bg-purple-500' },
    { title: 'View Analytics', icon: BarChart3, action: () => {}, color: 'bg-orange-500' }
  ]

  const handleAddEvent = (eventData: Omit<Event, 'id'>) => {
    addEvent(eventData)
    toast.success('Event added successfully!')
    setShowAddEvent(false)
  }

  const handleAddImage = (imageData: Omit<GalleryImage, 'id' | 'uploadDate'>) => {
    addImage(imageData)
    toast.success('Image uploaded successfully!')
    setShowAddImage(false)
  }

  const handleAddNews = (newsData: Omit<NewsArticle, 'id'>) => {
    addNews(newsData)
    toast.success('News article added successfully!')
    setShowAddNews(false)
  }

  const handleDeleteEvent = (id: string) => {
    deleteEvent(id)
    toast.success('Event deleted successfully!')
  }

  const handleDeleteImage = (id: string) => {
    deleteImage(id)
    toast.success('Image deleted successfully!')
  }

  const handleDeleteNews = (id: string) => {
    deleteNews(id)
    toast.success('News article deleted successfully!')
  }

  const handleResetData = async () => {
    if (!confirm('Are you sure you want to reset all data? This will clear all events, images, and news articles and restore default data.')) {
      return
    }

    setIsResetting(true)
    
    try {
      // Clear localStorage
      localStorage.removeItem('aps_events')
      localStorage.removeItem('aps_gallery_images')
      localStorage.removeItem('aps_news_articles')
      
      // Reload page to reset data
      window.location.reload()
    } catch (error) {
      console.error('Error resetting data:', error)
      toast.error('Error resetting data. Please try again.')
      setIsResetting(false)
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage your school website content and monitor performance</p>
            </div>
            <button
              onClick={handleResetData}
              disabled={isResetting}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
              <span>{isResetting ? 'Resetting...' : 'Reset Data'}</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-gray-100`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={action.action}
                className={`${action.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-3`}
              >
                <action.icon className="w-5 h-5" />
                <span className="font-medium">{action.title}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content Management Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: BarChart3 },
                { id: 'events', name: 'Events', icon: Calendar },
                { id: 'gallery', name: 'Gallery', icon: Image },
                { id: 'news', name: 'News', icon: FileText }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Events</h3>
                    <div className="space-y-3">
                      {events.slice(0, 3).map((event: Event) => (
                        <div key={event.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{event.title}</p>
                            <p className="text-sm text-gray-600">{event.date}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                            event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {event.status}
                          </span>
                        </div>
                      ))}
                      {events.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No events found. Add your first event!</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent News</h3>
                    <div className="space-y-3">
                      {newsArticles.slice(0, 3).map((article: NewsArticle) => (
                        <div key={article.id} className="p-3 bg-white rounded-lg">
                          <p className="font-medium text-gray-900">{article.title}</p>
                          <p className="text-sm text-gray-600">{article.publishDate}</p>
                        </div>
                      ))}
                      {newsArticles.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No news articles found. Add your first article!</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Data Status */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                    <Database className="w-5 h-5 mr-2" />
                    Data Status
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-700">Events stored:</span>
                      <span className="font-medium">{events.length} items</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-700">Images stored:</span>
                      <span className="font-medium">{galleryImages.length} items</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-700">News stored:</span>
                      <span className="font-medium">{newsArticles.length} items</span>
                    </div>
                  </div>
                  <p className="text-xs text-blue-600 mt-3">
                    💡 Data is automatically saved to your browser's localStorage and will persist across page refreshes.
                  </p>
                </div>
              </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Manage Events</h3>
                  <button
                    onClick={() => setShowAddEvent(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Event</span>
                  </button>
                </div>

                {events.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Yet</h3>
                    <p className="text-gray-600 mb-4">Get started by adding your first school event.</p>
                    <button
                      onClick={() => setShowAddEvent(true)}
                      className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
                    >
                      Add Your First Event
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {events.map((event: Event) => (
                          <tr key={event.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{event.title}</div>
                                <div className="text-sm text-gray-500">{event.description}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                                event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {event.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button className="text-primary-600 hover:text-primary-900">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteEvent(event.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Gallery Tab */}
            {activeTab === 'gallery' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Manage Gallery</h3>
                  <button
                    onClick={() => setShowAddImage(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Image</span>
                  </button>
                </div>

                {/* Helpful Tip */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Image Upload Tip</h4>
                  <p className="text-sm text-blue-700">
                    When adding images, you can either upload a new file or select from existing images in the school's image library. 
                    This ensures all images display properly on the website.
                  </p>
                </div>

                {galleryImages.length === 0 ? (
                  <div className="text-center py-12">
                    <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Images Yet</h3>
                    <p className="text-gray-600 mb-4">Start building your gallery by uploading school photos.</p>
                    <button
                      onClick={() => setShowAddImage(true)}
                      className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
                    >
                      Upload Your First Image
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryImages.map((image: GalleryImage) => (
                      <div key={image.id} className="bg-white border rounded-lg overflow-hidden shadow-sm">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                              target.nextElementSibling?.classList.remove('hidden')
                            }}
                          />
                          <div className="hidden absolute inset-0 bg-gray-200 flex items-center justify-center">
                            <div className="text-center text-gray-500">
                              <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                              <p className="text-xs">Image not available</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-medium text-gray-900 mb-1">{image.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{image.category}</p>
                          <p className="text-xs text-gray-500 mb-3">Uploaded: {image.uploadDate}</p>
                          <div className="flex space-x-2">
                            <button className="text-primary-600 hover:text-primary-900">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteImage(image.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* News Tab */}
            {activeTab === 'news' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Manage News</h3>
                  <button
                    onClick={() => setShowAddNews(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add News</span>
                  </button>
                </div>

                {newsArticles.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No News Articles Yet</h3>
                    <p className="text-gray-600 mb-4">Start sharing school news and updates with your community.</p>
                    <button
                      onClick={() => setShowAddNews(true)}
                      className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
                    >
                      Add Your First Article
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {newsArticles.map((article: NewsArticle) => (
                      <div key={article.id} className="bg-white border rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">{article.title}</h4>
                            <p className="text-sm text-gray-600">Published: {article.publishDate}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {article.status}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-4">{article.content}</p>
                        <div className="flex space-x-2">
                          <button className="text-primary-600 hover:text-primary-900">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteNews(article.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        <AddEventModal
          isOpen={showAddEvent}
          onClose={() => setShowAddEvent(false)}
          onAdd={handleAddEvent}
        />

        <AddImageModal
          isOpen={showAddImage}
          onClose={() => setShowAddImage(false)}
          onAdd={handleAddImage}
        />

        <AddNewsModal
          isOpen={showAddNews}
          onClose={() => setShowAddNews(false)}
          onAdd={handleAddNews}
        />
      </div>
    </AdminLayout>
  )
}
