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
    const { email, currentPassword, newPassword } = await request.json()

    if (!email || !currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Development mode fallback (if Supabase not configured)
    if (!supabase || !supabaseUrl || !supabaseServiceKey) {
      if (email === DEV_EMAIL && currentPassword === DEV_PASSWORD) {
        return NextResponse.json({ 
          success: true, 
          message: 'Password change simulated in development mode. Configure Supabase for actual password changes.',
          warning: 'Supabase not configured. Password not actually changed in database.'
        })
      } else {
        return NextResponse.json(
          { error: 'Supabase not configured. Please configure SUPABASE_SERVICE_ROLE_KEY environment variable. For development, use: admin@apsnashik.com / admin123456' },
          { status: 500 }
        )
      }
    }

    // Get admin user
    const { data: adminUser, error: fetchError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single()

    if (fetchError) {
      console.error('Error fetching admin user:', fetchError)
      return NextResponse.json(
        { error: `Failed to fetch admin user: ${fetchError.message}` },
        { status: 500 }
      )
    }

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Admin user not found' },
        { status: 404 }
      )
    }

    // Verify current password
    let isCurrentPasswordValid = false
    
    // If password_hash exists, verify it
    if (adminUser.password_hash) {
      try {
        isCurrentPasswordValid = await bcrypt.compare(
          currentPassword,
          adminUser.password_hash
        )
      } catch (compareError) {
        console.error('Error comparing passwords:', compareError)
        return NextResponse.json(
          { error: 'Error verifying password' },
          { status: 500 }
        )
      }
    }
    
    // If hash doesn't match or doesn't exist, check if it's the dev password
    if (!isCurrentPasswordValid) {
      const isDevPassword = email === DEV_EMAIL && currentPassword === DEV_PASSWORD
      if (isDevPassword) {
        // Allow password change even if hash doesn't match (for fixing corrupted/missing hashes)
        console.log('Dev password detected, allowing password change to update hash')
        isCurrentPasswordValid = true
      } else {
        console.error('Password mismatch. Hash exists:', !!adminUser.password_hash)
        return NextResponse.json(
          { error: 'Current password is incorrect. Please verify you are entering the correct current password.' },
          { status: 401 }
        )
      }
    }

    // Hash new password
    const saltRounds = 10
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds)

    // Update password
    const { error: updateError } = await supabase
      .from('admin_users')
      .update({ password_hash: newPasswordHash })
      .eq('email', email)

    if (updateError) {
      console.error('Error updating password:', updateError)
      return NextResponse.json(
        { error: `Failed to update password: ${updateError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: 'Password updated successfully' })
  } catch (error: any) {
    console.error('Error in change password:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
