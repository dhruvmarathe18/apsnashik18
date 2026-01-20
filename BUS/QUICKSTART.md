# Quick Start Guide

## Installation & Setup

1. **Install Node.js** (if not already installed)
   - Download from https://nodejs.org/
   - Version 16 or higher recommended

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   - The app will automatically open at `http://localhost:3000`
   - If not, manually navigate to the URL shown in terminal

## First Time Usage

1. **Navigate to Daily Entry**
   - Click "Daily Entry" in the navigation menu

2. **Enter Your First Entry**
   - Select today's date
   - Choose a bus (Winger, Maximo, Verito, Audi, or Fluence)
   - Enter driver name
   - Start KM will be 0 for first entry
   - Enter End KM
   - Fill other details as needed
   - Click "Save Entry"

3. **View Reports**
   - Go to "Bus Report" to see monthly summaries
   - Go to "Driver Report" to see driver performance

## Data Persistence

- All data is automatically saved to browser localStorage
- No manual save required
- Data persists even after closing browser
- To backup: Export reports to Excel

## Features

✅ **Automatic Calculations**
- Daily KM = End KM - Start KM
- Diesel Amount = Diesel Filled × Rate
- Running KM accumulates until next diesel fill
- Average calculated automatically

✅ **Smart Features**
- Start KM auto-loads from previous day
- Multi-day diesel logic supported
- Real-time calculations
- Excel export for reports

## Troubleshooting

**App won't start?**
- Check Node.js is installed: `node --version`
- Delete `node_modules` and run `npm install` again

**Data not saving?**
- Check browser console for errors (F12)
- Ensure localStorage is enabled in browser
- Try clearing browser cache

**Excel export not working?**
- Check browser allows downloads
- Try different browser
- Check browser console for errors

## Production Build

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` folder. You can deploy these to any static hosting service.

## Need Help?

Check the main README.md for detailed documentation.
