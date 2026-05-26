# Quick Start Guide - Compliance Audit Intelligence Platform

This guide will help you get the React web application up and running quickly.

## Prerequisites

- **Node.js** 16 or higher
- **npm** or **yarn** package manager

## Installation & Setup

### 1. Navigate to Frontend Directory

```bash
cd application/frontend
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React 18
- Tailwind CSS
- Recharts
- React Markdown
- React Dropzone
- Lucide React icons
- Axios

### 3. Start Development Server

```bash
npm start
```

The application will automatically open in your browser at `http://localhost:3000`

## First Time Usage

### Step 1: Upload a Document
1. The app opens on the "Upload Document" page
2. Select a document type (Privacy Policy, Security Policy, or Vendor Agreement)
3. Either:
   - **Drag & drop** a PDF/TXT/DOC/DOCX file, OR
   - Click **"Paste Text"** and paste your policy text directly
4. Click **"Analyze Document"** (or drop the file)
5. Wait 2 seconds for processing (simulated)

### Step 2: Review Dashboard
- After upload, you'll automatically see the **Dashboard**
- View your overall compliance score (circular progress)
- See risk breakdown (HIGH/MEDIUM/LOW)
- Check GDPR and ISO 27001 compliance percentages
- Review compliance status badge

### Step 3: Examine Findings
1. Click **"Findings"** in the sidebar
2. Filter by risk level (All, High, Medium, Low)
3. Sort by risk level or compliance score
4. Click any row to expand and see:
   - Detailed description
   - Specific recommendations
   - Affected regulation and section

### Step 4: View Full Report
1. Click **"Report"** in the sidebar
2. Read the comprehensive markdown-formatted audit report
3. Use **"Export PDF"** to download (mock - shows success message)
4. Use **"Print Report"** for physical copies

### Step 5: Check History
1. Click **"History"** in the sidebar
2. View all previous audits
3. Click any audit to reload its details
4. Track compliance trends over time

## Features Overview

### 🎯 Key Features

- **Document Upload**: Drag-and-drop or paste text
- **Real-time Analysis**: Instant compliance scoring
- **Interactive Dashboard**: Visual charts and metrics
- **Detailed Findings**: 22 sample findings with recommendations
- **Full Reports**: Markdown-formatted comprehensive reports
- **Audit History**: Track all previous audits
- **Export Options**: PDF export and print functionality

### 🎨 Design Highlights

- **IBM Carbon Design** inspired color scheme
- **Dark sidebar** with professional navigation
- **Card-based layout** for clean organization
- **Color-coded risk levels**: Red (HIGH), Orange (MEDIUM), Green (LOW)
- **Responsive design** for all screen sizes

## Mock Data

The application currently uses **mock data** for demonstration:

- **Sample Document**: "Corporate Privacy Policy v2.3"
- **Overall Score**: 72%
- **Findings**: 22 issues (3 HIGH, 7 MEDIUM, 12 LOW)
- **Compliance**: GDPR 68%, ISO 27001 76%
- **History**: 5 previous audits

### Connecting to Real Backend

To integrate with a real API:

1. Open `src/services/mockApi.js`
2. Replace mock functions with actual API calls
3. Update endpoints and authentication
4. Handle real response formats

Example:
```javascript
import axios from 'axios';

export const api = {
  uploadDocument: async (file, documentType) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    
    const response = await axios.post(
      'https://your-api.com/api/audit/upload',
      formData
    );
    
    return response.data;
  }
};
```

## Available Scripts

### `npm start`
Runs the app in development mode at `http://localhost:3000`

### `npm run build`
Builds the app for production to the `build` folder

### `npm test`
Launches the test runner (if tests are added)

## Troubleshooting

### Port Already in Use
If port 3000 is busy:
```bash
# Kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Styling Not Working
Ensure Tailwind CSS is properly configured:
```bash
# Verify tailwind.config.js exists
# Verify postcss.config.js exists
# Restart the dev server
npm start
```

## Project Structure

```
application/frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/          # React components
│   │   ├── DocumentUpload.js
│   │   ├── AuditDashboard.js
│   │   ├── FindingsPanel.js
│   │   ├── AuditReport.js
│   │   └── AuditHistory.js
│   ├── services/
│   │   └── mockApi.js       # Mock API (replace with real API)
│   ├── App.js               # Main app component
│   ├── index.js             # Entry point
│   └── index.css            # Global styles
├── package.json
├── tailwind.config.js
└── README.md
```

## Next Steps

1. **Explore the UI**: Try all features and navigation
2. **Review Mock Data**: Check `src/services/mockApi.js` to understand data structure
3. **Customize Branding**: Update colors, logos, and text
4. **Integrate Backend**: Replace mock API with real endpoints
5. **Add Authentication**: Implement user login if needed
6. **Deploy**: Build and deploy to your hosting platform

## Support

For detailed documentation, see `application/frontend/README.md`

For the full solution architecture, see `docs/problem-statements/full_solution.md`

---

**Built for Bob-a-thon Hackathon**  
**AI Compliance & Policy Audit Agent**