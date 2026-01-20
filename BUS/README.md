# School Transport Management System - React Version

A modern, offline web-based School Transport Management System built with React. All data is stored locally in the browser using localStorage, providing persistent data storage without requiring a database or server.

## Features

- ✅ **React-based** - Modern, component-based architecture
- ✅ **Completely Offline** - Works without internet connection
- ✅ **Persistent Data** - Data stored in browser localStorage
- ✅ **5 Bus Management** - Winger, Maximo, Verito, Audi, Fluence
- ✅ **Daily Entry** - Record daily transport data with auto-calculations
- ✅ **Multi-Day Diesel Logic** - Accumulates KM until next diesel fill
- ✅ **Bus Reports** - Monthly bus-wise reports with totals
- ✅ **Driver Reports** - Driver-wise performance tracking
- ✅ **Excel Export** - Export reports to Excel files
- ✅ **Modern UI** - Beautiful interface with Tailwind CSS
- ✅ **Responsive Design** - Works on desktop and mobile

## Tech Stack

- **React 18** - UI framework
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **XLSX** - Excel file handling
- **FileSaver** - File download

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## Usage

### Daily Entry
1. Navigate to "Daily Entry" page
2. Select date and bus
3. Enter driver name
4. Start KM auto-loads from previous day's End KM
5. Enter End KM (Daily KM auto-calculates)
6. Enter diesel details if filled
7. Enter other expenses if any
8. Click "Save Entry"
9. Data is automatically saved to localStorage

### Bus Report
1. Navigate to "Bus Report" page
2. Select bus and month
3. Click "Generate Report"
4. View monthly summary and daily entries
5. Click "Export Monthly Report to Excel" to download

### Driver Report
1. Navigate to "Driver Report" page
2. Select driver from dropdown
3. Click "Generate Report"
4. View driver summary and all entries
5. Click "Export Driver Report to Excel" to download

## Data Storage

All data is stored in browser localStorage with the key `schoolTransportData`. The data structure:

```javascript
{
  "Winger": [...entries],
  "Maximo": [...entries],
  "Verito": [...entries],
  "Audi": [...entries],
  "Fluence": [...entries]
}
```

Each entry contains:
- Date
- Driver Name
- Start KM
- End KM
- Daily KM
- Diesel Filled
- Diesel Rate
- Diesel Amount
- Expense Description
- Other Expense
- Running KM
- Actual Average
- Remarks

## Calculations

### Automatic Calculations
- **Daily KM** = End KM - Start KM
- **Diesel Amount** = Diesel Filled × Diesel Rate
- **Running KM** = Accumulated KM since last diesel fill
- **Actual Average** = Running KM ÷ Diesel Filled (when diesel is filled)
- **Monthly Average** = Total KM ÷ Total Diesel

### Multi-Day Diesel Logic
- Diesel may be filled once and used for multiple days
- System accumulates KM until next diesel fill
- Average is calculated as: Total KM since last diesel ÷ Diesel filled
- Running KM shows accumulated KM since last diesel fill

## Project Structure

```
src/
├── pages/
│   ├── Home.jsx           # Home page
│   ├── DailyEntry.jsx     # Daily entry form
│   ├── BusReport.jsx      # Bus-wise reports
│   └── DriverReport.jsx   # Driver-wise reports
├── context/
│   └── TransportContext.jsx  # State management
├── utils/
│   └── excelExport.js      # Excel export functions
├── App.jsx                # Main app component
├── main.jsx               # Entry point
└── index.css             # Global styles
```

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Data Backup

To backup your data:
1. Data is automatically saved to localStorage
2. Export reports to Excel for external backup
3. Use browser's export/import feature if available

## Troubleshooting

### Data not persisting
- Check browser localStorage is enabled
- Clear browser cache and try again
- Check browser console for errors

### Excel export not working
- Ensure browser allows downloads
- Check browser console for errors
- Try a different browser

## Development

### Adding New Features
1. Create components in `src/components/`
2. Add pages in `src/pages/`
3. Update context in `src/context/TransportContext.jsx`
4. Add routes in `src/App.jsx`

### Styling
- Uses Tailwind CSS utility classes
- Custom colors defined in `tailwind.config.js`
- Responsive design with mobile-first approach

## License

This project is open source and available for educational purposes.

---

**Version:** 2.0 (React)  
**Last Updated:** 2024
