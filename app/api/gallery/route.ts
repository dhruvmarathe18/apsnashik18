import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

// GET /api/gallery - Get all gallery images
export async function GET() {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM gallery_images ORDER BY upload_date DESC')
    client.release()
    
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching gallery images:', error)
    return NextResponse.json({ error: 'Failed to fetch gallery images' }, { status: 500 })
  }
}

// POST /api/gallery - Create new gallery image
export async function POST(request: NextRequest) {
  try {
    const { title, category, src, alt } = await request.json()
    
    const client = await pool.connect()
    const result = await client.query(
      'INSERT INTO gallery_images (title, category, src, alt) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, category, src, alt]
    )
    client.release()
    
    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating gallery image:', error)
    return NextResponse.json({ error: 'Failed to create gallery image' }, { status: 500 })
  }
}

// PUT /api/gallery - Update gallery image
export async function PUT(request: NextRequest) {
  try {
    const { id, title, category, src, alt } = await request.json()
    
    const client = await pool.connect()
    const result = await client.query(
      'UPDATE gallery_images SET title = $1, category = $2, src = $3, alt = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [title, category, src, alt, id]
    )
    client.release()
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Gallery image not found' }, { status: 404 })
    }
    
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating gallery image:', error)
    return NextResponse.json({ error: 'Failed to update gallery image' }, { status: 500 })
  }
}

// DELETE /api/gallery - Delete gallery image
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 })
    }
    
    const client = await pool.connect()
    const result = await client.query('DELETE FROM gallery_images WHERE id = $1 RETURNING *', [id])
    client.release()
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Gallery image not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Gallery image deleted successfully' })
  } catch (error) {
    console.error('Error deleting gallery image:', error)
    return NextResponse.json({ error: 'Failed to delete gallery image' }, { status: 500 })
  }
}
