const { Pool } = require('pg')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

async function createAdminUser() {
  const client = await pool.connect()
  
  try {
    console.log('Creating admin user...')
    
    const email = process.argv[2] || 'admin@apsnashik.com'
    const password = process.argv[3] || 'admin123456'
    const name = process.argv[4] || 'Admin User'
    
    // Check if admin already exists
    const existingUser = await client.query('SELECT id FROM admin_users WHERE email = $1', [email])
    
    if (existingUser.rows.length > 0) {
      console.log('Admin user already exists with this email.')
      return
    }
    
    // Hash password
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    
    // Create admin user
    const result = await client.query(
      'INSERT INTO admin_users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, passwordHash, name]
    )
    
    console.log('Admin user created successfully!')
    console.log('Email:', result.rows[0].email)
    console.log('Name:', result.rows[0].name)
    console.log('Password:', password)
    console.log('\nYou can now login with these credentials.')
    
  } catch (error) {
    console.error('Error creating admin user:', error)
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

// Run the script
createAdminUser()
  .then(() => {
    console.log('Admin user setup complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Admin user setup failed:', error)
    process.exit(1)
  })
