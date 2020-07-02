const mongoose = require('mongoose')
let OrderSchema = mongoose.Schema({
user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
},
address:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Address'
},
products:[
    {
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
        },
        productName:{
            type:String,
            required:true
        },
        qty:{
            type:Number,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
    }
],
total:{
    type:Number,
    required:true
}
})
module.exports=User=mongoose.model('Order',OrderSchema)