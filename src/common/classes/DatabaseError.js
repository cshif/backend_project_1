import AppError from './AppError.js';

class DatabaseError extends AppError {
  constructor({ message, ...rest }) {
    super();
    this.message = `DatabaseError: ${message}`;
    this.details = rest;
  }
}

export default DatabaseError;
