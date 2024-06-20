import express from 'express';
import morgan from 'morgan';
import userRouter from './routes/userRoutes.js';
import productRouter from './routes/productRoutes.js';

const app = express();
app.use(morgan('tiny'));
app.use(express.json());

app.get('/', (req, res) => {
  res.json('yo');
});

app.use('/users', userRouter);
app.use('/products', productRouter);

export default app;
