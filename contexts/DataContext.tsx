'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { db } from '@/lib/firebase'
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'

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
  const firebaseEnabled = Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  )

  // Load data on mount: Firestore if available, else localStorage
  useEffect(() => {
    if (firebaseEnabled) {
      try {
        const eventsQuery = query(collection(db, 'events'), orderBy('date', 'desc'))
        const unsubEvents = onSnapshot(eventsQuery, (snapshot) => {
          const list: Event[] = snapshot.docs.map((d) => ({
            id: d.id,
            title: (d.data() as any).title,
            date: (d.data() as any).date,
            description: (d.data() as any).description,
            category: (d.data() as any).category,
            status: (d.data() as any).status
          }))
          setEvents(list)
        })

        const imagesQuery = query(collection(db, 'galleryImages'), orderBy('uploadDate', 'desc'))
        const unsubImages = onSnapshot(imagesQuery, (snapshot) => {
          const list: GalleryImage[] = snapshot.docs.map((d) => ({
            id: d.id,
            title: (d.data() as any).title,
            category: (d.data() as any).category,
            src: (d.data() as any).src,
            alt: (d.data() as any).alt,
            uploadDate: (d.data() as any).uploadDate
          }))
          setGalleryImages(list)
        })

        const newsQuery = query(collection(db, 'newsArticles'), orderBy('publishDate', 'desc'))
        const unsubNews = onSnapshot(newsQuery, (snapshot) => {
          const list: NewsArticle[] = snapshot.docs.map((d) => ({
            id: d.id,
            title: (d.data() as any).title,
            content: (d.data() as any).content,
            publishDate: (d.data() as any).publishDate,
            status: (d.data() as any).status
          }))
          setNewsArticles(list)
        })

        setIsInitialized(true)
        return () => {
          unsubEvents()
          unsubImages()
          unsubNews()
        }
      } catch (e) {
        console.warn('Firestore unavailable, falling back to local data:', e)
      }
    }

    // Fallback to localStorage
    const storedEvents = loadFromStorage('aps_events', defaultEvents)
    const storedImages = loadFromStorage('aps_gallery_images', defaultGalleryImages)
    const storedNews = loadFromStorage('aps_news_articles', defaultNewsArticles)

    setEvents(storedEvents)
    setGalleryImages(storedImages)
    setNewsArticles(storedNews)
    setIsInitialized(true)
  }, [firebaseEnabled])

  // Save to localStorage only if Firestore is not enabled
  useEffect(() => {
    if (!firebaseEnabled && isInitialized) {
      saveToStorage('aps_events', events)
    }
  }, [events, isInitialized, firebaseEnabled])

  useEffect(() => {
    if (!firebaseEnabled && isInitialized) {
      saveToStorage('aps_gallery_images', galleryImages)
    }
  }, [galleryImages, isInitialized, firebaseEnabled])

  useEffect(() => {
    if (!firebaseEnabled && isInitialized) {
      saveToStorage('aps_news_articles', newsArticles)
    }
  }, [newsArticles, isInitialized, firebaseEnabled])

  const addEvent = async (eventData: Omit<Event, 'id'>) => {
    if (firebaseEnabled) {
      await addDoc(collection(db, 'events'), {
        ...eventData,
        createdAt: serverTimestamp()
      })
      return
    }
    const newEvent: Event = { ...eventData, id: Date.now().toString() }
    setEvents((prev) => [...prev, newEvent])
  }

  const addImage = async (imageData: Omit<GalleryImage, 'id' | 'uploadDate'>) => {
    const uploadDate = new Date().toISOString().split('T')[0]
    if (firebaseEnabled) {
      await addDoc(collection(db, 'galleryImages'), {
        ...imageData,
        uploadDate,
        createdAt: serverTimestamp()
      })
      return
    }
    const newImage: GalleryImage = { ...imageData, id: Date.now().toString(), uploadDate }
    setGalleryImages((prev) => [...prev, newImage])
  }

  const addNews = async (newsData: Omit<NewsArticle, 'id'>) => {
    if (firebaseEnabled) {
      await addDoc(collection(db, 'newsArticles'), {
        ...newsData,
        createdAt: serverTimestamp()
      })
      return
    }
    const newArticle: NewsArticle = { ...newsData, id: Date.now().toString() }
    setNewsArticles((prev) => [...prev, newArticle])
  }

  const deleteEvent = async (id: string) => {
    if (firebaseEnabled) {
      await deleteDoc(doc(db, 'events', id))
      return
    }
    setEvents((prev) => prev.filter((event) => event.id !== id))
  }

  const deleteImage = async (id: string) => {
    if (firebaseEnabled) {
      await deleteDoc(doc(db, 'galleryImages', id))
      return
    }
    setGalleryImages((prev) => prev.filter((img) => img.id !== id))
  }

  const deleteNews = async (id: string) => {
    if (firebaseEnabled) {
      await deleteDoc(doc(db, 'newsArticles', id))
      return
    }
    setNewsArticles((prev) => prev.filter((article) => article.id !== id))
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
