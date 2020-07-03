
// User Contollers
const User = require('../models/User')
const authService = require('../services/auth.service')
const { to, ReE, ReS } = require('../services/util.service')
const CONFIG = require('../config/config')
const { isNull } = require('../services/util.service')
const HttpStatus = require('http-status')
const validator = require('validator')
const { isEmail } = validator

module.exports.userRegsiter = async (req, res) => {
  
    
    const body = req.body;
    let err,user
    if (isNull(body.name) || body.name.length < 5) {
        return ReE(res, 'Please enter a name with minimum 5 characters',
            HttpStatus.BAD_REQUEST)
    }

    if (isNull(body.email)) {
        return ReE(res, 'please enter your Email Id', HttpStatus.BAD_REQUEST)
    }
    if (!isEmail(body.email)) {
        return ReE(res, { message: 'Please enter a valid email id' }, 400)
    }


    if (isNull(body.phone)) {
        return ReE(res, { message: 'Please enter a phone number' },
            HttpStatus.BAD_REQUEST)
    }

    if (isNull(body.password) || body.password.length < 8) {
        return ReE(res, 'Please enter a password with minimum 8 characters',
            HttpStatus.BAD_REQUEST)
    }

    if (body.phone.startsWith('+91')) {
        body.countryCode = '+91'
        body.phone = body.phone.replace('+91', '')
    }

    if (!validator.isMobilePhone(body.phone,
        ['en-IN'])) {//checks if only phone number was sent

        return ReE(res, { message: `Invalid phone number ${body.phone}` },
            400)
    }

    let userPhone
    //check phone was already exist or not

    [err, userPhone] = await to(User.findOne({ phone: body.phone }))

    if (err) {
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    if (userPhone) {
        return ReE(res, {
            message: 'Phone was already exists,Please any other phone.',
        }, HttpStatus.BAD_REQUEST)
    }

    let userEmail
    //check email was already exist or not

    [err, userEmail] = await to(User.findOne( { email: body.email }))
    
    if (err) {
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    if (userEmail) {
        return ReE(res, {
            message: 'Email was already exists,Please any other email Id.',
        }, HttpStatus.BAD_REQUEST)
    }

    let userName
    //check name was already exist or not

    [err, userName] = await to(User.findOne( { name: body.name }))

    if (err) {
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    if (userName) {
        return ReE(res, {
            message: 'name was already taken,Please new one',
        }, HttpStatus.BAD_REQUEST)
    }

    let userData ;
    if(body.admin){
        userData =User({
            name: body.name,
            email: body.email,
            phone: body.phone,
            password: body.password,
            admin:true
        })
    }
    else{
        userData =User({
            name: body.name,
            email: body.email,
            phone: body.phone,
            password: body.password,
            admin:false
        })
    }
    let userReg
    [err, userReg] = await to(userData.save())
    if (err) {
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    if (userReg) {
        return ReS(res, {
            message: 'Register Successfully',
            user: userReg,
        }, HttpStatus.OK)
    }
}

module.exports.login = async (req, res) => {
    let err, user
    
    const email = req.body.email
    const password = req.body.password
    // console.log(email,password);

    if (isNull(email)) {
        return ReE(res, { message: 'Please enter an email id or phone number.' },
            HttpStatus.BAD_REQUEST)
    }
    
    if (isNull(password)) {
        return ReE(res, { message: 'Please enter your password to login' },
            HttpStatus.BAD_REQUEST)
    }

    let userQuery = {}

    if (validator.isEmail(email)) {
        userQuery.email = email
    } else if (validator.isMobilePhone(email)) {
        userQuery.phone = email
    } else {
        return ReE(res,
            { message: 'Please enter a valid email or phone number.' },
            HttpStatus.BAD_REQUEST)
    }

    [err, user] = await to(User.findOne(userQuery))

    if (err) return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)

    if (!user) return ReE(res,
        { message: 'User is not registered. Please register and try again.' },
        HttpStatus.BAD_REQUEST)

    if (user) {
        [err, user] = await to(user.comparePassword(password))

        if (err) return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)

        if (!user) {
            return ReE(res,
                { message: 'Invalid Username or password. please try again.' },
                HttpStatus.BAD_REQUEST)
        }
        if (user.admin===true) {
            ReS(res, {
                message: 'User logged in ',
                user: {
                    _id: user._id,
                    email: user.email,
                    phone: user.phone,
                    name: user.name,
                    admin:user.admin
                },
                token: user.getJWT(),
            }, HttpStatus.OK)

        }
        if (user.admin===false) {
            ReS(res, {
                message: 'User logged in ',
                user: {
                    _id: user._id,
                    email: user.email,
                    phone: user.phone,
                    name: user.name
                },
                token: user.getJWT(),
            }, HttpStatus.OK)

        }
    }
}

module.exports.updateUser = async(req, res)=>{
    const body = req.body;
    const decoded = req.user;
    
   let err,user
   if (isNull(body.name) || body.name.length < 5) {
       return ReE(res, 'Please enter a name with minimum 5 characters',
           HttpStatus.BAD_REQUEST)
   }
   if (isNull(body.email)) {
       return ReE(res, 'please enter your Email Id', HttpStatus.BAD_REQUEST)
   }
   if (!isEmail(body.email)) {
       return ReE(res, { message: 'Please enter a valid email id' }, 400)
   }
   if (isNull(body.phone)) {
       return ReE(res, { message: 'Please enter a phone number' },
           HttpStatus.BAD_REQUEST)
   }
   if (body.phone.startsWith('+91')) {
       body.countryCode = '+91'
       body.phone = body.phone.replace('+91', '')
   }
   if (!validator.isMobilePhone(body.phone,
       ['en-IN'])) {//checks if only phone number was sent
       return ReE(res, { message: `Invalid phone number ${body.phone}` },
           400)
   }
   let userPhone
   //check phone was already exist or not
   [err, userPhone] = await to(User.findOne({ phone: body.phone }))
   if (err) {
       return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
   }
   if (userPhone) {
       return ReE(res, {
           message: 'Phone was already exists,Please any other phone.',
       }, HttpStatus.BAD_REQUEST)
   }
   let userEmail
   //check email was already exist or not
   [err, userEmail] = await to(User.findOne( { email: body.email }))
   if (err) {
       return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
   }
   if (userEmail) {
       return ReE(res, {
           message: 'Email was already exists,Please any other email Id.',
       }, HttpStatus.BAD_REQUEST)
   }
   let userName
   //check name was already exist or not
   [err, userName] = await to(User.findOne( { name: body.name }))
   if (err) {
       return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
   }
   if (userName) {
       return ReE(res, {
           message: 'name was already taken,Please new one',
       }, HttpStatus.BAD_REQUEST)
   }
   let userUp
   [err, userUp] = await to(User.updateOne({_id:decoded._id},{$set:body}))
   if (err) {
       return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
   }
   if (userUp) {
       return ReS(res, {
           message: 'updated Successfully',
           user: body,
           response:userUp,
       }, HttpStatus.OK)
   }
}

module.exports.getUserData=async(req,res)=>{
    const user=req.user;
    let err,users
    [err,users]=await to(User.find({_id:user._id}));
    if (err) {
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    if(!users){
        return ReE(res, {
            message: 'User not found',
        }, HttpStatus.BAD_REQUEST)
    }

    
    if (users[0].admin===true) {
        return ReS(res, {
            message: 'admin data',
            user: {
                name:user.name,
                phone:user.phone,
                email:user.email,
                admin:user.admin
            }
        }, HttpStatus.OK)
    }else{
        return ReS(res, {
            message: 'user data',
            user: {
                name:user.name,
                phone:user.phone,
                email:user.email
            }
        }, HttpStatus.OK)
    }
}
