# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Set Up Supabase (2 minutes)

1. Create account at https://supabase.com
2. Create new project
3. Go to SQL Editor → Run migration from `supabase/migrations/001_initial_schema.sql`
4. Copy your Project URL and anon key from Settings → API

### Step 2: Configure Environment (1 minute)

Create `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### Step 3: Test Locally (1 minute)

```bash
npm run dev
```

Visit http://localhost:3001/admin/login
- Email: `admin@apsnashik.com`
- Password: `admin123456`

### Step 4: Deploy to Vercel (1 minute)

1. Push code to GitHub
2. Go to https://vercel.com
3. Import repository
4. Add environment variables
5. Deploy!

## 📖 Detailed Guides

- **Complete Setup**: See `SETUP_COMPLETE.md`
- **Supabase Setup**: See `SUPABASE_SETUP.md`
- **Vercel Deployment**: See `VERCEL_DEPLOYMENT.md`

## ✅ What's Included

- ✅ Supabase database integration
- ✅ Automatic localStorage fallback
- ✅ Full CRUD operations
- ✅ Type-safe database queries
- ✅ Ready for Vercel deployment

## 🎯 Next Steps

1. Run migration in Supabase
2. Add environment variables
3. Test locally
4. Deploy to Vercel
5. Start managing your school!

---

**Need Help?** Check the detailed guides or troubleshooting sections.
