const Card = require('../models/card');
const { NotFoundError, ForbiddenError, BadRequestError } = require('../errors');

const handleBadRequestError = () => {
  throw new BadRequestError('Cast to ObjectId failed');
};

const handleNotFoundError = () => {
  throw new NotFoundError('Invalid card request data');
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
        return next(handleNotFoundError());
      }

      return next(err);
    });
};

module.exports.deleteCardById = (req, res, next) => {
  const UserId = req.user._id;
  const cardId = req.params.id;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      console.log(req.params);
      if (!card) {
        handleNotFoundError();
      }
      if (card.owner.toString() !== UserId) {
        return next(
          new ForbiddenError("You can't delete someone else's picture"),
        );
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'CastError') {
        handleBadRequestError();
      }
      return next(err);
    });
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
        handleNotFoundError();
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        handleBadRequestError();
      }
      return next(err);
    });
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
        handleNotFoundError();
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        handleBadRequestError();
      }

      if (err.name === 'ValidationError') {
        handleNotFoundError();
      }
      return next(err);
    });
};
