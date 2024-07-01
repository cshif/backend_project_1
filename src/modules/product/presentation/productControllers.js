import catchAsync from '../../../common/utils/catchAsync.js';
import { AppError } from '../../../common/class/index.js';
import * as db from '../../../config/db/index.js';

export const createProduct = catchAsync(async (req, res, next) => {
  const { name, price } = req.body;
  const { rows } = await db.query(
    `INSERT INTO products(name, price) VALUES ($1,$2) RETURNING id, name`,
    [name, price]
  );
  res.json(rows[0]);
});

export const getProducts = catchAsync(async (req, res, next) => {
  const { rows } = await db.query(`SELECT * FROM products`);
  res.json({ rows });
});

export const getProduct = catchAsync(async (req, res, next) => {
  const { rows } = await db.query(`SELECT * FROM products WHERE id = $1`, [
    req.params.id,
  ]);

  if (!rows.length) {
    return next(new AppError("Can't find the product", 404));
  }

  res.json(rows[0]);
});

export const updateProduct = catchAsync(async (req, res, next) => {
  const { name, price } = req.body;
  console.log(typeof price);
  const productId = Number(req.params.id);

  const { rows: products } = await db.query(
    `SELECT * FROM products WHERE id = $1`,
    [req.params.id]
  );

  if (!products.length) {
    return next(new AppError("Can't find the product", 404));
  }

  const { rows } = await db.query(
    `UPDATE products 
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
    `SELECT * FROM products WHERE id = $1`,
    [req.params.id]
  );

  if (!products.length) {
    return next(new AppError("Can't find the product", 404));
  }

  const { rows } = await db.query(
    `DELETE FROM products WHERE id = $1 RETURNING id`,
    [productId]
  );

  res.json(rows[0]);
});
