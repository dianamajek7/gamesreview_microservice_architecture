'use strict'

const reviewValidator = require('../reviewValidator')
const reviewModel = require('../../models/reviews')
const likeModel = require('../../models/likes')
const sinon = require('sinon')

afterEach(() => {
	jest.clearAllMocks()
})

describe('validateReviewInput()', () => {
	test(`reviewId, userId, gameId, title, content, screenshot 
	value is empty, must return errors within errors object`, async(done) => {
		expect.assertions(1)
		const data = {}
		const result = await reviewValidator.validateReviewInput(data)
		const expectedResult = {title: 'Review title Must not be empty',
			content: 'Review content Must not be empty', screenshot: 'Review Screenshot Must not be empty',
			userId: 'User Id Must not be empty', gameId: 'Game Id Must not be empty'}
		expect(result).toEqual(expectedResult)
		done()
	})

	test('userId, gameId review is of existence in database', async(done) => {
		expect.assertions(1)
		const dbStub = sinon.stub(reviewModel, 'getReviewByUserAndGameId')
			.callsFake(() => Promise.resolve({success: 'found review'}))
		const data = {title: 'GTA Review', content: 'Action review', publisher: 'Diana',
			userId: 2, gameId: 5,
			screenshot: 'https://servmask.com/img/products/url.png'}
		const result = await reviewValidator.validateReviewInput(data)
		const expectedResult = {review: 'User already added review for the gameId'}
		expect(result).toEqual(expectedResult)
		dbStub.restore()
		done()
	})

	test('userId, gameId review none existence in database', async(done) => {
		expect.assertions(1)
		const dbStub = sinon.stub(reviewModel, 'getReviewByUserAndGameId')
			.callsFake(() => Promise.resolve())
		const data = {title: 'GTA Review', content: 'Action review', publisher: 'Diana',
			userId: 1, gameId: 3,
			screenshot: 'https://servmask.com/img/products/url.png'}
		const result = await reviewValidator.validateReviewInput(data)
		const expectedResult = {}
		expect(result).toEqual(expectedResult)
		dbStub.restore()
		done()
	})
})

describe('validateReviewId()', () => {
	test('review id contains error', async(done) => {
		expect.assertions(1)
		const result = await reviewValidator.validateReviewId()
		const expectedResult = {reviewId: 'Review Id Must not be empty'}
		expect(result).toEqual(expectedResult)
		done()
	})
	test('review id constains no error', async(done) => {
		expect.assertions(1)
		const result = await reviewValidator.validateReviewId(2)
		const expectedResult = {}
		expect(result).toEqual(expectedResult)
		done()
	})
})

describe('validateUserId()', () => {
	test('user id contains error', async(done) => {
		expect.assertions(1)
		const result = await reviewValidator.validateUserId()
		const expectedResult = {userId: 'User Id Must not be empty'}
		expect(result).toEqual(expectedResult)
		done()
	})
	test('user id constains no error', async(done) => {
		expect.assertions(1)
		const result = await reviewValidator.validateUserId(3)
		const expectedResult = {}
		expect(result).toEqual(expectedResult)
		done()
	})
})

describe('validateGameId()', () => {
	test('game id contains error', async(done) => {
		expect.assertions(1)
		const result = await reviewValidator.validateGameId()
		const expectedResult = {gameId: 'Game Id Must not be empty'}
		expect(result).toEqual(expectedResult)
		done()
	})
	test('game id constains no error', async(done) => {
		expect.assertions(1)
		const result = await reviewValidator.validateGameId(1)
		const expectedResult = {}
		expect(result).toEqual(expectedResult)
		done()
	})
})

describe('validateReviewLike()', () => {
	test('review like contains error', async(done) => {
		expect.assertions(1)
		const data = {}
		const result = await reviewValidator.validateReviewLike(data)
		const expectedResult = {like: 'Like Must not be empty'}
		expect(result).toEqual(expectedResult)
		done()
	})

	test('userId, reviewId like is of existence in database', async(done) => {
		expect.assertions(1)
		const dbStub = sinon.stub(likeModel, 'getLikeByUserAndReviewId')
			.callsFake(() => Promise.resolve({success: 'found like'}))
		const reviewStub = sinon.stub(reviewModel, 'getPendingReviewsById')
			.callsFake(() => Promise.resolve({success: 'found review'}))
		const data = {like: 'true', userId: 2, gameId: 5}
		const result = await reviewValidator.validateReviewLike(data)
		const expectedResult = {like: 'User already liked the review'}
		expect(result).toEqual(expectedResult)
		dbStub.restore()
		reviewStub.restore()
		done()
	})

	test('userId, reviewId like none existence in database', async(done) => {
		expect.assertions(1)
		const dbStub = sinon.stub(likeModel, 'getLikeByUserAndReviewId')
			.callsFake(() => Promise.resolve())
		const reviewStub = sinon.stub(reviewModel, 'getPendingReviewsById')
			.callsFake(() => Promise.resolve({success: 'found review'}))
		const data = {like: 'true', userId: 1, gameId: 3}
		const result = await reviewValidator.validateReviewLike(data)
		const expectedResult = {}
		expect(result).toEqual(expectedResult)
		dbStub.restore()
		reviewStub.restore()
		done()
	})

	test('userId, reviewId review none existence in database', async(done) => {
		expect.assertions(1)
		const dbStub = sinon.stub(likeModel, 'getLikeByUserAndReviewId')
			.callsFake(() => Promise.resolve())
		const reviewStub = sinon.stub(reviewModel, 'getPendingReviewsById')
			.callsFake(() => Promise.resolve())
		const data = {like: 'true', userId: 2, gameId: 5}
		const result = await reviewValidator.validateReviewLike(data)
		const expectedResult = {review: 'Review does not exist with the given Id'}
		expect(result).toEqual(expectedResult)
		dbStub.restore()
		reviewStub.restore()
		done()
	})

	test('userId, reviewId review is of existence in database', async(done) => {
		expect.assertions(1)
		const dbStub = sinon.stub(likeModel, 'getLikeByUserAndReviewId')
			.callsFake(() => Promise.resolve())
		const reviewStub = sinon.stub(reviewModel, 'getPendingReviewsById')
			.callsFake(() => Promise.resolve({success: 'found review'}))
		const data = {like: 'true', userId: 1, gameId: 3}
		const result = await reviewValidator.validateReviewLike(data)
		const expectedResult = {}
		expect(result).toEqual(expectedResult)
		dbStub.restore()
		reviewStub.restore()
		done()
	})
})

describe('validateFlag()', () => {
	test('flag constains error', async(done) => {
		expect.assertions(1)
		const result = await reviewValidator.validateFlag()
		const expectedResult = {flag: 'Flag Must not be empty'}
		expect(result).toEqual(expectedResult)
		done()
	})
	test('flag constains no error', async(done) => {
		expect.assertions(1)
		const result = await reviewValidator.validateFlag('Approved')
		const expectedResult = {}
		expect(result).toEqual(expectedResult)
		done()
	})
})
