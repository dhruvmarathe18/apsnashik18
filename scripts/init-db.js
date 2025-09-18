const { Pool } = require('pg')
require('dotenv').config()

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.log('⚠️  DATABASE_URL not found. Skipping database initialization.')
  console.log('💡 To set up the database:')
  console.log('   1. Install PostgreSQL locally or use a cloud database')
  console.log('   2. Set DATABASE_URL in your .env.local file')
  console.log('   3. Run: npm run setup')
  process.exit(0)
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

async function initializeDatabase() {
  let client
  try {
    client = await pool.connect()
    console.log('Initializing database...')
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    console.log('💡 Make sure your DATABASE_URL is correct and the database is running')
    process.exit(1)
  }
  
  try {
    
    // Create events table
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

    // Create gallery_images table
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

    // Create news_articles table
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

    // Create admin_users table
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

    // Create contact_messages table
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

    // Insert sample data
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

    console.log('Database initialized successfully!')
    console.log('Tables created: events, gallery_images, news_articles, admin_users, contact_messages')
    console.log('Sample data inserted successfully!')
    
  } catch (error) {
    console.error('Error initializing database:', error)
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

// Run the initialization
initializeDatabase()
  .then(() => {
    console.log('Database setup complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Database setup failed:', error)
    process.exit(1)
  })
