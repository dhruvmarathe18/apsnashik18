'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Image, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  AlertCircle
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useData } from '@/contexts/DataContext'

export default function Gallery() {
  const [currentCategory, setCurrentCategory] = useState('all')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

  const { galleryImages } = useData()

  // Create a flat array of all images with category information
  const allImages = galleryImages.map(img => ({
    ...img,
    category: img.category.toLowerCase().replace(/\s+/g, '-')
  }))

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

  const handleImageError = (imageSrc: string) => {
    setImageErrors(prev => new Set(prev).add(imageSrc))
  }

  const categories = [
    { name: 'all', label: 'All Photos' },
    { name: 'school-events', label: 'School Events' },
    { name: 'classroom-activities', label: 'Classroom Activities' },
    { name: 'sports-activities', label: 'Sports & Activities' },
    { name: 'infrastructure', label: 'Infrastructure' }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
        <div className="container-custom text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <Image className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="heading-primary mb-4"
          >
            School Gallery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-200 max-w-3xl mx-auto"
          >
            Explore our school life through photos of events, activities, and campus life.
          </motion.p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setCurrentCategory(category.name)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  currentCategory === category.name
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-gray-100 text-dark-600 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-padding">
        <div className="container-custom">
          {filteredImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredImages.map((image, index) => (
                <motion.div
                  key={`${image.category}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <div className="relative overflow-hidden rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300">
                    {imageErrors.has(image.src) ? (
                      <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                          <p className="text-sm">Image not available</p>
                          <p className="text-xs text-gray-400">{image.alt}</p>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={() => handleImageError(image.src)}
                        loading="lazy"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Image className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <h3 className="font-semibold text-dark-900">{image.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{image.category}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Image className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
              <p className="text-gray-600">No images are available for this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && filteredImages.length > 0 && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-full p-4">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Image */}
            {imageErrors.has(filteredImages[currentImageIndex].src) ? (
              <div className="max-w-full max-h-[80vh] flex items-center justify-center bg-gray-800 rounded-lg">
                <div className="text-center text-white">
                  <AlertCircle className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Image not available</h3>
                  <p className="text-gray-300">{filteredImages[currentImageIndex].alt}</p>
                </div>
              </div>
            ) : (
              <img
                src={filteredImages[currentImageIndex].src}
                alt={filteredImages[currentImageIndex].alt}
                className="max-w-full max-h-[80vh] object-contain"
                onError={() => handleImageError(filteredImages[currentImageIndex].src)}
              />
            )}

            {/* Image Info */}
            <div className="mt-4 text-center text-white">
              <h3 className="text-xl font-semibold">{filteredImages[currentImageIndex].title}</h3>
              <p className="text-gray-300 mt-2">
                {currentImageIndex + 1} of {filteredImages.length}
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
