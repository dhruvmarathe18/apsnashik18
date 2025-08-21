import { NextResponse } from 'next/server'
import { generateUploadURL } from '@vercel/blob'

export const runtime = 'nodejs'

export async function POST() {
  try {
    const url = await generateUploadURL({
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: true,
      allowedContentTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
      maximumSizeInBytes: 10 * 1024 * 1024,
      contentType: 'image/*'
    })
    return NextResponse.json({ uploadUrl: url })
  } catch (error) {
    console.error('Blob upload URL error:', error)
    return NextResponse.json({ error: 'Failed to create upload URL' }, { status: 500 })
  }
}


