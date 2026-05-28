# Compliance Audit Intelligence Platform - Frontend

Enterprise-grade React application for automated compliance auditing with IBM Carbon Design System.

## Features

- **Document Upload**: Drag-and-drop file upload with support for PDF, DOCX, and TXT files
- **Real-time Processing**: Visual pipeline showing audit progress through 4 stages
- **Compliance Dashboard**: Interactive dashboard with circular progress indicators and risk breakdowns
- **Risk Findings Table**: Sortable, filterable table with expandable row details
- **Audit Reports**: Markdown-rendered reports with export to PDF functionality
- **Audit History**: Browse and reload previous audits with search and filtering
- **IBM Carbon Design**: Professional enterprise UI with dark theme

## Technology Stack

- **React 18** - Modern React with hooks and functional components
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API communication
- **React Markdown** - Markdown rendering for reports
- **React Dropzone** - File upload with drag-and-drop
- **Recharts** - Data visualization library
- **Heroicons** - Icon library

## Project Structure

```
src/
├── components/           # React components
│   ├── AuditHistoryList.jsx
│   ├── AuditReportViewer.jsx
│   ├── ComplianceDashboard.jsx
│   ├── DocumentUploadForm.jsx
│   ├── Header.jsx
│   ├── ProcessingStatusBar.jsx
│   ├── RiskFindingsTable.jsx
│   └── Sidebar.jsx
├── context/             # React context providers
│   └── AuditContext.jsx
├── services/            # API services
│   └── auditService.js
├── App.jsx              # Main application component
├── index.jsx            # Application entry point
└── index.css            # Global styles
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```
REACT_APP_API_URL=http://localhost:5000
```

## Development

Start the development server:
```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

## Building for Production

Create an optimized production build:
```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## Component Overview

### App.jsx
Main application component with:
- Sidebar navigation (collapsible)
- Header with IBM branding
- Content area with view routing
- Audit state management via AuditContext

### AuditContext
Global state management for:
- Current audit results
- Audit history
- Processing status and progress
- Stage tracking (reading, mapping, detecting, generating)

### Sidebar
Navigation component with:
- New Audit view
- Audit History view
- Reports Archive view
- Settings view
- Collapse/expand functionality

### Header
Top bar component with:
- Dynamic page title
- IBM Consulting branding
- User avatar placeholder

### ProcessingStatusBar
Visual progress indicator showing:
- 4-stage audit pipeline
- Progress percentage
- Stage status (completed, in-progress, pending)
- Animated indicators

### DocumentUploadForm
File upload component with:
- Drag-and-drop zone
- Manual text input option
- Document metadata form
- Regulation selection (GDPR, ISO 27001, SOC 2, HIPAA)
- Real-time validation
- Progress tracking

### ComplianceDashboard
Visual metrics dashboard with:
- Overall compliance score (circular progress)
- Risk breakdown cards (HIGH/MEDIUM/LOW)
- Regulation scorecard (GDPR, ISO 27001)
- Status banner (COMPLIANT/PARTIALLY/NON-COMPLIANT)

### RiskFindingsTable
Interactive findings table with:
- 7 columns (Finding, Regulation, Risk Level, Score, Section, Recommendation, Actions)
- Risk level filtering
- Search functionality
- Sorting by risk, score, regulation
- Expandable rows with details
- Color-coded risk badges

### AuditReportViewer
Report display component with:
- Report header with metadata
- Markdown rendering with custom styles
- Remediation roadmap (3 priority levels)
- Export to PDF functionality
- Copy to clipboard
- Print-optimized layout

### AuditHistoryList
History management component with:
- List of previous audits
- Search by document name
- Filter by risk level and document type
- Delete with confirmation
- Click to reload audit
- Empty state message

## API Integration

The frontend communicates with the backend API via `auditService.js`:

- `submitAuditDocument(data)` - Submit text for audit
- `uploadDocumentFile(file)` - Upload file for text extraction
- `uploadAndAuditFile(file, metadata)` - Upload and audit in one call
- `getAuditHistory()` - Fetch audit history
- `getAuditById(id)` - Fetch specific audit
- `deleteAudit(id)` - Delete audit from history
- `checkHealth()` - Check API health

## IBM Carbon Design Colors

The application uses IBM Carbon Design System colors:

- **Primary Blue**: `#0f62fe`
- **Background**: `#161616`
- **Surface**: `#262626`
- **Border**: `#393939`
- **Text**: `#f4f4f4`
- **Success**: `#24a148`
- **Warning**: `#f1c21b`
- **Error**: `#da1e28`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - see LICENSE file for details