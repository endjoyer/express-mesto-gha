const Card = require('../models/card');
const Unauthorized = require('../errors/unauthorized');
const BadRequest = require('../errors/bad-request');
const NotFoundError = require('../errors/not-found-err');

const handleBadRequestError = () => {
  throw new BadRequest('Cast to ObjectId failed');
};

const handleNotFoundErrorError = () => {
  throw new NotFoundError('Card not found');
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Incorrect data was transmitted');
      }
    })
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  const idUser = req.user._id;
  const { id } = req.params;
  console.log(req.params);
  Card.findByIdAndRemove(id)
    .then((card) => {
      if (!card) {
        handleNotFoundErrorError();
      } else if (card.owner !== idUser) {
        throw new Unauthorized('Denial of access');
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        handleBadRequestError();
      }
    })
    .catch(next);
};
module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        handleNotFoundErrorError();
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        handleBadRequestError();
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        handleNotFoundErrorError();
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        handleBadRequestError();
      }
    })
    .catch(next);
};
