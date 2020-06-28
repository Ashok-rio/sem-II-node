require('dotenv').config()//instatiate environment variables

let CONFIG = {} //Make this global to use all over the application

CONFIG.app = process.env.APP || 'development'
CONFIG.port = process.env.PORT || '3000'
CONFIG.db_uri = process.env.MONGODB_URI || 'mongodb://user:password@mlab.com:27017/exampledb'
CONFIG.jwt_encryption = process.env.JWT_ENCRYPTION || 'jwt_please_change'
CONFIG.jwt_expiration = process.env.JWT_EXPIRATION || '10000'

module.exports = CONFIG