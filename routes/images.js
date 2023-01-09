


const {Storage} = require('@google-cloud/storage');
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const path = require("path");
const bodyParser = require('body-parser');
const passport = require("passport");
const base =require("../base/base");
var jsonParser = bodyParser.json();
const cors = require('cors');
router.use(cors())
////////////

const bucketName = 'yelp-react-proj-image-bucket-123';
const fileName = 'grace_hopper.png';

const destFileName = path.join(__dirname, "../clientreact/Postimages/image1.png");
const storage = new Storage();

router.use(express.static(path.join(__dirname, "../clientreact/Postimages")));
//router.use( bodyParser.urlencoded({ extended: true }) );
router.get("/getImages/:filename",async (req, res) => {
   res.redirect(`http://34.149.25.0:80/${req.params.filename}`);
    
})

async function downloadFile() {

   const options = {
     destination: destFileName,
   };

   // Downloads the file
   await storage.bucket(bucketName).file(fileName).download(options);
 
  
 }
 module.exports = router;


 