const { Pool } = require('pg')
const bcrypt = require('bcryptjs')
require('dotenv').config()

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.log('❌ DATABASE_URL not found!')
  console.log('💡 Please set up your database connection:')
  console.log('   1. Create a .env.local file in your project root')
  console.log('   2. Add: DATABASE_URL=postgresql://username:password@localhost:5432/aps_nashik_db')
  console.log('   3. Make sure PostgreSQL is running locally')
  console.log('   4. Or use a cloud database like Render, Supabase, or Neon')
  process.exit(1)
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

async function setup() {
  const client = await pool.connect()
  
  try {
    console.log('🚀 Setting up APS Nashik Website...')
    
    // 1. Initialize database tables
    console.log('📊 Creating database tables...')
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        description TEXT,
        category VARCHAR(100),
        status VARCHAR(20) DEFAULT 'upcoming',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS gallery_images (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        src VARCHAR(500) NOT NULL,
        alt VARCHAR(255),
        upload_date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS news_articles (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        publish_date DATE DEFAULT CURRENT_DATE,
        status VARCHAR(20) DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        subject VARCHAR(255),
        message TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'unread',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    console.log('✅ Database tables created successfully!')

    // 2. Insert sample data
    console.log('📝 Inserting sample data...')
    
    await client.query(`
      INSERT INTO events (title, date, description, category, status) VALUES
      ('Annual Sports Day', '2024-03-15', 'Annual sports competition for all students', 'Sports', 'upcoming'),
      ('Science Exhibition', '2024-02-20', 'Students showcase their science projects', 'Academic', 'completed'),
      ('Cultural Festival', '2024-04-10', 'Celebration of arts, music, dance, and cultural diversity', 'Cultural', 'upcoming')
      ON CONFLICT DO NOTHING
    `)

    await client.query(`
      INSERT INTO gallery_images (title, category, src, alt) VALUES
      ('Sports Day Celebration', 'School Events', '/images/kids.jpg', 'Students during sports day'),
      ('Classroom Activity', 'Classroom Activities', '/images/teacher-1.jpg', 'Students in classroom'),
      ('School Infrastructure', 'Infrastructure', '/images/infra.jpg', 'School building and facilities'),
      ('Students in Library', 'Classroom Activities', '/images/teacher-2.jpg', 'Students studying in library')
      ON CONFLICT DO NOTHING
    `)

    await client.query(`
      INSERT INTO news_articles (title, content, publish_date, status) VALUES
      ('School Achieves 100% Board Results', 'Our school has achieved excellent results in the recent board examinations with 100% pass rate and outstanding performance by our students.', '2024-01-20', 'published'),
      ('New Computer Lab Inauguration', 'We are excited to announce the inauguration of our new state-of-the-art computer laboratory equipped with latest technology and software.', '2024-01-25', 'published'),
      ('Annual Sports Meet Success', 'The annual sports meet was a grand success with participation from all students and excellent performances in various sports events.', '2024-01-30', 'published')
      ON CONFLICT DO NOTHING
    `)

    console.log('✅ Sample data inserted successfully!')

    // 3. Create default admin user
    console.log('👤 Creating default admin user...')
    
    const email = 'admin@apsnashik.com'
    const password = 'admin123456'
    const name = 'Admin User'
    
    // Check if admin already exists
    const existingUser = await client.query('SELECT id FROM admin_users WHERE email = $1', [email])
    
    if (existingUser.rows.length === 0) {
      // Hash password
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(password, saltRounds)
      
      // Create admin user
      await client.query(
        'INSERT INTO admin_users (email, password_hash, name) VALUES ($1, $2, $3)',
        [email, passwordHash, name]
      )
      
      console.log('✅ Admin user created successfully!')
      console.log('📧 Email:', email)
      console.log('🔑 Password:', password)
    } else {
      console.log('ℹ️  Admin user already exists')
    }

    console.log('\n🎉 Setup completed successfully!')
    console.log('\n📋 Next steps:')
    console.log('1. Start your development server: npm run dev')
    console.log('2. Visit http://localhost:3000/admin/login')
    console.log('3. Login with the admin credentials above')
    console.log('4. Start managing your school website!')
    
  } catch (error) {
    console.error('❌ Setup failed:', error)
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

// Run the setup
setup()
  .then(() => {
    console.log('\n✨ Setup complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Setup failed:', error)
    process.exit(1)
  })
