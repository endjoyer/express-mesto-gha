const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors');

module.exports.validateAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError('Authorization required'));
  }

  req.user = payload;

  return next();
};
