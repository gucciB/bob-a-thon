// Mock API service for demonstration purposes
// In production, replace with actual API calls

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock audit data
const mockAuditResult = {
  id: 'audit-001',
  timestamp: new Date().toISOString(),
  documentName: 'Corporate Privacy Policy v2.3',
  overallScore: 72,
  complianceStatus: 'PARTIALLY_COMPLIANT',
  riskBreakdown: {
    high: 3,
    medium: 7,
    low: 12
  },
  complianceScores: {
    gdpr: 68,
    iso27001: 76
  },
  findings: [
    {
      id: 'finding-001',
      finding: 'Missing explicit consent mechanism for data processing',
      regulation: 'GDPR Article 6(1)(a)',
      riskLevel: 'HIGH',
      score: 25,
      section: 'Section 2.1 - Data Collection',
      details: 'The policy does not clearly specify how user consent is obtained for data processing activities. GDPR requires explicit, informed consent with the ability to withdraw.',
      recommendation: 'Add a clear consent mechanism with opt-in checkboxes and detailed information about data processing purposes.'
    },
    {
      id: 'finding-002',
      finding: 'Incomplete data breach notification procedure',
      regulation: 'GDPR Article 33',
      riskLevel: 'HIGH',
      score: 30,
      section: 'Section 5.2 - Incident Response',
      details: 'The 72-hour notification requirement for data breaches is not explicitly mentioned in the incident response procedures.',
      recommendation: 'Update incident response procedures to include specific timelines and notification requirements as per GDPR Article 33.'
    },
    {
      id: 'finding-003',
      finding: 'Vague data retention periods',
      regulation: 'GDPR Article 5(1)(e)',
      riskLevel: 'HIGH',
      score: 35,
      section: 'Section 3.4 - Data Retention',
      details: 'Data retention periods are described as "as long as necessary" without specific timeframes for different data categories.',
      recommendation: 'Define specific retention periods for each category of personal data based on legitimate business needs and legal requirements.'
    },
    {
      id: 'finding-004',
      finding: 'Insufficient third-party vendor assessment',
      regulation: 'ISO 27001 A.15.1.1',
      riskLevel: 'MEDIUM',
      score: 55,
      section: 'Section 4.3 - Third-Party Services',
      details: 'The policy lacks detailed requirements for assessing information security practices of third-party vendors.',
      recommendation: 'Implement a vendor security assessment framework including security questionnaires and regular audits.'
    },
    {
      id: 'finding-005',
      finding: 'Missing data subject rights procedures',
      regulation: 'GDPR Articles 15-22',
      riskLevel: 'MEDIUM',
      score: 50,
      section: 'Section 6.1 - User Rights',
      details: 'While data subject rights are mentioned, specific procedures for handling access, rectification, and erasure requests are not detailed.',
      recommendation: 'Create detailed procedures for handling each type of data subject request with defined response timelines.'
    },
    {
      id: 'finding-006',
      finding: 'Incomplete access control policy',
      regulation: 'ISO 27001 A.9.1.1',
      riskLevel: 'MEDIUM',
      score: 60,
      section: 'Section 7.2 - Access Management',
      details: 'Access control policy does not specify role-based access control (RBAC) implementation or regular access reviews.',
      recommendation: 'Implement RBAC with documented roles and permissions, and establish quarterly access review procedures.'
    },
    {
      id: 'finding-007',
      finding: 'Weak password policy requirements',
      regulation: 'ISO 27001 A.9.4.3',
      riskLevel: 'MEDIUM',
      score: 58,
      section: 'Section 7.3 - Authentication',
      details: 'Password policy requires only 8 characters without complexity requirements or multi-factor authentication.',
      recommendation: 'Strengthen password policy to require 12+ characters, complexity requirements, and implement MFA for all users.'
    },
    {
      id: 'finding-008',
      finding: 'No data protection impact assessment process',
      regulation: 'GDPR Article 35',
      riskLevel: 'MEDIUM',
      score: 52,
      section: 'Section 2.3 - Risk Assessment',
      details: 'The policy does not mention Data Protection Impact Assessments (DPIA) for high-risk processing activities.',
      recommendation: 'Establish a DPIA process for identifying and mitigating risks in high-risk data processing activities.'
    },
    {
      id: 'finding-009',
      finding: 'Insufficient employee training requirements',
      regulation: 'ISO 27001 A.7.2.2',
      riskLevel: 'MEDIUM',
      score: 62,
      section: 'Section 8.1 - Training and Awareness',
      details: 'Employee security awareness training is mentioned but lacks frequency, content requirements, and effectiveness measurement.',
      recommendation: 'Implement mandatory annual security awareness training with quarterly updates and assessment of training effectiveness.'
    },
    {
      id: 'finding-010',
      finding: 'Missing encryption standards',
      regulation: 'ISO 27001 A.10.1.1',
      riskLevel: 'MEDIUM',
      score: 56,
      section: 'Section 7.4 - Data Protection',
      details: 'The policy mentions encryption but does not specify encryption standards (e.g., AES-256) or key management procedures.',
      recommendation: 'Define specific encryption standards for data at rest and in transit, and establish key management procedures.'
    },
    {
      id: 'finding-011',
      finding: 'Incomplete backup and recovery procedures',
      regulation: 'ISO 27001 A.12.3.1',
      riskLevel: 'LOW',
      score: 75,
      section: 'Section 9.1 - Business Continuity',
      details: 'Backup procedures are mentioned but lack specific recovery time objectives (RTO) and recovery point objectives (RPO).',
      recommendation: 'Define specific RTO and RPO for critical systems and document detailed backup and recovery procedures.'
    },
    {
      id: 'finding-012',
      finding: 'Vague incident classification criteria',
      regulation: 'ISO 27001 A.16.1.4',
      riskLevel: 'LOW',
      score: 70,
      section: 'Section 5.1 - Incident Management',
      details: 'Incident classification lacks specific criteria for categorizing incidents by severity and impact.',
      recommendation: 'Develop a detailed incident classification matrix with clear criteria for each severity level.'
    },
    {
      id: 'finding-013',
      finding: 'Missing physical security controls',
      regulation: 'ISO 27001 A.11.1.1',
      riskLevel: 'LOW',
      score: 78,
      section: 'Section 10.1 - Physical Security',
      details: 'Physical security controls are briefly mentioned but lack detail on access control systems and monitoring.',
      recommendation: 'Document specific physical security controls including badge access systems, CCTV monitoring, and visitor management.'
    },
    {
      id: 'finding-014',
      finding: 'Insufficient change management process',
      regulation: 'ISO 27001 A.12.1.2',
      riskLevel: 'LOW',
      score: 72,
      section: 'Section 11.2 - Change Control',
      details: 'Change management process lacks detail on security impact assessment and rollback procedures.',
      recommendation: 'Enhance change management process to include mandatory security reviews and documented rollback procedures.'
    },
    {
      id: 'finding-015',
      finding: 'Limited vulnerability management details',
      regulation: 'ISO 27001 A.12.6.1',
      riskLevel: 'LOW',
      score: 74,
      section: 'Section 11.3 - Vulnerability Management',
      details: 'Vulnerability management is mentioned but lacks specific scanning frequency and remediation timelines.',
      recommendation: 'Establish regular vulnerability scanning schedule (weekly for critical systems) with defined remediation SLAs.'
    },
    {
      id: 'finding-016',
      finding: 'Incomplete logging and monitoring requirements',
      regulation: 'ISO 27001 A.12.4.1',
      riskLevel: 'LOW',
      score: 76,
      section: 'Section 12.1 - Audit Logging',
      details: 'Logging requirements are general and do not specify what events must be logged or retention periods.',
      recommendation: 'Define specific logging requirements for security events with minimum 90-day retention period.'
    },
    {
      id: 'finding-017',
      finding: 'Missing mobile device management policy',
      regulation: 'ISO 27001 A.6.2.1',
      riskLevel: 'LOW',
      score: 80,
      section: 'Section 7.5 - Mobile Devices',
      details: 'Mobile device usage is mentioned but lacks specific MDM requirements and BYOD policies.',
      recommendation: 'Implement comprehensive MDM policy covering device encryption, remote wipe, and application management.'
    },
    {
      id: 'finding-018',
      finding: 'Vague data classification scheme',
      regulation: 'ISO 27001 A.8.2.1',
      riskLevel: 'LOW',
      score: 77,
      section: 'Section 3.1 - Data Classification',
      details: 'Data classification mentions categories but lacks clear criteria for classification and handling requirements.',
      recommendation: 'Develop detailed data classification scheme with specific handling, storage, and transmission requirements for each level.'
    },
    {
      id: 'finding-019',
      finding: 'Insufficient network security controls',
      regulation: 'ISO 27001 A.13.1.1',
      riskLevel: 'LOW',
      score: 73,
      section: 'Section 13.1 - Network Security',
      details: 'Network security controls are mentioned generally without specific requirements for network segmentation or firewall rules.',
      recommendation: 'Document network architecture with defined security zones, segmentation strategy, and firewall rule management procedures.'
    },
    {
      id: 'finding-020',
      finding: 'Missing secure development lifecycle',
      regulation: 'ISO 27001 A.14.2.1',
      riskLevel: 'LOW',
      score: 79,
      section: 'Section 14.1 - Development Security',
      details: 'Secure development practices are mentioned but lack a formal SDLC with security checkpoints.',
      recommendation: 'Implement formal secure SDLC with security requirements, code reviews, and security testing at each phase.'
    },
    {
      id: 'finding-021',
      finding: 'Incomplete supplier security requirements',
      regulation: 'ISO 27001 A.15.1.2',
      riskLevel: 'LOW',
      score: 71,
      section: 'Section 4.4 - Supplier Management',
      details: 'Supplier agreements mention security but lack specific security requirements and audit rights.',
      recommendation: 'Include detailed security requirements in supplier contracts with rights to audit and security incident notification obligations.'
    },
    {
      id: 'finding-022',
      finding: 'Missing privacy by design principles',
      regulation: 'GDPR Article 25',
      riskLevel: 'LOW',
      score: 75,
      section: 'Section 2.2 - Privacy Framework',
      details: 'Privacy by design and by default principles are not explicitly incorporated into system development processes.',
      recommendation: 'Integrate privacy by design principles into all system development and procurement processes with documented privacy requirements.'
    }
  ],
  report: `# Compliance Audit Report

## Executive Summary

This comprehensive audit assessed the Corporate Privacy Policy v2.3 against GDPR and ISO 27001 standards. The analysis identified **22 findings** across various compliance domains, with **3 high-risk**, **7 medium-risk**, and **12 low-risk** issues.

**Overall Compliance Score: 72%**

### Compliance Breakdown
- **GDPR Compliance: 68%** - Requires immediate attention to consent mechanisms and data subject rights
- **ISO 27001 Compliance: 76%** - Generally strong technical controls with gaps in documentation

### Risk Summary
- **HIGH Risk (3 findings)**: Critical gaps in consent mechanisms, breach notification, and data retention
- **MEDIUM Risk (7 findings)**: Important improvements needed in vendor management, access controls, and DPIAs
- **LOW Risk (12 findings)**: Minor documentation and procedural enhancements recommended

---

## Critical Findings (HIGH Risk)

### 1. Missing Explicit Consent Mechanism
**Regulation:** GDPR Article 6(1)(a)  
**Section:** 2.1 - Data Collection  
**Risk Score:** 25/100

The policy fails to specify how user consent is obtained for data processing activities. GDPR mandates explicit, informed consent with clear opt-in mechanisms and the ability to withdraw consent at any time.

**Recommendation:** Implement a clear consent management system with:
- Granular opt-in checkboxes for different processing purposes
- Plain language explanations of data usage
- Easy-to-use consent withdrawal mechanism
- Audit trail of consent decisions

### 2. Incomplete Data Breach Notification Procedure
**Regulation:** GDPR Article 33  
**Section:** 5.2 - Incident Response  
**Risk Score:** 30/100

The incident response procedures do not explicitly mention the 72-hour notification requirement for data breaches to supervisory authorities.

**Recommendation:** Update incident response procedures to include:
- Specific 72-hour notification timeline
- Breach assessment criteria
- Notification templates for authorities and data subjects
- Escalation procedures for breach incidents

### 3. Vague Data Retention Periods
**Regulation:** GDPR Article 5(1)(e)  
**Section:** 3.4 - Data Retention  
**Risk Score:** 35/100

Data retention is described as "as long as necessary" without specific timeframes, violating the storage limitation principle.

**Recommendation:** Define specific retention periods:
- Customer data: 7 years post-relationship
- Marketing data: 2 years from last interaction
- Employee data: 7 years post-employment
- Transaction logs: 90 days
- Implement automated deletion processes

---

## Important Findings (MEDIUM Risk)

### 4. Insufficient Third-Party Vendor Assessment
**Regulation:** ISO 27001 A.15.1.1  
**Section:** 4.3 - Third-Party Services  
**Risk Score:** 55/100

The policy lacks detailed requirements for assessing and monitoring third-party vendor security practices.

**Recommendation:** Implement vendor security assessment framework including:
- Pre-engagement security questionnaires
- Annual security audits
- Right-to-audit clauses in contracts
- Vendor risk classification system

### 5. Missing Data Subject Rights Procedures
**Regulation:** GDPR Articles 15-22  
**Section:** 6.1 - User Rights  
**Risk Score:** 50/100

While data subject rights are mentioned, specific procedures for handling requests are not detailed.

**Recommendation:** Create detailed procedures for:
- Access requests (30-day response time)
- Rectification requests
- Erasure requests (right to be forgotten)
- Data portability requests
- Objection to processing requests

### 6. Incomplete Access Control Policy
**Regulation:** ISO 27001 A.9.1.1  
**Section:** 7.2 - Access Management  
**Risk Score:** 60/100

Access control policy lacks specifics on role-based access control implementation and regular reviews.

**Recommendation:** Implement comprehensive access control:
- Document all roles and permissions
- Quarterly access reviews
- Automated provisioning/deprovisioning
- Principle of least privilege enforcement

### 7. Weak Password Policy Requirements
**Regulation:** ISO 27001 A.9.4.3  
**Section:** 7.3 - Authentication  
**Risk Score:** 58/100

Current password policy requires only 8 characters without complexity requirements or MFA.

**Recommendation:** Strengthen authentication:
- Minimum 12 characters
- Complexity requirements (uppercase, lowercase, numbers, symbols)
- Mandatory MFA for all users
- Password expiration every 90 days
- Password history (prevent reuse of last 10 passwords)

### 8. No Data Protection Impact Assessment Process
**Regulation:** GDPR Article 35  
**Section:** 2.3 - Risk Assessment  
**Risk Score:** 52/100

The policy does not mention DPIAs for high-risk processing activities.

**Recommendation:** Establish DPIA process:
- Criteria for when DPIA is required
- DPIA template and methodology
- Privacy team review and approval
- Regular DPIA updates for existing systems

### 9. Insufficient Employee Training Requirements
**Regulation:** ISO 27001 A.7.2.2  
**Section:** 8.1 - Training and Awareness  
**Risk Score:** 62/100

Security awareness training lacks frequency, content requirements, and effectiveness measurement.

**Recommendation:** Implement comprehensive training program:
- Mandatory annual security awareness training
- Quarterly security updates
- Role-specific training for IT staff
- Phishing simulation exercises
- Training effectiveness assessments

### 10. Missing Encryption Standards
**Regulation:** ISO 27001 A.10.1.1  
**Section:** 7.4 - Data Protection  
**Risk Score:** 56/100

The policy mentions encryption but does not specify standards or key management.

**Recommendation:** Define encryption requirements:
- AES-256 for data at rest
- TLS 1.3 for data in transit
- Key management procedures
- Encryption key rotation schedule
- Hardware security module (HSM) usage

---

## Minor Findings (LOW Risk)

### 11-22. Additional Improvements

The remaining 12 findings represent opportunities for enhancement in:
- Backup and recovery procedures (RTO/RPO definition)
- Incident classification criteria
- Physical security controls documentation
- Change management security reviews
- Vulnerability management timelines
- Logging and monitoring requirements
- Mobile device management policies
- Data classification schemes
- Network security controls
- Secure development lifecycle
- Supplier security requirements
- Privacy by design integration

---

## Recommendations Summary

### Immediate Actions (30 days)
1. Implement explicit consent mechanism
2. Update breach notification procedures
3. Define specific data retention periods
4. Strengthen password policy and enable MFA

### Short-term Actions (90 days)
5. Establish DPIA process
6. Create data subject rights procedures
7. Implement vendor security assessment framework
8. Document access control roles and permissions
9. Define encryption standards

### Long-term Actions (180 days)
10. Enhance employee training program
11. Improve incident classification and response
12. Strengthen physical and network security documentation
13. Implement comprehensive logging and monitoring
14. Integrate privacy by design principles

---

## Conclusion

The Corporate Privacy Policy v2.3 demonstrates a foundational commitment to data protection and information security. However, critical gaps in consent management, breach notification, and data retention require immediate attention to achieve full GDPR compliance.

The medium-risk findings, while not immediately critical, represent important areas for improvement that will strengthen the organization's overall security posture and regulatory compliance.

With focused effort on the recommended actions, the organization can achieve a compliance score above 90% within 6 months.

**Next Steps:**
1. Prioritize high-risk findings for immediate remediation
2. Assign ownership for each finding to responsible teams
3. Establish timeline and milestones for remediation
4. Schedule follow-up audit in 6 months to verify improvements

---

*Report Generated: ${new Date().toLocaleDateString()}*  
*Audit ID: audit-001*  
*Compliance Framework: GDPR + ISO 27001*
`
};

// Mock audit history
const mockAuditHistory = [
  {
    id: 'audit-001',
    date: new Date().toISOString(),
    documentName: 'Corporate Privacy Policy v2.3',
    overallScore: 72,
    status: 'PARTIALLY_COMPLIANT'
  },
  {
    id: 'audit-002',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    documentName: 'Employee Data Handling Policy',
    overallScore: 85,
    status: 'COMPLIANT'
  },
  {
    id: 'audit-003',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    documentName: 'Third-Party Vendor Agreement',
    overallScore: 58,
    status: 'NON_COMPLIANT'
  },
  {
    id: 'audit-004',
    date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    documentName: 'Data Retention Policy v1.5',
    overallScore: 79,
    status: 'PARTIALLY_COMPLIANT'
  },
  {
    id: 'audit-005',
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    documentName: 'Incident Response Plan',
    overallScore: 91,
    status: 'COMPLIANT'
  }
];

export const mockApi = {
  // Upload document and perform audit
  uploadDocument: async (file, documentType) => {
    await delay(2000); // Simulate processing time
    return {
      success: true,
      data: mockAuditResult
    };
  },

  // Upload text and perform audit
  uploadText: async (text, documentType) => {
    await delay(1500); // Simulate processing time
    return {
      success: true,
      data: mockAuditResult
    };
  },

  // Get audit history
  getAuditHistory: async () => {
    await delay(500);
    return {
      success: true,
      data: mockAuditHistory
    };
  },

  // Get specific audit by ID
  getAuditById: async (auditId) => {
    await delay(500);
    return {
      success: true,
      data: mockAuditResult
    };
  },

  // Export report as PDF (mock)
  exportReportPDF: async (auditId) => {
    await delay(1000);
    return {
      success: true,
      message: 'PDF export initiated. Download will start shortly.'
    };
  }
};

// Made with Bob
