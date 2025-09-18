const fs = require('fs')
const path = require('path')

console.log('🚀 APS Nashik Website - Quick Setup')
console.log('=====================================\n')

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  console.log('✅ .env.local file found')
} else {
  console.log('❌ .env.local file not found')
  console.log('\n📝 Creating .env.local template...')
  
  const envContent = `# Database Configuration
# Replace with your actual database connection string
DATABASE_URL=postgresql://username:password@localhost:5432/aps_nashik_db

# JWT Secret for admin authentication
# Generate a secure random string for production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Node Environment
NODE_ENV=development`

  fs.writeFileSync(envPath, envContent)
  console.log('✅ .env.local template created')
}

console.log('\n📋 Next Steps:')
console.log('1. Set up a PostgreSQL database:')
console.log('   Option A: Use a cloud database (Recommended)')
console.log('   - Neon: https://neon.tech (Free tier)')
console.log('   - Supabase: https://supabase.com (Free tier)')
console.log('   - Railway: https://railway.app (Free tier)')
console.log('')
console.log('   Option B: Install PostgreSQL locally')
console.log('   - Download from: https://www.postgresql.org/download/')
console.log('   - Or use Docker: docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres')
console.log('')
console.log('2. Update .env.local with your database connection string')
console.log('3. Run: npm run setup')
console.log('4. Run: npm run dev')
console.log('')
console.log('🌐 For Render deployment:')
console.log('1. Push your code to GitHub/GitLab/Bitbucket')
console.log('2. Create a PostgreSQL database on Render')
console.log('3. Set environment variables in Render dashboard')
console.log('4. Deploy!')
console.log('')
console.log('📖 Full setup guide: SETUP_GUIDE.md')
console.log('')
console.log('✨ Happy coding!')
