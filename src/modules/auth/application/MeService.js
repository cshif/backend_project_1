import UserEntity from '../../user/domain/UserEntity.js';
import AuthEntity from '../domain/AuthEntity.js';
import { AppError } from '../../../common/classes/index.js';

class MeService {
  #userService;
  constructor({ userService }) {
    this.#userService = userService;
  }

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

  async updateMe(authorization, data) {
    const user =
      await this.#userService.getUserByAuthorizationToken(authorization);

    return this.#userService.updateUser(data, user.id);
  }

  async deleteMe(authorization) {
    const user =
      await this.#userService.getUserByAuthorizationToken(authorization);

    return this.#userService.deleteUser(user.id);
  }
}

export default MeService;
