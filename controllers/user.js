const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

module.exports.register = async(req, res) => {
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
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', `Welcome Back ${req.body.username}!`);
    const redirectUrl = res.locals.returnPage || '/campgrounds'
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logOut(err => {
        if(err) return next(err);
        req.flash('success', 'See ya!')
        res.redirect('/campgrounds');
    });
}