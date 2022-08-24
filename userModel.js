const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');
const passport = require('passport');
const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
});

UserSchema.plugin(passportLocalMongoose);

const UserModel = new mongoose.model("user", UserSchema);

passport.use(UserModel.createStrategy());

passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

module.exports = UserModel;
