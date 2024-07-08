import 'dotenv/config';
import { promisify } from 'util';
import crypto from 'crypto';
import * as db from '../../../config/db/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import catchAsync from '../../../common/utils/catchAsync.js';
import { AppError } from '../../../common/classes/index.js';
import User from '../../user/domain/user.entity.js';
import mailer from '../../../common/utils/mailer.js';

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
    `INSERT INTO "User"(email, password) VALUES ($1,$2) RETURNING id, email`,
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

  const { rows } = await db.query(`SELECT * FROM "User" WHERE email = $1`, [
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
  if (!authorization || !authorization.startsWith('Bearer')) {
    return next(new AppError('Unauthorized', 401));
  }

  const token = authorization.split(' ')[1];
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );
  const { rows: users } = await db.query(`SELECT * FROM "User" WHERE id = $1`, [
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

export const forgetPassword = catchAsync(async (req, res, next) => {
  /*
   * step 1. get user based on email
   * step 2. generate random reset token
   * step 3. send email
   * */

  const { rows: users } = await db.query(
    `SELECT * FROM "User" WHERE email = $1`,
    [req.body.email]
  );
  if (!users.length) {
    return next(new AppError("Can't find the user", 404));
  }

  const { resetToken, resetTokenExpiresIn, hashedResetToken } = new User(
    users[0]
  ).passwordResetTokenInfo;
  await db.query(
    `UPDATE "User" 
        SET "passwordResetToken"          = $1, 
            "passwordResetTokenExpiresIn" = $2 
        WHERE email = $3`,
    [hashedResetToken, resetTokenExpiresIn, users[0].email]
  );

  try {
    const resetURL = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
    await mailer({
      email: users[0].email,
      subject: 'reset password',
      content: `reset with this url: ${resetURL}.`,
    });
    res.status(200).send('reset password email sent successfully.');
  } catch (e) {
    await db.query(
      `UPDATE "User" 
          SET "passwordResetToken"          = $1, 
              "passwordResetTokenExpiresIn" = $2 
          WHERE email = $3`,
      [undefined, undefined, users[0].email]
    );
    next(new AppError(e.message, 500));
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  /*
   * step 1. get user based on token
   * step 2. if token didn't expire && user exist, set new password
   * step 3. update changePasswordAt
   * step 4. send new JWT token to user
   * */

  const { password } = req.body;
  const hashedResetToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const { rows: users } = await db.query(
    `SELECT * FROM "User" WHERE "passwordResetToken" = $1 AND "passwordResetTokenExpiresIn" > NOW()`,
    [hashedResetToken]
  );

  if (!users.length) {
    return next(new AppError('Invalid token', 400));
  }

  const newHashedPassword = await bcrypt.hash(password, 12);
  await db.query(
    `
    UPDATE "User" 
    SET password                      = $1, 
        "passwordResetToken"          = $2, 
        "passwordResetTokenExpiresIn" = $3,
        "passwordChangedAt"           = $4
    WHERE id = $5`,
    [
      newHashedPassword,
      null,
      null,
      new Date(Date.now()).toISOString(),
      users[0].id,
    ]
  );

  const token = await getTokenById(users[0].id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

export const updateMyPassword = catchAsync(async (req, res, next) => {
  /*
   * step 1. get user
   * step 2. check if old password is correct
   * step 3. update new password
   * step 4. send new JWT token to user
   * */

  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    return next(new AppError('Unauthorized', 401));
  }

  const token = authorization.split(' ')[1];
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );
  const { rows: users } = await db.query(`SELECT * FROM "User" WHERE id = $1`, [
    decodedToken.id,
  ]);
  if (!users.length) {
    return next(new AppError("Can't find the user", 404));
  }

  const isOldPasswordCorrect = await User.comparePassword(
    req.body.password,
    users[0].password
  );
  if (!isOldPasswordCorrect) {
    return next(new AppError('Wrong old password', 401));
  }

  const newHashedPassword = await bcrypt.hash(req.body.newPassword, 12);
  await db.query(
    `
    UPDATE "User" 
    SET password                      = $1, 
        "passwordChangedAt"           = $2
    WHERE id = $3`,
    [newHashedPassword, new Date(Date.now()).toISOString(), users[0].id]
  );

  const newToken = await getTokenById(users[0].id);

  res.status(200).json({
    status: 'success',
    token: newToken,
  });
});

export const updateMe = catchAsync(async (req, res, next) => {
  /*
   * step 1. get user based on token
   * step 2. update columns
   * */

  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    return next(new AppError('Unauthorized', 401));
  }

  const token = authorization.split(' ')[1];
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );
  const { rows: users } = await db.query(`SELECT * FROM "User" WHERE id = $1`, [
    decodedToken.id,
  ]);
  if (!users.length) {
    return next(new AppError("Can't find the user", 404));
  }

  const { email, name, lang, avatarURL, currentDeviceId } = req.body;
  const { rows } = await db.query(
    `UPDATE "User"
        SET email             = CASE WHEN COALESCE($1) IS NOT NULL THEN $1 ELSE email END,
            name              = CASE WHEN COALESCE($2) IS NOT NULL THEN $2 ELSE name END,
            lang              = CASE WHEN COALESCE($3) IS NOT NULL THEN $3 ELSE lang END,
            "avatarURL"       = CASE WHEN COALESCE($4) IS NOT NULL THEN $4 ELSE "avatarURL" END,
            "currentDeviceId" = CASE WHEN COALESCE($5::BIGINT) IS NOT NULL THEN $5 ELSE "currentDeviceId" END
        WHERE id = $6
        RETURNING *`,
    [email, name, lang, avatarURL, currentDeviceId, users[0].id]
  );
  res.json(rows[0]);
});

export const deleteMe = catchAsync(async (req, res, next) => {
  /*
   * step 1. get user based on token
   * step 2. inactive user
   * */

  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    return next(new AppError('Unauthorized', 401));
  }

  const token = authorization.split(' ')[1];
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );
  const { rows: users } = await db.query(`SELECT * FROM "User" WHERE id = $1`, [
    decodedToken.id,
  ]);
  if (!users.length) {
    return next(new AppError("Can't find the user", 404));
  }

  const { rows } = await db.query(
    `UPDATE "User" SET active = $1 WHERE id = $2`,
    [false, users[0].id]
  );
  res.json(rows[0]);
});
