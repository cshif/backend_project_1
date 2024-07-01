import express from 'express';
import * as userControllers from './user.controllers.js';

const router = express.Router();

router
  .route('/')
  .post(userControllers.createUser)
  .get(userControllers.getUsers);
router
  .route('/:id')
  .get(userControllers.getUser)
  .put(userControllers.updateUser)
  .delete(userControllers.deleteUser);

export default router;
