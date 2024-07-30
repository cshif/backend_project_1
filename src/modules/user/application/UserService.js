import 'dotenv/config';
import { Crypto, Day } from '../../../common/classes/index.js';
import filterNullValues from '../../../common/utils/filterNullValues.js';

class UserService {
  #userRepository;
  constructor({ userRepository }) {
    this.#userRepository = userRepository;
  }

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

  async getActiveUsers() {
    return this.#userRepository.findActiveUsers();
  }

  async getUserById(id) {
    return await this.#userRepository.findUnique({
      id,
    });
  }

  async getUserByEmail(email) {
    return await this.#userRepository.findUnique({
      email,
    });
  }

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
