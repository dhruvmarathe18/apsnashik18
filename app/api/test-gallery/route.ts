import { NextResponse } from 'next/server'
import { list } from '@vercel/blob'

export async function GET() {
  try {
    const { blobs } = await list({ 
      prefix: 'content/', 
      token: process.env.BLOB_READ_WRITE_TOKEN 
    })
    
    const galleryBlobs = blobs.filter(blob => blob.pathname.startsWith('content/gallery.json'))
    
    return NextResponse.json({
      success: true,
      totalBlobs: blobs.length,
      galleryBlobs: galleryBlobs.length,
      allBlobs: blobs.map(b => ({
        pathname: b.pathname,
        uploadedAt: b.uploadedAt,
        size: b.size
      })),
      galleryBlobDetails: galleryBlobs.map(b => ({
        pathname: b.pathname,
        uploadedAt: b.uploadedAt,
        size: b.size,
        url: b.url
      }))
    })
  } catch (error) {
    console.error('Test gallery error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
