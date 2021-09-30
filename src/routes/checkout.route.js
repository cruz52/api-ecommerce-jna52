const express = require('express');
const router = express.Router();
const { paymentIntents } = require('../controllers/checkout.controller')

router
    
    .post('/',paymentIntents)
   


module.exports = router;