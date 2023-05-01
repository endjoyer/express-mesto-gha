const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  patchUserProfile,
  patchUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:id', getUserById);

router.post('/users', createUser);

router.patch('/users/me', patchUserProfile);

router.patch('/users/me/avatar', patchUserAvatar);

module.exports = router;
