import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../core/AppError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const products = JSON.parse(fs.readFileSync(`${__dirname}/../products.json`));

export const createProduct = catchAsync(async (req, res, next) => {
  const newProduct = {
    id: crypto.randomUUID(),
    name: req.body.name,
    price: req.body.price,
  };
  await fs.writeFileSync(
    './products.json',
    JSON.stringify([...products, newProduct])
  );
  res.json(newProduct);
});

export const getProducts = catchAsync(async (req, res, next) => {
  res.json(products);
});

export const getProduct = catchAsync(async (req, res, next) => {
  const product = products.find((product) => product.id === req.params.id);

  if (!product) {
    return next(new AppError("Can't find the product", 404));
  }

  res.json(product);
});

export const updateProduct = catchAsync(async (req, res, next) => {
  const product = products.find((product) => product.id === req.params.id);

  if (!product) {
    return next(new AppError("Can't find the product", 404));
  }

  const updatedProduct = {
    id: product.id,
    name: req.body.name || product.name,
    price: req.body.price || product.price,
  };
  const copyProducts = [...products];
  const productIndex = products.findIndex(
    (product) => product.id === req.params.id
  );
  copyProducts.splice(productIndex, 1, updatedProduct);
  await fs.writeFileSync('./products.json', JSON.stringify(copyProducts));
  res.json(updatedProduct);
});

export const deleteProduct = catchAsync(async (req, res, next) => {
  const productId = products.find(
    (product) => product.id === req.params.id
  )?.id;

  if (!productId) {
    return next(new AppError("Can't find the product", 404));
  }

  await fs.writeFileSync(
    './products.json',
    JSON.stringify([...products.filter((product) => product.id !== productId)])
  );
  res.json({ id: productId });
});
