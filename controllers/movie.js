const Movie = require('./../models/movie');
const imdbMovieSearch = require('../services/imdbMovieSearch');

exports.get = (req, res) => {

	const searchTerm = req.query.search.trim() || 'avenger';

	Movie.findOne({title :new RegExp(searchTerm, "i")}, async (err, movie) => {
		if (err) {
			return res.status(400).json(err);
		} else {
			if (!movie) {
				try{
					movie = await imdbMovieSearch(searchTerm);
				} catch(e) {}
			}

			return res.json(movie);
		}
	});
};

exports.search = (req, res) => {

	const query = {};

	if(req.query.id) query.imdbId = req.query.id;

	if(req.query.year) {
		if (req.query.year.indexOf('-') === -1) {
			query.release_year = Number(req.query.year);
		} else {
			const [start, end] = req.query.year.split('-');
			query["$and"] = [
				{ "release_year": {$gt: Number(start)}},
				{ "release_year": {$lt: Number(end)}},
			];
		}
	};

	if(req.query.genre) query.genres = new RegExp(req.query.genre, "i");

	if(req.query.rating) {
		if (!req.query.rating_action) {
			query.rating = Number(req.query.rating);
		} else {
			query.rating = req.query.rating_action === "less_than" ? { $lt: Number(req.query.rating) } : { $gt: Number(req.query.rating) };
		}
	}

	Movie.find({ $and: [query] }, (err, movies) => {
		if (err) {
			return res.status(400).json(err);
		} else {
			return res.status(200).json(movies);
		}
	});
}

