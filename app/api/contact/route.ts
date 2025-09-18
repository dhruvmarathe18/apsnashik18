import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

// POST /api/contact - Submit contact form
export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await request.json()
    
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })
    }
    
    const client = await pool.connect()
    const result = await client.query(
      'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, phone, subject, message]
    )
    client.release()
    
    return NextResponse.json({
      message: 'Contact message submitted successfully',
      id: result.rows[0].id
    }, { status: 201 })
  } catch (error) {
    console.error('Error submitting contact message:', error)
    return NextResponse.json({ error: 'Failed to submit contact message' }, { status: 500 })
  }
}

// GET /api/contact - Get all contact messages (admin only)
export async function GET(request: NextRequest) {
  try {
    // In a real app, you'd verify admin authentication here
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM contact_messages ORDER BY created_at DESC')
    client.release()
    
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching contact messages:', error)
    return NextResponse.json({ error: 'Failed to fetch contact messages' }, { status: 500 })
  }
}
