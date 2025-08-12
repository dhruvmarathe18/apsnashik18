# Deployment Checklist

## Pre-Deployment Checklist

### ✅ Files Created/Updated
- [x] `vercel.json` - Vercel configuration
- [x] `package.json` - Dependencies and scripts
- [x] `api/contact.js` - Serverless contact form API
- [x] `robots.txt` - SEO optimization
- [x] `sitemap.xml` - Search engine sitemap
- [x] `.gitignore` - Version control exclusions
- [x] `README.md` - Project documentation
- [x] Updated contact forms in `index.html` and `contact.html`
- [x] Enhanced meta tags for SEO
- [x] Removed old `send_details.php` file

### ✅ Environment Variables Setup
Before deploying, ensure you have the following environment variables ready:
- `EMAIL_USER` - Your Gmail address
- `EMAIL_PASS` - Your Gmail app password (not regular password)
- `ADMIN_EMAIL` - Email to receive contact form submissions

### ✅ Gmail Setup for Email
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password as `EMAIL_PASS`

## Deployment Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Test Locally
```bash
npm run dev
```

### 3. Deploy to Vercel
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Deploy
vercel
```

### 4. Configure Environment Variables
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add the following variables:
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `ADMIN_EMAIL`

### 5. Test Contact Form
1. Visit your deployed site
2. Fill out the contact form
3. Verify email is received

## Post-Deployment Checklist

### ✅ Functionality Tests
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Contact form submits successfully
- [ ] Email notifications are received
- [ ] Google Maps loads properly
- [ ] Responsive design works on mobile

### ✅ Performance Tests
- [ ] Page load times are acceptable
- [ ] Images load properly
- [ ] No console errors
- [ ] Mobile performance is good

### ✅ SEO Verification
- [ ] Meta tags are present
- [ ] Sitemap is accessible at `/sitemap.xml`
- [ ] Robots.txt is accessible at `/robots.txt`
- [ ] Social media previews work

## Troubleshooting

### Contact Form Not Working
1. Check environment variables are set correctly
2. Verify Gmail app password is correct
3. Check Vercel function logs for errors
4. Ensure CORS is properly configured

### Images Not Loading
1. Check file paths are correct
2. Verify images are committed to repository
3. Check for case sensitivity issues

### Google Maps Not Loading
1. Verify API key is valid
2. Check API key restrictions
3. Ensure billing is enabled for Google Cloud

## Maintenance

### Regular Tasks
- [ ] Update content as needed
- [ ] Monitor contact form submissions
- [ ] Check for broken links
- [ ] Review and update images
- [ ] Monitor performance metrics

### Security
- [ ] Keep dependencies updated
- [ ] Monitor for security vulnerabilities
- [ ] Regularly rotate API keys
- [ ] Review access logs

## Support

If you encounter any issues:
1. Check the Vercel deployment logs
2. Review the README.md for setup instructions
3. Contact the development team
4. Check Vercel documentation for troubleshooting
