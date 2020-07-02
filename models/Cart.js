const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
var aggregatePaginate = require('mongoose-aggregate-paginate-v2')
const Product = require('./Product')
let CartSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products'
    },
    productName:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    url:{
        type:String,
        required:true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    quantity: {
        type: Number,
        required: true
    }
}, { timestamps: true });
module.exports = Cart = mongoose.model('Carts', CartSchema)