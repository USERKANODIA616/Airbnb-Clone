const express = require("express");
const router = express.Router({ mergeParams: true });
const warpAsync = require("../utils/warpAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controls/review.js");

//AddReviews
router.post("/", isLoggedIn, warpAsync(reviewController.addReview));
//DeleteReview
router.delete(
	"/:reviewId",
	isLoggedIn,
	isReviewAuthor,
	warpAsync(reviewController.deleteReview)
);

module.exports = router;
