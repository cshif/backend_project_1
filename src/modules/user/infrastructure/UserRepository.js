import prisma from '../../../prismaClient.js';

class UserRepository {
  constructor() {}

  async create(data, opts = {}) {
    return prisma.user.create({
      data,
      ...opts,
    });
  }

  async findMany(opts = {}) {
    return prisma.user.findMany({
      ...opts,
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

  async delete(where, opts = {}) {
    return prisma.user.delete({
      where,
      ...opts,
    });
  }
}

export default UserRepository;
