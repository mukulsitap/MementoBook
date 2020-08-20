var express = require("express");
var router = express.Router();
var Posts = require("../models/postpage");
var middleware = require("../middleware");


router.get("/postpage/new", middleware.isLoggedIn, function(req, res) {
   res.render("Posts/newpost"); 
});


router.get("/postpage/:id", function(req, res) {
    Posts.findById(req.params.id).populate("comments").exec(function(err, foundPosts){
    	if(err){
    		console.log(err);
    	} else{
    		res.render("Posts/show", {foundPosts: foundPosts});
    	}
    });
    });
    
   
// EDIT routes

router.get("/postpage/:id/edit", middleware.checkOwnership, function(req, res){
	Posts.findById(req.params.id, function(err, foundPosts) {
		if(err){
			
		}
		res.render("Posts/edit", {postss: foundPosts});
});
});

router.put("/:id", function(req, res){
	Posts.findByIdAndUpdate(req.params.id, req.body.postsss, function(err, UpdatedPost){
		if(err){
			res.redirect("/postpage");
		} else {
			res.redirect("/postpage/" + req.params.id);
		}
	});
});

// DELETE Routes
router.delete("/postpage/:id", middleware.checkOwnership, function(req, res){
	Posts.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/postpage");
		}
	});
	res.redirect("/postpage");	
});


module.exports = router;