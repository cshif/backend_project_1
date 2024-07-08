import DatabaseError from '../classes/DatabaseError.js';

export default (err, req, res, next) => {
  const isErrorCodeSQLSTATE = (err?.code ?? '').length === 5;
  return isErrorCodeSQLSTATE ? next(new DatabaseError(err)) : next(err);
};
