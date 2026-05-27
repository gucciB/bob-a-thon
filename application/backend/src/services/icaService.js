const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');
const logger = require('../utils/logger');

/**
 * Service to interact with ICA Workflow API
 * This is a mock implementation that can be replaced with actual ICA API calls
 */
class ICAService {
  constructor() {
    this.apiUrl = config.ica.apiUrl;
    this.apiKey = config.ica.apiKey;
    this.workflowId = config.ica.workflowId;
  }

  /**
   * Call ICA Workflow API to perform compliance audit
   * Returns the audit report as markdown text
   */
  async performAudit(documentText, documentType, regulations = ['ALL']) {
    logger.info(`Performing audit for document type: ${documentType}`);
    logger.info(`Document text length: ${documentText.length} characters`);
    logger.info(`Selected regulations: ${regulations.join(', ')}`);

    try {
      // Construct regulation string based on selection
      let regulationString;
      if (regulations.includes('ALL') || regulations.length === 0) {
        regulationString = 'GDPR and ISO 27001';
      } else {
        // Map regulation codes to full names
        const regulationNames = regulations.map(reg => {
          switch(reg) {
            case 'GDPR': return 'GDPR';
            case 'ISO27001': return 'ISO 27001';
            default: return reg;
          }
        });
        regulationString = regulationNames.join(' and ');
      }

      const inputPrompt = `Audit this document for ${regulationString} compliance:

${documentText}`;

      // Log the constructed prompt for the first time
      logger.info('\n=== CONSTRUCTED AUDIT PROMPT ===');
      logger.info(inputPrompt);
      logger.info('=== END PROMPT ===\n');

      const payload = {
        "output_type": "chat",
        "input_type": "chat",
        "input_value": inputPrompt,
        "session_id": crypto.randomUUID()
      };
      
      const axiosConfig = {
        headers: {
          'Content-Type': 'application/json',
          "x-api-key": this.apiKey
        },
        timeout: 600000 // 10 minute timeout (ICA API can take several minutes)
      };

      logger.info("Calling ICA API - this may take up to 10 minutes...");
      const response = await axios.post(`${this.apiUrl}`, payload, axiosConfig);
      logger.info("ICA API response received");
      
      // Log the full response for debugging
      console.log('\n=== ICA API FULL RESPONSE ===');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('=== END ICA RESPONSE ===\n');
      
      // Extract the audit report text from the nested structure
      const auditReportText = this.extractAuditReportFromICAResponse(response.data);
      
      if (auditReportText) {
        logger.info('Successfully extracted audit report from ICA response');
        logger.info(`Audit report length: ${auditReportText.length} characters`);
        return auditReportText; // Return the markdown text directly
      } else {
        throw new Error('Could not extract audit report from ICA response');
      }

    } catch (error) {
      logger.error(`ICA API call failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Extract audit report text from ICA API response
   * Response structure: outputs[0].outputs[0].results.message.data.text
   */
  extractAuditReportFromICAResponse(icaResponse) {
    try {
      if (icaResponse &&
          icaResponse.outputs &&
          icaResponse.outputs[0] &&
          icaResponse.outputs[0].outputs &&
          icaResponse.outputs[0].outputs[0] &&
          icaResponse.outputs[0].outputs[0].results &&
          icaResponse.outputs[0].outputs[0].results.message &&
          icaResponse.outputs[0].outputs[0].results.message.data &&
          icaResponse.outputs[0].outputs[0].results.message.data.text) {
        
        return icaResponse.outputs[0].outputs[0].results.message.data.text;
      }
      
      logger.warn('Could not find audit report text in expected path');
      return null;
    } catch (error) {
      logger.error(`Error extracting audit report: ${error.message}`);
      return null;
    }
  }

  /**
   * Parse the markdown audit report text and extract structured data
   */
  parseAuditReportText(reportText, documentText, documentType) {
    try {
      // Extract key metrics from the report using regex
      const overallScoreMatch = reportText.match(/\*\*Overall Risk Score:\*\*\s*(\d+)\/10/);
      const overallScore = overallScoreMatch ? parseInt(overallScoreMatch[1]) * 10 : 75;
      
      const totalGapsMatch = reportText.match(/\*\*Total Gaps Found:\*\*\s*(\d+)/);
      const totalGaps = totalGapsMatch ? parseInt(totalGapsMatch[1]) : 0;
      
      // Extract risk level
      const riskLevelMatch = reportText.match(/\*\*Overall Risk Level:\*\*\s*(\w+)/);
      const riskLevel = riskLevelMatch ? riskLevelMatch[1] : 'MEDIUM';
      
      // Determine compliance status based on score
      let complianceStatus;
      if (overallScore >= 85) {
        complianceStatus = 'COMPLIANT';
      } else if (overallScore >= 60) {
        complianceStatus = 'PARTIALLY_COMPLIANT';
      } else {
        complianceStatus = 'NON_COMPLIANT';
      }
      
      // Extract findings from the report
      const findings = this.extractFindingsFromReport(reportText);
      
      // Calculate risk breakdown
      const riskBreakdown = {
        high: findings.filter(f => f.riskLevel === 'HIGH').length,
        medium: findings.filter(f => f.riskLevel === 'MEDIUM').length,
        low: findings.filter(f => f.riskLevel === 'LOW').length
      };
      
      // Extract compliance scores (GDPR, ISO27001)
      const gdprScoreMatch = reportText.match(/GDPR.*?(\d+)%/);
      const iso27001ScoreMatch = reportText.match(/ISO 27001.*?(\d+)%/);
      
      return {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        documentName: this.generateDocumentName(documentType),
        documentType,
        overallScore,
        complianceStatus,
        riskBreakdown,
        complianceScores: {
          gdpr: gdprScoreMatch ? parseInt(gdprScoreMatch[1]) : overallScore,
          iso27001: iso27001ScoreMatch ? parseInt(iso27001ScoreMatch[1]) : overallScore
        },
        findings,
        report: reportText
      };
    } catch (error) {
      logger.error(`Error parsing audit report: ${error.message}`);
      throw error;
    }
  }

  /**
   * Extract individual findings from the markdown report
   */
  extractFindingsFromReport(reportText) {
    const findings = [];
    
    // Regex to match finding sections
    const findingPattern = /####\s+\d+\.\d+\.\d+\s+([A-Z0-9-]+)\s+\*\*Title:\*\*\s+(.+?)\s+\*\*Risk Level:\*\*\s+(\w+)\s+\*\*Risk Score:\*\*\s+(\d+)\/10/g;
    
    let match;
    let id = 1;
    while ((match = findingPattern.exec(reportText)) !== null) {
      const [, findingId, title, riskLevel, score] = match;
      
      // Extract more details for this finding
      const findingSection = reportText.substring(match.index, match.index + 2000);
      
      const regulationMatch = findingSection.match(/\*\*Regulation:\*\*\s+(.+)/);
      const articleMatch = findingSection.match(/\*\*Article:\*\*\s+(.+)/);
      
      findings.push({
        id: `finding-${String(id++).padStart(3, '0')}`,
        finding: title,
        regulation: regulationMatch ? regulationMatch[1].trim() : 'GDPR',
        section: articleMatch ? articleMatch[1].trim() : 'Various',
        details: title,
        recommendation: 'See detailed remediation recommendations in the full report',
        riskLevel: riskLevel.toUpperCase(),
        score: parseInt(score) * 10
      });
    }
    
    // If no findings extracted, create at least one based on the report
    if (findings.length === 0) {
      findings.push({
        id: 'finding-001',
        finding: 'Compliance gaps identified',
        regulation: 'GDPR Article 5',
        section: 'Data Processing Principles',
        details: 'Multiple compliance gaps identified in the audit report',
        recommendation: 'Review the full audit report for detailed recommendations',
        riskLevel: 'HIGH',
        score: 70
      });
    }
    
    return findings;
  }

  /**
   * Generate document name based on type (helper method)
   */
  generateDocumentName(documentType) {
    const names = {
      'privacy-policy': 'Privacy Policy Document',
      'security-policy': 'Information Security Policy',
      'vendor-agreement': 'Vendor Agreement Document'
    };
    return names[documentType] || 'Policy Document';
  }
}

module.exports = new ICAService();

// Made with Bob
