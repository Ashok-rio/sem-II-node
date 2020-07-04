//Product controller
const Product = require('../models/Product')
const User = require('../models/User')
const authService = require('../services/auth.service')
const { to, ReE, ReS, isEmpty } = require('../services/util.service')
const CONFIG = require('../config/config')
const { isNull } = require('../services/util.service')
const HttpStatus = require('http-status')

module.exports.createProduct = async (req, res) => {
    const user = req.user;
    const body = req.body;
    let err, findUser

    [err, findUser] = await to(User.find({ _id: user._id, admin: true }))

    if (err) {
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    if (isEmpty(findUser)) {
        return ReE(res, 'Sorry user not a admin', HttpStatus.BAD_REQUEST)
    }

    if (isNull(body.name) || body.name.length < 5) {
        return ReE(res, { message: 'Please enter a product name with minimum 5 characters' },
            HttpStatus.BAD_REQUEST)
    }

    if (isNull(body.size)) {
        return ReE(res, { message: 'please enter your product size' }, HttpStatus.BAD_REQUEST)
    }

    if (isNull(body.price)) {
        return ReE(res, { message: 'please enter your product price' }, HttpStatus.BAD_REQUEST)
    }

    if (isNull(body.url)) {
        return ReE(res, { message: 'please enter your product url' }, HttpStatus.BAD_REQUEST)
    }
    console.log(body);
    

    if (isNull(body.quantity)) {
        return ReE(res, { message: 'please enter your product quantity' }, HttpStatus.BAD_REQUEST)
    }

    let productGet
    [err, productGet] = await to(Product.findOne({ name: body.name }))
    if (err) {
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    if (productGet) {
        return ReE(res, { message: 'Product name was already taken,Please enter any other name' },
            HttpStatus.BAD_REQUEST)
    }

    let product = Product({
        name: body.name,
        url:body.url,
        size: body.size,
        quantity:Number(body.quantity),
        price: Number(body.price),
        color: body.color
    })

    let createPro
    [err, createPro] = await to(product.save())
    if (err) {
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    if (createPro) {
        return ReS(res, {
            message: 'Product created Successfully',
            product: createPro,
        }, HttpStatus.OK)
    }

}

module.exports.updateProduct = async (req, res) => {
    const user = req.user;
    const body = req.body;
    let err, findUser


    [err, findUser] = await to(User.find({ _id: user._id, admin: true }))

    if (err) {
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    if (isEmpty(findUser)) {
        return ReE(res, 'Sorry user not a admin', HttpStatus.BAD_REQUEST)
    }

    if (isNull(body.id)) {
        return ReE(res, { message: 'Product Id was must to update your product' }, HttpStatus.BAD_REQUEST)
    }

    let productFind;

    [err, productFind] = await to(Product.findOne({ _id: body.id }))
    if (err) {
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    if (!productFind) {
        return ReE(res, { message: 'Cannot find your product', error: err }, HttpStatus.BAD_REQUEST)
    }
    let updateData = {
        name: productFind.name,
        quantity: productFind.quantity,
        size: productFind.size,
        price: productFind.price,
        color: productFind.color,
        url:productFind.url
    }
    if (body.name) {
        if (isNull(body.name) || body.name.length < 5) {
            return ReE(res, { message: 'Please enter a product name with minimum 5 characters' },
                HttpStatus.BAD_REQUEST)
        }
        let productGet
        [err, productGet] = await to(Product.findOne({ name: body.name }))
        if (err) {
            return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
        if (productGet) {
            if (productGet._id != body.id) {
                return ReE(res, { message: 'Product name was already taken,Please enter any other name' },
                    HttpStatus.BAD_REQUEST)
            }
        }
        updateData.name = body.name
    }

    if (body.price) {
        if (isNull(body.price)) {
            return ReE(res, { message: 'If you want to update price, Please enter your product price' }, HttpStatus.BAD_REQUEST)
        }
        updateData.price = body.price
    }
    if (body.quantity) {
        if (isNull(body.quantity)) {
            return ReE(res, { message: 'If you want to update quantity, Please enter your product quantity' }, HttpStatus.BAD_REQUEST)
        }
        updateData.quantity = body.quantity
    }

    if (body.size) {
        if (isNull(body.size)) {
            return ReE(res, { message: 'If you want to update size, Please enter your product size' }, HttpStatus.BAD_REQUEST)
        }
        updateData.size = body.size
    }

    if (body.color) {
        if (isNull(body.color)) {
            return ReE(res, { message: 'If you want to update color, Please enter your product color' }, HttpStatus.BAD_REQUEST)
        }
        updateData.color = body.color
    }
    if (body.url) {
        if (isNull(body.color)) {
            return ReE(res, { message: 'If you want to update url, Please enter your product url' }, HttpStatus.BAD_REQUEST)
        }
        updateData.url = body.url
    }



    if (isNull(updateData)) {
        return ReE(res, { message: "Please enter the fill all input container" }, HttpStatus.BAD_REQUEST)
    }
    let updatePro

    [err, updatePro] = await to(Product.updateOne({ _id: body.id }, { $set: updateData }))

    if (err) {
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    if (productFind) {
        return ReS(res, {
            message: 'Product created Successfully',
            product: {
                status: updatePro
            }
        }, HttpStatus.OK)
    }
}

module.exports.getProductById = async (req, res) => {
    
    const id = req.params.id

    if (isNull(id)) {
        return ReE(res, { message: 'Product Id was must to update your product' }, HttpStatus.BAD_REQUEST)
    }

    let productFind;

    [err, productFind] = await to(Product.findOne({ _id: id }))
    if (err) {
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    if (isEmpty(productFind)) {
        return ReS(res, {
            message: 'No products are there',
        }, HttpStatus.OK)
    }
    if (productFind) {
        return ReS(res, {
            message: 'Product was fetch Successfully ',
            product: productFind,
        }, HttpStatus.OK)
    }
    else {
        return ReE(res, {
            message: 'Cannot your product'
        }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

module.exports.getALLProduct = async (req, res) => {

    let productFind;

    [err, productFind] = await to(Product.find({}))
    if (err) {
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    if (isEmpty(productFind)) {
        return ReS(res, {
            message: 'No products are there',
        }, HttpStatus.OK)
    }

    if (productFind) {
        return ReS(res, {
            message: 'Product was fetch Successfully ',
            products: productFind,
        }, HttpStatus.OK)
    } else {
        return ReE(res, {
            message: 'Cannot your product'
        }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

module.exports.deleteProduct = async (req, res) => {
    const user = req.user;
    const body = req.body;
    let err, findUser


    [err, findUser] = await to(User.find({ _id: user._id, admin: true }))

    if (err) {
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    if (isEmpty(findUser)) {
        return ReE(res, 'Sorry user not a admin', HttpStatus.BAD_REQUEST)
    }

    if (isNull(body.id)) {
        return ReE(res, { message: 'Product Id was must to update your product' }, HttpStatus.BAD_REQUEST)
    }
    let productFind
    [err, productFind] = await to(Product.findOne({ _id: body.id }))
    if (err) {
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    if (!productFind) {
        return ReE(res, { message: 'Cannot find your product', error: err }, HttpStatus.BAD_REQUEST)
    }
    let deletePro
    [err, deletePro] = await to(Product.deleteOne({ _id: body.id }))
    if (err) {
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    if (deletePro) {
        return ReS(res, {
            message: 'Product deleted Successfully',
            product: productFind
        }, HttpStatus.OK)
    }

}