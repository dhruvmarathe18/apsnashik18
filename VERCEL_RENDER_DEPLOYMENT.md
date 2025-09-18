# APS Nashik Website - Vercel + Render Deployment Guide

This guide will help you deploy your APS Nashik school website using Vercel for the frontend and Render for the backend API and database.

## 🏗️ Architecture Overview

- **Frontend (Vercel)**: Next.js website with static generation
- **Backend (Render)**: Express.js API server with PostgreSQL database
- **Database (Render)**: PostgreSQL database for all data storage

## 🚀 Step-by-Step Deployment

### Part 1: Deploy Backend to Render

#### 1.1 Prepare Backend Repository

1. **Create a separate repository for the backend:**
   ```bash
   # Create new repository on GitHub
   # Clone the backend folder
   git clone <your-backend-repo-url>
   cd <backend-repo-name>
   
   # Copy backend files
   cp -r ../apsnashik/backend/* .
   git add .
   git commit -m "Initial backend setup"
   git push
   ```

#### 1.2 Deploy Backend to Render

1. **Go to [Render Dashboard](https://dashboard.render.com)**
2. **Click "New +" → "Web Service"**
3. **Connect your backend repository**
4. **Configure the service:**
   - **Name**: `aps-nashik-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Starter (Free)

#### 1.3 Create Database on Render

1. **Click "New +" → "PostgreSQL"**
2. **Configure:**
   - **Name**: `aps-nashik-db`
   - **Database**: `aps_nashik_db`
   - **User**: `aps_nashik_user`
   - **Plan**: Starter (Free)

#### 1.4 Set Environment Variables

In your backend service settings, add:
```
NODE_ENV=production
DATABASE_URL=<your-database-connection-string-from-render>
JWT_SECRET=<generate-a-secure-random-string>
```

#### 1.5 Deploy Backend

1. **Click "Create Web Service"**
2. **Wait for deployment to complete**
3. **Note your backend URL** (e.g., `https://aps-nashik-backend.onrender.com`)

### Part 2: Deploy Frontend to Vercel

#### 2.1 Prepare Frontend

1. **Update environment variables:**
   ```bash
   # Create .env.local file
   echo "NEXT_PUBLIC_API_URL=https://your-backend-app.onrender.com" > .env.local
   echo "NODE_ENV=production" >> .env.local
   ```

2. **Remove API routes from frontend** (since we're using external backend):
   ```bash
   # Remove the app/api directory
   rm -rf app/api
   ```

#### 2.2 Deploy to Vercel

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure:**
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

#### 2.3 Set Environment Variables in Vercel

In your Vercel project settings, add:
```
NEXT_PUBLIC_API_URL=https://your-backend-app.onrender.com
NODE_ENV=production
```

#### 2.4 Deploy Frontend

1. **Click "Deploy"**
2. **Wait for deployment to complete**
3. **Note your frontend URL** (e.g., `https://aps-nashik.vercel.app`)

## 🔧 Local Development Setup

### Backend Development

1. **Navigate to backend directory:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment:**
   ```bash
   # Copy environment template
   cp env.backend.example .env
   
   # Edit .env with your local database URL
   # DATABASE_URL=postgresql://username:password@localhost:5432/aps_nashik_db
   ```

3. **Start backend server:**
   ```bash
   npm run dev
   # Server will run on http://localhost:5000
   ```

### Frontend Development

1. **Navigate to frontend directory:**
   ```bash
   cd .. # Go back to root
   npm install
   ```

2. **Set up environment:**
   ```bash
   # Copy environment template
   cp env.frontend.example .env.local
   
   # Edit .env.local with your backend URL
   # NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

3. **Start frontend server:**
   ```bash
   npm run dev
   # Website will run on http://localhost:3000
   ```

## 📋 Environment Variables Summary

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://your-backend-app.onrender.com
NODE_ENV=production
```

### Backend (Render)
```
NODE_ENV=production
DATABASE_URL=<render-database-connection-string>
JWT_SECRET=<secure-random-string>
```

## 🔍 Testing Your Deployment

### 1. Test Backend API
```bash
# Health check
curl https://your-backend-app.onrender.com/health

# Test events API
curl https://your-backend-app.onrender.com/api/events
```

### 2. Test Frontend
1. **Visit your Vercel URL**
2. **Check if data loads from backend**
3. **Test admin login** at `/admin/login`

### 3. Test Admin Panel
- **URL**: `https://your-frontend.vercel.app/admin/login`
- **Email**: `admin@apsnashik.com`
- **Password**: `admin123456`

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Backend has CORS enabled for all origins
   - If issues persist, check Render logs

2. **Database Connection Issues**
   - Check DATABASE_URL in Render environment variables
   - Verify database is running and accessible

3. **API Not Responding**
   - Check Render service logs
   - Verify environment variables are set correctly
   - Ensure backend service is running

4. **Frontend Not Loading Data**
   - Check NEXT_PUBLIC_API_URL in Vercel environment variables
   - Verify backend URL is correct and accessible
   - Check browser console for errors

### Debugging Steps

1. **Check Render Logs:**
   - Go to your backend service dashboard
   - Click "Logs" tab
   - Look for error messages

2. **Check Vercel Logs:**
   - Go to your frontend project dashboard
   - Click "Functions" tab
   - Check for build or runtime errors

3. **Test API Endpoints:**
   ```bash
   # Test health endpoint
   curl https://your-backend-app.onrender.com/health
   
   # Test events endpoint
   curl https://your-backend-app.onrender.com/api/events
   ```

## 📊 Monitoring

### Render Monitoring
- **Uptime**: Check service status in Render dashboard
- **Logs**: Monitor application logs for errors
- **Database**: Monitor database performance and connections

### Vercel Monitoring
- **Analytics**: View website traffic and performance
- **Functions**: Monitor serverless function performance
- **Speed Insights**: Check Core Web Vitals

## 🔒 Security Considerations

1. **Environment Variables**: Never commit sensitive data to version control
2. **CORS**: Backend allows all origins - restrict in production if needed
3. **JWT Secret**: Use a strong, unique secret for production
4. **Database**: Use strong passwords and restrict access
5. **HTTPS**: Both Vercel and Render provide HTTPS by default

## 💰 Cost Estimation

### Render (Backend + Database)
- **Web Service**: Free tier (750 hours/month)
- **PostgreSQL**: Free tier (1GB storage)
- **Total**: $0/month (within free limits)

### Vercel (Frontend)
- **Hobby Plan**: Free tier (100GB bandwidth/month)
- **Total**: $0/month (within free limits)

## 🎯 Next Steps

1. **Custom Domain**: Set up custom domain for both services
2. **Monitoring**: Set up proper monitoring and alerting
3. **Backup**: Set up database backups
4. **CDN**: Vercel provides global CDN automatically
5. **SSL**: Both services provide SSL certificates automatically

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Express.js Docs**: https://expressjs.com/

Your APS Nashik website is now ready for production with a scalable, modern architecture! 🎉
