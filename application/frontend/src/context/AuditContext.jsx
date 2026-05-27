import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { submitAuditDocument, uploadAndAuditFile, deleteAudit as deleteAuditAPI } from '../services/auditService';

const AuditContext = createContext();

// Action types
const ACTIONS = {
  SET_STAGE: 'SET_STAGE',
  SET_CURRENT_AUDIT: 'SET_CURRENT_AUDIT',
  ADD_TO_HISTORY: 'ADD_TO_HISTORY',
  SET_HISTORY: 'SET_HISTORY',
  DELETE_FROM_HISTORY: 'DELETE_FROM_HISTORY',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  CLEAR_CURRENT_AUDIT: 'CLEAR_CURRENT_AUDIT',
  RESET_TO_IDLE: 'RESET_TO_IDLE'
};

// Initial state
const initialState = {
  currentAudit: null,
  auditHistory: [],
  isAuditing: false,
  auditStage: 'idle', // "idle" | "reading" | "mapping" | "detecting" | "reporting" | "complete"
  error: null
};

// Reducer function
const auditReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_STAGE:
      return {
        ...state,
        auditStage: action.payload,
        isAuditing: action.payload !== 'idle' && action.payload !== 'complete',
        error: null
      };

    case ACTIONS.SET_CURRENT_AUDIT:
      return {
        ...state,
        currentAudit: action.payload,
        auditStage: 'complete',
        isAuditing: false,
        error: null
      };

    case ACTIONS.ADD_TO_HISTORY:
      const newHistory = [action.payload, ...state.auditHistory];
      return {
        ...state,
        auditHistory: newHistory
      };

    case ACTIONS.SET_HISTORY:
      return {
        ...state,
        auditHistory: action.payload
      };

    case ACTIONS.DELETE_FROM_HISTORY:
      return {
        ...state,
        auditHistory: state.auditHistory.filter(audit => audit.id !== action.payload),
        currentAudit: state.currentAudit?.id === action.payload ? null : state.currentAudit
      };

    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isAuditing: false,
        auditStage: 'idle'
      };

    case ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case ACTIONS.CLEAR_CURRENT_AUDIT:
      return {
        ...state,
        currentAudit: null,
        auditStage: 'idle',
        isAuditing: false,
        error: null
      };

    case ACTIONS.RESET_TO_IDLE:
      return {
        ...state,
        auditStage: 'idle',
        isAuditing: false,
        error: null
      };

    default:
      return state;
  }
};

// Load history from localStorage
const loadHistoryFromStorage = () => {
  try {
    const stored = localStorage.getItem('auditHistory');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load audit history from localStorage:', error);
    return [];
  }
};

// Save history to localStorage
const saveHistoryToStorage = (history) => {
  try {
    localStorage.setItem('auditHistory', JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save audit history to localStorage:', error);
  }
};

export const useAudit = () => {
  const context = useContext(AuditContext);
  if (!context) {
    throw new Error('useAudit must be used within an AuditProvider');
  }
  return context;
};

export const AuditProvider = ({ children }) => {
  const [state, dispatch] = useReducer(auditReducer, {
    ...initialState,
    auditHistory: loadHistoryFromStorage()
  });

  // Persist history to localStorage whenever it changes
  useEffect(() => {
    saveHistoryToStorage(state.auditHistory);
  }, [state.auditHistory]);

  // Simulate pipeline progress with stage transitions
  const simulateProgress = useCallback(async (stages, delayMs = 800) => {
    for (const stage of stages) {
      dispatch({ type: ACTIONS.SET_STAGE, payload: stage });
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }, []);

  // Submit audit with text input
  const submitAudit = useCallback(async (documentText, documentName, documentType, regulations = []) => {
    try {
      // Clear any previous errors
      dispatch({ type: ACTIONS.CLEAR_ERROR });
      
      // Start pipeline
      dispatch({ type: ACTIONS.SET_STAGE, payload: 'reading' });

      // Simulate pipeline stages
      await simulateProgress(['reading', 'mapping', 'detecting', 'reporting'], 1000);

      // Submit to API
      const result = await submitAuditDocument({
        text: documentText,
        documentName,
        documentType,
        regulations
      });

      // Add timestamp and ID if not present
      const auditResult = {
        ...result,
        id: result.id || `audit-${Date.now()}`,
        timestamp: result.timestamp || new Date().toISOString(),
        documentName: documentName || 'Untitled Document',
        documentType: documentType || 'policy'
      };

      // Set as current audit
      dispatch({ type: ACTIONS.SET_CURRENT_AUDIT, payload: auditResult });

      // Add to history
      dispatch({ type: ACTIONS.ADD_TO_HISTORY, payload: auditResult });

      return auditResult;
    } catch (error) {
      console.error('Audit submission failed:', error);
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: error.message || 'Failed to process audit. Please try again.' 
      });
      throw error;
    }
  }, [simulateProgress]);

  // Submit audit with file upload
  const submitAuditWithFile = useCallback(async (file, documentName, documentType, regulations = []) => {
    try {
      // Clear any previous errors
      dispatch({ type: ACTIONS.CLEAR_ERROR });
      
      // Start pipeline
      dispatch({ type: ACTIONS.SET_STAGE, payload: 'reading' });

      // Simulate pipeline stages
      await simulateProgress(['reading', 'mapping', 'detecting', 'reporting'], 1000);

      // Upload and audit file
      const result = await uploadAndAuditFile(file, {
        documentName: documentName || file.name,
        documentType,
        regulations
      });

      // Add timestamp and ID if not present
      const auditResult = {
        ...result,
        id: result.id || `audit-${Date.now()}`,
        timestamp: result.timestamp || new Date().toISOString(),
        documentName: documentName || file.name,
        documentType: documentType || 'policy'
      };

      // Set as current audit
      dispatch({ type: ACTIONS.SET_CURRENT_AUDIT, payload: auditResult });

      // Add to history
      dispatch({ type: ACTIONS.ADD_TO_HISTORY, payload: auditResult });

      return auditResult;
    } catch (error) {
      console.error('File audit submission failed:', error);
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: error.message || 'Failed to process file. Please try again.' 
      });
      throw error;
    }
  }, [simulateProgress]);

  // Select a historical audit
  const selectHistoricalAudit = useCallback((auditId) => {
    const audit = state.auditHistory.find(a => a.id === auditId);
    if (audit) {
      dispatch({ type: ACTIONS.SET_CURRENT_AUDIT, payload: audit });
    } else {
      console.warn(`Audit with ID ${auditId} not found in history`);
    }
  }, [state.auditHistory]);

  // Clear current audit
  const clearCurrentAudit = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_CURRENT_AUDIT });
  }, []);

  // Delete audit from history
  const deleteAudit = useCallback(async (auditId) => {
    try {
      // Try to delete from backend
      try {
        await deleteAuditAPI(auditId);
      } catch (apiError) {
        console.warn('Failed to delete from backend, removing from local history only:', apiError);
      }

      // Remove from local state
      dispatch({ type: ACTIONS.DELETE_FROM_HISTORY, payload: auditId });
    } catch (error) {
      console.error('Failed to delete audit:', error);
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: 'Failed to delete audit. Please try again.' 
      });
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_ERROR });
  }, []);

  // Reset to idle state
  const resetToIdle = useCallback(() => {
    dispatch({ type: ACTIONS.RESET_TO_IDLE });
  }, []);

  // Set history (for loading from API)
  const setHistory = useCallback((history) => {
    dispatch({ type: ACTIONS.SET_HISTORY, payload: history });
  }, []);

  // Load audit result directly (for simplified markdown response) - adds to history
  const loadAudit = useCallback((auditData, documentText = '') => {
    // Check if this audit already exists in history (by ID)
    const existingAudit = state.auditHistory.find(a => a.id === auditData.id);
    
    if (existingAudit) {
      // If it exists, just set it as current without adding to history
      dispatch({ type: ACTIONS.SET_CURRENT_AUDIT, payload: existingAudit });
      return existingAudit;
    }
    
    // Generate serial number based on current history length
    const serialNumber = state.auditHistory.length + 1;
    
    // Create content preview (first 200 characters)
    const contentPreview = documentText
      ? documentText.substring(0, 200) + (documentText.length > 200 ? '...' : '')
      : 'No preview available';
    
    // Parse compliance score from report if available
    let overallScore = 0;
    let complianceStatus = 'UNKNOWN';
    let findings = [];
    
    if (auditData.report) {
      // Try to extract score from markdown report
      const scoreMatch = auditData.report.match(/Overall\s+Score[:\s]+(\d+)%/i) ||
                        auditData.report.match(/Compliance\s+Score[:\s]+(\d+)%/i) ||
                        auditData.report.match(/Score[:\s]+(\d+)%/i);
      if (scoreMatch) {
        overallScore = parseInt(scoreMatch[1], 10);
      }
      
      // Determine compliance status based on score
      if (overallScore >= 80) {
        complianceStatus = 'COMPLIANT';
      } else if (overallScore >= 60) {
        complianceStatus = 'PARTIALLY_COMPLIANT';
      } else if (overallScore > 0) {
        complianceStatus = 'NON_COMPLIANT';
      }
      
      // Try to extract findings count
      const findingsMatch = auditData.report.match(/(\d+)\s+(?:findings?|issues?|gaps?)/i);
      if (findingsMatch) {
        const findingsCount = parseInt(findingsMatch[1], 10);
        findings = Array(findingsCount).fill({ severity: 'MEDIUM' });
      }
    }
    
    const auditResult = {
      ...auditData,
      id: auditData.id || `audit-${Date.now()}`,
      serialNumber,
      timestamp: auditData.timestamp || new Date().toISOString(),
      documentName: auditData.documentName || 'Untitled Document',
      documentType: auditData.documentType || 'policy',
      documentContent: documentText,
      contentPreview,
      overallScore,
      complianceStatus,
      findings,
      report: auditData.report || ''
    };
    
    dispatch({ type: ACTIONS.SET_CURRENT_AUDIT, payload: auditResult });
    dispatch({ type: ACTIONS.ADD_TO_HISTORY, payload: auditResult });
    
    return auditResult;
  }, [state.auditHistory]);

  const value = {
    // State
    currentAudit: state.currentAudit,
    auditHistory: state.auditHistory,
    isAuditing: state.isAuditing,
    auditStage: state.auditStage,
    error: state.error,

    // Actions
    submitAudit,
    submitAuditWithFile,
    selectHistoricalAudit,
    clearCurrentAudit,
    deleteAudit,
    clearError,
    resetToIdle,
    setHistory,
    loadAudit
  };

  return (
    <AuditContext.Provider value={value}>
      {children}
    </AuditContext.Provider>
  );
};

// Made with Bob
