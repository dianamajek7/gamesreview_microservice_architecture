'use strict'
/** Koa router providing user related routes
 * @module /api/v1_0/comment/like
 * @requires koa-router */
/**
 * koa router
 * @const */
const Router = require('koa-router')
const constants = require('../constants')
const likeModel = require('../models/likes')
const commentModel = require('../models/comments')
const utilVal = require('../validation/helper/utilValidator')
const commentValidator = require('../validation/commentValidator')
const router = Router({})
/**
 * @function
 * @param {Object} errors - An Obejct with errors to dispatch
 * @param {string} ctx - Koa router path which contains data from the URL
 *  @throws {BAD_REQUEST} Throws error if error on request */
const checkError = async(errors, ctx) => {
	if (utilVal.validateIfEmpty(errors).valid)
		ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: {errors }})
}
/**
 * Route save like
 * @name post/saveLike
 * @function
 * @memberof module:/api/v1_0/comment/like
 * @inner
 * @param {string} ctx - Koa router path which contains data from the URL
 *  @throws {BAD_REQUEST} Throws error if error on request */
router.post('/saveLike', async(ctx) => {
	const data = ctx.request.body
	let errors = Object.assign(await commentValidator.validateUserId(data.userId),
		await commentValidator.validateCommentId(data.commentId))
	await checkError(errors, ctx)
	errors = await commentValidator.validateCommentLike(data)
	await checkError(errors, ctx)

	if(data.like !== 'true') ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request',
		detail: {Like: 'Like must be true'}})
	await likeModel.savelike(data).then(() => {
		console.log('Like Successfully added')
		ctx.status = constants.SUCCESS
		ctx.body = { message: 'Like Successfully added'}
	})
})
/**
 * Route get all likes by comment id
 * @name get/getAllLikesBycommentID
 * @function
 * @memberof module:/api/v1_0/comment/like
 * @inner
 * @param {string} ctx - Koa router path which contains data from the URL
 *  @throws {BAD_REQUEST} Throws error if error on request */
router.get('/getAllLikesBycommentID', async(ctx) => {
	const commentId = ctx.request.query.commentId
	const errors = await commentValidator.validateCommentId(commentId)
	if (!utilVal.isEmptyObjectString(errors))
		ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: {errors }})

	const checkcommentExists = await commentModel.getCommentById(commentId)
	if(!utilVal.validateIfEmpty(checkcommentExists).valid)
		ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: 'Comment does not exist with the given Id'})

	await likeModel.getAllLikesBycommentID(commentId).then(result => {
		if(utilVal.validateIfEmpty(result).valid) {
			console.log(result)
			ctx.status = constants.SUCCESS
			ctx.body = { message: result}; return
		}else
			ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: 'Could not get likes with the commentId'})
	})
})
/**
 * Route delete like
 * @name delete/deleteLike
 * @function
 * @memberof module:/api/v1_0/comment/like
 * @inner
 * @param {string} ctx - Koa router path which contains data from the URL
 * @throws {BAD_REQUEST} Throws error if error on request */
router.delete('/deleteLike', async(ctx) => {
	const commentId = ctx.request.query.commentId
	const userId = ctx.request.query.userId
	const errors = Object.assign(await commentValidator.validateCommentId(commentId),
		await commentValidator.validateUserId(userId))
	if (!utilVal.isEmptyObjectString(errors))
		ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: {errors }})

	const checkLikeExists = await likeModel.getLikeByUserAndCommentId(userId, commentId)
	if(utilVal.validateIfEmpty(checkLikeExists).valid) {
		await likeModel.deleteLike(commentId, userId).then(result => {
			console.log(result)
			ctx.status = constants.SUCCESS
			ctx.body = { message: 'Successfully deleted'}
		})
	} else
		ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: 'Could not find like on comment'})
})
module.exports = router
