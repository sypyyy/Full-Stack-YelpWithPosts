const express = require("express");
const User = require("../models/User");
const router = express.Router();
const path = require("path")
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
router.use(express.static(path.join(__dirname, "../clientreact/build")));
router.use(jsonParser);
const cors = require('cors');
router.use(cors())

router.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "../clientreact/build/index.html"));
})
router.post('/register', async (req, res) => {
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.logIn(registeredUser, () => {res.send("yeah")});
    } catch(e) {
    }
    
    
});
router.get("/checkUserExist/:username", async (req, res) => {
    const user = await User.findByUsername(req.params.username);
    if(user) {
        res.status(201).end();
    }
    else {
        res.status(204).end();
    }
})



module.exports = router;