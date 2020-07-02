const User = require("../models/User");
const Oreder = require("../models/Product");
const Cart = require("../models/Card");
const { to, ReE, ReS } = require("../services/util.service");
const HttpStatus = require("http-status");

exports.createOrder = async (req,res) => {
    const users = req.user;
    const Body = req.body;
    let err,user,order,product;
    [err,user] = await to(User.findOne({_id:users._id}));
    if(err){
        return ReE(res,err,HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if(!user){
        return ReE(res,{message:"User not found"},HttpStatus.BAD_REQUEST);
    }
    else{
        [err,product] = await to(Cart.findOne({_id:Body.productId}));
        if(err){
            return ReE(res,err,HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if(!product){
            return ReE(res,{message:"Product not found"},HttpStatus.BAD_REQUEST)
        }
        else{
                let order = data.map(x => { return { product: x.product,productName:x.productName, qty: x.qty, price:x.price } });
        }
    }

}