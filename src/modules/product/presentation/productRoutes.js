import express from 'express';
import * as productControllers from './productControllers.js';
import * as authControllers from '../../auth/presentation/authControllers.js';
import roles from '../../../constants/roles.js';

const router = express.Router();

router
  .route('/')
  .all(authControllers.protectRoute)
  .post(
    authControllers.restrictTo(roles.ADMIN, roles.SALES),
    productControllers.createProduct
  )
  .get(productControllers.getProducts);
router
  .route('/:id')
  .all(authControllers.protectRoute)
  .get(productControllers.getProduct)
  .put(
    authControllers.restrictTo(roles.ADMIN, roles.SALES),
    productControllers.updateProduct
  )
  .delete(
    authControllers.restrictTo(roles.ADMIN),
    productControllers.deleteProduct
  );

export default router;
