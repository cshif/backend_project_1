import bcrypt from 'bcrypt';

class User {
  constructor({ passwordChangedAt }) {
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
