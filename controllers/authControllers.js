import 'dotenv/config';
import { promisify } from 'util';
import * as db from '../db/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../core/AppError.js';
import User from '../models/userModel.js';

const getTokenById = async (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

export const register = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Lack of required data', 404));
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const { rows } = await db.query(
    `INSERT INTO users(email, password) VALUES ($1,$2) RETURNING id, email`,
    [email, hashedPassword]
  );

  const token = await getTokenById(rows[0].id);

  res.status(200).json({
    status: 'success',
    data: rows[0],
    token,
  });
});

export const login = catchAsync(async (req, res, next) => {
  /*
   * step 1. if email and password exist
   * step 2. if user exist and password correct
   * step 3. send token to client
   * */

  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Lack of required data', 404));
  }

  const { rows } = await db.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  const isPasswordCorrect = await User.comparePassword(
    password,
    rows[0].password
  );
  if (!rows.length || !isPasswordCorrect) {
    return next(new AppError('Wrong email or password', 401));
  }

  const token = await getTokenById(rows[0].id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

export const protectRoute = catchAsync(async (req, res, next) => {
  /*
   * step 1. if token exist in header
   * step 2. verify token
   * step 3. if user exist
   * step 4. if user changed password after token issued
   * */

  const { authorization } = req.headers;
  console.log({ authorization });
  if (!authorization || !authorization.startsWith('Bearer')) {
    return next(new AppError('Unauthorized', 401));
  }

  const token = authorization.split(' ')[1];
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );
  const { rows: users } = await db.query(`SELECT * FROM users WHERE id = $1`, [
    decodedToken.id,
  ]);
  if (!users.length) {
    return next(new AppError("Can't find the user", 404));
  }

  const isUserChangedPasswordAfterTokenIssued = new User(
    users[0]
  ).isChangedPasswordAfterTokenIssued(decodedToken.iat);
  if (isUserChangedPasswordAfterTokenIssued) {
    return next(new AppError('Unauthorized', 401));
  }

  req.user = new User(users[0]);
  next();
});

export const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Forbidden', 403));
    }

    next();
  };
