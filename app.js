const express  =require('express');
// const exphbs = require('express-handlebars');
const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config();

const app = express();//init
const router = express.Router();

// app.engine('handlebars', exphbs());//creating new template engine 
// app.set('view engine', 'handlebars');//setting view engine to handlbars engine (respnsible for file with .handlebars ending)

mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser : true,useUnifiedTopology: true})
    .then(() => console.log('Mongo DB connected'))
    .catch((err) => console.log(err));



const {transer} = require('./helperFunc');


//we are using this to parse form data
app.use(express.urlencoded( {extended : true}));
app.use(express.json());  //middleware for json payload parsing


app.use(express.static(path.join(__dirname ,'public')));
const PORT  = process.env.PORT | 3000;
app.listen(PORT, () => {
    console.log('Listening at port ' + PORT);
})