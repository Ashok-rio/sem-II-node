const Payment = require("../models/Payment");
const Order = require("../models/Order");
const { to, ReE, ReS } = require("../services/util.service");
const HttpStatus = require("http-status");
const User = require("../models/User");

exports.createPayment = async (req, res) => {
  const users = req.user;
  let err, user, payment, order, updateOrder;
  [err, user] = await to(User.findOne({ _id: users._id }));
  if (err) {
    return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
  }
  if (user.admin) {
    return ReE(
      res,
      { message: "You are not an admin " },
      HttpStatus.BAD_REQUEST
    );
  }
  if (!user) {
    return ReE(res, { message: "User not found" }, HttpStatus.BAD_REQUEST);
  } else {
    [err, order] = await to(Order.findOne({ _id: req.body.id }));
    if (err) {
      return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (!order) {
      return ReE(res, { message: "Order not found" }, HttpStatus.BAD_REQUEST);
    } else {
      let pay = {
        cardname: req.body.cardname,
        cardnumber: req.body.cardnumber,
        expiry: req.body.expiry,
        cvv: req.body.cvv,
        orderId: order._id,
      };
      [err, payment] = await to(Payment.create(pay));
      if (err) {
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      if (!payment) {
        return ReE(
          res,
          { message: "Server lost unable to pay money try again later" },
          HttpStatus.BAD_REQUEST
        );
      } else {
        [err, updateOrder] = await to(
          Order.updateOne({ _id: req.body.id }, { $set: { payment: true } })
        );
        if (err) {
          return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if (!updateOrder) {
          return ReE(
            res,
            { message: "Unable to process your transitions ! try again later" },
            HttpStatus.BAD_REQUEST
          );
        } else {
          return ReS(res, { message: "Paid" }, HttpStatus.OK);
        }
      }
    }
  }
};
