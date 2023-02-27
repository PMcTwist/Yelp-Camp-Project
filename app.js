const express = require("express");
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const passport = require('passport');
const LocalStrat = require('passport-local');
const User = require('./models/user');


const { campgroundSchema, reviewSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");

const UserRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');


// Setup connection to MongoDB
mongoose.set("strictQuery", true);

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () =>{
    console.log("Database connected!")
});


// Call and configure instance of express
const app = express()

app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
// setup _method to be the query string for override
app.use(methodOverride("_method"));
// Serve up the static folder
app.use(express.static(path.join(__dirname, 'public')));
//Configure session
const sessionConfig = {
    secret: 'Thissucks',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());

//Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrat(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Flash global handler
app.use((req, res, next) => {
    res.locals.returnPage = req.session.returnTo;
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


// Routes
app.use('/', UserRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);


// Render Home landing page
app.get("/", (req, res) =>{
    res.render("home")
});

// Error Handling
app.all('*', (req, res, next) => {
    next(new expressError('Page Not Found..', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = "Womp Womp, Something Went Wrong.."
    res.status(statusCode).render('error', { err })
})


const PORT = process.env.PORT || 6969;

// Return a listening string when the app sucessfully goes live
app.listen(PORT, ()=> {
    console.log(`Serving on port ${PORT}`)
});