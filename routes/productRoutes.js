import express from 'express';
import * as productControllers from '../controllers/productControllers.js';

const router = express.Router();

router
  .route('/')
  .post(productControllers.createProduct)
  .get(productControllers.getProducts);
router
  .route('/:id')
  .get(productControllers.getProduct)
  .put(productControllers.updateProduct)
  .delete(productControllers.deleteProduct);

export default router;
