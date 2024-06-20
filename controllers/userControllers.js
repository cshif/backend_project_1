import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const users = JSON.parse(fs.readFileSync(`${__dirname}/../users.json`));

export const createUser = async (req, res) => {
  try {
    // 可以寫入 users 的條件：有 email，且 email 沒有使用過
    if (
      typeof req.body === 'object' &&
      Object.keys(req.body).includes('email') &&
      !users.filter((user) => user.email === req.body.email).length
    ) {
      const newUser = {
        id: crypto.randomUUID(),
        name: req.body.name,
        email: req.body.email,
      };
      await fs.writeFileSync(
        './users.json',
        JSON.stringify([...users, newUser])
      );
      res.json(newUser);
    } else {
      res.status(404).send('Invalid data.');
    }
  } catch (e) {
    res.status(500).send(new Error(e.message));
  }
};

export const getUsers = async (req, res) => {
  try {
    res.json(users);
  } catch (e) {
    res.status(500).send(new Error(e.message));
  }
};

export const getUser = async (req, res) => {
  try {
    const user = users.find((user) => user.id === req.params.id);
    res.json(user);
  } catch (e) {
    res.status(500).send(new Error(e.message));
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = users.find((user) => user.id === req.params.id);
    const userIndex = users.findIndex((user) => user.id === req.params.id);
    if (user) {
      const updatedUser = {
        id: user.id,
        name: req.body.name || user.name,
        email: req.body.email || user.email,
      };
      const copyUsers = [...users];
      copyUsers.splice(userIndex, 1, updatedUser);
      await fs.writeFileSync('./users.json', JSON.stringify(copyUsers));
      res.json(updatedUser);
    } else {
      res.status(404).send("Can't find user");
    }
  } catch (e) {
    res.status(500).send(new Error(e.message));
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = users.find((user) => user.id === req.params.id)?.id;
    if (userId) {
      await fs.writeFileSync(
        './users.json',
        JSON.stringify([...users.filter((user) => user.id !== userId)])
      );
      res.json({ id: userId });
    } else {
      res.status(404).send("Can't find user");
    }
  } catch (e) {
    res.status(500).send(new Error(e.message));
  }
};
