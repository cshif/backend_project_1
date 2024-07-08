import AppError from './AppError.js';

class DatabaseError extends AppError {
  constructor({ message, code, ...rest }) {
    super(message);
    this.type = code.startsWith('P') ? 'ORMError' : 'DatabaseError';
    this.code = code;
    this.details = rest;
  }
}

export default DatabaseError;
