import 'dotenv/config';

const sendErrorProd = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    return sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.isOperational) {
      return sendErrorProd(err, res);
    } else {
      console.error('💥');
      res.status(500).json({
        status: 'error',
        message: 'OMG! WHAT DID THEY DO?',
      });
    }
  }
  console.log('which environment?');
};
