/**
 * Logger Service
 */

const LOG_LEVELS = {
  ERROR: '❌',
  WARN: '⚠️',
  INFO: 'ℹ️',
  DEBUG: '🔍',
  SUCCESS: '✅'
};

const LOG_COLORS = {
  ERROR: '\x1b[31m',      // Red
  WARN: '\x1b[33m',       // Yellow
  INFO: '\x1b[36m',       // Cyan
  DEBUG: '\x1b[35m',      // Magenta
  SUCCESS: '\x1b[32m',    // Green
  RESET: '\x1b[0m'
};

export class Logger {
  constructor(module = 'App') {
    this.module = module;
  }

  /**
   * Format log message
   */
  _format(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const emoji = LOG_LEVELS[level];
    const color = LOG_COLORS[level];
    
    let logMessage = `${color}${emoji} [${timestamp}] [${this.module}] ${message}${LOG_COLORS.RESET}`;
    
    if (data) {
      logMessage += `\n${JSON.stringify(data, null, 2)}`;
    }
    
    return logMessage;
  }

  /**
   * Log error
   */
  error(message, data = null) {
    console.error(this._format('ERROR', message, data));
  }

  /**
   * Log warning
   */
  warn(message, data = null) {
    console.warn(this._format('WARN', message, data));
  }

  /**
   * Log info
   */
  info(message, data = null) {
    console.log(this._format('INFO', message, data));
  }

  /**
   * Log debug
   */
  debug(message, data = null) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(this._format('DEBUG', message, data));
    }
  }

  /**
   * Log success
   */
  success(message, data = null) {
    console.log(this._format('SUCCESS', message, data));
  }

  /**
   * Log HTTP request
   */
  logRequest(method, path, statusCode, duration = 0) {
    const color = statusCode >= 400 ? LOG_COLORS.ERROR : LOG_COLORS.SUCCESS;
    console.log(
      `${color}${method} ${path} - ${statusCode} (${duration}ms)${LOG_COLORS.RESET}`
    );
  }

  /**
   * Log WebSocket event
   */
  logSocket(event, userId, data = null) {
    console.log(
      `${LOG_COLORS.INFO}🔌 Socket Event: ${event} | User: ${userId}${LOG_COLORS.RESET}`
    );
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
  }

  /**
   * Create child logger
   */
  createChild(module) {
    return new Logger(`${this.module}:${module}`);
  }
}

// Global logger instance
export const logger = new Logger('App');
