'use client'

import { useState, useEffect } from 'react'
import { useCloudinaryMedia } from './useCloudinaryMedia'

export function useHeroImage() {
  const { media, loading, error } = useCloudinaryMedia({
    folder: 'aps-nashik/hero-images',
    maxResults: 10,
    autoFetch: true,
  })

  // Prioritize hero-main.jpg, then look for other hero images
  const heroImage = media.find(
    (img) => 
      img.id.toLowerCase().includes('hero-main') ||
      img.id.toLowerCase().endsWith('hero-main.jpg') ||
      img.id.toLowerCase().endsWith('/hero-main')
  ) || media.find(
    (img) => 
      img.tags?.includes('main') || 
      img.tags?.includes('primary') || 
      img.tags?.includes('hero') ||
      img.id.toLowerCase().includes('hero') ||
      img.id.toLowerCase().includes('main')
  ) || media[0]

  return {
    heroImage: heroImage ? (heroImage.large || heroImage.url) : null,
    heroImageId: heroImage ? heroImage.id : null,
    loading,
    error,
  }
}
