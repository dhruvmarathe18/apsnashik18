import { NextResponse } from 'next/server'
import { put, list } from '@vercel/blob'

const KEY = 'content/gallery.json'

async function readList(): Promise<any[]> {
  try {
    const { blobs } = await list({ prefix: KEY, token: process.env.BLOB_READ_WRITE_TOKEN })
    if (!blobs || blobs.length === 0) return []
    const latest = blobs.sort((a: any, b: any) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())[0]
    const res = await fetch(latest.url, { cache: 'no-store' })
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

async function writeList(items: any[]) {
  const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' })
  await put(KEY, blob, { access: 'public', token: process.env.BLOB_READ_WRITE_TOKEN, contentType: 'application/json' })
}

export async function GET() {
  const items = await readList()
  return NextResponse.json(items)
}

export async function POST(request: Request) {
  const body = await request.json()
  const items = await readList()
  const newItem = { ...body, id: Date.now().toString(), uploadDate: new Date().toISOString().split('T')[0] }
  items.unshift(newItem)
  await writeList(items)
  return NextResponse.json(items)
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


