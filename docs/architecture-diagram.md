# Architecture Diagrams

## System Architecture Overview

This document provides visual representations of the Compliance Audit Intelligence Platform architecture.

## 1. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                         USER INTERFACE LAYER                             │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │                  React Web Application                          │    │
│  │                                                                  │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │    │
│  │  │   Document   │  │  Compliance  │  │     Risk     │         │    │
│  │  │    Upload    │  │  Dashboard   │  │   Findings   │         │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘         │    │
│  │                                                                  │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │    │
│  │  │    Report    │  │    Audit     │  │  Processing  │         │    │
│  │  │    Viewer    │  │   History    │  │    Status    │         │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘         │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└────────────────────────────────┬─────────────────────────────────────────┘
                                 │ REST API (HTTPS)
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                        APPLICATION LAYER                                 │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │                  Node.js/Express Backend                        │    │
│  │                                                                  │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │    │
│  │  │     API      │  │     File     │  │     ICA      │         │    │
│  │  │   Endpoints  │  │  Processing  │  │  Integration │         │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘         │    │
│  │                                                                  │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │    │
│  │  │    Data      │  │   Security   │  │    Logging   │         │    │
│  │  │   Storage    │  │  Middleware  │  │  & Monitoring│         │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘         │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└────────────────────────────────┬─────────────────────────────────────────┘
                                 │ Workflow API
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                      ORCHESTRATION LAYER                                 │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │            IBM ICA Agentic App Studio Workflow                  │    │
│  │                                                                  │    │
│  │  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐ │    │
│  │  │ Document │ -> │Regulation│ -> │   Risk   │ -> │  Report  │ │    │
│  │  │  Reader  │    │  Mapper  │    │ Detector │    │Generator │ │    │
│  │  │  Agent   │    │  Agent   │    │  Agent   │    │  Agent   │ │    │
│  │  └──────────┘    └──────────┘    └──────────┘    └──────────┘ │    │
│  │                                                                  │    │
│  │                    ↓ MCP Queries ↓                              │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└────────────────────────────────┬─────────────────────────────────────────┘
                                 │ MCP Protocol
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                         KNOWLEDGE LAYER                                  │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │                 IBM ICA Context Studio                          │    │
│  │                                                                  │    │
│  │  ┌──────────────────────────────────────────────────────────┐  │    │
│  │  │              Compliance Ontology                          │  │    │
│  │  │                                                            │  │    │
│  │  │  • RegulationClause    • PolicySection                   │  │    │
│  │  │  • ComplianceGap       • RiskFinding                     │  │    │
│  │  │  • AuditDocument       • RemediationAction               │  │    │
│  │  └──────────────────────────────────────────────────────────┘  │    │
│  │                                                                  │    │
│  │  ┌──────────────────────────────────────────────────────────┐  │    │
│  │  │              Knowledge Graph                              │  │    │
│  │  │                                                            │  │    │
│  │  │  • GDPR Articles (99)    • ISO 27001 Controls (114)      │  │    │
│  │  │  • SOC 2 Criteria        • Risk Classifications          │  │    │
│  │  │  • Semantic Relationships • Vector Embeddings            │  │    │
│  │  └──────────────────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## 2. Agent Pipeline Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUDIT PROCESSING PIPELINE                     │
└─────────────────────────────────────────────────────────────────┘

Input: Document Text
│
├─────────────────────────────────────────────────────────────────┐
│ STAGE 1: Document Reading                                        │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │  Document Reader Agent                                    │   │
│ │                                                            │   │
│ │  Tasks:                                                    │   │
│ │  • Parse document structure                               │   │
│ │  • Extract sections and clauses                           │   │
│ │  • Identify document type                                 │   │
│ │  • Categorize content                                     │   │
│ │                                                            │   │
│ │  Output: Structured Document                              │   │
│ │  {                                                         │   │
│ │    documentType: "SECURITY_POLICY",                       │   │
│ │    sections: [...]                                        │   │
│ │  }                                                         │   │
│ └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
│
├─────────────────────────────────────────────────────────────────┐
│ STAGE 2: Regulation Mapping                                      │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │  Regulation Mapper Agent                                  │   │
│ │                                                            │   │
│ │  Tasks:                                                    │   │
│ │  • Query MCP for applicable regulations                   │   │
│ │  • Map sections to GDPR articles                          │   │
│ │  • Map sections to ISO 27001 controls                     │   │
│ │  • Identify mandatory requirements                        │   │
│ │                                                            │   │
│ │  MCP Queries:                                             │   │
│ │  • vector_query("data retention requirements")            │   │
│ │  • graph_query(regulation_id, "applies_to")               │   │
│ │                                                            │   │
│ │  Output: Regulation Mappings                              │   │
│ │  {                                                         │   │
│ │    mappings: [                                            │   │
│ │      { section, regulations: [...] }                      │   │
│ │    ]                                                       │   │
│ │  }                                                         │   │
│ └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
│
├─────────────────────────────────────────────────────────────────┐
│ STAGE 3: Risk Detection                                          │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │  Risk Detector Agent                                      │   │
│ │                                                            │   │
│ │  Tasks:                                                    │   │
│ │  • Compare content vs requirements                        │   │
│ │  • Identify missing clauses                               │   │
│ │  • Detect incomplete controls                             │   │
│ │  • Assign risk levels (HIGH/MEDIUM/LOW)                   │   │
│ │  • Calculate risk scores (1-10)                           │   │
│ │                                                            │   │
│ │  Risk Classification:                                     │   │
│ │  • HIGH   → Legal/financial risk, data breach potential   │   │
│ │  • MEDIUM → Incomplete controls, partial compliance       │   │
│ │  • LOW    → Best practice gaps, recommendations           │   │
│ │                                                            │   │
│ │  Output: Risk Findings                                    │   │
│ │  {                                                         │   │
│ │    riskFindings: [...],                                   │   │
│ │    overallRiskLevel: "HIGH",                              │   │
│ │    overallRiskScore: 8.5                                  │   │
│ │  }                                                         │   │
│ └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
│
├─────────────────────────────────────────────────────────────────┐
│ STAGE 4: Report Generation                                       │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │  Report Generator Agent                                   │   │
│ │                                                            │   │
│ │  Tasks:                                                    │   │
│ │  • Aggregate all findings                                 │   │
│ │  • Generate executive summary                             │   │
│ │  • Create risk summary table                              │   │
│ │  • Detail each finding with evidence                      │   │
│ │  • Provide remediation roadmap                            │   │
│ │  • Calculate compliance scores                            │   │
│ │                                                            │   │
│ │  Report Sections:                                         │   │
│ │  1. Executive Summary                                     │   │
│ │  2. Risk Summary Table                                    │   │
│ │  3. Detailed Findings                                     │   │
│ │  4. Remediation Roadmap                                   │   │
│ │  5. Compliance Scorecard                                  │   │
│ │                                                            │   │
│ │  Output: Markdown Report                                  │   │
│ └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
│
▼
Output: Complete Audit Report
```

## 3. Data Flow Diagram

```
┌──────────┐
│   User   │
└────┬─────┘
     │ 1. Upload Document
     ▼
┌─────────────────┐
│  React Frontend │
└────┬────────────┘
     │ 2. POST /api/audit/file
     ▼
┌─────────────────┐
│  Express Backend│
│                 │
│  ┌───────────┐ │
│  │ Extract   │ │ 3. Extract text from PDF/DOCX
│  │ Text      │ │
│  └───────────┘ │
└────┬────────────┘
     │ 4. POST to ICA Workflow API
     ▼
┌─────────────────────────────────────────┐
│  ICA Agentic App Studio                 │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Workflow Orchestrator          │   │
│  │                                 │   │
│  │  5. Execute Agent Pipeline      │   │
│  │     │                           │   │
│  │     ├─> Agent 1 (Document)      │   │
│  │     │   │                       │   │
│  │     │   └─> Structured Doc      │   │
│  │     │                           │   │
│  │     ├─> Agent 2 (Mapping)       │   │
│  │     │   │                       │   │
│  │     │   ├─> Query MCP ──────────┼───┼─> Context Studio
│  │     │   │                       │   │   (Retrieve regulations)
│  │     │   └─> Mappings            │   │
│  │     │                           │   │
│  │     ├─> Agent 3 (Risk)          │   │
│  │     │   │                       │   │
│  │     │   ├─> Query MCP ──────────┼───┼─> Context Studio
│  │     │   │                       │   │   (Retrieve risk rules)
│  │     │   └─> Risk Findings       │   │
│  │     │                           │   │
│  │     └─> Agent 4 (Report)        │   │
│  │         │                       │   │
│  │         └─> Audit Report        │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
└────┬────────────────────────────────────┘
     │ 6. Return Results
     ▼
┌─────────────────┐
│  Express Backend│
│                 │
│  ┌───────────┐ │
│  │ Store     │ │ 7. Save to data/
│  │ Results   │ │
│  └───────────┘ │
└────┬────────────┘
     │ 8. Return Response
     ▼
┌─────────────────┐
│  React Frontend │
│                 │
│  ┌───────────┐ │
│  │ Display   │ │ 9. Show results to user
│  │ Results   │ │
│  └───────────┘ │
└─────────────────┘
```

## 4. Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND COMPONENTS                       │
│                                                                  │
│  ┌──────────────┐                                               │
│  │     App      │                                               │
│  │   (Router)   │                                               │
│  └──────┬───────┘                                               │
│         │                                                        │
│    ┌────┴────┬────────┬────────┬────────┐                      │
│    ▼         ▼        ▼        ▼        ▼                      │
│  ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐                       │
│  │Doc │  │Dash│  │Risk│  │Rpt │  │Hist│                       │
│  │Upld│  │brd │  │Tbl │  │View│  │List│                       │
│  └─┬──┘  └─┬──┘  └─┬──┘  └─┬──┘  └─┬──┘                       │
│    │       │       │       │       │                            │
│    └───────┴───────┴───────┴───────┘                            │
│                    │                                             │
│                    ▼                                             │
│         ┌──────────────────┐                                    │
│         │  AuditContext    │                                    │
│         │  (State Mgmt)    │                                    │
│         └────────┬─────────┘                                    │
│                  │                                               │
│                  ▼                                               │
│         ┌──────────────────┐                                    │
│         │  auditService    │                                    │
│         │  (API Client)    │                                    │
│         └────────┬─────────┘                                    │
└──────────────────┼──────────────────────────────────────────────┘
                   │ HTTP/REST
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND COMPONENTS                        │
│                                                                  │
│         ┌──────────────────┐                                    │
│         │   Express Server │                                    │
│         └────────┬─────────┘                                    │
│                  │                                               │
│         ┌────────┴────────┐                                     │
│         │   Middleware    │                                     │
│         │  • CORS         │                                     │
│         │  • Helmet       │                                     │
│         │  • Morgan       │                                     │
│         │  • Error Handler│                                     │
│         └────────┬────────┘                                     │
│                  │                                               │
│         ┌────────┴────────┐                                     │
│         │  auditRoutes    │                                     │
│         └────────┬────────┘                                     │
│                  │                                               │
│    ┌─────────────┼─────────────┐                               │
│    ▼             ▼             ▼                                │
│  ┌────┐      ┌────┐       ┌────┐                               │
│  │ICA │      │File│       │Data│                               │
│  │Svc │      │Ext │       │Str │                               │
│  └─┬──┘      └────┘       └────┘                               │
│    │                                                             │
└────┼─────────────────────────────────────────────────────────────┘
     │ Workflow API
     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ICA AGENTIC APP STUDIO                        │
│                                                                  │
│         ┌──────────────────┐                                    │
│         │  Workflow Engine │                                    │
│         └────────┬─────────┘                                    │
│                  │                                               │
│    ┌─────────────┼─────────────┬─────────────┐                 │
│    ▼             ▼             ▼             ▼                 │
│  ┌────┐      ┌────┐       ┌────┐       ┌────┐                 │
│  │Agt1│      │Agt2│       │Agt3│       │Agt4│                 │
│  └────┘      └─┬──┘       └─┬──┘       └────┘                 │
│                │            │                                    │
│                └────────────┘                                    │
│                     │ MCP                                        │
└─────────────────────┼────────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ICA CONTEXT STUDIO                            │
│                                                                  │
│         ┌──────────────────┐                                    │
│         │   MCP Gateway    │                                    │
│         └────────┬─────────┘                                    │
│                  │                                               │
│    ┌─────────────┼─────────────┐                               │
│    ▼             ▼             ▼                                │
│  ┌────┐      ┌────┐       ┌────┐                               │
│  │Onto│      │Know│       │Vec │                               │
│  │logy│      │Grph│       │Srch│                               │
│  └────┘      └────┘       └────┘                               │
└─────────────────────────────────────────────────────────────────┘
```

## 5. Deployment Architecture

```
                    ┌──────────────┐
                    │    Users     │
                    └──────┬───────┘
                           │ HTTPS
                           ▼
                    ┌──────────────┐
                    │Load Balancer │
                    │  (nginx/ALB) │
                    └──────┬───────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
       ┌─────────────┐          ┌─────────────┐
       │  Frontend   │          │  Frontend   │
       │  Instance 1 │          │  Instance 2 │
       │  (Static)   │          │  (Static)   │
       └─────────────┘          └─────────────┘
              │                         │
              └────────────┬────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
       ┌─────────────┐          ┌─────────────┐
       │   Backend   │          │   Backend   │
       │  Instance 1 │          │  Instance 2 │
       │  (Node.js)  │          │  (Node.js)  │
       └──────┬──────┘          └──────┬──────┘
              │                         │
              └────────────┬────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │    Shared    │
                    │   Storage    │
                    │  (NFS/S3)    │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │     ICA      │
                    │   Platform   │
                    │              │
                    │ • Workflow   │
                    │ • Agents     │
                    │ • Context    │
                    └──────────────┘
```

## 6. Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        SECURITY LAYERS                           │
│                                                                  │
│  Layer 1: Network Security                                       │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  • HTTPS/TLS encryption                                │    │
│  │  • Firewall rules                                      │    │
│  │  • DDoS protection                                     │    │
│  │  • Rate limiting                                       │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Layer 2: Application Security                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  • Helmet.js security headers                          │    │
│  │  • CORS configuration                                  │    │
│  │  • Input validation                                    │    │
│  │  • XSS protection                                      │    │
│  │  • CSRF tokens                                         │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Layer 3: Authentication & Authorization                         │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  • API key authentication                              │    │
│  │  • Bearer token authentication                         │    │
│  │  • Role-based access control                           │    │
│  │  • Session management                                  │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Layer 4: Data Security                                          │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  • Encryption at rest                                  │    │
│  │  • Encryption in transit                               │    │
│  │  • Secure file storage                                 │    │
│  │  • Data sanitization                                   │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Layer 5: Audit & Monitoring                                     │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  • Access logging                                      │    │
│  │  • Audit trails                                        │    │
│  │  • Security monitoring                                 │    │
│  │  • Incident response                                   │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

**Document Version**: 1.0  
**Last Updated**: 2026-05-28  
**Maintained By**: Development Team