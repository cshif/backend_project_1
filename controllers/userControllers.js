import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import catchAsync from '../utils/catchAsync.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const users = JSON.parse(fs.readFileSync(`${__dirname}/../users.json`));

export const createUser = catchAsync(async (req, res, next) => {
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
    await fs.writeFileSync('./users.json', JSON.stringify([...users, newUser]));
    res.json(newUser);
  } else {
    res.status(404).send('Invalid data.');
  }
});

export const getUsers = catchAsync(async (req, res, next) => {
  res.json(users);
});

export const getUser = catchAsync(async (req, res, next) => {
  const user = users.find((user) => user.id === req.params.id);
  res.json(user);
});

export const updateUser = catchAsync(async (req, res, next) => {
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
});

export const deleteUser = catchAsync(async (req, res, next) => {
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
});
