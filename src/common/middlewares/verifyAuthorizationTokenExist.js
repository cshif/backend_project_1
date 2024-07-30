import { AppError } from '../classes/index.js';

export default (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    return next(new AppError('Unauthorized', 401));
  }
  return next();
};
