'use strict'
const constants = require('../constants')

/**
 * Error Handler Middleware recieved from each routes.
 *
 * @async
 * @function middlware
 * @memberof module:/
 * @param {string} ctx - Koa router path which contains data from the URL The router in with contains data from the URL.
 * @param {callback} middleware - Koa middleware.
 * @next next~awaitNextFunctionInline The function indicator to pass down to the next function inline.
 * @throws {RoutesException} Throws error if recieved from the route in which was last called.
 */
module.exports = async(ctx, next) => {
	try {
		await next()

	} catch (err) {
		console.error(err)
		ctx.status = err.status || constants.INTERNAL_SERVER_ERROR
		ctx.body = {
			title: err.title || 'Internal Server Error',
			status: ctx.status,
			detail: err.detail
		}
	}
}
