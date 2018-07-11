const Movie = require('./../models/movie');
const imdb = require('imdb-api');
const imdbApiKey = require("../config/config").imdbApiKey;
const cli = new imdb.Client({apiKey: imdbApiKey});

module.exports = (searchTerm) => {

	return new Promise( async (resolve, reject) => {

		let searchMovies = [];

		try {
			searchMovies = await cli.search({"name" : searchTerm});
			searchMovies = searchMovies.results || [];
		} catch(e) {
			return reject(false);
		}

		const movies = await getMoviesBySearchedMovie(searchMovies);

		storeMovies(movies);
		return resolve(movies && movies[0] ? formatMovieData(movies[0]) : {});
	});
}

const getMoviesBySearchedMovie = async (searchMovies) => {
	const movies = [];

	return new Promise( async (resolve) => {

		for(let index = 1; index < searchMovies.length; index++){
			try {
				let movie = await cli.get({'id': searchMovies[index].imdbid});
				movie && movies.push(movie);
			} catch(e) {
				console.log("fetch movie err" ,e);
			}
		}

		return resolve(movies);
	});
}

const storeMovies = (movies) => {

	const moviesToStore = [];

	movies.forEach(movie => {
		moviesToStore.push(formatMovieData(movie));
	});

	Movie.create(moviesToStore, (err, ss) => {
	    if(err) console.log(err);
	});
}

const formatMovieData = (movie) => {
	return {
		title: movie.title,
		release_year: Number(movie.year),
		rating: movie.rating,
		imdbId: movie.imdbid,
		genres: movie.genres ? movie.genres.split(',') : [],
	};
}