# School Finance Tracker

A comprehensive web application for managing school finances in India. This application allows private schools to track daily finances, generate reports, and manage all financial transactions without requiring a backend or database.

## Features

- **Complete Financial Tracking**
  - Student fee collection (class-wise)
  - Bus fee collection and bus expenses
  - Teacher and staff salary management
  - Other expenses and income tracking

- **Reports & Analytics**
  - Daily and monthly financial reports
  - Class-wise fee collection reports
  - Transport/bus expense reports
  - Salary reports with teacher/staff breakdown
  - Interactive charts and visualizations

- **Data Management**
  - Export all data to Excel (multiple sheets)
  - Import data from Excel files
  - Local storage using IndexedDB
  - No backend required - fully client-side

- **User-Friendly Interface**
  - Modern, clean UI with Tailwind CSS
  - Quick entry wizard for fast data entry
  - Responsive design (desktop + mobile)
  - Dark mode support
  - Keyboard-friendly navigation

## Tech Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Persistence**: IndexedDB (via idb-keyval)
- **Charts**: Recharts
- **Excel Export/Import**: SheetJS (xlsx)
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Installation

1. **Clone or download the project**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory. You can deploy this to any static hosting service like:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

## Usage Guide

### First Time Setup

1. **Load Demo Data (Optional)**
   - Go to Settings page
   - Click "Load Demo Data" to see sample transactions
   - This helps you understand the app features

2. **Configure Settings**
   - Go to Settings page
   - Enter your school name and academic year
   - Add your classes (e.g., 1st, 2nd, 3rd, etc.)
   - Add your bus numbers and routes
   - Customize expense categories and income sources
   - Save settings

### Adding Transactions

1. **Quick Entry Wizard**
   - Click "Add Entry" in the sidebar
   - Step 1: Choose transaction type (Fee, Bus Fee, Bus Expense, Salary, Other Expense, Other Income)
   - Step 2: Fill in the required details
   - Step 3: Review and confirm

2. **Transaction Types**

   **Fee Collection:**
   - Date, Class, Student Name (optional), Fee Type, Amount, Payment Mode, Status

   **Bus Fee Collection:**
   - Date, Bus Number, Student Name (optional), Amount, Payment Mode

   **Bus Expenses:**
   - Date, Bus Number, Expense Type (Diesel, Maintenance, etc.), Amount, Vendor

   **Salary:**
   - Date, Employee Type (Teacher/Staff), Employee Name, Salary Month, Amount, Payment Mode

   **Other Expenses:**
   - Date, Category, Amount, Payment Mode, Notes

   **Other Income:**
   - Date, Income Source, Amount, Payment Mode, Notes

### Viewing Reports

1. **Dashboard**
   - Overview of today's and month's totals
   - Charts showing income vs expense trends
   - Category breakdowns
   - Recent transactions

2. **Reports Page**
   - Daily Report: Select a date to see day-wise breakdown
   - Monthly Report: Select a month to see monthly summary
   - Class-wise Fee Report: See fee collection by class
   - Transport Report: Bus-wise fee collection and expenses
   - Salary Report: Monthly salary breakdown by employee type

### Export/Import Data

1. **Export to Excel**
   - Go to Export/Import page
   - Click "Export to Excel"
   - The file will contain multiple sheets:
     - FeeCollection
     - BusFeeCollection
     - BusExpenses
     - Salaries
     - OtherExpenses
     - OtherIncomes
     - SummaryMonthly
     - AppSettings

2. **Import from Excel**
   - Go to Export/Import page
   - Choose "Replace All Data" to replace existing data
   - Or choose "Append New Data" to add new transactions
   - Select your Excel file
   - Confirm the import

**Important Notes:**
- Always backup your data before importing
- The Excel file format must match the export format
- When appending, duplicate entries (by ID) will be skipped

## Data Storage

All data is stored locally in your browser using IndexedDB. This means:
- Data persists even after closing the browser
- Data is private to your browser/device
- No data is sent to any server
- You can export/import to backup your data

## Demo Mode

The app includes a demo mode with sample data:
- 10 fee collection entries
- 5 bus fee collections
- 6 bus expenses
- 6 salary entries
- 8 other expenses
- 5 other income entries

To load demo data: Go to Settings → Click "Load Demo Data"
To clear demo data: Go to Settings → Click "Clear Demo Data"

## Keyboard Shortcuts

- **Tab**: Navigate between form fields
- **Enter**: Submit forms (where applicable)
- **Escape**: Close modals

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

Note: IndexedDB is required. Older browsers may not be fully supported.

## Troubleshooting

**Data not saving?**
- Check browser console for errors
- Ensure IndexedDB is enabled in your browser
- Try clearing browser cache and reloading

**Import not working?**
- Verify the Excel file format matches the export format
- Check that all required columns are present
- Ensure dates are in YYYY-MM-DD format

**Charts not displaying?**
- Check browser console for errors
- Ensure you have data in the selected time period
- Try refreshing the page

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── ui/          # Basic UI components (Button, Card, Input, etc.)
│   └── Layout/      # Layout components (Sidebar, Layout)
├── pages/           # Page components
│   ├── Dashboard.tsx
│   ├── QuickEntry.tsx
│   ├── Fees.tsx
│   ├── Transport.tsx
│   ├── Salaries.tsx
│   ├── Expenses.tsx
│   ├── Income.tsx
│   ├── Reports.tsx
│   ├── ExportImport.tsx
│   └── Settings.tsx
├── services/        # Service layer
│   └── storage.ts   # IndexedDB storage service
├── store/           # State management
│   └── useStore.ts  # Zustand store
├── types/           # TypeScript type definitions
│   └── index.ts
├── utils/           # Utility functions
│   ├── excel.ts     # Excel export/import
│   ├── reports.ts   # Report generation
│   ├── seedData.ts  # Demo data
│   └── uuid.ts      # UUID generation
├── App.tsx          # Main app component
├── main.tsx         # Entry point
└── index.css        # Global styles
```

## License

This project is open source and available for use by private schools.

## Support

For issues or questions, please check the browser console for error messages and ensure all dependencies are properly installed.

## Future Enhancements

Potential features for future versions:
- Multi-user support with authentication
- Cloud backup integration
- Advanced filtering and search
- PDF report generation
- Email reports
- Mobile app version

---

**Note**: This application stores all data locally in your browser. Make sure to regularly export your data as a backup, especially before clearing browser data or switching devices.
