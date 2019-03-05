var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    mongoose        = require('mongoose'),
    methodOverride  = require('method-override'),
    flash           = require('connect-flash'),
    Comment         = require('./models/comment'),
    Campground      = require('./models/campground'),
    User            = require('./models/user'),
    seedDB          = require('./seeds');

var port = process.env.PORT || 5500;

// Requiring Routes
var commentRoutes    = require('./routes/comment'),
    indexRoutes      = require('./routes/index');
    campgroundRoutes = require('./routes/campground');

// APP config
const config = require('./config');
url = config.mongo_url;
mongoose.connect(url);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.use(flash());

seedDB();   //seeding the DB

// PASSPORT config
app.use(require('express-session')({
    secret: "saurabh",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Using Routes
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');    
    next();
});

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(port, function(){
    console.log("FindCamp is running on " + port);
});


