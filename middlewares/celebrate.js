const { celebrate, Joi } = require('celebrate');

const urlRegex = require('../utils/regex');

const cardJoiTemplate = { cardId: Joi.string().length(24).hex().required() };

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(40),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(urlRegex),
  }),
});

const validatePatchUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(urlRegex),
  }),
});

const validateUserInfo = celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24).hex(),
  }),
});

const validatePatchUserProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(40),
    about: Joi.string().required().min(2).max(30),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(urlRegex),
  }),
});

const validateDeleteCard = celebrate({
  params: Joi.object().keys(cardJoiTemplate),
});

const validateLikeCard = celebrate({
  params: Joi.object().keys(cardJoiTemplate),
});

const validateDislikeCard = celebrate({
  params: Joi.object().keys(cardJoiTemplate),
});

module.exports = {
  validateLogin,
  validateCreateUser,
  validatePatchUserAvatar,
  validateUserInfo,
  validatePatchUserProfile,
  validateCreateCard,
  validateDeleteCard,
  validateLikeCard,
  validateDislikeCard,
};
