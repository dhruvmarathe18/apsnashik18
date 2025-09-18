# APS Nashik Website - Render Deployment Guide

This guide will help you deploy your APS Nashik school website to Render with PostgreSQL database.

## Prerequisites

1. A Render account (sign up at render.com)
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Database Setup

### 1. Create PostgreSQL Database on Render

1. Go to your Render dashboard
2. Click "New +" → "PostgreSQL"
3. Configure your database:
   - **Name**: `aps-nashik-db`
   - **Database**: `aps_nashik_db`
   - **User**: `aps_nashik_user`
   - **Plan**: Choose based on your needs (Starter is fine for testing)

### 2. Get Database Connection String

1. Once your database is created, go to its dashboard
2. Copy the "External Database URL" - this is your `DATABASE_URL`
3. Keep this safe - you'll need it for the web service

## Web Service Setup

### 1. Create Web Service

1. In your Render dashboard, click "New +" → "Web Service"
2. Connect your Git repository
3. Configure the service:
   - **Name**: `aps-nashik-website`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### 2. Environment Variables

Add these environment variables in your web service settings:

```
NODE_ENV=production
DATABASE_URL=<your-database-connection-string>
JWT_SECRET=<generate-a-secure-random-string>
```

### 3. Database Initialization

The database will be automatically initialized when the service starts (via the `postinstall` script).

## Initial Admin Setup

After deployment, you need to create an admin user:

### Option 1: Using Render Shell

1. Go to your web service dashboard
2. Click "Shell" to open a terminal
3. Run: `npm run create-admin`

### Option 2: Using API

You can create an admin user via API call:

```bash
curl -X PUT https://your-app-name.onrender.com/api/admin/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@apsnashik.com",
    "password": "your-secure-password",
    "name": "Admin User"
  }'
```

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file:

```
DATABASE_URL=postgresql://username:password@localhost:5432/aps_nashik_db
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

### 3. Database Setup

```bash
# Initialize database
npm run init-db

# Create admin user
npm run create-admin
```

### 4. Start Development Server

```bash
npm run dev
```

## Database Schema

The application uses the following tables:

- **events**: School events and activities
- **gallery_images**: Photo gallery images
- **news_articles**: News and announcements
- **admin_users**: Admin authentication
- **contact_messages**: Contact form submissions

## API Endpoints

### Public Endpoints
- `GET /api/events` - Get all events
- `GET /api/gallery` - Get all gallery images
- `GET /api/news` - Get all news articles
- `POST /api/contact` - Submit contact form

### Admin Endpoints
- `POST /api/admin/auth` - Admin login
- `PUT /api/admin/auth` - Create admin user
- `GET /api/admin/auth` - Verify token
- `POST /api/events` - Create event
- `PUT /api/events` - Update event
- `DELETE /api/events` - Delete event
- `POST /api/gallery` - Upload image
- `PUT /api/gallery` - Update image
- `DELETE /api/gallery` - Delete image
- `POST /api/news` - Create news article
- `PUT /api/news` - Update news article
- `DELETE /api/news` - Delete news article

## Features

- ✅ Responsive design for all devices
- ✅ Admin dashboard for content management
- ✅ Event management system
- ✅ Photo gallery with categories
- ✅ News and announcements
- ✅ Contact form with database storage
- ✅ Secure admin authentication
- ✅ PostgreSQL database integration
- ✅ API-first architecture

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check your `DATABASE_URL` environment variable
   - Ensure the database is running and accessible

2. **Admin Login Not Working**
   - Make sure you've created an admin user
   - Check the JWT_SECRET is set correctly

3. **Build Failures**
   - Check that all dependencies are in package.json
   - Ensure Node.js version is compatible

### Logs

Check your application logs in the Render dashboard for detailed error information.

## Support

For technical support or questions about this deployment, contact your development team.

## Security Notes

- Change default admin credentials after first login
- Use strong, unique passwords
- Keep your JWT_SECRET secure and don't commit it to version control
- Regularly update dependencies for security patches
