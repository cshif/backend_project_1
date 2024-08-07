import { AppError } from '../classes/index.js';
import bigIntReplacer from './bigIntReplacer.js';
import httpStatusCode from '../../constants/httpStatusCode.js';

export const ok = (res, data, others) =>
  res.status(httpStatusCode.OK).json({
    data: JSON.parse(JSON.stringify(data, bigIntReplacer)),
    ...others,
  });

export const unauthorized = (res, errorMsg) =>
  res.status(httpStatusCode.UNAUTHORIZED).json({
    error: AppError.unauthorized(errorMsg),
  });

export const forbidden = (res, errorMsg) =>
  res.status(httpStatusCode.FORBIDDEN).json({
    error: AppError.forbidden(errorMsg),
  });

export const notFound = (res, errorMsg) =>
  res.status(httpStatusCode.NOT_FOUND).json({
    error: AppError.notFound(errorMsg),
  });

export const internalServerError = (res, errorMsg) =>
  res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
    error: AppError.internalServerError(errorMsg),
  });
