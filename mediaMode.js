const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
  userName: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  content: {
    type: String,
  },
});

const postSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  content: {
    type: String,
  },
  like: {
    type: Number,
  },
  comments: [commentSchema],
});

const mediaSchema = new Schema({
  userName: {
    type: String,
    require: true,
  },
  userEmail: {
    type: String,
    require: true,
  },
  telephoneNumbe: {
    type: Number,
  },
  age: Number,
  post: [postSchema],
});

const MediaModel = new mongoose.model("media", mediaSchema);

module.exports = MediaModel;
