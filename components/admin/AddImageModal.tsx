'use client'

import { useState } from 'react'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import app from '@/lib/firebase'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Image as ImageIcon } from 'lucide-react'

interface GalleryImage {
  id: string
  title: string
  category: string
  src: string
  alt: string
  uploadDate: string
}

interface AddImageModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (image: Omit<GalleryImage, 'id' | 'uploadDate'>) => void
}

export default function AddImageModal({ isOpen, onClose, onAdd }: AddImageModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    src: '',
    alt: ''
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [useExistingImage, setUseExistingImage] = useState(false)
  const [selectedExistingImage, setSelectedExistingImage] = useState('')

  const categories = [
    'School Events',
    'Classroom Activities',
    'Sports & Activities',
    'Infrastructure',
    'Students',
    'Teachers',
    'Other'
  ]

  // Available images from the images folder
  const availableImages = [
    { name: 'Sports Day Celebration', path: '/images/kids.jpg' },
    { name: 'Classroom Activity', path: '/images/teacher-1.jpg' },
    { name: 'School Infrastructure', path: '/images/infra.jpg' },
    { name: 'Students in Library', path: '/images/teacher-2.jpg' },
    { name: 'Teacher Portrait', path: '/images/teacher-3.jpg' },
    { name: 'School Principal', path: '/images/principal.jpeg' },
    { name: 'School Building', path: '/images/infra2.jpeg' },
    { name: 'Students Group', path: '/images/kidss.jpg' },
    { name: 'School Logo', path: '/images/aps.jpg' },
    { name: 'Hero Image', path: '/images/hero.png' }
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setFormData(prev => ({
        ...prev,
        src: url,
        alt: file.name
      }))
      setUseExistingImage(false)
    }
  }

  const handleExistingImageSelect = (imagePath: string, imageName: string) => {
    setSelectedExistingImage(imagePath)
    setFormData(prev => ({
      ...prev,
      src: imagePath,
      alt: imageName
    }))
    setUseExistingImage(true)
    setSelectedFile(null)
    setPreviewUrl('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (useExistingImage && selectedExistingImage) {
        onAdd({
          title: formData.title,
          category: formData.category,
          src: selectedExistingImage,
          alt: formData.alt
        })
      } else if (selectedFile) {
        // Prefer Vercel Blob if token present
        if (process.env.NEXT_PUBLIC_USE_BLOB || process.env.BLOB_READ_WRITE_TOKEN) {
          const fd = new FormData()
          fd.append('file', selectedFile)
          const res = await fetch('/api/upload', { method: 'POST', body: fd })
          const data = await res.json()
          if (!res.ok || !data.url) throw new Error('Blob upload failed')
          onAdd({
            title: formData.title,
            category: formData.category,
            src: data.url,
            alt: formData.alt
          })
        } else {
          // Fallback to Firebase Storage (requires billing enabled)
          const storage = getStorage(app)
          const filePath = `gallery/${Date.now()}-${selectedFile.name}`
          const storageRef = ref(storage, filePath)
          await uploadBytes(storageRef, selectedFile)
          const publicUrl = await getDownloadURL(storageRef)
          onAdd({
            title: formData.title,
            category: formData.category,
            src: publicUrl,
            alt: formData.alt
          })
        }
      } else {
        alert('Please select an image or choose an existing image')
        return
      }
    } catch (err) {
      console.error('Upload failed:', err)
      toast.error('Upload failed. Please try again.')
      return
    }

    // Reset form
    setFormData({
      title: '',
      category: '',
      src: '',
      alt: ''
    })
    setSelectedFile(null)
    setPreviewUrl('')
    setUseExistingImage(false)
    setSelectedExistingImage('')
    onClose()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Upload New Image</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Image Selection Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Choose Image Source
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setUseExistingImage(false)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      !useExistingImage
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Upload New Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseExistingImage(true)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      useExistingImage
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Use Existing Image
                  </button>
                </div>
              </div>

              {/* File Upload */}
              {!useExistingImage && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Image *
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                    <div className="space-y-1 text-center">
                      {previewUrl ? (
                        <div className="mb-4">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="mx-auto h-32 w-auto rounded-lg"
                          />
                        </div>
                      ) : (
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      )}
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleFileChange}
                            required={!useExistingImage}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Existing Images Selection */}
              {useExistingImage && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Existing Image *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
                    {availableImages.map((image) => (
                      <button
                        key={image.path}
                        type="button"
                        onClick={() => handleExistingImageSelect(image.path, image.name)}
                        className={`p-2 border rounded-lg transition-colors ${
                          selectedExistingImage === image.path
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <img
                          src={image.path}
                          alt={image.name}
                          className="w-full h-20 object-cover rounded mb-2"
                        />
                        <p className="text-xs text-gray-700 truncate">{image.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Image Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Image Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter image title"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Alt Text */}
              <div>
                <label htmlFor="alt" className="block text-sm font-medium text-gray-700 mb-2">
                  Alt Text (Description) *
                </label>
                <textarea
                  id="alt"
                  name="alt"
                  value={formData.alt}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Describe the image for accessibility"
                />
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!formData.title || !formData.category || !formData.alt || (!selectedFile && !selectedExistingImage)}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Upload Image
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
