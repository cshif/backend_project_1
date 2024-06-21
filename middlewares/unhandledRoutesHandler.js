import AppError from '../core/AppError.js';

export default (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl}`, 404));
};
