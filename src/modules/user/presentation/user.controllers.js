import catchAsync from '../../../common/utils/catchAsync.js';
import { AppError } from '../../../common/classes/index.js';
import UserService from '../application/user.service.js';

export const createUser = catchAsync(async (req, res, next) => {
  // 可以寫入 users 的條件：有 email，且 email 沒有使用過
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Lack of required data', 404));
  }
  const rows = await UserService.createUser(req, res, next);
  return res.json(rows[0]);
});

export const getUsers = catchAsync(async (req, res, next) => {
  const rows = await UserService.getUsers(req, res, next);
  res.json({ rows });
});

export const getUser = catchAsync(async (req, res, next) => {
  const rows = await UserService.getUserById(req, res, next);

  if (!rows.length) {
    return next(new AppError("Can't find the user", 404));
  }

  res.json(rows[0]);
});

export const updateUser = catchAsync(async (req, res, next) => {
  const users = await UserService.getUserById(req, res, next);

  if (!users.length) {
    return next(new AppError("Can't find the user", 404));
  }

  const rows = await UserService.updateUser(req, res, next);
  res.json(rows[0]);
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const users = await UserService.getUserById(req, res, next);

  if (!users.length) {
    return next(new AppError("Can't find the user", 404));
  }

  const rows = await UserService.deleteUser(req, res, next);
  res.json(rows[0]);
});
