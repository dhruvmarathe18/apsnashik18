/**
 * Cloudinary utility functions for image optimization and URL generation
 */

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ''

export interface CloudinaryImageOptions {
  width?: number
  height?: number
  crop?: 'fill' | 'fit' | 'limit' | 'scale' | 'thumb' | 'pad'
  quality?: 'auto' | number
  format?: 'auto' | 'webp' | 'jpg' | 'png'
  gravity?: string
  radius?: number
  effect?: string
  overlay?: string
}

/**
 * Generate optimized Cloudinary image URL
 */
export function getCloudinaryUrl(
  publicId: string,
  options: CloudinaryImageOptions = {}
): string {
  if (!CLOUDINARY_CLOUD_NAME) {
    console.warn('Cloudinary cloud name not configured')
    return publicId
  }

  const {
    width,
    height,
    crop = 'limit',
    quality = 'auto',
    format = 'auto',
    gravity,
    radius,
    effect,
    overlay,
  } = options

  let url = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`

  // Add transformations
  const transformations: string[] = []

  if (width || height) {
    const size = width && height ? `${width}x${height}` : width ? `w_${width}` : `h_${height}`
    transformations.push(size)
  }

  if (crop) {
    transformations.push(`c_${crop}`)
  }

  if (quality) {
    transformations.push(`q_${quality}`)
  }

  if (format) {
    transformations.push(`f_${format}`)
  }

  if (gravity) {
    transformations.push(`g_${gravity}`)
  }

  if (radius) {
    transformations.push(`r_${radius}`)
  }

  if (effect) {
    transformations.push(`e_${effect}`)
  }

  if (overlay) {
    transformations.push(`l_${overlay}`)
  }

  if (transformations.length > 0) {
    url += `/${transformations.join(',')}`
  }

  url += `/${publicId}`

  return url
}

/**
 * Generate responsive image srcset
 */
export function getCloudinarySrcSet(
  publicId: string,
  sizes: number[] = [400, 800, 1200, 1600]
): string {
  return sizes
    .map((size) => `${getCloudinaryUrl(publicId, { width: size })} ${size}w`)
    .join(', ')
}

/**
 * Get optimized thumbnail URL
 */
export function getThumbnailUrl(publicId: string, size: number = 300): string {
  return getCloudinaryUrl(publicId, {
    width: size,
    height: size,
    crop: 'fill',
    quality: 'auto',
  })
}

/**
 * Get optimized medium size URL
 */
export function getMediumUrl(publicId: string, width: number = 800): string {
  return getCloudinaryUrl(publicId, {
    width,
    crop: 'limit',
    quality: 'auto',
  })
}

/**
 * Get optimized large size URL
 */
export function getLargeUrl(publicId: string, width: number = 1200): string {
  return getCloudinaryUrl(publicId, {
    width,
    crop: 'limit',
    quality: 'auto',
  })
}

/**
 * Check if URL is a Cloudinary URL
 */
export function isCloudinaryUrl(url: string): boolean {
  return url.includes('cloudinary.com') || url.includes('res.cloudinary.com')
}

/**
 * Extract public ID from Cloudinary URL
 */
export function extractPublicId(url: string): string {
  if (!isCloudinaryUrl(url)) {
    return url
  }

  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/')
    const uploadIndex = pathParts.indexOf('upload')
    
    if (uploadIndex !== -1 && pathParts.length > uploadIndex + 2) {
      // Get everything after the version or transformation
      const publicIdParts = pathParts.slice(uploadIndex + 2)
      return publicIdParts.join('/').replace(/\.[^/.]+$/, '')
    }
    
    return url
  } catch {
    return url
  }
}
