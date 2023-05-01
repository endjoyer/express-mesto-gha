const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const routesUsers = require('./routes/users');
const routesCards = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

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
    _id: '644e158816a561d56aa7c1a1',
  };

  next();
});

app.use(routesUsers);
app.use(routesCards);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});