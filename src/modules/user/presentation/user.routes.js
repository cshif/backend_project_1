import express from 'express';
import * as userControllers from './user.controllers.js';
import * as authControllers from '../../auth/presentation/auth.controllers.js';

const router = express.Router();

router
  .route('/')
  .all(authControllers.protectRoute)
  .post(userControllers.createUser)
  .get(userControllers.getUsers);
router
  .route('/:id')
  .all(authControllers.protectRoute)
  .get(userControllers.getUser)
  .put(userControllers.updateUser)
  .delete(userControllers.deleteUser);

export default router;
