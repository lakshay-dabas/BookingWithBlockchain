const mongoose = require('mongoose');
require('dotenv').config()

const bookingSchema = new mongoose.Schema({
    contractId : {  //contractId
        index : true,
        type : String,
        required : true
    },
    customerEmail : {
        type : String,
        required : true
    },
    hotelAddress : {
        type: String,
        required : true,
        default : process.env.HOTEL_ADDRESS
    },
    bookDate : {
        type : Date,
        default : (new Date(Date.now())).toDateString()
    },
    bookingStartDate : {
        type : Date,
        require : true
    },
    bookingEndDate : {
        type : Date,
        require : true
    },
    amount : {
        type : Number,
        requrie : true
    },
    roomId : {
        type : String
    },
    roomType : {
        type : String
    },
    status : {//status of customer, on checkout or bookingEndDate this should be changed to false
        type : String,
        default: true
    },
    emailSend : {
        type : Boolean,
        default : false
    },
    fullRefundDate : {
        type : Date,
        require : true
    }
});
const bookingModel = mongoose.model('booking', bookingSchema);
module.exports = bookingModel;