const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors');
const secretKey = require('../utils/secretKey');

module.exports.validateAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    return next(new UnauthorizedError('Authorization required'));
  }

  req.user = payload;

  return next();
};
