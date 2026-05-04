/**
 * Custom Application Errors
 */

export class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation Error') {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource Not Found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource Already Exists') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal Server Error') {
    super(message, 500);
    this.name = 'InternalServerError';
  }
}

/**
 * Global Error Handler
 */
export function handleError(error, req, res, next) {
  console.error('❌ Error:', {
    name: error.name,
    message: error.message,
    statusCode: error.statusCode,
    path: req.path,
    method: req.method
  });

  if (error.isOperational) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        name: error.name,
        message: error.message
      }
    });
  }

  // Programming or unknown error
  return res.status(500).json({
    success: false,
    error: {
      name: 'InternalServerError',
      message: 'Internal Server Error'
    }
  });
}

/**
 * Async Error Wrapper
 */
export function catchAsync(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
