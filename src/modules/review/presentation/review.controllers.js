import catchAsync from '../../../common/utils/catchAsync.js';
import { AppError } from '../../../common/class/index.js';
import * as db from '../../../config/db/index.js';

export const createReview = catchAsync(async (req, res, next) => {
  const { productId, userId, rating, title, descriptions } = req.body;
  const { rows } = await db.query(
    `INSERT INTO "Review"(
        "productId", "userId", rating, title, descriptions
    ) VALUES ($1,$2,$3,$4,$5) RETURNING id`,
    [productId, userId, rating, title, descriptions]
  );
  res.json(rows[0]);
});

export const getReviews = catchAsync(async (req, res, next) => {
  const { rows } = await db.query(`SELECT * FROM "Review"`);
  res.json({ rows });
});

export const getReview = catchAsync(async (req, res, next) => {
  const { rows } = await db.query(`SELECT * FROM "Review" WHERE id = $1`, [
    req.params.id,
  ]);

  if (!rows.length) {
    return next(new AppError("Can't find the review", 404));
  }

  res.json(rows[0]);
});

export const updateReview = catchAsync(async (req, res, next) => {
  const { productId, userId, rating, title, descriptions } = req.body;
  const reviewId = Number(req.params.id);

  const { rows: reviews } = await db.query(
    `SELECT * FROM "Review" WHERE id = $1`,
    [reviewId]
  );

  if (!reviews.length) {
    return next(new AppError("Can't find the product", 404));
  }

  const { rows } = await db.query(
    `UPDATE "Review" 
     SET "productId"  = CASE WHEN COALESCE($1::BIGINT) IS NOT NULL THEN $1 ELSE "productId" END,
         "userId" = CASE WHEN COALESCE($2::BIGINT) IS NOT NULL THEN $2 ELSE "userId" END,
         rating = CASE WHEN COALESCE($3::INT) IS NOT NULL THEN $3 ELSE rating END,
         title = CASE WHEN COALESCE($4) IS NOT NULL THEN $4 ELSE title END,
         descriptions = CASE WHEN COALESCE($5) IS NOT NULL THEN $5 ELSE descriptions END
     WHERE id = $6 
     RETURNING *
    `,
    [productId, userId, rating, title, descriptions, reviewId]
  );
  res.json(rows[0]);
});

export const deleteReview = catchAsync(async (req, res, next) => {
  const reviewId = Number(req.params.id);
  const { rows: reviews } = await db.query(
    `SELECT * FROM "Review" WHERE id = $1`,
    [reviewId]
  );

  if (!reviews.length) {
    return next(new AppError("Can't find the review", 404));
  }

  const { rows } = await db.query(
    `DELETE FROM "Review" WHERE id = $1 RETURNING id`,
    [reviewId]
  );

  res.json(rows[0]);
});
