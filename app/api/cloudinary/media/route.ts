import { NextRequest, NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary/config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const resourceType = searchParams.get('resource_type') || 'image'
    const folder = searchParams.get('folder') || ''
    const maxResults = parseInt(searchParams.get('max_results') || '50')
    const tag = searchParams.get('tag') || ''

    // Build query options
    const options: any = {
      resource_type: resourceType,
      max_results: maxResults,
      type: 'upload',
    }

    if (folder) {
      options.prefix = folder
    }

    if (tag) {
      options.tags = tag
    }

    // Fetch resources from Cloudinary
    const result = await cloudinary.search
      .expression(folder ? `folder:${folder}/*` : '*')
      .with_field('tags')
      .with_field('context')
      .max_results(maxResults)
      .execute()

    // Transform the results to a simpler format
    const resources = result.resources.map((resource: any) => ({
      id: resource.public_id,
      url: resource.secure_url,
      width: resource.width,
      height: resource.height,
      format: resource.format,
      bytes: resource.bytes,
      folder: resource.folder || '',
      tags: resource.tags || [],
      context: resource.context || {},
      createdAt: resource.created_at,
      // Generate optimized URLs
      thumbnail: cloudinary.url(resource.public_id, {
        width: 300,
        height: 300,
        crop: 'fill',
        quality: 'auto',
        fetch_format: 'auto',
      }),
      medium: cloudinary.url(resource.public_id, {
        width: 800,
        height: 600,
        crop: 'limit',
        quality: 'auto',
        fetch_format: 'auto',
      }),
      large: cloudinary.url(resource.public_id, {
        width: 1200,
        height: 900,
        crop: 'limit',
        quality: 'auto',
        fetch_format: 'auto',
      }),
    }))

    return NextResponse.json({
      success: true,
      resources,
      total: result.total_count,
    })
  } catch (error: any) {
    console.error('Cloudinary API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch media from Cloudinary',
      },
      { status: 500 }
    )
  }
}
