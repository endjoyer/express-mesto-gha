const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
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
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(`Cast to ObjectId failed`));
      }

      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Invalid user request data'));
      }

      return next(res);
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt
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
      res.status(201).send(userObj);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(
          new ConflictError('A user with such a email is already registered'),
        );
      }
      if (err.name === 'ValidationError') {
        return next(new NotFoundError('Invalid user request data'));
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
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Cast to ObjectId failed'));
      }

      if (err.name === 'ValidationError') {
        return next(new NotFoundError('Invalid user request data'));
      }

      return next(err);
    });
};

module.exports.patchUserAvatar = (req, res, next) => {
  const id = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Cast to ObjectId failed'));
      }

      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Invalid user request data'));
      }

      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('Incorrect email or password'));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return next(new UnauthorizedError('Incorrect email or password'));
        }

        const token = jwt.sign({ _id: user._id }, 'secret-key', {
          expiresIn: '7d',
        });
        res.cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        });
        return res.status(200).send({ token });
      });
    })
    .catch(next);
};
