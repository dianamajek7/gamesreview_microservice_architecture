/** * @author Rukiyat Majekodunmi <majekodr@uni.coventry.ac.uk> */
/**
 * Main Authentication Routing Entry point, receives request and sends reponse to each route
 * depending on the request path.
 * @module /
 * @requires koa
 * @requires errorHandler
 * @requires authenticate
 * @return {Router} Returns camel context back to the requester if recieved a request.
 * @return {error} Returns error if requested url is unknown after routing to each routes
 */
'use strict'
require('dotenv').config()
const Koa = require('koa')
const json = require('koa-json')
const Router = require('koa-router')
const cors = require('@koa/cors')
const constants = require('./src/constants')
Router({ prefix: '/authenticate' })
const errorHandler = require('./src/middleware/errorHandler')
const authenticate = require('./src/middleware/auth')

const app = new Koa()
app.use(json())

app.use(errorHandler)
/**
 * Cors Enables server to serve requests from different domain
 * @const*/
app.use(cors())
app.use(authenticate)

console.log('..................................................')
const PORT = process.env.PORT || constants.DEFAULT_PORT
module.exports = !process.env.NODE_ENV !== 'test' ?
	 app.listen(PORT, async() => console.log(`listening on port ${PORT}`))
	 : app.listen()
