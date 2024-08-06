import { promisify } from 'util';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

class Crypto {
  constructor() {}

  /**
   * @param {string} password
   * @returns {Promise<string>}
   */
  static async hashPassword(password) {
    return bcrypt.hash(password, 12);
  }

  /**
   * @param rawPassword
   * @param hashedPassword
   * @returns {boolean}
   */
  static comparePassword(rawPassword, hashedPassword) {
    return bcrypt.compare(rawPassword, hashedPassword);
  }

  /**
   * @param {string} token
   * @returns {string}
   */
  static hashedToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * @returns {string}
   */
  static generateRandomBytesToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * @param {Object} arg
   * @param {number} arg.id
   * @param {string} arg.secretKey
   * @param {Object} arg.options
   * @returns {string}
   */
  static getTokenById({ id, secretKey, options }) {
    return jwt.sign({ id }, secretKey, options);
  }

  /**
   * @param {Object} arg
   * @param {string} arg.token
   * @param {string} arg.secretKey
   * @param {Object} arg.options
   * @returns {Promise<string>}
   */
  static async getDecodedToken({ token, secretKey, options }) {
    return promisify(jwt.verify)(token, secretKey, options);
  }
}

export default Crypto;
