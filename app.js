var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds"),
    flash = require("connect-flash");


//requiring routes
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index");

mongoose.connect("mongodb+srv://jaaack233:Cjd584552901@cluster0.iphe2.mongodb.net/yelp_camp?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true }).then(()=>{
        console.log("connected to DB");
}).catch(err => {
    console.log("ERROR: ", err.message);
});

app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seed the database

//moment JS
app.locals.moment = require("moment");

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "There is no secret at all.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// Pass currentUser to all routes
app.use(function (req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("===== YelpCamp Started =====")
});

