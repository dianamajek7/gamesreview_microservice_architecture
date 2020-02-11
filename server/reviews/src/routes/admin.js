'use strict'
/** Koa router providing user related routes
 * @module /api/v1_0/review/admin
 * @requires koa-router */

/**
 * koa router
 * @const */
const Router = require('koa-router')
const constants = require('../constants')
const adminModel = require('../models/admin')
const reviewModel = require('../models/reviews')
const utilVal = require('../validation/helper/utilValidator')
const reviewValidator = require('../validation/reviewValidator')
const router = Router({ prefix: '/admin' })
/**
 * Route serving create review tables in the database.
 * @name post/admin/create_reviews_db
 * @function
 * @memberof module:/api/v1_0/review/admin
 * @inner
 * @param {string} ctx - Koa router path which contains data from the URL
 * @throws {ERROR} Throws error if error on request
 */
router.post('/create_reviews_db', async(ctx) => {
	const item = await adminModel.createTables().then(result => result)
		.catch(err => {
			ctx.throw(err)
		})
	ctx.status = constants.SUCCESS
	ctx.body = item
})
/**
 * Route get all reviews.
 * @name get/admin/getAllReviews
 * @function
 * @memberof module:/api/v1_0/review/admin
 * @inner
 * @param {string} ctx - Koa router path which contains data from the URL
 * @throws {BAD_REQUEST} Throws error if error on request
 */
router.get('/getAllReviews', async(ctx) => {
	await reviewModel.getAllReviews().then(result => {
		console.log(result)
		ctx.status = constants.SUCCESS
		ctx.body = { message: result}
	})
})
/**
 * Route update review flag by review id.
 * @name put/admin/updateReviewFlag/:id
 * @function
 * @memberof module:/api/v1_0/review/admin
 * @inner
 * @param {string} ctx - Koa router path which contains data from the URL
 * @throws {BAD_REQUEST} Throws error if error on request
 */
router.put('/updateReviewFlag/:id', async(ctx) => {
	const reviewId = ctx.params.id
	const flag = ctx.request.body.flag
	const errors = Object.assign(await reviewValidator.validateReviewId(reviewId),
		await reviewValidator.validateFlag(flag))
	if (!utilVal.isEmptyObjectString(errors))
		ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: {errors }})

	if(flag !== 'approved') ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request',
		detail: {flag: 'Flag must be set to approved to be updated'}})
	await checkreviewStatus(reviewId, ctx)
	await reviewModel.updateReviewFlag(flag, reviewId).then(() => {
		console.log('Successfully updated flag')
		ctx.status = constants.SUCCESS
		ctx.body = { message: 'Successfully updated flag'}
	})
})
/**
 * From Route Check review status.
 * @name checkreviewStatus
 * @function
 * @param {number} reviewId - A number param
 * @param {string} ctx - Koa router path which contains data from the URL
 * @throws {BAD_REQUEST} Throws error if error on request
 */
const checkreviewStatus = async(reviewId, ctx) => {
	if (!utilVal.validateIfEmpty(await reviewModel.getPendingReviewsById(reviewId)).valid)
		return ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: 'Review does not exist'})
	const result = await reviewModel.getApprovedReviewById(reviewId)
	if(utilVal.validateIfEmpty(result).valid)
		return ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: 'Review already approved'})
}
/**
 * Route delete review by review id.
 * @name put/admin/deleteReview/:id
 * @function
 * @memberof module:/api/v1_0/review/admin
 * @inner
 * @param {string} ctx - Koa router path which contains data from the URL
 * @throws {BAD_REQUEST} Throws error if error on request
 */
router.delete('/deleteReview/:id', async(ctx) => {
	const reviewId = ctx.params.id
	const errors = await reviewValidator.validateReviewId(reviewId)
	if (!utilVal.isEmptyObjectString(errors))
		ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: {errors }})

	const result = await reviewModel.getPendingReviewsById(reviewId)
	if(utilVal.validateIfEmpty(result).valid) {
		await reviewModel.deleteReview(reviewId).then(() => {
			console.log('Successfully deleted')
			ctx.status = constants.SUCCESS
			ctx.body = { message: 'Successfully deleted'}; return
		})
	} else
		ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: 'Could not find review to delete'})
})

module.exports = router
