import catchAsync from '../../../common/utils/catchAsync.js';
import { AppError } from '../../../common/classes/index.js';
import ProductService from '../application/product.service.js';

export const createProduct = catchAsync(async (req, res, next) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return next(new AppError('Lack of required data', 404));
  }
  const row = await ProductService.createProduct(req, res, next);
  res.json(row);
});

export const getProducts = catchAsync(async (req, res, next) => {
  const row = await ProductService.getProducts(req, res, next);
  res.json(row);
});

export const getProduct = catchAsync(async (req, res, next) => {
  const row = await ProductService.getProductById(req, res, next);

  if (!row) return next();

  res.json(row);
});

export const updateProduct = catchAsync(async (req, res, next) => {
  const row = await ProductService.getProductById(req, res, next);

  if (!row) return next();

  const product = await ProductService.updateProduct(req, res, next);
  res.json(product);
});

export const deleteProduct = catchAsync(async (req, res, next) => {
  const row = await ProductService.getProductById(req, res, next);

  if (!row) return next();

  const product = await ProductService.deleteProduct(req, res, next);

  res.json(product);
});
