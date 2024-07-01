import { AppError } from '../core/class';

export default (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl}`, 404));
};
