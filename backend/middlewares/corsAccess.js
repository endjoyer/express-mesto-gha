// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  'https://endjoys.project.nomoredomains.rocks',
  'http://endjoys.project.nomoredomains.rocks',
  'localhost:3000',
];

module.exports.corsAccess = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
  }

  next();
};
