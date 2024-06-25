import express from 'express';
import morgan from 'morgan';
import unhandledRoutesHandler from './middlewares/unhandledRoutesHandler.js';
import globalErrorHandler from './middlewares/globalErrorHandler.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import productRouter from './routes/productRoutes.js';

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception, shutting down...', {
    name: error.name,
    message: error.message,
  });
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection, shutting down...', {
    name: error.name,
    message: error.message,
  });
  process.exit(1);
});

const app = express();
app.use(morgan('tiny'));
app.use(express.json());

app.get('/', (req, res) => {
  res.json('yo');
});

app.use('/', authRouter);
app.use('/users', userRouter);
app.use('/products', productRouter);

app.all('*', unhandledRoutesHandler);
app.use(globalErrorHandler);

export default app;
