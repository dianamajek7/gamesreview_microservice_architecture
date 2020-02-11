'use strict'
/** Koa user main router provides routing for related routes
 * @module /api/v1_0/user
 * @requires koa-router
 * @requires admin */
/**
 * koa router
 * @const */
const Router = require('koa-router')
const admin = require('./admin')
const constants = require('../constants')
const userModel = require('../models/user')
const adminModel = require('../models/admin')
const generateAuth = require('./helper/generateAuth')
const encrypt = require('./helper/encrypt')
const validateLoginInput = require('../validation/loginValidator')
const signupHelper = require('./helper/signupHelper')
const utilVal = require('../validation/helper/utilValidator')
const controller = require('../controllers/userController')
const router = Router({ prefix: '/api/v1.0/user'})
router.use(admin.routes())
router.use(admin.allowedMethods())
/**
 * Route servng user login
 * @name post/login
 * @function
 * @memberof module:/api/v1_0/user
 * @inner
 * @param {string} ctx - Koa router path which contains data from the URL
 * @throws {BAD_REQUEST} Throws error if error on request */
router.post('/login', async(ctx) => {
	const errors = await validateLoginInput(ctx.request.body)
	if (!utilVal.isEmptyObjectString(errors))
		ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: errors })
	const { username, password } = ctx.request.body
	const dbUser = await userModel.getUserLoginCred(username)
	const dbAdmin = await adminModel.getAdminLoginCred(username)
	await controller.checkForErrorsOnLogin(dbUser, dbAdmin, ctx)
	if(utilVal.validateIfEmpty(dbUser).valid) {
		const token = await generateAuth(username, password, dbUser)
		ctx.body = { success: true, token: `Bearer ${token}`}; return
	}else {
		const token = await generateAuth(username, password, dbAdmin)
		ctx.body = { success: true, token: `Bearer ${token}` }; return
	}
})
/**
 * Route servng user signup
 * @name post/signup
 * @function
 * @memberof module:/api/v1_0/user
 * @inner
 * @param {string} ctx - Koa router path which contains data from the URL
 * @throws {BAD_REQUEST} Throws error if error on request */
router.post('/signup', async(ctx) => {
	const result = ctx.request.body
	const existingUser = await signupHelper.checkForErrorsOnSignUp(result, ctx)
	const usernameDeleted = existingUser.usernameDeleted
	const emailDeleted = existingUser.emailDeleted
	Object.assign(result, await encrypt(result))
	if(!usernameDeleted && !emailDeleted) await controller.newUser(result, ctx)
	else await controller.deletedUser(result, emailDeleted, usernameDeleted, ctx)
})
/**
 * Route get all user data by id.
 * @name get/getAllUserDataById
 * @function
 * @memberof module:/api/v1_0/user
 * @inner
 * @param {string} ctx - Koa router path which contains data from the URL
 * @throws {BAD_REQUEST} Throws error if error on request */
router.get('/getAllUserDataById', async(ctx) => {
	const userId = ctx.request.query.Id
	if (!utilVal.validateIfEmpty(userId).valid)
		ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: {errors: {Id: 'User Id Required'} }})
	await userModel.getAllUserDataById(userId).then( async result => {
		if(utilVal.validateIfEmpty(result).valid) {
			console.log(result)
			ctx.status = constants.SUCCESS
			ctx.body = { message: result}; return
		} else
			ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request',
				detail: 'Could not get user credentials with the userId'})
	})
})
/**
 * Route log user out.
 * @name post/logout
 * @function
 * @memberof module:/api/v1_0/user
 * @inner
 * @param {string} ctx - Koa router path which contains data from the URL
 * @throws {BAD_REQUEST} Throws error if error on request */
router.post('/logout', async(ctx) => {
	if(utilVal.isEmpty(ctx.headers.authorization)) ctx.throw(constants.FORBIDDEN, { title: 'Forbidden',
		detail: 'Token missing'})
	//split the token from the bearer
	const token = ctx.headers.authorization.replace('Bearer ', '')
	await userModel.getBlackListToken(token).then( async result => {
		if(!utilVal.validateIfEmpty(result).valid) {
			await userModel.blackListToken(token)
			console.log('Successfully logged out')
			ctx.status = constants.SUCCESS
			ctx.body = { message: 'Successfully logged out'}
		} else
			ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request',
				detail: 'User already logged out'})
	})
})
module.exports = router
