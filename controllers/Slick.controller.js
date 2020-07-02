const Slick = require('../models/SlickImgs')
const { to, ReE, ReS } = require('../services/util.service')
const HttpStatus = require('http-status')

module.exports.create = async (req, res) => {

    let url = req.body.url
    let img, err
    if(typeof url === 'undefined' || url ===''){
        return ReE({message: 'plz enter url'}, HttpStatus.BAD_REQUEST)
    }
    else{
        [err, img] = await to(Slick.create({url:url}))
        if (err) return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
        else{
         
            
           return ReS(res, {images:img}, HttpStatus.OK)
        }
    }
    
  
}

module.exports.getAllSlick = async (req, res)=>{
    let img, err
    [err, img] = await to(Slick.find())
    if (err) return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
    else{
        
       return ReS(res, {img}, HttpStatus.OK)
    }
}

module.exports.getSlick = async (req, res)=>{
    let url = req.body.url
    let img, err
    if(typeof url === 'undefined' || url ===''){
        return ReE({message: 'plz enter url'}, HttpStatus.BAD_REQUEST)
    }
    else{
        [err, img] = await to(Slick.findOne({url:url}))
    if (err) return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
    else{
       return ReS(res,{images:img}, HttpStatus.OK)
    }
    }
    
}