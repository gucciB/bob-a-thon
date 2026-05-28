# System Architecture: Compliance Audit Intelligence Platform

## Architecture Overview

The Compliance Audit Intelligence Platform is built on a modern, scalable architecture that combines multi-agent AI orchestration with enterprise knowledge management to deliver automated compliance auditing capabilities.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE LAYER                      │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │           React 18 Web Application (Vite)              │    │
│  │                                                         │    │
│  │  • Document Upload Interface                           │    │
│  │  • Real-time Processing Status                         │    │
│  │  • Compliance Dashboard & Metrics                      │    │
│  │  • Risk Findings Table                                 │    │
│  │  • Audit Report Viewer                                 │    │
│  │  • Audit History Management                            │    │
│  └────────────────────────────────────────────────────────┘    │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTPS/REST API
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                            │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │         Node.js/Express Backend API Server             │    │
│  │                                                         │    │
│  │  • REST API Endpoints                                  │    │
│  │  • File Upload & Processing (Multer)                   │    │
│  │  • Document Text Extraction (PDF/DOCX)                 │    │
│  │  • Audit Data Management                               │    │
│  │  • ICA Workflow Integration                            │    │
│  │  • Security & Authentication                           │    │
│  └────────────────────────────────────────────────────────┘    │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTPS/REST API
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   ORCHESTRATION LAYER                            │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │      IBM ICA Agentic App Studio - Workflow Engine      │    │
│  │                                                         │    │
│  │  ┌──────────────────────────────────────────────────┐ │    │
│  │  │         4-Agent Processing Pipeline              │ │    │
│  │  │                                                  │ │    │
│  │  │  [Input] → [Agent 1] → [Agent 2] →             │ │    │
│  │  │            [Agent 3] → [Agent 4] → [Output]     │ │    │
│  │  │                                                  │ │    │
│  │  │  • Sequential execution                         │ │    │
│  │  │  • Data transformation between stages           │ │    │
│  │  │  • Error handling & retry logic                 │ │    │
│  │  │  • Execution monitoring                         │ │    │
│  │  └──────────────────────────────────────────────────┘ │    │
│  └────────────────────────────────────────────────────────┘    │
└───────────────────────────┬─────────────────────────────────────┘
                            │ MCP Protocol
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    KNOWLEDGE LAYER                               │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │         IBM ICA Context Studio (MCP Server)            │    │
│  │                                                         │    │
│  │  ┌──────────────────────────────────────────────────┐ │    │
│  │  │         Compliance Ontology (JSON-LD)            │ │    │
│  │  │                                                  │ │    │
│  │  │  • RegulationClause entities                    │ │    │
│  │  │  • PolicySection entities                       │ │    │
│  │  │  • ComplianceGap entities                       │ │    │
│  │  │  • RiskFinding entities                         │ │    │
│  │  │  • Relationships & Operations                   │ │    │
│  │  └──────────────────────────────────────────────────┘ │    │
│  │                                                         │    │
│  │  ┌──────────────────────────────────────────────────┐ │    │
│  │  │         Knowledge Graph                          │ │    │
│  │  │                                                  │ │    │
│  │  │  • GDPR Articles (99 articles)                  │ │    │
│  │  │  • ISO 27001 Controls (114 controls)            │ │    │
│  │  │  • SOC 2 Criteria                               │ │    │
│  │  │  • Semantic relationships                       │ │    │
│  │  │  • Vector embeddings                            │ │    │
│  │  └──────────────────────────────────────────────────┘ │    │
│  │                                                         │    │
│  │  ┌──────────────────────────────────────────────────┐ │    │
│  │  │         MCP Tools                                │ │    │
│  │  │                                                  │ │    │
│  │  │  • vector_query - Semantic search               │ │    │
│  │  │  • graph_query - Relationship traversal         │ │    │
│  │  │  • document_search - Full-text search           │ │    │
│  │  │  • context_retrieve - Context extraction        │ │    │
│  │  └──────────────────────────────────────────────────┘ │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### 1. Frontend Layer (React Application)

**Technology Stack:**
- React 18 with Hooks
- Vite (build tool)
- Tailwind CSS (styling)
- Axios (HTTP client)
- React Context API (state management)

**Key Components:**

```
frontend/
├── src/
│   ├── App.jsx                      # Main application shell
│   ├── index.jsx                    # Entry point
│   ├── index.css                    # Global styles
│   │
│   ├── components/                  # UI Components
│   │   ├── Header.jsx              # Navigation header
│   │   ├── Sidebar.jsx             # Navigation sidebar
│   │   ├── DocumentUploadForm.jsx  # File upload interface
│   │   ├── ProcessingStatusBar.jsx # Pipeline progress
│   │   ├── ComplianceDashboard.jsx # Metrics visualization
│   │   ├── RiskFindingsTable.jsx   # Findings display
│   │   ├── AuditReportViewer.jsx   # Report renderer
│   │   └── AuditHistoryList.jsx    # History browser
│   │
│   ├── context/                     # State Management
│   │   └── AuditContext.jsx        # Global audit state
│   │
│   └── services/                    # API Integration
│       ├── auditService.js         # Backend API client
│       └── mockApi.js              # Development mock data
│
└── public/                          # Static assets
    └── index.html                   # HTML template
```

**State Management Flow:**

```
┌─────────────────────────────────────────────────────────┐
│                    AuditContext                          │
│                                                          │
│  State:                                                  │
│  • currentAudit: { id, status, results, ... }          │
│  • auditHistory: [audit1, audit2, ...]                 │
│  • isProcessing: boolean                                │
│  • error: string | null                                 │
│                                                          │
│  Actions:                                                │
│  • startAudit(documentText)                             │
│  • updateAuditStatus(status)                            │
│  • setAuditResults(results)                             │
│  • loadAuditHistory()                                   │
│  • deleteAudit(id)                                      │
│                                                          │
│  Persistence:                                            │
│  • localStorage for audit history                       │
│  • Session storage for current audit                    │
└─────────────────────────────────────────────────────────┘
```

### 2. Backend Layer (Node.js/Express API)

**Technology Stack:**
- Node.js 20+
- Express 4.x
- Multer (file uploads)
- pdf-parse (PDF extraction)
- mammoth (DOCX extraction)
- Axios (ICA API client)

**Architecture:**

```
backend/
├── src/
│   ├── server.js                    # Express server setup
│   │
│   ├── config/                      # Configuration
│   │   └── config.js               # Environment config
│   │
│   ├── routes/                      # API Routes
│   │   └── auditRoutes.js          # Audit endpoints
│   │
│   ├── services/                    # Business Logic
│   │   ├── icaService.js           # ICA API integration
│   │   ├── dataStore.js            # Data persistence
│   │   └── workflowService.js      # Workflow management
│   │
│   ├── middleware/                  # Express Middleware
│   │   └── errorHandler.js         # Error handling
│   │
│   └── utils/                       # Utilities
│       ├── fileExtractor.js        # Document processing
│       └── logger.js               # Logging
│
├── data/                            # Audit results storage
└── uploads/                         # Uploaded files
```

**API Endpoints:**

```
GET  /api/health
     → Health check endpoint
     → Returns: { status: "ok", timestamp: "..." }

POST /api/audit/upload
     → Upload file and extract text
     → Body: multipart/form-data with file
     → Returns: { text: "...", filename: "..." }

POST /api/audit
     → Submit text for audit
     → Body: { text: "...", documentName: "..." }
     → Returns: { auditId: "...", status: "processing" }

POST /api/audit/file
     → Upload and audit file in one request
     → Body: multipart/form-data with file
     → Returns: { auditId: "...", status: "processing" }

GET  /api/audit/history
     → Get all audit history
     → Returns: [{ id, name, date, status, ... }]

GET  /api/audit/:id
     → Get specific audit results
     → Returns: { id, results, status, ... }

DELETE /api/audit/:id
       → Delete audit record
       → Returns: { success: true }
```

**Request/Response Flow:**

```
Client Request
     ↓
Express Middleware Stack
     ↓
Route Handler
     ↓
Service Layer (icaService)
     ↓
ICA Workflow API Call
     ↓
Agent Pipeline Execution
     ↓
Results Processing
     ↓
Data Storage (dataStore)
     ↓
Response to Client
```

### 3. Orchestration Layer (ICA Agentic App Studio)

**Workflow Architecture:**

```
┌─────────────────────────────────────────────────────────┐
│              Compliance Audit Pipeline                   │
│                                                          │
│  Input: Document text                                   │
│    ↓                                                     │
│  ┌────────────────────────────────────────────────┐    │
│  │  Agent 1: Document Reader                      │    │
│  │  • Extracts structured content                 │    │
│  │  • Identifies document type                    │    │
│  │  • Segments into sections                      │    │
│  │  Output: { documentType, sections[] }          │    │
│  └────────────────────────────────────────────────┘    │
│    ↓                                                     │
│  ┌────────────────────────────────────────────────┐    │
│  │  Agent 2: Regulation Mapper                    │    │
│  │  • Queries MCP for regulations                 │    │
│  │  • Maps sections to requirements               │    │
│  │  • Identifies applicable frameworks            │    │
│  │  Output: { mappings[] }                        │    │
│  └────────────────────────────────────────────────┘    │
│    ↓                                                     │
│  ┌────────────────────────────────────────────────┐    │
│  │  Agent 3: Risk Detector                        │    │
│  │  • Compares content vs requirements            │    │
│  │  • Identifies compliance gaps                  │    │
│  │  • Assigns risk levels & scores                │    │
│  │  Output: { riskFindings[], overallRisk }      │    │
│  └────────────────────────────────────────────────┘    │
│    ↓                                                     │
│  ┌────────────────────────────────────────────────┐    │
│  │  Agent 4: Report Generator                     │    │
│  │  • Aggregates all findings                     │    │
│  │  • Generates structured report                 │    │
│  │  • Provides remediation roadmap                │    │
│  │  Output: Markdown audit report                 │    │
│  └────────────────────────────────────────────────┘    │
│    ↓                                                     │
│  Output: Complete audit report                          │
└─────────────────────────────────────────────────────────┘
```

**Agent Specifications:**

| Agent | Model | Framework | Tools | MCP Access |
|-------|-------|-----------|-------|------------|
| Document Reader | GPT-5.1 | Strands | None | No |
| Regulation Mapper | GPT-5.1 | Strands | vector_query, graph_query | Yes |
| Risk Detector | GPT-5.1 | Strands | vector_query, document_search | Yes |
| Report Generator | GPT-5.1 | Strands | None | No |

**Data Transformation Between Agents:**

```
Stage 1 Output (Document Reader):
{
  "documentType": "SECURITY_POLICY",
  "documentName": "Data Protection Policy",
  "sections": [
    {
      "sectionTitle": "Data Retention",
      "sectionContent": "...",
      "relevanceCategory": "DATA_PRIVACY"
    }
  ]
}

Stage 2 Output (Regulation Mapper):
{
  "mappings": [
    {
      "sectionTitle": "Data Retention",
      "applicableRegulations": [
        {
          "regulationName": "GDPR",
          "articleOrControl": "Article 5(1)(e)",
          "requirementDescription": "...",
          "mandatory": true
        }
      ]
    }
  ]
}

Stage 3 Output (Risk Detector):
{
  "riskFindings": [
    {
      "findingId": "uuid",
      "findingTitle": "Missing Retention Period",
      "riskLevel": "HIGH",
      "riskScore": 9,
      "evidence": "...",
      "remediationSuggestion": "..."
    }
  ],
  "overallRiskLevel": "HIGH",
  "overallRiskScore": 8.5
}

Stage 4 Output (Report Generator):
Markdown-formatted audit report with:
- Executive summary
- Risk table
- Detailed findings
- Remediation roadmap
```

### 4. Knowledge Layer (ICA Context Studio)

**Ontology Structure:**

```
Compliance Ontology (JSON-LD)
│
├── Entities
│   ├── RegulationClause
│   │   ├── clauseId: UUID
│   │   ├── regulationName: GDPR | ISO27001 | SOC2
│   │   ├── articleNumber: string
│   │   ├── clauseTitle: string
│   │   ├── clauseDescription: string
│   │   ├── category: enum
│   │   └── mandatory: boolean
│   │
│   ├── PolicySection
│   │   ├── sectionId: UUID
│   │   ├── documentName: string
│   │   ├── sectionTitle: string
│   │   ├── sectionContent: string
│   │   └── documentType: enum
│   │
│   ├── ComplianceGap
│   │   ├── gapId: UUID
│   │   ├── gapDescription: string
│   │   ├── affectedClause: reference
│   │   ├── affectedSection: reference
│   │   └── riskLevel: HIGH | MEDIUM | LOW
│   │
│   ├── RiskFinding
│   │   ├── findingId: UUID
│   │   ├── findingTitle: string
│   │   ├── findingDescription: string
│   │   ├── riskScore: 1-10
│   │   ├── riskLevel: enum
│   │   ├── regulationReference: reference
│   │   └── remediationSuggestion: string
│   │
│   ├── AuditDocument
│   │   ├── documentId: UUID
│   │   ├── documentName: string
│   │   ├── documentType: enum
│   │   ├── uploadDate: datetime
│   │   └── auditStatus: enum
│   │
│   └── RemediationAction
│       ├── actionId: UUID
│       ├── actionTitle: string
│       ├── actionDescription: string
│       ├── priority: enum
│       └── targetClause: reference
│
└── Relationships
    ├── PolicySection → mapsTo → RegulationClause
    ├── ComplianceGap → identifiedIn → PolicySection
    ├── ComplianceGap → violates → RegulationClause
    ├── RiskFinding → containsGap → ComplianceGap
    ├── AuditDocument → hasSection → PolicySection
    └── RemediationAction → addressesGap → ComplianceGap
```

**MCP Integration:**

```
┌─────────────────────────────────────────────────────────┐
│              MCP Server (Context Studio)                 │
│                                                          │
│  Exposed Tools:                                          │
│                                                          │
│  1. vector_query(query, context_id)                     │
│     → Semantic search over knowledge graph              │
│     → Returns: Relevant entities with similarity scores │
│                                                          │
│  2. graph_query(entity_id, relationship_type)           │
│     → Traverse relationships in knowledge graph         │
│     → Returns: Connected entities                       │
│                                                          │
│  3. document_search(keywords, context_id)               │
│     → Full-text search over documents                   │
│     → Returns: Matching document sections               │
│                                                          │
│  4. context_retrieve(context_id)                        │
│     → Retrieve full context metadata                    │
│     → Returns: Context schema and statistics            │
│                                                          │
│  Authentication:                                         │
│  • Bearer token authentication                          │
│  • Context-specific access control                      │
│                                                          │
│  Transport:                                              │
│  • Streamable HTTP                                      │
│  • JSON request/response format                         │
└─────────────────────────────────────────────────────────┘
```

## Data Flow Architecture

### End-to-End Audit Flow

```
1. User uploads document
   ↓
2. Frontend → POST /api/audit/file
   ↓
3. Backend extracts text (PDF/DOCX)
   ↓
4. Backend → POST to ICA Workflow API
   ↓
5. ICA Workflow starts agent pipeline
   ↓
6. Agent 1 (Document Reader)
   • Receives: Raw text
   • Processes: Extracts sections
   • Outputs: Structured document
   ↓
7. Agent 2 (Regulation Mapper)
   • Receives: Structured document
   • Queries: MCP vector_query for regulations
   • Processes: Maps sections to requirements
   • Outputs: Regulation mappings
   ↓
8. Agent 3 (Risk Detector)
   • Receives: Regulation mappings
   • Queries: MCP graph_query for risk rules
   • Processes: Identifies gaps, assigns risk
   • Outputs: Risk findings
   ↓
9. Agent 4 (Report Generator)
   • Receives: Risk findings
   • Processes: Generates report
   • Outputs: Markdown report
   ↓
10. ICA Workflow returns results
    ↓
11. Backend stores results in data/
    ↓
12. Backend → Response to frontend
    ↓
13. Frontend displays results
```

## Security Architecture

### Authentication & Authorization

```
┌─────────────────────────────────────────────────────────┐
│                    Security Layers                       │
│                                                          │
│  1. Frontend Security                                    │
│     • HTTPS only                                         │
│     • Content Security Policy                           │
│     • XSS protection                                    │
│     • CSRF tokens                                       │
│                                                          │
│  2. Backend Security                                     │
│     • Helmet.js security headers                        │
│     • CORS configuration                                │
│     • Rate limiting                                     │
│     • Input validation                                  │
│     • File type validation                              │
│     • File size limits                                  │
│                                                          │
│  3. API Security                                         │
│     • API key authentication (ICA)                      │
│     • Bearer token authentication (MCP)                 │
│     • Request signing                                   │
│     • Encrypted credentials                             │
│                                                          │
│  4. Data Security                                        │
│     • Encrypted data at rest                            │
│     • Encrypted data in transit (TLS)                   │
│     • Secure file storage                               │
│     • Audit logging                                     │
└─────────────────────────────────────────────────────────┘
```

## Deployment Architecture

### Production Deployment

```
┌─────────────────────────────────────────────────────────┐
│                    Load Balancer                         │
│                   (nginx/AWS ALB)                        │
└────────────────┬────────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
┌──────────────┐  ┌──────────────┐
│   Frontend   │  │   Frontend   │
│   Instance   │  │   Instance   │
│   (Static)   │  │   (Static)   │
└──────────────┘  └──────────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
┌──────────────┐  ┌──────────────┐
│   Backend    │  │   Backend    │
│   API Server │  │   API Server │
│   (Node.js)  │  │   (Node.js)  │
└──────┬───────┘  └──────┬───────┘
       │                 │
       └────────┬────────┘
                ▼
       ┌─────────────────┐
       │  Shared Storage │
       │  (NFS/S3)       │
       │  • Uploads      │
       │  • Audit Data   │
       └─────────────────┘
                │
                ▼
       ┌─────────────────┐
       │   ICA Platform  │
       │   • Workflow    │
       │   • Agents      │
       │   • Context     │
       └─────────────────┘
```

### Scalability Considerations

**Horizontal Scaling:**
- Multiple frontend instances (static hosting)
- Multiple backend API instances (stateless)
- Load balancing across instances
- Shared storage for uploads and data

**Vertical Scaling:**
- Increase backend instance resources
- Optimize agent execution
- Cache frequently accessed context

**Performance Optimization:**
- CDN for frontend assets
- API response caching
- Database indexing for audit history
- Async processing for large documents

## Monitoring & Observability

```
┌─────────────────────────────────────────────────────────┐
│                  Monitoring Stack                        │
│                                                          │
│  Application Monitoring:                                 │
│  • Request/response times                               │
│  • Error rates                                          │
│  • API endpoint performance                             │
│  • Agent execution times                                │
│                                                          │
│  Infrastructure Monitoring:                              │
│  • CPU/Memory usage                                     │
│  • Network I/O                                          │
│  • Disk usage                                           │
│  • Container health                                     │
│                                                          │
│  Business Metrics:                                       │
│  • Audits processed per day                             │
│  • Average audit completion time                        │
│  • User engagement metrics                              │
│  • Compliance score trends                              │
│                                                          │
│  Logging:                                                │
│  • Structured JSON logs                                 │
│  • Centralized log aggregation                          │
│  • Log retention policies                               │
│  • Audit trail for compliance                           │
└─────────────────────────────────────────────────────────┘
```

## Technology Decisions & Rationale

| Technology | Rationale |
|------------|-----------|
| **React 18** | Modern UI library with excellent ecosystem, hooks for state management |
| **Vite** | Fast build tool, better DX than Create React App, optimized for production |
| **Tailwind CSS** | Utility-first CSS, rapid UI development, consistent design system |
| **Node.js/Express** | JavaScript full-stack, large ecosystem, excellent for API development |
| **ICA Agentic App Studio** | Enterprise-grade agent orchestration, built-in monitoring, IBM integration |
| **ICA Context Studio** | Semantic knowledge management, MCP support, enterprise-ready |
| **JSON-LD** | Standard for semantic web, interoperable, supports knowledge graphs |
| **MCP** | Standardized context protocol, vendor-neutral, future-proof |

---

**Architecture Version**: 1.0  
**Last Updated**: 2026-05-28  
**Status**: Production-Ready