import 'dotenv/config';
import { Crypto } from '../../../common/classes/index.js';

class AuthEntity {
  constructor(user) {
    this.user = user;
  }

  static getPasswordResetTokenInfo() {
    const resetToken = Crypto.generateRandomBytesToken();
    const hashedResetToken = Crypto.hashedToken(resetToken);
    const resetTokenExpiresInTs = Date.now() + 10 * 60 * 1000;
    const resetTokenExpiresInISO = new Date(
      resetTokenExpiresInTs
    ).toISOString();

    return {
      resetToken,
      resetTokenExpiresIn: resetTokenExpiresInISO,
      hashedResetToken,
    };
  }

  static async getTokenById(id) {
    return Crypto.getTokenById({
      id,
      secretKey: process.env.JWT_SECRET_KEY,
      options: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    });
  }
}

export default AuthEntity;
