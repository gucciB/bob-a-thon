

## Step 3.5 — Get Workflow API Credentials

--- 


After testing the workflow successfully inside the studio, expose it as an API.

```

1. Navigate to → Workflow → API Access tab
2. Copy the Workflow API URL
   IMPORTANT URL CHANGE:
   Replace: agentstudio.servicesessentials.ibm.com
   With:    langflow.servicesessentials.ibm.com
3. Save your final API URL:
   https://langflow.servicesessentials.ibm.com/api/v1/run/YOUR_WORKFLOW_ID

```

## Step 3.6 — Generate API Key

```

1. Navigate to → Settings → API Keys
2. Click → Generate New API Key
3. Save immediately:
   WORKFLOW_API_KEY=your_generated_api_key
Best Practices:
✅ Store in .env file only
✅ Never commit to GitHub
✅ Rotate after Bob-a-thon

```

## Step 3.7 — Test Workflow API Using cURL
Ask BOB to generate the test cURL command:

```

Generate a cURL command to test my ICA workflow API.
API URL: https://langflow.servicesessentials.ibm.com/api/v1/run/YOUR_WORKFLOW_ID
API Key: YOUR_API_KEY
Send this test document for compliance audit:
"Employee data is retained indefinitely. 
HR team can access all data freely."
Use POST method with JSON body.
```

BOB will generate:

```

curl -X POST \
  "https://langflow.servicesessentials.ibm.com/api/v1/run/YOUR_WORKFLOW_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "input_value": "Audit this document: Employee data is retained indefinitely. HR team can access all data freely.",
    "output_type": "chat",
    "input_type": "chat"
  }'

```

Expected Result:

```

HTTP 200 response with structured compliance audit report

```

If you get HTTP `302` → check URL replacement (langflow vs agentstudio)
If you get `401` → check API key header format


# PHASE 4 — BUILD REACT FRONTEND (Day 2 Afternoon)

Inside your project folder, ask BOB:

```

Create a React web application for an enterprise 
Compliance Audit Intelligence Platform.
Application features:
1. Document Upload Panel
   - Drag and drop file upload
   - Support PDF and text input
   - Manual text paste option
   - Document type selector
2. Audit Dashboard
   - Overall compliance score (circular progress)
   - Risk breakdown: HIGH / MEDIUM / LOW counts
   - Compliance scorecard: GDPR % and ISO 27001 %
   - Status badge: COMPLIANT / PARTIALLY / NON-COMPLIANT
3. Findings Panel
   - Risk findings table with columns:
     Finding | Regulation | Risk Level | Score | Section
   - Color coded rows:
     RED for HIGH, ORANGE for MEDIUM, GREEN for LOW
   - Click to expand finding details
4. Audit Report Panel
   - Full markdown rendered report
   - Export button for PDF download
   - Print friendly view
5. Audit History Panel
   - List of previous audits
   - Date, document name, overall risk score
   - Click to reload previous report
Technology stack:
- React 18
- Tailwind CSS for styling
- Axios for API calls
- React Markdown for report rendering
- React Dropzone for file upload
- Recharts for compliance score visualization
Use professional enterprise UI design.
Dark sidebar navigation.
Clean card-based layout.
IBM Carbon Design inspired colors.

```


## Step 4.2 — Create Backend API Layer
Ask BOB to generate the backend:

```
Create a Node.js Express backend API for the 
Compliance Audit Intelligence Platform.
Endpoints needed:
POST /api/audit
- Accepts document text or file
- Calls ICA Workflow API
- Returns structured audit results
GET /api/audit/history
- Returns list of previous audits from memory/file store
GET /api/audit/:id
- Returns specific audit result by ID
POST /api/audit/upload
- Handles file upload
- Extracts text from PDF or DOCX
- Returns extracted text
Include:
- CORS configuration
- Environment variable usage for API keys
- Error handling middleware
- Request logging
- PDF text extraction using pdf-parse library
- Audit results stored in local JSON file store
Use Express.js, Node.js 20+.
Keep code clean and modular.
```

## Step 4.3 — Configure Environment Variables
Ask BOB:

```
Generate a .env file template for the 
Compliance Audit Platform backend.
Include variables for:
- ICA Workflow API URL
- ICA Workflow API Key
- Port number
- CORS allowed origins
- Storage file path
Also generate a .env.example file with 
placeholder values safe for GitHub.
```

BOB generates two files:

# .env (DO NOT COMMIT)
WORKFLOW_API_URL=https://langflow.servicesessentials.ibm.com/api/v1/run/YOUR_ID
WORKFLOW_API_KEY=your_actual_api_key
PORT=3001
CORS_ORIGIN=http://localhost:3000
AUDIT_STORE_PATH=./data/audits.json
# .env.example (SAFE TO COMMIT)
WORKFLOW_API_URL=https://langflow.servicesessentials.ibm.com/api/v1/run/YOUR_WORKFLOW_ID
WORKFLOW_API_KEY=your_workflow_api_key_here
PORT=3001
CORS_ORIGIN=http://localhost:3000
AUDIT_STORE_PATH=./data/audits.json


## Step 4.4 — Wire Frontend to Backend
Ask BOB:

```
Create an API service layer in React that connects 
the frontend to the Express backend.
Create file: src/services/auditService.js
Functions needed:
- submitAuditDocument(documentText, documentName, documentType)
  → calls POST /api/audit
  → returns audit results
- uploadDocumentFile(file)
  → calls POST /api/audit/upload
  → returns extracted text
- getAuditHistory()
  → calls GET /api/audit/history
  → returns list of past audits
- getAuditById(auditId)
  → calls GET /api/audit/:id
  → returns specific audit
Use Axios.
Read API base URL from environment variable: 
REACT_APP_API_URL
Handle loading states and error states.
```

## Step 4.5 — Build Compliance Score Dashboard Component
Ask BOB:

```
Create a React component: ComplianceDashboard.jsx
Display:
1. Large circular progress indicator showing 
   overall compliance percentage
   - Green if > 80%
   - Orange if 50-80%
   - Red if < 50%
2. Three metric cards:
   - HIGH Risk Findings (red card)
   - MEDIUM Risk Findings (orange card)
   - LOW Risk Findings (green card)
3. Regulation scorecard:
   - GDPR Compliance bar: [percentage]%
   - ISO 27001 Compliance bar: [percentage]%
4. Status banner:
   - COMPLIANT → green background
   - PARTIALLY COMPLIANT → orange background
   - NON-COMPLIANT → red background
Props: auditResult object
Use Recharts for circular progress.
Use Tailwind CSS for styling.
Make it visually impressive for demo.
```

Step 4.6 — Build Risk Findings Table Component
Ask BOB:

```
Create a React component: RiskFindingsTable.jsx
Display a professional data table with:
Columns:
- # (row number)
- Finding Title
- Violated Regulation
- Affected Section
- Risk Level (colored badge)
and necessary fields.
```

## Step 4.7 — Build Audit Report Viewer Component
Ask BOB:

```
Create a React component: AuditReportViewer.jsx
Display the full compliance audit report with:
1. Report Header
   - Document name audited
   - Audit date and time
   - Overall compliance status badge
   - Overall risk score
2. Markdown rendered report content
   - Use react-markdown library
   - Support tables, headings, lists
   - Professional typography
3. Export Options
   - Export as PDF button
     (use window.print() with print stylesheet)
   - Copy to clipboard button
4. Remediation Roadmap Section
   - Priority 1: Immediate (0-30 days) - RED
   - Priority 2: Short Term (30-90 days) - ORANGE
   - Priority 3: Long Term (90+ days) - GREEN
   - Each item shows regulation reference
Props: reportContent (markdown string), auditMeta object
Use Tailwind CSS for styling.
Make it print-friendly with @media print CSS.
```

## Step 4.8 — Build Document Upload Component
Ask BOB:
```
Create a React component: DocumentUpload.jsx
Features:
1. Drag and Drop Zone
   - Accept PDF, DOCX, TXT files
   - Show file name after drop
   - Show file size
   - Use react-dropzone library
2. Manual Text Input
   - Toggle between file upload and text paste
   - Large textarea for pasting document content
   - Character count display
3. Document Metadata Form
   - Document Name input field
   - Document Type selector:
     CONTRACT | SECURITY_POLICY | 
     HR_POLICY | GDPR_NOTICE | OTHER
   - Regulation selector (multi-select):
     GDPR | ISO27001 | SOC2 | ALL
4. Submit Button
   - Label: Run Compliance Audit
   - Show loading spinner during audit
   - Disable during processing
5. Upload Progress
   - Progress bar during file processing
   - Status messages:
     "Reading document..."
     "Mapping regulations..."
     "Detecting risks..."
     "Generating report..."
Props: onAuditComplete callback function
Use Tailwind CSS.
Show clear validation errors.
```

## Step 4.9 — Build Audit History Panel Component
Ask BOB:

```
Create a React component: AuditHistory.jsx
Display list of previous compliance audits:
1. History List
   - Card for each past audit showing:
     - Document name
     - Audit date and time
     - Overall compliance score
     - Risk level badge (HIGH/MEDIUM/LOW)
     - Number of findings
   - Click card to reload that audit result
2. Filter Options
   - Filter by risk level
   - Filter by document type
   - Search by document name
3. Empty State
   - Show friendly message when no audits yet
   - "Run your first compliance audit above"
4. Delete Option
   - Delete individual audit from history
   - Confirm before deleting
Props: 
- audits array
- onSelectAudit callback
- onDeleteAudit callback
Use Tailwind CSS.
Sort by most recent first.
```


## Step 4.10 — Build Main App Layout
Ask BOB:
```
Create the main App.jsx layout for the 
Compliance Audit Intelligence Platform.
Layout structure:
1. Left Sidebar Navigation (dark background)
   - IBM Logo / App Logo at top
   - Navigation items:
     → New Audit (home icon)
     → Audit History (clock icon)
     → Reports (document icon)
     → Settings (gear icon)
   - Active state highlighting
   - Collapsed/expanded toggle
2. Top Header Bar
   - Page title
   - IBM Consulting branding
   - User avatar placeholder
3. Main Content Area
   - Render active section based on navigation
   - Sections:
     NEW AUDIT VIEW:
       → DocumentUpload component (top)
       → Show loading pipeline status during audit
       → ComplianceDashboard (after audit complete)
       → RiskFindingsTable (after audit complete)
       → AuditReportViewer (after audit complete)
     HISTORY VIEW:
       → AuditHistory component
     REPORTS VIEW:
       → List of generated reports
4. Audit Processing Status Bar
   - Shows during active audit:
     [✓] Document Read
     [→] Mapping Regulations...
     [ ] Detecting Risks
     [ ] Generating Report
   - Animated progress indicator
Use React useState for navigation state.
Use React useContext for audit state management.
Use Tailwind CSS throughout.
IBM Carbon Design inspired color scheme:
- Primary: #0f62fe (IBM Blue)
- Background: #161616
- Surface: #262626
- Text: #f4f4f4
```

# Step 4.11 — Create Audit State Management
Ask BOB:

```
Create a React Context for managing audit state
across the Compliance Audit Platform.
File: src/context/AuditContext.jsx
State to manage:
- currentAudit: current audit result object
- auditHistory: array of past audits
- isAuditing: boolean loading state
- auditStage: current pipeline stage string
  ("idle" | "reading" | "mapping" | 
   "detecting" | "reporting" | "complete")
- error: error message string
Functions to expose:
- submitAudit(documentText, documentName, documentType)
  → calls auditService
  → updates auditStage as pipeline progresses
  → stores result in auditHistory
  → sets currentAudit on completion
- selectHistoricalAudit(auditId)
  → loads past audit as currentAudit
- clearCurrentAudit()
  → resets to idle state
- deleteAudit(auditId)
  → removes from history
Use React useReducer for state management.
Persist auditHistory to localStorage.
Export AuditProvider and useAudit hook.
```

## Step 4.12 — Install All Frontend Dependencies
Ask BOB to generate the installation commands:
```
Generate npm install commands for all 
dependencies needed in the Compliance Audit 
React application.
Dependencies needed:
- axios
- react-markdown
- react-dropzone
- recharts
- react-router-dom
- tailwindcss
- @headlessui/react
- @heroicons/react
- remark-gfm (for markdown tables)
- uuid
```
Run the generated commands in your terminal.


## Step 4.13 — Install All Backend Dependencies
Ask BOB:
```
Generate npm install commands for all 
dependencies needed in the Express backend.
Dependencies needed:
- express
- cors
- dotenv
- axios
- pdf-parse
- multer (for file uploads)
- uuid
- morgan (for logging)
- nodemon (dev dependency)
```

---

# PHASE 5 — INTEGRATION TESTING (Day 3 Morning)

---

# Step 5.1 — Start Backend Server

```
cd backend
npm install
npm run dev

```

Verify in terminal:
✅ Server running on port 3001
✅ CORS configured
✅ Routes registered

## Step 5.2 — Start Frontend Application

```
cd frontend
npm install
npm start
```

Verify in browser:
```
✅ http://localhost:3000 opens
✅ Sidebar navigation visible
✅ Document upload panel visible
✅ No console errors
```

## Step 5.3 — Run End-to-End Test

Use this test document to verify the complete pipeline:

```
Paste this into the Document Upload panel:
DOCUMENT: Employee Data Processing Agreement v1.0
Section 1 - Data Collection
We collect employee personal information for HR 
administration including names and job titles.
Section 2 - Data Retention  
Data is kept as long as the business needs it.
Section 3 - Access Control
Managers can access their team member data.
Section 4 - Security
We use passwords to protect our HR
```

After pasting the test document and clicking Run Compliance Audit, verify each stage:

```
EXPECTED PIPELINE EXECUTION
-----------------------------
Stage 1: "Reading document..."
✅ Document Reader Agent extracts 4 sections
✅ Identifies document type as HR_POLICY
✅ Returns structured JSON with sections
Stage 2: "Mapping regulations..."
✅ Regulation Mapping Agent queries MCP
✅ Maps Section 2 → GDPR Article 5 (retention)
✅ Maps Section 3 → ISO 27001 A.9 (access control)
✅ Maps Section 4 → ISO 27001 A.12 (security)
✅ Returns regulation mappings
Stage 3: "Detecting risks..."
✅ Risk Detector Agent identifies gaps
✅ HIGH: No specific retention period (GDPR Article 5)
✅ HIGH: No breach notification process (GDPR Article 33)
✅ MEDIUM: Vague access control policy (ISO 27001 A.9)
✅ LOW: Security measures unspecified (ISO 27001 A.12)
Stage 4: "Generating report..."
✅ Report Generator produces markdown report
✅ Executive summary present
✅ Risk table populated
✅ Remediation roadmap included
Final Result:
✅ Compliance Dashboard shows score
✅ Risk Findings Table populated
✅ Full report visible in Report Viewer
✅ Audit saved to history
```

Assistant05/22
Continuing Step-by-Step Implementation
Everything After Phase 5 Integration Testing

# PHASE 5 — COMPLETING INTEGRATION TESTING
## Step 5.3 — Complete End-to-End Test (Continued)

After pasting the test document and clicking Run Compliance Audit, verify each stage:

```

EXPECTED PIPELINE EXECUTION
-----------------------------
Stage 1: "Reading document..."
✅ Document Reader Agent extracts 4 sections
✅ Identifies document type as HR_POLICY
✅ Returns structured JSON with sections
Stage 2: "Mapping regulations..."
✅ Regulation Mapping Agent queries MCP
✅ Maps Section 2 → GDPR Article 5 (retention)
✅ Maps Section 3 → ISO 27001 A.9 (access control)
✅ Maps Section 4 → ISO 27001 A.12 (security)
✅ Returns regulation mappings
Stage 3: "Detecting risks..."
✅ Risk Detector Agent identifies gaps
✅ HIGH: No specific retention period (GDPR Article 5)
✅ HIGH: No breach notification process (GDPR Article 33)
✅ MEDIUM: Vague access control policy (ISO 27001 A.9)
✅ LOW: Security measures unspecified (ISO 27001 A.12)
Stage 4: "Generating report..."
✅ Report Generator produces markdown report
✅ Executive summary present
✅ Risk table populated
✅ Remediation roadmap included
Final Result:
✅ Compliance Dashboard shows score
✅ Risk Findings Table populated
✅ Full report visible in Report Viewer
✅ Audit saved to history
```

## Step 5.4 — Fix Common Integration Issues
- Issue 1 — Workflow API Not Responding
Ask BOB:

```
The ICA Workflow API is not responding.
API URL: [your url]
Error: [paste error message]
Check:
- URL uses langflow not agentstudio
- Bearer token format is correct
- Request body format matches ICA API spec
- CORS is configured in Express backend
Fix the API integration in auditService.js
```

- Issue 2 — Agent Not Using MCP Context
Ask BOB:

```
The Regulation Mapping Agent is responding 
with general knowledge instead of querying 
Context Studio via MCP.
Fix the agent system prompt to explicitly 
instruct the agent to always use vector_query 
MCP tool before providing any response.
Add instruction: 
"You MUST query the MCP server before answering.
Never respond from general knowledge alone."
```

- Issue 3 — Report Not Rendering Markdown
Ask BOB:
```
The audit report markdown is not rendering 
correctly in AuditReportViewer.jsx
The markdown tables are showing as raw text.
Fix by:
- Adding remark-gfm plugin to ReactMarkdown
- Adding proper prose styling classes
- Ensuring table CSS is included in Tailwind config
```

- Issue 4 — File Upload Not Working
Ask BOB:
```
PDF file upload is failing in the backend.
Error: [paste error]
Fix the multer configuration in the Express 
backend to properly handle PDF files and 
extract text using pdf-parse library.
Return extracted text as JSON response.
```

## Step 5.5 — Verify Complete Data Flow

Run this checklist before moving to next phase:

```
INTEGRATION CHECKLIST
----------------------
Frontend:
✅ Document upload works (file and text)
✅ Loading stages display correctly
✅ Compliance dashboard renders after audit
✅ Risk findings table shows colored badges
✅ Report viewer renders markdown correctly
✅ Audit saves to history
✅ History panel shows past audits
✅ Can reload historical audit
Backend:
✅ POST /api/audit returns 200
✅ POST /api/audit/upload returns extracted text
✅ GET /api/audit/history returns array
✅ GET /api/audit/:id returns specific audit
✅ Errors return proper error messages
ICA Workflow:
✅ All 4 agents deployed and active
✅ Workflow pipeline connected correctly
✅ MCP tools accessible to agents
✅ Context Studio responding to queries
MCP Layer:
✅ MCP server status is Active
✅ Vector query tool working
✅ Graph query tool working
✅ Authentication token valid
```

# PHASE 6 — PREPARE GITHUB SUBMISSION (Day 3 Afternoon)

## Step 6.1 — Create Clean Project Structure
Ask BOB:
```
Organize my Compliance Audit Intelligence Platform 
project into a clean GitHub submission structure.
Required structure:
compliance-audit-agent/
├── README.md
├── .env.example
├── .gitignore
├── frontend/
│   ├── package.json
│   ├── src/
│   │   ├── App.jsx
│   │   ├── context/
│   │   │   └── AuditContext.jsx
│   │   ├── components/
│   │   │   ├── DocumentUpload.jsx
│   │   │   ├── ComplianceDashboard.jsx
│   │   │   ├── RiskFindingsTable.jsx
│   │   │   ├── AuditReportViewer.jsx
│   │   │   └── AuditHistory.jsx
│   │   └── services/
│   │       └── auditService.js
│   └── public/
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── routes/
│   │   └── auditRoutes.js
│   └── services/
│       └── workflowService.js
├── ontology/
│   └── compliance-ontology.jsonld
├── docs/
│   ├── gdpr-reference.md
│   ├── iso27001-reference.md
│   └── architecture-diagram.md
└── submission/
    ├── problem-statement.md
    ├── solution-document.md
    ├── bob-usage.md
    └── architecture.md
Generate a proper .gitignore that excludes:
- .env files
- node_modules
- build folders
- API keys
```

# Step 6.2 — Generate README.md Using BOB
Ask BOB:

```
Generate a comprehensive README.md for my 
Compliance Audit Intelligence Platform 
Bob-a-thon submission.
Include sections:
1. Project Title and Description
2. Problem Statement (2-3 sentences)
3. Solution Overview (5-6 sentences)
4. Architecture Diagram (ASCII)
5. Technology Stack
   - IBM BOB
   - ICA Context Studio
   - ICA Agentic App Studio
   - MCP
   - React
   - Node.js Express
6. Agent Descriptions
   - Document Reader Agent
   - Regulation Mapping Agent
   - Risk Detector Agent
   - Report Generator Agent
7. Setup Instructions
   - Prerequisites
   - Clone repository
   - Install dependencies
   - Configure environment variables
   - Start backend
   - Start frontend
8. Usage Guide
   - How to run a compliance audit
   - Supported document types
   - Understanding the report
9. ICA Context Studio Setup
   - Import ontology steps
   - Configure MCP steps
10. BOB Usage Documentation
    - How BOB was used throughout development
11. Team Information
12. Bob-a-thon Track and Category
Make it professional and judge-friendly.
```

## Step 6.3 — Generate BOB Usage Documentation

This is a mandatory submission requirement.
Ask BOB:
  
```
Generate a detailed bob-usage.md document 
for Bob-a-thon mandatory submission.
Structure:
1. Overview of BOB Usage in This Project
2. Phase 1 - Ontology and Schema Generation
   Prompt Used:
   "Generate a JSON-LD schema for Compliance 
   Audit Ontology including RegulationClause,
   PolicySection, ComplianceGap, RiskFinding,
   AuditDocument, RemediationAction entities"
   BOB Output:
   - Complete JSON-LD schema generated
   - All 6 entities created correctly
   - Relationships defined automatically
   - Saved as compliance-ontology.jsonld
3. Phase 2 - Agent Prompt Engineering
   How BOB helped design:
   - Document Reader Agent system prompt
   - Regulation Mapping Agent system prompt
   - Risk Detector Agent system prompt
   - Report Generator Agent system prompt
4. Phase 3 - Backend API Development
   BOB generated:
   - Express server structure
   - API route handlers
   - Workflow service integration
   - PDF text extraction logic
   - Error handling middleware
5. Phase 4 - React Frontend Development
   BOB generated:
   - Complete React application structure
   - All UI components
   - Audit state management context
   - API service layer
   - Tailwind CSS styling
6. Phase 5 - Debugging and Fixes
   Examples of BOB debugging assistance:
   - Fixed MCP authentication errors
   - Fixed markdown rendering issues
   - Fixed PDF upload handling
   - Fixed API CORS configuration
7. Development Acceleration Summary
   - Estimated hours saved using BOB
   - Code quality improvements
   - Architecture decisions guided by BOB
8. BOB Strengths Observed
   - Fast code generation
   - Context-aware suggestions
   - MCP integration knowledge
   - Enterprise architecture guidance
9. Areas for BOB Improvement
   - [Your honest feedback]
Include actual screenshots references 
where BOB was used.
```
   

