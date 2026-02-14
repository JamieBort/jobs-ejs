// ./routes/secretWordEndPoint.js

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	if (!req.session.secretWord) {
		req.session.secretWord = "syzygy";
	}

	// res.render("secretWord", { secretWord: req.session.secretWord }); // Original
	res.render("secretWordView", { secretWord: req.session.secretWord }); // Updated
});

router.post("/", (req, res) => {
	if (req.body.secretWord.toUpperCase()[0] == "P") {
		req.flash("error", "That word won't work!");
		req.flash("error", "You can't use words that start with p.");
	} else {
		req.session.secretWord = req.body.secretWord;
		req.flash("info", "The secret word was changed.");
	}

	// res.redirect("/secretWord"); // Original
	res.redirect("/secretWordEndPoint"); // Updated
});

module.exports = router;
