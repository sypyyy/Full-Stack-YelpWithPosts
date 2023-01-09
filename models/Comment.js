const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
   content : String,
   time : String,
   userId : String,
   username : String
  });
const Comment = mongoose.model("Comment", commentSchema);
//This is a model for main app to create new Posts
module.exports = Comment;
