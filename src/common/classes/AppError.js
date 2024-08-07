import httpStatusCode from '../../constants/httpStatusCode.js';

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = String(statusCode).startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  static unauthorized(errorMsg) {
    return new AppError(
      errorMsg || 'Unauthorized',
      httpStatusCode.UNAUTHORIZED
    );
  }

  static forbidden(errorMsg) {
    return new AppError(errorMsg || 'Forbidden', httpStatusCode.FORBIDDEN);
  }

  static notFound(errorMsg) {
    return new AppError(errorMsg || 'Not Found', httpStatusCode.NOT_FOUND);
  }

  static conflict(errorMsg) {
    return new AppError(errorMsg || 'Conflict', httpStatusCode.CONFLICT);
  }

  static internalServerError(errorMsg) {
    return new AppError(
      errorMsg || 'Internal Server Error',
      httpStatusCode.INTERNAL_SERVER_ERROR
    );
  }
}

export default AppError;
