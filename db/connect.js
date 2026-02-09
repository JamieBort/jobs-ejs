// ./db/connect.js

// const mongoose = require('mongoose')

// const connectDB = (url) => {
//   return mongoose.connect(url, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true,
//   })
// }

// module.exports = connectDB

// Used to connect to the database.

const mongoose = require("mongoose");
const options = {
	// Added as a result of output warnings from when the db was first successfully connected.
	useNewUrlParser: true,
	// useCreateIndex: true, // Didn't address any warnings.
	// useFindAndModify: false, // Didn't address any warnings.
	useUnifiedTopology: true,
};

const connectDB = (url) =>
	mongoose
		.connect(url, options)
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
