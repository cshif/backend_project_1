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
    return this.#userRepository.create(
      {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        lang: data.lang,
        role: data.role,
        avatarURL: data.avatarURL,
        currentDeviceId: data.currentDeviceId,
      },
      {
        select: {
          id: true,
          name: true,
          email: true,
        },
      }
    );
  }

  async getActiveUsers() {
    return this.#userRepository.findMany({
      where: {
        OR: [{ active: { not: false } }, { name: null }],
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
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

  async updateUser(data, id) {
    return this.#userRepository.update(
      filterNullValues({
        name: data.name,
        lang: data.lang,
        role: data.role,
        avatarURL: data.avatarURL,
        currentDeviceId: data.currentDeviceId,
      }),
      { id },
      {
        select: { id: true },
      }
    );
  }

  async updateUserPassword(password, id) {
    const newHashedPassword = await Crypto.hashPassword(password);
    return this.#userRepository.update(
      {
        password: newHashedPassword,
        passwordResetToken: null,
        passwordResetTokenExpiresIn: null,
        passwordChangedAt: Day.toISOString(Date.now()),
      },
      { id }
    );
  }

  async deleteUser(id) {
    return this.#userRepository.update(
      {
        active: false,
      },
      { id },
      {
        select: { email: true },
      }
    );
  }
}

export default UserService;
