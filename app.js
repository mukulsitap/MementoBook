
var	express 		= require("express"),
	app 			= express(),
	bodyParser  	= require("body-parser"),
	mongoose		= require("mongoose"),
	flash			= require("connect-flash"),
	passport		= require("passport"),
	localStrategy	= require("passport-local"),
	methodOverride	= require("method-override"),
	User			= require("./models/user"),
	emailmongoose	= require('mongoose-type-email');
var Posts = require("./models/postpage");
var router = express.Router();
	
var commentRoutes = require("./routes/comments"),
	postpageRoutes = require("./routes/postpage"),
	authRoutes = require("./routes/auth");
mongoose.connect(process.env.DATABASEURL);
//mongoose.connect("mongodb+srv://mukulsitap:mukulsitap@mementobook.ap43y.mongodb.net/MementoBook?retryWrites=true&w=majority");
//mongodb+srv://mukulsitap:mukulsitap@mementobook.ap43y.mongodb.net/<dbname>?retryWrites=true&w=majority
process.env.databaseURL

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "PlaceBook",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.get("/", function(req, res){
	res.render("index");
});

app.use(authRoutes);
app.use(postpageRoutes);
app.use(commentRoutes);
require('dotenv').config({path: '../../environment/.env'});

var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter});

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dx4e2fgar', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.get("/postpage", function(req, res){
	Posts.find({}, function(err, allPosts){
		if(err){
			console(err);
		} else {
			res.render("Posts/postpage", {posts: allPosts, currentUser: req.user});
		}
	});
	
});

app.post("/postpage", upload.single('image'), function(req, res){
	cloudinary.uploader.upload(req.file.path, function(result) {
	  // add cloudinary url for the image to the campground object under image property
	  req.body.image = result.secure_url;
	  // add author to campground
		var name = req.body.title;
		var image = req.body.image;
		var description = req.body.description;
		var author ={
			id: req.user._id,
			username: req.user.username
		};
		var newPost = {name: name, image: image, description: description, author: author};
		Posts.create(newPost, function(err, newlycreated){
			if(err){
	      req.flash('error', err.message);
	      return res.redirect('back');
	    }
	    res.redirect('/postpage/');
  });
});
});

console.log(process.env.CLOUDINARY_API_KEY);
console.log(process.env.CLOUDINARY_API_SECRET);

app.listen(process.env.PORT, process.env.IP, function(){
	console.log("The friendbook server has started");
});