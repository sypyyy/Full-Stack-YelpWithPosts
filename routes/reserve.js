const express = require("express");
const router = express.Router();
const path = require("path")
const bodyParser = require('body-parser')
const User = require("../models/User");
const Reservation = require("../models/Reservation")
const cors = require('cors');
router.use(cors())
////////////
//var jsonParser = bodyParser.json()
const {isLoggedIn} = require("../middleware/checkLogin")
router.use(express.static(path.join(__dirname, "../clientreact/build")));

router.get("/reserve", async (req, res) => {
    const params = req.query;
    const reservation = new Reservation(params);
    await reservation.save(async (err,reservation) =>{
        const cur_user = await User.findById(req.user._id);
        await cur_user.reservation.push(reservation);
        await cur_user.save();
        res.send("success");
    });
})

router.get("/ifReservedThisBusiness", async (req, res) => {
    if(!req.isAuthenticated()) {
        res.send(false)
        return
    }
    const queryBusinessId = req.query.id;
 
    const cur_user = await User.findById(req.user._id);

    await cur_user.populate("reservation");

    let cur_reservations = cur_user.reservation;
    
    for(reservation of cur_reservations) {
        if(reservation.businessId === queryBusinessId) {
            res.send(JSON.stringify({reserved : true, reservationId : reservation._id}));
            return;
        }
    }
    res.send(false);
})

router.get("/cancelReserve", async (req, res) => {
    const reservationID = req.query.id;
    User.findOneAndUpdate( 
        { _id: req.user._id }, 
        { $pull : { reservation : reservationID } }, 
        async function(err, data) {
            await Reservation.deleteOne({_id : reservationID});
            res.send(true);
        }
    );
})

router.get("/getBookings", async (req, res) => {
    const cur_user = await User.findById(req.user._id);
    await cur_user.populate("reservation");
    let cur_reservations = cur_user.reservation;
    res.send(JSON.stringify({reservations:cur_user.reservation}));
})


module.exports = router;