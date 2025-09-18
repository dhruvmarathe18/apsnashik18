import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '@/lib/database'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// POST /api/admin/auth/login - Admin login
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }
    
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM admin_users WHERE email = $1', [email])
    client.release()
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    
    const user = result.rows[0]
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    )
    
    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })
  } catch (error) {
    console.error('Error during login:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}

// POST /api/admin/auth/register - Admin registration (for initial setup)
export async function PUT(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()
    
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Email, password, and name are required' }, { status: 400 })
    }
    
    // Check if admin already exists
    const client = await pool.connect()
    const existingUser = await client.query('SELECT id FROM admin_users WHERE email = $1', [email])
    
    if (existingUser.rows.length > 0) {
      client.release()
      return NextResponse.json({ error: 'Admin user already exists' }, { status: 400 })
    }
    
    // Hash password
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    
    // Create admin user
    const result = await client.query(
      'INSERT INTO admin_users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, passwordHash, name]
    )
    client.release()
    
    return NextResponse.json({
      message: 'Admin user created successfully',
      user: result.rows[0]
    }, { status: 201 })
  } catch (error) {
    console.error('Error during registration:', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}

// GET /api/admin/auth/verify - Verify token
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }
    
    const token = authHeader.substring(7)
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      
      // Verify user still exists in database
      const client = await pool.connect()
      const result = await client.query('SELECT id, email, name FROM admin_users WHERE id = $1', [decoded.userId])
      client.release()
      
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 401 })
      }
      
      return NextResponse.json({
        valid: true,
        user: result.rows[0]
      })
    } catch (jwtError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
  } catch (error) {
    console.error('Error verifying token:', error)
    return NextResponse.json({ error: 'Token verification failed' }, { status: 500 })
  }
}
