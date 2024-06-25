import bcrypt from 'bcrypt';

class User {
  constructor() {}

  static async comparePassword(password, userPassword) {
    return bcrypt.compare(password, userPassword);
  }
}

export default User;
