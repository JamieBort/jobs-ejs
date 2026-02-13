// ./passport/passportInit.js

// File for telling Passport to authenticate users and retrieve them from the database.

// A strategy = instructions for how to verify someone’s identity.
// strategy is just a method of authenticating a user

// Examples:
//      Username + password → Local strategy
//      Google login → Google OAuth strategy
//      Facebook login → Facebook strategy
//      JWT token → JWT strategy
// Each strategy tells Passport:
//      Where to get credentials
//      How to verify them
//      What to do if they’re valid or invalid

// Register a Passport authentication strategy.
// passport.use("local", new LocalStrategy(...)) tells Passport how to
// authenticate users when we call passport.authenticate("local").
// The first argument ("local") is the strategy name,
// and the second argument defines how username/password login is verified.

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

const passportInit = () => {
	passport.use(
		"local",
		// The LocalStrategy constructor takes two arguments: an options object, and a callback function.
		//     The options object expects us to tell the strategy what field on the request will have the user identifier, and what field will have the password.
		//     Here, we tell it to look for "email" as the identifier, and password for the password
		//     The callback function that will be called when we do passport.authenticate(...) in the login route in sessionRoutes.js.
		//     The local-strategy library will extract the email and password fields that we defined in the options/first argument, from the req.body.
		//     If it doesn’t find those fields, it will return a 400 error.
		//     If it does find them, then it will then pass those (along with a done callback) to the function we’ve defined above.
		//     It’s up to us then to write the code specific to our application, that handles checking if the user exists and has used to correct password
		// *** NOTE: the "done" callback is provided by Passport.
		//     It tells Passport “Here is the result of the authentication attempt.”
		new LocalStrategy(
			// The options object
			{ usernameField: "email", passwordField: "password" },
			// The callback function
			async (email, password, done) => {
				try {
					const user = await User.findOne({ email: email });
					if (!user) {
						// Authentication failed (no system error).
						// error = null (no server error)
						// user = false (authentication unsuccessful)
						// info = message used for flash feedback
						return done(null, false, { message: "Incorrect credentials." });
					}

					const result = await user.comparePassword(password);
					if (result) {
						// Authentication succeeds.
						// error = null (no server error)
						// user = authenticated user object (Passport attaches this to req.user)
						// info = not needed on success
						return done(null, user);
					} else {
						// Authentication failed (password incorrect).
						// error = null (no system failure)
						// user = false (credentials invalid)
						// info = message used for flash feedback
						return done(null, false, { message: "Incorrect credentials." });
					}
				} catch (e) {
					// System/server error occurred (e.g., database failure).
					// error = actual error object
					// user/info are ignored when error is provided
					// This tells Passport the failure was due to a server issue,
					// not bad credentials.
					return done(e);
				}
			},
		),
	);

	passport.serializeUser(async function (user, done) {
		// Called after successful authentication.
		// error = null (no error)
		// user.id = what gets stored in the session cookie
		// Only minimal data (the user ID) is stored in the session.
		done(null, user.id);
	});

	passport.deserializeUser(async function (id, done) {
		try {
			const user = await User.findById(id);
			if (!user) {
				// Error during session restoration.
				// error = actual Error object
				// Signals that the session contains an invalid user reference.
				return done(new Error("user not found"));
			}
			// Successful session restoration.
			// error = null
			// user = full user object attached to req.user
			return done(null, user);
		} catch (e) {
			// System/server error during deserialization.
			done(e);
		}
	});
};

module.exports = passportInit;
