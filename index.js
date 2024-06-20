import express from 'express';
import morgan from 'morgan';
import fs from 'node:fs/promises';

const app = express();
app.use(morgan('tiny'));
app.use(express.json());

app.get('/', (req, res) => {
  res.json('yo');
});

const createUser = async (req, res) => {
  try {
    const users = await fs.readFile('./users.json', {
      encoding: 'utf8',
    });
    // 可以寫入 users 的條件：有 email，且 email 沒有使用過
    if (
      typeof req.body === 'object' &&
      Object.keys(req.body).includes('email') &&
      !JSON.parse(users).filter((user) => user.email === req.body.email).length
    ) {
      const newUser = {
        id: crypto.randomUUID(),
        name: req.body.name,
        email: req.body.email,
      };
      await fs.writeFile(
        './users.json',
        JSON.stringify([...JSON.parse(users), newUser])
      );
      res.json(newUser);
    } else {
      res.status(404).send('Invalid data.');
    }
  } catch (e) {
    res.status(500).send(new Error(e.message));
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await fs.readFile('./users.json', {
      encoding: 'utf8',
    });
    res.json(JSON.parse(users));
  } catch (e) {
    res.status(500).send(new Error(e.message));
  }
};

const getUser = async (req, res) => {
  try {
    const users = await fs.readFile('./users.json', {
      encoding: 'utf8',
    });
    const user = JSON.parse(users).find((user) => user.id === req.params.id);
    res.json(user);
  } catch (e) {
    res.status(500).send(new Error(e.message));
  }
};

const updateUser = async (req, res) => {
  try {
    const users = await fs.readFile('./users.json', {
      encoding: 'utf8',
    });
    const user = JSON.parse(users).find((user) => user.id === req.params.id);
    const userIndex = JSON.parse(users).findIndex(
      (user) => user.id === req.params.id
    );
    if (user) {
      const updatedUser = {
        id: user.id,
        name: req.body.name || user.name,
        email: req.body.email || user.email,
      };
      const copyUsers = [...JSON.parse(users)];
      copyUsers.splice(userIndex, 1, updatedUser);
      await fs.writeFile('./users.json', JSON.stringify(copyUsers));
      res.json(updatedUser);
    } else {
      res.status(404).send("Can't find user");
    }
  } catch (e) {
    res.status(500).send(new Error(e.message));
  }
};

const deleteUser = async (req, res) => {
  try {
    const users = await fs.readFile('./users.json', {
      encoding: 'utf8',
    });
    const userId = JSON.parse(users).find(
      (user) => user.id === req.params.id
    )?.id;
    if (userId) {
      await fs.writeFile(
        './users.json',
        JSON.stringify([
          ...JSON.parse(users).filter((user) => user.id !== userId),
        ])
      );
      res.json({ id: userId });
    } else {
      res.status(404).send("Can't find user");
    }
  } catch (e) {
    res.status(500).send(new Error(e.message));
  }
};

const userRouter = express.Router();
app.use('/users', userRouter);

userRouter.route('/').post(createUser).get(getUsers);
userRouter.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

const createProduct = async (req, res) => {
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

const getProducts = async (req, res) => {
  try {
    const products = await fs.readFile('./products.json', {
      encoding: 'utf8',
    });
    res.json(JSON.parse(products));
  } catch (e) {
    res.status(500).send(new Error(e.message));
  }
};

const getProduct = async (req, res) => {
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

const updateProduct = async (req, res) => {
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

const deleteProduct = async (req, res) => {
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

const productRouter = express.Router();
app.use('/products', productRouter);

productRouter.route('/').post(createProduct).get(getProducts);
productRouter
  .route('/:id')
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);

const PORT = 3009;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
