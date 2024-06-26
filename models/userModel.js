import bcrypt from 'bcrypt';
import Role from './roleModel.js';

class User extends Role {
  constructor({ passwordChangedAt, roleId }) {
    super({ roleId });
    this.passwordChangedAt = passwordChangedAt;
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
