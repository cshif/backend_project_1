import crypto from 'crypto';
import bcrypt from 'bcrypt';
import Role from '../../role/domain/role.entity.js';

class User extends Role {
  constructor({ passwordChangedAt, roleId }) {
    super({ roleId });
    this.passwordChangedAt = passwordChangedAt;
  }

  get passwordResetTokenInfo() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
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

  isChangedPasswordAfterTokenIssued(tokenIssuedAt) {
    const unixFormatPasswordChangedAt = Math.floor(
      new Date(this.passwordChangedAt) / 1000
    );
    return unixFormatPasswordChangedAt > tokenIssuedAt;
  }

  static async comparePassword(password, userPassword) {
    return bcrypt.compare(password, userPassword);
  }
}

export default User;
