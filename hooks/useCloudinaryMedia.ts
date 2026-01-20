'use client'

import { useState, useEffect } from 'react'

export interface CloudinaryMedia {
  id: string
  url: string
  thumbnail: string
  medium: string
  large: string
  width: number
  height: number
  format: string
  bytes: number
  folder: string
  tags: string[]
  context: Record<string, any>
  createdAt: string
}

interface UseCloudinaryMediaOptions {
  folder?: string
  tag?: string
  resourceType?: 'image' | 'video' | 'raw'
  maxResults?: number
  autoFetch?: boolean
}

export function useCloudinaryMedia(options: UseCloudinaryMediaOptions = {}) {
  const {
    folder = '',
    tag = '',
    resourceType = 'image',
    maxResults = 50,
    autoFetch = true,
  } = options

  const [media, setMedia] = useState<CloudinaryMedia[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMedia = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        resource_type: resourceType,
        max_results: maxResults.toString(),
      })

      if (folder) {
        params.append('folder', folder)
      }

      if (tag) {
        params.append('tag', tag)
      }

      const response = await fetch(`/api/cloudinary/media?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setMedia(data.resources)
      } else {
        setError(data.error || 'Failed to fetch media')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch media')
      console.error('Error fetching Cloudinary media:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetchMedia()
    }
  }, [folder, tag, resourceType, maxResults, autoFetch])

  return {
    media,
    loading,
    error,
    refetch: fetchMedia,
  }
}
