const express = require("express");
const User = require("../models/User");
const router = express.Router();
const path = require("path");
const bodyParser = require('body-parser');
const passport = require("passport");
const base =require("../base/base");
var jsonParser = bodyParser.json();
const cors = require('cors');
router.use(cors())
////////////
router.use(express.static(path.join(__dirname, "../clientreact/build")));
router.use( bodyParser.urlencoded({ extended: true }) );

router.post('/login',passport.authenticate("local",{failureRedirect : base + "/loginFail"}),(req, res) => {
    res.redirect(base +"/search");
});

router.get('/logout',async(req, res) => {
    await req.logout(() => {});
    res.send("success");
});

router.get('/isLoggedIn',async (req, res) => {
    //res.send("true");
    if(req.isAuthenticated()) {
        const cur_user = await User.findById(req.user._id);
   
        res.send({loggedIn : true, username : cur_user.username});
    }
    else {
      
        res.send({loggedIn : false, username : ""});
    }
});


module.exports = router;