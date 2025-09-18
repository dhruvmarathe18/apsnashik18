'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

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
  upload_date: string
}

interface NewsArticle {
  id: string
  title: string
  content: string
  publish_date: string
  status: 'draft' | 'published'
}

interface HeroImage {
  id: string
  title: string
  src: string
  alt: string
  is_active: boolean
  display_order: number
}

interface DataContextType {
  events: Event[]
  galleryImages: GalleryImage[]
  newsArticles: NewsArticle[]
  heroImages: HeroImage[]
  loading: boolean
  error: string | null
  addEvent: (event: Omit<Event, 'id'>) => Promise<void>
  addImage: (image: Omit<GalleryImage, 'id' | 'upload_date'>) => Promise<void>
  addNews: (article: Omit<NewsArticle, 'id'>) => Promise<void>
  addHeroImage: (image: Omit<HeroImage, 'id'>) => Promise<void>
  updateHeroImage: (id: string, image: Partial<HeroImage>) => Promise<void>
  deleteEvent: (id: string) => Promise<void>
  deleteImage: (id: string) => Promise<void>
  deleteNews: (id: string) => Promise<void>
  deleteHeroImage: (id: string) => Promise<void>
  getUpcomingEvents: () => Event[]
  getPublishedNews: () => NewsArticle[]
  getActiveHeroImages: () => HeroImage[]
  refreshData: () => Promise<void>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

// API helper functions
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
  const response = await fetch(`${baseURL}/api/${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'API call failed')
  }

  return response.json()
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([])
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([])
  const [heroImages, setHeroImages] = useState<HeroImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load data from API on component mount
  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [eventsData, galleryData, newsData, heroData] = await Promise.all([
        apiCall('events'),
        apiCall('gallery'),
        apiCall('news'),
        apiCall('hero')
      ])
      
      setEvents(eventsData)
      setGalleryImages(galleryData)
      setNewsArticles(newsData)
      setHeroImages(heroData)
    } catch (err) {
      console.error('Error loading data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const addEvent = async (eventData: Omit<Event, 'id'>) => {
    try {
      const newEvent = await apiCall('events', {
        method: 'POST',
        body: JSON.stringify(eventData)
      })
      setEvents(prev => [...prev, newEvent])
    } catch (err) {
      console.error('Error adding event:', err)
      throw err
    }
  }

  const addImage = async (imageData: Omit<GalleryImage, 'id' | 'upload_date'>) => {
    try {
      const newImage = await apiCall('gallery', {
        method: 'POST',
        body: JSON.stringify(imageData)
      })
      setGalleryImages(prev => [...prev, newImage])
    } catch (err) {
      console.error('Error adding image:', err)
      throw err
    }
  }

  const addNews = async (newsData: Omit<NewsArticle, 'id'>) => {
    try {
      const newArticle = await apiCall('news', {
        method: 'POST',
        body: JSON.stringify(newsData)
      })
      setNewsArticles(prev => [...prev, newArticle])
    } catch (err) {
      console.error('Error adding news:', err)
      throw err
    }
  }

  const addHeroImage = async (imageData: Omit<HeroImage, 'id'>) => {
    try {
      const newImage = await apiCall('hero', {
        method: 'POST',
        body: JSON.stringify(imageData)
      })
      setHeroImages(prev => [...prev, newImage])
    } catch (err) {
      console.error('Error adding hero image:', err)
      throw err
    }
  }

  const updateHeroImage = async (id: string, imageData: Partial<HeroImage>) => {
    try {
      const updatedImage = await apiCall('hero', {
        method: 'PUT',
        body: JSON.stringify({ id, ...imageData })
      })
      setHeroImages(prev => prev.map(img => img.id === id ? updatedImage : img))
    } catch (err) {
      console.error('Error updating hero image:', err)
      throw err
    }
  }

  const deleteEvent = async (id: string) => {
    try {
      await apiCall(`events?id=${id}`, { method: 'DELETE' })
      setEvents(prev => prev.filter(event => event.id !== id))
    } catch (err) {
      console.error('Error deleting event:', err)
      throw err
    }
  }

  const deleteImage = async (id: string) => {
    try {
      await apiCall(`gallery?id=${id}`, { method: 'DELETE' })
      setGalleryImages(prev => prev.filter(img => img.id !== id))
    } catch (err) {
      console.error('Error deleting image:', err)
      throw err
    }
  }

  const deleteNews = async (id: string) => {
    try {
      await apiCall(`news?id=${id}`, { method: 'DELETE' })
      setNewsArticles(prev => prev.filter(article => article.id !== id))
    } catch (err) {
      console.error('Error deleting news:', err)
      throw err
    }
  }

  const deleteHeroImage = async (id: string) => {
    try {
      await apiCall(`hero?id=${id}`, { method: 'DELETE' })
      setHeroImages(prev => prev.filter(img => img.id !== id))
    } catch (err) {
      console.error('Error deleting hero image:', err)
      throw err
    }
  }

  const getUpcomingEvents = () => {
    return events.filter(event => event.status === 'upcoming').slice(0, 3)
  }

  const getPublishedNews = () => {
    return newsArticles.filter(article => article.status === 'published').slice(0, 3)
  }

  const getActiveHeroImages = () => {
    return heroImages.filter(img => img.is_active).sort((a, b) => a.display_order - b.display_order)
  }

  const refreshData = async () => {
    await loadData()
  }

  const value = {
    events,
    galleryImages,
    newsArticles,
    heroImages,
    loading,
    error,
    addEvent,
    addImage,
    addNews,
    addHeroImage,
    updateHeroImage,
    deleteEvent,
    deleteImage,
    deleteNews,
    deleteHeroImage,
    getUpcomingEvents,
    getPublishedNews,
    getActiveHeroImages,
    refreshData
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
