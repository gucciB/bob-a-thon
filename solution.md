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

