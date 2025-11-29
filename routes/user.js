const warpAsync = require("../utils/warpAsync.js");
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controls/user.js");

//render signup
router.get("/", userController.renderSigUpForm);
router.get("/signup", userController.renderSigUpForm);
//post signup form
router.post("/signup", userController.sigUpUser);

//render login
router.get("/login", userController.renderLogInForm);
//post login
router.post(
	"/login",
	saveRedirectUrl,
	passport.authenticate("local", {
		failureRedirect: "/login",
		failureFlash: true,
	}),
	userController.logInUser
);
//logout
router.get("/logout", userController.logOut);

module.exports = router;	