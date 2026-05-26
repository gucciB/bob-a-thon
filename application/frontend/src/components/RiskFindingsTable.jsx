import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, AlertCircle, Info, Filter, Search } from 'lucide-react';

/**
 * RiskFindingsTable Component
 * Professional data table for displaying compliance audit findings
 * 
 * @param {Array} findings - Array of finding objects
 * @param {Function} onFindingClick - Optional callback when a finding is clicked
 */
const RiskFindingsTable = ({ findings = [], onFindingClick }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [filterRisk, setFilterRisk] = useState('all');
  const [sortBy, setSortBy] = useState('risk'); // 'risk', 'score', 'regulation'
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

  // Get risk badge configuration
  const getRiskConfig = (riskLevel) => {
    switch (riskLevel) {
      case 'HIGH':
        return {
          icon: AlertTriangle,
          className: 'bg-carbon-red-70 text-white',
          borderColor: 'border-carbon-red-60',
          bgLight: 'bg-carbon-red-70/10'
        };
      case 'MEDIUM':
        return {
          icon: AlertCircle,
          className: 'bg-carbon-orange-60 text-white',
          borderColor: 'border-carbon-orange-50',
          bgLight: 'bg-carbon-orange-60/10'
        };
      case 'LOW':
        return {
          icon: Info,
          className: 'bg-carbon-green-60 text-white',
          borderColor: 'border-carbon-green-50',
          bgLight: 'bg-carbon-green-60/10'
        };
      default:
        return {
          icon: Info,
          className: 'bg-carbon-gray-70 text-white',
          borderColor: 'border-carbon-gray-60',
          bgLight: 'bg-carbon-gray-70/10'
        };
    }
  };

  // Filter and sort findings
  const processedFindings = useMemo(() => {
    let filtered = findings;

    // Apply risk filter
    if (filterRisk !== 'all') {
      filtered = filtered.filter(f => f.riskLevel === filterRisk);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(f =>
        f.finding.toLowerCase().includes(term) ||
        f.regulation.toLowerCase().includes(term) ||
        f.section.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'risk':
          const riskOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
          comparison = riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
          break;
        case 'score':
          comparison = a.score - b.score;
          break;
        case 'regulation':
          comparison = a.regulation.localeCompare(b.regulation);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [findings, filterRisk, sortBy, sortOrder, searchTerm]);

  // Toggle row expansion
  const toggleRow = (findingId) => {
    setExpandedRow(expandedRow === findingId ? null : findingId);
    if (onFindingClick) {
      onFindingClick(findings.find(f => f.id === findingId));
    }
  };

  // Toggle sort order
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Risk level counts
  const riskCounts = useMemo(() => ({
    all: findings.length,
    HIGH: findings.filter(f => f.riskLevel === 'HIGH').length,
    MEDIUM: findings.filter(f => f.riskLevel === 'MEDIUM').length,
    LOW: findings.filter(f => f.riskLevel === 'LOW').length
  }), [findings]);

  if (!findings || findings.length === 0) {
    return (
      <div className="card p-12 text-center">
        <AlertCircle className="w-16 h-16 text-carbon-gray-60 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-carbon-gray-10 mb-2">No Findings</h3>
        <p className="text-carbon-gray-40">No compliance findings to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="card p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Risk Filter Buttons */}
          <div className="flex flex-wrap gap-2">
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

          {/* Search and Sort */}
          <div className="flex gap-2 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-carbon-gray-50" />
              <input
                type="text"
                placeholder="Search findings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-carbon-gray-80 border border-carbon-gray-70 text-carbon-gray-10 rounded-lg focus:outline-none focus:border-carbon-blue-60 transition-colors"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-carbon-gray-80 border border-carbon-gray-70 text-carbon-gray-10 rounded-lg focus:outline-none focus:border-carbon-blue-60 transition-colors"
            >
              <option value="risk">Sort by Risk</option>
              <option value="score">Sort by Score</option>
              <option value="regulation">Sort by Regulation</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-carbon-gray-80 border-b-2 border-carbon-gray-70">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-semibold text-carbon-gray-10 w-16">
                  #
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-carbon-gray-10">
                  Finding Title
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-carbon-gray-10">
                  Violated Regulation
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-carbon-gray-10">
                  Affected Section
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-carbon-gray-10">
                  Risk Level
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-carbon-gray-10 w-24">
                  Score
                </th>
                <th className="px-4 py-4 text-center text-sm font-semibold text-carbon-gray-10 w-16">
                  
                </th>
              </tr>
            </thead>
            <tbody>
              {processedFindings.map((finding, index) => {
                const riskConfig = getRiskConfig(finding.riskLevel);
                const RiskIcon = riskConfig.icon;
                const isExpanded = expandedRow === finding.id;

                return (
                  <React.Fragment key={finding.id}>
                    <tr
                      onClick={() => toggleRow(finding.id)}
                      className={`
                        border-b border-carbon-gray-80 cursor-pointer transition-all duration-200
                        hover:bg-carbon-gray-80
                        ${isExpanded ? riskConfig.bgLight : ''}
                      `}
                    >
                      <td className="px-4 py-4 text-sm text-carbon-gray-40 font-mono">
                        {index + 1}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-start gap-2">
                          <RiskIcon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                            finding.riskLevel === 'HIGH' ? 'text-carbon-red-60' :
                            finding.riskLevel === 'MEDIUM' ? 'text-carbon-orange-60' :
                            'text-carbon-green-60'
                          }`} />
                          <span className="text-sm text-carbon-gray-10 font-medium">
                            {finding.finding}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-carbon-blue-40 font-mono">
                          {finding.regulation}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-carbon-gray-30">
                          {finding.section}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`
                          inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold uppercase
                          ${riskConfig.className}
                        `}>
                          {finding.riskLevel}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-lg font-bold ${
                          finding.score >= 70 ? 'text-carbon-green-60' :
                          finding.score >= 40 ? 'text-carbon-orange-60' :
                          'text-carbon-red-60'
                        }`}>
                          {finding.score}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-carbon-gray-40 mx-auto" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-carbon-gray-40 mx-auto" />
                        )}
                      </td>
                    </tr>

                    {/* Expanded Row Details */}
                    {isExpanded && (
                      <tr className={`border-b border-carbon-gray-80 ${riskConfig.bgLight}`}>
                        <td colSpan="7" className="px-4 py-6">
                          <div className="space-y-4 max-w-4xl">
                            <div>
                              <h4 className="text-sm font-semibold text-carbon-gray-10 mb-2">
                                Details
                              </h4>
                              <p className="text-sm text-carbon-gray-30 leading-relaxed">
                                {finding.details}
                              </p>
                            </div>

                            {finding.recommendation && (
                              <div className={`p-4 rounded-lg border-2 ${riskConfig.borderColor} bg-carbon-gray-90`}>
                                <h4 className="text-sm font-semibold text-carbon-gray-10 mb-2 flex items-center gap-2">
                                  <span className="text-carbon-blue-40">💡</span>
                                  Recommendation
                                </h4>
                                <p className="text-sm text-carbon-gray-30 leading-relaxed">
                                  {finding.recommendation}
                                </p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="card p-4 bg-carbon-blue-60 bg-opacity-10 border-carbon-blue-60">
        <div className="flex items-center justify-between text-sm">
          <span className="text-carbon-gray-30">
            Showing {processedFindings.length} of {findings.length} findings
          </span>
          <span className="text-carbon-gray-30">
            {riskCounts.HIGH} High • {riskCounts.MEDIUM} Medium • {riskCounts.LOW} Low
          </span>
        </div>
      </div>
    </div>
  );
};

export default RiskFindingsTable;

// Made with Bob
