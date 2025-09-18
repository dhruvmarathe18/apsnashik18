import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

// GET /api/events - Get all events
export async function GET() {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM events ORDER BY date ASC')
    client.release()
    
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

// POST /api/events - Create new event
export async function POST(request: NextRequest) {
  try {
    const { title, date, description, category, status } = await request.json()
    
    const client = await pool.connect()
    const result = await client.query(
      'INSERT INTO events (title, date, description, category, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, date, description, category, status || 'upcoming']
    )
    client.release()
    
    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}

// PUT /api/events - Update event
export async function PUT(request: NextRequest) {
  try {
    const { id, title, date, description, category, status } = await request.json()
    
    const client = await pool.connect()
    const result = await client.query(
      'UPDATE events SET title = $1, date = $2, description = $3, category = $4, status = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
      [title, date, description, category, status, id]
    )
    client.release()
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating event:', error)
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
  }
}

// DELETE /api/events - Delete event
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
    }
    
    const client = await pool.connect()
    const result = await client.query('DELETE FROM events WHERE id = $1 RETURNING *', [id])
    client.release()
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Event deleted successfully' })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}
