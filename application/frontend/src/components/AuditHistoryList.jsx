import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  FileText,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Trash2,
  Search,
  Filter,
  TrendingUp,
  Eye,
  FileSearch
} from 'lucide-react';

/**
 * AuditHistoryList Component
 * Displays list of previous compliance audits with filtering and search
 * 
 * @param {Array} audits - Array of audit objects
 * @param {Function} onSelectAudit - Callback when audit is selected
 * @param {Function} onDeleteAudit - Callback when audit is deleted
 */
const AuditHistoryList = ({ audits = [], onSelectAudit, onDeleteAudit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Get risk level from score
  const getRiskLevel = (score) => {
    if (score >= 80) return 'LOW';
    if (score >= 60) return 'MEDIUM';
    return 'HIGH';
  };

  // Get risk configuration
  const getRiskConfig = (score) => {
    const riskLevel = getRiskLevel(score);
    
    switch (riskLevel) {
      case 'HIGH':
        return {
          label: 'High Risk',
          icon: AlertTriangle,
          className: 'bg-carbon-red-70 text-white',
          borderColor: 'border-carbon-red-60',
          textColor: 'text-carbon-red-60'
        };
      case 'MEDIUM':
        return {
          icon: AlertCircle,
          label: 'Medium Risk',
          className: 'bg-carbon-orange-60 text-white',
          borderColor: 'border-carbon-orange-50',
          textColor: 'text-carbon-orange-60'
        };
      case 'LOW':
        return {
          label: 'Low Risk',
          icon: CheckCircle,
          className: 'bg-carbon-green-60 text-white',
          borderColor: 'border-carbon-green-50',
          textColor: 'text-carbon-green-60'
        };
      default:
        return {
          label: 'Unknown',
          icon: AlertCircle,
          className: 'bg-carbon-gray-70 text-white',
          borderColor: 'border-carbon-gray-60',
          textColor: 'text-carbon-gray-40'
        };
    }
  };

  // Get status configuration
  const getStatusConfig = (status) => {
    switch (status) {
      case 'COMPLIANT':
        return {
          label: 'Compliant',
          className: 'bg-carbon-green-70 text-white'
        };
      case 'PARTIALLY_COMPLIANT':
        return {
          label: 'Partially Compliant',
          className: 'bg-carbon-orange-60 text-white'
        };
      case 'NON_COMPLIANT':
        return {
          label: 'Non-Compliant',
          className: 'bg-carbon-red-70 text-white'
        };
      default:
        return {
          label: 'Unknown',
          className: 'bg-carbon-gray-70 text-white'
        };
    }
  };

  // Filter and sort audits
  const processedAudits = useMemo(() => {
    let filtered = [...audits];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(audit =>
        audit.documentName.toLowerCase().includes(term)
      );
    }

    // Apply risk filter
    if (filterRisk !== 'all') {
      filtered = filtered.filter(audit => {
        const riskLevel = getRiskLevel(audit.overallScore);
        return riskLevel === filterRisk;
      });
    }

    // Apply document type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(audit =>
        audit.documentType === filterType
      );
    }

    // Sort by most recent first
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return filtered;
  }, [audits, searchTerm, filterRisk, filterType]);

  // Risk level counts
  const riskCounts = useMemo(() => {
    const counts = { all: audits.length, HIGH: 0, MEDIUM: 0, LOW: 0 };
    audits.forEach(audit => {
      const risk = getRiskLevel(audit.overallScore);
      counts[risk]++;
    });
    return counts;
  }, [audits]);

  // Handle delete with confirmation
  const handleDelete = (auditId, e) => {
    e.stopPropagation();
    if (deleteConfirm === auditId) {
      onDeleteAudit(auditId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(auditId);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  // Empty state
  if (audits.length === 0) {
    return (
      <div className="card p-12 text-center">
        <FileText className="w-16 h-16 text-carbon-gray-60 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-carbon-gray-10 mb-2">
          No Audit History
        </h3>
        <p className="text-carbon-gray-40 mb-4">
          Run your first compliance audit above
        </p>
        <div className="inline-flex items-center gap-2 text-sm text-carbon-blue-40">
          <TrendingUp className="w-4 h-4" />
          <span>Start by uploading a document or pasting text</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Audit List */}
      {processedAudits.length === 0 ? (
        <div className="card p-8 text-center">
          <Filter className="w-12 h-12 text-carbon-gray-60 mx-auto mb-3" />
          <p className="text-carbon-gray-40">No audits match your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {processedAudits.map((audit) => {
            const riskConfig = getRiskConfig(audit.overallScore);
            const statusConfig = getStatusConfig(audit.complianceStatus);
            const RiskIcon = riskConfig.icon;
            const { date, time } = formatDate(audit.timestamp);
            const findingsCount = audit.findings?.length || 0;

            return (
              <div
                key={audit.id}
                className={`
                  card p-6 transition-all duration-200
                  border-2 ${riskConfig.borderColor} border-opacity-30
                `}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left Section */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-3">
                      {/* Serial Number Badge */}
                      <div className="flex-shrink-0 w-10 h-10 bg-carbon-blue-60 bg-opacity-20 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-carbon-blue-40">
                          #{audit.serialNumber || processedAudits.indexOf(audit) + 1}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-carbon-gray-10 truncate mb-1">
                          {audit.documentName}
                        </h3>
                        
                        {/* Document Type Badge */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-block px-2 py-0.5 bg-carbon-gray-80 text-carbon-gray-30 text-xs rounded">
                            {audit.documentType?.replace('_', ' ') || 'Unknown Type'}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 text-sm text-carbon-gray-40">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Action Buttons */}
                  <div className="flex flex-col items-end gap-2">
                    {/* Preview Content Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`Document Content:\n\n${audit.documentContent || audit.contentPreview || 'No content available'}`);
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-carbon-gray-80 text-carbon-gray-30 rounded-lg hover:bg-carbon-gray-70 hover:text-carbon-gray-10 transition-colors"
                      title="Preview document content"
                    >
                      <FileSearch className="w-4 h-4" />
                      <span className="text-sm">Preview</span>
                    </button>

                    {/* View Report Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectAudit(audit);
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-carbon-blue-60 text-white rounded-lg hover:bg-carbon-blue-50 transition-colors"
                      title="View audit report"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">View Report</span>
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => handleDelete(audit.id, e)}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
                        ${deleteConfirm === audit.id
                          ? 'bg-carbon-red-70 text-white'
                          : 'bg-carbon-gray-80 text-carbon-gray-40 hover:bg-carbon-red-70 hover:text-white'
                        }
                      `}
                      title={deleteConfirm === audit.id ? 'Click again to confirm' : 'Delete audit'}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm">{deleteConfirm === audit.id ? 'Confirm' : 'Delete'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default AuditHistoryList;

// Made with Bob
