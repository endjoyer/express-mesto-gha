const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const secretKey = require('../utils/secretKey');

const {
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
  ConflictError,
} = require('../errors');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  let userId;

  if (req.params.id) {
    userId = req.params.id;
  } else {
    userId = req.user._id;
  }

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError(`There is no user with id "${userId}"`));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(`Cast to ObjectId failed`));
      }

      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  return bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      }),
    )
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      res.send(userObj);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(
          new ConflictError('A user with such a email is already registered'),
        );
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Invalid user request data'));
      }

      return next(err);
    });
};

module.exports.patchUserProfile = (req, res, next) => {
  const id = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new BadRequestError('Invalid user request data'));
      }

      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError(`There is no user with id "${id}"`));
      }

      return next(err);
    });
};

module.exports.patchUserAvatar = (req, res, next) => {
  const id = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new BadRequestError('Invalid user request data'));
      }

      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError(`There is no user with id "${id}"`));
      }

      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('Incorrect email or password'));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return next(new UnauthorizedError('Incorrect email or password'));
        }
        // авто тесты не пропускаю jwt без файла .env
        const token = jwt.sign({ _id: user._id }, secretKey, {
          expiresIn: '7d',
        });
        res.cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        });
        return res.send({ token });
      });
    })
    .catch(next);
};

module.exports.exit = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Exit' });
};
