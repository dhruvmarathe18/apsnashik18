# Supabase Setup Guide

This guide will help you set up Supabase as your backend database for the School Management System.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Node.js and npm installed
- Git installed (for deployment)

## Step 1: Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in the project details:
   - **Name**: `aps-nashik-school` (or your preferred name)
   - **Database Password**: Choose a strong password (save it securely)
   - **Region**: Choose the region closest to your users
   - **Pricing Plan**: Free tier is sufficient for development
4. Click **"Create new project"**
5. Wait for the project to be created (takes 1-2 minutes)

## Step 2: Run Database Migration

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Open the file `supabase/migrations/001_initial_schema.sql` from this project
4. Copy the entire contents of the file
5. Paste it into the SQL Editor
6. Click **"Run"** (or press Ctrl+Enter)
7. Wait for the migration to complete (should see "Success" message)

This will create:
- `transactions` table
- `students` table
- `fee_plans` table
- `settings` table
- Indexes for performance
- Row Level Security (RLS) policies

## Step 3: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API** (left sidebar)
2. You'll see:
   - **Project URL**: Copy this (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key**: Copy this (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## Step 4: Configure Environment Variables

1. In your project root, create a file named `.env.local`:
   ```bash
   # Copy from .env.local.example
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Replace the placeholder values with your actual Supabase credentials

## Step 5: Test the Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your browser and go to `http://localhost:3001/admin/login`

3. Login with:
   - Email: `admin@apsnashik.com`
   - Password: `admin123456`

4. Try adding a student or transaction - it should save to Supabase!

5. Verify in Supabase:
   - Go to **Table Editor** in Supabase dashboard
   - You should see your data in the `students` or `transactions` table

## Step 6: Configure Row Level Security (RLS)

The migration creates public access policies. For production, you should:

1. Go to **Authentication** → **Policies** in Supabase dashboard
2. Review and adjust policies based on your security requirements
3. Consider implementing authentication if needed

**Current Setup**: The database allows public read/write access. This is fine for development but should be secured for production.

## Step 7: Deploy to Vercel

### 7.1 Prepare for Deployment

1. Make sure your `.env.local` is in `.gitignore` (it should be by default)
2. Commit your changes:
   ```bash
   git add .
   git commit -m "Add Supabase integration"
   ```

### 7.2 Deploy to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Sign up/Login with your GitHub account
3. Click **"Add New Project"**
4. Import your GitHub repository
5. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

6. **Add Environment Variables**:
   - Click **"Environment Variables"**
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase project URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon key
   - Make sure to select **Production**, **Preview**, and **Development** environments

7. Click **"Deploy"**

8. Wait for deployment to complete (2-3 minutes)

9. Your app will be live at `https://your-project.vercel.app`

## Step 8: Verify Production Deployment

1. Visit your Vercel deployment URL
2. Test the admin panel functionality
3. Check Supabase dashboard to verify data is being saved

## Troubleshooting

### Issue: "Supabase environment variables are not set"
- **Solution**: Make sure `.env.local` exists and has correct values
- Restart your dev server after adding environment variables

### Issue: "Error fetching transactions" or similar
- **Solution**: Check that:
  1. Migration was run successfully
  2. Environment variables are correct
  3. Supabase project is active (not paused)

### Issue: "Row Level Security policy violation"
- **Solution**: The migration includes public access policies. If you see this error:
  1. Go to Supabase dashboard → **Authentication** → **Policies**
  2. Check that policies are enabled for your tables
  3. Verify the policies allow the operations you're trying to perform

### Issue: Data not syncing
- **Solution**: The app falls back to localStorage if Supabase is not configured
- Check browser console for errors
- Verify Supabase credentials are correct

## Database Schema Overview

### Tables Created:

1. **transactions**: All financial transactions (fees, expenses, income, salaries)
2. **students**: Student records and information
3. **fee_plans**: Fee structure for each student
4. **settings**: Application settings (single row)

### Indexes Created:

- Transactions: `date`, `type`, `student_id`, `admission_no`
- Students: `admission_no`, `class_name`, `status`
- Fee Plans: `student_id`

## Next Steps

1. **Set up Authentication** (optional):
   - Implement Supabase Auth for user authentication
   - Update RLS policies to use authenticated users

2. **Backup Strategy**:
   - Set up automated backups in Supabase dashboard
   - Export data regularly

3. **Monitoring**:
   - Use Supabase dashboard to monitor database usage
   - Set up alerts for errors

4. **Performance**:
   - Monitor query performance
   - Add additional indexes if needed

## Support

- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
