var mongoose    = require('mongoose'),
    Campground  = require('./models/campground'),
    Comment     = require('./models/comment'),
    data = [
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        desc: "blah blah blah"
    },
    {
        name: "Desert Mesa", 
        image: "http://www.nationalparks.nsw.gov.au/~/media/DF58734103EF43669F1005AF8B668209.ashx",
        desc: "blah blah blah"
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        desc: "blah blah blah"
    }
];

function seedDB(){
    Comment.remove({});
    Campground.remove({}, function(err){
        if (err){
            console.log(err);
        } else {
            console.log('Removed all the data');
    
            data.forEach(function(campground){
                Campground.create(campground, function(err, createdCamp){
                    if (err){
                        console.log(err);
                    } else {
                        console.log('Campground added');
                        Comment.create({
                            author: 'Saurabh',
                            text: "It is amazing but it has poor network services"
                        }, function(err, createdComment){
                            if (err){
                                console.log(err);
                            } else {
                                createdCamp.comments.push(createdComment);
                                createdCamp.save();
                                console.log("Comment added");
                            }
                        });
                        
                    }
                });
            });    
        }
    });
}

module.exports = seedDB;