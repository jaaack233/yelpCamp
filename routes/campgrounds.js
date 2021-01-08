var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var middleware = require("../middleware");

router.get("/", function (req,res){
    //Get campgrounds from database
    Campground.find({}, function (err, campgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campGrounds:campgrounds, currentUser: req.user});
        }
    });
});

//CREATE
router.post("/", middleware.isLoggedIn, function (req,res){
    var image = req.body.image;
    var name = req.body.name;
    var price = req.body.price;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: description, author: author};
    Campground.create(newCampground, function (err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

//NEW - Show form
router.get("/new", middleware.isLoggedIn, function (req,res){
    res.render("campgrounds/new");
});

router.get("/:id", function (req,res){
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req,res){
    Campground.findById(req.params.id, function (err,foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});
//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function (req,res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function (req,res){
    Campground.findByIdAndRemove(req.params.id, function (err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});



module.exports = router;
