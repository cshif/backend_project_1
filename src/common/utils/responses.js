import bigIntReplacer from './bigIntReplacer.js';
import httpStatusCode from '../../constants/httpStatusCode.js';

export const ok = (res, data, others) =>
  res.status(httpStatusCode.OK).json({
    data: JSON.parse(JSON.stringify(data, bigIntReplacer)),
    ...others,
  });
