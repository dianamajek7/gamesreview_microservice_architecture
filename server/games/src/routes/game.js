'use strict'
/** Koa game main router provides routing for related routes
 * @module /api/v1_0/game
 * @requires koa-router
 * @requires admin
 */
/**
 * koa router
 * @const*/
const Router = require('koa-router'); const admin = require('./admin')
const constants = require('../constants'); const categoryModel = require('../models/categories')
const gameModel = require('../models/game'); const utilVal = require('../validation/helper/utilValidator')
const gameValidator = require('../validation/gameValidator')
const rateModel = require('../models/rates'); const gameHelper = require('./helper/gameHelper')
const router = Router({ prefix: '/api/v1.0/game' })
router.use(admin.routes())
router.use(admin.allowedMethods())
/**
 * Route save game.
 * @name post/savegame
 * @function
 * @memberof module:/api/v1_0/game
 * @inner
 * @param {string} ctx - Koa router path which contains data from the URL
 * @throws {BAD_REQUEST} Throws error if error on request
 */
router.post('/savegame', async(ctx) => {
	const result = ctx.request.body
	const errors = await gameValidator.validateGameInput(result)
	if (!utilVal.isEmptyObjectString(errors))
		ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: {errors }})
	result.categoryID = await categoryModel.saveCategory(result.categoryName)
	await gameModel.savegame(result).then(() => {
		console.log('Game Successfully added')
		ctx.status = constants.SUCCESS
		ctx.body = { message: 'Game Successfully added'}
	})
})
/**
 * Route get all games.
 * @name get/getAllgames
 * @function
 * @memberof module:/api/v1_0/game
 * @inner
 * @param {string} ctx - Koa router path which contains data from the URL
 * @throws {BAD_REQUEST} Throws error if error on request
 */
router.get('/getAllgames', async(ctx) => {
	await gameModel.getAllGames().then(result => {
		console.log(result); ctx.status = constants.SUCCESS
		ctx.body = { message: result}
	})
})
/**
 * Route get all game categories.
 * @name get/getAllCategories
 * @function
 * @memberof module:/api/v1_0/game
 * @inner
 * @param {string} ctx - Koa router path which contains data from the URL
 * @throws {BAD_REQUEST} Throws error if error on request
 */
router.get('/getAllCategories', async(ctx) => {
	await categoryModel.getAllCategories().then(result => {
		console.log(result); ctx.status = constants.SUCCESS
		ctx.body = { message: result}
	})
})
/**
 * Route get game by id.
 * @name get/getgameId
 * @function
 * @memberof module:/api/v1_0/game
 * @inner
 * @param {string} ctx - Koa router path which contains data from the URL
 * @throws {BAD_REQUEST} Throws error if error on request
 */
router.get('/getgameId', async(ctx) => {
	const gameTitle = ctx.request.query.gameTitle
	const errors = await gameValidator.validateGameTitle(gameTitle)
	if (!utilVal.isEmptyObjectString(errors))
		ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: {errors }})
	await gameModel.getGameById(gameTitle).then(result => {
		if(!utilVal.isEmpty(result)) {
			console.log(result); ctx.status = constants.SUCCESS
			ctx.body = { message: result}; return
		}
		ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: 'Could not get gameId with the given title'})
	})
})
/**
 * Route get game by category.
 * @name get/getgameByCategory
 * @function
 * @memberof module:/api/v1_0/game
 * @inner
 * @param {string} ctx - Koa router path which contains data from the URL
 * @throws {BAD_REQUEST} Throws error if error on request
 */
router.get('/getgameByCategory', async(ctx) => {
	const categoryName = ctx.request.query.categoryName
	const errors = await gameValidator.validateCategoryName(categoryName)
	if (!utilVal.isEmptyObjectString(errors))
		ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: {errors }})
	const categoryID = await categoryModel.getCategoryById(categoryName)
	if(!utilVal.isEmpty(categoryID)) {
		await gameModel.getByGameCategory(categoryID).then(result => {
			console.log(result); ctx.status = constants.SUCCESS
			ctx.body = { message: result}
		})
	} else {
		errors.categoryName = 'Could not find Category name'
		ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: {errors }})
	}
})
/**
 * Route get game by title.
 * @name get/getgameByTitle
 * @function
 * @memberof module:/api/v1_0/game
 * @inner
 * @param {string} ctx - Koa router path which contains data from the URL
 * @throws {BAD_REQUEST} Throws error if error on request
 */
router.get('/getgameByTitle', async(ctx) => {
	await gameHelper.getGameByTitle(ctx)
})
/**
 * Route get game by titles.
 * @name get/getgameTitles
 * @function
 * @memberof module:/api/v1_0/game
 * @inner
 * @param {string} ctx - Koa router path which contains data from the URL
 * @throws {BAD_REQUEST} Throws error if error on request
 */
router.get('/getgameTitles', async(ctx) => {
	await gameModel.getGameTitles().then(result => {
		console.log(result)
		ctx.status = constants.SUCCESS
		ctx.body = { message: result}
	})
})
/**
 * Route save rate.
 * @name post/saveRate
 * @function
 * @memberof module:/api/v1_0/game
 * @inner
 * @param {string} ctx - Koa router path which contains data from the URL
 * @throws {BAD_REQUEST} Throws error if error on request
 */
router.post('/saveRate', async(ctx) => {
	const data = ctx.request.body
	const errors = Object.assign(await gameValidator.validateUserID(data.userId),
		await gameValidator.validateGameTitle(data.title), await gameValidator.validateRate(data.rate))
	if (!utilVal.isEmptyObjectString(errors))
		ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: {errors }})
	data.gameId = await gameModel.getGameById(data.title)
	if(utilVal.isEmpty(data.gameId)) {
		errors.game = 'Game title could not be found'
		ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: {errors }})
	}
	await gameHelper.checkForExistingRate(data.userId, data.gameId, ctx)
	await rateModel.saveRate(data)
	await gameHelper.storeOverallGameRating(data.gameId).then(() => {
		console.log('Rate Successfully added'); ctx.status = constants.SUCCESS
		ctx.body = { message: 'Rate Successfully added'}
	})
})
module.exports = router
