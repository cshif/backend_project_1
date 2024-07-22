import prisma from '../../../prismaClient.js';
import { Crypto } from '../../../common/classes/index.js';
import bigIntReplacer from '../../../common/utils/bigIntReplacer.js';
import filterNullValues from '../../../common/utils/filterNullValues.js';

const UserService = {
  createUser: async (req, res, next) => {
    const { name, email, password, lang, role, avatarURL, currentDeviceId } =
      req.body;

    try {
      const hashedPassword = await Crypto.hashPassword(password); // TODO shouldn't be here
      const row = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          lang,
          role,
          avatarURL,
          currentDeviceId,
        },
      });
      return JSON.parse(JSON.stringify(row, bigIntReplacer));
    } catch (e) {
      return next(e);
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const rows = await prisma.user.findMany();
      return JSON.parse(JSON.stringify(rows, bigIntReplacer));
    } catch (e) {
      return next(e);
    }
  },
  getUserById: async (req, res, next) => {
    try {
      const row = await prisma.user.findUniqueOrThrow({
        where: { id: req.params.id },
      });
      return JSON.parse(JSON.stringify(row, bigIntReplacer));
    } catch (e) {
      return next(e);
    }
  },
  updateUser: async (req, res, next) => {
    const { name, password, lang, role, avatarURL, currentDeviceId } = req.body;

    try {
      let newHashedPassword = null;
      if (password) {
        newHashedPassword = await Crypto.hashPassword(password); // TODO shouldn't be here
      }
      const row = await prisma.user.update({
        where: { id: req.params.id },
        data: filterNullValues({
          name,
          password: newHashedPassword,
          lang,
          role,
          avatarURL,
          currentDeviceId,
        }),
      });
      return JSON.parse(JSON.stringify(row, bigIntReplacer));
    } catch (e) {
      return next(e);
    }
  },
  deleteUser: async (req, res, next) => {
    try {
      const row = await prisma.user.delete({
        where: { id: req.params.id },
      });
      return JSON.parse(JSON.stringify(row, bigIntReplacer));
    } catch (e) {
      return next(e);
    }
  },
};

export default UserService;
