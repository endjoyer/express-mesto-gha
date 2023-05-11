const Card = require('../models/card');
const Unauthorized = require('../errors/unauthorized');
const BadRequest = require('../errors/bad-request');
const NotFoundError = require('../errors/not-found-err');

const handleBadRequestError = () => {
  throw new BadRequest('Cast to ObjectId failed');
};

const handleNotFoundErrorError = () => {
  throw new NotFoundError('Cast to ObjectId failed');
};

const ERROR_UNAUTHORIZED = 401;
const ERROR_IMPUT = 400;
const ERROR_FIND = 404;
const ERROR_SERVER = 500;

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Incorrect data was transmitted');
      } else {
        res.status(ERROR_SERVER).send({ message: 'Server error' });
      }
    });
};

module.exports.deleteCardById = (req, res) => {
  const idUser = req.user._id;
  const { id } = req.params;
  console.log(req.params);
  Card.findByIdAndRemove(id)
    .then((card) => {
      if (!card) {
        res.status(ERROR_FIND).send({ message: 'Card not found' });
      } else if (card.owner !== idUser) {
        throw new Unauthorized('Denial of access');
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_IMPUT).send({ message: 'Cast to ObjectId failed' }); // Выдает её, когда в неправильной форме введен id
      } else {
        res.status(ERROR_SERVER).send({ message: 'Server error' });
      }
    });
};
module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_FIND).send({ message: 'Card not found' });
      } else {
        res.send(card);
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

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_FIND).send({ message: 'Card not found' });
      } else {
        res.send(card);
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
