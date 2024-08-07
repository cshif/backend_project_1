/** @typedef {import('../application/UserService.js').default} UserService */

import { AppError } from '../../../common/classes/index.js';
import { ok } from '../../../common/utils/responses.js';

class UserController {
  /** @type {UserService} */
  #userService;

  constructor({ userService }) {
    if (!userService) {
      throw new Error('UserService is required');
    }
    this.#userService = userService;
  }

  createUser = async (req, res, next) => {
    // 可以寫入 users 的條件：有 email，且 email 沒有使用過
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError('Lack of required data', 404));
    }

    const user = await this.#userService.createUser(req.body);
    if (user instanceof AppError) {
      return next(user);
    }
    return ok(res, user);
  };

  getUsers = async (req, res, next) => {
    const users = await this.#userService.getActiveUsers();
    return ok(res, users);
  };

  getUser = async (req, res, next) => {
    const user = await this.#userService.getUserById(req.params.id);
    if (!user) return next();

    return ok(res, user);
  };

  updateUser = async (req, res, next) => {
    const userId = req.params.id;
    const user = await this.#userService.getUserById(userId);
    if (!user) return next();

    const updatedUser = await this.#userService.updateUser(req.body, userId);
    return ok(res, updatedUser);
  };

  deleteUser = async (req, res, next) => {
    const userId = req.params.id;
    const user = await this.#userService.getUserById(userId);
    if (!user) return next();

    const deletedUser = await this.#userService.deleteUser(userId);
    return ok(res, deletedUser);
  };
}

export default UserController;
