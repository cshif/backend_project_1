import Router from 'express-promise-router';
import AuthRepository from '../infrastructure/AuthRepository.js';
import AuthService from '../application/AuthService.js';
import AuthController from './AuthController.js';
import UserRepository from '../../user/infrastructure/UserRepository.js';
import UserService from '../../user/application/UserService.js';
import verifyAuthorizationTokenExist from '../../../common/middlewares/verifyAuthorizationTokenExist.js';
import MeService from '../application/MeService.js';

const authRepository = new AuthRepository();
const userRepository = new UserRepository();
const userService = new UserService({ userRepository });
const authService = new AuthService({
  authRepository,
  userRepository,
  userService,
});
const meService = new MeService({ userService });
const authController = new AuthController({
  authService,
  userService,
  meService,
});

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forget-password', authController.forgetPassword);
router.patch('/reset-password/:token', authController.resetPassword);
router.patch(
  '/update-password',
  verifyAuthorizationTokenExist,
  authController.updateMyPassword
);
router
  .route('/me')
  .all(verifyAuthorizationTokenExist)
  .patch(authController.updateMe)
  .delete(authController.deleteMe);

export default router;
