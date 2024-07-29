import mailer from '../../../common/utils/mailer.js';

class AuthService {
  #authRepository;
  #userRepository;
  constructor({ authRepository, userRepository }) {
    this.#authRepository = authRepository;
    this.#userRepository = userRepository;
  }

  async updatePasswordResetToken(passwordResetTokenInfo, email) {
    const { hashedResetToken, resetTokenExpiresIn } = passwordResetTokenInfo;
    return this.#userRepository.update(
      {
        passwordResetToken: hashedResetToken,
        passwordResetTokenExpiresIn: resetTokenExpiresIn,
      },
      { email }
    );
  }

  async resetPasswordResetToken(email) {
    return this.#userRepository.update(
      {
        passwordResetToken: null,
        passwordResetTokenExpiresIn: null,
      },
      { email }
    );
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
}

export default AuthService;
