const express = require('express');
const router = express.Router({mergeParams: true});

const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require('./middleware');

const Campground = require("../models/campground");
const flash = require('connect-flash');



// Render different pages for the campgrounds in a RESTful way
// List an index of camps in teh database
router.get("/", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds })
}));

// Add a new campground
router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

// Post to return new camp form too when compelte
router.post("/", isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Made a new camp!')
    res.redirect(`/campgrounds/${campground._id}`);
}));

// Show details of camp based on dynamic ID from DB
router.get("/:id", catchAsync(async (req, res) =>{
    const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
    if(!campground) {
        res.flash('error', 'Cannot find the camp!');
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/show", { campground });
}));

// Edit camp infos
// GET to render the edit page for input
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/edit", { campground });
}));

// POST request for taking the input data from the form
router.put("/:id", isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Updated Campground!')
    res.redirect(`/campgrounds/${campground._id}`);
}));

// Delete camp
router.delete("/:id", isLoggedIn, isAuthor, catchAsync(async (req,res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Deleted Campground..')
    res.redirect("/campgrounds");
}));


module.exports = router;