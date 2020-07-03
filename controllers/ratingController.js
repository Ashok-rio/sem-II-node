const Rating = require('../models/rating')
const { to, ReE, ReS, isEmpty } = require('../services/util.service')
const httpStatus = require('http-status')
exports.createRating = async(req, res)=>{
    let body = req.body
    let err, rating, product
    const decoded = req.user
    [err, product] = await to(Rating.findOne({product:body.product,user:decoded._id}))
    if(product){
        return ReE(res, err, {message:'you are alreadry given'}, httpStatus.BAD_REQUEST)
    }
    else if(isEmpty(body.rating) || body.rating > 5){
        return ReE(res, err, {message:'Enter valid rating'}, httpStatus.BAD_REQUEST)
    }
    else if(isEmpty(body.ordered) ){
        return ReE(res, err, {message:'Enter ordered product'}, httpStatus.BAD_REQUEST)
    }
    else if(isEmpty(body.product) ){
        return ReE(res, err, {message:'Enter product'}, httpStatus.BAD_REQUEST)
    }
    else{
        [err, rating] = await to (Rating.create(body))
        if(err){
            return ReE(res, err, {message:'error occured while creating rating'}, httpStatus.INTERNAL_SERVER_ERROR)
        }
        else{
            return ReS(res, {success:'true',message:'rating succesfully creted',rating:rating}, httpStatus.OK)
        }
    }
}

exports.getRating = async (req, res)=>{
    let body = req.body
    let err, rating
    [err, rating] =await to(Rating.find({}).populate('Product'))
    if(err){
        return ReE(res, err, {message:'error occured while fetching rating'}, httpStatus.INTERNAL_SERVER_ERROR)
    }
    else{
        return ReS(res, {success:'true',message:'rating succesfully fetched',rating:rating}, httpStatus.OK)
    }
}