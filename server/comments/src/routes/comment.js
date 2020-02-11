'use strict'
/** Koa comment main router provides routing for related routes
 * @module /api/v1_0/comment
 * @requires koa-router
 * @requires admin
 * @requires like */
/**
 * koa router
 * @const*/
const Router = require('koa-router')
const like = require('./like')
const admin = require('./admin')
const constants = require('../constants')
const commentModel = require('../models/comments')
const utilVal = require('../validation/helper/utilValidator')
const commentValidator = require('../validation/commentValidator')
const router = Router({ prefix: '/api/v1.0/comment' })
router.use(admin.routes())
router.use(admin.allowedMethods())
router.use(like.routes())
router.use(like.allowedMethods())
/**
 * Route save comment
 * @name post/saveComment
 * @function
 * @memberof module:/api/v1_0/comment
 * @inner
 * @param {string} ctx - Koa router path which contains data from the URL
 * @throws {BAD_REQUEST} Throws error if error on request
 */
router.post('/saveComment', async(ctx) => {
	const result = ctx.request.body
	console.log(result)
	const errors = await commentValidator.validateCommentInput(result)
	if (!utilVal.isEmptyObjectString(errors))
		ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: {errors }})

	await commentModel.savecomment(result).then(() => {
		console.log('Comment Successfully added')
		ctx.status = constants.SUCCESS
		ctx.body = { message: 'Comment Successfully added'}
	})
})
/**
 * Route get comments by the user and review id
 * @name get/getCommentsByUserAndReviewId
 * @function
 * @memberof module:/api/v1_0/comment
 * @inner
 * @param {string} ctx - Koa router path which contains data from the URL
 * @throws {BAD_REQUEST} Throws error if error on request
 */
router.get('/getCommentsByUserAndReviewId', async(ctx) => {
	const userId = ctx.request.query.userId
	const reviewId = ctx.request.query.reviewId
	const errors = Object.assign(await commentValidator.validateUserId(userId),
		await commentValidator.validateReviewId(reviewId))
	if (!utilVal.isEmptyObjectString(errors))
		ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: {errors }})
	await commentModel.getCommentByUserAndReviewId(userId, reviewId).then( async result => {
		if(utilVal.validateIfEmpty(result).valid) {
			console.log(result)
			ctx.status = constants.SUCCESS
			ctx.body = { message: result}; return
		} else
			ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: 'Could not find user comments on review'})
	})
})
/**
 * Route get all comments by review id
 * @name get/getAllCommentsByReviewID
 * @function
 * @memberof module:/api/v1_0/comment
 * @inner
 * @param {string} ctx - Koa router path which contains data from the URL
 * @throws {BAD_REQUEST} Throws error if error on request
 */
router.get('/getAllCommentsByReviewID', async(ctx) => {
	const reviewId = ctx.request.query.reviewId
	const errors = await commentValidator.validateReviewId(reviewId)
	if (!utilVal.isEmptyObjectString(errors))
		ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: {errors }})
	await commentModel.getAllCommentsByReviewID(reviewId).then( async result => {
		if(utilVal.validateIfEmpty(result).valid) {
			console.log(result)
			ctx.status = constants.SUCCESS
			ctx.body = { message: result}; return
		} else
			ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: 'Could not find comments on review'})
	})
})
/**
 * Route update comment by user and review id
 * @name put/updateCommentByUserAndReviewId
 * @function
 * @memberof module:/api/v1_0/comment
 * @inner
 * @param {string} ctx - Koa router path which contains data from the URL
 * @throws {BAD_REQUEST} Throws error if error on request
 */
router.put('/updateCommentByUserAndReviewId', async(ctx) => {
	const data = ctx.request.body
	const errors = Object.assign(await commentValidator.validateData(data),
		await commentValidator.validateUserId(data.userId), await commentValidator.validateReviewId(data.reviewId))
	if (!utilVal.isEmptyObjectString(errors))
		ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: {errors }})

	const res = await commentModel.getCommentByUserAndReviewId(data.userId, data.reviewId)
	if(!utilVal.validateIfEmpty(res).valid)
		ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: 'Comment not found'})
	await commentModel.updateCommentByUserAndReviewId(data).then(() => {
		console.log('Successfully updated comment')
		ctx.status = constants.SUCCESS
		ctx.body = { message: 'Successfully updated comment'}
	})
})
/**
 * Route delete user comment
 * @name delete/deleteComment
 * @function
 * @memberof module:/api/v1_0/comment
 * @inner
 * @param {string} ctx - Koa router path which contains data from the URL
 * @throws {BAD_REQUEST} Throws error if error on request
 */
router.delete('/deleteComment', async(ctx) => {
	const reviewId = ctx.request.query.reviewId
	const userId = ctx.request.query.userId
	const errors = Object.assign(await commentValidator.validateUserId(userId),
		await commentValidator.validateReviewId(reviewId))
	if (!utilVal.isEmptyObjectString(errors))
		ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: {errors }})

	const checkCommentExists = await commentModel.getCommentByUserAndReviewId(userId, reviewId)
	if(utilVal.validateIfEmpty(checkCommentExists).valid) {
		await commentModel.deleteComment(userId, reviewId).then(() => {
			console.log('Successfully deleted')
			ctx.status = constants.SUCCESS
			ctx.body = { message: 'Successfully deleted'}
		})
	} else
		ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: 'Could not find comment to delete'})
})

module.exports = router
