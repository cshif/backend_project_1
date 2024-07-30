import AuthEntity from '../domain/AuthEntity.js';
import UserEntity from '../../user/domain/UserEntity.js';
import { AppError } from '../../../common/classes/index.js';
import mailer from '../../../common/utils/mailer.js';

class AuthService {
  #authRepository;
  #userRepository;
  #userService;
  constructor({ authRepository, userRepository, userService }) {
    this.#authRepository = authRepository;
    this.#userRepository = userRepository;
    this.#userService = userService;
  }

  async registerUser(data) {
    const user = await this.#userService.createUser(data);
    const token = await AuthEntity.getTokenById(Number(BigInt(user.id)));
    return {
      user,
      token,
    };
  }

  async loginUser(email, password) {
    const user = await this.#userService.getUserByEmail(email);

    const isPasswordCorrect = await UserEntity.comparePassword(
      password,
      user.password
    );
    if (!isPasswordCorrect) {
      return new AppError('Wrong password', 401);
    }

    const token = await AuthEntity.getTokenById(Number(BigInt(user.id)));
    return { token };
  }

  async updatePasswordResetToken(passwordResetTokenInfo, email) {
    const { hashedResetToken, resetTokenExpiresIn } = passwordResetTokenInfo;
    return this.#userRepository.updateByEmail(email, {
      passwordResetToken: hashedResetToken,
      passwordResetTokenExpiresIn: resetTokenExpiresIn,
    });
  }

  async resetPasswordResetToken(email) {
    return this.#userRepository.updateByEmail(email, {
      passwordResetToken: null,
      passwordResetTokenExpiresIn: null,
    });
  }

  async sendResetPasswordEmail({ protocol, host, passwordResetToken, email }) {
    const resetURL = `${protocol}://${host}/reset-password/${
      passwordResetToken
    }`;
    return mailer({
      email,
      subject: 'reset password',
      content: `reset with this url: ${resetURL}.`,
    });
  }

  async forgetUserPassword({ email, protocol, host }) {
    /*
     * step 1. get user based on email
     * step 2. generate random reset token
     * step 3. send email
     * */

    const user = await this.#userService.getUserByEmail(email);

    const passwordResetTokenInfo = AuthEntity.getPasswordResetTokenInfo();
    const updatedUser = await this.updatePasswordResetToken(
      passwordResetTokenInfo,
      user.email
    );

    try {
      await this.sendResetPasswordEmail({
        protocol,
        host,
        passwordResetToken: passwordResetTokenInfo.resetToken,
        email: updatedUser.email,
      });
      return true;
    } catch (error) {
      await this.resetPasswordResetToken(user.email);
      return new AppError(error.message, 500);
    }
  }

  async resetUserPassword(passwordResetToken, newPassword) {
    const user =
      await this.#userService.getUserByPasswordResetToken(passwordResetToken);

    await this.#userService.updateUserPassword(newPassword, user.id);

    const token = await AuthEntity.getTokenById(Number(BigInt(user.id)));
    return { token };
  }
}

export default AuthService;
