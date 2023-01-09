const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReservationSchema = new Schema({
    businessId: {
        type: String,
        required : true,
    },
    businessName: {
        type: String,
        required : true,
    },
    email: {
        type: String,
        required : true,
    },
    date: {
        type: String,
        required : true
    },
    hour: {
        type: String,
        required : true
    },
    min: {
        type: String,
        required : true
    }
});

module.exports = mongoose.model("Reservation", ReservationSchema);