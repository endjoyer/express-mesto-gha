const BadRequestError = require('./400-bad-request');
const UnauthorizedError = require('./401-unauthorized');
const ForbiddenError = require('./403-forbidden');
const NotFoundError = require('./404-not-found');
const ConflictError = require('./409-conflict');

module.exports = {
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  BadRequestError,
  ConflictError,
};
