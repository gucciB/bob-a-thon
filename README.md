# Compliance Audit Intelligence Platform

Enterprise-grade AI-powered compliance auditing system built with React and Node.js, featuring automated policy analysis, risk detection, and regulatory mapping.

![IBM Consulting](https://img.shields.io/badge/IBM-Consulting-0f62fe?style=for-the-badge&logo=ibm)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20.x or higher
- **npm** 8.x or higher
- **Git** (for cloning)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd AI-Compliance-and-Policy-Audit-Agent
```

2. **Install Backend Dependencies**
```bash
cd application/backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

4. **Configure Environment Variables**

**Backend** (`application/backend/.env`):
```bash
cd application/backend
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
ICA_API_URL=https://api.ica.ibm.com/workflow
ICA_API_KEY=your_ica_api_key_here
DATA_DIR=./data
UPLOADS_DIR=./uploads
```

**Frontend** (`application/frontend/.env`):
```bash
cd application/frontend
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_API_URL=http://localhost:5000
```

5. **Create Required Directories**
```bash
cd application/backend
mkdir -p data uploads
```

### Running the Application

**Terminal 1 - Backend Server:**
```bash
cd application/backend
npm run dev
```
Server starts at: http://localhost:5000

**Terminal 2 - Frontend Application:**
```bash
cd application/frontend
npm start
```
Application opens at: http://localhost:3000

## 📋 Features

### 🎯 Core Capabilities

- **Document Upload & Analysis**
  - Drag-and-drop file upload (PDF, DOCX, TXT)
  - Manual text input option
  - Real-time text extraction
  - Document metadata management

- **Automated Compliance Auditing**
  - 4-stage processing pipeline
  - Regulation mapping (GDPR, ISO 27001, SOC 2, HIPAA)
  - Risk detection and scoring
  - Compliance gap identification

- **Interactive Dashboard**
  - Overall compliance score visualization
  - Risk breakdown (HIGH/MEDIUM/LOW)
  - Regulation-specific scorecards
  - Status indicators

- **Detailed Findings Analysis**
  - Sortable, filterable findings table
  - Risk level categorization
  - Expandable row details
  - Remediation recommendations

- **Comprehensive Reporting**
  - Markdown-rendered audit reports
  - Remediation roadmap (3 priority levels)
  - Export to PDF functionality
  - Print-optimized layout

- **Audit History Management**
  - Browse previous audits
  - Search and filter capabilities
  - Reload historical results
  - Delete audit records

### 🎨 UI/UX Features

- **IBM Carbon Design System**
  - Professional enterprise styling
  - Dark theme interface
  - Responsive layout
  - Accessible components

- **Real-time Progress Tracking**
  - Visual pipeline status
  - Stage-by-stage updates
  - Animated progress indicators

- **State Management**
  - React Context API
  - localStorage persistence
  - Optimistic UI updates

## 🏗️ Architecture

### Technology Stack

#### Frontend
- **React 18** - Modern UI library
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **React Markdown** - Report rendering
- **React Dropzone** - File uploads
- **Recharts** - Data visualization
- **@heroicons/react** - Icon library

#### Backend
- **Express** - Web framework
- **Multer** - File upload handling
- **pdf-parse** - PDF text extraction
- **mammoth** - DOCX text extraction
- **Axios** - ICA API integration
- **Morgan** - HTTP logging
- **Helmet** - Security headers

### Project Structure

```
AI-Compliance-and-Policy-Audit-Agent/
├── application/
│   ├── frontend/                 # React application
│   │   ├── public/              # Static assets
│   │   ├── src/
│   │   │   ├── components/      # React components
│   │   │   ├── context/         # State management
│   │   │   ├── services/        # API services
│   │   │   ├── App.jsx          # Main app component
│   │   │   └── index.jsx        # Entry point
│   │   ├── package.json
│   │   ├── INSTALL.md          # Frontend installation guide
│   │   └── README.md           # Frontend documentation
│   │
│   └── backend/                 # Node.js API server
│       ├── src/
│       │   ├── routes/          # API endpoints
│       │   ├── services/        # Business logic
│       │   ├── utils/           # Utilities
│       │   ├── middleware/      # Express middleware
│       │   └── server.js        # Server entry point
│       ├── data/                # Audit results storage
│       ├── uploads/             # Uploaded files
│       ├── package.json
│       ├── INSTALL.md          # Backend installation guide
│       └── .env.example        # Environment template
│
├── docs/                        # Documentation
│   ├── problem-statements/      # Problem definitions
│   └── context-docs/           # Reference documents
│
├── schema/                      # Ontology schemas
│   └── compliance-audit-ontology.jsonld
│
├── agent-configurations/        # Agent configs
│   ├── document-reader/
│   ├── regulation-mapper/
│   ├── risk-detector/
│   └── report-generator/
│
└── README.md                    # This file
```

## 🔧 Development

### Available Scripts

#### Frontend
```bash
npm start       # Start development server (port 3000)
npm run build   # Create production build
npm test        # Run tests
```

#### Backend
```bash
npm start       # Start production server
npm run dev     # Start development server with auto-restart
npm test        # Run tests
```

### API Endpoints

**Base URL:** `http://localhost:5000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/audit/upload` | Upload file for text extraction |
| POST | `/audit` | Submit text for audit |
| POST | `/audit/file` | Upload and audit file |
| GET | `/audit/history` | Get audit history |
| GET | `/audit/:id` | Get specific audit |
| DELETE | `/audit/:id` | Delete audit |

### Environment Variables

#### Backend
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - Allowed CORS origin
- `ICA_API_URL` - ICA Workflow API URL
- `ICA_API_KEY` - ICA API authentication key
- `DATA_DIR` - Audit results directory
- `UPLOADS_DIR` - File uploads directory

#### Frontend
- `REACT_APP_API_URL` - Backend API URL

## 📊 Compliance Regulations Supported

- **GDPR** - General Data Protection Regulation
- **ISO 27001** - Information Security Management
- **SOC 2** - Service Organization Control 2
- **HIPAA** - Health Insurance Portability and Accountability Act

## 🔒 Security Features

- **CORS Protection** - Configured origins
- **Helmet Security Headers** - XSS, CSP, etc.
- **Input Validation** - File type and size checks
- **Error Handling** - Secure error messages
- **Environment Variables** - Sensitive data protection

## 🧪 Testing

### Frontend Testing
```bash
cd application/frontend
npm test
```

### Backend Testing
```bash
cd application/backend
npm test
```

### Manual Testing
1. Start both frontend and backend servers
2. Navigate to http://localhost:3000
3. Upload a sample policy document
4. Verify audit processing pipeline
5. Check dashboard, findings, and report

## 📦 Production Build

### Frontend
```bash
cd application/frontend
npm run build
```
Build artifacts in `build/` directory

### Backend
```bash
cd application/backend
npm start
```
Runs production server

### Deployment Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure production ICA API credentials
- [ ] Set secure CORS origins
- [ ] Enable HTTPS
- [ ] Configure reverse proxy (nginx/Apache)
- [ ] Set up process manager (PM2)
- [ ] Configure logging
- [ ] Set up monitoring
- [ ] Configure backups

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Change port in .env file
PORT=5001
```

**CORS Errors**
```bash
# Update CORS_ORIGIN in backend .env
CORS_ORIGIN=http://localhost:3000
```

**File Upload Fails**
```bash
# Ensure uploads directory exists
mkdir -p application/backend/uploads
chmod 755 application/backend/uploads
```

**PDF Parsing Errors**
- Install system dependencies (see backend INSTALL.md)
- Verify pdf-parse installation

**Module Not Found**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Documentation

- [Frontend Installation Guide](application/frontend/INSTALL.md)
- [Backend Installation Guide](application/backend/INSTALL.md)
- [Frontend README](application/frontend/README.md)
- [File Structure Guide](application/frontend/FILE_STRUCTURE.md)
- [Problem Statement](docs/problem-statements/problem.md)
- [Full Solution Guide](docs/problem-statements/full_solution.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**IBM Bob-a-thon Hackathon Submission**

- Multi-agent compliance auditing system
- IBM ICA Context Studio integration
- Model Context Protocol (MCP) implementation
- IBM Agentic App Studio orchestration

## 🙏 Acknowledgments

- IBM Consulting for the Bob-a-thon hackathon
- IBM Carbon Design System for UI components
- React and Node.js communities
- Open source contributors

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check documentation in `/docs`
- Review installation guides

---

**Built with ❤️ using IBM Technologies**

*Compliance Audit Intelligence Platform - Automating regulatory compliance through AI-powered analysis*