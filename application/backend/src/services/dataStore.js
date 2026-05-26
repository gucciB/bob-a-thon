const fs = require('fs').promises;
const path = require('path');
const config = require('../config/config');
const logger = require('../utils/logger');

/**
 * Simple JSON file-based data store for audit results
 */
class DataStore {
  constructor() {
    this.dataPath = path.resolve(config.dataStorePath);
    this.dataDir = path.dirname(this.dataPath);
    this.initialized = false;
  }

  /**
   * Initialize data store - create directory and file if they don't exist
   */
  async initialize() {
    if (this.initialized) return;

    try {
      // Create data directory if it doesn't exist
      await fs.mkdir(this.dataDir, { recursive: true });

      // Check if data file exists
      try {
        await fs.access(this.dataPath);
      } catch {
        // File doesn't exist, create it with empty array
        await fs.writeFile(this.dataPath, JSON.stringify([], null, 2));
        logger.info(`Created new data store at ${this.dataPath}`);
      }

      this.initialized = true;
      logger.info('Data store initialized successfully');
    } catch (error) {
      logger.error(`Failed to initialize data store: ${error.message}`);
      throw error;
    }
  }

  /**
   * Read all audits from the data store
   */
  async readAll() {
    await this.initialize();

    try {
      const data = await fs.readFile(this.dataPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      logger.error(`Failed to read data store: ${error.message}`);
      throw new Error('Failed to read audit data');
    }
  }

  /**
   * Write audits to the data store
   */
  async writeAll(audits) {
    await this.initialize();

    try {
      await fs.writeFile(this.dataPath, JSON.stringify(audits, null, 2));
      logger.debug(`Wrote ${audits.length} audits to data store`);
    } catch (error) {
      logger.error(`Failed to write data store: ${error.message}`);
      throw new Error('Failed to save audit data');
    }
  }

  /**
   * Save a new audit result
   */
  async saveAudit(audit) {
    const audits = await this.readAll();
    audits.unshift(audit); // Add to beginning of array
    
    // Keep only last 100 audits to prevent file from growing too large
    if (audits.length > 100) {
      audits.splice(100);
    }
    
    await this.writeAll(audits);
    logger.info(`Saved audit ${audit.id} to data store`);
    return audit;
  }

  /**
   * Get audit by ID
   */
  async getAuditById(id) {
    const audits = await this.readAll();
    const audit = audits.find(a => a.id === id);
    
    if (!audit) {
      throw new Error(`Audit with ID ${id} not found`);
    }
    
    return audit;
  }

  /**
   * Get audit history (summary view)
   */
  async getHistory(limit = 50) {
    const audits = await this.readAll();
    
    // Return summary information only
    return audits.slice(0, limit).map(audit => ({
      id: audit.id,
      date: audit.timestamp,
      documentName: audit.documentName,
      overallScore: audit.overallScore,
      status: audit.complianceStatus
    }));
  }

  /**
   * Delete audit by ID
   */
  async deleteAudit(id) {
    const audits = await this.readAll();
    const filteredAudits = audits.filter(a => a.id !== id);
    
    if (audits.length === filteredAudits.length) {
      throw new Error(`Audit with ID ${id} not found`);
    }
    
    await this.writeAll(filteredAudits);
    logger.info(`Deleted audit ${id} from data store`);
  }

  /**
   * Clear all audits (use with caution)
   */
  async clearAll() {
    await this.writeAll([]);
    logger.warn('Cleared all audits from data store');
  }
}

module.exports = new DataStore();

// Made with Bob
