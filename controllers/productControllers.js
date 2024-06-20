import fs from 'node:fs/promises';

export const createProduct = async (req, res) => {
  try {
    const products = await fs.readFile('./products.json', {
      encoding: 'utf8',
    });
    const newProduct = {
      id: crypto.randomUUID(),
      name: req.body.name,
      price: req.body.price,
    };
    await fs.writeFile(
      './products.json',
      JSON.stringify([...JSON.parse(products), newProduct])
    );
    res.json(newProduct);
  } catch (e) {
    res.status(500).send(new Error(e.message));
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await fs.readFile('./products.json', {
      encoding: 'utf8',
    });
    res.json(JSON.parse(products));
  } catch (e) {
    res.status(500).send(new Error(e.message));
  }
};

export const getProduct = async (req, res) => {
  try {
    const products = await fs.readFile('./products.json', {
      encoding: 'utf8',
    });
    const product = JSON.parse(products).find(
      (product) => product.id === req.params.id
    );
    res.json(product);
  } catch (e) {
    res.status(500).send(new Error(e.message));
  }
};

export const updateProduct = async (req, res) => {
  try {
    const products = await fs.readFile('./products.json', {
      encoding: 'utf8',
    });
    const product = JSON.parse(products).find(
      (product) => product.id === req.params.id
    );
    const productIndex = JSON.parse(products).findIndex(
      (product) => product.id === req.params.id
    );
    if (product) {
      const updatedProduct = {
        id: product.id,
        name: req.body.name || product.name,
        price: req.body.price || product.price,
      };
      const copyProducts = [...JSON.parse(products)];
      copyProducts.splice(productIndex, 1, updatedProduct);
      await fs.writeFile('./products.json', JSON.stringify(copyProducts));
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
    const products = await fs.readFile('./products.json', {
      encoding: 'utf8',
    });
    const productId = JSON.parse(products).find(
      (product) => product.id === req.params.id
    )?.id;
    if (productId) {
      await fs.writeFile(
        './products.json',
        JSON.stringify([
          ...JSON.parse(products).filter((product) => product.id !== productId),
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
