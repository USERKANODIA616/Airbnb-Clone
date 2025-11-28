const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");


module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.redirectUrl = req.originalUrl;
		req.flash("error", "you must be logged in to create listing!");
		return res.redirect("/login");
	}
	next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
	if (req.session.redirectUrl) {
		console.log("saveRedirectUrl start");
		res.locals.redirectUrl = req.session.redirectUrl;
		delete req.session.redirectUrl;
	}
	next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
	let { reviewId, id } = req.params;
	let review = await Review.findById(reviewId);
	if (!review.author.equals(res.locals.currUser._id)) {
		req.flash("error", "you are not author of this review");
		return res.redirect(`/listings/${id}`);
	}
	next();
};
