const mongoose = require('mongoose')
let AddressSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    name:{
        type:String,
        required: true
    },
    phone:{
        type:String,
        required: true
    },
    address:{
        type:String,
        required: true
    },
    town:{
        type:String,
        required: true
    },
    city:{
        type:String,
        required: true
    },
    state:{
        type:String,
        required: true
    },
    type:{
        type:String,
        required: true
    },
})
module.exports=User=mongoose.model('Address',AddressSchema)