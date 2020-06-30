const mongoose = require('mongoose');

//getting query
//good time and low complexity

//update query
//easy

//delete query
//easy

const roomSchema = new mongoose.Schema({
    id : {
        index : true,
        type : Number,
        require : true
    },
    type: {
        type : String,
        require : true
    },
    price : {
        type : Number,
        require : true
    },
    booked:{
        type : Boolean,
        require : true
    }

});

const roomModel = mongoose.model('room', roomSchema);

module.exports = roomModel;