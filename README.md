# APS Nashik - Modern School Website

A modern, professional school website for Apple Public School Nashik built with Next.js, React, and Firebase. Features a beautiful university-style design with a comprehensive admin portal for content management.

## 🚀 Features

### Frontend
- **Modern Design**: Clean, professional university-style design
- **Responsive**: Fully responsive for mobile, tablet, and desktop
- **Animations**: Smooth animations and transitions using Framer Motion
- **SEO Optimized**: Meta tags, structured data, and performance optimized
- **Fast Loading**: Optimized images and code splitting

### Admin Portal
- **Secure Login**: Protected admin dashboard
- **Content Management**: Edit homepage banners, text, and content
- **Event Management**: Add, edit, and delete events
- **News Management**: Publish and update news articles
- **Gallery Management**: Upload and organize images
- **Real-time Updates**: Instant content updates without redeployment

### Technical Features
- **Next.js 14**: Latest React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Supabase**: PostgreSQL database and backend services
- **Cloudinary**: Cloud-based image and media management
- **Framer Motion**: Smooth animations and transitions
- **React Hook Form**: Form handling and validation
- **Toast Notifications**: User feedback with react-hot-toast

## 📁 Project Structure

```
apsnashik/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin portal pages
│   ├── contact/           # Contact page
│   ├── gallery/           # Gallery page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── Header.tsx        # Navigation header
│   └── Footer.tsx        # Site footer
├── lib/                  # Utility libraries
│   └── firebase.ts       # Firebase configuration
├── public/               # Static assets
│   └── images/           # Image files
├── package.json          # Dependencies
├── tailwind.config.js    # Tailwind configuration
└── README.md            # Project documentation
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase account (for backend)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd apsnashik
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup

#### Configure Environment Variables
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name

# Admin Credentials
ADMIN_EMAIL=admin@apsnashik.com
ADMIN_PASSWORD=admin123456
```

#### Supabase Setup
1. Go to [Supabase Console](https://supabase.com/)
2. Create a new project
3. Run the migrations from `supabase/migrations/` folder
4. Get your project URL and API keys from Settings → API

#### Cloudinary Setup
1. Go to [Cloudinary](https://cloudinary.com/) and create a free account
2. Get your Cloud Name, API Key, and API Secret from the dashboard
3. See `CLOUDINARY_SETUP.md` for detailed setup instructions

### 4. Run Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

### 5. Access Admin Portal
Visit [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

**Demo Credentials:**
- Email: `admin@apsnashik.com`
- Password: `admin123456`

## 🎨 Customization

### Colors & Branding
Edit `tailwind.config.js` to customize the color scheme:

```javascript
colors: {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    // ... customize your brand colors
  }
}
```

### Content Management
All content can be managed through the admin portal:
- Homepage banners and text
- Events and news
- Gallery images
- Contact information

### Styling
- Global styles: `app/globals.css`
- Component styles: Use Tailwind classes
- Custom components: Create in `components/` directory

## 📱 Pages

### Public Pages
- **Homepage**: Hero section, features, testimonials, events
- **About**: School information and history
- **Gallery**: Photo gallery with categories and lightbox
- **Contact**: Contact form and information
- **Campus**: School facilities and infrastructure

### Admin Pages
- **Dashboard**: Overview and statistics
- **Content Management**: Edit website content
- **Events**: Manage school events
- **Gallery**: Upload and organize images
- **News**: Publish news articles
- **Settings**: Admin configuration

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run export       # Export static site
```

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Tailwind CSS for styling
- Implement responsive design
- Add proper error handling

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The site can be deployed to any static hosting platform:
- Netlify
- Firebase Hosting
- AWS S3 + CloudFront
- GitHub Pages

## 🔒 Security

### Admin Authentication
- Secure login system
- Protected admin routes
- Session management
- Password hashing (implement with Firebase Auth)

### Data Protection
- Input validation
- XSS protection
- CSRF protection
- Secure API endpoints

## 📊 Performance

### Optimization Features
- Image optimization with Next.js
- Code splitting and lazy loading
- CSS and JS minification
- CDN integration
- Caching strategies

### Performance Monitoring
- Core Web Vitals tracking
- Page load speed optimization
- Mobile performance optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: info@apsnashik.com
- Phone: +91 9226166369

## 🔄 Updates

### Version 2.0.0
- Complete redesign with modern UI
- Admin portal with content management
- Firebase integration
- Responsive design
- Performance optimizations

### Future Updates
- Advanced analytics dashboard
- Multi-language support
- Student portal
- Parent communication system
- Mobile app integration

---

**Built with ❤️ for Apple Public School Nashik**
