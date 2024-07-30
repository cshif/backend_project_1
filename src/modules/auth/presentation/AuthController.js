import 'dotenv/config';
import User from '../../user/domain/UserEntity.js';
import { AppError, Crypto } from '../../../common/classes/index.js';
import bigIntReplacer from '../../../common/utils/bigIntReplacer.js';

class AuthController {
  #authService;
  #userService;
  #meService;
  constructor({ authService, userService, meService }) {
    if (!authService || !userService || !meService) {
      throw new Error('AuthService and UserService and MeService is required');
    }
    this.#authService = authService;
    this.#userService = userService;
    this.#meService = meService;
  }

  protectRoute = async (req, res, next) => {
    /*
     * step 1. if token exist in header
     * step 2. verify token
     * step 3. if user exist
     * step 4. if user changed password after token issued
     * */

    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];
    const decodedToken = await Crypto.getDecodedToken({
      token,
      secretKey: process.env.JWT_SECRET_KEY,
    });
    const user = await this.#userService.getUserById(decodedToken.id);

    const isUserChangedPasswordAfterTokenIssued = new User(
      user
    ).isChangedPasswordAfterTokenIssued(decodedToken.iat);
    if (isUserChangedPasswordAfterTokenIssued) {
      return next(new AppError('Unauthorized', 401));
    }

    req.user = user;
    next();
  };

  register = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError('Lack of required data', 404));
    }

    const { user, token } = await this.#authService.registerUser(req.body);
    return res.json({
      data: JSON.parse(JSON.stringify(user, bigIntReplacer)),
      token,
    });
  };

  login = async (req, res, next) => {
    /*
     * step 1. if email and password exist
     * step 2. if user exist and password correct
     * step 3. send token to client
     * */

    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError('Lack of required data', 404));
    }

    const result = await this.#authService.loginUser(email, password);
    return result instanceof Error
      ? next(result)
      : res.json({ token: result.token });
  };

  forgetPassword = async (req, res, next) => {
    /*
     * step 1. get user based on email
     * step 2. generate random reset token
     * step 3. send email
     * */

    const result = await this.#authService.forgetUserPassword({
      email: req.body.email,
      protocol: req.protocol,
      host: req.get('host'),
    });
    return result
      ? res.send('reset password email sent successfully.')
      : next(result);
  };

  resetPassword = async (req, res, next) => {
    /*
     * step 1. get user based on token
     * step 2. if token didn't expire && user exist, set new password
     * step 3. update changePasswordAt
     * step 4. send new JWT token to user
     * */

    const { password } = req.body;
    if (!password) {
      return next(new AppError('Lack of required data', 404));
    }

    const { token } = await this.#authService.resetUserPassword(
      req.params.token,
      password
    );
    res.json({ token });
  };

  updateMyPassword = async (req, res, next) => {
    /*
     * step 1. get user
     * step 2. check if old password is correct
     * step 3. update new password
     * step 4. send new JWT token to user
     * */

    const result = await this.#meService.updateMyPassword(
      req.headers.authorization,
      req.body.password
    );
    return result instanceof Error
      ? next(result)
      : res.json({ token: result.token });
  };

  updateMe = async (req, res, next) => {
    /*
     * step 1. get user based on token
     * step 2. update columns
     * */

    const updatedUser = await this.#meService.updateMe(
      req.headers.authorization,
      req.body
    );
    return res.json({
      data: JSON.parse(JSON.stringify(updatedUser, bigIntReplacer)),
    });
  };

  deleteMe = async (req, res, next) => {
    /*
     * step 1. get user based on token
     * step 2. inactive user
     * */

    const deletedUser = await this.#meService.deleteMe(
      req.headers.authorization
    );
    return res.json({
      data: JSON.parse(JSON.stringify(deletedUser, bigIntReplacer)),
    });
  };
}

export default AuthController;
