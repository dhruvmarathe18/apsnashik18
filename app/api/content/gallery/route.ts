import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'

const KEY = 'content/gallery.json'

async function readList(): Promise<any[]> {
  try {
    const res = await fetch(`https://blob.vercel-storage.com/${KEY}`, { cache: 'no-store' })
    if (!res.ok) throw new Error('Missing')
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


