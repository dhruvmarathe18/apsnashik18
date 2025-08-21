import { NextResponse } from 'next/server'
import { put, list } from '@vercel/blob'

const KEY = 'content/gallery.json'

async function readList(): Promise<any[]> {
  try {
    console.log('readList - Starting to read from blob')
    console.log('readList - Looking for prefix:', KEY)
    console.log('readList - Token present:', process.env.BLOB_READ_WRITE_TOKEN ? 'YES' : 'NO')
    
    const { blobs } = await list({ prefix: KEY, token: process.env.BLOB_READ_WRITE_TOKEN })
    console.log('readList - Found blobs:', blobs?.length || 0)
    
    if (blobs && blobs.length > 0) {
      console.log('readList - All blob paths:', blobs.map(b => b.pathname))
    }
    
    if (!blobs || blobs.length === 0) {
      console.log('readList - No blobs found, returning empty array')
      return []
    }
    
    const latest = blobs.sort((a: any, b: any) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())[0]
    console.log('readList - Latest blob details:', {
      pathname: latest.pathname,
      url: latest.url,
      uploadedAt: latest.uploadedAt,
      size: latest.size
    })
    
    console.log('readList - Fetching from URL:', latest.url)
    const res = await fetch(latest.url, { cache: 'no-store' })
    console.log('readList - Fetch response status:', res.status)
    console.log('readList - Fetch response headers:', Object.fromEntries(res.headers.entries()))
    
    if (!res.ok) {
      console.log('readList - Response not ok, returning empty array')
      const errorText = await res.text()
      console.log('readList - Error response body:', errorText)
      return []
    }
    
    const data = await res.json()
    console.log('readList - Parsed data length:', data?.length || 0)
    console.log('readList - Data preview:', data?.slice(0, 2))
    return data
  } catch (error) {
    console.error('readList - Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack',
      errorType: error?.constructor?.name
    })
    return []
  }
}

async function writeList(items: any[]) {
  try {
    console.log('writeList - Starting with', items.length, 'items')
    
    const jsonString = JSON.stringify(items, null, 2)
    console.log('writeList - JSON string length:', jsonString.length)
    console.log('writeList - First few items:', items.slice(0, 2))
    console.log('writeList - JSON preview:', jsonString.substring(0, 200) + '...')
    
    // Create a ReadableStream from the JSON string (this is what Vercel Blob expects)
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder()
        controller.enqueue(encoder.encode(jsonString))
        controller.close()
      }
    })
    
    console.log('writeList - Created ReadableStream')
    console.log('writeList - About to call put with token:', process.env.BLOB_READ_WRITE_TOKEN ? 'TOKEN_PRESENT' : 'NO_TOKEN')
    
    const result = await put(KEY, stream, { 
      access: 'public', 
      token: process.env.BLOB_READ_WRITE_TOKEN, 
      contentType: 'application/json' 
    })
    
    console.log('writeList - Blob put result:', result)
    console.log('writeList - Successfully wrote to blob')
    
    return result
  } catch (error) {
    console.error('writeList - Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack',
      errorType: error?.constructor?.name
    })
    throw error
  }
}

export async function GET() {
  const items = await readList()
  return NextResponse.json(items)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Gallery POST - Received body:', body)
    
    const items = await readList()
    console.log('Gallery POST - Current items:', items)
    
    const newItem = { ...body, id: Date.now().toString(), uploadDate: new Date().toISOString().split('T')[0] }
    console.log('Gallery POST - New item:', newItem)
    
    items.unshift(newItem)
    console.log('Gallery POST - Updated items array:', items)
    
    console.log('Gallery POST - About to call writeList...')
    const writeResult = await writeList(items)
    console.log('Gallery POST - writeList result:', writeResult)
    console.log('Gallery POST - Successfully wrote to blob')
    
    // Verify the data was actually saved by reading it back
    console.log('Gallery POST - Verifying data was saved...')
    const verifyItems = await readList()
    console.log('Gallery POST - Verification read result:', verifyItems)
    
    return NextResponse.json(items)
  } catch (error) {
    console.error('Gallery POST - Error:', error)
    return NextResponse.json({ error: 'Failed to save image' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const items = await readList()
  const next = items.filter((i) => i.id !== id)
  await writeList(next)
  return NextResponse.json(next)
}


