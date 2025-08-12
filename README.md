# APS Nashik - School Website

A modern, responsive website for Apple Public School (APS) Nashik, built with HTML, CSS, JavaScript, and Bootstrap.

## Features

- 🏫 **School Information**: Comprehensive details about APS Nashik
- 📧 **Contact Form**: Functional contact form with email integration
- 📱 **Responsive Design**: Mobile-friendly design across all devices
- 🖼️ **Image Gallery**: Showcase of school activities and facilities
- 🗺️ **Google Maps Integration**: School location with interactive map
- ⚡ **Fast Loading**: Optimized for performance and SEO

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 4
- **Backend**: Node.js (Serverless Functions)
- **Email Service**: Nodemailer
- **Deployment**: Vercel
- **Maps**: Google Maps API

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Vercel CLI (for deployment)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd apsnashik
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@apsnashik.com
```

### Local Development

Run the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:3000`

## Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy to Vercel:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - Go to your project settings
   - Navigate to Environment Variables
   - Add the following variables:
     - `EMAIL_USER`: Your Gmail address
     - `EMAIL_PASS`: Your Gmail app password
     - `ADMIN_EMAIL`: Admin email for receiving contact form submissions

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `EMAIL_USER` | Gmail address for sending emails | Yes |
| `EMAIL_PASS` | Gmail app password | Yes |
| `ADMIN_EMAIL` | Email address to receive contact form submissions | No (defaults to EMAIL_USER) |

## Project Structure

```
apsnashik/
├── api/
│   └── contact.js          # Contact form API endpoint
├── css/
│   ├── bootstrap.css       # Bootstrap styles
│   ├── style.css          # Custom styles
│   └── responsive.css     # Responsive styles
├── images/                # Image assets
├── js/
│   ├── bootstrap.js       # Bootstrap JavaScript
│   └── jquery-3.4.1.min.js # jQuery library
├── index.html             # Homepage
├── about.html             # About page
├── contact.html           # Contact page
├── teacher.html           # Gallery page
├── vehicle.html           # Campus page
├── package.json           # Dependencies
├── vercel.json           # Vercel configuration
├── robots.txt            # SEO robots file
├── sitemap.xml           # SEO sitemap
└── README.md             # Project documentation
```

## Features

### Contact Form
- Validates required fields
- Sends emails via Gmail SMTP
- Shows success/error messages
- Prevents spam with proper validation

### SEO Optimization
- Meta tags for social media sharing
- Structured data markup
- Sitemap.xml for search engines
- Robots.txt for crawler guidance

### Performance
- Optimized images
- Minified CSS and JavaScript
- Fast loading times
- Mobile-first responsive design

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Contact

For any questions or support, please contact:
- Email: admin@apsnashik.com
- Website: https://apsnashik.vercel.app

## Acknowledgments

- Bootstrap for the responsive framework
- Google Maps for location services
- Vercel for hosting and serverless functions
