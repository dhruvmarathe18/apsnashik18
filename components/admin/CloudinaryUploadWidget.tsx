'use client'

import { useEffect, useRef, useState } from 'react'
import { Upload, X, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import toast from 'react-hot-toast'

interface CloudinaryUploadWidgetProps {
  folder?: string
  onUploadSuccess?: (result: any) => void
  onUploadError?: (error: any) => void
  maxFiles?: number
  resourceType?: 'image' | 'video' | 'raw'
  tags?: string[]
  className?: string
}

declare global {
  interface Window {
    cloudinary: any
  }
}

export default function CloudinaryUploadWidget({
  folder = 'aps-nashik',
  onUploadSuccess,
  onUploadError,
  maxFiles = 10,
  resourceType = 'image',
  tags = [],
  className = '',
}: CloudinaryUploadWidgetProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const widgetRef = useRef<any>(null)
  const cloudinaryRef = useRef<any>(null)

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ''

  useEffect(() => {
    // Load Cloudinary widget script
    const script = document.createElement('script')
    script.src = 'https://upload-widget.cloudinary.com/global/all.js'
    script.async = true
    script.onload = () => {
      if (window.cloudinary) {
        cloudinaryRef.current = window.cloudinary
      }
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const openUploadWidget = () => {
    if (!cloudinaryRef.current) {
      toast.error('Cloudinary widget is not loaded yet. Please wait a moment.')
      return
    }

    if (!cloudName) {
      toast.error('Cloudinary cloud name is not configured. Please check your environment variables.')
      return
    }

    setUploading(true)

    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default'
    
    const uploadOptions = {
      cloudName: cloudName,
      uploadPreset: uploadPreset, // Configure via NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET env variable
      sources: ['local', 'camera', 'url'],
      multiple: true,
      maxFiles: maxFiles,
      folder: folder,
      tags: tags.length > 0 ? tags : undefined,
      resourceType: resourceType,
      clientAllowedFormats: resourceType === 'image' ? ['jpg', 'jpeg', 'png', 'gif', 'webp'] : undefined,
      maxFileSize: 10000000, // 10MB
      showAdvancedOptions: true,
      cropping: resourceType === 'image',
      croppingAspectRatio: undefined, // Allow any aspect ratio
      croppingDefaultSelectionRatio: 0.9,
      styles: {
        palette: {
          window: '#FFFFFF',
          windowBorder: '#90A0B3',
          tabIcon: '#0078FF',
          menuIcons: '#5A616A',
          textDark: '#000000',
          textLight: '#FFFFFF',
          link: '#0078FF',
          action: '#FF620C',
          inactiveTabIcon: '#0E2F5A',
          error: '#F44235',
          inProgress: '#0078FF',
          complete: '#20B832',
          sourceBg: '#E4EBF1',
        },
        fonts: {
          default: null,
          "'Poppins', sans-serif": {
            url: 'https://fonts.googleapis.com/css?family=Poppins',
            active: true,
          },
        },
      },
    }

    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      uploadOptions,
      (error: any, result: any) => {
        setUploading(false)

        if (error) {
          console.error('Upload error:', error)
          toast.error(`Upload failed: ${error.message || 'Unknown error'}`)
          onUploadError?.(error)
          return
        }

        if (result && result.event === 'success') {
          const uploadedFile = {
            publicId: result.info.public_id,
            url: result.info.secure_url,
            width: result.info.width,
            height: result.info.height,
            format: result.info.format,
            bytes: result.info.bytes,
            folder: result.info.folder || folder,
            tags: result.info.tags || [],
            createdAt: new Date().toISOString(),
          }

          setUploadedFiles((prev) => [...prev, uploadedFile])
          toast.success('Image uploaded successfully!')
          onUploadSuccess?.(uploadedFile)
        }

        if (result && result.event === 'close') {
          setUploading(false)
        }

        if (result && result.event === 'batch-cancelled') {
          setUploading(false)
          toast('Upload cancelled')
        }
      }
    )

    widgetRef.current.open()
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ImageIcon className="w-5 h-5" />
            <span>Cloudinary Upload</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">
                Upload images to Cloudinary folder: <span className="font-medium text-text">{folder}</span>
              </p>
              {tags.length > 0 && (
                <p className="text-xs text-text-dim mt-1">
                  Tags: {tags.join(', ')}
                </p>
              )}
            </div>
            <Button
              onClick={openUploadWidget}
              disabled={uploading || !cloudName}
              className="flex items-center space-x-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload Images</span>
                </>
              )}
            </Button>
          </div>

          {!cloudName && (
            <div className="bg-warning/20 border border-warning/30 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-warning">Configuration Required</p>
                <p className="text-xs text-text mt-1">
                  Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in your environment variables.
                </p>
              </div>
            </div>
          )}

          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-text">
                Recently Uploaded ({uploadedFiles.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={file.publicId}
                    className="relative group border border-border/40 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-square bg-surface-2">
                      <img
                        src={file.url}
                        alt={file.publicId}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="p-2 bg-surface-1">
                      <p className="text-xs text-text-muted truncate" title={file.publicId}>
                        {file.publicId.split('/').pop()}
                      </p>
                      <p className="text-xs text-text-dim mt-1">
                        {(file.bytes / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
