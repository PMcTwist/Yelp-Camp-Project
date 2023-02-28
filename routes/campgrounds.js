const express = require('express');
const router = express.Router({mergeParams: true});

const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require('./middleware');

const campground = require('../controllers/campgrounds');
const Campground = require("../models/campground");

// Setup cloud storage for app on cloudinary
const { storage } = require('../cloudinary');
const multer = require('multer');
const upload = multer({ storage });



// Render different pages for the campgrounds in a RESTful way
router.route('/')
    .get(catchAsync(campground.index))
    .post(isLoggedIn, upload.array('image', 3), validateCampground, catchAsync(campground.createCampground))

// Add a new campground
router.get("/new", isLoggedIn, campground.renderNewForm);

// Camp Specific routes
router.route('/:id')
    .get(catchAsync(campground.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image', 5), validateCampground, catchAsync(campground.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campground.destroyCampground))

// Edit camp infos
// GET to render the edit page for input
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campground.renderEditForm));


module.exports = router;