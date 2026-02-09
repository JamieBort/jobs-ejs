// Load environment variables first
require("dotenv").config(); // to load the .env file into the process.env object

// Import modules
require("express-async-errors");
const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

// Access environment variables
const url = process.env.MONGO_URI;

// Initialize the app
const app = express();

// Middleware
app.use(require("body-parser").urlencoded({ extended: true }));
app.set("view engine", "ejs");

// session UPDATE v.1
const store = new MongoDBStore({
	// may throw an error, which won't be caught
	uri: url,
	collection: "mySessions",
});

store.on("error", function (error) {
	console.log(error);
});

const sessionParms = {
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: true,
	store: store,
	cookie: { secure: false, sameSite: "strict" },
};

if (app.get("env") === "production") {
	app.set("trust proxy", 1); // trust first proxy
	sessionParms.cookie.secure = true; // serve secure cookies
}

app.use(session(sessionParms));

app.use(require("connect-flash")());

// session ORIGINAL v.0
// app.use(
// 	session({
// 		secret: process.env.SESSION_SECRET,
// 		resave: false,
// 		saveUninitialized: true,
// 	}),
// );

// secret word handling

// secretWord UPDATE v.2
app.get("/secretWord", (req, res) => {
	if (!req.session.secretWord) {
		req.session.secretWord = "syzygy";
	}
	res.locals.info = req.flash("info");
	res.locals.errors = req.flash("error");
	res.render("secretWord", { secretWord: req.session.secretWord });
});

app.post("/secretWord", (req, res) => {
	if (req.body.secretWord.toUpperCase()[0] == "P") {
		req.flash("error", "That word won't work!");
		req.flash("error", "You can't use words that start with p.");
	} else {
		req.session.secretWord = req.body.secretWord;
		req.flash("info", "The secret word was changed.");
	}
	res.redirect("/secretWord");
});

// secretWord UPDATE v.1
// let secretWord = "syzygy"; <-- comment this out or remove this line
// app.get("/secretWord", (req, res) => {
// 	if (!req.session.secretWord) {
// 		req.session.secretWord = "syzygy";
// 	}
// 	res.render("secretWord", { secretWord: req.session.secretWord });
// });

// app.post("/secretWord", (req, res) => {
// 	req.session.secretWord = req.body.secretWord;
// 	res.redirect("/secretWord");
// });

// secretWord ORIGINAL v.0
// let secretWord = "syzygy";
// app.get("/secretWord", (req, res) => {
// 	res.render("secretWord", { secretWord });
// });
// app.post("/secretWord", (req, res) => {
// 	secretWord = req.body.secretWord;
// 	res.redirect("/secretWord");
// });

app.use((req, res) => {
	res.status(404).send(`That page (${req.url}) was not found.`);
});

app.use((err, req, res, next) => {
	res.status(500).send(err.message);
	console.log(err);
});

const port = process.env.PORT || 3000;

const start = async () => {
	try {
		app.listen(port, () =>
			console.log(`Server is listening on port ${port}...`),
		);
	} catch (error) {
		console.log(error);
	}
};

start();
