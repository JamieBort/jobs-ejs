// ./app.js

require("dotenv").config();
require("express-async-errors"); // Allows Express to handle async errors without try/catch

const express = require("express");
const sessionStore = require("express-session"); // Middleware for handling user sessions (cookies + server-side storage)
// Creates a MongoDB-backed session store using express-session
// Pass sessionStore into it, and it returns a MongoDB-backed session store class
const MongoDBStore = require("connect-mongodb-session")(sessionStore);
const cookieParser = require("cookie-parser"); // Parses cookies attached to client requests
const csrf = require("host-csrf"); // Provides Cross-Site Request Forgery (CSRF) protection middleware
const helmet = require("helmet"); // Secures HTTP headers
const xssClean = require("xss-clean"); // Sanitizes user input to prevent XSS attacks
const rateLimit = require("express-rate-limit"); // Limits repeated requests to public APIs

const url = process.env.MONGO_URI;
const app = express();

/* ---------------- SECURITY MIDDLEWARE ---------------- */

app.use(helmet());
app.use(xssClean());

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
});
app.use(limiter);

/* ---------------- BODY + COOKIE PARSERS ---------------- */

app.use(express.urlencoded({ extended: true })); // Parses URL-encoded form data
app.use(cookieParser(process.env.SESSION_SECRET)); // Parses and signs cookies using session secret

/* ---------------- SESSION STORE ---------------- */

// Creates MongoDB session storage
const store = new MongoDBStore({
	uri: url,
	collection: "mySessions",
});

store.on("error", console.log);

// Defines session configuration object
const sessionParms = {
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: true,
	store,
	cookie: {
		secure: false,
		sameSite: "strict",
	},
};

// Checks if app is running in production mode
if (app.get("env") === "production") {
	app.set("trust proxy", 1);
	sessionParms.cookie.secure = true;
}

app.use(sessionStore(sessionParms));

/* ---------------- PASSPORT ---------------- */

const passport = require("passport"); // Imports Passport authentication library
const passportInit = require("./passport/passportInit"); // Imports Passport configuration file
passportInit(); // Initializes Passport strategies and serialization

app.use(passport.initialize()); // Enables flash messages stored in session
app.use(passport.session()); // Middleware to store commonly used variables in res.locals

/* ---------------- FLASH + LOCALS ---------------- */

app.use(require("connect-flash")());
app.use(require("./middleware/storeLocals"));

/* ---------------- CSRF PROTECTION ---------------- */

const csrfMiddleware = csrf.csrf(); // Creates CSRF protection middleware
app.use(csrfMiddleware); // Applies CSRF protection to all routes

// Middleware to expose CSRF token to views
app.use((req, res, next) => {
	res.locals._csrf = csrf.getToken(req, res); // Generates and stores CSRF token in response locals
	next(); // Passes control to next middleware
});

/* ---------------- ROUTES ---------------- */

app.set("view engine", "ejs");

app.get("/", (req, res) => res.render("index"));

app.use("/sessions", require("./routes/sessionRoutes")); // Mounts session-related routes

const auth = require("./middleware/auth"); // Imports authentication-check middleware
const secretWordRouter = require("./routes/secretWordEndPoint"); // Imports protected route handler
app.use("/secretWordEndPoint", auth, secretWordRouter); // Protects and mounts secret word endpoint
app.use("/jobs", auth, require("./routes/jobs")); // Protects and mounts jobs routes

/* ---------------- ERROR HANDLING ---------------- */

// Handles unmatched routes
app.use((req, res) =>
	res.status(404).send(`That page (${req.url}) was not found.`),
);

// Global error handling middleware
app.use((err, req, res, next) => {
	console.log(err);
	res.status(500).send(err.message);
});

/* ---------------- START SERVER ---------------- */

const port = process.env.PORT || 3000;

const start = async () => {
	try {
		await require("./db/connect")(process.env.MONGO_URI);
		app.listen(port, () => console.log(`Server listening on port ${port}...`));
	} catch (error) {
		console.log(error);
	}
};

start();
