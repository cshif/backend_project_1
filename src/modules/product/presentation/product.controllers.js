import catchAsync from '../../../common/utils/catchAsync.js';
import { AppError } from '../../../common/classes/index.js';
import * as db from '../../../config/db/index.js';

export const createProduct = catchAsync(async (req, res, next) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return next(new AppError('Lack of required data', 404));
  }
  const { rows } = await db.query(
    `INSERT INTO "Product"(name, price) VALUES ($1,$2) RETURNING *`,
    [name, price]
  );
  res.json(rows[0]);
});

export const getProducts = catchAsync(async (req, res, next) => {
  const { rows } = await db.query(`SELECT * FROM "Product"`);
  res.json({ rows });
});

export const getProduct = catchAsync(async (req, res, next) => {
  const { rows } = await db.query(`SELECT * FROM "Product" WHERE id = $1`, [
    req.params.id,
  ]);

  if (!rows.length) {
    return next(new AppError("Can't find the product", 404));
  }

  res.json(rows[0]);
});

export const updateProduct = catchAsync(async (req, res, next) => {
  const { name, price } = req.body;
  const productId = Number(req.params.id);

  const { rows: products } = await db.query(
    `SELECT * FROM "Product" WHERE id = $1`,
    [req.params.id]
  );

  if (!products.length) {
    return next(new AppError("Can't find the product", 404));
  }

  const { rows } = await db.query(
    `UPDATE "Product" 
     SET name  = CASE WHEN COALESCE($1) IS NOT NULL THEN $1 ELSE name END,
         price = CASE WHEN COALESCE($2::numeric) IS NOT NULL THEN $2 ELSE price END
     WHERE id = $3 
     RETURNING *
    `,
    [name, price, productId]
  );
  res.json(rows[0]);
});

export const deleteProduct = catchAsync(async (req, res, next) => {
  const productId = Number(req.params.id);
  const { rows: products } = await db.query(
    `SELECT * FROM "Product" WHERE id = $1`,
    [req.params.id]
  );

  if (!products.length) {
    return next(new AppError("Can't find the product", 404));
  }

  const { rows } = await db.query(
    `DELETE FROM "Product" WHERE id = $1 RETURNING *`,
    [productId]
  );

  res.json(rows[0]);
});
