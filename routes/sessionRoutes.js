const express = require("express");
// const passport = require("passport");
const router = express.Router();

const {
	logonShow,
	registerShow,
	registerDo,
	logoff,
} = require("../controllers/sessionController");

// We have two endpoints that handle just rendering an EJS page, register and logon.

// We don’t need an endpoint for login, because Passport handles that for us.

router.route("/register").get(registerShow).post(registerDo);
router
	.route("/logon")
	.get(logonShow)
	.post(
		// passport.authenticate("local", {
		//   successRedirect: "/",
		//   failureRedirect: "/sessions/logon",
		//   failureFlash: true,
		// })
		(req, res) => {
			res.send("Not yet implemented.");
		},
	);
router.route("/logoff").post(logoff);

module.exports = router;
