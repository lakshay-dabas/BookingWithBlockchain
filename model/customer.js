const mongoose = require('mongoose');
const bookingSchema = require('booking');


//getting query
//customer data can be get using indexing on email or ethereum addrss 
//booking for a customer can be get using contract Id indexing

//update query
//add customer
//O(1)
//add booking for customer
//O(log(n))
//make status of booking change like checkIn, checkOut, status
//O(log(n)*log(b))
//delete query
//O(log(n))

const customerSchema = new mongoose.Schema({
    name : {
        type : String,
        required: true
    },
    email : {
        type : String,
        index : true,
        require : true
    },
    ethereumAddress: {
        index : true,
        type : String,
        required : true
    },// [(customerId,startDate, endDate, checkIn, checkOut, Status), (), ()]
    booking : [bookingSchema]

});

const customerModel = mongoose.model('customer', customerSchema);

module.exports = customerModel;