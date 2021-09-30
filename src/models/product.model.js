const {Schema, model} = require('mongoose');

const productSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    poster:{
        type: Object,
        required: true
    },
    gallery:{
        type: Array       
    },
    price:{
        type: Number,
        required: true,
        default: 0
    },
    discount:{
        type: Number,
        default: 0
    },
    stock:{
        type: Number,
        default: 0,
        required: true
    },
    sku:{
        type: String,
        required: true,
        unique: true
    },
    created_at:{
        type: Date,
        default: new Date()
    },
    rating:{
        type:Number,
        require:true
    },
    productType:{
        type: String,
        required: true
    }
    

})

module.exports = model("Product", productSchema)