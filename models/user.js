var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
require('mongoose-type-email');

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email:{type: mongoose.SchemaTypes.Email, required: true}
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);