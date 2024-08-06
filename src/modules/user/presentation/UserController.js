/** @typedef {import('../application/UserService.js').default} UserService */

import { AppError } from '../../../common/classes/index.js';
import bigIntReplacer from '../../../common/utils/bigIntReplacer.js';

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
    return res.json({
      data: JSON.parse(JSON.stringify(user, bigIntReplacer)),
    });
  };

  getUsers = async (req, res, next) => {
    const users = await this.#userService.getActiveUsers();
    return res.json({
      data: JSON.parse(JSON.stringify(users, bigIntReplacer)),
    });
  };

  getUser = async (req, res, next) => {
    const user = await this.#userService.getUserById(req.params.id);
    if (!user) return next();

    return res.json({
      data: JSON.parse(JSON.stringify(user, bigIntReplacer)),
    });
  };

  updateUser = async (req, res, next) => {
    const userId = req.params.id;
    const user = await this.#userService.getUserById(userId);
    if (!user) return next();

    const updatedUser = await this.#userService.updateUser(req.body, userId);
    return res.json({
      data: JSON.parse(JSON.stringify(updatedUser, bigIntReplacer)),
    });
  };

  deleteUser = async (req, res, next) => {
    const userId = req.params.id;
    const user = await this.#userService.getUserById(userId);
    if (!user) return next();

    const deletedUser = await this.#userService.deleteUser(userId);
    return res.json({
      data: JSON.parse(JSON.stringify(deletedUser, bigIntReplacer)),
    });
  };
}

export default UserController;
