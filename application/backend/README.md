# Compliance Audit Intelligence Platform - Backend API

Node.js Express backend API for the Compliance Audit Intelligence Platform. Provides endpoints for document upload, text extraction, compliance auditing, and audit history management.

## Features

- **File Upload & Text Extraction**: Support for PDF, DOCX, DOC, and TXT files
- **Compliance Auditing**: Integration with ICA Workflow API (with mock fallback)
- **Audit History**: JSON file-based storage for audit results
- **CORS Support**: Configurable cross-origin resource sharing
- **Error Handling**: Comprehensive error handling and logging
- **Request Logging**: Morgan-based HTTP request logging
- **Security**: Helmet.js security headers

## Technology Stack

- **Node.js 20+**: JavaScript runtime
- **Express.js**: Web application framework
- **Multer**: File upload handling
- **pdf-parse**: PDF text extraction
- **Mammoth**: DOCX text extraction
- **Axios**: HTTP client for ICA API calls
- **Morgan**: HTTP request logger
- **Helmet**: Security middleware
- **dotenv**: Environment variable management

## Installation

### Prerequisites
- Node.js 20 or higher
- npm or yarn

### Setup Steps

1. **Navigate to backend directory**:
   ```bash
   cd application/backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   ```env
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ICA_API_URL=https://api.ica.ibm.com/workflow
   ICA_API_KEY=your_api_key_here
   ICA_WORKFLOW_ID=compliance-audit-workflow
   ```

4. **Start the server**:
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Verify server is running**:
   ```bash
   curl http://localhost:5000/health
   ```

## API Endpoints

### Health Check

**GET** `/health`

Check if the API is running.

**Response:**
```json
{
  "success": true,
  "message": "Compliance Audit API is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

---

### Upload File and Extract Text

**POST** `/api/audit/upload`

Upload a document file and extract text content.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` (PDF, DOCX, DOC, or TXT file)

**Response:**
```json
{
  "success": true,
  "data": {
    "text": "Extracted document text...",
    "filename": "policy.pdf",
    "size": 102400,
    "extractedLength": 5000
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/audit/upload \
  -F "file=@policy.pdf"
```

---

### Perform Compliance Audit

**POST** `/api/audit`

Perform compliance audit on document text.

**Request:**
```json
{
  "text": "Document text to audit...",
  "documentType": "privacy-policy",
  "documentName": "Corporate Privacy Policy v2.3"
}
```

**Parameters:**
- `text` (required): Document text to audit
- `documentType` (required): One of `privacy-policy`, `security-policy`, `vendor-agreement`
- `documentName` (optional): Name of the document

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "documentName": "Corporate Privacy Policy v2.3",
    "documentType": "privacy-policy",
    "overallScore": 72,
    "complianceStatus": "PARTIALLY_COMPLIANT",
    "riskBreakdown": {
      "high": 3,
      "medium": 7,
      "low": 12
    },
    "complianceScores": {
      "gdpr": 68,
      "iso27001": 76
    },
    "findings": [...],
    "report": "# Compliance Audit Report..."
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/audit \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Privacy Policy content...",
    "documentType": "privacy-policy",
    "documentName": "Privacy Policy v1.0"
  }'
```

---

### Upload File and Audit (Combined)

**POST** `/api/audit/file`

Upload a file and perform audit in one request.

**Request:**
- Content-Type: `multipart/form-data`
- Body: 
  - `file` (required): Document file
  - `documentType` (required): Document type

**Response:**
Same as `/api/audit` endpoint

**Example:**
```bash
curl -X POST http://localhost:5000/api/audit/file \
  -F "file=@policy.pdf" \
  -F "documentType=privacy-policy"
```

---

### Get Audit History

**GET** `/api/audit/history`

Retrieve list of previous audits.

**Query Parameters:**
- `limit` (optional): Maximum number of audits to return (default: 50)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "date": "2024-01-15T10:30:00.000Z",
      "documentName": "Privacy Policy v2.3",
      "overallScore": 72,
      "status": "PARTIALLY_COMPLIANT"
    },
    ...
  ]
}
```

**Example:**
```bash
curl http://localhost:5000/api/audit/history?limit=10
```

---

### Get Specific Audit

**GET** `/api/audit/:id`

Retrieve a specific audit by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "documentName": "Privacy Policy v2.3",
    ...
  }
}
```

**Example:**
```bash
curl http://localhost:5000/api/audit/abc-123-def-456
```

---

### Delete Audit

**DELETE** `/api/audit/:id`

Delete a specific audit by ID.

**Response:**
```json
{
  "success": true,
  "message": "Audit abc-123-def-456 deleted successfully"
}
```

**Example:**
```bash
curl -X DELETE http://localhost:5000/api/audit/abc-123-def-456
```

---

## Project Structure

```
application/backend/
├── src/
│   ├── config/
│   │   └── config.js              # Configuration management
│   ├── middleware/
│   │   └── errorHandler.js        # Error handling middleware
│   ├── routes/
│   │   └── auditRoutes.js         # API route definitions
│   ├── services/
│   │   ├── dataStore.js           # JSON file-based data storage
│   │   └── icaService.js          # ICA Workflow API integration
│   ├── utils/
│   │   ├── logger.js              # Logging utility
│   │   └── fileExtractor.js       # Text extraction utilities
│   └── server.js                  # Express server setup
├── data/
│   └── audits.json                # Audit data storage (auto-created)
├── logs/
│   └── app.log                    # Application logs (auto-created)
├── uploads/                       # Temporary file uploads (auto-created)
├── .env                           # Environment variables
├── .env.example                   # Environment variables template
├── .gitignore                     # Git ignore rules
├── package.json                   # Dependencies and scripts
└── README.md                      # This file
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |
| `ICA_API_URL` | ICA Workflow API URL | - |
| `ICA_API_KEY` | ICA API authentication key | - |
| `ICA_WORKFLOW_ID` | ICA Workflow identifier | - |
| `DATA_STORE_PATH` | Path to audit data file | `./data/audits.json` |
| `MAX_FILE_SIZE` | Maximum upload file size (bytes) | `10485760` (10MB) |
| `UPLOAD_DIR` | Temporary upload directory | `./uploads` |

### File Upload Limits

- **Maximum file size**: 10MB (configurable)
- **Supported formats**: PDF, DOCX, DOC, TXT
- **MIME types**: 
  - `application/pdf`
  - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
  - `application/msword`
  - `text/plain`

## ICA Workflow Integration

The backend is designed to integrate with IBM ICA (Intelligent Compliance Automation) Workflow API. 

### Current Implementation

The current implementation includes:
- Mock audit generation for demonstration
- Placeholder for ICA API integration
- Automatic fallback to mock data if ICA API is unavailable

### Enabling ICA Integration

To enable real ICA API integration:

1. **Configure environment variables**:
   ```env
   ICA_API_URL=https://api.ica.ibm.com/workflow
   ICA_API_KEY=your_actual_api_key
   ICA_WORKFLOW_ID=your_workflow_id
   ```

2. **Update `src/services/icaService.js`**:
   - Uncomment the actual API call code
   - Configure request/response mapping
   - Add authentication headers

3. **Test the integration**:
   ```bash
   npm run dev
   # Make test API calls
   ```

## Data Storage

Audit results are stored in a JSON file (`data/audits.json`). This is suitable for development and small-scale deployments.

### Storage Features

- Automatic file creation
- Stores last 100 audits
- Thread-safe read/write operations
- Automatic cleanup of old audits

### Migrating to Database

For production deployments, consider migrating to a database:

1. **PostgreSQL**:
   ```javascript
   // Replace dataStore.js with PostgreSQL client
   const { Pool } = require('pg');
   ```

2. **MongoDB**:
   ```javascript
   // Replace dataStore.js with MongoDB client
   const { MongoClient } = require('mongodb');
   ```

3. **Update `src/services/dataStore.js`** with database operations

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "stack": "Stack trace (development only)"
  }
}
```

### HTTP Status Codes

- `200`: Success
- `400`: Bad Request (invalid input)
- `404`: Not Found
- `500`: Internal Server Error

## Logging

Logs are written to:
- Console (all environments)
- `logs/app.log` file (persistent storage)

### Log Levels

- `INFO`: General information
- `WARN`: Warning messages
- `ERROR`: Error messages
- `DEBUG`: Debug information (development only)

## Security

### Implemented Security Measures

- **Helmet.js**: Security headers
- **CORS**: Configurable origin restrictions
- **File validation**: MIME type checking
- **File size limits**: Prevent large uploads
- **Input validation**: Request body validation
- **Error sanitization**: No sensitive data in errors

### Additional Recommendations

For production:
- Enable HTTPS
- Add rate limiting
- Implement authentication (JWT)
- Add request validation middleware
- Enable API key authentication
- Set up monitoring and alerting

## Development

### Running in Development Mode

```bash
npm run dev
```

Uses `nodemon` for automatic server restart on file changes.

### Testing API Endpoints

Use tools like:
- **curl**: Command-line testing
- **Postman**: GUI-based testing
- **Thunder Client**: VS Code extension

### Debugging

Enable debug logs:
```env
NODE_ENV=development
```

View logs:
```bash
tail -f logs/app.log
```

## Deployment

### Production Build

1. **Set environment to production**:
   ```env
   NODE_ENV=production
   ```

2. **Install production dependencies only**:
   ```bash
   npm install --production
   ```

3. **Start server**:
   ```bash
   npm start
   ```

### Using Process Manager

**PM2** (recommended):
```bash
npm install -g pm2
pm2 start src/server.js --name compliance-api
pm2 save
pm2 startup
```

### Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t compliance-api .
docker run -p 5000:5000 --env-file .env compliance-api
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### File Upload Fails

- Check file size (max 10MB)
- Verify MIME type is supported
- Ensure `uploads/` directory is writable

### ICA API Connection Issues

- Verify API credentials in `.env`
- Check network connectivity
- Review API endpoint URL
- System falls back to mock data automatically

### Data Store Issues

- Ensure `data/` directory exists and is writable
- Check `audits.json` file permissions
- Verify disk space availability

## Contributing

1. Follow existing code style
2. Add error handling for new features
3. Update documentation
4. Test all endpoints before committing

## License

Part of the Bob-a-thon hackathon submission for AI Compliance & Policy Audit Agent.

---

**Built with Node.js and Express.js**