import bcrypt from 'bcrypt';
import * as db from '../db/index.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../core/AppError.js';

export const createUser = catchAsync(async (req, res, next) => {
  // 可以寫入 users 的條件：有 email，且 email 沒有使用過
  const { name, email, password, lang, roleId, avatarURL } = req.body;
  if (!email) {
    return next(new AppError('Lack of required data', 404));
  }

  // TODO validate password?

  const hashedPassword = await bcrypt.hash(password, 12);
  const { rows } = await db.query(
    `INSERT INTO users(
      name, email, password, lang, "roleId", "avatarURL"
    ) VALUES ($1,$2,$3,$4,$5,$6) 
    RETURNING *`,
    [name, email, hashedPassword, lang, roleId, avatarURL]
  );
  res.json(rows[0]);
});

export const getUsers = catchAsync(async (req, res, next) => {
  const { rows } = await db.query(`SELECT * FROM users`);
  res.json({ rows });
});

export const getUser = catchAsync(async (req, res, next) => {
  const { rows } = await db.query(`SELECT * FROM users WHERE id = $1`, [
    req.params.id,
  ]);

  if (!rows.length) {
    return next(new AppError("Can't find the user", 404));
  }

  res.json(rows[0]);
});

export const updateUser = catchAsync(async (req, res, next) => {
  const { name, email, password, lang, roleId, avatarURL } = req.body;
  const userId = Number(req.params.id);

  const { rows: users } = await db.query(`SELECT * FROM users WHERE id = $1`, [
    userId,
  ]);

  if (!users.length) {
    return next(new AppError("Can't find the user", 404));
  }

  const newHashedPassword = await bcrypt.hash(password, 12);
  const { rows } = await db.query(
    `UPDATE users
       SET name        = CASE WHEN COALESCE($1) IS NOT NULL THEN $1 ELSE name END,
           password    = CASE WHEN COALESCE($2) IS NOT NULL THEN $2 ELSE password END,
           lang        = CASE WHEN COALESCE($3) IS NOT NULL THEN $3 ELSE lang END,
           "roleId"    = CASE WHEN COALESCE($4::int) IS NOT NULL THEN $4 ELSE "roleId" END,
           "avatarURL" = CASE WHEN COALESCE($5) IS NOT NULL THEN $5 ELSE "avatarURL" END
       WHERE id = $6
       RETURNING *`,
    [name, newHashedPassword, lang, roleId, avatarURL, userId]
  );
  res.json(rows[0]);
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const userId = Number(req.params.id);

  const { rows: users } = await db.query(`SELECT * FROM users WHERE id = $1`, [
    userId,
  ]);

  if (!users.length) {
    return next(new AppError("Can't find the user", 404));
  }

  const { rows } = await db.query(
    `DELETE FROM users WHERE id = $1 RETURNING id`,
    [userId]
  );

  res.json(rows[0]);
});
