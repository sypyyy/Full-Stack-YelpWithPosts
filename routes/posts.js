const express = require("express");
const User = require("../models/User");
const router = express.Router();
const path = require("path")
const bodyParser = require('body-parser');
const passport = require("passport");
const base =require("../base/base");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
//var jsonParser = bodyParser.json();
const multer = require('multer');
const upload = multer();
const fs = require('fs');
const cors = require('cors');

const {isLoggedIn} = require("../middleware/checkLogin");
//// Imports the Google Cloud Node.js client library
const {Storage} = require('@google-cloud/storage');
const storage = new Storage();
const bucketName = 'yelp-react-proj-image-bucket-123';



router.use(cors())
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));  
//router.use(upload.array());
router.get("/allPosts", async (req, res) => {
   const filter = {};
   const all = await Post.find(filter);
   res.send(all);
})


//
router.post("/writePost", isLoggedIn, upload.single("image"), async (req, res) => {
   
   const post = new Post({username : req.user.username, userId : req.user._id, time : getDate(), businessName:req.body.name,
   location : req.body.location, image : "", 
   content : req.body.content, rating : req.body.rating, likes : "0"
   })
   if(req.file) {
      post.image = "https://yelp-img.s.xiexun.org/" + post._id + ".jpg";
   }
   await post.save();
   //res.send(all);
   
   if(req.file) {
      const destFileName=post._id + ".jpg";
      const contents = req.file.buffer;
      await uploadFromMemory(destFileName, contents).catch(console.error);
   }
   
   res.status(201).end();
})


router.get("/deletePost/:postID", isLoggedIn, async(req, res) => {
   const targetPost = await Post.findById(req.params.postID);  
   if(targetPost && targetPost.userId === req.user._id.toString()) {
      await Post.deleteOne({_id : req.params.postID});
      res.status(201).end();
      return;
   }
   else {
      res.status(404).end();
   }
})

router.get("/getComments/:postID", async(req, res) => {
   try{
      const targetPost = await Post.findById(req.params.postID);  
   let comments = [];
   for(const id of targetPost.comments) {
      const comment = await Comment.findById(id);  
      comments.push(comment);
   }
   res.send(comments);
   } catch(e) {
   }
   
})

router.get("/leaveComment/:postID",isLoggedIn, async(req, res) => {
   try{
   const targetPost = await Post.findById(req.params.postID);  
   const content = req.query.content;
   const comment = new Comment({content : content,
   time : getDate(),
   userId : req.user._id,
   username : req.user.username});
   await comment.save(async (err,comment) =>{
      await targetPost.comments.push(comment);
      await targetPost.save();
   });
   res.status(201).end();
   } catch(e) {
   }
   
})


/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// The ID of your GCS bucket
// 

// The contents that you want to upload
// 

// The new ID for your GCS file
// 



// Creates a client


function uploadFromMemory(destFileName, contents) {
  return new Promise(async resolve => {
   await storage.bucket(bucketName).file(destFileName).save(contents);
  
   resolve();
  })
}







function getDate() {
   const today = new Date();
   const dd = String(today.getDate()).padStart(2, '0');
   const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
   const yyyy = today.getFullYear();

  
   return yyyy + '-' + mm + '-' + dd;
}

module.exports = router;