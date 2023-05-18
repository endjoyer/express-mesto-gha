const router = require('express').Router();
const {
  login,
  exit,
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

router.get('/users/me', validateAuth, getUserInfo);

router.get('/users/:id', validateAuth, validateUserInfo, getUserInfo);

router.post('/signup', validateCreateUser, createUser);

router.post('/signin', validateLogin, login);

router.get('/signout', validateAuth, exit);

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
