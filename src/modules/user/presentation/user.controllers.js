import catchAsync from '../../../common/utils/catchAsync.js';
import { AppError } from '../../../common/classes/index.js';
import UserService from '../application/user.service.js';

export const createUser = catchAsync(async (req, res, next) => {
  // 可以寫入 users 的條件：有 email，且 email 沒有使用過
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Lack of required data', 404));
  }
  const row = await UserService.createUser(req, res, next);
  return res.json(row);
});

export const getUsers = catchAsync(async (req, res, next) => {
  const rows = await UserService.getUsers(req, res, next);
  res.json({ rows });
});

export const getUser = catchAsync(async (req, res, next) => {
  const row = await UserService.getUserById(req, res, next);

  if (!row) return next();

  res.json(row);
});

export const updateUser = catchAsync(async (req, res, next) => {
  const row = await UserService.getUserById(req, res, next);

  if (!row) return next();

  const user = await UserService.updateUser(req, res, next);
  res.json(user);
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const row = await UserService.getUserById(req, res, next);

  if (!row) return next();

  const user = await UserService.deleteUser(req, res, next);
  res.json(user);
});
