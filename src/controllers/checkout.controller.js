const checkoutMethod = {}
const stripe = require('stripe')('sk_test_51Jb4J6IEaeNodsxnOGVP1wxRlrpXZvNxdjpjsPtx9Qzm2X8gMWHoR6ozmmhXRjZ44PC4bx24sTHcnkQPxL8jCYji006kzRSV2h');


checkoutMethod.paymentIntents = async (req, res) => {
   const {id, amount} = req.body;  
   
   try{
       const payment = await stripe.paymentIntents.create({
           amount,
           currency:'mxn',
           confirm:true,
           payment_method: id,
       })
       console.log(payment)
       return res.status(200).json({message: 'Succesful payment'})

   }catch(error){
       return res.json({message: error.raw.message})
   }
}

module.exports = checkoutMethod