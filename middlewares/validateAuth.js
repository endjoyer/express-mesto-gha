const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors');

module.exports.validateAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'secret-person-key'); // надо бы добавить нормальный ключ
  } catch (err) {
    return next(new UnauthorizedError('Authorization required'));
  }

  req.user = payload;

  return next();
};
