'use strict'

const gamesValidator = require('../gameValidator')
const gameModel = require('../../models/game')
const sinon = require('sinon')

afterEach(() => {
	jest.clearAllMocks()
})

describe('validateGameInput()', () => {
	test(`description, summary, title, categoryName, publisher, image,
	value is empty, must return errors within errors object`, async(done) => {
		expect.assertions(1)
		const data = {}
		const result = await gamesValidator.validateGameInput(data)
		const expectedResult = {description: 'Game description Must not be empty',
			summary: 'Game summary Must not be empty', title: 'Game title Must not be empty',
			categoryName: 'Category name Must not be empty',
			publisher: 'Game publisher Must not be empty', image: 'Game image Must not be empty'}
		expect(result).toEqual(expectedResult)
		done()
	})

	test('gameId is of existence in database', async(done) => {
		expect.assertions(1)
		const dbStub = sinon.stub(gameModel, 'getGameById').callsFake(() => Promise.resolve({success: 'found game'}))
		const data = {title: 'GTA', categoryName: 'Action', publisher: 'Diana',
			summary: 'Spend all day playing', description: 'Drive cars, have mission',
			image: 'https://servmask.com/img/products/url.png'}
		const result = await gamesValidator.validateGameInput(data)
		const expectedResult = {game: 'Game already exists'}
		expect(result).toEqual(expectedResult)
		done()
		dbStub.restore()
	})

	test('gameId none existence in database', async(done) => {
		expect.assertions(1)
		const dbStub = sinon.stub(gameModel, 'getGameById').callsFake(() => Promise.resolve())
		const data = {title: 'GTA', categoryName: 'Action', publisher: 'Diana',
			summary: 'Spend all day playing', description: 'Drive cars, have mission',
			image: 'https://servmask.com/img/products/url.png'}
		const result = await gamesValidator.validateGameInput(data)
		const expectedResult = {}
		expect(result).toEqual(expectedResult)
		done()
		dbStub.restore()
	})
})

describe('validateGameTitle()', () => {
	test('game title constains error', async(done) => {
		expect.assertions(1)
		const result = await gamesValidator.validateGameTitle()
		const expectedResult = {title: 'Game title Must not be empty'}
		expect(result).toEqual(expectedResult)
		done()
	})
	test('game title constains no error', async(done) => {
		expect.assertions(1)
		const result = await gamesValidator.validateGameTitle('GTA')
		const expectedResult = {}
		expect(result).toEqual(expectedResult)
		done()
	})
})

describe('validateCategoryName()', () => {
	test('category name constains error', async(done) => {
		expect.assertions(1)
		const result = await gamesValidator.validateCategoryName()
		const expectedResult = {categoryName: 'Category name Must not be empty'}
		expect(result).toEqual(expectedResult)
		done()
	})
	test('category name constains no error', async(done) => {
		expect.assertions(1)
		const result = await gamesValidator.validateCategoryName('Action')
		const expectedResult = {}
		expect(result).toEqual(expectedResult)
		done()
	})
})

describe('validateUserID()', () => {
	test('UserID constains error', async(done) => {
		expect.assertions(1)
		const result = await gamesValidator.validateUserID()
		const expectedResult = {userId: 'User id Must not be empty'}
		expect(result).toEqual(expectedResult)
		done()
	})
	test('UserID constains no error', async(done) => {
		expect.assertions(1)
		const result = await gamesValidator.validateUserID(2)
		const expectedResult = {}
		expect(result).toEqual(expectedResult)
		done()
	})
})

describe('validateRate()', () => {
	test('rate constains error', async(done) => {
		expect.assertions(1)
		const result = await gamesValidator.validateRate()
		const expectedResult = {rate: 'Rate Must not be empty'}
		expect(result).toEqual(expectedResult)
		done()
	})
	test('rate constains no error', async(done) => {
		expect.assertions(1)
		const result = await gamesValidator.validateRate(5)
		const expectedResult = {}
		expect(result).toEqual(expectedResult)
		done()
	})
})
