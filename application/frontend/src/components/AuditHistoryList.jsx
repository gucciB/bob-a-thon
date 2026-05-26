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
  TrendingUp
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
      {/* Filters and Search */}
      <div className="card p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-carbon-gray-50" />
              <input
                type="text"
                placeholder="Search by document name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-carbon-gray-80 border border-carbon-gray-70 text-carbon-gray-10 rounded-lg focus:outline-none focus:border-carbon-blue-60 transition-colors"
              />
            </div>
          </div>

          {/* Risk Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterRisk('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filterRisk === 'all'
                  ? 'bg-carbon-blue-60 text-white shadow-lg'
                  : 'bg-carbon-gray-80 text-carbon-gray-30 hover:bg-carbon-gray-70'
              }`}
            >
              All ({riskCounts.all})
            </button>
            <button
              onClick={() => setFilterRisk('HIGH')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filterRisk === 'HIGH'
                  ? 'bg-carbon-red-70 text-white shadow-lg'
                  : 'bg-carbon-gray-80 text-carbon-gray-30 hover:bg-carbon-gray-70'
              }`}
            >
              High ({riskCounts.HIGH})
            </button>
            <button
              onClick={() => setFilterRisk('MEDIUM')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filterRisk === 'MEDIUM'
                  ? 'bg-carbon-orange-60 text-white shadow-lg'
                  : 'bg-carbon-gray-80 text-carbon-gray-30 hover:bg-carbon-gray-70'
              }`}
            >
              Medium ({riskCounts.MEDIUM})
            </button>
            <button
              onClick={() => setFilterRisk('LOW')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filterRisk === 'LOW'
                  ? 'bg-carbon-green-60 text-white shadow-lg'
                  : 'bg-carbon-gray-80 text-carbon-gray-30 hover:bg-carbon-gray-70'
              }`}
            >
              Low ({riskCounts.LOW})
            </button>
          </div>
        </div>
      </div>

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
                onClick={() => onSelectAudit(audit)}
                className={`
                  card p-6 cursor-pointer transition-all duration-200
                  hover:shadow-xl hover:scale-[1.02]
                  border-2 ${riskConfig.borderColor} border-opacity-30
                `}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left Section */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-3">
                      <FileText className={`w-6 h-6 ${riskConfig.textColor} flex-shrink-0 mt-1`} />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-carbon-gray-10 truncate mb-1">
                          {audit.documentName}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-carbon-gray-40">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4" />
                            <span>{findingsCount} findings</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${riskConfig.className}`}>
                        <RiskIcon className="w-3 h-3" />
                        {riskConfig.label}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.className}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <div className={`text-4xl font-bold ${riskConfig.textColor}`}>
                        {audit.overallScore}%
                      </div>
                      <div className="text-xs text-carbon-gray-40 mt-1">
                        Compliance Score
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => handleDelete(audit.id, e)}
                      className={`
                        p-2 rounded-lg transition-all duration-200
                        ${deleteConfirm === audit.id
                          ? 'bg-carbon-red-70 text-white'
                          : 'bg-carbon-gray-80 text-carbon-gray-40 hover:bg-carbon-red-70 hover:text-white'
                        }
                      `}
                      title={deleteConfirm === audit.id ? 'Click again to confirm' : 'Delete audit'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary Footer */}
      {processedAudits.length > 0 && (
        <div className="card p-4 bg-carbon-blue-60 bg-opacity-10 border-carbon-blue-60">
          <div className="flex items-center justify-between text-sm">
            <span className="text-carbon-gray-30">
              Showing {processedAudits.length} of {audits.length} audits
            </span>
            <span className="text-carbon-gray-30">
              {riskCounts.HIGH} High • {riskCounts.MEDIUM} Medium • {riskCounts.LOW} Low
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditHistoryList;

// Made with Bob
