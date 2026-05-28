import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  FileText, 
  Download, 
  Copy, 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle,
  Calendar,
  Clock,
  Shield,
  Printer
} from 'lucide-react';

/**
 * AuditReportViewer Component
 * Displays full compliance audit report with markdown rendering and export options
 * 
 * @param {string} reportContent - Markdown formatted report content
 * @param {Object} auditMeta - Audit metadata (documentName, timestamp, status, score, findings)
 */
const AuditReportViewer = ({ reportContent, auditMeta }) => {
  const [copied, setCopied] = useState(false);

  if (!reportContent || !auditMeta) {
    return (
      <div className="card p-12 text-center">
        <FileText className="w-16 h-16 text-carbon-gray-60 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-carbon-gray-10 mb-2">No Report Available</h3>
        <p className="text-carbon-gray-40">Generate an audit to view the report</p>
      </div>
    );
  }

  const {
    documentName,
    timestamp,
    complianceStatus,
    overallScore,
    findings = []
  } = auditMeta;

  // Get status configuration
  const getStatusConfig = (status) => {
    switch (status) {
      case 'COMPLIANT':
        return {
          label: 'Compliant',
          icon: CheckCircle,
          className: 'bg-carbon-green-70 text-white',
          borderColor: 'border-carbon-green-60'
        };
      case 'PARTIALLY_COMPLIANT':
        return {
          label: 'Partially Compliant',
          icon: AlertCircle,
          className: 'bg-carbon-orange-60 text-white',
          borderColor: 'border-carbon-orange-50'
        };
      case 'NON_COMPLIANT':
        return {
          label: 'Non-Compliant',
          icon: AlertTriangle,
          className: 'bg-carbon-red-70 text-white',
          borderColor: 'border-carbon-red-60'
        };
      default:
        return {
          label: 'Unknown',
          icon: AlertCircle,
          className: 'bg-carbon-gray-70 text-white',
          borderColor: 'border-carbon-gray-60'
        };
    }
  };

  const statusConfig = getStatusConfig(complianceStatus);
  const StatusIcon = statusConfig.icon;

  // Categorize findings by priority
  const categorizeFindings = () => {
    const immediate = findings.filter(f => f.riskLevel === 'HIGH');
    const shortTerm = findings.filter(f => f.riskLevel === 'MEDIUM');
    const longTerm = findings.filter(f => f.riskLevel === 'LOW');

    return { immediate, shortTerm, longTerm };
  };

  const { immediate, shortTerm, longTerm } = categorizeFindings();

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Handle copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reportContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons - Hidden in print */}
      <div className="card p-4 flex flex-wrap gap-3 items-center justify-between print:hidden">
        <div className="text-sm text-carbon-gray-40">
          Export or share this compliance audit report
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="btn-secondary flex items-center gap-2"
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Report
              </>
            )}
          </button>
          <button
            onClick={handlePrint}
            className="btn-primary flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print / Export PDF
          </button>
        </div>
      </div>

      {/* Report Header */}
      <div className="card p-8 shadow-xl border-2 border-carbon-blue-60 border-opacity-20">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-carbon-blue-40" />
              <h1 className="text-3xl font-bold text-carbon-gray-10">
                Compliance Audit Report
              </h1>
            </div>
            <h2 className="text-xl text-carbon-gray-30 mb-4">
              {documentName}
            </h2>
            <div className="flex flex-wrap gap-4 text-sm text-carbon-gray-40">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(timestamp).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{new Date(timestamp).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-3
              ${statusConfig.className} border-2 ${statusConfig.borderColor}
            `}>
              <StatusIcon className="w-5 h-5" />
              <span className="font-semibold">{statusConfig.label}</span>
            </div>
            <div className="text-4xl font-bold text-carbon-gray-10">
              {overallScore}%
            </div>
            <div className="text-sm text-carbon-gray-40">Overall Score</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-carbon-gray-80">
          <div className="text-center">
            <div className="text-2xl font-bold text-carbon-red-60">{immediate.length}</div>
            <div className="text-xs text-carbon-gray-40 mt-1">High Risk</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-carbon-orange-60">{shortTerm.length}</div>
            <div className="text-xs text-carbon-gray-40 mt-1">Medium Risk</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-carbon-green-60">{longTerm.length}</div>
            <div className="text-xs text-carbon-gray-40 mt-1">Low Risk</div>
          </div>
        </div>
      </div>

      {/* Remediation Roadmap */}
      <div className="card p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-carbon-gray-10 mb-6 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-carbon-blue-40" />
          Remediation Roadmap
        </h2>

        <div className="space-y-6">
          {/* Priority 1: Immediate (0-30 days) */}
          <div className="border-l-4 border-carbon-red-60 pl-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 bg-carbon-red-70 text-white rounded-full text-sm font-semibold">
                Priority 1
              </div>
              <h3 className="text-lg font-semibold text-carbon-gray-10">
                Immediate Action Required (0-30 days)
              </h3>
              <span className="text-sm text-carbon-gray-40">
                {immediate.length} items
              </span>
            </div>
            {immediate.length > 0 ? (
              <ul className="space-y-3">
                {immediate.map((finding, index) => (
                  <li key={finding.id} className="flex gap-3">
                    <span className="text-carbon-red-60 font-bold">{index + 1}.</span>
                    <div className="flex-1">
                      <p className="text-sm text-carbon-gray-10 font-medium mb-1">
                        {finding.finding}
                      </p>
                      <p className="text-xs text-carbon-blue-40 font-mono">
                        {finding.regulation}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-carbon-gray-40 italic">No immediate actions required</p>
            )}
          </div>

          {/* Priority 2: Short Term (30-90 days) */}
          <div className="border-l-4 border-carbon-orange-60 pl-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 bg-carbon-orange-60 text-white rounded-full text-sm font-semibold">
                Priority 2
              </div>
              <h3 className="text-lg font-semibold text-carbon-gray-10">
                Short Term Improvements (30-90 days)
              </h3>
              <span className="text-sm text-carbon-gray-40">
                {shortTerm.length} items
              </span>
            </div>
            {shortTerm.length > 0 ? (
              <ul className="space-y-3">
                {shortTerm.map((finding, index) => (
                  <li key={finding.id} className="flex gap-3">
                    <span className="text-carbon-orange-60 font-bold">{index + 1}.</span>
                    <div className="flex-1">
                      <p className="text-sm text-carbon-gray-10 font-medium mb-1">
                        {finding.finding}
                      </p>
                      <p className="text-xs text-carbon-blue-40 font-mono">
                        {finding.regulation}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-carbon-gray-40 italic">No short term actions required</p>
            )}
          </div>

          {/* Priority 3: Long Term (90+ days) */}
          <div className="border-l-4 border-carbon-green-60 pl-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 bg-carbon-green-60 text-white rounded-full text-sm font-semibold">
                Priority 3
              </div>
              <h3 className="text-lg font-semibold text-carbon-gray-10">
                Long Term Enhancements (90+ days)
              </h3>
              <span className="text-sm text-carbon-gray-40">
                {longTerm.length} items
              </span>
            </div>
            {longTerm.length > 0 ? (
              <ul className="space-y-3">
                {longTerm.map((finding, index) => (
                  <li key={finding.id} className="flex gap-3">
                    <span className="text-carbon-green-60 font-bold">{index + 1}.</span>
                    <div className="flex-1">
                      <p className="text-sm text-carbon-gray-10 font-medium mb-1">
                        {finding.finding}
                      </p>
                      <p className="text-xs text-carbon-blue-40 font-mono">
                        {finding.regulation}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-carbon-gray-40 italic">No long term actions required</p>
            )}
          </div>
        </div>
      </div>

      {/* Markdown Report Content */}
      <div className="card p-8 shadow-xl">
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => (
                <h1 className="text-4xl font-bold text-carbon-gray-10 mb-6 pb-4 border-b-2 border-carbon-gray-80 print:text-black print:border-gray-300" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-3xl font-bold text-carbon-gray-10 mt-8 mb-4 print:text-black print:mt-6" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-2xl font-semibold text-carbon-gray-10 mt-6 mb-3 print:text-black print:mt-4" {...props} />
              ),
              h4: ({ node, ...props }) => (
                <h4 className="text-xl font-semibold text-carbon-gray-10 mt-4 mb-2 print:text-black" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="text-carbon-gray-30 leading-relaxed mb-4 print:text-gray-700" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc list-inside text-carbon-gray-30 mb-4 space-y-2 print:text-gray-700" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal list-inside text-carbon-gray-30 mb-4 space-y-2 print:text-gray-700" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="text-carbon-gray-30 ml-4 print:text-gray-700" {...props} />
              ),
              strong: ({ node, ...props }) => (
                <strong className="text-carbon-gray-10 font-semibold print:text-black" {...props} />
              ),
              em: ({ node, ...props }) => (
                <em className="text-carbon-blue-40 print:text-blue-600" {...props} />
              ),
              code: ({ node, inline, ...props }) =>
                inline ? (
                  <code className="bg-carbon-gray-80 text-carbon-blue-40 px-2 py-1 rounded text-sm font-mono print:bg-gray-200 print:text-blue-600" {...props} />
                ) : (
                  <code className="block bg-carbon-gray-80 text-carbon-gray-10 p-4 rounded-lg text-sm font-mono overflow-x-auto print:bg-gray-100 print:text-black" {...props} />
                ),
              blockquote: ({ node, ...props }) => (
                <blockquote className="border-l-4 border-carbon-blue-60 pl-4 italic text-carbon-gray-40 my-4 print:border-blue-600 print:text-gray-600" {...props} />
              ),
              hr: ({ node, ...props }) => (
                <hr className="border-carbon-gray-80 my-8 print:border-gray-300" {...props} />
              ),
              table: ({ node, ...props }) => (
                <div className="overflow-x-auto my-6">
                  <table className="min-w-full border border-carbon-gray-80 print:border-gray-300" {...props} />
                </div>
              ),
              thead: ({ node, ...props }) => (
                <thead className="bg-carbon-gray-80 print:bg-gray-200" {...props} />
              ),
              th: ({ node, ...props }) => (
                <th className="px-4 py-2 text-left text-carbon-gray-10 font-semibold border border-carbon-gray-70 print:text-black print:border-gray-300" {...props} />
              ),
              td: ({ node, ...props }) => (
                <td className="px-4 py-2 text-carbon-gray-30 border border-carbon-gray-80 print:text-gray-700 print:border-gray-300" {...props} />
              ),
              a: ({ node, ...props }) => (
                <a className="text-carbon-blue-40 hover:text-carbon-blue-50 underline print:text-blue-600" {...props} />
              ),
            }}
          >
            {reportContent}
          </ReactMarkdown>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }

          .print\\:hidden {
            display: none !important;
          }

          .card {
            box-shadow: none !important;
            border: 1px solid #e5e7eb !important;
            background: white !important;
            page-break-inside: avoid;
          }

          h1, h2, h3 {
            page-break-after: avoid;
            color: black !important;
          }

          table, figure {
            page-break-inside: avoid;
          }

          @page {
            margin: 2cm;
            size: A4;
          }

          /* Ensure proper spacing */
          .space-y-6 > * + * {
            margin-top: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AuditReportViewer;

// Made with Bob
