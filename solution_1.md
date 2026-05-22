# Step-by-Step Implementation Guide
## AI Compliance & Policy Audit Agent — Bob-a-thon

---

# PHASE 0 — PREPARATION (Day 1, Morning)

---

## Step 0.1 — Verify Access

Before writing a single line of code, confirm your team has:

```
✅ IBM BOB access (at least one team member)
✅ ICA Global Instance access
✅ Context Studio enabled in ICA
✅ Agentic App Studio visible in ICA menu
✅ GitHub account for submission
✅ Node.js 20+ installed
✅ Python 3.10+ installed
✅ VS Code with BOB extension installed
```

**If Context Studio is not visible:**
- Raise access request through your ICA admin
- Reference the FAQ: access was being rolled out after May 8 launch
- Use the Slack channel: `guild-coding-agents-at-consulting`

---

## Step 0.2 — Create Project Folder

```bash
mkdir compliance-audit-agent
cd compliance-audit-agent
code .
```

Open BOB inside VS Code.

---

## Step 0.3 — Initialize BOB

Inside BOB, run:

```
/init
```

BOB will generate:
```
AGENTS.md
.bob/rules-code/AGENTS.md
.bob/rules-advanced/AGENTS.md
```

This gives BOB your project context for the entire development session.

---

---

# PHASE 1 — BUILD COMPLIANCE ONTOLOGY IN ICA CONTEXT STUDIO (Day 1)

This is your **most critical phase**.
The ontology is the intelligence foundation of your entire solution.

---

## Step 1.1 — Generate Compliance Ontology Schema Using BOB

Open BOB and use this prompt:

```
Generate a JSON-LD schema for a Compliance Audit Ontology.

Include these entities:

1. RegulationClause
   - clauseId (UUID)
   - regulationName (GDPR | ISO27001 | SOC2 | INTERNAL)
   - articleNumber
   - clauseTitle
   - clauseDescription
   - category (DATA_PRIVACY | ACCESS_CONTROL | SECURITY | HR | CONTRACT)
   - mandatory (boolean)

2. PolicySection
   - sectionId (UUID)
   - documentName
   - sectionTitle
   - sectionContent
   - documentType (CONTRACT | SECURITY_POLICY | HR_POLICY | GDPR_NOTICE)

3. ComplianceGap
   - gapId (UUID)
   - gapDescription
   - affectedClause
   - affectedSection
   - riskLevel (HIGH | MEDIUM | LOW)

4. RiskFinding
   - findingId (UUID)
   - findingTitle
   - findingDescription
   - riskScore (1-10)
   - riskLevel (HIGH | MEDIUM | LOW)
   - regulationReference
   - remediationSuggestion

5. AuditDocument
   - documentId (UUID)
   - documentName
   - documentType
   - uploadDate
   - auditStatus (PENDING | IN_PROGRESS | COMPLETED)

6. RemediationAction
   - actionId (UUID)
   - actionTitle
   - actionDescription
   - priority (CRITICAL | HIGH | MEDIUM | LOW)
   - targetClause

Include relationships:
- PolicySection mapsTo RegulationClause
- ComplianceGap identifiedIn PolicySection
- ComplianceGap violates RegulationClause
- RiskFinding containsGap ComplianceGap
- AuditDocument hasSection PolicySection
- RemediationAction addressesGap ComplianceGap

Include Operations:
- MapSectionToRegulation (from PolicySection to RegulationClause)
- DetectComplianceGap (from PolicySection to ComplianceGap)
- GenerateRiskFinding (from ComplianceGap to RiskFinding)
- RecommendRemediation (from RiskFinding to RemediationAction)

Use JSON-LD format compatible with IBM ICA Context Studio.
Use namespace: http://example.org/compliance#
```

---

## Step 1.2 — Save Schema File

Save the generated file as:

```
compliance-ontology.jsonld
```

---

## Step 1.3 — Validate Schema With BOB

Before importing, ask BOB to validate:

```
Review this JSON-LD schema file: compliance-ontology.jsonld

Check for:
- Valid @context block
- Valid @graph array
- All entities have @id, @type, name, description
- All relationships are properly defined
- No circular references
- No duplicate @id values
- All Operations have from, to, precondition, postcondition

Fix any issues found.
```

---

## Step 1.4 — Import Schema Into ICA Context Studio

```
1. Login to ICA Global Instance
2. Open your ICA Team
3. Navigate to Context Studio
4. Click → New Schema
5. Click → Import Schema
6. Upload: compliance-ontology.jsonld
7. Provide Schema Name: Compliance Audit Ontology
8. Select Domain: Compliance / Risk
9. Click Save
```

---

## Step 1.5 — Review Schema in Context Studio

After import, verify:

```
✅ All 6 entities visible
✅ All relationships shown
✅ Operations listed
✅ Knowledge graph rendering correctly
✅ No import errors
```

**If import fails:**
Go back to BOB and ask:

```
The JSON-LD schema failed to import into ICA Context Studio.
Common issues are: missing @context, broken @graph, 
duplicate IDs, or invalid relationship definitions.

Please refactor compliance-ontology.jsonld 
and fix all structural issues.
```

---

## Step 1.6 — Publish Schema

```
Click → Publish Schema
```

Publishing enables:
- Context creation
- MCP querying
- Agent integration

---

## Step 1.7 — Create Supporting Documents Using BOB

Generate compliance reference documents that will power your AI retrieval.

Use BOB:

```
Generate a detailed Markdown document covering:

1. GDPR Key Articles relevant to enterprise compliance:
   - Article 5 (Data Processing Principles)
   - Article 6 (Lawful Basis)
   - Article 17 (Right to Erasure)
   - Article 25 (Data Protection by Design)
   - Article 32 (Security of Processing)
   - Article 33 (Breach Notification)

For each article include:
- Article number and title
- Plain language explanation
- Enterprise compliance requirement
- Common violations
- Remediation guidance

Format as structured Markdown.
```

Save as: `gdpr-reference.md`

Then generate ISO 27001 reference:

```
Generate a detailed Markdown document covering 
ISO 27001:2022 key controls for enterprise compliance:

Include controls from domains:
- A.5 Information Security Policies
- A.6 Organization of Information Security
- A.8 Asset Management
- A.9 Access Control
- A.12 Operations Security
- A.18 Compliance

For each control include:
- Control ID and title
- Requirement description
- Implementation guidance
- Common gaps
- Risk if missing

Format as structured Markdown.
```

Save as: `iso27001-reference.md`

---

## Step 1.8 — Create Business Context in ICA

```
1. Navigate to Context Studio → Contexts
2. Click → New Context
3. Provide:
   - Name: Compliance Audit Intelligence
   - Description: Enterprise compliance audit knowledge 
     covering GDPR, ISO 27001, and internal policy frameworks
   - Linked Schema: Compliance Audit Ontology
4. Click → Source & Data tab
5. Upload documents:
   - gdpr-reference.md
   - iso27001-reference.md
6. Wait for status → Ready
7. Open Knowledge Graph tab
8. Verify relationships are visible
```

---

## Step 1.9 — Expose Context Studio as MCP Server

```
1. Open your Context in Context Studio
2. Navigate to → Overview → MCP Exposure
3. Click → Expose as MCP
4. Save the following values securely:

   CONTEXT_
   
   
*******************************************************************

# After Exposing Context Studio as MCP Server
## Continuing Step-by-Step Implementation

---

# PHASE 1 — COMPLETE (Continuing from MCP Exposure)

---

## Step 1.9 — Save Your MCP Credentials

After clicking **Expose as MCP**, ICA will generate three critical values.

Save them immediately in a secure local file:

```
Create a file: .env.local (DO NOT commit to GitHub)

CONTEXT_STUDIO_MCP_URL=https://your-mcp-endpoint-url
CONTEXT_STUDIO_CONTEXT_ID=ctx_xxxxxxxxxxxxxxxx
CONTEXT_STUDIO_MCP_GATEWAY_TOKEN=your_mcp_gateway_token
```

**Why this matters:**
Every agent you build will authenticate against this MCP endpoint to retrieve compliance knowledge from your ontology.

---

## Step 1.10 — Configure BOB to Use Your MCP Server

Inside your project folder, create the BOB MCP configuration file:

```
File location: .bob/mcp.json
```

Ask BOB to generate it:

```
Generate a .bob/mcp.json MCP configuration file 
for connecting BOB to ICA Context Studio MCP server.

Use these placeholders:
- MCP URL: CONTEXT_STUDIO_MCP_URL
- Gateway Token: CONTEXT_STUDIO_MCP_GATEWAY_TOKEN

Use transport type: streamable-http
Use Bearer token authentication.
```

BOB will generate:

```json
{
  "mcpServers": {
    "compliance-context": {
      "type": "streamable-http",
      "url": "YOUR_CONTEXT_STUDIO_MCP_URL",
      "headers": {
        "Authorization": "Bearer YOUR_MCP_GATEWAY_TOKEN"
      },
      "disabled": false
    }
  }
}
```

Replace placeholders with your actual values.

---

## Step 1.11 — Verify MCP Connection in BOB

Switch BOB to **Advanced Mode** (required for MCP tool access).

Then ask BOB:

```
List all available tools from the 
compliance-context MCP server.
```

**Expected Result:**
BOB should list Context Studio tools such as:
```
✅ vector_query
✅ graph_query  
✅ document_search
✅ context_retrieve
```

If tools appear → MCP connection is working.

**If connection fails**, check:
```
- Is the MCP URL correct?
- Is the Bearer token valid and not expired?
- Is BOB in Advanced Mode?
- Is the .bob/mcp.json file saved correctly?
```

---

## Step 1.12 — Test MCP Retrieval With BOB

Now validate that your compliance ontology is retrievable.

Ask BOB:

```
Using the compliance-context MCP server,
query context id: ctx_your_context_id

Question: What are the key GDPR articles 
related to data breach notification?
```

**Expected Result:**
BOB should return grounded answers from your uploaded `gdpr-reference.md` and ontology — not from general internet knowledge.

This confirms your **enterprise knowledge layer is working**.

---

---

# PHASE 2 — BUILD AGENTS IN ICA AGENTIC APP STUDIO (Day 1 Afternoon)

Now that your knowledge layer is ready, build your four specialist agents.

---

## Step 2.1 — Create Agentic App in ICA

```
1. Login to ICA
2. Navigate to → Agentic App Studio
3. Click → New Agentic App
4. Provide:
   - App Name: Compliance Audit Intelligence Platform
   - Description: Multi-agent system for enterprise 
     compliance gap detection and risk reporting
5. Click → Create
```

---

## Step 2.2 — Configure MCP Server Inside Agentic App Studio

```
1. Navigate to → MCP Servers (inside your app)
2. Click → Access MCP Gateway (Context Forge)
3. Click → Add MCP Server
   (If you only see "Add Gateway", 
    change authentication type to MCP Gateway Token first)
4. Provide:
   - Server Name: compliance-context-studio
   - MCP URL: your CONTEXT_STUDIO_MCP_URL
   - Authentication: Bearer Token
   - Token: your MCP_GATEWAY_TOKEN
   - Transport: Streamable HTTP
5. Click → Save
6. Verify status becomes: Active
```

---

## Step 2.3 — Configure Virtual Server

This step exposes your MCP tools to all agents inside the app.

```
1. Navigate to → Virtual Server
2. Open → Default Virtual Server
3. Click → Edit
4. Enable the compliance-context-studio MCP tools
5. Save
```

**Verify:**
```
✅ Context Studio tools visible in virtual server
✅ vector_query tool enabled
✅ graph_query tool enabled
✅ document_search tool enabled
```

---

## Step 2.4 — Build Agent 1: Document Reader Agent

```
1. Navigate to → Agents → New Agent
2. Configure:
   - Agent Name: document-reader-agent
   - Platform: ICA
   - Framework: Strands
   - Model: GPT-5.1
   - Pattern: Single Agent
```

Provide this system prompt:

```
You are the Document Reader Agent in an enterprise 
compliance audit system.

Your responsibilities:
1. Accept and analyze enterprise documents
2. Extract key sections, clauses, and statements
3. Identify document type: 
   CONTRACT | SECURITY_POLICY | HR_POLICY | GDPR_NOTICE
4. Structure document content into sections
5. Pass structured output to the next agent

Output format must be JSON:
{
  "documentType": "...",
  "documentName": "...",
  "sections": [
    {
      "sectionTitle": "...",
      "sectionContent": "...",
      "relevanceCategory": "DATA_PRIVACY | ACCESS_CONTROL | 
                            SECURITY | HR | CONTRACT"
    }
  ]
}

Always extract all meaningful sections.
Never summarize — preserve original clause language.
```

Click → **Deploy Agent**

Save the agent name: `document-reader-agent`

---

## Step 2.5 — Build Agent 2: Regulation Mapping Agent

```
1. Navigate to → Agents → New Agent
2. Configure:
   - Agent Name: regulation-mapping-agent
   - Platform: ICA
   - Framework: Strands
   - Model: GPT-5.1
   - Pattern: Single Agent
```

Provide this system prompt:

```
You are the Regulation Mapping Agent in an enterprise 
compliance audit system.

You have access to Context Studio MCP tools.
Context ID: ctx_your_actual_context_id

Your responsibilities:
1. Receive structured document sections
2. Query Context Studio MCP to retrieve 
   applicable regulations for each section
3. Map each document section to relevant:
   - GDPR articles
   - ISO 27001 controls
   - Internal policy requirements
4. Identify which regulations APPLY to each section

For each section, use vector_query MCP tool to search:
"Find all regulations applicable to: [section content]"

Output format must be JSON:
{
  "mappings": [
    {
      "sectionTitle": "...",
      "sectionContent": "...",
      "applicableRegulations": [
        {
          "regulationName": "GDPR | ISO27001",
          "articleOrControl": "...",
          "requirementDescription": "...",
          "mandatory": true | false
        }
      ]
    }
  ]
}

Always query MCP before mapping.
Never use general knowledge alone — always ground in Context Studio.
```

Click → **Deploy Agent**

Save the agent name: `regulation-mapping-agent`

---

## Step 2.6 — Build Agent 3: Risk Detector Agent

```
1. Navigate to → Agents → New Agent
2. Configure:
   - Agent Name: risk-detector-agent
   - Platform: ICA
   - Framework: Strands
   - Model: GPT-5.1
   - Pattern: Single Agent
```

Provide this system prompt:

```
You are the Risk Detector Agent in an enterprise 
compliance audit

*****************************

# Continuing Step-by-Step Implementation
## After Building Agent 3: Risk Detector Agent

---

## Step 2.6 — Risk Detector Agent System Prompt (Complete)

Provide this system prompt for Agent 3:

```
You are the Risk Detector Agent in an enterprise 
compliance audit system.

You have access to Context Studio MCP tools.
Context ID: ctx_your_actual_context_id

Your responsibilities:
1. Receive regulation mappings from Regulation Mapping Agent
2. Compare each document section against its mapped regulations
3. Identify compliance gaps where:
   - Required clause is missing
   - Clause exists but is incomplete
   - Clause contradicts regulatory requirement
4. Assign risk level to each gap:
   - HIGH   → Missing mandatory clause, data breach risk,
               legal penalty risk
   - MEDIUM → Incomplete control, partial compliance,
               documentation insufficient
   - LOW    → Minor gap, recommended improvement,
               non-mandatory best practice
5. Assign risk score 1-10 for each finding

For each gap, query Context Studio MCP:
"What is the compliance risk if [regulation] 
requirement is missing from enterprise documents?"

Output format must be JSON:
{
  "riskFindings": [
    {
      "findingId": "unique-id",
      "findingTitle": "...",
      "affectedSection": "...",
      "violatedRegulation": "...",
      "gapDescription": "...",
      "riskLevel": "HIGH | MEDIUM | LOW",
      "riskScore": 1-10,
      "evidence": "exact text from document that 
                   shows the gap",
      "remediationSuggestion": "..."
    }
  ],
  "overallRiskLevel": "HIGH | MEDIUM | LOW",
  "overallRiskScore": 1-10,
  "totalGapsFound": number
}

Always ground risk assessment in MCP context.
Never assign risk level without regulatory justification.
Be specific — cite exact document sections and 
exact regulation requirements.
```

Click → **Deploy Agent**

Save the agent name: `risk-detector-agent`

---

## Step 2.7 — Build Agent 4: Report Generator Agent

```
1. Navigate to → Agents → New Agent
2. Configure:
   - Agent Name: report-generator-agent
   - Platform: ICA
   - Framework: Strands
   - Model: GPT-5.1
   - Pattern: Single Agent
```

Provide this system prompt:

```
You are the Report Generator Agent in an enterprise 
compliance audit system.

Your responsibilities:
1. Receive all risk findings from Risk Detector Agent
2. Generate a professional, structured audit report
3. Organize findings by risk priority
4. Provide clear remediation recommendations
5. Format report for executive and technical audiences

Report structure you must generate:

---
COMPLIANCE AUDIT REPORT
Generated: [date]
Document Audited: [name]

EXECUTIVE SUMMARY
- Overall compliance status: COMPLIANT | PARTIALLY COMPLIANT 
  | NON-COMPLIANT
- Total gaps found: [number]
- HIGH risk findings: [number]
- MEDIUM risk findings: [number]  
- LOW risk findings: [number]
- Immediate action required: YES | NO

RISK SUMMARY TABLE
| Finding | Regulation | Risk Level | Risk Score | Priority |
|---------|-----------|------------|------------|----------|
[populate from findings]

DETAILED FINDINGS
For each HIGH risk finding:
- Finding title
- Affected document section
- Violated regulation
- Gap description
- Evidence from document
- Remediation steps
- Timeline recommendation

For each MEDIUM risk finding:
[same structure]

For each LOW risk finding:
[same structure]

REMEDIATION ROADMAP
Priority 1 - Immediate (0-30 days):
[HIGH risk items]

Priority 2 - Short Term (30-90 days):
[MEDIUM risk items]

Priority 3 - Long Term (90+ days):
[LOW risk items]

COMPLIANCE SCORECARD
- GDPR Compliance: [percentage]%
- ISO 27001 Compliance: [percentage]%
- Overall Compliance Score: [percentage]%
---

Output the complete report as structured Markdown.
Always be specific — reference exact clauses and regulations.
Make recommendations actionable and time-bound.
```

Click → **Deploy Agent**

Save the agent name: `report-generator-agent`

---

---

# PHASE 3 — BUILD ORCHESTRATION WORKFLOW (Day 2 Morning)

Now connect all four agents into a pipeline using ICA Workflow.

---

## Step 3.1 — Create New Workflow

```
1. Navigate to → Workflows in Agentic App Studio
2. Click → New Workflow
3. Provide:
   - Workflow Name: compliance-audit-pipeline
   - Description: Orchestrates 4-agent compliance 
     audit from document input to risk report
4. Click → Create
```

---

## Step 3.2 — Add Workflow Components

Add these components in sequence:

```
┌─────────────────────────────────────────────┐
│           WORKFLOW PIPELINE                  │
│                                             │
│  [Chat Input]                               │
│       ↓                                     │
│  [Document Reader Agent]                    │
│       ↓                                     │
│  [Regulation Mapping Agent]                 │
│       ↓                                     │
│  [Risk Detector Agent]                      │
│       ↓                                     │
│  [Report Generator Agent]                   │
│       ↓                                     │
│  [Chat Output]                              │
└─────────────────────────────────────────────┘
```

**How to add each component:**

```
1. Drag → Chat Input component onto canvas
2. Drag → ICA Agent component → select document-reader-agent
3. Drag → ICA Agent component → select regulation-mapping-agent
4. Drag → ICA Agent component → select risk-detector-agent
5. Drag → ICA Agent component → select report-generator-agent
6. Drag → Chat Output component onto canvas
7. Connect each component output → next component input
```

---

## Step 3.3 — Configure Data Flow Between Agents

This is critical — each agent must receive output from the previous agent.

```
Connection 1:
Chat Input → output → Document Reader Agent → input

Connection 2:
Document Reader Agent → output → Regulation Mapping Agent → input

Connection 3:
Regulation Mapping Agent → output → Risk Detector Agent → input

Connection 4:
Risk Detector Agent → output → Report Generator Agent → input

Connection 5:
Report Generator Agent → output → Chat Output → input
```

---

## Step 3.4 — Test Workflow Inside Studio

Before building the UI, test the workflow directly.

Use this test input:

```
Audit this document for GDPR and ISO 27001 compliance:

DOCUMENT: Employee Data Processing Policy v1.0

Section 1 - Data Collection
We collect employee personal data including name, 
address, salary, and performance records for 
HR administration purposes.

Section 2 - Data Retention
Employee data is retained for business purposes 
as long as required.

Section 3 - Access Control
HR team members can access employee data 
when needed for their work.

Section 4 - Data Security
We use standard security measures to protect 
employee data from unauthorized access.
```

**Expected workflow behavior:**
```
Step 1: Document Reader Agent extracts 4 sections
         and identifies document type as HR_POLICY

Step 2: Regulation Mapping Agent queries MCP,
         maps sections to GDPR Article 5, 17, 25, 32
         and ISO 27001 A.8, A.9, A.12 controls

Step 3: Risk Detector Agent identifies gaps:
         HIGH  → No data retention period specified
                 (GDPR Article 5 violation)
         HIGH  → No data breach notification process
                 (GDPR Article 33 violation)
         MEDIUM → Access control too vague
                  (ISO 27001 A.9 gap)
         LOW   → Security measures not specified
                 (ISO 27001 A.12 gap)

Step 4: Report Generator produces structured
         audit report with remediation
		 
******************************************



# Continuing Step-by-Step Implementation
## After Step 4.6 — Build Risk Findings Table Component

---

# PHASE 4 — COMPLETING THE REACT FRONTEND

---

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

---

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

---

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

---

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

---

## Step 4.11 — Create Audit State Management

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

---

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

---

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

---

# PHASE 5 — INTEGRATION TESTING (Day 3 Morning)

---

## Step 5.1 — Start Backend Server

```bash
cd backend
npm install
npm run dev
```

Verify in terminal:
```
✅ Server running on port 3001
✅ CORS configured
✅ Routes registered
```

---

## Step 5.2 — Start Frontend Application

```bash
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

---

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

*******************************************


# Continuing Step-by-Step Implementation
## Everything After Phase 5 Integration Testing

---

# PHASE 5 — COMPLETING INTEGRATION TESTING

---

## Step 5.3 — Complete End-to-End Test (Continued)

After pasting the test document and clicking **Run Compliance Audit**, verify each stage:

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

---

## Step 5.4 — Fix Common Integration Issues

### Issue 1 — Workflow API Not Responding

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

---

### Issue 2 — Agent Not Using MCP Context

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

---

### Issue 3 — Report Not Rendering Markdown

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

---

### Issue 4 — File Upload Not Working

Ask BOB:

```
PDF file upload is failing in the backend.
Error: [paste error]

Fix the multer configuration in the Express 
backend to properly handle PDF files and 
extract text using pdf-parse library.

Return extracted text as JSON response.
```

---

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

---

---

# PHASE 6 — PREPARE GITHUB SUBMISSION (Day 3 Afternoon)

---

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

---

## Step 6.2 — Generate README.md Using BOB

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

---

## Step 6.3 — Generate BOB Usage Documentation

This is a **mandatory submission requirement**.

Ask BOB:

```
Generate a detailed bob-usage.md document 
for Bob-a-thon submission.

Document how IBM BOB was used throughout 
development of the Compliance Audit Platform.

Structure:

1. Overview of BOB Usage
   - Total development phases assisted
   - Types of assistance provided

2. Phase-wise BOB Contributions

   Phase 1 - Ontology Generation
   - Prompt used to generate compliance ontology
   - How BOB created the JSON-LD schema
   - Iterations and refin
   
****************************


# Everything Remaining — Complete Final Phases
## Bob-a-thon Submission Completion Guide

---

# PHASE 6 — COMPLETING GITHUB SUBMISSION

---

## Step 6.3 — Complete BOB Usage Documentation

Ask BOB to generate the complete document:

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

Save as: `submission/bob-usage.md`

---

## Step 6.4 — Generate Problem Statement Document

Ask BOB:

```
Generate a problem-statement.md document 
for Bob-a-thon submission.

Include:

1. Problem Title
   AI Compliance & Policy Audit Agent

2. Problem Description
   - What problem exists
   - Why it is painful for enterprises
   - Who faces this problem
   - Current manual process limitations

3. Business Impact of Problem
   - Time cost of manual audits
   - Risk of missed compliance gaps
   - Financial penalties for non-compliance
   - GDPR fine examples
   - ISO 27001 certification failure impact

4. Target Users
   - Chief Compliance Officers
   - Legal and Risk Teams
   - Security Operations Teams
   - IBM Consulting GRC Practice clients

5. Why This Problem Needs AI
   - Volume of regulations
   - Frequency of regulation changes
   - Document complexity
   - Need for consistency

6. Why Existing Tools Are Insufficient
   - Manual checklists miss gaps
   - Generic AI tools lack regulation grounding
   - No enterprise knowledge integration
   - No traceable audit findings

Make it concise, enterprise-focused, 
and judge-ready. Maximum 2 pages.
```

Save as: `submission/problem-statement.md`

---

## Step 6.5 — Generate Solution Document

Ask BOB:

```
Generate a solution-document.md for 
Bob-a-thon submission.

Include:

1. Solution Name and Tagline
   AI Compliance & Policy Audit Agent
   "From document to audit report in minutes,
    not weeks"

2. Solution Overview
   - What the solution does
   - How it works at high level
   - Key differentiators from simple chatbots

3. ICA Technology Usage
   - Context Studio: how used
   - MCP: how used
   - Agentic App Studio: how used
   - Workflow Orchestration: how used

4. IBM BOB Usage
   - Development acceleration
   - Code generation
   - Architecture guidance

5. Multi-Agent Architecture
   - Agent 1: Document Reader Agent
   - Agent 2: Regulation Mapping Agent
   - Agent 3: Risk Detector Agent
   - Agent 4: Report Generator Agent
   - Supervisor workflow orchestration

6. Compliance Ontology
   - What ontology was built
   - Why ontology matters vs simple document search
   - Knowledge graph relationships

7. Enterprise Value
   - Time savings
   - Risk reduction
   - Consistency improvement
   - Audit trail generation
   - Reusability across clients

8. IBM Consulting Alignment
   - GRC practice alignment
   - Cybersecurity consulting alignment
   - Reusable accelerator potential
   - Cross-industry applicability

9. Innovation Highlights
   - Semantic compliance reasoning
   - Grounded regulation mapping
   - Risk-scored findings
   - Auditor-grade reports

10. Future Roadmap
    - Additional regulations (SOC2, HIPAA)
    - Real-time regulation update feeds
    - Multi-language support
    - Integration with GRC platforms
    - Continuous compliance monitoring

Maximum 4 pages.
Professional enterprise tone.
```

Save as: `submission/solution-document.md`

---

## Step 6.6 — Clean Up Code Before GitHub Push

Ask BOB:

```
Review my entire project codebase and:

1. Remove all hardcoded API keys or tokens
2. Verify all secrets use environment variables
3. Add JSDoc comments to all React components
4. Add inline comments to complex logic
5. Ensure .env is in .gitignore
6. Verify .env.example has placeholder values only
7. Remove any console.log debug statements
8. Fix any unused imports in React files
9. Ensure README setup instructions are accurate
10. Verify package.json has correct start scripts

List every issue found and fix each one.
```

---

## Step 6.7 — Fork and Push to GitHub

Follow the official Bob-a-thon GitHub process:

```
Step 1 — Fork Repository
Go to the official Bob-a-thon GitHub repository
Click Fork
Create fork under your GitHub account

Step 2 — Clone Your Fork
git clone https://github.com/YOUR_USERNAME/bobathon-2026.git
cd bobathon-2026

Step 3 — Create Your Team Folder
mkdir submissions/YOUR_TEAM_NAME
cd submissions/YOUR_TEAM_NAME

Step 4 — Copy Your Project
Copy all project files into your team folder:
- frontend/
- backend/
- ontology/
- docs/
- submission/
- README.md
- .env.example
- .gitignore

Step 5 — Commit Your Work
git add .
git commit -m "feat: AI Compliance Audit Agent - Team YOUR_NAME"
git push origin main

Step 6 — Create Pull Request
Go to original Bob-a-thon repository on GitHub
Click New Pull Request
Select your fork
Title: "AI Compliance & Policy Audit Agent - Team YOUR_NAME"
Add description of your solution
Click Create Pull Request

Step 7 — Save PR URL
Copy and save your Pull Request URL
You will need this for final submission form
```

---

---

# PHASE 7 — RECORD DEMO VIDEO (Day 3 Evening)

This is one of your **most important deliverables**.
Judges watch the video first before reviewing code.

---

## Step 7.1 — Plan Your Demo Script

Structure your 3-5 minute demo exactly like this:

```
DEMO SCRIPT STRUCTURE
----------------------

[0:00 - 0:30] HOOK — Problem Statement
Say out loud:
"Enterprise compliance audits take weeks.
Legal teams manually review hundreds of pages
against GDPR and ISO 27001 requirements.
Findings are inconsistent and gaps are missed.
We built an AI system to solve this."

[0:30 - 1:00] SOLUTION OVERVIEW
Show:
- Architecture diagram (15 seconds)
- ICA Context Studio with compliance ontology
- Knowledge graph visualization
Say:
"We built a compliance ontology in ICA Context

**********************************************

