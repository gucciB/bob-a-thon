import axios from 'axios';

/**
 * API Service for Compliance Audit Platform
 * Connects React frontend to Express backend
 */

// Get API base URL from environment variable or use default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with default configuration
// ICA API can take several minutes to respond, so we set a 10 minute timeout
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 600000, // 10 minute timeout (600 seconds)
});

// Request interceptor for logging (development only)
apiClient.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      console.error('[API Error]', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error('[API Error] No response received:', error.message);
    } else {
      // Error in request setup
      console.error('[API Error]', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Submit document text for compliance audit
 * 
 * @param {string} documentText - The document text to audit
 * @param {string} documentName - Name of the document
 * @param {string} documentType - Type of document (privacy-policy, security-policy, vendor-agreement)
 * @returns {Promise<Object>} Audit results
 */
export const submitAuditDocument = async (documentText, documentName, documentType) => {
  try {
    const response = await apiClient.post('/api/audit', {
      text: documentText,
      documentName,
      documentType,
    });

    return {
      success: true,
      data: response.data.data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.response?.data?.error?.message || error.message || 'Failed to submit audit',
    };
  }
};

/**
 * Upload document file and extract text
 * 
 * @param {File} file - The file to upload
 * @returns {Promise<Object>} Extracted text and file metadata
 */
export const uploadDocumentFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/api/audit/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      success: true,
      data: response.data.data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.response?.data?.error?.message || error.message || 'Failed to upload file',
    };
  }
};

/**
 * Upload file and perform audit in one step
 * 
 * @param {File} file - The file to upload and audit
 * @param {string} documentType - Type of document
 * @returns {Promise<Object>} Audit results
 */
export const uploadAndAuditFile = async (file, documentType) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);

    const response = await apiClient.post('/api/audit/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      success: true,
      data: response.data.data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.response?.data?.error?.message || error.message || 'Failed to upload and audit file',
    };
  }
};

/**
 * Get audit history
 * 
 * @param {number} limit - Maximum number of audits to retrieve (default: 50)
 * @returns {Promise<Object>} List of past audits
 */
export const getAuditHistory = async (limit = 50) => {
  try {
    const response = await apiClient.get('/api/audit/history', {
      params: { limit },
    });

    return {
      success: true,
      data: response.data.data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.response?.data?.error?.message || error.message || 'Failed to fetch audit history',
    };
  }
};

/**
 * Get specific audit by ID
 * 
 * @param {string} auditId - The audit ID to retrieve
 * @returns {Promise<Object>} Audit details
 */
export const getAuditById = async (auditId) => {
  try {
    const response = await apiClient.get(`/api/audit/${auditId}`);

    return {
      success: true,
      data: response.data.data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.response?.data?.error?.message || error.message || 'Failed to fetch audit',
    };
  }
};

/**
 * Delete audit by ID
 * 
 * @param {string} auditId - The audit ID to delete
 * @returns {Promise<Object>} Deletion result
 */
export const deleteAudit = async (auditId) => {
  try {
    const response = await apiClient.delete(`/api/audit/${auditId}`);

    return {
      success: true,
      data: response.data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.response?.data?.error?.message || error.message || 'Failed to delete audit',
    };
  }
};

/**
 * Check API health status
 * 
 * @returns {Promise<Object>} Health status
 */
export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/health');

    return {
      success: true,
      data: response.data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.response?.data?.error?.message || error.message || 'API is not responding',
    };
  }
};

/**
 * Export PDF report (mock implementation)
 * In production, this would trigger actual PDF generation
 * 
 * @param {string} auditId - The audit ID to export
 * @returns {Promise<Object>} Export result
 */
export const exportReportPDF = async (auditId) => {
  // Mock implementation - in production, this would call a real endpoint
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: { message: 'PDF export initiated. Download will start shortly.' },
        error: null,
      });
    }, 1000);
  });
};

// Export API base URL for reference
export const getApiBaseUrl = () => API_BASE_URL;

// Export axios instance for custom requests if needed
export { apiClient };

// Default export with all functions
export default {
  submitAuditDocument,
  uploadDocumentFile,
  uploadAndAuditFile,
  getAuditHistory,
  getAuditById,
  deleteAudit,
  checkHealth,
  exportReportPDF,
  getApiBaseUrl,
};

// Made with Bob
