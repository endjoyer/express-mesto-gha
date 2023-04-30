const Director = require('../models/director');

module.exports.getDirectors = (req, res) => {
  Director.find({})
    .then((directors) => res.send({ data: directors }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createDirector = (req, res) => {
  const { name } = req.body;

  Director.create({ name })
    .then((director) => res.send({ data: director }))
    .catch((err) => res.status(500).send({ message: err.message }));
};
