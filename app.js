const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const routesUsers = require('./routes/users');
const routesCards = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('Database connection successful');
  })
  .catch((err) => {
    console.error('Database connection error:', err.message);
  });

app.use((req, res, next) => {
  req.user = {
    _id: '645ce9792bf09af4fb4e9cd2',
  };

  next();
});

app.use(routesUsers);
app.use(routesCards);

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res) => {
  res.status(404).send({ message: 'Not Found' });
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'Server error' : message,
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
