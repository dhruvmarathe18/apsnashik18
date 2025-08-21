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
  uploadDate: string
}

interface NewsArticle {
  id: string
  title: string
  content: string
  publishDate: string
  status: 'draft' | 'published'
}

interface DataContextType {
  events: Event[]
  galleryImages: GalleryImage[]
  newsArticles: NewsArticle[]
  addEvent: (event: Omit<Event, 'id'>) => void
  addImage: (image: Omit<GalleryImage, 'id' | 'uploadDate'>) => void
  addNews: (article: Omit<NewsArticle, 'id'>) => void
  deleteEvent: (id: string) => void
  deleteImage: (id: string) => void
  deleteNews: (id: string) => void
  getUpcomingEvents: () => Event[]
  getPublishedNews: () => NewsArticle[]
}

const DataContext = createContext<DataContextType | undefined>(undefined)

// Default data
const defaultEvents: Event[] = [
  {
    id: '1',
    title: 'Annual Sports Day',
    date: '2024-03-15',
    description: 'Annual sports competition for all students',
    category: 'Sports',
    status: 'upcoming'
  },
  {
    id: '2',
    title: 'Science Exhibition',
    date: '2024-02-20',
    description: 'Students showcase their science projects',
    category: 'Academic',
    status: 'completed'
  },
  {
    id: '3',
    title: 'Cultural Festival',
    date: '2024-04-10',
    description: 'Celebration of arts, music, dance, and cultural diversity',
    category: 'Cultural',
    status: 'upcoming'
  }
]

const defaultGalleryImages: GalleryImage[] = [
  {
    id: '1',
    title: 'Sports Day Celebration',
    category: 'School Events',
    src: '/images/kids.jpg',
    alt: 'Students during sports day',
    uploadDate: '2024-01-15'
  },
  {
    id: '2',
    title: 'Classroom Activity',
    category: 'Classroom Activities',
    src: '/images/teacher-1.jpg',
    alt: 'Students in classroom',
    uploadDate: '2024-01-10'
  },
  {
    id: '3',
    title: 'School Infrastructure',
    category: 'Infrastructure',
    src: '/images/infra.jpg',
    alt: 'School building and facilities',
    uploadDate: '2024-01-05'
  },
  {
    id: '4',
    title: 'Students in Library',
    category: 'Classroom Activities',
    src: '/images/teacher-2.jpg',
    alt: 'Students studying in library',
    uploadDate: '2024-01-08'
  }
]

const defaultNewsArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'School Achieves 100% Board Results',
    content: 'Our school has achieved excellent results in the recent board examinations with 100% pass rate and outstanding performance by our students.',
    publishDate: '2024-01-20',
    status: 'published'
  },
  {
    id: '2',
    title: 'New Computer Lab Inauguration',
    content: 'We are excited to announce the inauguration of our new state-of-the-art computer laboratory equipped with latest technology and software.',
    publishDate: '2024-01-25',
    status: 'published'
  },
  {
    id: '3',
    title: 'Annual Sports Meet Success',
    content: 'The annual sports meet was a grand success with participation from all students and excellent performances in various sports events.',
    publishDate: '2024-01-30',
    status: 'published'
  }
]

// Helper functions for localStorage
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue
  
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaultValue
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error)
    return defaultValue
  }
}

const saveToStorage = <T,>(key: string, value: T): void => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error)
  }
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([])
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load data on mount from server (Vercel Blob JSON via API). Fallback to localStorage.
  useEffect(() => {
    const load = async () => {
      try {
        console.log('DataContext - Starting to load data from server')
        
        const [evRes, imgRes, newsRes] = await Promise.all([
          fetch('/api/content/events', { cache: 'no-store' }),
          fetch('/api/content/gallery', { cache: 'no-store' }),
          fetch('/api/content/news', { cache: 'no-store' })
        ])
        
        console.log('DataContext - Server responses:', {
          events: evRes.status,
          gallery: imgRes.status,
          news: newsRes.status
        })
        if (evRes.ok) {
          const eventsData = await evRes.json()
          console.log('DataContext - Loaded events:', eventsData.length)
          setEvents(eventsData)
        }
        if (imgRes.ok) {
          const galleryData = await imgRes.json()
          console.log('DataContext - Loaded gallery images:', galleryData.length)
          setGalleryImages(galleryData)
        }
        if (newsRes.ok) {
          const newsData = await newsRes.json()
          console.log('DataContext - Loaded news:', newsData.length)
          setNewsArticles(newsData)
        }
        setIsInitialized(true)
        console.log('DataContext - Successfully loaded from server')
        return
      } catch (e) {
        console.warn('Remote content unavailable, falling back to localStorage:', e)
      }

      console.log('DataContext - Loading from localStorage fallback')
      const storedEvents = loadFromStorage('aps_events', defaultEvents)
      const storedImages = loadFromStorage('aps_gallery_images', defaultGalleryImages)
      const storedNews = loadFromStorage('aps_news_articles', defaultNewsArticles)
      
      console.log('DataContext - LocalStorage data:', {
        events: storedEvents.length,
        gallery: storedImages.length,
        news: storedNews.length
      })
      
      setEvents(storedEvents)
      setGalleryImages(storedImages)
      setNewsArticles(storedNews)
      setIsInitialized(true)
    }
    load()
  }, [])

  // Save to localStorage as a client fallback (not the source of truth)
  useEffect(() => {
    if (isInitialized) {
      saveToStorage('aps_events', events)
    }
  }, [events, isInitialized])

  useEffect(() => {
    if (isInitialized) {
      saveToStorage('aps_gallery_images', galleryImages)
    }
  }, [galleryImages, isInitialized])

  useEffect(() => {
    if (isInitialized) {
      saveToStorage('aps_news_articles', newsArticles)
    }
  }, [newsArticles, isInitialized])

  const addEvent = async (eventData: Omit<Event, 'id'>) => {
    const res = await fetch('/api/content/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    })
    if (!res.ok) throw new Error('Failed to save event')
    const list: Event[] = await res.json()
    setEvents(list)
  }

  const addImage = async (imageData: Omit<GalleryImage, 'id' | 'uploadDate'>) => {
    try {
      console.log('DataContext addImage - Starting with data:', imageData)
      
      const res = await fetch('/api/content/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(imageData)
      })
      
      console.log('DataContext addImage - Response status:', res.status)
      
      if (!res.ok) {
        const errorText = await res.text()
        console.error('DataContext addImage - Response not ok:', errorText)
        throw new Error('Failed to save image')
      }
      
      const list: GalleryImage[] = await res.json()
      console.log('DataContext addImage - Received updated list:', list)
      
      setGalleryImages(list)
      console.log('DataContext addImage - Updated state with', list.length, 'images')
    } catch (error) {
      console.error('DataContext addImage - Error:', error)
      throw error
    }
  }

  const addNews = async (newsData: Omit<NewsArticle, 'id'>) => {
    const res = await fetch('/api/content/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newsData)
    })
    if (!res.ok) throw new Error('Failed to save news')
    const list: NewsArticle[] = await res.json()
    setNewsArticles(list)
  }

  const deleteEvent = async (id: string) => {
    const res = await fetch(`/api/content/events?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete event')
    const list: Event[] = await res.json()
    setEvents(list)
  }

  const deleteImage = async (id: string) => {
    const res = await fetch(`/api/content/gallery?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete image')
    const list: GalleryImage[] = await res.json()
    setGalleryImages(list)
  }

  const deleteNews = async (id: string) => {
    const res = await fetch(`/api/content/news?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete news')
    const list: NewsArticle[] = await res.json()
    setNewsArticles(list)
  }

  const getUpcomingEvents = () => {
    return events.filter(event => event.status === 'upcoming').slice(0, 3)
  }

  const getPublishedNews = () => {
    return newsArticles.filter(article => article.status === 'published').slice(0, 3)
  }

  const value = {
    events,
    galleryImages,
    newsArticles,
    addEvent,
    addImage,
    addNews,
    deleteEvent,
    deleteImage,
    deleteNews,
    getUpcomingEvents,
    getPublishedNews
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
