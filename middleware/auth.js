// ./middleware/auth.js

// For protecting a route.

// req.user is injected into the req object by passport.session().
// We can check if it exists (a.k.a. if the user is logged-in) in this middleware
// and use that to determine if the non-logged-in requester should be redirected to the home page,
// or if the logged-in user should be allowed to continue to the next middleware or controller handler function.

const authMiddleware = (req, res, next) => {
	if (!req.user) {
		req.flash("error", "You can't access that page before logon.");
		res.redirect("/");
	} else {
		next();
	}
};

module.exports = authMiddleware;
