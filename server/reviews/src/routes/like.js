'use strict'
/** Koa router providing user related routes
 * @module /api/v1_0/review/like
 * @requires koa-router */
/**
 * koa router
 * @const */
const Router = require('koa-router')
const constants = require('../constants')
const likeModel = require('../models/likes')
const reviewModel = require('../models/reviews')
const utilVal = require('../validation/helper/utilValidator')
const reviewValidator = require('../validation/reviewValidator')
const router = Router({})
/**
 * @function
 * @param {Object} errors - An Obejct with errors to dispatch
 * @param {string} ctx - Koa router path which contains data from the URL
 * @throws {BAD_REQUEST} Throws error if error on request
 */
const checkError = async(errors, ctx) => {
	if (utilVal.validateIfEmpty(errors).valid)
		ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: {errors }})
}
/**
 * Route save like.
 * @name post/saveLike
 * @function
 * @memberof module:/api/v1_0/review/like
 * @inner
 * @param {string} ctx - Koa router path which contains data from the URL
 * @throws {BAD_REQUEST} Throws error if error on request */
router.post('/saveLike', async(ctx) => {
	const data = ctx.request.body
	let errors = Object.assign(await reviewValidator.validateUserId(data.userId),
		await reviewValidator.validateReviewId(data.reviewId))
	await checkError(errors, ctx)
	errors = await reviewValidator.validateReviewLike(data)
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
 * Route get all likes by review id.
 * @name get/getAllLikesByReviewId
 * @function
 * @memberof module:/api/v1_0/review/like
 * @inner
 * @param {string} ctx - Koa router path which contains data from the URL
 * @throws {BAD_REQUEST} Throws error if error on request */
router.get('/getAllLikesByReviewId', async(ctx) => {
	const reviewId = ctx.request.query.reviewId
	const errors = await reviewValidator.validateReviewId(reviewId)
	if (!utilVal.isEmptyObjectString(errors))
		ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: {errors }})
	const checkreviewExists = await reviewModel.getPendingReviewsById(reviewId)
	if(!utilVal.validateIfEmpty(checkreviewExists).valid)
		ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: 'Review does not exist with the given Id'})
	await likeModel.getAllLikesByReviewID(reviewId).then(result => {
		if(utilVal.validateIfEmpty(result).valid) {
			console.log(result)
			ctx.status = constants.SUCCESS
			ctx.body = { message: result}; return
		}else
			ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: 'Could not get likes with the reviewId'})
	})
})
/**
 * Route delete like.
 * @name delete/deleteLike
 * @function
 * @memberof module:/api/v1_0/review/like
 * @inner
 * @param {string} ctx - Koa router path which contains data from the URL
 * @throws {BAD_REQUEST} Throws error if error on request */
router.delete('/deleteLike', async(ctx) => {
	const reviewId = ctx.request.query.reviewId
	const userId = ctx.request.query.userId
	const errors = Object.assign(await reviewValidator.validateReviewId(reviewId),
		await reviewValidator.validateUserId(userId))
	if (!utilVal.isEmptyObjectString(errors))
		ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: {errors }})
	const checkLikeExists = await likeModel.getLikeByUserAndReviewId(userId, reviewId)
	if(utilVal.validateIfEmpty(checkLikeExists).valid) {
		await likeModel.deleteLike(reviewId, userId).then(() => {
			console.log('Successfully deleted')
			ctx.status = constants.SUCCESS
			ctx.body = { message: 'Successfully deleted'}
		})
	} else
		ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: 'Could not find like to delete'})
})
module.exports = router
