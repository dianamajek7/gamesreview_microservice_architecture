'use strict'
const userModel = require('../models/user')
const constants = require('../constants')
const utilVal = require('../validation/helper/utilValidator')
const newUser = async(result, ctx) => {
	result.userId = await userModel.registerUser(result)
	await userModel.savePasswordReminder(result).then(() => {
		console.log('User Created Successfully')
		ctx.status = constants.SUCCESS
		ctx.body = { message: 'User Created Successfully'}
	})
}

const deletedUser = async(result, emailDeleted, usernameDeleted, ctx) => {
	result.userId = await userModel.updateDeletedUser(result, emailDeleted, usernameDeleted)
	await userModel.updatePasswordReminder(result).then(() => {
		console.log('User Created Successfully')
		ctx.status = constants.SUCCESS
		ctx.body = { message: 'User Created Successfully'}
	})
}

const checkForErrorsOnLogin = async(dbUser, dbAdmin, ctx) => {
	if(!utilVal.validateIfEmpty(dbAdmin).valid) {
		if(!utilVal.validateIfEmpty(dbUser).valid) return ctx.throw(constants.UNAUTHORIZED, { title: 'Unauthorized',
		 	detail: 'Authentication failed, Unkown User'})
		if(dbUser.Deleted)
			return ctx.throw(constants.UNAUTHORIZED, { title: 'Unauthorized', detail: 'Authentication failed'})
		return await checkdbUser(ctx, dbUser)
	}
}

const checkdbUser = (ctx, dbUser) => {
	if(!dbUser.Active)
		return ctx.throw(constants.UNAUTHORIZED, { title: 'Unauthorized', detail: 'Account Deactive'})
}
module.exports = {newUser, deletedUser, checkForErrorsOnLogin}
