import { Crypto } from '../../../common/classes/index.js';
import Role from '../../role/domain/role.entity.js';

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
    return Crypto.comparePassword(password, userPassword);
  }
}

export default User;
