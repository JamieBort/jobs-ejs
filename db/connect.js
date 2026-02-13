// ./db/connect.js

const mongoose = require("mongoose");

const connectDB = (url) =>
	mongoose
		.connect(url)
		.then(() =>
			// eslint-disable-next-line no-console
			console.log(`Connected to the ${mongoose.connection.name} database.`),
		)
		.catch((error) => {
			/* eslint-disable no-console */
			console.log(`There was an error connecting to the database.`);
			console.log(error);
			/* eslint-enable no-console */
		});

module.exports = connectDB;
