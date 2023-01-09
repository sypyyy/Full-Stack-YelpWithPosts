const mongoose = require("mongoose");
const postImageSchema = new mongoose.Schema({
   data: Buffer,
   contentType: String
});
const PostImage = mongoose.model("PostImage", postImageSchema);
//This is a model for main app to create new Posts
module.exports = PostImage;