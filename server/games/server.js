/** * @author Rukiyat Majekodunmi <majekodr@uni.coventry.ac.uk> */
/**
 * Main Games Routing Entry point, receives request and sends reponse to each route depending on the request path.
 * @module /
 * @requires koa
 * @requires errorHandler
 * @requires game
 * @return {Router} Returns camel context back to the requester if recieved a request.
 * @return {error} Returns error if requested url is unknown after routing to each routes
 */
'use strict'
require('dotenv').config()
const Koa = require('koa')
const json = require('koa-json')
const bodyParser = require('koa-bodyparser')
const cors = require('@koa/cors')
const constants = require('./src/constants')

const errorHandler = require('./src/middleware/errorHandler')
const game = require('./src/routes/game')

const app = new Koa()
app.use(json())
app.use(bodyParser())

app.use(errorHandler)
/**
 * Cors Enables server to serve requests from different domain
 * @const*/
app.use(cors())

app.use(game.routes())
app.use(game.allowedMethods())

/**
 * Catches any uknown url path not known to the the main routes in use.
 *
 * @async
 * @function middlware
 * @param {string} ctx - Koa router path which contains data from the URL The router in with contains data from the URL.
 * @throws {NOT_FOUND} Throws error if recieved from the route in which was last called.
 */
app.use(async(ctx) => {
	ctx.throw(constants.NOT_FOUND, {
		title: 'Not Found',
		detail: 'Not Available'
	})
})

console.log('..................................................')
const PORT = process.env.PORT || constants.DEFAULT_PORT
module.exports = process.env.NODE_ENV !== 'test' ?
	 app.listen(PORT, async() => console.log(`listening on port ${PORT}`)) : app.listen()
