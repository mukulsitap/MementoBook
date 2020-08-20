var express = require("express");
var router = express.Router();
var Posts = require("../models/postpage");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/postpage/:id/comments/new", middleware.isLoggedIn, function(req, res) {
	Posts.findById(req.params.id, function(err, post){
		if(err){
			console.log(err);
		} else {
			
				 res.render("comments/new", {post: post});
		}
	});
   
});

router.post("/postpage/:id/comments", middleware.isLoggedIn, function(req, res){
		Posts.findById(req.params.id, function(err, post){
		if(err){
			console.log(err);
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else{
					//add username and id to comment
					console.log(req.user.username);
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					post.comments.push(comment);
					post.save();
					
					req.flash("success", "Comment Created!");
					res.redirect("/postpage/"+post._id);
				}
			});
				
		}
	});
});

// comments edit

router.get("/postpage/:id/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		} else {
			res.render("comments/edit", {post_id: req.params.id, comment: foundComment});
		}
	    
	});
	
});

router.put("/postpage/:id/comments/:comment_id", function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else{
			res.redirect("/postpage/" + req.params.id);
		}
	});
});

router.delete("/postpage/:id/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/postpage/" + req.params.id);
		}
	});
	
});


module.exports = router;