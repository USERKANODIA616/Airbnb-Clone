const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const { reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");



module.exports.addReview = async (req, res) => {
	let result = reviewSchema.validate(req.body);
	if (result.error) {
		console.log("not saved!!");
		throw new ExpressError(400, result.error);
	}
	let { id } = req.params;
	let listing = await Listing.findById(id);
	let newReview = new Review(req.body.review);
	newReview.author = req.user._id;

	listing.reviews.push(newReview);
	await newReview.save();
	await listing.save();
	req.flash("success", "reviews added..");
	return res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res) => {
	let { id, reviewId } = req.params;
	await Review.findByIdAndDelete(reviewId);
	await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
	req.flash("success", "review deleted..");
	return res.redirect(`/listings/${id}`);
};
