import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

// GET /api/news - Get all news articles
export async function GET() {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM news_articles ORDER BY publish_date DESC')
    client.release()
    
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching news articles:', error)
    return NextResponse.json({ error: 'Failed to fetch news articles' }, { status: 500 })
  }
}

// POST /api/news - Create new news article
export async function POST(request: NextRequest) {
  try {
    const { title, content, publish_date, status } = await request.json()
    
    const client = await pool.connect()
    const result = await client.query(
      'INSERT INTO news_articles (title, content, publish_date, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, content, publish_date, status || 'draft']
    )
    client.release()
    
    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating news article:', error)
    return NextResponse.json({ error: 'Failed to create news article' }, { status: 500 })
  }
}

// PUT /api/news - Update news article
export async function PUT(request: NextRequest) {
  try {
    const { id, title, content, publish_date, status } = await request.json()
    
    const client = await pool.connect()
    const result = await client.query(
      'UPDATE news_articles SET title = $1, content = $2, publish_date = $3, status = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [title, content, publish_date, status, id]
    )
    client.release()
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'News article not found' }, { status: 404 })
    }
    
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating news article:', error)
    return NextResponse.json({ error: 'Failed to update news article' }, { status: 500 })
  }
}

// DELETE /api/news - Delete news article
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 })
    }
    
    const client = await pool.connect()
    const result = await client.query('DELETE FROM news_articles WHERE id = $1 RETURNING *', [id])
    client.release()
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'News article not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'News article deleted successfully' })
  } catch (error) {
    console.error('Error deleting news article:', error)
    return NextResponse.json({ error: 'Failed to delete news article' }, { status: 500 })
  }
}
