const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    _id : {  //contractId
        index : true,
        type : String,
        required : true
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
        type : Number,
        require : true
    },
    checkInDate : {
        type : Date
    },
    checkOutDate : {
        type : Date
    },
    status : {//status of customer, on checkout or bookingEndDate this should be changed to false
        type : String,
        default: true
    },
    final : {  //tell if pin submition stage of booking us reached or not
        type : Boolean,
        default : false
    }
});

module.exports = bookingSchema;