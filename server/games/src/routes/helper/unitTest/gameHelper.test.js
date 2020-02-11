'use strict'
const {createMockContext} = require('@shopify/jest-koa-mocks')
const gameHelper = require('../gameHelper')
const rateModel = require('../../../models/rates')
const gameModel = require('../../../models/game')
const sinon = require('sinon')
const constants = require('../../../constants')

afterEach(() => {
	jest.clearAllMocks()
})


describe('storeOverallGameRating()', () => {

	test('should successfully store overall game rating', async(done) => {
		expect.assertions(2)
		const totalRateStub = sinon.stub(rateModel, 'getTotalRateByGameId').callsFake(() => Promise.resolve(16))
		const counterRateStub = sinon.stub(rateModel, 'countALLRateByGameID').callsFake(() => Promise.resolve(4))
		const gameStub = sinon.stub(gameModel, 'updateGameRating').callsFake(() => Promise.resolve())

		expect(await gameHelper.storeOverallGameRating(3)).toBeUndefined()
		expect(gameStub.callCount).toBe(1)
		done()
		totalRateStub.restore()
		counterRateStub.restore()
		gameStub.restore()
	})
})

describe('checkForExistingRate()', () => {
	test('should successfully check for existing rate', async(done) => {
		const totalRateStub = sinon.stub(rateModel, 'getRateByUserID').callsFake(() => Promise.resolve())
		expect.assertions(1)
		const ctx = createMockContext({})
		await gameHelper.checkForExistingRate(2, 5, ctx)
		expect(ctx.throw).not.toHaveBeenCalled()
		done()
		totalRateStub.restore()
	})

	test('should throw 400 BadRequest error, as user already rated the game ', async(done) => {
		const totalRateStub = sinon.stub(rateModel, 'getRateByUserID').callsFake(() => Promise.resolve(4.5))
		expect.assertions(1)
		const ctx = createMockContext({})
		await gameHelper.checkForExistingRate(3, 5, ctx)
		expect(ctx.throw).toBeCalledWith(constants.BAD_REQUEST, { title: 'Bad Request',
			detail: {errors: {rate: 'User already rated the game'}}})
		done()
		totalRateStub.restore()
	})
})

describe('getGameByTitle()', () => {
	test('should successfully return game', async(done) => {
		const totalRateStub = sinon.stub(gameModel, 'getGameByTitle').callsFake(() =>
			Promise.resolve([{Id: 1, Title: 'Warfare', categoryId: 1, Publisher: 'publisher',
				summary: 'summary', description: 'description', imageURL: 'http://google.com.png', rating: 0}]))
		expect.assertions(1)
		const ctx = createMockContext({})
		ctx.request.query.gameTitle='Warfare'
		await gameHelper.getGameByTitle(ctx)
		expect(ctx.throw).not.toHaveBeenCalled()
		done()
		totalRateStub.restore()
	})

	test('should throw 400 BadRequest error, as game could not be found', async(done) => {
		const totalRateStub = sinon.stub(gameModel, 'getGameByTitle').callsFake(() => Promise.resolve())
		expect.assertions(1)
		const ctx = createMockContext({})
		ctx.request.query.gameTitle='Warfare'
		await gameHelper.getGameByTitle(ctx)
		expect(ctx.throw).toBeCalledWith(constants.BAD_REQUEST, { title: 'Bad Request',
			detail: 'Could not get game with the given title'})
		done()
		totalRateStub.restore()
	})
})
