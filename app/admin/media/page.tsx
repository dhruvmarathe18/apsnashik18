'use client'

import { useState, useMemo } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { ImageIcon, Upload, Folder, Tag, Search, Filter, Copy, CheckCircle, X } from 'lucide-react'
import { useCloudinaryMedia } from '@/hooks/useCloudinaryMedia'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import CloudinaryUploadWidget from '@/components/admin/CloudinaryUploadWidget'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import CloudinaryImage from '@/components/ui/CloudinaryImage'

export default function MediaPage() {
  const [selectedFolder, setSelectedFolder] = useState('aps-nashik')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<any>(null)
  const [uploadWidgetFolder, setUploadWidgetFolder] = useState('aps-nashik')

  const { media, loading, error, refetch } = useCloudinaryMedia({
    folder: selectedFolder,
    tag: selectedTag || undefined,
    maxResults: 100,
    autoFetch: true,
  })

  // Available folders (you can customize this based on your Cloudinary structure)
  const folders = [
    { value: 'aps-nashik', label: 'Root (aps-nashik)' },
    { value: 'aps-nashik/gallery', label: 'Gallery' },
    { value: 'aps-nashik/gallery/school-events', label: 'School Events' },
    { value: 'aps-nashik/gallery/classroom-activities', label: 'Classroom Activities' },
    { value: 'aps-nashik/gallery/sports-activities', label: 'Sports & Activities' },
    { value: 'aps-nashik/gallery/infrastructure', label: 'Infrastructure' },
    { value: 'aps-nashik/teachers', label: 'Teachers' },
    { value: 'aps-nashik/hero-images', label: 'Hero Images' },
  ]

  // Extract unique tags from media
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>()
    media.forEach((item) => {
      item.tags?.forEach((tag) => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [media])

  // Filter media by search term
  const filteredMedia = useMemo(() => {
    let filtered = media

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.id.toLowerCase().includes(term) ||
          item.folder?.toLowerCase().includes(term) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(term)) ||
          item.context?.alt?.toLowerCase().includes(term) ||
          item.context?.caption?.toLowerCase().includes(term)
      )
    }

    return filtered
  }, [media, searchTerm])

  const handleUploadSuccess = (result: any) => {
    toast.success('Image uploaded successfully!')
    // Refresh the media list
    setTimeout(() => {
      refetch()
    }, 1000)
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('URL copied to clipboard!')
  }

  const handleCopyPublicId = (publicId: string) => {
    navigator.clipboard.writeText(publicId)
    toast.success('Public ID copied to clipboard!')
  }

  const openLightbox = (item: any) => {
    setSelectedImage(item)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setSelectedImage(null)
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
              <ImageIcon className="w-8 h-8" />
              <span>Media Management</span>
            </h1>
            <p className="text-gray-600 mt-2">Upload and manage images in Cloudinary</p>
          </div>

          {/* Upload Widget */}
          <div className="mb-8">
            <CloudinaryUploadWidget
              folder={uploadWidgetFolder}
              onUploadSuccess={handleUploadSuccess}
              maxFiles={10}
              resourceType="image"
              tags={selectedTag ? [selectedTag] : []}
            />
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Folder className="w-4 h-4 inline mr-1" />
                    Folder
                  </label>
                  <Select
                    value={selectedFolder}
                    onChange={(e) => {
                      setSelectedFolder(e.target.value)
                      setUploadWidgetFolder(e.target.value)
                    }}
                    options={folders.map((f) => ({ value: f.value, label: f.label }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag className="w-4 h-4 inline mr-1" />
                    Tag
                  </label>
                  <Select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    options={[
                      { value: '', label: 'All Tags' },
                      ...availableTags.map((tag) => ({ value: tag, label: tag })),
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Search className="w-4 h-4 inline mr-1" />
                    Search
                  </label>
                  <Input
                    type="text"
                    placeholder="Search by name, folder, or tag..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media Grid */}
          {loading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading media from Cloudinary...</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={refetch}>Retry</Button>
              </CardContent>
            </Card>
          ) : filteredMedia.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Media Found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || selectedTag
                    ? 'No media matches your filters. Try adjusting your search criteria.'
                    : 'No media found in this folder. Upload some images to get started.'}
                </p>
                <Button onClick={() => setSearchTerm('')}>Clear Filters</Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {filteredMedia.length} of {media.length} images
                </p>
                <Button variant="outline" onClick={refetch}>
                  Refresh
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredMedia.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <div
                      className="aspect-square bg-gray-100 cursor-pointer"
                      onClick={() => openLightbox(item)}
                    >
                      <CloudinaryImage
                        src={item.thumbnail || item.url}
                        alt={item.context?.alt || item.id}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                        cloudinaryOptions={{
                          width: 300,
                          height: 300,
                          crop: 'fill',
                          quality: 'auto',
                        }}
                      />
                    </div>
                    <div className="p-3 bg-white">
                      <p className="text-xs text-gray-600 truncate mb-1" title={item.id}>
                        {item.id.split('/').pop()}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{(item.bytes / 1024).toFixed(1)} KB</span>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleCopyPublicId(item.id)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Copy Public ID"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleCopyUrl(item.url)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Copy URL"
                          >
                            <CheckCircle className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                          {item.tags.length > 2 && (
                            <span className="text-xs text-gray-500">+{item.tags.length - 2}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && selectedImage && (
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
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative w-full h-full max-h-[90vh] flex items-center justify-center">
                <CloudinaryImage
                  src={selectedImage.large || selectedImage.url}
                  alt={selectedImage.context?.alt || selectedImage.id}
                  width={1200}
                  height={900}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  cloudinaryOptions={{
                    quality: 'auto',
                    format: 'auto',
                  }}
                />
              </div>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 text-white text-center max-w-2xl">
                <p className="font-medium">{selectedImage.context?.alt || selectedImage.id}</p>
                <div className="flex items-center justify-center space-x-4 mt-2 text-sm">
                  <button
                    onClick={() => handleCopyPublicId(selectedImage.id)}
                    className="hover:text-primary-300 transition-colors"
                  >
                    Copy Public ID
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => handleCopyUrl(selectedImage.url)}
                    className="hover:text-primary-300 transition-colors"
                  >
                    Copy URL
                  </button>
                  <span>•</span>
                  <span>
                    {selectedImage.width} × {selectedImage.height}
                  </span>
                  <span>•</span>
                  <span>{(selectedImage.bytes / 1024).toFixed(1)} KB</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}
