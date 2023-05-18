const crypto = require('crypto');

module.exports = crypto.randomBytes(64).toString('hex');
