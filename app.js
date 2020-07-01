//packages
const express  =require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config();


//initialization
const app = express();//init
const router = express.Router();
app.engine('handlebars', exphbs());//creating new template engine 
app.set('view engine', 'handlebars');//setting view engine to handlbars engine (respnsible for file with .handlebars ending)


//helper function 
const {transer} = require('./helperFunc');
const smartContractHelper = require('./smartContractHelper');
const eventListener = require('./listener');

//Database Model import
const customerModel = require('./model/customer');
const roomModel = require('./model/room');

// mongo-db connection
// mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser : true,useUnifiedTopology: true})
//     .then(() => console.log('Mongo DB connected'))
//     .catch((err) => console.log(err));

//form data is passed based on names, so specify name in html for getting the data

//Middleware initialization
app.use(express.json());  //middleware for json payload parsing, we are using this to parse form data
app.use(express.urlencoded( {extended : true}));


//static rendering + making public avaialble to all
app.use(express.static(path.join(__dirname ,'public')));


//routing to pages
app.get('/index',(req,res) => {
    res.render('index');//data of counts of successful transaction will be passed
})
app.get('/services',(req,res) => {
    res.render('services');//data of counts of successful transaction will be passed
})
app.get('/hotel',(req,res) => {
    res.render('hotel');//data of counts of successful transaction will be passed
})
app.get('/contact',(req,res) => {
    res.render('contact');//data of counts of successful transaction will be passed
})
app.get('/submitPin', (req,res) => {
    res.render('submitPin');
})

app.post('/index', (req,res) => {
    console.log(req.body);
    const {roomType,startDate, endDate} = req.body;
    
    let price = -1;
    const days = (endDate - startDate);//PROBLEM

    //check how many rooms of roomType are empty then allocate any one of them
    const haveRoom = roomModel.some(room => {
        if (room.type == roomType && room.booked == false){
            price = room.price;
            return true;
        }   
    });

    //if not empty notify customer
    if(!haveRoom){
        res.render('index',{msg: `No room of ${roomType} type are empty right now...Sorry for inconvience`});
        return;
    }

    //if emtpy:
        //call smart contract bookRoom func
            //bookRoom(startDate, endDate, typeOfRoom needed, hotelAddress)--send ether through metamask approval if customer
    
    let amount = price*(days);

    const flag = smartContractHelper.bookRoom(startDate, endDate, roomType, amount);
    if(!flag){
        res.render('index',{msg : 'Please Install Metamask for payment on Ethereum Ropsten Test Network'})
    }
        //hotel will listen when this transaction is carried out, by seeing its hotel address and get the contractID
        //and
        //approve if have room(why again checking bcz it may happen, customer is calling this func from another source)
        //  by  paying 10percent of booking amount
            //hotelPayTenPercent(contractId, room_alloted) sending ethers 

        //(smart contract will send pin to script which will send email with pin to customer)
        //(customer can verify details for contract and fill pin in hotel webiste and conform booking)

        //ask for pin input and button from customer

        //send pin to smart contract, (if correct then smart contract will through an confirm booking event having contract ID)

        //(send checkIn code to customer through email)

        //we should listen to that event and notify customer for successfull booking

        //we add that booking for that customer in our customer DB
            //if new customer add new
            //then, in booking array add the entry  

        //roomID status is set to booked

    res.redirect('sumitPin');
})
//on checkIn,if checkin is not done on start 
    //checkIn code is provided to hotel, then hotel can recieve payment



//event listeners
//PORBLEM
// eventListener()


//port listening
const PORT  = process.env.PORT | 3000;
app.listen(PORT, () => {
    console.log('Listening at port ' + PORT);
})