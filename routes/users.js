const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

// Register
router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', catchAsync(async(req, res) => {
    try{
        const {email, username, password} = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.logIn(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', `Welcome to Yelp Camp ${user.username}!`);
            res.redirect('/campgrounds');
        }); 
    } catch(err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
}))

//Login!
router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', `Welcome Back ${req.body.username}!`);
    const redirectUrl = res.locals.returnPage || '/campgrounds'
    res.redirect(redirectUrl);
})

//Log Out
router.get('/logout', (req, res) => {
    req.logOut(err => {
        if(err) return next(err);
        req.flash('success', 'See ya!')
        res.redirect('/campgrounds');
    });
})



module.exports = router;