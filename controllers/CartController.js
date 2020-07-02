//Cart controller
const Product = require('../models/Product')
const Cart = require('../models/Cart')
const User = require('../models/User')
const authService = require('../services/auth.service')
const { to, ReE, ReS, isEmpty } = require('../services/util.service')
const CONFIG = require('../config/config')
const { isNull } = require('../services/util.service')
const HttpStatus = require('http-status')

module.exports.createCart = async (req, res) => {
    const user = req.user;
    const body = req.body;
    let err, findProduct;

    if (isNull(body.id)) {
        return ReE(res, { message: 'Product Id was must to add your product into cart' }, HttpStatus.BAD_REQUEST)
    }

    if (isNull(body.quantity)) {
        return ReE(res, { message: 'Product quantity was must to add your product into cart' }, HttpStatus.BAD_REQUEST)
    }
    let carts = body.quantity;

    [err, findProduct] = await to(Product.findOne({ _id: body.id }))
    if (err) {
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    if (!findProduct) {
        return ReE(res, {
            message: 'Cannot find your product'
        }, HttpStatus.BAD_REQUEST)
    }
    if (findProduct.quantity < body.quantity) {
        return ReE(res, {
            message: `Sorry we have only ${findProduct.quantity} product`
        }, HttpStatus.BAD_REQUEST)
    }
    let cartFind
    [err, cartFind] = await to(Cart.find({ product: body.id, user: user._id }))

    if (err) {
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    var cart = Cart({
        product: findProduct.id,
        productName:findProduct.name,
        price:findProduct.price,
        url:findProduct.url,
        user: user._id,
        quantity: body.quantity
    })
    if (isEmpty(cartFind)) {
        let createCart;
        [err, createCart] = await to(cart.save());
        if (err) {
            return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
        if (!createCart) {
            return ReE(res, {
                message: 'Cannot add your product into cart'
            }, HttpStatus.BAD_REQUEST)
        }
        if (createCart) {
            let product, qty
            qty = findProduct.quantity - carts;
            [err, product] = await to(Product.updateOne({ _id: body.id }, { $set: { quantity: qty } }))
            if (err) {
                return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
            }
            if (product) {
                return ReS(res, {
                    message: 'Successfully added your product into cart ',
                    cart: createCart,
                }, HttpStatus.OK)
            }
            else {
                return ReE(res, {
                    message: 'Cannot add your product into cart'
                }, HttpStatus.BAD_REQUEST)
            }

        }
    }
    if (cartFind) {
        let updateCart
        let qtys = cartFind.quantity + carts;
        [err, updateCart] = await to(Cart.updateOne({ id: cartFind._id }, { $set: { quantity: qtys } }))
        if (err) {
            return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
        }

        if (updateCart) {
            [err, cartFind] = await to(Cart.findOne({ id: cartFind._id }))
            if (err) {
                return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
            }
            if (cartFind) {
                let product, qts
                qts = findProduct.quantity - carts;
                [err, product] = await to(Product.updateOne({ _id: body.id }, { $set: { quantity: qts } }))
                if (err) {
                    return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
                }
                return ReS(res, {
                    message: 'Already this product added in your cart so increase your cart count',
                    cart: cartFind,
                }, HttpStatus.OK)
            }
        }
    }


}

module.exports.updateCart = async (req, res) => {
    const user = req.user;
    const body = req.body;
    let err, findProduct;
    let cartProduct, qty;

    if (isNull(body.id)) {
        return ReE(res, { message: 'Cart Id was must to update your cart product' }, HttpStatus.BAD_REQUEST)
    }

    if (isNull(body.quantity)) {
        return ReE(res, { message: 'Product quantity was must to add your cart product' }, HttpStatus.BAD_REQUEST)
    }
    let carts = body.quantity;

    [err, cartProduct] = await to(Cart.findOne({ _id: body.id, user: user._id }))
    if (err) {
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    if (!cartProduct) {
        return ReE(res, {
            message: 'Cannot find your product may be its not your cart'
        }, HttpStatus.BAD_REQUEST)
    }
    console.log(cartProduct);

    [err, findProduct] = await to(Product.findOne({ _id: cartProduct.product }))
    if (err) {
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    if (findProduct.quantity < body.quantity) {
        return ReE(res, {
            message: `Sorry we have only ${findProduct.quantity} product so you cannot added quantity`
        }, HttpStatus.BAD_REQUEST)
    }
    if (cartProduct.quantity > carts) {
        qty = await ((cartProduct.quantity - carts) + findProduct.quantity);
    }
    else if (cartProduct.quantity < carts) {
        qty = await ((findProduct.quantity + cartProduct.quantity) - carts);
    }


    let updateCart;

    [err, updateCart] = await to(Cart.updateOne({ _id: body.id, user: user._id }, { $set: { quantity: carts } }))
    if (err) {
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    if (!updateCart) {
        return ReE(res, {
            message: 'Cannot update your product quantity'
        }, HttpStatus.BAD_REQUEST)
    }
    if (updateCart) {
        let product;
        [err, product] = await to(Product.updateOne({ _id: updateCart.product }, { $set: { quantity: qty } }))
        if (err) {
            return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
        if (product) {
            return ReS(res, {
                message: 'Successfully updated your product quantity ',
                cart: updateCart,
            }, HttpStatus.OK)
        }
        else {
            return ReE(res, {
                message: 'Cannot find the product'
            }, HttpStatus.BAD_REQUEST)
        }

    }

}
module.exports.getCartByID = async (req, res) => {
    const user = req.user;
    let err, findProduct;
    const id = req.params.id;

    if (isNull(id)) {
        return ReE(res, { message: 'Cart Id was must to find your cart product' }, HttpStatus.BAD_REQUEST)
    }

    [err, findProduct] = await to(Cart.find({ _id: id, user: user._id }))
    if (err) {
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    if (!findProduct) {
        return ReE(res, {
            message: 'Cannot your find product may be its not your cart'
        }, HttpStatus.BAD_REQUEST)
    }
    if (findProduct) {
        return ReS(res, {
            message: 'Successfully fetch your cart ',
            cart: findProduct,
        }, HttpStatus.OK)
    }
    if (isEmpty(findProduct)) {
        return ReS(res, {
            message: "You don't have any product in your cart"
        }, HttpStatus.OK)
    }
}


module.exports.getAllCart = async (req, res) => {
    const user = req.user;
    let err, findProduct;

    [err, findProduct] = await to(Cart.find({ user: user._id }).populate('product'));
    if (err) {
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    if (!findProduct) {
        return ReE(res, {
            message: 'Cannot your find product may be its not your cart'
        }, HttpStatus.BAD_REQUEST)
    }
    if (findProduct) {
        return ReS(res, {
            message: 'Successfully fetch your cart ',
            carts: findProduct,
        }, HttpStatus.OK)
    }
    if (isEmpty(findProduct)) {
        return ReS(res, {
            message: "You don't have any product in your cart"
        }, HttpStatus.OK)
    }
}

module.exports.deleteCart = async (req, res) => {
    const user = req.user;
    let err, findProduct ,findpro;
    const body = req.body;

    if (isNull(body.id)) {
        return ReE(res, { message: 'Cart Id was must to delete your cart product' }, HttpStatus.BAD_REQUEST)
    }

    [err, findProduct] = await to(Cart.findOne({ _id: body.id, user: user._id }))
    if (err) {
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    if (!findProduct) {
        return ReE(res, {
            message: 'Cannot your find product may be its not your cart'
        }, HttpStatus.BAD_REQUEST)
    }
    [err, findpro] = await to(Product.findOne({ _id: findProduct.product }))
    if (err) {
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    if (!findpro) {
        return ReE(res, { message: 'Cannot your find product ' }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    let delCart
    [err, delCart] = await to(Cart.deleteOne({ _id: body.id, user: user._id }))
    if (err) {
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    if (!delCart) {
        return ReE(res, {
            message: 'Cannot your delete product'
        }, HttpStatus.BAD_REQUEST)
    }
    if (delCart) {
        let product;
        let qty = findpro.quantity + findProduct.quantity;
        [err, product] = await to(Product.updateOne({ _id: findpro._id }, { $set: { quantity: qty } }))
        if (err) {
            return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
        return ReS(res, {
            message: 'Cart deleted Successfully ',
            carts: findProduct,
        }, HttpStatus.OK)
    }
}