var express     = require('express'),
    router      = express.Router(),
    passport    = require('passport'),
    User        = require('../models/user');


// ROOT ROUTE
router.get('/', function(req, res){
    res.render('landing');
});

// REGISTER NEW
router.get('/register', function(req, res){
    res.render('register.ejs');
});

// REGISTER CREATE
router.post('/register', function(req, res){
    var newuser = new User({
        username: req.body.username
    });
    User.register(newuser, req.body.password, function(err, user){
        if (err){
            req.flash('error', err.message);
            res.redirect('register');
        } else {
            passport.authenticate('local')(req, res, function(){
                req.flash('success', "Welcome to FindCamp " + user.username);
                res.redirect('/campgrounds');
            });
        }
    });
});

// LOGIN NEW
router.get('/login', function(req, res){
    res.render('login.ejs');
});

// LOGIN AUTH
router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}),function(req, res){});

// LOGOUT 
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', "Logged you out!");
    res.redirect('/campgrounds');
});

module.exports = router;