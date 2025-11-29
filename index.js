if (process.env.NODE_ENV != "production") {
	require("dotenv").config();
}
const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const listingsRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.AT_LAST_DB_URL;

main()
	.then(() => {
		console.log("connect to dbs");
	})
	.catch((err) => console.log(err));
async function main() {
	await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
const store = MongoStore.create({
	mongoUrl: dbUrl,
	touchAfter: 24 * 3600,
});
store.on("error",(err)=>{
	console.log("error in mongo session store!",err);
})
const sessionOptions = {
	store,
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: true,
	cookie: {
		expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
		maxAge: 7 * 24 * 60 * 60 * 1000,
	},
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	res.locals.currUser = req.user;
	next();
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/review", reviewRouter);
app.use("/", userRouter);

// Express 5 catch-all route (404)
app.use((req, res, next) => {
	next(new ExpressError(404, "Page not found!"));
});

// Error handler middleware
app.use((err, req, res, next)=>{
    let {statusCode=500, message="Something went wrong"} = err;

    // DEFENSIVE CHECK: Prevent responding if headers were already sent
    if (res.headersSent) {
        return next(err); 
    }

    res.status(statusCode).render("error.ejs" , {message});
    // res.status(statusCode).send(message);
});

app.listen(port, () => {
	console.log("sever is listening to 8080");
});
