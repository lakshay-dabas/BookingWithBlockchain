//packages
const express  =require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config();


//initialization
const app = express();//init
const router = express.Router();

//helper function 
const {transer} = require('./helperFunc');

app.engine('handlebars', exphbs());//creating new template engine 
app.set('view engine', 'handlebars');//setting view engine to handlbars engine (respnsible for file with .handlebars ending)


//mongo-db connection
// mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser : true,useUnifiedTopology: true})
//     .then(() => console.log('Mongo DB connected'))
//     .catch((err) => console.log(err));

//we are using this to parse form data
app.use(express.urlencoded( {extended : true}));
app.use(express.json());  //middleware for json payload parsing


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


//static rendering
app.use(express.static(path.join(__dirname ,'public')));

//port listening
const PORT  = process.env.PORT | 3001;
app.listen(PORT, () => {
    console.log('Listening at port ' + PORT);
})