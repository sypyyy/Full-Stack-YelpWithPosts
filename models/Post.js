const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new mongoose.Schema({
    username : String,
    userId : String,
    title : String,
    time: String,
    businessName: String,
    location : String,
    image : String,
    content : String,
    rating : String,
    likes : String,
    comments : [
        {
          type: Schema.Types.ObjectId,
          ref: 'Comment'
      }
    ],
  });
const Post = mongoose.model("Post", postSchema);
//This is a model for main app to create new Posts
module.exports = Post;
