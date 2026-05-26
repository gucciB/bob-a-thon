const fs = require('fs').promises;
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const logger = require('./logger');

/**
 * Extract text from PDF file
 */
async function extractFromPDF(filePath) {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    logger.error(`Error extracting text from PDF: ${error.message}`);
    throw new Error('Failed to extract text from PDF file');
  }
}

/**
 * Extract text from DOCX file
 */
async function extractFromDOCX(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    logger.error(`Error extracting text from DOCX: ${error.message}`);
    throw new Error('Failed to extract text from DOCX file');
  }
}

/**
 * Extract text from TXT file
 */
async function extractFromTXT(filePath) {
  try {
    const text = await fs.readFile(filePath, 'utf-8');
    return text;
  } catch (error) {
    logger.error(`Error extracting text from TXT: ${error.message}`);
    throw new Error('Failed to extract text from TXT file');
  }
}

/**
 * Main text extraction function
 * Determines file type and calls appropriate extractor
 */
async function extractText(filePath, mimeType) {
  logger.info(`Extracting text from file: ${filePath}, type: ${mimeType}`);

  try {
    let text = '';

    switch (mimeType) {
      case 'application/pdf':
        text = await extractFromPDF(filePath);
        break;
      
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        text = await extractFromDOCX(filePath);
        break;
      
      case 'application/msword':
        // For older .doc files, try DOCX extractor (may not work for all)
        text = await extractFromDOCX(filePath);
        break;
      
      case 'text/plain':
        text = await extractFromTXT(filePath);
        break;
      
      default:
        throw new Error(`Unsupported file type: ${mimeType}`);
    }

    // Clean up extracted text
    text = text.trim();
    
    if (!text || text.length === 0) {
      throw new Error('No text could be extracted from the file');
    }

    logger.info(`Successfully extracted ${text.length} characters from file`);
    return text;

  } catch (error) {
    logger.error(`Text extraction failed: ${error.message}`);
    throw error;
  }
}

/**
 * Clean up uploaded file
 */
async function cleanupFile(filePath) {
  try {
    await fs.unlink(filePath);
    logger.debug(`Cleaned up file: ${filePath}`);
  } catch (error) {
    logger.warn(`Failed to cleanup file ${filePath}: ${error.message}`);
  }
}

module.exports = {
  extractText,
  cleanupFile
};

// Made with Bob
