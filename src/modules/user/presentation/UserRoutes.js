import Router from 'express-promise-router';
import UserRepository from '../infrastructure/UserRepository.js';
import UserService from '../application/UserService.js';
import UserController from './UserController.js';
import AuthRepository from '../../auth/infrastructure/AuthRepository.js';
import AuthService from '../../auth/application/AuthService.js';
import AuthController from '../../auth/presentation/AuthController.js';
import MeService from '../../auth/application/MeService.js';
import roles from '../../../constants/roles.js';
import verifyAuthorizationTokenExist from '../../../common/middlewares/verifyAuthorizationTokenExist.js';
import restrictTo from '../../../common/middlewares/restrictTo.js';

const userRepository = new UserRepository();
const authRepository = new AuthRepository();
const userService = new UserService({ userRepository });
const authService = new AuthService({
  authRepository,
  userRepository,
});
const meService = new MeService({ userService });
const userController = new UserController({ userService });
const authController = new AuthController({
  authService,
  userService,
  meService,
});

const router = Router();

router
  .route('/')
  .all(verifyAuthorizationTokenExist, authController.protectRoute)
  .post(restrictTo(roles.ADMIN), userController.createUser)
  .get(userController.getUsers);
router
  .route('/:id')
  .all(verifyAuthorizationTokenExist, authController.protectRoute)
  .get(userController.getUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
