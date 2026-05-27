const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { asyncHandler, ApiError } = require('../middleware/errorHandler');
const dataStore = require('../services/dataStore');
const icaService = require('../services/icaService');
const { extractText, cleanupFile } = require('../utils/fileExtractor');
const config = require('../config/config');
const logger = require('../utils/logger');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = config.upload.uploadDir;
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: config.upload.maxFileSize
  },
  fileFilter: (req, file, cb) => {
    if (config.upload.allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ApiError(400, `File type ${file.mimetype} is not supported`));
    }
  }
});

/**
 * POST /api/audit/upload
 * Upload a file and extract text
 */
router.post('/upload', upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No file uploaded');
  }

  logger.info(`File uploaded: ${req.file.originalname}`);

  try {
    // Extract text from the uploaded file
    const extractedText = await extractText(req.file.path, req.file.mimetype);

    // Clean up the uploaded file
    await cleanupFile(req.file.path);

    res.json({
      success: true,
      data: {
        text: extractedText,
        filename: req.file.originalname,
        size: req.file.size,
        extractedLength: extractedText.length
      }
    });
  } catch (error) {
    // Clean up file on error
    await cleanupFile(req.file.path);
    throw error;
  }
}));

/**
 * POST /api/audit
 * Perform compliance audit on document text
 * Returns the audit report as markdown text
 */
router.post('/', asyncHandler(async (req, res) => {
  const { text, documentType, documentName, regulations = ['ALL'] } = req.body;

  // Validate input
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    throw new ApiError(400, 'Document text is required');
  }

  if (!documentType) {
    throw new ApiError(400, 'Document type is required');
  }

  logger.info(`Starting audit for document type: ${documentType}`);
  logger.info(`Document name: ${documentName || 'Not provided'}`);
  logger.info(`Document text length: ${text.length} characters`);
  logger.info(`Selected regulations: ${regulations.join(', ')}`);

  // Perform audit using ICA service - returns markdown text
  const auditReportMarkdown = await icaService.performAudit(text, documentType, regulations);

  logger.info(`Audit completed successfully, report length: ${auditReportMarkdown.length} characters`);

  // Return the markdown report directly
  res.json({
    success: true,
    data: {
      report: auditReportMarkdown,
      documentName: documentName || 'Untitled Document',
      documentType: documentType,
      timestamp: new Date().toISOString()
    }
  });
}));

/**
 * GET /api/audit/history
 * Get audit history
 */
router.get('/history', asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;

  logger.info(`Fetching audit history (limit: ${limit})`);

  const history = await dataStore.getHistory(limit);

  res.json({
    success: true,
    data: history
  });
}));

/**
 * GET /api/audit/:id
 * Get specific audit by ID
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  logger.info(`Fetching audit: ${id}`);

  const audit = await dataStore.getAuditById(id);

  res.json({
    success: true,
    data: audit
  });
}));

/**
 * DELETE /api/audit/:id
 * Delete specific audit by ID
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  logger.info(`Deleting audit: ${id}`);

  await dataStore.deleteAudit(id);

  res.json({
    success: true,
    message: `Audit ${id} deleted successfully`
  });
}));

/**
 * POST /api/audit/file
 * Upload file and perform audit in one step
 */
router.post('/file', upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No file uploaded');
  }

  const { documentType } = req.body;

  if (!documentType) {
    await cleanupFile(req.file.path);
    throw new ApiError(400, 'Document type is required');
  }

  logger.info(`File uploaded for audit: ${req.file.originalname}`);

  try {
    // Extract text from the uploaded file
    const extractedText = await extractText(req.file.path, req.file.mimetype);

    // Perform audit
    const auditResult = await icaService.performAudit(extractedText, documentType);
    auditResult.documentName = req.file.originalname;

    // Save audit result
    await dataStore.saveAudit(auditResult);

    // Clean up the uploaded file
    await cleanupFile(req.file.path);

    logger.info(`File audit completed successfully: ${auditResult.id}`);

    res.json({
      success: true,
      data: auditResult
    });
  } catch (error) {
    // Clean up file on error
    await cleanupFile(req.file.path);
    throw error;
  }
}));

module.exports = router;

// Made with Bob
