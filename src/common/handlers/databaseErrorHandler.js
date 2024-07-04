import DatabaseError from '../classes/DatabaseError.js';

export default (err, req, res, next) => {
  return next(new DatabaseError(err));
};
