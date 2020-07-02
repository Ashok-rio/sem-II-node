const User = require("./../models/User");
const Address = require("./../models/address");
const { to, ReE, ReS } = require("../services/util.service");
const HttpStatus = require("http-status");

exports.Create = async (req, res) => {
  const body = req.body;
  let err, user, address;
  const users = req.user;
  [err, user] = await to(User.findOne({ _id: users._id }));
  if (err) return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
  if (!user) {
    ReE(res, { message: "user not found" }, HttpStatus.BAD_REQUEST);
  } else {
    [err, address] = await to(Address.create({
        user: user._id,
        name: body.name,
        phone: body.phone,
        address: body.address,
        town: body.town,
        city: body.city,
        state: body.state,
        type: body.type,
      })
    );
    if (err) {
      return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (!address) {
        console.log(address)
      return ReE(
        res,
        { message: "Address creation failed" },
        HttpStatus.BAD_REQUEST
      );
    } else {
      return ReS(
        res,
        { message: "Register Successfully", address: address },
        HttpStatus.OK
      );
    }
  }
};

exports.find = async (req, res) => {
  const users = req.user;
  let err, address, user;

  [err, user] = await to(User.findOne({ _id: users._id }));
  if (err) {
    return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
  }
  if (!user) {
    return ReE(res, { message: "user Not Found" }, HttpStatus.BAD_REQUEST);
  } else {
    [err, address] = await to(Address.find({ user: users._id }));
    if (err) {
      return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (!address) {
      return ReE(res, { message: "address Not Found" }, HttpStatus.BAD_REQUEST);
    } else {
      return ReS(
        res,
        { message: "Register Successfully", address: address },
        HttpStatus.OK
      );
    }
  }
};

exports.findById = async (req, res) => {
  const body = req.body;
  const users = req.user;
  let err, address, user;

  [err, user] = await to(User.findOne({ _id: users._id }));
  if (err) {
    return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
  }
  if (!user) {
    return ReE(res, { message: "user Not Found" }, HttpStatus.BAD_REQUEST);
  } else {
    [err, address] = await to(Address.findOne({ _id: body.id }));
    if (err) {
      return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (!address) {
        console.log(address)
      return ReE(res, { message: "address Not Found" }, HttpStatus.BAD_REQUEST);
    } else {
      return ReS(
        res,
        { message: "founded Successfully", address: address },
        HttpStatus.OK
      );
    }
  }
};

exports.delete = async (req, res) => {
  const body = req.body;
  const users = req.user;
  let err, address, user;
  [err, user] = await to(User.findOne({ _id: users._id }));
  if (err) {
    return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
  }
  if (!user) {
    return ReE(res, { message: "user Not Found" }, HttpStatus.BAD_REQUEST);
  } else {
    [err, address] = await to(Address.deleteOne({ _id: body.id }));
    if (err) {
      return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (address.deletedCount == 0) {
        console.log(address)
      return ReE(
        res,
        { message: "address delete failed" },
        HttpStatus.BAD_REQUEST
      );
    } else {
      return ReS(
        res,
        { message: "deleted Successfully", address: address },
        HttpStatus.OK
      );
    }
  }
};
