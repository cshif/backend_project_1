import { AppError } from '../classes/index.js';

export default (req, res, next) => {
  next(AppError.notFound(`can't find ${req.originalUrl}`));
};
