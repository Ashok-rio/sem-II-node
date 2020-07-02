const User = require("../models/User");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const { to, ReE, ReS } = require("../services/util.service");
const HttpStatus = require("http-status");
const bodyParser = require("body-parser");

exports.createOrder = async (req, res) => {
  const users = req.user;
  let err, user, orders, cart,address;
  let total = 0;
  [err, user] = await to(User.findOne({ _id: users._id }));
  if (err) {
    return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
  }
  if (!user) {
    return ReE(res, { message: "User not found" }, HttpStatus.BAD_REQUEST);
  } else {
    [err, cart] = await to(Cart.find({ user: users._id }));
    if (err) {
      return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (!cart) {
      return ReE(res, { message: "Product not found" }, HttpStatus.BAD_REQUEST);
    } else {
        [err,address] = await to(Address.findOne({_id:body.address}));
        if(err){
            return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if(!address){
            return ReE(res, {message:"Address not found"}, HttpStatus.BAD_REQUEST);
        }
        else{
            let order = cart.map((x) => {
                total = Math.floor(total + (x.quantity * x.price));
                return {
                  product: x.product,
                  productName: x.productName,
                  qty: x.quantity,
                  price: x.price,
                  url:x.url
                };
              });
              let orderData = {
                user: users._id,
                address:address._id,
                products: order,
                total: total,
              };
              [err, orders] = await to(Order.create(orderData));
              if (err) {
                return ReE(res, "hi"+err, HttpStatus.INTERNAL_SERVER_ERROR);
              }
              if (!orders) {
                return ReE(
                  res,
                  { message: "Oredr not placed" },
                  HttpStatus.BAD_REQUEST
                );
              } else {
                return ReS(res, orders, HttpStatus.OK);
              }
        }
    }
  }
};

exports.deleteOrder = async (req, res) => {
  const users = req.user;
  let err, user, orders, del;
  const body = req.body;
  [err, user] = await to(User.findOne({ _id: users._id }));
  if (err) {
    ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
  }
  if (!user) {
    ReE(res, { message: "User not found" }, HttpStatus.BAD_REQUEST);
  } else {
    [err, orders] = await to(Order.findOne({ _id: body._id }));
    if (err) {
      ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (!orders) {
      ReE(res, { message: "Order not found" }, HttpStatus.BAD_REQUEST);
    } else {
        [err, del] = await to(Order.deleteOne({ _id: orders._id,user:user._id}));
        if (err) {
          ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if (del.deletedCount === 0) {
          ReE(res, { message: "Order delete failure" }, HttpStatus.BAD_REQUEST);
        } else {
          ReS(res, { message: "Order deleted Successfully" }, HttpStatus.Ok);
        }
    }
  }
};

exports.getAll = async (req, res) => {
  const users = req.user;
  let err, user, order;
  [err, user] = await to(User.findOne({ _id: users._id }));
  if (err) {
    ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
  }
  if (!user) {
    ReE(res, { message: "user not found" }, HttpStatus.BAD_REQUEST);
  } else {
    [err, order] = await to(Order.find({ user: users._id }));
    if (err) {
      ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (!order) {
      ReE(res, { message: "Orders not found" }, HttpStatus.BAD_REQUEST);
    } else {
      ReS(res, order, HttpStatus.OK);
    }
  }
};

exports.getById = async (req, res) => {
  const users = req.user;
  let err, user, orders, del;
  const body = req.body;
  [err, user] = await to(User.findOne({ _id: users._id }));
  if (err) {
    ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
  }
  if (!user) {
    ReE(res, { message: "User not found" }, HttpStatus.BAD_REQUEST);
  } else {
    [err, orders] = await to(Order.findOne({_id:body._id,user:user._id}));
    console.log(orders)
    if (err) {
      ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (!orders) {
      ReE(res, { message: "Order not found" }, HttpStatus.BAD_REQUEST);
    } else {
        ReS(res, orders, HttpStatus.OK);
    }
  }
};