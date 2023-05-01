const User = require('../models/user');

const ERROR_IMPUT = 400;
const ERROR_FIND = 404;
const ERROR_SERVER = 500;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(ERROR_SERVER).send({ message: 'Server error' }));
};

module.exports.getUserById = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        res.status(ERROR_FIND).send({ message: 'User not found' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_IMPUT).send({ message: 'Cast to ObjectId failed' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Server error' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_IMPUT)
          .send({ message: 'Incorrect data was transmitted' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Server error' });
      }
    });
};

module.exports.patchUserProfile = (req, res) => {
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
        res
          .status(ERROR_IMPUT)
          .send({ message: 'Incorrect data was transmitted' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Server error' });
      }
    });
};

module.exports.patchUserAvatar = (req, res) => {
  const id = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(ERROR_FIND).send({ message: 'User not found' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_IMPUT)
          .send({ message: 'Incorrect data was transmitted' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Server error' });
      }
    });
};
