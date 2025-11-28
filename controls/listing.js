const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const { listingSchema } = require("../schema.js");

module.exports.index = async (req, res) => {
	const allListings = await Listing.find({});
	return res.render("listing/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
	return res.render("listing/new.ejs");
};

module.exports.searchListing = async (req, res) => {
	let { TitleSearch } = req.query;
	if (!TitleSearch || TitleSearch.trim() === "") {
		return res.redirect("/listings");
	}
	const allListings = await Listing.find({
		title: { $regex: TitleSearch, $options: "i" },
	});
	if (allListings.length == 0) {
		req.flash("error", "No listing matching your search");
		return res.redirect("/listings");
	}
	return res.render("listing/index.ejs", { allListings });
};

module.exports.showListing = async (req, res) => {
	let { id } = req.params;
	const listing = await Listing.findById(id)
		.populate({ path: "reviews", populate: { path: "author" } })
		.populate("owner");
	if (!listing) {
		req.flash("error", "listing you requested for does not exist!");
		return res.redirect("/listings");
	}
	if (
		!listing.geometry ||
		!Array.isArray(listing.geometry.coordinates) ||
		listing.geometry.coordinates.length === 0
	) {
		console.log("enter in if");
		let response = await geocodingClient
			.forwardGeocode({
				query: listing.location,
				limit: 1,
			})
			.send();

		let updatedListing = await Listing.findByIdAndUpdate(id, {
			...listing,
		});

		let geo = response.body.features[0].geometry;
		updatedListing.geometry = {
			type: geo.type,
			coordinates: geo.coordinates,
		};
		await updatedListing.save();
		listing = updatedListing;
	}

	return res.render("listing/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
	let response = await geocodingClient
		.forwardGeocode({
			query: req.body.listing.location,
			limit: 1,
		})
		.send();
	let result = listingSchema.validate(req.body);
	let url = req.file.path;
	let filename = req.file.filename;
	if (result.error) {
		throw new ExpressError(400, result.error);
	}
	let new_listing = new Listing(req.body.listing);
	new_listing.image = { url, filename };
	new_listing.owner = req.user._id;
	new_listing.geometry = response.body.features[0].geometry;
	await new_listing.save();
	req.flash("success", "listing created...");
	return res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
	let { id } = req.params;
	let listing = await Listing.findById(id);
	oriUrl = listing.image.url;
	oriUrl = oriUrl.replace("upload/", "upload/e_blur,w_150/");
	return res.render("listing/edit.ejs", { listing, oriUrl });
};

module.exports.updateListing = async (req, res) => {
	let { id } = req.params;
	let listing = await Listing.findById(id);
	if (
		!res.locals.currUser ||
		!listing.owner._id.equals(res.locals.currUser._id)
	) {
		req.flash("error", "you don't have permission to edit");
		return res.redirect(`/listings/${id}`);
	}
	let updatedListing = await Listing.findByIdAndUpdate(id, {
		...req.body.listing,
	});
	if (typeof req.file !== "undefined") {
		updatedListing.image = {
			url: req.file.path,
			filename: req.file.filename,
		};
	}
	await updatedListing.save();
	req.flash("success", "listing updated...");
	return res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
	let { id } = req.params;
	let listing = await Listing.findById(id);
	if (
		!res.locals.currUser ||
		!listing.owner._id.equals(res.locals.currUser._id)
	) {
		req.flash("error", "you don't have permission to edit");
		return res.redirect(`/listings/${id}`);
	}
	await Listing.findByIdAndDelete(id);
	req.flash("success", "listing deleted...");
	return res.redirect(`/listings`);
};
