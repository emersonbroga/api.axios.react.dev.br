const fs = require('fs');
const path = require('path');
const faker = require('faker');
const { JSONWrite, JSONRead, JSONUpdate } = require('./json');

const PATH = path.resolve(__dirname, '../data/users.json');

const generateUser = (id) => {
  const day = faker.datatype.number({ min: 1, max: 28 });
  const month = faker.datatype.number({ min: 1, max: 12 });
  const year = faker.datatype.number({ min: 1921, max: new Date().getFullYear() - 18 });

  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const domainName = faker.internet.email().split('@')[1];
  const name = `${firstName} ${lastName}`;
  const email = `${firstName}.${lastName}@${domainName}`.toLowerCase();
  const phone = faker.phone.phoneNumber('(##)9####-####');
  const dob = new Date(year, month - 1, day, 0, 0, 0, 0);
  const avatar = faker.image.avatar();

  return {
    id,
    name,
    email,
    phone,
    dob,
    avatar,
  };
};

const generate = (filePath, count = 30) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    const user = generateUser(i + 1);
    data.push(user);
  }

  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, jsonData, 'utf-8');
  return jsonData;
};

const find = async (id) => {
  const users = await JSONRead(PATH);
  if (!id) return users;
  const user = users.find((item) => item.id === id);
  return user;
};

const create = async (data) => {
  const users = await JSONRead(PATH);
  const generatedId = users[users.length - 1].id + 1;

  const createdUser = { id: generatedId, ...data };

  await JSONWrite(PATH, [...users, createdUser]);
  return createdUser;
};

const update = async (id, data) => {
  const users = await JSONRead(PATH);
  const index = users.findIndex((item) => item.id === id);
  const user = users[index];

  if (!user) return null;

  const updatedUser = { ...user, ...data, id };
  users.splice(index, 1, updatedUser);

  await JSONWrite(PATH, users);
  return updatedUser;
};

const destroy = async (id) => {
  const users = await JSONRead(PATH);
  const user = users.find((item) => item.id === id);
  if (!user) return false;
  const result = users.filter((item) => item.id !== id);
  if (users.length - 1 !== result.length) return false;
  await JSONUpdate(PATH, result);
  return true;
};

module.exports = { find, create, update, generate, update, destroy };
