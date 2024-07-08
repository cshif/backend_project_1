import * as db from '../../../config/db/index.js';
import catchAsync from '../../../common/utils/catchAsync.js';
import { AppError, Crypto } from '../../../common/classes/index.js';

export const createUser = catchAsync(async (req, res, next) => {
  // 可以寫入 users 的條件：有 email，且 email 沒有使用過
  const { name, email, password, lang, role, avatarURL, currentDeviceId } =
    req.body;
  if (!email || !password) {
    return next(new AppError('Lack of required data', 404));
  }

  // TODO validate password?

  const hashedPassword = await Crypto.hashPassword(password);
  const { rows } = await db.query(
    `INSERT INTO "User"(
      name, email, password, lang, role, "avatarURL", "currentDeviceId"
    ) VALUES ($1,$2,$3,$4,$5,$6,$7) 
    RETURNING *`,
    [name, email, hashedPassword, lang, role, avatarURL, currentDeviceId]
  );
  res.json(rows[0]);
});

export const getUsers = catchAsync(async (req, res, next) => {
  const { rows } = await db.query(`SELECT * FROM "User"`);
  res.json({ rows });
});

export const getUser = catchAsync(async (req, res, next) => {
  const { rows } = await db.query(`SELECT * FROM "User" WHERE id = $1`, [
    Number(req.params.id),
  ]);

  if (!rows.length) {
    return next(new AppError("Can't find the user", 404));
  }

  res.json(rows[0]);
});

export const updateUser = catchAsync(async (req, res, next) => {
  const { name, password, lang, role, avatarURL, currentDeviceId } = req.body;
  const userId = Number(req.params.id);

  const { rows: users } = await db.query(`SELECT * FROM "User" WHERE id = $1`, [
    userId,
  ]);

  if (!users.length) {
    return next(new AppError("Can't find the user", 404));
  }

  const newHashedPassword = await Crypto.hashPassword(password);
  const { rows } = await db.query(
    `UPDATE "User"
       SET name              = CASE WHEN COALESCE($1) IS NOT NULL THEN $1 ELSE name END,
           password          = CASE WHEN COALESCE($2) IS NOT NULL THEN $2 ELSE password END,
           lang              = CASE WHEN COALESCE($3) IS NOT NULL THEN $3 ELSE lang END,
           role              = CASE WHEN COALESCE($4::"Role") IS NOT NULL THEN $4 ELSE role END,
           "avatarURL"       = CASE WHEN COALESCE($5) IS NOT NULL THEN $5 ELSE "avatarURL" END,
           "currentDeviceId" = CASE WHEN COALESCE($6::BIGINT) IS NOT NULL THEN $6 ELSE "currentDeviceId" END
       WHERE id = $7
     RETURNING *`,
    [name, newHashedPassword, lang, role, avatarURL, currentDeviceId, userId]
  );
  res.json(rows[0]);
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const userId = Number(req.params.id);

  const { rows: users } = await db.query(`SELECT * FROM "User" WHERE id = $1`, [
    userId,
  ]);

  if (!users.length) {
    return next(new AppError("Can't find the user", 404));
  }

  const { rows } = await db.query(
    `DELETE FROM "User" WHERE id = $1 RETURNING *`,
    [userId]
  );

  res.json(rows[0]);
});
