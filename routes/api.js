// API
const express = require('express')
const router = express.Router()

const UserController = require('../controllers/User.controller')

const ProductController=require('../controllers/ProductController')
const  CartController=require('../controllers/CartController')
const slickCont = require('../controllers/Slick.controller')
const AddressController=require('../controllers/address')

const passport = require('passport')
const path = require('path')

const jwtAuth = require('../middleware/passport')
const { route } = require('../app')

const authUser = jwtAuth(passport).authenticate('jwt', {session: false})

//user and admin API's

//user registration

router.post('/user/register', UserController.userRegsiter)
router.post('/user/login', UserController.login)
router.put('/user/update', UserController.updateUser)


//product API's

//product API's only for Admin
router.post('/product/create',authUser,ProductController.createProduct)
router.put('/product/update',authUser,ProductController.updateProduct)
router.delete('/product/delete',authUser,ProductController.deleteProduct)

//product API's for both
router.get('/product/get/:id',authUser,ProductController.getProductById)
router.get('/product/getAll',authUser,ProductController.getALLProduct)

//address API's
router.post('/address/create',authUser,AddressController.Create);
router.get('/address/get',authUser,AddressController.find);
router.post('/address/getById',authUser,AddressController.findById);
router.post('/address/drop',authUser,AddressController.delete);

//cart API's

router.post('/cart/create',authUser,CartController.createCart)
router.put('/cart/update',authUser,CartController.updateCart)
router.get('/cart/getALL',authUser,CartController.getAllCart)
router.get('/cart/get/:id',authUser,CartController.getCartByID)
router.delete('/cart/delete',authUser,CartController.deleteCart)


// slick
router.post('/slick/create', slickCont.create)
router.get('/slick/getAll', slickCont.getAllSlick)
router.get('./slick/get', slickCont.getSlick)

module.exports = router
