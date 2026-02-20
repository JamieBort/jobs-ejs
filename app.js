// ./app.js

require("dotenv").config();
require("express-async-errors");

const express = require("express");
const sessionStore = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(sessionStore);
const cookieParser = require("cookie-parser");
const csrf = require("host-csrf");
const helmet = require("helmet");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");

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

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SESSION_SECRET));

/* ---------------- SESSION STORE ---------------- */

const store = new MongoDBStore({
	uri: url,
	collection: "mySessions",
});

store.on("error", console.log);

const sessionParms = {
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	store,
	cookie: {
		secure: false,
		sameSite: "strict",
	},
};

if (app.get("env") === "production") {
	app.set("trust proxy", 1);
	sessionParms.cookie.secure = true;
}

app.use(sessionStore(sessionParms));

/* ---------------- PASSPORT ---------------- */

const passport = require("passport");
const passportInit = require("./passport/passportInit");
passportInit();

app.use(passport.initialize());
app.use(passport.session());

/* ---------------- FLASH + LOCALS ---------------- */

app.use(require("connect-flash")());
app.use(require("./middleware/storeLocals"));

/* ---------------- CSRF PROTECTION ---------------- */
/* MUST come after cookieParser + bodyParser */
/* MUST come before routes */
const csrfMiddleware = csrf.csrf();
app.use(csrfMiddleware);

app.use((req, res, next) => {
	res.locals._csrf = csrf.getToken(req, res);
	next();
});

/* ---------------- ROUTES ---------------- */

app.set("view engine", "ejs");

app.get("/", (req, res) => res.render("index"));

app.use("/sessions", require("./routes/sessionRoutes"));

const auth = require("./middleware/auth");
app.use("/secretWordEndPoint", auth, require("./routes/secretWordEndPoint"));
app.use("/jobs", auth, require("./routes/jobs"));

/* ---------------- ERROR HANDLING ---------------- */

app.use((req, res) =>
	res.status(404).send(`That page (${req.url}) was not found.`),
);

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
