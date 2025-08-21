import { NextResponse } from 'next/server'
import { put, list } from '@vercel/blob'

const KEY = 'content/gallery.json'

async function readList(): Promise<any[]> {
  try {
    console.log('readList - Starting to read from blob')
    const { blobs } = await list({ prefix: KEY, token: process.env.BLOB_READ_WRITE_TOKEN })
    console.log('readList - Found blobs:', blobs?.length || 0)
    
    if (!blobs || blobs.length === 0) {
      console.log('readList - No blobs found, returning empty array')
      return []
    }
    
    const latest = blobs.sort((a: any, b: any) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())[0]
    console.log('readList - Latest blob:', latest.url)
    
    const res = await fetch(latest.url, { cache: 'no-store' })
    console.log('readList - Fetch response status:', res.status)
    
    if (!res.ok) {
      console.log('readList - Response not ok, returning empty array')
      return []
    }
    
    const data = await res.json()
    console.log('readList - Parsed data length:', data?.length || 0)
    return data
  } catch (error) {
    console.error('readList - Error:', error)
    return []
  }
}

async function writeList(items: any[]) {
  try {
    const jsonString = JSON.stringify(items, null, 2)
    console.log('writeList - JSON string length:', jsonString.length)
    console.log('writeList - First few items:', items.slice(0, 2))
    
    const buffer = Buffer.from(jsonString, 'utf-8')
    console.log('writeList - Buffer size:', buffer.length)
    
    const result = await put(KEY, buffer, { access: 'public', token: process.env.BLOB_READ_WRITE_TOKEN, contentType: 'application/json' })
    console.log('writeList - Blob put result:', result)
    
    return result
  } catch (error) {
    console.error('writeList - Error:', error)
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
    
    await writeList(items)
    console.log('Gallery POST - Successfully wrote to blob')
    
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


