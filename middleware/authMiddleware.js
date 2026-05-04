/**
 * Authentication Middleware
 * JWT Token verification
 */
export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Missing authorization header'
    });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    // Simple token validation (trong production dùng JWT)
    if (!token || token.length < 10) {
      throw new Error('Invalid token');
    }

    // Attach user to request
    req.user = {
      id: token.substr(0, 20)
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
}

/**
 * Rate Limiting Middleware
 */
export function rateLimit(maxRequests = 100, timeWindow = 15 * 60 * 1000) {
  const requestCounts = new Map();

  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const key = `${ip}`;

    if (!requestCounts.has(key)) {
      requestCounts.set(key, []);
    }

    const timestamps = requestCounts.get(key);
    const recentRequests = timestamps.filter(t => now - t < timeWindow);

    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.'
      });
    }

    recentRequests.push(now);
    requestCounts.set(key, recentRequests);

    next();
  };
}

/**
 * Input Sanitization Middleware
 */
export function sanitizeInput(req, res, next) {
  const sanitize = (obj) => {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        // Remove HTML tags
        obj[key] = obj[key].replace(/<[^>]*>/g, '');
        // Limit length
        if (obj[key].length > 5000) {
          obj[key] = obj[key].substr(0, 5000);
        }
      } else if (typeof obj[key] === 'object') {
        sanitize(obj[key]);
      }
    }
  };

  sanitize(req.body);
  sanitize(req.query);
  next();
}

/**
 * Request Timeout Middleware
 */
export function requestTimeout(timeout = 30000) {
  return (req, res, next) => {
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        res.status(408).json({
          success: false,
          message: 'Request timeout'
        });
      }
    }, timeout);

    res.on('finish', () => clearTimeout(timer));
    next();
  };
}
