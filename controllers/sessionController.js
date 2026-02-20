// .controllers/sessionController.js

const User = require("../models/User");
// const parseVErr = require("../util/parseValidationErr");
const parseVErr = require("../util/parseValidationErrs");

const registerShow = (req, res) => {
	res.render("register");
};

// The registerDo handler will check if the two passwords the user entered match, and refresh the page otherwise.
// If all is good there, it will create a user in the database and redirect to the home page.
// The creation of the user entry in Mongo is just the same as it was for the Jobs API.
// We also have some error handling cases here.
const registerDo = async (req, res, next) => {
	if (req.body.password != req.body.password1) {
		req.flash("error", "The passwords entered do not match.");
		return res.render("register");
	}
	try {
		await User.create(req.body);
	} catch (e) {
		if (e.constructor.name === "ValidationError") {
			parseVErr(e, req);
		} else if (e.name === "MongoServerError" && e.code === 11000) {
			req.flash("error", "That email address is already registered.");
		} else {
			return next(e);
		}
		return res.render("register", { errors: flash("errors") });
	}
	res.redirect("/");
};

const logoff = (req, res) => {
	req.session.destroy(function (err) {
		if (err) {
			console.log(err);
		}
		res.redirect("/");
	});
};

const logonShow = (req, res) => {
	if (req.user) {
		return res.redirect("/");
	}

	res.render("logon", {
		errors: req.flash("error"),
		info: req.flash("info"),
	});
};

// *** NOTE: We don’t need a controller handler for login, because Passport handles that for us.

module.exports = {
	registerShow,
	registerDo,
	logoff,
	logonShow,
};
