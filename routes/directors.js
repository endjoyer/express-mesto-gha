const router = require('express').Router();
const { getDirectors, createDirector } = require('../controllers/directors');

router.get('/', getDirectors);
router.post('/', createDirector);

module.exports = router;
