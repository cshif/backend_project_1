import express from 'express';
import morgan from 'morgan';
import fs from 'node:fs/promises';

const app = express();
app.use(morgan('tiny'));
app.use(express.json());

app.get('/', (req, res) => {
  res.json('yo');
});

app.post('/users', async (req, res) => {
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
    console.error(e);
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await fs.readFile('./users.json', {
      encoding: 'utf8',
    });
    res.json(JSON.parse(users));
  } catch (e) {
    console.error(e);
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const users = await fs.readFile('./users.json', {
      encoding: 'utf8',
    });
    const user = JSON.parse(users).find((user) => user.id === req.params.id);
    res.json(user);
  } catch (e) {
    console.error(e);
  }
});

app.put('/users/:id', async (req, res) => {
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
    console.error(e);
  }
});

app.delete('/users/:id', async (req, res) => {
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
    console.error(e);
  }
});

const PORT = 3009;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
