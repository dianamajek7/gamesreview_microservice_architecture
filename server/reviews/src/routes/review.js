'use strict'
/** Koa review main router provides routing for related routes
 * @module /api/v1_0/review
 * @requires koa-router */

/**
 * koa router
 * @const */
const Router = require('koa-router')
const admin = require('./admin')
const like = require('./like')
const constants = require('../constants')
const reviewModel = require('../models/reviews')
const utilVal = require('../validation/helper/utilValidator')
const reviewValidator = require('../validation/reviewValidator')
const router = Router({ prefix: '/api/v1.0/review' })

router.use(admin.routes())
router.use(admin.allowedMethods())
router.use(like.routes())
router.use(like.allowedMethods())
/**
 * Route save review.
 * @name post/saveReview
 * @function
 * @memberof module:/api/v1_0/review
 * @inner
 * @param {string} ctx - Koa router path which contains data from the URL
 * @throws {BAD_REQUEST} Throws error if error on request */
router.post('/saveReview', async(ctx) => {
	const result = ctx.request.body
	const errors = await reviewValidator.validateReviewInput(result)
	if (!utilVal.isEmptyObjectString(errors))
		ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: {errors }})

	await reviewModel.savereview(result).then(() => {
		console.log('Review Successfully added')
		ctx.status = constants.SUCCESS
		ctx.body = { message: 'Review Successfully added'}
	})
})
/**
 * Route get all reviews by game id.
 * @name get/getAllReviewsByGameId
 * @function
 * @memberof module:/api/v1_0/review
 * @inner
 * @param {string} ctx - Koa router path which contains data from the URL
 * @throws {BAD_REQUEST} Throws error if error on request */
router.get('/getAllReviewsByGameId', async(ctx) => {
	const gameId = ctx.request.query.gameId
	const errors = await reviewValidator.validateGameId(gameId)
	if (!utilVal.isEmptyObjectString(errors))
		ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: {errors }})
	await reviewModel.getAllReviewsByGameID(gameId).then( async result => {
		if(utilVal.validateIfEmpty(result).valid) {
			console.log(result)
			ctx.status = constants.SUCCESS
			ctx.body = { message: result}; return
		} else {
			const checkRecievePending = await reviewModel.getPendingReviewsByGameID(gameId)
			if(utilVal.validateIfEmpty(checkRecievePending).valid)
				ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request',
					detail: 'Review on gameId pending approval from admin'})
			ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: 'Could not get reviews with the gameId'})
		}
	})
})

module.exports = router
