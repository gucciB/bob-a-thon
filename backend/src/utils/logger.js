const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Simple logger utility
 */
class Logger {
  constructor() {
    this.logFile = path.join(logsDir, 'app.log');
  }

  formatMessage(level, message) {
    const timestamp = new Date().toISOString();
    const logMessage = typeof message === 'object' 
      ? JSON.stringify(message, null, 2) 
      : message;
    return `[${timestamp}] [${level}] ${logMessage}\n`;
  }

  writeToFile(message) {
    try {
      fs.appendFileSync(this.logFile, message);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  info(message) {
    const formattedMessage = this.formatMessage('INFO', message);
    console.log(formattedMessage);
    this.writeToFile(formattedMessage);
  }

  error(message) {
    const formattedMessage = this.formatMessage('ERROR', message);
    console.error(formattedMessage);
    this.writeToFile(formattedMessage);
  }

  warn(message) {
    const formattedMessage = this.formatMessage('WARN', message);
    console.warn(formattedMessage);
    this.writeToFile(formattedMessage);
  }

  debug(message) {
    if (process.env.NODE_ENV === 'development') {
      const formattedMessage = this.formatMessage('DEBUG', message);
      console.log(formattedMessage);
      this.writeToFile(formattedMessage);
    }
  }
}

module.exports = new Logger();

// Made with Bob
