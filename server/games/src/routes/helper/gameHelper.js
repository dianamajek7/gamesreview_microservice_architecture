'use strict'
const constants = require('../../constants')
const rateModel = require('../../models/rates')
const gameModel = require('../../models/game')
const utilVal = require('../../validation/helper/utilValidator')
const gameValidator = require('../../validation/gameValidator')

const storeOverallGameRating = async(gameId) => {
	const totalRate = await rateModel.getTotalRateByGameId(gameId)
	const noOfRates = await rateModel.countALLRateByGameID(gameId)
	const rating = totalRate/noOfRates
	return await gameModel.updateGameRating(rating, gameId)
}

const checkForExistingRate = async(userId, gameId, ctx) => {
	const errors = {}
	const result = await rateModel.getRateByUserID(userId, gameId)
	if(result) {
		errors.rate = 'User already rated the game'
		ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: {errors }})
	}
}

const getGameByTitle = async(ctx) => {
	const gameTitle = ctx.request.query.gameTitle
	const errors = await gameValidator.validateGameTitle(gameTitle)
	if (!utilVal.isEmptyObjectString(errors))
		ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: {errors }})
	await gameModel.getGameByTitle(gameTitle).then(result => {
		if(!utilVal.isEmpty(result)) {
			console.log(result); ctx.status = constants.SUCCESS
			ctx.body = { message: result}; return
		}
		ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: 'Could not get game with the given title'})
	})
}

module.exports = { storeOverallGameRating, checkForExistingRate, getGameByTitle }
