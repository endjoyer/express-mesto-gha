const router = require('express').Router();
const {
  login,
  getUsers,
  createUser,
  getUserInfo,
  patchUserProfile,
  patchUserAvatar,
} = require('../controllers/users');
const {
  validateCreateUser,
  validateUserInfo,
  validatePatchUserProfile,
  validatePatchUserAvatar,
  validateLogin,
} = require('../middlewares/celebrate');
const { validateAuth } = require('../middlewares/validateAuth');

router.get('/users', validateAuth, getUsers);

router.get('/users/me', validateAuth, validateUserInfo, getUserInfo);

router.post('/signup', validateCreateUser, createUser);

router.post('/signin', validateLogin, login);

router.patch(
  '/users/me',
  validateAuth,
  validatePatchUserProfile,
  patchUserProfile,
);

router.patch(
  '/users/me/avatar',
  validateAuth,
  validatePatchUserAvatar,
  patchUserAvatar,
);

module.exports = router;
