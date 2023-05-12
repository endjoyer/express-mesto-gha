const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequest = require('../errors/bad-request');
const NotFoundError = require('../errors/not-found-err');

const handleCastError = () => {
  throw new BadRequest('Cast to ObjectId failed');
};

const handleIncorrectDataError = () => {
  throw new BadRequest('Incorrect data was transmitted');
};

const handleNotFoundErrorError = () => {
  throw new NotFoundError('User not found');
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body; // не забыть подправить email и password
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email: req.body.email,
        password: hash,
      }).select('+password');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      // нужно будет учесть 409 ошибку!!!
      if (err.name === 'ValidationError') {
        handleIncorrectDataError();
      }
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  const id = req.user._id;
  console.log(id);

  User.findById(id)
    .then((user) => {
      if (!user) {
        handleNotFoundErrorError();
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        handleCastError();
      }
    })
    .catch(next);
};

module.exports.patchUserProfile = (req, res, next) => {
  const id = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        handleCastError();
      }
    })
    .catch(next);
};

module.exports.patchUserAvatar = (req, res, next) => {
  const id = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        handleNotFoundErrorError();
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        handleIncorrectDataError();
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  // нужно улучшить безопасность!!!
  return User.findUserByCredentials(email, password)
    .select('+password')
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'secret', {
          expiresIn: '7d',
        }),
      });
      console.log(req.user._id);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        handleCastError();
      }
    })
    .catch(next);
};
