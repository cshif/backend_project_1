import prisma from '../../../prismaClient.js';

class UserRepository {
  constructor() {}

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

  async findUnique(where, opts = {}) {
    return prisma.user.findUniqueOrThrow({
      where,
      ...opts,
    });
  }

  async findFirst(where, opts = {}) {
    return prisma.user.findFirstOrThrow({
      where,
      ...opts,
    });
  }

  async update(data, where, opts = {}) {
    return prisma.user.update({
      data,
      where,
      ...opts,
    });
  }

  async updateById(id, data) {
    return prisma.user.update({
      data,
      where: { id },
      select: {
        id: true,
      },
    });
  }

  async updateByEmail(email, data) {
    return prisma.user.update({
      data,
      where: { email },
      select: {
        email: true,
      },
    });
  }

  async delete(where, opts = {}) {
    return prisma.user.delete({
      where,
      ...opts,
    });
  }
}

export default UserRepository;
