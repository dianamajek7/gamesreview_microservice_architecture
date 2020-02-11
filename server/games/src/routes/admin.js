'use strict'
/** Koa router providing user related routes
 * @module /api/v1_0/game/admin
 * @requires koa-router */

/**
 * koa router
 * @const */
const Router = require('koa-router')
const adminModel = require('../models/admin')
const constants = require('../constants')
const router = Router({ prefix: '/admin' })
/**
 * Route serving create game tables in the database.
 * @name post/admin/create_games_db
 * @function
 * @memberof module:/api/v1_0/game/admin
 * @inner
 * @param {string} ctx - Koa router path which contains data from the URL
 * @throws {ERROR} Throws error if error on request will be recieved on error handler middleware
 */
router.post('/create_games_db', async(ctx) => {
	const item = await adminModel.createTables().then(result => result)
		.catch(err => {
			ctx.throw(err)
		})
	ctx.status = constants.SUCCESS
	ctx.body = item
})
module.exports = router
