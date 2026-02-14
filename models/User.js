// ./models/User.js
// Mongoose schema and model for users, includes password hashing, JWT generation, and password comparison methods.

const mongoose = require("mongoose"); // Imports Mongoose to define the User schema and interact with MongoDB
// For reference https://www.npmjs.com/package/bcryptjs
// NOTE: Already installed when `npm  install` is run.
//       Because "bcryptjs" is already in the "dependencies" object of the package.json file.
const bcrypt = require("bcryptjs"); // Library for hashing and comparing passwords securely

// *** NOTE: commented this out.
// const jwt = require("jsonwebtoken"); // Library for creating and verifying JSON Web Tokens

// Defines the schema for user documents (It defines the shape of the collection in MondgoDB.)
const UserSchema = new mongoose.Schema({
	name: {
		type: String, // Field type is string
		required: [true, "Please provide name"], // Name is required
		maxlength: 50, // Maximum length of 50 characters
		minlength: 3, // Minimum length of 3 characters
	},
	email: {
		type: String, // Field type is string
		required: [true, "Please provide email"], // Email is required
		match: [
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			"Please provide a valid email", // Ensures the email follows a valid format
		],
		unique: true, // Prevents duplicate email entries
	},

	password: {
		type: String, // Field type is string
		required: [true, "Please provide password"], // Password is required
		minlength: 6, // Minimum password length is 6 characters
	},
});

// Pre-save middleware to hash passwords before saving
// For reference https://mongoosejs.com/docs/middleware.html#pre
UserSchema.pre("save", async function () {
	const salt = await bcrypt.genSalt(10); // Generates a salt with 10 rounds for hashing
	this.password = await bcrypt.hash(this.password, salt); // Hashes the password and replaces plain text
});

// *** NOTE: commented this out.
// Instance method to generate a JWT for the user
// For reference https://mongoosejs.com/docs/guide.html#methods
// UserSchema.methods.createJWT = function () {
// 	return jwt.sign(
// 		{ userId: this._id, name: this.name }, // Payload includes user ID and name
// *** NOTE: See .env.ctd-group-session
// process.env.JWT_SECRET, // Secret key from environment variables
// {
// *** NOTE: See .env.ctd-group-session
// 			expiresIn: process.env.JWT_LIFETIME, // Token expiration configured via environment variables
// 		},
// 	);
// };

// Instance method to compare a provided password with the hashed password
UserSchema.methods.comparePassword = async function (canditatePassword) {
	const isMatch = await bcrypt.compare(canditatePassword, this.password); // Uses bcrypt to verify password
	return isMatch; // Returns true if passwords match, false otherwise
};

module.exports = mongoose.model("User", UserSchema); // Creates and exports the User model for database operations
