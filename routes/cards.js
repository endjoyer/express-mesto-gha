const router = require('express').Router();
const {
  validateCreateCard,
  validateDeleteCard,
  validateLikeCard,
  validateDislikeCard,
} = require('../middlewares/celebrate');
const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { validateAuth } = require('../middlewares/validateAuth');

router.get('/cards', validateAuth, getCards);

router.post('/cards', validateAuth, validateCreateCard, createCard);

router.delete('/cards/:id', validateAuth, validateDeleteCard, deleteCardById);

router.put('/cards/:cardId/likes', validateAuth, validateLikeCard, likeCard);

router.delete(
  '/cards/:cardId/likes',
  validateAuth,
  validateDislikeCard,
  dislikeCard,
);

module.exports = router;
