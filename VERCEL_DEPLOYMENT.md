# Vercel Deployment Guide

This guide will help you deploy your School Management System to Vercel.

## Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- Supabase project set up (see `SUPABASE_SETUP.md`)

## Step 1: Push Code to GitHub

1. Initialize git repository (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Name it (e.g., `aps-nashik-school`)
   - Don't initialize with README
   - Click **"Create repository"**

3. Push your code:
   ```bash
   git remote add origin https://github.com/yourusername/aps-nashik-school.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [https://vercel.com](https://vercel.com)
2. Sign up/Login (use GitHub account for easy integration)
3. Click **"Add New Project"**
4. Import your GitHub repository:
   - Select the repository you just created
   - Click **"Import"**

5. Configure Project Settings:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

6. **Add Environment Variables**:
   - Click **"Environment Variables"** section
   - Add the following:
     ```
     NEXT_PUBLIC_SUPABASE_URL = your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key
     ```
   - Select all environments: **Production**, **Preview**, **Development**

7. Click **"Deploy"**

8. Wait for deployment (2-3 minutes)

9. Your app will be live at `https://your-project.vercel.app`

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - Link to existing project or create new
   - Set environment variables when prompted

5. For production deployment:
   ```bash
   vercel --prod
   ```

## Step 3: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain (e.g., `admin.apsnashik.com`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (can take up to 48 hours)

## Step 4: Verify Deployment

1. Visit your Vercel deployment URL
2. Test the admin panel:
   - Go to `/admin/login`
   - Login with credentials
   - Try adding a student or transaction
   - Verify data saves to Supabase

## Step 5: Set Up Continuous Deployment

Vercel automatically deploys on every push to your main branch:

1. Make changes to your code
2. Commit and push:
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```
3. Vercel will automatically:
   - Build your project
   - Run tests (if configured)
   - Deploy to production

## Environment Variables

### Required Variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### Adding/Updating Variables:

1. Go to Vercel dashboard → Your project → **Settings** → **Environment Variables**
2. Add or edit variables
3. Redeploy for changes to take effect

## Build Settings

Vercel auto-detects Next.js projects. Default settings:

- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

These should work out of the box. No changes needed unless you have custom requirements.

## Troubleshooting

### Build Fails

1. Check build logs in Vercel dashboard
2. Common issues:
   - Missing environment variables
   - TypeScript errors
   - Missing dependencies

### Environment Variables Not Working

1. Make sure variables are prefixed with `NEXT_PUBLIC_` for client-side access
2. Redeploy after adding variables
3. Check variable names match exactly (case-sensitive)

### App Works Locally But Not on Vercel

1. Check environment variables are set in Vercel
2. Verify Supabase RLS policies allow public access
3. Check browser console for errors
4. Review Vercel function logs

### Performance Issues

1. Enable Vercel Analytics (free tier available)
2. Use Vercel Edge Functions if needed
3. Optimize images and assets
4. Check Supabase query performance

## Vercel Features

### Preview Deployments

- Every pull request gets a preview deployment
- Test changes before merging
- Share preview URLs with team

### Analytics

1. Go to **Analytics** tab in Vercel dashboard
2. Enable Web Analytics (free tier)
3. Monitor page views, performance, etc.

### Logs

1. Go to **Deployments** → Click on a deployment
2. View **Function Logs** for server-side errors
3. View **Build Logs** for build issues

## Best Practices

1. **Never commit `.env.local`**:
   - Already in `.gitignore`
   - Use Vercel environment variables instead

2. **Use Preview Deployments**:
   - Test changes before production
   - Share with stakeholders

3. **Monitor Deployments**:
   - Check build logs regularly
   - Set up error monitoring

4. **Optimize Builds**:
   - Use `npm ci` instead of `npm install` (faster, more reliable)
   - Enable build caching

5. **Security**:
   - Keep environment variables secure
   - Use Vercel's built-in security features
   - Regularly update dependencies

## Support

- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- Next.js Deployment: https://nextjs.org/docs/deployment

## Quick Reference

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls

# Remove deployment
vercel remove
```
