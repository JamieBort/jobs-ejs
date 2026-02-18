// ./app.js

// Load environment variables first
require("dotenv").config(); // Loads variables from a .env file into process.env so you can use secrets/config safely

// Import modules
require("express-async-errors"); // Modify/extend existing code at runtime without changing the original source so async route errors automatically go to the error handler. Overrides Express’s internal route handler registration logic so every handler is automatically wrapped in a promise catcher.

const express = require("express"); // Import Express framework

const sessionStore = require("express-session"); // Middleware for handling user sessions (cookies + server-side storage)

// Creates a MongoDB-backed session store using express-session
// Pass sessionStore into it, and it returns a MongoDB-backed session store class
const MongoDBStore = require("connect-mongodb-session")(sessionStore);

// Access environment variables
const url = process.env.MONGO_URI; // MongoDB connection string from .env

// Initialize the app
const app = express(); // Creates the Express application instance

// Parses application/x-www-form-urlencoded form data into req.body
// Without this req.body would be undefined.
app.use(require("body-parser").urlencoded({ extended: true }));

app.set("view engine", "ejs"); // Tells Express to use EJS as the template engine. See my notes.

// Connects to MongoDB using MONGO_URI
// Creates (or uses) collection: mySessions
// This is where session data is stored
const store = new MongoDBStore({
	// may throw an error, which won't be caught
	uri: url, // MongoDB connection string
	collection: "mySessions", // MongoDB collection where session data will be stored.
});

store.on("error", function (error) {
	console.log(error); // Logs errors if the MongoDB session store fails.
});

// Configure options.
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

// Reads cookie
// Looks up session in MongoDB
// Attaches session data to req.session
app.use(sessionStore(sessionParms)); // Registers session middleware with the configured options.

// *** NOTE: Tell Passport to authenticate users and retrieve them from the database.
const passport = require("passport");
const passportInit = require("./passport/passportInit");
passportInit();

app.use(passport.initialize()); // Sets up Passport to work with Express and sessions.
app.use(passport.session()); // Express middleware that runs on ALL REQUESTS, checks the session cookie for a user id, and if it finds one, deserializes and attaches it to the req.user property.

app.use(require("connect-flash")()); // Enables flash messages stored in the session (temporary messages)

// The storeLocals middleware copies flash messages (errors, info)
// and req.user into res.locals so they are available in views.
// IMPORTANT: This runs before route handlers (like registerDo).
// If a controller adds new flash messages after this middleware runs,
// those values must be passed manually in res.render().
app.use(require("./middleware/storeLocals"));

app.get("/", (req, res) => res.render("index")); // Render the index.ejs template)

app.use("/sessions", require("./routes/sessionRoutes")); // Is used when we navigate to `http://localhost:3000/sessions/logon` or `http://localhost:3000/sessions/register` via `./views/index.ejs`

// secret word handling
const secretWordRouter = require("./routes/secretWordEndPoint");

// That causes the authentication middleware to run before the secretWordRouter, and it redirects if any requests are made for those routes before logon.
const auth = require("./middleware/auth");
app.use("/secretWordEndPoint", auth, secretWordRouter);

// Catch-all 404 handler for unmatched routes
app.use((req, res) =>
	res.status(404).send(`That page (${req.url}) was not found.`),
);

// Centralized error handler for thrown or async errors
app.use((err, req, res, next) => {
	res.status(500).send(err.message);
	console.log(err);
});

const port = process.env.PORT || 3000; // Uses environment port (production) or defaults to 3000

const start = async () => {
	try {
		// Connecting to the database.
		await require("./db/connect")(process.env.MONGO_URI);
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
