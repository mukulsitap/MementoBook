var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");




router.get("/register", function(req, res) {
    
    res.render("register");
});



router.post("/register", middleware.checkIfUserExists, function(req, res) {
	var newUser = new User({username: req.body.username, email: req.body.email});
    User.register(newUser, req.body.password, function(err, user){
    	if(err){
    		req.flash("error", " " + err);
    		return res.redirect("register");
    	} 
    	passport.authenticate("local")(req, res, function(){
    	    req.flash("success", "WelCome to PlaceBook " + user.username);
    		res.redirect("/postpage");
    	});
    });
});

// Login routes
router.get("/login", function(req, res) {
    
    res.render("login");
});

router.post("/login",passport.authenticate("local",
{
	successRedirect: "/postpage",
	failureRedirect: "/login"
}), function(req, res) {
    
});

// logout logic
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you Out");
	res.redirect("/postpage");	
});




module.exports = router;