import express from 'express';
import * as userControllers from '../controllers/userControllers.js';

const userRouter = express.Router();

userRouter
  .route('/')
  .post(userControllers.createUser)
  .get(userControllers.getUsers);
userRouter
  .route('/:id')
  .get(userControllers.getUser)
  .put(userControllers.updateUser)
  .delete(userControllers.deleteUser);

export default userRouter;
