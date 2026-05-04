/**
 * Input Validators
 */

export class Validator {
  /**
   * Validate Email
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate Username
   */
  static isValidUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    return usernameRegex.test(username);
  }

  /**
   * Validate Password
   */
  static isValidPassword(password) {
    // Min 8 chars, at least 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  }

  /**
   * Validate Phone
   */
  static isValidPhone(phone) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Validate URL
   */
  static isValidURL(url) {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Validate UUID
   */
  static isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Validate Message Length
   */
  static isValidMessageLength(message, minLength = 1, maxLength = 5000) {
    return message.length >= minLength && message.length <= maxLength;
  }

  /**
   * Validate String Length
   */
  static isValidStringLength(str, minLength = 1, maxLength = 255) {
    return str && str.length >= minLength && str.length <= maxLength;
  }

  /**
   * Validate Number Range
   */
  static isValidNumberRange(num, min = 0, max = Infinity) {
    return typeof num === 'number' && num >= min && num <= max;
  }

  /**
   * Validate Array
   */
  static isValidArray(arr, minLength = 0, maxLength = Infinity) {
    return (
      Array.isArray(arr) &&
      arr.length >= minLength &&
      arr.length <= maxLength
    );
  }

  /**
   * Validate Object
   */
  static isValidObject(obj) {
    return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
  }

  /**
   * Validate Required Fields
   */
  static validateRequiredFields(obj, requiredFields) {
    const missingFields = [];
    
    for (const field of requiredFields) {
      if (!obj[field] || (typeof obj[field] === 'string' && obj[field].trim() === '')) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    return true;
  }

  /**
   * Validate One Of
   */
  static isOneOf(value, options) {
    return options.includes(value);
  }

  /**
   * Validate Enum
   */
  static isValidEnum(value, enumObj) {
    return Object.values(enumObj).includes(value);
  }

  /**
   * Validate Date
   */
  static isValidDate(date) {
    return date instanceof Date && !isNaN(date);
  }

  /**
   * Validate Timestamp
   */
  static isValidTimestamp(timestamp) {
    return (
      typeof timestamp === 'number' &&
      timestamp > 0 &&
      timestamp < 9999999999999
    );
  }

  /**
   * Validate Hex Color
   */
  static isValidHexColor(color) {
    const hexColorRegex = /^#[0-9A-F]{6}$/i;
    return hexColorRegex.test(color);
  }

  /**
   * Sanitize String
   */
  static sanitizeString(str) {
    return str
      .replace(/[<>]/g, '')
      .replace(/\n\n+/g, '\n')
      .trim();
  }

  /**
   * Escape HTML
   */
  static escapeHTML(str) {
    const entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return str.replace(/[&<>"']/g, (s) => entityMap[s]);
  }

  /**
   * Validate File Extension
   */
  static isValidFileExtension(filename, allowedExtensions) {
    const ext = filename.split('.').pop().toLowerCase();
    return allowedExtensions.includes(ext);
  }

  /**
   * Validate File Size
   */
  static isValidFileSize(size, maxSize = 50 * 1024 * 1024) {
    return size > 0 && size <= maxSize;
  }
}
