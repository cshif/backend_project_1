/** @typedef {import('../domain/UserEntity.js').default} User */

import prisma from '../../../prismaClient.js';

class UserRepository {
  constructor() {}

  /**
   * @param {Object} data
   * @returns {Promise<User>}
   */
  async createUser(data) {
    return prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  /**
   * @returns {Promise<User[]>}
   */
  async findActiveUsers() {
    return prisma.user.findMany({
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

  /**
   * @param {Object} where
   * @param {Object} opts
   * @returns {Promise<User>}
   */
  async findUnique(where, opts = {}) {
    return prisma.user.findUniqueOrThrow({
      where,
      ...opts,
    });
  }

  /**
   * @param {Object} where
   * @param {Object} opts
   * @returns {Promise<User>}
   */
  async findFirst(where, opts = {}) {
    return prisma.user.findFirstOrThrow({
      where,
      ...opts,
    });
  }

  /**
   * @param {Object} data
   * @param {Object} where
   * @param {Object} opts
   * @returns {Promise<User>}
   */
  async update(data, where, opts = {}) {
    return prisma.user.update({
      data,
      where,
      ...opts,
    });
  }

  /**
   * @param {number} id
   * @param {Object} data
   * @returns {Promise<User>}
   */
  async updateById(id, data) {
    return prisma.user.update({
      data,
      where: { id },
      select: {
        id: true,
      },
    });
  }

  /**
   * @param {string} email
   * @param {Object} data
   * @returns {Promise<User>}
   */
  async updateByEmail(email, data) {
    return prisma.user.update({
      data,
      where: { email },
      select: {
        email: true,
      },
    });
  }

  /**
   * @param {Object} where
   * @param {Object} opts
   * @returns {Promise<User>}
   */
  async delete(where, opts = {}) {
    return prisma.user.delete({
      where,
      ...opts,
    });
  }
}

export default UserRepository;
