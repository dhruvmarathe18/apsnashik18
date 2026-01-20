# Cloudinary Setup Guide

This guide will help you set up Cloudinary for media management in your APS Nashik website.

## What is Cloudinary?

Cloudinary is a cloud-based image and video management service that provides:
- Automatic image optimization and transformation
- CDN (Content Delivery Network) for fast image delivery
- Responsive image generation
- Automatic format conversion (WebP, AVIF, etc.)
- Image compression and quality optimization

## Step 1: Create a Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Click **"Sign Up for Free"**
3. Fill in your details and create an account
4. Verify your email address

## Step 2: Get Your Cloudinary Credentials

After signing up, you'll be taken to your dashboard. You'll see your credentials:

1. **Cloud Name**: Found in the dashboard (e.g., `demo`)
2. **API Key**: Found in the dashboard
3. **API Secret**: Found in the dashboard (click "Show" to reveal)

**Important**: Keep your API Secret secure and never expose it in client-side code!

## Step 3: Configure Environment Variables

### For Local Development

1. Create a `.env.local` file in the root directory (if it doesn't exist)
2. Add the following variables:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
```

**Example:**
```env
CLOUDINARY_CLOUD_NAME=demo
CLOUDINARY_API_KEY=922616636912345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=demo
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=aps-nashik-upload
```

### For Vercel Deployment

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
4. Set them for all environments (Production, Preview, Development)
5. Redeploy your application

## Step 4: Create Upload Preset (Required for Upload Widget)

To use the upload widget in the admin panel, you need to create an unsigned upload preset:

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Navigate to **Settings** → **Upload** → **Upload presets**
3. Click **"Add upload preset"**
4. Configure the preset:
   - **Preset name**: `aps-nashik-upload` (or your preferred name)
   - **Signing mode**: Select **"Unsigned"** (important!)
   - **Folder**: `aps-nashik` (or leave empty to allow folder selection)
   - **Allowed formats**: Select image formats (jpg, png, gif, webp)
   - **Max file size**: Set appropriate limit (e.g., 10MB)
   - **Tags**: Optional - add default tags if needed
5. Click **"Save"**
6. Add the preset name to your `.env.local`:
   ```env
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=aps-nashik-upload
   ```

**Note**: If you don't create an upload preset, the widget will try to use `ml_default` which may not exist in your account.

## Step 5: Organize Your Media in Cloudinary

### Recommended Folder Structure

Organize your images in Cloudinary using folders:

```
aps-nashik/
├── gallery/
│   ├── school-events/
│   ├── classroom-activities/
│   ├── sports-activities/
│   └── infrastructure/
├── teachers/
├── students/
└── hero-images/
```

### Uploading Images

**Option 1: Using Cloudinary Dashboard**
1. Go to [https://cloudinary.com/console](https://cloudinary.com/console)
2. Click **"Media Library"**
3. Click **"Upload"**
4. Select your images
5. Choose the folder (e.g., `aps-nashik/gallery/school-events`)
6. Add tags and metadata if needed
7. Click **"Upload"**

**Option 2: Using Cloudinary Upload Widget (Recommended)**
- Use the upload widget in the admin panel at `/admin/media`
- Click "Upload Images" button
- Select images from your computer, camera, or URL
- Images are automatically uploaded to the selected folder
- See Step 4 for setting up the upload preset

**Option 3: Using API**
```bash
curl -X POST \
  https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload \
  -F "file=@/path/to/image.jpg" \
  -F "folder=aps-nashik/gallery/school-events" \
  -F "api_key=YOUR_API_KEY" \
  -F "api_secret=YOUR_API_SECRET"
```

## Step 6: Using Cloudinary in Your Code

### Basic Usage

```tsx
import CloudinaryImage from '@/components/ui/CloudinaryImage'

<CloudinaryImage
  src="aps-nashik/gallery/school-events/image-name"
  alt="School Event"
  width={800}
  height={600}
/>
```

### With Custom Options

```tsx
<CloudinaryImage
  src="aps-nashik/gallery/school-events/image-name"
  alt="School Event"
  width={800}
  height={600}
  cloudinaryOptions={{
    crop: 'fill',
    quality: 'auto',
    format: 'auto',
  }}
/>
```

### Using the Hook

```tsx
import { useCloudinaryMedia } from '@/hooks/useCloudinaryMedia'

function MyComponent() {
  const { media, loading, error } = useCloudinaryMedia({
    folder: 'aps-nashik/gallery',
    maxResults: 50,
  })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {media.map((item) => (
        <img key={item.id} src={item.url} alt={item.id} />
      ))}
    </div>
  )
}
```

## Step 7: Image Optimization Features

Cloudinary automatically provides:

1. **Automatic Format Conversion**: Converts images to WebP or AVIF for better compression
2. **Responsive Images**: Generates multiple sizes for different screen sizes
3. **Quality Optimization**: Automatically adjusts quality for best file size/quality ratio
4. **Lazy Loading**: Built into Next.js Image component
5. **CDN Delivery**: Images are served from Cloudinary's global CDN

## Step 8: Testing

1. Start your development server:
   ```bash
   npm run dev
   ```

2. **Test Gallery Page**:
   - Navigate to `/gallery` page
   - Images should load from Cloudinary if configured correctly
   - Check browser console for any errors

3. **Test Admin Upload Widget**:
   - Log in to admin panel at `/admin/login`
   - Navigate to **Media** page (in System section)
   - Click **"Upload Images"** button
   - Upload widget should open
   - Upload a test image
   - Verify it appears in the media grid

## Troubleshooting

### Images Not Loading

1. **Check Environment Variables**:
   - Ensure `.env.local` has all Cloudinary variables
   - Restart your dev server after adding env variables
   - Check that `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set (required for client-side)

2. **Check Cloudinary Dashboard**:
   - Verify images are uploaded
   - Check folder structure matches what you're requesting
   - Verify API credentials are correct

3. **Check API Route**:
   - Visit `/api/cloudinary/media` in your browser
   - Should return JSON with media resources
   - Check for error messages

### Common Errors

**Error: "Cloudinary cloud name not configured"**
- Solution: Add `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` to your `.env.local`

**Error: "Unauthorized"**
- Solution: Check your `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` are correct

**Error: "No images found"**
- Solution: Upload images to Cloudinary in the correct folder structure

## Best Practices

1. **Organize by Folders**: Use folders to organize images (e.g., `aps-nashik/gallery/events`)
2. **Use Tags**: Add tags to images for easier filtering
3. **Add Metadata**: Use context/metadata for alt text and descriptions
4. **Optimize Before Upload**: While Cloudinary optimizes, starting with optimized images helps
5. **Use Appropriate Formats**: Let Cloudinary handle format conversion automatically

## API Endpoints

### Get Media from Cloudinary

```
GET /api/cloudinary/media?folder=aps-nashik/gallery&max_results=50
```

**Query Parameters:**
- `folder` (optional): Folder path in Cloudinary
- `tag` (optional): Filter by tag
- `resource_type` (optional): `image`, `video`, or `raw` (default: `image`)
- `max_results` (optional): Maximum number of results (default: 50)

**Response:**
```json
{
  "success": true,
  "resources": [
    {
      "id": "aps-nashik/gallery/image-name",
      "url": "https://res.cloudinary.com/...",
      "thumbnail": "https://res.cloudinary.com/...",
      "medium": "https://res.cloudinary.com/...",
      "large": "https://res.cloudinary.com/...",
      "width": 1920,
      "height": 1080,
      "format": "jpg",
      "folder": "aps-nashik/gallery",
      "tags": ["event", "school"],
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 1
}
```

## Security Notes

1. **Never expose API Secret**: The `CLOUDINARY_API_SECRET` should only be used server-side
2. **Use Signed URLs**: For private images, use signed URLs
3. **Set Upload Presets**: Configure upload presets with restrictions
4. **Use Tags for Organization**: Tags help organize without exposing folder structure

## Next Steps

1. ✅ Set up Cloudinary account
2. ✅ Configure environment variables
3. ✅ Create upload preset
4. ✅ Upload images to Cloudinary
5. ✅ Test image loading
6. ✅ Test admin upload widget
7. 🔄 (Optional) Set up automatic image optimization rules
8. 🔄 (Optional) Configure custom transformations

## Support

- Cloudinary Documentation: [https://cloudinary.com/documentation](https://cloudinary.com/documentation)
- Cloudinary Support: [https://support.cloudinary.com](https://support.cloudinary.com)

## Example Folder Structure

```
aps-nashik/
├── gallery/
│   ├── school-events/
│   │   ├── annual-day-2024.jpg
│   │   ├── sports-day-2024.jpg
│   │   └── cultural-festival-2024.jpg
│   ├── classroom-activities/
│   │   ├── science-lab.jpg
│   │   └── art-class.jpg
│   └── infrastructure/
│       ├── library.jpg
│       └── playground.jpg
├── teachers/
│   ├── teacher-1.jpg
│   └── teacher-2.jpg
└── hero-images/
    └── hero-main.jpg
```

When uploading, use the full path: `aps-nashik/gallery/school-events/annual-day-2024`
