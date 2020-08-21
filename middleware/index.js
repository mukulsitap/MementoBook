var Posts = require("../models/postpage");
var Comment = require("../models/comment");

//all middleware goes here
var middlewareObj = {};

middlewareObj.checkOwnership = function (req, res, next){
	// is user logged in?
	if(req.isAuthenticated()){
	Posts.findById(req.params.id, function(err, foundPosts) {
		if(err){
		    req.flash("error", "Post Not Found");
			res.redirect("back");
		} else{
			if(foundPosts.author.id.equals(req.user._id)){
				next();
		} else {
			res.redirect("back");
		}
		}
	});
	} else {
	    req.flash("error", "You don't have permission!");
		res.redirect("back");
	}
	
};

middlewareObj.checkCommentOwnership = function(req, res, next){
	// is user logged in?
	if(req.isAuthenticated()){
	Comment.findById(req.params.comment_id, function(err, foundComment) {
		if(err){
			res.redirect("back");
		} else{
			if(foundComment.author.id.equals(req.user._id)){
				next();
		} else {
			res.redirect("back");
		}
		}
	});
	} else {
	    req.flash("error", "You need to be LOGGED-IN!!");
		res.redirect("back");
	}
	
};

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be LOG-IN!!");
	res.redirect("/login");
};

middlewareObj.checkIfUserExists = function (req, res, next) => {
   try {
    let userExists = await User.findOne({'email': req.body.email});
 	if(userExists) { 
 		return res.redirect('back');
 	} 
	next();         
    }
   catch(err) {
        console.log(err);
        res.redirect("back");
    }
}

module.exports = middlewareObj;