const express = require('express');
const router = express.Router();
const movie = require('./../controllers/movie');

/* All API routes */

// Movie route
router.get('/movie', movie.get);
router.get('/movies/search', movie.search);

module.exports = router;
