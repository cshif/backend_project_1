import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import catchAsync from '../utils/catchAsync.js';

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
  res.json(product);
});

export const updateProduct = catchAsync(async (req, res, next) => {
  const product = products.find((product) => product.id === req.params.id);
  const productIndex = products.findIndex(
    (product) => product.id === req.params.id
  );
  if (product) {
    const updatedProduct = {
      id: product.id,
      name: req.body.name || product.name,
      price: req.body.price || product.price,
    };
    const copyProducts = [...products];
    copyProducts.splice(productIndex, 1, updatedProduct);
    await fs.writeFileSync('./products.json', JSON.stringify(copyProducts));
    res.json(updatedProduct);
  } else {
    res.status(404).send("Can't find product");
  }
});

export const deleteProduct = catchAsync(async (req, res, next) => {
  const productId = products.find(
    (product) => product.id === req.params.id
  )?.id;
  if (productId) {
    await fs.writeFileSync(
      './products.json',
      JSON.stringify([
        ...products.filter((product) => product.id !== productId),
      ])
    );
    res.json({ id: productId });
  } else {
    res.status(404).send("Can't find product");
  }
});
