const mongoose = require('mongoose')
const Schema = mongoose.Schema
let ratingSchema = new Schema({
    product:{
        type: Schema.Types.ObjectId, ref: 'Product'
    },
    user:{
        type: Schema.Types.ObjectId, ref: 'User'
    },
    rating:{
        type: Number,
        enum:[1,2,3,4,5]
    },
    ordered:{
        type: Schema.Types.ObjectId, ref: 'Order'
    }

})

module.exports=Slick=new mongoose.model('Rating',ratingSchema) 