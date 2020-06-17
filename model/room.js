const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    id : {
        index : true,
        type : String,
        require : true
    },
    Description: {
        type : String
    },
    booked

});

const customerModel = mongoose.model('customer', customerSchema);

module.exports = customerModel;