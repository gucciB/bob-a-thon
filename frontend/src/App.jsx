import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Download, X } from 'lucide-react';
import { AuditProvider, useAudit } from './context/AuditContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProcessingStatusBar from './components/ProcessingStatusBar';
import DocumentUploadForm from './components/DocumentUploadForm';
import ComplianceDashboard from './components/ComplianceDashboard';
import RiskFindingsTable from './components/RiskFindingsTable';
import AuditReportViewer from './components/AuditReportViewer';
import AuditHistoryList from './components/AuditHistoryList';
import { getAuditHistory } from './services/auditService';

// Main Content Component
const MainContent = ({ activeView }) => {
  const {
    currentAudit,
    isProcessing,
    processingStage,
    progress,
    loadAudit,
    clearCurrentAudit,
    setAuditHistory,
    deleteAuditFromHistory
  } = useAudit();

  const [showReportModal, setShowReportModal] = useState(false);

  // Load audit history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await getAuditHistory();
        setAuditHistory(history);
      } catch (error) {
        console.error('Failed to load audit history:', error);
      }
    };
    loadHistory();
  }, [setAuditHistory]);

  // Show modal when audit completes
  useEffect(() => {
    if (currentAudit && !isProcessing) {
      setShowReportModal(true);
    }
  }, [currentAudit, isProcessing]);

  // Handle audit selection from history
  const handleSelectAudit = (audit) => {
    loadAudit(audit);
    setShowReportModal(true);
  };

  // Handle audit deletion
  const handleDeleteAudit = async (auditId) => {
    deleteAuditFromHistory(auditId);
  };

  // Handle download markdown report
  const handleDownloadMarkdown = () => {
    if (!currentAudit || !currentAudit.report) return;

    const blob = new Blob([currentAudit.report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentAudit.documentName.replace(/[^a-z0-9]/gi, '_')}_audit_report.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle closing modal and clearing form
  const handleCloseModal = () => {
    setShowReportModal(false);
    clearCurrentAudit();
    // Trigger form reset by dispatching a custom event
    window.dispatchEvent(new CustomEvent('resetUploadForm'));
  };

  // Render based on active view
  if (activeView === 'new-audit') {
    return (
      <>
        <div className="space-y-6">
          {/* Document Upload Form */}
          <DocumentUploadForm />

          {/* Processing Status Bar */}
          {isProcessing && (
            <ProcessingStatusBar stage={processingStage} progress={progress} />
          )}

          {/* Empty State */}
          {!currentAudit && !isProcessing && (
            <div className="bg-[#262626] border border-[#393939] rounded-lg p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-[#0f62fe]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#0f62fe]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#f4f4f4] mb-2">
                  No Audit Results Yet
                </h3>
                <p className="text-gray-400">
                  Upload a document or paste text above to start your first compliance audit
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Audit Report Modal */}
        {showReportModal && currentAudit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
            <div className="bg-[#262626] border border-[#393939] rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#393939]">
                <div>
                  <h2 className="text-2xl font-semibold text-carbon-gray-10 mb-2">
                    Compliance Audit Report
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-carbon-gray-40">
                    <span>Document: {currentAudit.documentName}</span>
                    <span>•</span>
                    <span>Type: {currentAudit.documentType}</span>
                    <span>•</span>
                    <span>Generated: {new Date(currentAudit.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Download Button */}
                  <button
                    onClick={handleDownloadMarkdown}
                    className="flex items-center gap-2 px-4 py-2 bg-carbon-blue-60 text-white rounded-lg hover:bg-carbon-blue-50 transition-colors"
                    title="Download as Markdown"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download MD</span>
                  </button>
                  
                  {/* Close Button */}
                  <button
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-carbon-gray-70 rounded-lg transition-colors"
                    title="Close"
                  >
                    <X className="w-6 h-6 text-carbon-gray-30" />
                  </button>
                </div>
              </div>
              
              {/* Modal Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="prose prose-invert prose-headings:text-carbon-gray-10 prose-p:text-carbon-gray-30 prose-strong:text-carbon-gray-10 prose-li:text-carbon-gray-30 prose-code:text-carbon-blue-40 prose-pre:bg-carbon-gray-90 max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {currentAudit.report}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  if (activeView === 'history') {
    return (
      <div>
        <AuditHistoryList 
          onSelectAudit={handleSelectAudit}
          onDeleteAudit={handleDeleteAudit}
        />
      </div>
    );
  }

  if (activeView === 'reports') {
    return (
      <div className="bg-[#262626] border border-[#393939] rounded-lg p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-[#0f62fe]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#0f62fe]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-[#f4f4f4] mb-2">
            Reports Archive
          </h3>
          <p className="text-gray-400 mb-6">
            View and manage all generated compliance reports
          </p>
          <button className="px-6 py-2 bg-[#0f62fe] text-white rounded-lg hover:bg-[#0353e9] transition-colors">
            Coming Soon
          </button>
        </div>
      </div>
    );
  }

  if (activeView === 'settings') {
    return (
      <div className="bg-[#262626] border border-[#393939] rounded-lg p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-[#0f62fe]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#0f62fe]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-[#f4f4f4] mb-2">
            Platform Settings
          </h3>
          <p className="text-gray-400 mb-6">
            Configure audit parameters, integrations, and preferences
          </p>
          <button className="px-6 py-2 bg-[#0f62fe] text-white rounded-lg hover:bg-[#0353e9] transition-colors">
            Coming Soon
          </button>
        </div>
      </div>
    );
  }

  return null;
};

// App Component
const AppContent = () => {
  const [activeView, setActiveView] = useState('new-audit');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);

  const getPageTitle = () => {
    switch (activeView) {
      case 'new-audit':
        return 'New Compliance Audit';
      case 'history':
        return 'Audit History';
      case 'reports':
        return 'Reports Archive';
      case 'settings':
        return 'Settings';
      default:
        return 'Compliance Audit Platform';
    }
  };

  return (
    <div className="flex h-screen bg-[#161616] overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isHidden={isSidebarHidden}
        setIsHidden={setIsSidebarHidden}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
        isSidebarHidden ? 'ml-0' : ''
      }`}>
        {/* Header */}
        <Header pageTitle={getPageTitle()} />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <MainContent activeView={activeView} />
          </div>
        </main>
      </div>
    </div>
  );
};

// Root App with Provider
function App() {
  return (
    <AuditProvider>
      <AppContent />
    </AuditProvider>
  );
}

export default App;

// Made with Bob
