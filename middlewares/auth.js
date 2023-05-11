const jwt = require('jsonwebtoken');

const Unauthorized = require('../errors/unauthorized');

const handleAuthError = () => {
  throw new Unauthorized('Authorization required');
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError();
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'secret');
  } catch (err) {
    return handleAuthError();
  }

  req.user = payload;

  next();
};
