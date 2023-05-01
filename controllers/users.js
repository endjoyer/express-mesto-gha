const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => {
      if (user.length === 0) {
        res.status(404).send({ message: 'Users not found' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => res.status(500).send({ message: err.message }));
  // Мне кажется, что такое сообщение более информативное и полезное, но вероятно я не прав )
};

module.exports.getUserById = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'User not found' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Cast to ObjectId failed' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Incorrect data was transmitted' });
      } else {
        res.status(500).send({ message: err.message });
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
      console.log(id);
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Incorrect data was transmitted' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.patchUserAvatar = (req, res) => {
  const id = req.user._id;
  const { avatar } = req.body;

  User.updateOne(id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'User not found' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Incorrect data was transmitted' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};
