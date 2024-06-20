import express from 'express';
import * as productControllers from '../controllers/productControllers.js';

const productRouter = express.Router();

productRouter
  .route('/')
  .post(productControllers.createProduct)
  .get(productControllers.getProducts);
productRouter
  .route('/:id')
  .get(productControllers.getProduct)
  .put(productControllers.updateProduct)
  .delete(productControllers.deleteProduct);

export default productRouter;
