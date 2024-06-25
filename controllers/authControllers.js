import 'dotenv/config';
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
