const fs = require('fs')
const path = require('path')

console.log('🚀 APS Nashik Backend Setup')
console.log('============================\n')

// Check if backend directory exists
const backendDir = path.join(process.cwd(), 'backend')
if (!fs.existsSync(backendDir)) {
  console.log('❌ Backend directory not found!')
  console.log('💡 Make sure you have the backend folder in your project root')
  process.exit(1)
}

console.log('✅ Backend directory found')

// Check if package.json exists in backend
const packageJsonPath = path.join(backendDir, 'package.json')
if (!fs.existsSync(packageJsonPath)) {
  console.log('❌ Backend package.json not found!')
  console.log('💡 Make sure the backend setup is complete')
  process.exit(1)
}

console.log('✅ Backend package.json found')

// Check if .env exists in backend
const envPath = path.join(backendDir, '.env')
if (!fs.existsSync(envPath)) {
  console.log('⚠️  Backend .env file not found')
  console.log('📝 Creating .env template...')
  
  const envContent = `# Backend Environment Variables
# Set these in your Render dashboard

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/aps_nashik_db

# JWT Secret for admin authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Node Environment
NODE_ENV=development

# Port (Render will set this automatically)
PORT=5000`

  fs.writeFileSync(envPath, envContent)
  console.log('✅ Backend .env template created')
} else {
  console.log('✅ Backend .env file found')
}

console.log('\n📋 Next Steps for Backend:')
console.log('1. Install dependencies:')
console.log('   cd backend && npm install')
console.log('')
console.log('2. Set up your database:')
console.log('   Option A: Use a cloud database (Recommended)')
console.log('   - Neon: https://neon.tech (Free tier)')
console.log('   - Supabase: https://supabase.com (Free tier)')
console.log('   - Railway: https://railway.app (Free tier)')
console.log('')
console.log('   Option B: Install PostgreSQL locally')
console.log('   - Download from: https://www.postgresql.org/download/')
console.log('   - Or use Docker: docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres')
console.log('')
console.log('3. Update backend/.env with your database connection string')
console.log('4. Start the backend server:')
console.log('   cd backend && npm run dev')
console.log('')
console.log('🌐 For Render deployment:')
console.log('1. Push backend code to a separate GitHub repository')
console.log('2. Create a PostgreSQL database on Render')
console.log('3. Deploy backend service to Render')
console.log('4. Set environment variables in Render dashboard')
console.log('')
console.log('📖 Full deployment guide: VERCEL_RENDER_DEPLOYMENT.md')
console.log('')
console.log('✨ Backend setup complete!')
