import express from 'express';
import UserRepository from '../infrastructure/UserRepository.js';
import UserService from '../application/UserService.js';
import UserController from './UserController.js';
import AuthRepository from '../../auth/infrastructure/AuthRepository.js';
import AuthService from '../../auth/application/AuthService.js';
import AuthController from '../../auth/presentation/AuthController.js';
import roles from '../../../constants/roles.js';

const userRepository = new UserRepository();
const authRepository = new AuthRepository();
const userService = new UserService({ userRepository });
const authService = new AuthService({
  authRepository,
  userRepository,
});
const userController = new UserController({ userService });
const authController = new AuthController({
  authService,
  userService,
});

const router = express.Router();

router
  .route('/')
  .all(authController.protectRoute)
  .post(authController.restrictTo(roles.ADMIN), userController.createUser)
  .get(userController.getUsers);
router
  .route('/:id')
  .all(authController.protectRoute)
  .get(userController.getUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
