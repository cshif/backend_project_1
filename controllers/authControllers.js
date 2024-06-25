import * as db from '../db/index.js';
import bcrypt from 'bcrypt';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../core/AppError.js';

export const register = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Lack of required data', 404));
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const { rows } = await db.query(
    `INSERT INTO users(email, password) VALUES ($1,$2) RETURNING *`,
    [email, hashedPassword]
  );
  res.json(rows[0]);
});
