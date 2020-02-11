'use strict'
const jwt = require('jsonwebtoken')
const constants = require('../constants')
const helper = require('./middlewareHelper')
const blackListModel = require('../models/tokenBlackList')
const secret = process.env.JWT_KEY || '_Strong_@password'

/**
 * Authentication Middleware recieved from URL.
 * Checks the session of the user if expired by looking if token has been blacklisted
 * @async
 * @function AuthenticationMiddlware
 * @memberof module:/
 * @param {string} ctx - Koa router path The router in which contains data from the URL.
 * @param {callback} middleware - Koa middleware.
 * @throws {FORBIDDEN} Throws error if token malformed
 * @next next~awaitNextFunctionInline The function indicator to pass down to the next function inline.
 */
module.exports = async(ctx, next) => {

	if(await helper.validateIfEmpty(ctx.headers.authorization))
		return ctx.throw(constants.FORBIDDEN, { title: 'Forbidden',
			detail: 'No token, Authentication Failed'})

	const token = await splitBearerHeader(ctx)
	try {
		ctx.body = {jwtPayload: jwt.verify(token, secret)}
		ctx.status = constants.SUCCESS
		console.log('Successfully authenticated')
	} catch (err) {
		return ctx.throw(err.status || constants.FORBIDDEN, { title: 'Forbidden',
			detail: 'Token malformed, Authentication Failed'})
	}
	await next()
}

/**
 * Check whether the requst user's token has been blacklisted.
 * @throws {FORBIDDEN} Always returns either a token or throw an error.
 */
const splitBearerHeader = async(ctx) => {
	//split the token from the bearer
	const token = ctx.headers.authorization.replace('Bearer ', '')
	if(!helper.validateIfEmpty(await blackListModel.getTokenBlackListed(token))) ctx.throw(constants.FORBIDDEN,
		{ title: 'Forbidden', detail: 'Token no longer valid, Authentication Failed'})
	return token
}

