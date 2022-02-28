const express = require('express');
const path = require('path');
const cors = require('cors');
const fileupload = require('express-fileupload');

const PORT = 3001;

const usersRouter = require('./routes/users');

const corsOptions = {
  exposedHeaders: '*',
  origin: '*',
  optionsSuccessStatus: 200,
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileupload());

app.use('/users/', usersRouter);

app.use('/', (req, res) => {
  return res.send(`Api is running on port ${PORT}!`);
});

app.listen(PORT, () => {
  console.log(`Api is running on port ${PORT}!`);
});

module.exports = app;
