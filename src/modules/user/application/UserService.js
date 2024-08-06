/** @typedef {import('../infrastructure/UserRepository.js').default} UserRepository */
/** @typedef {import('../domain/UserEntity.js').default} User */

import 'dotenv/config';
import { Crypto, Day } from '../../../common/classes/index.js';
import filterNullValues from '../../../common/utils/filterNullValues.js';

class UserService {
  /** @type {UserRepository} */
  #userRepository;

  constructor({ userRepository }) {
    this.#userRepository = userRepository;
  }

  /**
   * @param {Object} data
   * @returns {Promise<User>}
   */
  async createUser(data) {
    const hashedPassword = await Crypto.hashPassword(data.password);
    return this.#userRepository.createUser({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      lang: data.lang,
      role: data.role,
      avatarURL: data.avatarURL,
      currentDeviceId: data.currentDeviceId,
    });
  }

  /**
   * @returns {Promise<User[]>}
   */
  async getActiveUsers() {
    return this.#userRepository.findActiveUsers();
  }

  /**
   * @param {number} id
   * @returns {Promise<User>}
   */
  async getUserById(id) {
    return await this.#userRepository.findUnique({
      id,
    });
  }

  /**
   * @param {string} email
   * @returns {Promise<User>}
   */
  async getUserByEmail(email) {
    return await this.#userRepository.findUnique({
      email,
    });
  }

  /**
   * @param {string} passwordResetToken
   * @returns {Promise<User>}
   */
  async getUserByPasswordResetToken(passwordResetToken) {
    const hashedPasswordResetToken = Crypto.hashedToken(passwordResetToken);
    return await this.#userRepository.findFirst({
      passwordResetToken: hashedPasswordResetToken,
      passwordResetTokenExpiresIn: {
        gt: Day.toISOString(Date.now()),
      },
    });
  }

  async getUserByAuthorizationToken(authorization) {
    const token = authorization.split(' ')[1];
    const decodedToken = await Crypto.getDecodedToken({
      token,
      secretKey: process.env.JWT_SECRET_KEY,
    });
    return this.getUserById(decodedToken.id);
  }

  /**
   *
   * @param {Object} data
   * @param {number} id
   * @returns {Promise<User>}
   */
  async updateUser(data, id) {
    return this.#userRepository.updateById(
      id,
      filterNullValues({
        name: data.name,
        lang: data.lang,
        role: data.role,
        avatarURL: data.avatarURL,
        currentDeviceId: data.currentDeviceId,
      })
    );
  }

  async updateUserPassword(password, id) {
    const newHashedPassword = await Crypto.hashPassword(password);
    return this.#userRepository.updateById(id, {
      password: newHashedPassword,
      passwordResetToken: null,
      passwordResetTokenExpiresIn: null,
      passwordChangedAt: Day.toISOString(Date.now()),
    });
  }

  async deleteUser(id) {
    return this.#userRepository.update(id, {
      active: false,
    });
  }
}

export default UserService;
