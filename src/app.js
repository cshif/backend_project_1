import express from 'express';
import morgan from 'morgan';
import unhandledRoutesHandler from './common/handler/unhandledRoutesHandler.js';
import globalErrorHandler from './common/handler/globalErrorHandler.js';
import authRouter from './modules/auth/presentation/auth.routes.js';
import userRouter from './modules/user/presentation/user.routes.js';
import productRouter from './modules/product/presentation/product.routes.js';

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
