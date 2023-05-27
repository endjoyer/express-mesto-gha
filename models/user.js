const { Schema, model } = require('mongoose');
const validator = require('validator');

const urlRegex = require('../utils/regex');

const userSchema = new Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (url) => urlRegex.test(url),
      message: 'Incorrect link format',
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Incorrect mail format',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = model('User', userSchema);
