const mongoose = require('mongoose');

const urlRegex = require('../utils/regex');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (url) => urlRegex.test(url),
      message: 'Incorrect link format',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      default: [],
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Card', cardSchema);
