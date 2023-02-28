const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');

const user = require('../controllers/user');
const User = require('../models/user');

// Register
router.route('/register')
    .get(user.renderRegister)
    .post(catchAsync(user.register))

//Login!
router.route('/login')
    .get(user.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.login)

//Log Out
router.get('/logout', user.logout)



module.exports = router;