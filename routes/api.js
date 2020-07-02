// API
const express = require('express')
const router = express.Router()

const UserController = require('../controllers/User.controller')
const slickCont = require('../controllers/Slick.controller')
const passport = require('passport')
const path = require('path')

const jwtAuth = require('../middleware/passport')

const authUser = jwtAuth(passport).authenticate('jwt', {session: false})

//user API's

//user registration

router.post('/user/register', UserController.userRegsiter)
router.post('/user/login', UserController.login)

// slick
router.post('/slick/create', slickCont.create)
router.get('/slick/getAll', slickCont.getAllSlick)
router.get('./slick/get', slickCont.getSlick)
module.exports = router
