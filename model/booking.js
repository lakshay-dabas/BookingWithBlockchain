const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    contractId : {
        index : true,
        type : String,
        required : true
    },
    bookingStartDate : {
        type : Date,
        require : true
    },
    bookingEndDate : {
        type : Date,
        require : true
    },
    roomId : {
        type : Number,
        require : true
    },
    checkInDate : {
        type : Date
    },
    chckOutDate : {
        type : Date
    },
    status : {//status of customer, on checkout or bookingEndDate this should be changed to false
        type : Boolean,
        default: true
    }
});

module.exports = bookingSchema;