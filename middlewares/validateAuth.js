const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors');

module.exports.validateAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  console.log(token);
  try {
    payload = jwt.verify(token, 'secret-key'); // надо бы добавить нормальный ключ
  } catch (err) {
    return next(new UnauthorizedError('Authorization required'));
  }

  req.user = payload;

  return next();
};
