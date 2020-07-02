const mongoose = require('mongoose')

let slickSchema = mongoose.Schema({
    url:{
    type:String
    }
})

module.exports=Slick=new mongoose.model('Slick',slickSchema)