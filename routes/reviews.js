const express = require('express');
const router = express.Router({mergeParams: true});
const { validateReview, isLoggedIn, isReviewAuthor } = require('./middleware');
const catchAsync = require("../utils/catchAsync");

const review = require('../controllers/reviews');
const Campground = require("../models/campground");
const Review = require("../models/review");


router.post('/', isLoggedIn, validateReview, catchAsync(review.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(review.destroyReview));

module.exports = router;