//packages
const express  =require('express');
const exphbs = require('express-handlebars');
const socketio = require('socket.io');
const http = require('http');
const Web3 = require('web3');
const nodeRSA = require('node-rsa');

const mongoose = require('mongoose')
const request = require('request-promise');
const path = require('path')
require('dotenv').config();

//initialization
const app = express();//init
const server = http.createServer(app); //,{'pingInterval': 2000,'pingTimeout' : 6000}
const io = socketio(server);  // init socketio for this server,so that new socket connections can be handled on our server
const web3 = new Web3('https://ropsten.infura.io/v3/96beb9df66384d07991430e7fa44a4a2');

// const router = express.Router();
app.engine('handlebars', exphbs());//creating new template engine 
app.set('view engine', 'handlebars');//setting view engine to handlbars engine (respnsible for file with .handlebars ending)

// mongo-db connection
mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser : true,useUnifiedTopology: true})
    .then(() => console.log('Mongo DB connected'))
    .catch((err) => console.log(err));

//helper function 

const {eventListener} = require('./listener');
eventListener();
const {allKeys} = require('./keys');
const bookingModel = require('./model/bookings');
const allKeysObject = new allKeys();
const publicKey = allKeysObject.getKey(process.env.HOTEL_ADDRESS)['public'];  //public key for encryption


//form data is passed based on names, so specify name in html for getting the data
//Middleware initialization
app.use(express.json());  //middleware for json payload parsing, we are using this to parse form data
app.use(express.urlencoded( {extended : true}));


//static rendering + making public avaialble to all
app.use(express.static(path.join(__dirname ,'public')));

io.on('connection', (socket) => {   // getting new connections from page havinig access to socket.io lib
    console.log('New connection on default namepsace...');
    
    socket.on('disconnect', () => {
        console.log('disconnected on defaut namepspace');
    });

    socket.on('book-room', async(o) => {
        console.log(o)
        const {roomType, roomNeeded, email, startDate, endDate} = o;
        let temp = startDate.split('/');
        console.log(temp)
        const d1 = new Date(Number(temp[2]), Number(temp[0])-1, Number(temp[1]), 17, 30, 0,0);
        console.log(d1)
        temp = endDate.split('/');
        console.log(temp)
        const d2 = new Date(Number(temp[2]), Number(temp[0])-1, Number(temp[1]), 17, 30 ,0,0 );
        let price = -1;
        console.log(d2)
        console.log(d1.toDateString())
        console.log(d2.toDateString())
        temp = d2.getTime() - d1.getTime()
        // console.log(temp)
        const days = (d2.getTime() - d1.getTime())/(24*3600*1000)+ 1;//PROBLEM
        console.log('days '+days);
        if(d1 == 'Invalid Date'|| d2 == 'Invalid Date' || d1 >= d2 || d1 < Date.now() || d2 < Date.now()){
            res.redirect('index', {msg : 'Invalid Booking Dates'});
            return;
        }

        console.log('days',days);

        //check how many rooms of roomType are empty then allocate any one of them
        
        const options = {
            uri : `https://hotel--backend.herokuapp.com/check-room-available?roomType=${roomType}&startDate=${Date.parse(d1)}&endDate=${Date.parse(d2)}&roomNeeded=${roomNeeded}`,
            json: true,
            resolveWithFullResponse: true,
            method: 'GET',
            headers : {
            }
        }
        let haveRoom = false;
        let response;
        try{
            response = await request(options)
        }
        catch(err){
            console.log(err);
            // res.redirect('index');
        }
        // console.log(response)
        // s = response.req._header
        // console.log(s)
        // console.log(response.statusCode)
        // start = s.indexOf('email') + 7
        // s = s.substr(start)
        // end = s.indexOf('host')
        // s = s.substr(0,end);
        // s = s.trim()  //remove spaces from front and end
        // console.log(s)
        console.log(response.body);

        if(response.body.body == 'yes'){
            const obj = response.toJSON(response.body);
            haveRoom = true;
            console.log(obj)
            price = obj.body.price;
            console.log(price);
        }
        //if not empty notify customer
        if(!haveRoom){
            // res.render('index',{msg: `No room of ${roomType} type are empty right now...Sorry for inconvience`});
            return;
        }

        //if emtpy:
            //call smart contract bookRoom func
                //bookRoom(startDate, endDate, typeOfRoom needed, hotelAddress)--send ether through metamask approval if customer
        
        let amount = Number(price)*(days);
        console.log(amount)
        const key = new nodeRSA(publicKey);
        const eroomType = key.encrypt(roomType,'base64');
        const eemail = key.encrypt(email, 'base64');
        const eroomNeeded = key.encrypt(roomNeeded, 'base64');
        const contract = new web3.eth.Contract(require('./abi'), process.env.CONTRACT_ADDRESS);
        const func = contract.methods.bookRoom(eroomType,eroomNeeded,d1.getTime(),d2.getTime(),process.env.HOTEL_ADDRESS, eemail,process.env.SECRET_KEY);
        const funcAbi = func.encodeABI();
        const o1 = {
            paymentAddress: process.env.CONTRACT_ADDRESS,
            amountEth: amount*roomNeeded*process.env.CURRENCY, 
            funcAbi
        }
        socket.emit('sendMetamaskTransaction',o1);
        // if(!flag){
        //     res.render('index',{msg : 'Please Install Metamask for payment on Ethereum Ropsten Test Network'})
        // }
        //we should listen to that event and notify customer for successfull booking

        //we add that booking for that customer in our customer DB
            //if new customer add new
            //then, in booking array add the entry  

        //roomID status is set to booked
        
    })


    socket.on('cancel-booking',async o => {
        const contractId = o.contractId;
        console.log('backend', contractId)
        try{
            const booking = await bookingModel.findOne({contractId});
            console.log(booking)
            if((!booking) || booking.status != "Hotel confirmed the booking"){
                socket.emit('alert',{msg : 'No Active Contract with this contractId'});
                return;
            }
            const contract = new web3.eth.Contract(require('./abi'), process.env.CONTRACT_ADDRESS);
            const func = contract.methods.cancelBookingByCustomer(contractId);
            const funcAbi = func.encodeABI();
            const o1 = {
                paymentAddress: process.env.CONTRACT_ADDRESS,
                funcAbi
            }
            socket.emit('cancel-booking',o1);
        }
        catch(err){
            console.log(err);
        }
    })
});


//GET request
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
app.get('/cancel-booking', (req,res) => {
    res.render('cancelBooking');
})

//checkIn -> how hotel can verify the customer is the one to whom we have made the contract
//contractor, BWB -> must provide some identity detail of the customer like email, phone no, addhar no,
//ethereum address
//as this contract can be used by many contries, so addhar not gonna work internitionally,
//email address of a person can be provided to the hotel, and customer can provide the email at time of checkin,
// hotel can ask for pin on email for verification and can ask for identity like addhar, driving licence etc
//whatever the  need is and can check in

//we need to send email of customer to hotel via a secure mechanism 
//public private key infrastructure or assymetric encryption should be used as their can be may hotels,
//if symmetric encryption is used then we need to share secret key to all for decryption 
//that can comprise our whole network of hotels and contractor bcz prob of secret key comprimising is more
//in PKI mechanism public key of BWB contractor will be availbe to all and hotel can make sure we are  sending
//the info as only our public key can decrypt it

//port listening
const PORT  = process.env.PORT | 3000;
server.listen(PORT, () => {
    console.log('Listening at port ' + PORT);
})