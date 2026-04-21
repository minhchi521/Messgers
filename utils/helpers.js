/**
 * Logger Utility
 * Cung cấp logging centralized
 */
export class Logger {
  static info(message, data = null) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ℹ️  INFO: ${message}`, data || '');
  }

  static error(message, error = null) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ❌ ERROR: ${message}`, error || '');
  }

  static warn(message, data = null) {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] ⚠️  WARN: ${message}`, data || '');
  }

  static debug(message, data = null) {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] 🔧 DEBUG: ${message}`, data || '');
    }
  }

  static success(message, data = null) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ✅ SUCCESS: ${message}`, data || '');
  }
}

/**
 * Response Helper
 * Tạo response object chuẩn
 */
export class ResponseHelper {
  static success(data, message = 'Success') {
    return {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString()
    };
  }

  static error(message, statusCode = 400) {
    return {
      success: false,
      message,
      statusCode,
      timestamp: new Date().toISOString()
    };
  }

  static paginated(data, page, limit, total) {
    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Validation Helper
 */
export class ValidationHelper {
  static isEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  static isNotEmpty(value) {
    return value !== null && value !== undefined && value.toString().trim().length > 0;
  }

  static isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
  }

  static isPositiveNumber(value) {
    return this.isNumber(value) && value > 0;
  }

  static isArray(value) {
    return Array.isArray(value);
  }

  static isString(value) {
    return typeof value === 'string';
  }

  static minLength(value, min) {
    return this.isString(value) && value.length >= min;
  }

  static maxLength(value, max) {
    return this.isString(value) && value.length <= max;
  }
}
