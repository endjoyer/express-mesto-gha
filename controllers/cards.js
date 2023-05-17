const Card = require('../models/card');
const { NotFoundError, ForbiddenError, BadRequestError } = require('../errors');

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
        return next(new BadRequestError('Invalid card request data'));
      }

      return next(err);
    });
};

module.exports.deleteCardById = (req, res, next) => {
  const UserId = req.user._id;
  const cardId = req.params.id;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError(`There is no card with id "${cardId}".`));
      }
      if (card.owner.toString() !== UserId) {
        return next(
          new ForbiddenError("You can't delete someone else's picture"),
        );
      }
      return Card.deleteOne()
        .then(() => res.send({ message: 'Card deleted.' }))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Cast to ObjectId failed'));
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
        return next(new NotFoundError(`There is no card with id "${cardId}"`));
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Cast to ObjectId failed'));
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
        return next(new NotFoundError(`There is no card with id "${cardId}"`));
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Cast to ObjectId failed'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Invalid card request data'));
      }
      return next(err);
    });
};
