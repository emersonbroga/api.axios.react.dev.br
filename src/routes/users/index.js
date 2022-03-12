const express = require('express');
const path = require('path');
const router = express.Router();

const Users = require('../../services/users');
const Strings = require('../../services/strings');

const UPLOAD_URL = `${process.env.BASE_URL}uploads/user`;
const UPLOAD_FOLDER = path.resolve(__dirname, '../../public/uploads/user');
const RADIX = 10;

router.get('/:id', async function (req, res) {
  const id = Number.parseInt(req.params.id, RADIX);
  const user = await Users.find(id);

  if (!user) return res.status(404).json({ data: null });

  return res.status(200).json(user);
});

router.put('/:id', async function (req, res) {
  const id = Number.parseInt(req.params.id, RADIX);

  const user = await Users.update(id, { ...req.body, id });

  if (!user) return res.status(404).json({ data: null });

  return res.status(200).json(user);
});

router.put('/:id/upload', async function (req, res) {
  if (!req.files) return res.status(400).json({ data: null });
  const uuid = Strings.uuidv4();

  const id = Number.parseInt(req.params.id, RADIX);

  const avatar = req.files['avatar-upload'];
  if (!avatar) return res.status(400).json({ data: null });

  const fileName = `${id}-${uuid}-${avatar.name}`;

  try {
    await avatar.mv(`${UPLOAD_FOLDER}/${fileName}`);
  } catch (err) {
    if (!user) return res.status(404).json({ data: null });
  }

  const user = await Users.update(id, { avatar: `${UPLOAD_URL}/${fileName}`, id });

  if (!user) return res.status(404).json({ data: null });

  return res.status(200).json(user);
});

router.patch('/:id', async function (req, res) {
  const id = Number.parseInt(req.params.id, RADIX);
  const user = await Users.update(id, { ...req.body, id });

  if (!user) return res.status(404).json({ data: null });

  return res.status(200).json(user);
});

router.delete('/:id', async function (req, res) {
  const id = Number.parseInt(req.params.id, RADIX);
  const user = await Users.find(id);

  if (!user) return res.status(404).json({ data: null });

  const result = await Users.destroy(id);
  return res.status(200).json({ data: result });
});

router.post('/', async (req, res) => {
  const createdUser = await Users.create({ ...req.body });
  return res.status(200).json(createdUser);
});

router.get('/:id/slow', async function (req, res) {
  const id = Number.parseInt(req.params.id, RADIX);
  const user = await Users.find(id);

  if (!user) return res.status(404).json({ data: null });
  await new Promise((r) => setTimeout(r, 10000));
  return res.status(200).json(user);
});

router.get('/', async function (req, res) {
  const limit = Number.parseInt(req.query.limit, 10) || 10;
  const page = Number.parseInt(req.query.page, 10) || 1;

  const users = await Users.find();

  const start = (page - 1) * limit;
  const end = page * limit;
  const result = [...users].slice(start, end);

  return res.status(200).json({ data: result });
});

module.exports = router;
