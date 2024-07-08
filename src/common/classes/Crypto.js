import { promisify } from 'util';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

class Crypto {
  constructor() {}

  static async hashPassword(password) {
    return bcrypt.hash(password, 12);
  }

  static comparePassword(rawPassword, hashedPassword) {
    return bcrypt.compare(rawPassword, hashedPassword);
  }

  static hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  static generateRandomBytesToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  static getTokenById({ id, secretKey, options }) {
    return jwt.sign({ id }, secretKey, options);
  }

  static async getDecodedToken({ token, secretKey, options }) {
    return promisify(jwt.verify)(token, secretKey, options);
  }
}

export default Crypto;
