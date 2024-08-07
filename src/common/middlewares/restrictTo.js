import { AppError } from '../classes/index.js';

export default (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(AppError.forbidden());
    }
    next();
  };
