import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { AlertTriangle, AlertCircle, CheckCircle, Shield, TrendingUp, Award } from 'lucide-react';

/**
 * ComplianceDashboard Component
 * Displays comprehensive compliance audit results with visual indicators
 * 
 * @param {Object} auditResult - The audit result object containing scores and findings
 */
const ComplianceDashboard = ({ auditResult }) => {
  if (!auditResult) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-carbon-gray-40">No audit data available</p>
      </div>
    );
  }

  const {
    overallScore,
    complianceStatus,
    riskBreakdown,
    complianceScores,
    documentName,
    timestamp
  } = auditResult;

  // Determine score color based on percentage
  const getScoreColor = (score) => {
    if (score > 80) return {
      text: 'text-carbon-green-60',
      bg: 'bg-carbon-green-60',
      ring: 'ring-carbon-green-60',
      glow: 'shadow-green-500/50'
    };
    if (score >= 50) return {
      text: 'text-carbon-orange-60',
      bg: 'bg-carbon-orange-60',
      ring: 'ring-carbon-orange-60',
      glow: 'shadow-orange-500/50'
    };
    return {
      text: 'text-carbon-red-60',
      bg: 'bg-carbon-red-60',
      ring: 'ring-carbon-red-60',
      glow: 'shadow-red-500/50'
    };
  };

  // Get status configuration
  const getStatusConfig = (status) => {
    switch (status) {
      case 'COMPLIANT':
        return {
          label: 'Compliant',
          icon: CheckCircle,
          bgColor: 'bg-carbon-green-70',
          textColor: 'text-white',
          borderColor: 'border-carbon-green-60',
          glowColor: 'shadow-green-500/30'
        };
      case 'PARTIALLY_COMPLIANT':
        return {
          label: 'Partially Compliant',
          icon: AlertCircle,
          bgColor: 'bg-carbon-orange-60',
          textColor: 'text-white',
          borderColor: 'border-carbon-orange-50',
          glowColor: 'shadow-orange-500/30'
        };
      case 'NON_COMPLIANT':
        return {
          label: 'Non-Compliant',
          icon: AlertTriangle,
          bgColor: 'bg-carbon-red-70',
          textColor: 'text-white',
          borderColor: 'border-carbon-red-60',
          glowColor: 'shadow-red-500/30'
        };
      default:
        return {
          label: 'Unknown',
          icon: AlertCircle,
          bgColor: 'bg-carbon-gray-70',
          textColor: 'text-white',
          borderColor: 'border-carbon-gray-60',
          glowColor: 'shadow-gray-500/30'
        };
    }
  };

  const scoreColors = getScoreColor(overallScore);
  const statusConfig = getStatusConfig(complianceStatus);
  const StatusIcon = statusConfig.icon;

  // Prepare data for circular progress
  const progressData = [
    { name: 'Completed', value: overallScore },
    { name: 'Remaining', value: 100 - overallScore }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Status Banner */}
      <div className={`
        ${statusConfig.bgColor} ${statusConfig.textColor} 
        rounded-xl p-6 border-2 ${statusConfig.borderColor}
        shadow-2xl ${statusConfig.glowColor}
        transform transition-all duration-300 hover:scale-[1.02]
      `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <StatusIcon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">{statusConfig.label}</h2>
              <p className="text-sm opacity-90 mt-1">
                {documentName} • {new Date(timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold">{overallScore}%</div>
            <div className="text-sm opacity-90">Overall Score</div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Circular Progress Indicator */}
        <div className="lg:col-span-1">
          <div className={`
            card p-6 h-full
            border-2 ${scoreColors.ring} border-opacity-30
            shadow-xl ${scoreColors.glow}
            transform transition-all duration-300 hover:scale-[1.02]
          `}>
            <div className="flex items-center gap-2 mb-4">
              <Shield className={`w-5 h-5 ${scoreColors.text}`} />
              <h3 className="text-lg font-semibold text-carbon-gray-10">
                Compliance Score
              </h3>
            </div>
            
            <div className="flex items-center justify-center py-4">
              <div className="relative">
                <ResponsiveContainer width={200} height={200}>
                  <PieChart>
                    <Pie
                      data={progressData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={90}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      <Cell fill={scoreColors.bg.replace('bg-', '#')} className={scoreColors.bg} />
                      <Cell fill="#262626" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-5xl font-bold ${scoreColors.text}`}>
                      {overallScore}
                    </div>
                    <div className="text-sm text-carbon-gray-40 mt-1">
                      out of 100
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-carbon-gray-80">
              <div className="flex items-center justify-between text-sm">
                <span className="text-carbon-gray-40">Status</span>
                <span className={`font-semibold ${scoreColors.text}`}>
                  {overallScore > 80 ? 'Excellent' : overallScore >= 50 ? 'Good' : 'Needs Improvement'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Findings Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* HIGH Risk Card */}
          <div className="
            card p-6 
            border-2 border-carbon-red-70 border-opacity-30
            bg-gradient-to-br from-carbon-red-70/10 to-transparent
            shadow-xl shadow-red-500/20
            transform transition-all duration-300 hover:scale-[1.05] hover:shadow-red-500/40
          ">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-carbon-red-70 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm font-medium text-carbon-gray-30">
                HIGH RISK
              </div>
            </div>
            <div className="text-5xl font-bold text-carbon-red-60 mb-2">
              {riskBreakdown.high}
            </div>
            <div className="text-sm text-carbon-gray-40">
              Critical findings requiring immediate attention
            </div>
          </div>

          {/* MEDIUM Risk Card */}
          <div className="
            card p-6
            border-2 border-carbon-orange-60 border-opacity-30
            bg-gradient-to-br from-carbon-orange-60/10 to-transparent
            shadow-xl shadow-orange-500/20
            transform transition-all duration-300 hover:scale-[1.05] hover:shadow-orange-500/40
          ">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-carbon-orange-60 rounded-lg">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm font-medium text-carbon-gray-30">
                MEDIUM RISK
              </div>
            </div>
            <div className="text-5xl font-bold text-carbon-orange-60 mb-2">
              {riskBreakdown.medium}
            </div>
            <div className="text-sm text-carbon-gray-40">
              Important improvements needed
            </div>
          </div>

          {/* LOW Risk Card */}
          <div className="
            card p-6
            border-2 border-carbon-green-60 border-opacity-30
            bg-gradient-to-br from-carbon-green-60/10 to-transparent
            shadow-xl shadow-green-500/20
            transform transition-all duration-300 hover:scale-[1.05] hover:shadow-green-500/40
          ">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-carbon-green-60 rounded-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm font-medium text-carbon-gray-30">
                LOW RISK
              </div>
            </div>
            <div className="text-5xl font-bold text-carbon-green-60 mb-2">
              {riskBreakdown.low}
            </div>
            <div className="text-sm text-carbon-gray-40">
              Minor enhancements recommended
            </div>
          </div>
        </div>
      </div>

      {/* Regulation Scorecard */}
      <div className="card p-6 shadow-xl border-2 border-carbon-blue-60 border-opacity-20">
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-6 h-6 text-carbon-blue-40" />
          <h3 className="text-xl font-semibold text-carbon-gray-10">
            Regulation Compliance Scorecard
          </h3>
        </div>

        <div className="space-y-6">
          {/* GDPR Compliance */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-carbon-blue-40" />
                <span className="font-semibold text-carbon-gray-10 text-lg">
                  GDPR Compliance
                </span>
              </div>
              <span className={`text-3xl font-bold ${getScoreColor(complianceScores.gdpr).text}`}>
                {complianceScores.gdpr}%
              </span>
            </div>
            <div className="relative w-full h-4 bg-carbon-gray-80 rounded-full overflow-hidden">
              <div
                className={`
                  absolute top-0 left-0 h-full rounded-full
                  ${getScoreColor(complianceScores.gdpr).bg}
                  transition-all duration-1000 ease-out
                  shadow-lg ${getScoreColor(complianceScores.gdpr).glow}
                `}
                style={{ width: `${complianceScores.gdpr}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </div>
            </div>
            <div className="text-sm text-carbon-gray-40">
              General Data Protection Regulation
            </div>
          </div>

          {/* ISO 27001 Compliance */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-carbon-blue-40" />
                <span className="font-semibold text-carbon-gray-10 text-lg">
                  ISO 27001 Compliance
                </span>
              </div>
              <span className={`text-3xl font-bold ${getScoreColor(complianceScores.iso27001).text}`}>
                {complianceScores.iso27001}%
              </span>
            </div>
            <div className="relative w-full h-4 bg-carbon-gray-80 rounded-full overflow-hidden">
              <div
                className={`
                  absolute top-0 left-0 h-full rounded-full
                  ${getScoreColor(complianceScores.iso27001).bg}
                  transition-all duration-1000 ease-out delay-200
                  shadow-lg ${getScoreColor(complianceScores.iso27001).glow}
                `}
                style={{ width: `${complianceScores.iso27001}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </div>
            </div>
            <div className="text-sm text-carbon-gray-40">
              Information Security Management
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default ComplianceDashboard;

// Made with Bob
