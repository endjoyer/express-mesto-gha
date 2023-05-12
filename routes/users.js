const router = require('express').Router();
const {
  login,
  getUsers,
  createUser,
  getUserInfo,
  patchUserProfile,
  patchUserAvatar,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signin', login);

router.get('/users', auth, getUsers);

router.get('/users/me', auth, getUserInfo);

router.post('/signup', createUser);

router.patch('/users/me', auth, patchUserProfile);

router.patch('/users/me/avatar', auth, patchUserAvatar);

module.exports = router;
