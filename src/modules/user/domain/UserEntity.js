import { Crypto } from '../../../common/classes/index.js';

class User {
  /**
   * @param {Object} props
   */
  constructor(props) {
    this.passwordChangedAt = props.passwordChangedAt;
  }

  /**
   * @param {Date} tokenIssuedAt
   * @returns {boolean}
   */
  isChangedPasswordAfterTokenIssued(tokenIssuedAt) {
    const unixFormatPasswordChangedAt = Math.floor(
      new Date(this.passwordChangedAt) / 1000
    );
    return unixFormatPasswordChangedAt > tokenIssuedAt;
  }

  /**
   * @param {string} password
   * @param {string} userPassword
   * @returns {Promise<boolean>}
   */
  static async comparePassword(password, userPassword) {
    return Crypto.comparePassword(password, userPassword);
  }
}

export default User;
