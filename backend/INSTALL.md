# Installation Guide - Compliance Audit Platform Backend

## Prerequisites

- Node.js 20.x or higher
- npm 8.x or higher

## Quick Install

Navigate to the backend directory and install all dependencies:

```bash
cd application/backend
npm install
```

## Manual Installation (if needed)

If you prefer to install dependencies individually or need to troubleshoot:

### Core Dependencies

```bash
# Express framework
npm install express@^4.18.2

# CORS middleware
npm install cors@^2.8.5

# Environment variables
npm install dotenv@^16.3.1

# HTTP client
npm install axios@^1.6.0

# File upload handling
npm install multer@^1.4.5-lts.1

# PDF text extraction
npm install pdf-parse@^1.1.1

# DOCX text extraction
npm install mammoth@^1.6.0

# UUID generation
npm install uuid@^9.0.1

# HTTP request logging
npm install morgan@^1.10.0

# Security headers
npm install helmet@^7.1.0
```

### Dev Dependencies

```bash
# Auto-restart on file changes
npm install -D nodemon@^3.0.2
```

## Complete Dependency List

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.18.2 | Web framework for Node.js |
| cors | ^2.8.5 | Enable CORS for frontend communication |
| dotenv | ^16.3.1 | Load environment variables from .env |
| axios | ^1.6.0 | HTTP client for ICA API calls |
| multer | ^1.4.5-lts.1 | Middleware for file uploads |
| pdf-parse | ^1.1.1 | Extract text from PDF files |
| mammoth | ^1.6.0 | Extract text from DOCX files |
| uuid | ^9.0.1 | Generate unique identifiers |
| morgan | ^1.10.0 | HTTP request logger |
| helmet | ^7.1.0 | Security headers middleware |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| nodemon | ^3.0.2 | Auto-restart server on file changes |

## Single Command Installation

Install all production dependencies at once:

```bash
npm install express@^4.18.2 cors@^2.8.5 dotenv@^16.3.1 axios@^1.6.0 multer@^1.4.5-lts.1 pdf-parse@^1.1.1 mammoth@^1.6.0 uuid@^9.0.1 morgan@^1.10.0 helmet@^7.1.0
```

Install dev dependencies:

```bash
npm install -D nodemon@^3.0.2
```

## Post-Installation Setup

### 1. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# ICA Workflow API Configuration
ICA_API_URL=https://api.ica.ibm.com/workflow
ICA_API_KEY=your_ica_api_key_here

# Data Storage
DATA_DIR=./data
UPLOADS_DIR=./uploads
```

### 2. Create Required Directories

```bash
mkdir -p data uploads
```

### 3. Verify Installation

Check that all dependencies are installed:

```bash
npm list --depth=0
```

### 4. Start Development Server

```bash
npm run dev
```

The server should start at [http://localhost:5000](http://localhost:5000)

### 5. Test API Health

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Available Scripts

```bash
# Start production server
npm start

# Start development server with auto-restart
npm run dev

# Run tests (not yet implemented)
npm test
```

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
node --version  # Should be 20.x or higher
npm --version   # Should be 8.x or higher
```

### Port already in use

If port 5000 is already in use, change it in `.env`:

```env
PORT=5001
```

### File upload issues

Ensure the uploads directory exists and has write permissions:

```bash
mkdir -p uploads
chmod 755 uploads
```

### PDF parsing errors

If pdf-parse fails to install, you may need to install canvas dependencies:

**Ubuntu/Debian:**
```bash
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
```

**macOS:**
```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg
```

**Windows:**
Install windows-build-tools:
```bash
npm install --global windows-build-tools
```

## Package Purposes

### express
Fast, unopinionated web framework for Node.js. Core of the API server.

### cors
Middleware to enable Cross-Origin Resource Sharing, allowing the React frontend to communicate with the backend.

### dotenv
Loads environment variables from `.env` file into `process.env`.

### axios
Promise-based HTTP client for making requests to the ICA Workflow API.

### multer
Middleware for handling `multipart/form-data`, used for file uploads in the document upload endpoint.

### pdf-parse
Pure JavaScript library for extracting text content from PDF files.

### mammoth
Converts DOCX files to HTML/text, used for extracting text from Word documents.

### uuid
Generates RFC4122 UUIDs for audit records and file identifiers.

### morgan
HTTP request logger middleware, logs all incoming requests for debugging and monitoring.

### helmet
Helps secure Express apps by setting various HTTP headers (XSS protection, content security policy, etc.).

### nodemon (dev)
Monitors for file changes and automatically restarts the server during development.

## API Endpoints

After installation, the following endpoints will be available:

- `GET /api/health` - Health check
- `POST /api/audit/upload` - Upload file for text extraction
- `POST /api/audit` - Submit text for audit
- `POST /api/audit/file` - Upload and audit file in one request
- `GET /api/audit/history` - Get audit history
- `GET /api/audit/:id` - Get specific audit
- `DELETE /api/audit/:id` - Delete audit

## Directory Structure

```
application/backend/
├── src/
│   ├── server.js              # Main server file
│   ├── config/
│   │   └── config.js          # Configuration
│   ├── routes/
│   │   └── auditRoutes.js     # API routes
│   ├── services/
│   │   ├── icaService.js      # ICA API integration
│   │   └── dataStore.js       # Data persistence
│   ├── utils/
│   │   ├── fileExtractor.js   # Text extraction
│   │   └── logger.js          # Logging utility
│   └── middleware/
│       └── errorHandler.js    # Error handling
├── data/                      # Audit results storage
├── uploads/                   # Uploaded files
├── .env                       # Environment variables
├── .env.example              # Environment template
├── package.json              # Dependencies
└── INSTALL.md                # This file
```

## Next Steps

After installation, refer to the main backend README for:
- API documentation
- ICA integration setup
- Development workflow
- Deployment instructions