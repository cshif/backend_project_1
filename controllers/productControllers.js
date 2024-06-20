import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const products = JSON.parse(fs.readFileSync(`${__dirname}/../products.json`));

export const createProduct = async (req, res) => {
  try {
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
  } catch (e) {
    res.status(500).send(new Error(e.message));
  }
};

export const getProducts = async (req, res) => {
  try {
    res.json(products);
  } catch (e) {
    res.status(500).send(new Error(e.message));
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = products.find((product) => product.id === req.params.id);
    res.json(product);
  } catch (e) {
    res.status(500).send(new Error(e.message));
  }
};

export const updateProduct = async (req, res) => {
  try {
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
  } catch (e) {
    res.status(500).send(new Error(e.message));
  }
};

export const deleteProduct = async (req, res) => {
  try {
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
  } catch (e) {
    res.status(500).send(new Error(e.message));
  }
};
