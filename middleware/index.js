var Campground  = require('../models/campground'),
    Comment     = require('../models/comment');

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()){
        return next();
    } else {
        req.flash('error', "You need to Sign In for that");
        res.redirect('/login');
    }
};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if (err){
                req.flash('error', "System error");
                res.redirect('back');
            } else {
                if (foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.flash('error', "You don't have permission to do that");
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', "You need to Sign In for that")
        res.redirect('back');
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err){
                res.redirect('back');
            } else {
                if (foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.flash('error', "You don't have permission to do that");                    
                    res.redirect('back');
                }
            }
        });
    } else {
        res.redirect('back');
    }
};


module.exports = middlewareObj;