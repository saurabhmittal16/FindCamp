var express     = require('express'),
    router      = express.Router(),
    Campground  = require('../models/campground'),
    Comment     = require('../models/comment'),
    middleware  = require('../middleware');
    
// INDEX ROUTE
router.get('/campgrounds', function(req, res){
    Campground.find({},function(err, campgrounds){
        if (err){
            console.log(err);
        } else {
            res.render('campgrounds/index', {campgrounds: campgrounds});
        }
    });
});

// NEW ROUTE
router.get('/campgrounds/new', middleware.isLoggedIn, function(req, res){
    res.render('campgrounds/new');
});

// CREATE ROUTE
router.post('/campgrounds', middleware.isLoggedIn, function(req, res){

    Campground.create(req.body.camp, function(err, returnedCampground){
        if (err){
            console.log(err);
        } else {
            returnedCampground.author.username = req.user.username;
            returnedCampground.author.id = req.user._id;
            returnedCampground.save();
            console.log(returnedCampground);
        }
    });
    res.redirect('/campgrounds');
});

// SHOW ROUTE
router.get('/campgrounds/:id', function(req, res){
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
        if (err){
            console.log(err);
        } else {
            res.render('campgrounds/show', {campground: foundCampground});
       }
    });
});

// EDIT ROUTE
router.get('/campgrounds/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err){
            console.log(err);
        } else {
            res.render('campgrounds/edit', {campground: foundCampground});        
        }
    });
});

// UPDATE ROUTE
router.put('/campgrounds/:id', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err, updatedCampground){
        if (err){
            res.redirect('/campgrounds/' + req.params.id);
        } else {
            res.redirect('/campgrounds/' + req.params.id);            
        }
    });
});

// REMOVE ROUTE
router.delete('/campgrounds/:id', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err){
            console.log(err);
        } else {
            res.redirect('/campgrounds');
        }
    });
});

module.exports = router;
