import express from 'express';
import AuthRepository from '../infrastructure/AuthRepository.js';
import AuthService from '../application/AuthService.js';
import AuthController from './AuthController.js';
import UserRepository from '../../user/infrastructure/UserRepository.js';
import UserService from '../../user/application/UserService.js';

const authRepository = new AuthRepository();
const userRepository = new UserRepository();
const authService = new AuthService({
  authRepository,
  userRepository,
});
const userService = new UserService({ userRepository });
const authController = new AuthController({
  authService,
  userService,
});

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forget-password', authController.forgetPassword);
router.patch('/reset-password/:token', authController.resetPassword);
router.patch('/update-password', authController.updateMyPassword);
router
  .route('/me')
  .patch(authController.updateMe)
  .delete(authController.deleteMe);

export default router;
