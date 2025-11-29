const express = require("express");
const router = express.Router();
const warpAsync = require("../utils/warpAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");
const listingController = require("../controls/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//index Route
router.get("/", warpAsync(listingController.index));
//search listing
router.get("/search",warpAsync(listingController.searchListing));
//new Route Form
router.get("/new", isLoggedIn, warpAsync(listingController.renderNewForm));
//show
router.get("/:id", warpAsync(listingController.showListing));
//create
router.post(
	"/",
	isLoggedIn,
	upload.single("listing[image]"),
	warpAsync(listingController.createListing)
);
//edit Form
router.get("/:id/edit", isLoggedIn, warpAsync(listingController.editListing));
//upd Route
router.put(
	"/:id",
	isLoggedIn,
	upload.single("listing[image]"),
	warpAsync(listingController.updateListing)
);

//delete Route
router.delete("/:id", isLoggedIn, warpAsync(listingController.deleteListing));

module.exports = router;
