'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Image as ImageIcon, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  AlertCircle,
  Loader2
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useData } from '@/contexts/DataContext'
import { useCloudinaryMedia } from '@/hooks/useCloudinaryMedia'
import CloudinaryImage from '@/components/ui/CloudinaryImage'

export default function Gallery() {
  const [currentCategory, setCurrentCategory] = useState('all')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [useCloudinary, setUseCloudinary] = useState(true)

  // Fetch from Cloudinary
  const { media: cloudinaryMedia, loading: cloudinaryLoading } = useCloudinaryMedia({
    folder: 'aps-nashik',
    resourceType: 'image',
    maxResults: 100,
  })

  // Fallback to local data
  const { galleryImages } = useData()

  // Combine Cloudinary and local images
  const allImages = useMemo(() => {
    const images: Array<{
      id: string
      src: string
      alt: string
      category: string
      thumbnail?: string
      medium?: string
      large?: string
    }> = []

    // Add Cloudinary images if available
    if (useCloudinary && cloudinaryMedia.length > 0) {
      cloudinaryMedia.forEach((item) => {
        // Extract category from folder or tags
        const category = item.folder?.split('/').pop() || item.tags[0] || 'general'
        images.push({
          id: item.id,
          src: item.large || item.url,
          alt: item.context?.alt || item.context?.caption || `Image ${item.id}`,
          category: category.toLowerCase().replace(/\s+/g, '-'),
          thumbnail: item.thumbnail,
          medium: item.medium,
          large: item.large,
        })
      })
    }

    // Add local images as fallback
    if (images.length === 0 || !useCloudinary) {
      galleryImages.forEach((img) => {
        images.push({
          id: img.id || img.src,
          src: img.src,
          alt: img.alt,
          category: img.category.toLowerCase().replace(/\s+/g, '-'),
        })
      })
    }

    return images
  }, [cloudinaryMedia, galleryImages, useCloudinary])

  const categories = useMemo(() => {
    const cats = new Set<string>(['all'])
    allImages.forEach((img) => {
      if (img.category) {
        cats.add(img.category)
      }
    })
    return Array.from(cats).map((cat) => ({
      name: cat,
      label: cat === 'all' ? 'All Photos' : cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    }))
  }, [allImages])

  const filteredImages = currentCategory === 'all' 
    ? allImages 
    : allImages.filter(img => img.category === currentCategory)

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === filteredImages.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? filteredImages.length - 1 : prev - 1
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        <div className="container-custom text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-xl mb-6"
            >
              <ImageIcon className="w-10 h-10 text-primary-600" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            >
              School Gallery
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              Explore our school life through photos of events, activities, and daily moments.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-20 z-40 backdrop-blur-sm bg-white/95">
        <div className="container-custom">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filter by:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setCurrentCategory(category.name)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    currentCategory === category.name
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          {cloudinaryLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading images from Cloudinary...</p>
            </div>
          ) : filteredImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="group cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300 aspect-square">
                    <CloudinaryImage
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      cloudinaryOptions={{
                        width: 400,
                        height: 400,
                        crop: 'fill',
                        quality: 'auto',
                      }}
                      fallbackSrc="/images/placeholder.jpg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <p className="text-white font-medium text-sm">{image.alt}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Images Found</h3>
              <p className="text-gray-600">
                {useCloudinary 
                  ? 'No images found in Cloudinary. Please upload images to your Cloudinary account.'
                  : 'No images available in this category.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && filteredImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-7xl w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Previous Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                className="absolute left-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                className="absolute right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image */}
              <div className="relative w-full h-full max-h-[90vh] flex items-center justify-center">
                <CloudinaryImage
                  src={filteredImages[currentImageIndex]?.large || filteredImages[currentImageIndex]?.src || ''}
                  alt={filteredImages[currentImageIndex]?.alt || 'Gallery image'}
                  width={1200}
                  height={900}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  cloudinaryOptions={{
                    quality: 'auto',
                    format: 'auto',
                  }}
                />
              </div>

              {/* Image Info */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 text-white text-center">
                <p className="font-medium">{filteredImages[currentImageIndex]?.alt}</p>
                <p className="text-sm text-white/80">
                  {currentImageIndex + 1} of {filteredImages.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
