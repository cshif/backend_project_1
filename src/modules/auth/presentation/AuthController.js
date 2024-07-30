import AuthEntity from '../domain/AuthEntity.js';
import UserEntity from '../../user/domain/UserEntity.js';
import { AppError, Crypto } from '../../../common/classes/index.js';
import bigIntReplacer from '../../../common/utils/bigIntReplacer.js';
import User from '../../user/domain/UserEntity.js';

class AuthController {
  #authService;
  #userService;
  constructor({ authService, userService }) {
    if (!authService || !userService) {
      throw new Error('AuthService and UserService is required');
    }
    this.#authService = authService;
    this.#userService = userService;
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
    if (!user) return next();

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

    const user = await this.#userService.createUser(req.body);
    const token = await AuthEntity.getTokenById(Number(BigInt(user.id)));
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
    const user = await this.#userService.getUserByEmail(req.body.email);
    if (!user) return next();

    const isPasswordCorrect = await UserEntity.comparePassword(
      password,
      user.password
    );
    if (!isPasswordCorrect) {
      return next(new AppError('Wrong password', 401));
    }

    const token = await AuthEntity.getTokenById(Number(BigInt(user.id)));
    res.json({
      token,
    });
  };

  forgetPassword = async (req, res, next) => {
    /*
     * step 1. get user based on email
     * step 2. generate random reset token
     * step 3. send email
     * */

    const user = await this.#userService.getUserByEmail(req.body.email);
    if (!user) return next();

    const passwordResetTokenInfo = AuthEntity.getPasswordResetTokenInfo();
    const updatedUser = await this.#authService.updatePasswordResetToken(
      passwordResetTokenInfo,
      user.email
    );

    try {
      await this.#authService.sendResetPasswordEmail({
        protocol: req.protocol,
        host: req.get('host'),
        passwordResetToken: passwordResetTokenInfo.resetToken,
        email: updatedUser.email,
      });
      res.send('reset password email sent successfully.');
    } catch (error) {
      await this.#authService.resetPasswordResetToken(user.email);
      return next(new AppError(error.message, 500));
    }
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

    const user = await this.#userService.getUserByPasswordResetToken(
      req.params.token
    );
    if (!user) return next();

    await this.#userService.updateUserPassword(password, user.id);

    const token = await AuthEntity.getTokenById(Number(BigInt(user.id)));
    res.json({
      token,
    });
  };

  updateMyPassword = async (req, res, next) => {
    /*
     * step 1. get user
     * step 2. check if old password is correct
     * step 3. update new password
     * step 4. send new JWT token to user
     * */

    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];
    const decodedToken = await Crypto.getDecodedToken({
      token,
      secretKey: process.env.JWT_SECRET_KEY,
    });
    const user = await this.#userService.getUserById(decodedToken.id);
    if (!user) return next();

    const isOldPasswordCorrect = await UserEntity.comparePassword(
      req.body.password,
      user.password
    );
    if (!isOldPasswordCorrect) {
      return next(new AppError('Wrong old password', 401));
    }

    await this.#userService.updateUserPassword(req.body.password, user.id);

    const newToken = await AuthEntity.getTokenById(Number(BigInt(user.id)));
    res.json({
      token: newToken,
    });
  };

  updateMe = async (req, res, next) => {
    /*
     * step 1. get user based on token
     * step 2. update columns
     * */

    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];
    const decodedToken = await Crypto.getDecodedToken({
      token,
      secretKey: process.env.JWT_SECRET_KEY,
    });
    const user = await this.#userService.getUserById(decodedToken.id);
    if (!user) return next();

    const updatedUser = await this.#userService.updateUser(req.body, user.id);
    return res.json({
      data: JSON.parse(JSON.stringify(updatedUser, bigIntReplacer)),
    });
  };

  deleteMe = async (req, res, next) => {
    /*
     * step 1. get user based on token
     * step 2. inactive user
     * */

    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];
    const decodedToken = await Crypto.getDecodedToken({
      token,
      secretKey: process.env.JWT_SECRET_KEY,
    });
    const user = await this.#userService.getUserById(decodedToken.id);
    if (!user) return next();

    const deletedUser = await this.#userService.deleteUser(user.id);
    return res.json({
      data: JSON.parse(JSON.stringify(deletedUser, bigIntReplacer)),
    });
  };
}

export default AuthController;
