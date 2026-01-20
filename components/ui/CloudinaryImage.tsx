'use client'

import { useState } from 'react'
import Image from 'next/image'
import { getCloudinaryUrl, isCloudinaryUrl } from '@/lib/utils/cloudinary'
import { CloudinaryImageOptions } from '@/lib/utils/cloudinary'

interface CloudinaryImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  cloudinaryOptions?: CloudinaryImageOptions
  fallbackSrc?: string
  onError?: () => void
}

export default function CloudinaryImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  cloudinaryOptions = {},
  fallbackSrc,
  onError,
}: CloudinaryImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  // Determine the final image URL
  const getImageUrl = () => {
    if (hasError && fallbackSrc) {
      return fallbackSrc
    }

    // If it's already a Cloudinary URL, use it as is (might already be optimized)
    if (isCloudinaryUrl(src)) {
      return src
    }

    // If it's a local path (starts with /), use it as is
    if (src.startsWith('/')) {
      return imgSrc
    }

    // If it's an external URL (starts with http), use it as is
    if (src.startsWith('http')) {
      return imgSrc
    }

    // Otherwise, assume it's a Cloudinary public_id and generate URL
    return getCloudinaryUrl(src, {
      width: width || cloudinaryOptions.width,
      height: height || cloudinaryOptions.height,
      ...cloudinaryOptions,
    })
  }

  const handleError = () => {
    if (fallbackSrc && !hasError) {
      setHasError(true)
      setImgSrc(fallbackSrc)
    }
    onError?.()
  }

  const imageUrl = getImageUrl()

  if (fill) {
    return (
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className={className}
        priority={priority}
        sizes={sizes}
        onError={handleError}
        style={{ objectFit: 'cover' }}
        unoptimized={isCloudinaryUrl(imageUrl) ? false : true}
      />
    )
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width || 800}
      height={height || 600}
      className={className}
      priority={priority}
      sizes={sizes}
      onError={handleError}
      unoptimized={isCloudinaryUrl(imageUrl) ? false : true}
    />
  )
}
