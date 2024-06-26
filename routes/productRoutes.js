import express from 'express';
import * as productControllers from '../controllers/productControllers.js';
import * as authControllers from '../controllers/authControllers.js';

const router = express.Router();

router
  .route('/')
  .all(authControllers.protectRoute)
  .post(productControllers.createProduct)
  .get(productControllers.getProducts);
router
  .route('/:id')
  .all(authControllers.protectRoute)
  .get(productControllers.getProduct)
  .put(productControllers.updateProduct)
  .delete(productControllers.deleteProduct);

export default router;
