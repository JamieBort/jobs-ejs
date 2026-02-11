// Load environment variables first
require("dotenv").config(); // Loads variables from a .env file into process.env so you can use secrets/config safely

// Import modules
require("express-async-errors"); // Modify/extend existing code at runtime without changing the original source so async route errors automatically go to the error handler. Overrides Express’s internal route handler registration logic so every handler is automatically wrapped in a promise catcher.

const express = require("express"); // Import Express framework

const session = require("express-session"); // *** NEW CODE*** Middleware for handling user sessions (cookies + server-side storage)

const MongoDBStore = require("connect-mongodb-session")(session); // Creates a MongoDB-backed session store using express-session

// Access environment variables
const url = process.env.MONGO_URI; // MongoDB connection string from .env

// Initialize the app
const app = express(); // Creates the Express application instance

// Middleware
app.use(require("body-parser").urlencoded({ extended: true })); // Parses application/x-www-form-urlencoded form data into req.body

// TODO: TEMPLATE REFERENCE
app.set("view engine", "ejs"); // *** NEW CODE*** Tells Express to use EJS as the template engine. See my notes.

// *** NEW CODE*** UPDATE session v.1 - code updated per lesson instructions
const store = new MongoDBStore({
	// may throw an error, which won't be caught
	uri: url, // MongoDB connection string
	collection: "mySessions", // MongoDB collection where session data will be stored.
});

store.on("error", function (error) {
	console.log(error); // Logs errors if the MongoDB session store fails.
});

// *** NEW CODE*** Configure options.
const sessionParms = {
	secret: process.env.SESSION_SECRET, // Used to sign the session ID cookie (must be kept secret)

	resave: true, // Forces session to be saved back to the store on every request
	saveUninitialized: true, // Saves new sessions even if they haven’t been modified
	store: store, // Uses MongoDB instead of memory to store session data
	cookie: {
		secure: false, // secure: false → allow cookies over HTTP (development)
		sameSite: "strict", // sameSite: "strict" → cookie only sent for same-site requests
	},
};

if (app.get("env") === "production") {
	app.set("trust proxy", 1); // Trusts the first proxy (needed for secure cookies behind proxies like Render.com)
	sessionParms.cookie.secure = true; // Serve secure cookies. But only send cookies over HTTPS in production
}

app.use(session(sessionParms)); // Registers session middleware with the configured options.

app.use(require("connect-flash")()); // *** NEW CODE*** Enables flash messages stored in the session (temporary messages)

// ORIGINAL session v.0 - code added per lesson instructions
// app.use(
// 	session({
// 		secret: process.env.SESSION_SECRET,
// 		resave: false,
// 		saveUninitialized: true,
// 	}),
// );

// secret word handling

// UPDATE secretWord v.2 - code updated per lesson instructions
app.get("/secretWordEndPoint", (req, res) => {
	// If the session does not yet have a secretWord
	if (!req.session.secretWord) {
		// Initialize the secret word in the session
		req.session.secretWord = "syzygy";
	}
	// TODO: TEMPLATE REFERENCE
	res.locals.info = req.flash("info"); // Makes flash messages available to the EJS template
	res.locals.errors = req.flash("error"); // Makes flash messages available to the EJS template
	res.render("secretWordView", { secretWord: req.session.secretWord }); // Renders the page with the secret word from the session
});

app.post("/secretWordEndPoint", (req, res) => {
	// Check if the submitted word starts with "P" or "p"
	if (req.body.secretWord.toUpperCase()[0] == "P") {
		req.flash("error", "That word won't work!"); // If the submitted word starts with "P" or "p", send this "That word won't work!"" message.
		req.flash("error", "You can't use words that start with p."); // If the submitted word starts with "P" or "p", send this "You can't use words that start with p." message.
	} else {
		req.session.secretWord = req.body.secretWord; // Updates the secret word in the session
		req.flash("info", "The secret word was changed."); // end this "The secret word was changed." message.
	}

	res.redirect("/secretWordEndPoint"); // Redirect so refreshes don’t resubmit the form (PRG pattern)
});

// UPDATE secretWord v.1 - code updated per lesson instructions
// let secretWord = "syzygy"; <-- comment this out or remove this line
// app.get("/secretWordEndPoint", (req, res) => {
// 	if (!req.session.secretWord) {
// 		req.session.secretWord = "syzygy";
// 	}
// 	res.render("secretWordView", { secretWord: req.session.secretWord });
// });

// app.post("/secretWordEndPoint", (req, res) => {
// 	req.session.secretWord = req.body.secretWord;
// 	res.redirect("/secretWordEndPoint");
// });

// ORIGINAL secretWord v.0 - code added per lesson instructions
// let secretWord = "syzygy";
// app.get("/secretWordEndPoint", (req, res) => {
// 	res.render("secretWordView", { secretWord });
// });
// app.post("/secretWordEndPoint", (req, res) => {
// 	secretWord = req.body.secretWord;
// 	res.redirect("/secretWordEndPoint");
// });

// Catch-all 404 handler for unmatched routes
app.use((req, res) => {
	res.status(404).send(`That page (${req.url}) was not found.`);
});

// Centralized error handler for thrown or async errors
app.use((err, req, res, next) => {
	res.status(500).send(err.message);
	console.log(err);
});

const port = process.env.PORT || 3000; // Uses environment port (production) or defaults to 3000

const start = async () => {
	try {
		// Starts the HTTP server
		app.listen(port, () =>
			console.log(`Server is listening on port ${port}...`),
		);
	} catch (error) {
		// Logs startup errors
		console.log(error);
	}
};

start(); // Invokes the server startup function
