/**
 * Error Handling Middleware
 */
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

/**
 * Request Validation Middleware
 */
export function validateRequest(validatorFn) {
  return (req, res, next) => {
    try {
      validatorFn(req.body);
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
}

/**
 * Logging Middleware
 */
export function loggingMiddleware(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
}

/**
 * CORS Middleware Setup
 */
export function setupCORS(app) {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
}
