# APS Nashik Website - Setup Guide

This guide will help you set up the APS Nashik school website with PostgreSQL database.

## 🚀 Quick Start (For Development)

### Option 1: Use a Cloud Database (Recommended)

1. **Get a free PostgreSQL database:**
   - [Neon](https://neon.tech) (Free tier available)
   - [Supabase](https://supabase.com) (Free tier available)
   - [Railway](https://railway.app) (Free tier available)

2. **Create environment file:**
   ```bash
   # Create .env.local file
   echo "DATABASE_URL=your-database-connection-string" > .env.local
   echo "JWT_SECRET=your-super-secret-jwt-key" >> .env.local
   echo "NODE_ENV=development" >> .env.local
   ```

3. **Install dependencies and setup:**
   ```bash
   npm install
   npm run setup
   npm run dev
   ```

### Option 2: Use Local PostgreSQL

1. **Install PostgreSQL:**
   - [Download PostgreSQL](https://www.postgresql.org/download/)
   - Or use Docker: `docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres`

2. **Create database:**
   ```sql
   CREATE DATABASE aps_nashik_db;
   CREATE USER aps_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE aps_nashik_db TO aps_user;
   ```

3. **Create environment file:**
   ```bash
   # Create .env.local file
   echo "DATABASE_URL=postgresql://aps_user:your_password@localhost:5432/aps_nashik_db" > .env.local
   echo "JWT_SECRET=your-super-secret-jwt-key" >> .env.local
   echo "NODE_ENV=development" >> .env.local
   ```

4. **Setup and run:**
   ```bash
   npm install
   npm run setup
   npm run dev
   ```

## 🌐 Deploy to Render

### 1. Prepare Your Repository

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Create render.yaml** (already included in the project)

### 2. Deploy on Render

1. **Go to [Render Dashboard](https://dashboard.render.com)**
2. **Click "New +" → "Web Service"**
3. **Connect your repository**
4. **Configure:**
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment:** `Node`

### 3. Create Database on Render

1. **Click "New +" → "PostgreSQL"**
2. **Configure:**
   - **Name:** `aps-nashik-db`
   - **Database:** `aps_nashik_db`
   - **User:** `aps_nashik_user`
   - **Plan:** Starter (free)

### 4. Set Environment Variables

In your web service settings, add:
```
NODE_ENV=production
DATABASE_URL=<your-database-connection-string-from-render>
JWT_SECRET=<generate-a-secure-random-string>
```

### 5. Deploy and Initialize

1. **Deploy your service**
2. **Once deployed, go to your service shell:**
   ```bash
   npm run setup
   ```

## 🔧 Troubleshooting

### Database Connection Issues

**Error: `role "ADMIN" does not exist`**
- This means PostgreSQL is not installed or running locally
- Use a cloud database instead (Option 1 above)

**Error: `DATABASE_URL not found`**
- Create a `.env.local` file with your database connection string
- Make sure the file is in the project root directory

**Error: `connection refused`**
- Check if PostgreSQL is running
- Verify your connection string is correct
- Make sure the database exists

### Common Issues

1. **Port already in use:**
   ```bash
   # Kill process on port 3000
   npx kill-port 3000
   ```

2. **Permission denied:**
   ```bash
   # Fix file permissions
   chmod +x scripts/*.js
   ```

3. **Module not found:**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📋 Default Admin Credentials

After running `npm run setup`, you can login with:
- **Email:** admin@apsnashik.com
- **Password:** admin123456

## 🎯 Next Steps

1. **Access your website:** http://localhost:3000
2. **Access admin panel:** http://localhost:3000/admin/login
3. **Start customizing:** Edit content through the admin dashboard
4. **Deploy:** Follow the Render deployment guide above

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify your database connection
3. Make sure all environment variables are set correctly
4. Check the console for error messages

## 🔒 Security Notes

- Change the default admin password after first login
- Use a strong, unique JWT_SECRET
- Don't commit your .env.local file to version control
- Regularly update dependencies for security patches
