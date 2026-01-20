import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Use service role key for admin operations
const supabase = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

// Development mode credentials
const DEV_EMAIL = 'admin@apsnashik.com'
const DEV_PASSWORD = 'admin123456'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Development mode fallback (if Supabase not configured)
    if (!supabase || !supabaseUrl || !supabaseServiceKey) {
      if (email === DEV_EMAIL && password === DEV_PASSWORD) {
        return NextResponse.json({
          success: true,
          token: 'dev-token',
          user: {
            email: DEV_EMAIL,
            name: 'Admin User',
            role: 'admin'
          }
        })
      } else {
        return NextResponse.json(
          { error: 'Invalid credentials. For development mode, use: admin@apsnashik.com / admin123456' },
          { status: 401 }
        )
      }
    }

    // Get admin user from Supabase
    const { data: adminUser, error: fetchError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single()

    if (fetchError || !adminUser) {
      // Also check dev password as fallback
      if (email === DEV_EMAIL && password === DEV_PASSWORD) {
        return NextResponse.json({
          success: true,
          token: 'dev-token',
          user: {
            email: DEV_EMAIL,
            name: 'Admin User',
            role: 'admin'
          }
        })
      }
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    let isPasswordValid = false
    
    if (adminUser.password_hash) {
      try {
        isPasswordValid = await bcrypt.compare(password, adminUser.password_hash)
      } catch (compareError) {
        console.error('Error comparing passwords:', compareError)
        return NextResponse.json(
          { error: 'Error verifying password' },
          { status: 500 }
        )
      }
    }
    
    // If hash doesn't match, check if it's the dev password (for migration scenarios)
    if (!isPasswordValid) {
      if (email === DEV_EMAIL && password === DEV_PASSWORD) {
        isPasswordValid = true
      } else {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        )
      }
    }

    // Update last login time
    await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('email', email)

    // Generate a simple token (in production, use JWT or similar)
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')

    return NextResponse.json({
      success: true,
      token,
      user: {
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role
      }
    })
  } catch (error: any) {
    console.error('Error in auth:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
