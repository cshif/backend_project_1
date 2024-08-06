/** @typedef {import('../../user/application/UserService.js').default} UserService */

import UserEntity from '../../user/domain/UserEntity.js';
import AuthEntity from '../domain/AuthEntity.js';
import { AppError } from '../../../common/classes/index.js';

class MeService {
  /** @type {UserService} */
  #userService;

  constructor({ userService }) {
    this.#userService = userService;
  }

  /**
   * @param authorization {string}
   * @param newPassword {string}
   * @returns {Promise<AppError|{ token: string }>}
   */
  async updateMyPassword(authorization, newPassword) {
    const user =
      await this.#userService.getUserByAuthorizationToken(authorization);

    const isOldPasswordCorrect = await UserEntity.comparePassword(
      newPassword,
      user.password
    );
    if (!isOldPasswordCorrect) {
      return new AppError('Wrong old password', 401);
    }

    await this.#userService.updateUserPassword(newPassword, user.id);

    const newToken = await AuthEntity.getTokenById(Number(BigInt(user.id)));
    return { token: newToken };
  }

  /**
   * @param {string} authorization
   * @param {Object} data
   * @returns {Promise<User>}
   */
  async updateMe(authorization, data) {
    const user =
      await this.#userService.getUserByAuthorizationToken(authorization);

    return this.#userService.updateUser(data, user.id);
  }

  /**
   * @param {string} authorization
   * @returns {Promise<User>}
   */
  async deleteMe(authorization) {
    const user =
      await this.#userService.getUserByAuthorizationToken(authorization);

    return this.#userService.deleteUser(user.id);
  }
}

export default MeService;
