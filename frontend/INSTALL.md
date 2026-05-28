# Installation Guide - Compliance Audit Platform Frontend

## Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher

## Quick Install

Navigate to the frontend directory and install all dependencies:

```bash
cd application/frontend
npm install
```

## Manual Installation (if needed)

If you prefer to install dependencies individually or need to troubleshoot:

### Core Dependencies

```bash
# React core
npm install react@^18.2.0 react-dom@^18.2.0 react-scripts@5.0.1

# HTTP client
npm install axios@^1.6.0

# Markdown rendering
npm install react-markdown@^9.0.0 remark-gfm@^4.0.0

# File upload
npm install react-dropzone@^14.2.3

# Data visualization
npm install recharts@^2.10.0

# Routing
npm install react-router-dom@^6.20.0

# UI components
npm install @headlessui/react@^1.7.17 @heroicons/react@^2.1.1

# Utilities
npm install uuid@^9.0.1
```

### Dev Dependencies

```bash
# Tailwind CSS
npm install -D tailwindcss@^3.3.6 postcss@^8.4.32 autoprefixer@^10.4.16
```

## Complete Dependency List

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.2.0 | React library |
| react-dom | ^18.2.0 | React DOM rendering |
| react-scripts | 5.0.1 | Create React App scripts |
| axios | ^1.6.0 | HTTP client for API calls |
| react-markdown | ^9.0.0 | Markdown rendering |
| react-dropzone | ^14.2.3 | Drag-and-drop file upload |
| recharts | ^2.10.0 | Charts and data visualization |
| react-router-dom | ^6.20.0 | Client-side routing |
| @headlessui/react | ^1.7.17 | Unstyled UI components |
| @heroicons/react | ^2.1.1 | Icon library |
| remark-gfm | ^4.0.0 | GitHub Flavored Markdown support |
| uuid | ^9.0.1 | UUID generation |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| tailwindcss | ^3.3.6 | Utility-first CSS framework |
| postcss | ^8.4.32 | CSS transformation tool |
| autoprefixer | ^10.4.16 | CSS vendor prefixing |

## Single Command Installation

Install all dependencies at once:

```bash
npm install react@^18.2.0 react-dom@^18.2.0 react-scripts@5.0.1 axios@^1.6.0 react-markdown@^9.0.0 react-dropzone@^14.2.3 recharts@^2.10.0 react-router-dom@^6.20.0 @headlessui/react@^1.7.17 @heroicons/react@^2.1.1 remark-gfm@^4.0.0 uuid@^9.0.1
```

Install dev dependencies:

```bash
npm install -D tailwindcss@^3.3.6 postcss@^8.4.32 autoprefixer@^10.4.16
```

## Post-Installation Setup

### 1. Initialize Tailwind CSS

```bash
npx tailwindcss init -p
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and set:
```
REACT_APP_API_URL=http://localhost:5000
```

### 3. Verify Installation

Check that all dependencies are installed:

```bash
npm list --depth=0
```

### 4. Start Development Server

```bash
npm start
```

The application should open at [http://localhost:3000](http://localhost:3000)

## Troubleshooting

### Clear npm cache

```bash
npm cache clean --force
```

### Delete node_modules and reinstall

```bash
rm -rf node_modules package-lock.json
npm install
```

### Check Node version

```bash
node --version  # Should be 16.x or higher
npm --version   # Should be 8.x or higher
```

### Port already in use

If port 3000 is already in use, you can specify a different port:

```bash
PORT=3001 npm start
```

## Package Purposes

### axios
HTTP client for making API requests to the backend server. Used in `auditService.js` for all API communication.

### react-markdown
Renders markdown content in the audit reports. Supports GitHub Flavored Markdown with `remark-gfm` plugin.

### react-dropzone
Provides drag-and-drop file upload functionality in the DocumentUploadForm component.

### recharts
Creates interactive charts and visualizations for the ComplianceDashboard (circular progress, pie charts).

### react-router-dom
Enables client-side routing for navigation between different views (though currently using state-based navigation).

### @headlessui/react
Provides unstyled, accessible UI components (modals, dropdowns, transitions).

### @heroicons/react
Icon library used throughout the application for navigation, buttons, and status indicators.

### remark-gfm
Plugin for react-markdown that adds support for GitHub Flavored Markdown features (tables, strikethrough, task lists).

### uuid
Generates unique identifiers for audit records and other entities.

### tailwindcss
Utility-first CSS framework used for all styling throughout the application.

## Next Steps

After installation, refer to the main [README.md](README.md) for:
- Project structure
- Component overview
- Development workflow
- Building for production