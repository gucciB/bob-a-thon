require('dotenv').config();

const config = {
  // Server configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // CORS configuration
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // ICA Workflow API configuration
  ica: {
    apiUrl: process.env.ICA_API_URL,
    apiKey: process.env.ICA_API_KEY,
    workflowId: process.env.ICA_WORKFLOW_ID
  },
  
  // Data storage configuration
  dataStorePath: process.env.DATA_STORE_PATH || './data/audits.json',
  
  // File upload configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB default
    uploadDir: process.env.UPLOAD_DIR || './uploads',
    allowedMimeTypes: [
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  }
};

module.exports = config;

// Made with Bob
