# Complete Setup Guide - Vercel + Supabase

This document provides a complete step-by-step guide to set up your School Management System with Vercel (frontend) and Supabase (backend).

## 🎯 Overview

- **Frontend**: Next.js deployed on Vercel
- **Backend**: Supabase (PostgreSQL database + API)
- **Storage**: Supabase database (with localStorage fallback for development)

## 📋 Prerequisites

- Node.js 18+ installed
- Git installed
- GitHub account
- Supabase account (free tier available)
- Vercel account (free tier available)

## 🚀 Quick Start

### Part 1: Supabase Setup (Backend)

1. **Create Supabase Project**
   - Go to https://app.supabase.com
   - Click "New Project"
   - Fill in details and create project
   - Wait 1-2 minutes for setup

2. **Run Database Migration**
   - In Supabase dashboard → SQL Editor
   - Open `supabase/migrations/001_initial_schema.sql`
   - Copy entire file content
   - Paste in SQL Editor and click "Run"
   - Verify success message

3. **Get Credentials**
   - Go to Settings → API
   - Copy:
     - Project URL (e.g., `https://xxxxx.supabase.co`)
     - anon/public key (starts with `eyJ...`)

4. **Configure Environment Variables**
   - Create `.env.local` file in project root:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```
   - Replace with your actual values

5. **Test Locally**
   ```bash
   npm run dev
   ```
   - Visit http://localhost:3001/admin/login
   - Login: `admin@apsnashik.com` / `admin123456`
   - Add a student or transaction
   - Verify in Supabase Table Editor

### Part 2: Vercel Deployment (Frontend)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Sign up/Login with GitHub
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure:
     - Framework: Next.js (auto-detected)
     - Build Command: `npm run build`
     - Output Directory: `.next`

3. **Add Environment Variables in Vercel**
   - In project settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase key
   - Select: Production, Preview, Development

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app is live! 🎉

## 📁 Project Structure

```
apsnashik18/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── admin/            # Admin components
│   └── ui/               # UI components
├── contexts/             # React contexts
│   ├── SchoolContext.tsx # Main data context
│   └── TransportContext.tsx
├── lib/
│   ├── supabase/         # Supabase integration
│   │   ├── client.ts     # Supabase client
│   │   ├── services.ts   # Database services
│   │   └── types.ts      # TypeScript types
│   └── utils/            # Utility functions
├── supabase/
│   └── migrations/       # Database migrations
├── types/                # TypeScript types
└── .env.local           # Environment variables (not in git)
```

## 🔧 Configuration Files

### Environment Variables (`.env.local`)

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Schema

The migration creates 4 main tables:
- `transactions` - All financial transactions
- `students` - Student records
- `fee_plans` - Fee structures
- `settings` - Application settings

## 🔐 Security Notes

### Current Setup (Development)
- Public read/write access enabled
- Suitable for development/testing
- **NOT recommended for production**

### Production Recommendations
1. **Enable Authentication**:
   - Implement Supabase Auth
   - Update RLS policies to require authentication

2. **Secure RLS Policies**:
   - Remove public access policies
   - Add user-specific policies
   - Implement role-based access

3. **Environment Variables**:
   - Never commit `.env.local`
   - Use Vercel environment variables
   - Rotate keys regularly

## 📊 Database Operations

### How It Works

1. **Supabase First**: App tries to use Supabase
2. **Fallback**: If Supabase not configured, uses localStorage
3. **Automatic Sync**: Data syncs automatically

### Services Available

- `transactionService` - CRUD for transactions
- `studentService` - CRUD for students
- `feePlanService` - CRUD for fee plans
- `settingsService` - Get/Update settings

## 🧪 Testing

### Local Testing
```bash
# Start dev server
npm run dev

# Test admin panel
# Visit http://localhost:3001/admin/login
# Login: admin@apsnashik.com / admin123456
```

### Production Testing
1. Deploy to Vercel
2. Visit your Vercel URL
3. Test all features
4. Verify data in Supabase dashboard

## 🐛 Troubleshooting

### Issue: "Supabase environment variables are not set"
**Solution**: 
- Check `.env.local` exists
- Verify variable names are correct
- Restart dev server

### Issue: "Error fetching data"
**Solution**:
- Verify migration ran successfully
- Check Supabase project is active
- Verify credentials are correct
- Check browser console for errors

### Issue: Build fails on Vercel
**Solution**:
- Check environment variables are set
- Verify build logs
- Check for TypeScript errors
- Ensure all dependencies are in package.json

### Issue: Data not saving
**Solution**:
- Check Supabase RLS policies
- Verify network tab for API errors
- Check Supabase logs
- Verify table structure matches migration

## 📚 Additional Resources

- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Detailed Setup**: See `SUPABASE_SETUP.md` and `VERCEL_DEPLOYMENT.md`

## ✅ Checklist

- [ ] Supabase project created
- [ ] Database migration run successfully
- [ ] Environment variables configured
- [ ] Local testing successful
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables added in Vercel
- [ ] Deployment successful
- [ ] Production testing completed

## 🎉 You're All Set!

Your School Management System is now:
- ✅ Connected to Supabase database
- ✅ Deployed on Vercel
- ✅ Ready for production use

**Next Steps**:
1. Customize settings in admin panel
2. Add your school's data
3. Set up authentication (recommended)
4. Configure custom domain (optional)

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Review Supabase/Vercel docs
3. Check browser console for errors
4. Review Supabase logs

---

**Happy Managing! 🎓**
