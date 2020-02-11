'use strict'
const gameServer = require('../../../server')
const request = require('supertest')
const sinon = require('sinon')
const gameModel = require('../../models/game')
const categoryModel = require('../../models/categories')
const rateModel = require('../../models/rates')
const gameHelper = require('../helper/gameHelper')
const constants = require('../../constants')
const prefix = '/api/v1.0/game'

afterEach(() => {
	gameServer.close()
	jest.clearAllMocks()
})

describe('routes: savegame', () => {
	test('should return error on savegame post request as body is empty', async(done) => {
		const validatorStub = sinon.stub(gameModel, 'getGameById').callsFake(() => Promise.resolve())
		const response = await request(gameServer).post(`${prefix}/savegame`)
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual({errors: {description: 'Game description Must not be empty',
			summary: 'Game summary Must not be empty', title: 'Game title Must not be empty',
			categoryName: 'Category name Must not be empty',
			publisher: 'Game publisher Must not be empty', image: 'Game image Must not be empty'}})
		validatorStub.restore()
		done()
	})

	test('should successfully savegame on post request', async(done) => {
		const validatorStub = sinon.stub(gameModel, 'getGameById').callsFake(() => Promise.resolve())
		const categoryStub = sinon.stub(categoryModel, 'saveCategory').callsFake(() => Promise.resolve(1))
		const gameStub = sinon.stub(gameModel, 'savegame').callsFake(() => Promise.resolve())
		const response = await request(gameServer).post(`${prefix}/savegame`)
			.send({title: 'the Title', categoryName: 'the categoryName', publisher: 'the publisher',
				summary: 'the summary', description: 'the description', image: 'http://google.com.png'})
		expect(response.status).toEqual(constants.SUCCESS)
		expect(response.type).toEqual('application/json')
		expect(response.body.message).toEqual('Game Successfully added')
		validatorStub.restore()
		gameStub.restore()
		categoryStub.restore()
		done()
	})
})

describe('routes: getAllgames', () => {

	test('should successfully return all games', async(done) => {
		const gameStub = sinon.stub(gameModel, 'getAllGames').callsFake(() =>
			Promise.resolve([{Id: 1, Title: 'Title', categoryId: 1, Publisher: 'publisher',
			    summary: 'summary', description: 'description', imageURL: 'http://google.com.png', rating: 0}]))
		const response = await request(gameServer).get(`${prefix}/getAllGames`)
		expect(response.status).toEqual(constants.SUCCESS)
		expect(response.type).toEqual('application/json')
		expect(response.body.message).toEqual(
			[{Id: 1, Title: 'Title', categoryId: 1, Publisher: 'publisher',
			    summary: 'summary', description: 'description', imageURL: 'http://google.com.png', rating: 0}])
		gameStub.restore()
		done()
	})
})

describe('routes: getAllCategories', () => {
	test('should successfully return all categories', async(done) => {
		const gameStub = sinon.stub(categoryModel, 'getAllCategories').callsFake(() =>
			Promise.resolve([{Id: 1, Name: 'Thriller'}]))
		const response = await request(gameServer).get(`${prefix}/getAllCategories`)
		expect(response.status).toEqual(constants.SUCCESS)
		expect(response.type).toEqual('application/json')
		expect(response.body.message).toEqual([{Id: 1, Name: 'Thriller'}])
		gameStub.restore()
		done()
	})

})

describe('routes: getgameTitles', () => {
	test('should successfully return game titles', async(done) => {
		const gameStub = sinon.stub(gameModel, 'getGameTitles').callsFake(() =>
			Promise.resolve([{Title: 'Warfare'},{Title: 'GTA'}]))
		const response = await request(gameServer).get(`${prefix}/getgameTitles`)
		expect(response.status).toEqual(constants.SUCCESS)
		expect(response.type).toEqual('application/json')
		expect(response.body.message).toEqual([{Title: 'Warfare'},{Title: 'GTA'}])
		gameStub.restore()
		done()
	})

})

describe('routes: getgameId', () => {

	test('should return error on getgameId request as body is empty', async(done) => {
		const validatorStub = sinon.stub(gameModel, 'getGameById').callsFake(() => Promise.resolve())
		const response = await request(gameServer).get(`${prefix}/getgameId`)
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual({errors: {title: 'Game title Must not be empty'}})
		validatorStub.restore()
		done()
	})

	test('should successfully getgameId on request', async(done) => {
		const gameStub = sinon.stub(gameModel, 'getGameById').callsFake(() => Promise.resolve(1))
		const response = await request(gameServer).get(`${prefix}/getgameId`)
			.query({gameTitle: 'the Title'})
		expect(response.status).toEqual(constants.SUCCESS)
		expect(response.type).toEqual('application/json')
		expect(response.body.message).toEqual(1)
		gameStub.restore()
		done()
	})

	test('should return error on request as gameId could not be found', async(done) => {
		const gameStub = sinon.stub(gameModel, 'getGameById').callsFake(() => Promise.resolve())
		const response = await request(gameServer).get(`${prefix}/getgameId`)
			.query({gameTitle: 'the Title'})
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual('Could not get gameId with the given title')
		gameStub.restore()
		done()
	})
})

describe('routes: getgameByTitle', () => {

	test('should return error on getgame by title request as body is empty', async(done) => {
		const validatorStub = sinon.stub(gameModel, 'getGameByTitle').callsFake(() => Promise.resolve())
		const response = await request(gameServer).get(`${prefix}/getgameByTitle`)
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual({errors: {title: 'Game title Must not be empty'}})
		validatorStub.restore()
		done()
	})

	test('should successfully getgameByTitle on request', async(done) => {
		const gameStub = sinon.stub(gameModel, 'getGameByTitle').callsFake(() =>
			Promise.resolve([{Id: 1, Title: 'Warfare', categoryId: 1, Publisher: 'publisher',
				summary: 'summary', description: 'description', imageURL: 'http://google.com.png', rating: 0}]))
		const response = await request(gameServer).get(`${prefix}/getgameByTitle`)
			.query({gameTitle: 'the Title'})
		expect(response.status).toEqual(constants.SUCCESS)
		expect(response.type).toEqual('application/json')
		const expected = [{Id: 1, Title: 'Warfare', categoryId: 1, Publisher: 'publisher',
			summary: 'summary', description: 'description', imageURL: 'http://google.com.png', rating: 0}]
		expect(response.body.message).toEqual(expected)
		gameStub.restore()
		done()
	})

	test('should return error on request as game by title could not be found', async(done) => {
		const gameStub = sinon.stub(gameModel, 'getGameByTitle').callsFake(() => Promise.resolve())
		const response = await request(gameServer).get(`${prefix}/getgameByTitle`)
			.query({gameTitle: 'the Title'})
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual('Could not get game with the given title')
		gameStub.restore()
		done()
	})
})

describe('routes: getgameByCategory', () => {

	test('should return error on getgameByCategory request as body is empty', async(done) => {
		const response = await request(gameServer).get(`${prefix}/getgameByCategory`)
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual({errors: {categoryName: 'Category name Must not be empty'}})
		done()
	})

	test('should return error on getgameByCategory request as category could not be found', async(done) => {
		const categoryStub = sinon.stub(categoryModel, 'getCategoryById').callsFake(() => Promise.resolve())
		const response = await request(gameServer).get(`${prefix}/getgameByCategory`)
			.query({categoryName: 'the categoryName'})
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual({errors: {categoryName: 'Could not find Category name'}})
		categoryStub.restore()
		done()
	})

	test('should successfully getgameByCategory on request', async(done) => {
		const categoryStub = sinon.stub(categoryModel, 'getCategoryById').callsFake(() => Promise.resolve(1))
		const gameStub = sinon.stub(gameModel, 'getByGameCategory').callsFake(() => Promise.resolve(
			[{Id: 1, Title: 'Warfare', categoryId: 1, Publisher: 'publisher',
				summary: 'summary', description: 'description', imageURL: 'http://google.com.png', rating: 0}]))
		const response = await request(gameServer).get(`${prefix}/getgameByCategory`)
			.query({categoryName: 'the categoryName'})
		expect(response.status).toEqual(constants.SUCCESS)
		expect(response.type).toEqual('application/json')
		expect(response.body.message).toEqual([{Id: 1, Title: 'Warfare', categoryId: 1, Publisher: 'publisher',
			summary: 'summary', description: 'description', imageURL: 'http://google.com.png', rating: 0}])
		categoryStub.restore()
		gameStub.restore()
		done()
	})
})

describe('routes: saveRate', () => {

	test('should return error on saveRate post request as body is empty', async(done) => {
		const response = await request(gameServer).post(`${prefix}/saveRate`)
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual({errors: {userId: 'User id Must not be empty',
			title: 'Game title Must not be empty', rate: 'Rate Must not be empty'}})
		done()
	})

	test('should return error on saveRate post game could not be found', async(done) => {
		const gameStub = sinon.stub(gameModel, 'getGameById').callsFake(() => Promise.resolve())
		const response = await request(gameServer).post(`${prefix}/saveRate`)
			.send({userId: 1, title: 'GTA', rate: 3.25,
				description: 'description', image: 'http://google.com.png'})
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual({errors: {game: 'Game title could not be found'}})
		gameStub.restore()
		done()
	})

	test('should successfully saveRate on post request', async(done) => {
		const gameStub = sinon.stub(gameModel, 'getGameById').callsFake(() => Promise.resolve(1))
		const helperCheckStub = sinon.stub(gameHelper, 'checkForExistingRate').callsFake(() => Promise.resolve())
		const rateStub = sinon.stub(rateModel, 'saveRate').callsFake(() => Promise.resolve())
		const helperStoreStub = sinon.stub(gameHelper, 'storeOverallGameRating').callsFake(() => Promise.resolve())
		const response = await request(gameServer).post(`${prefix}/saveRate`)
			.send({userId: 1, title: 'GTA', rate: 3.25,
				description: 'description', image: 'http://google.com.png'})
		expect(response.status).toEqual(constants.SUCCESS)
		expect(response.type).toEqual('application/json')
		expect(response.body.message).toEqual('Rate Successfully added')
		gameStub.restore()
		helperCheckStub.restore()
		rateStub.restore()
		helperStoreStub.restore()
		done()
	})
})
