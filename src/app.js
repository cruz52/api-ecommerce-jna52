const express = require('express');
const cors = require('cors');
const helmet =require('helmet');
const morgan = require('morgan');
const app = express();
const path = require('path');
require('./config/config')

//Set more security to request
app.use(helmet())

//Allow Cors
app.use(cors())

//Set module for helped request information
app.use(morgan("combined"))

//Allow json request
app.use(express.json())
app.use(express.urlencoded({extended: true}))


//Define static files access
app.use('/',express.static(path.join(__dirname, '/../public')))

//Configure routes
app.use('/user', require('./routes/user.route'));
app.use('/product', require('./routes/product.route'))
app.use('/rol', require('./routes/rol.route'))
app.use('/checkout', require('./routes/checkout.route'))


module.exports = app;