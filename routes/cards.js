const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const auth = require('../middlewares/auth');

router.get('/cards', auth, getCards);

router.post('/cards', auth, createCard);

router.delete('/cards/:id', auth, deleteCardById);

router.put('/cards/:cardId/likes', auth, likeCard);

router.delete('/cards/:cardId/likes', auth, dislikeCard);

module.exports = router;
