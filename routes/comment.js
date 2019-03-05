var express     = require('express'),
    router      = express.Router({mergeParams: true}),
    Campground  = require('../models/campground'),
    Comment     = require('../models/comment'),
    middleware  = require('../middleware');

// COMMENTS NEW
router.get('/campgrounds/:id/comments/new', middleware.isLoggedIn,  function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render('comments/new', {campground: foundCampground});        
    });
});


// COMMENTS CREATE
router.post('/campgrounds/:id/comments', middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err){
            console.log(err);
            res.redirect("/campgrounds");            
        } else {
           Comment.create(req.body.comment, function(err, comment){
                if (err){
                    console.log(err);
                } else {
                    comment.author.username = req.user.username;
                    comment.author.id = req.user._id;
                    comment.save();
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    req.flash('success', "Comment added");
                    res.redirect('/campgrounds/' + foundCampground._id);
                }
           });
        }
    });
});

// EDIT ROUTE
router.get('/campgrounds/:id/comments/:comment_id/edit', middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        res.render('comments/edit', {comment: foundComment, campgroundID: req.params.id});
    });
});

// UPDATE ROUTE
router.put('/campgrounds/:id/comments/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err){
            res.redirect('back');    
        } else {
            res.redirect('/campgrounds/' + req.params.id);                
        }
    });
});

// REMOVE ROUTE 
router.delete('/campgrounds/:id/comments/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if (err){
            res.redirect('back');
        } else {
            req.flash('success', "Comment deleted");            
            res.redirect('/campgrounds/' + req.params.id);            
        }
    });
});

module.exports = router;
