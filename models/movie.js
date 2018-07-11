const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
	title: {
		type: String,
		Default: null,
		require: true,
		trim: true,
	},
	release_year: {
		type: Number,
		Default: null,
		require: true,
	},
	rating: {
		type: Number,
		require: true,
	},
	imdbId: {
		type: String,
		require: true,
		trim: true,
		unique: true,
	},
	genres: [{
	    type: String,
	    trim: true,
	}]
});

const movie = mongoose.model('movie', MovieSchema);

module.exports = movie;
