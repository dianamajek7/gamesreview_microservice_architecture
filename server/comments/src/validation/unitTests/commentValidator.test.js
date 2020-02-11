'use strict'

const commentValidator = require('../commentValidator')
const commentModel = require('../../models/comments')
const likeModel = require('../../models/likes')
const sinon = require('sinon')

afterEach(() => {
	jest.clearAllMocks()
})

describe('validateCommentInput()', () => {
	test(`reviewId, userId, gameId, title, content, screenshot 
	value is empty, must return errors within errors object`, async(done) => {
		expect.assertions(1)
		const data = {}
		const result = await commentValidator.validateCommentInput(data)
		const expectedResult = {title: 'Comment title Must not be empty',
			content: 'Comment content Must not be empty',
			userId: 'User Id Must not be empty', reviewId: 'Review Id Must not be empty'}
		expect(result).toEqual(expectedResult)
		done()
	})

	test(`reviewId, userId, gameId, title, content, screenshot 
	value present, must return empty errors object`, async(done) => {
		expect.assertions(1)
		const dbStub = sinon.stub(commentModel, 'getCommentByUserAndReviewId')
			.callsFake(() => Promise.resolve())
		const data ={title: 'Comment title Must not be empty',
			content: 'Comment content Must not be empty',
			userId: 2, reviewId: 1}
		const result = await commentValidator.validateCommentInput(data)
		expect(result).toEqual({})
		dbStub.restore()
		done()
	})

	test('userId, gameId review is of existence in database', async(done) => {
		expect.assertions(1)
		const dbStub = sinon.stub(commentModel, 'getCommentByUserAndReviewId')
			.callsFake(() => Promise.resolve({success: 'found comment'}))
		const data = {title: 'GTA Review comment', content: 'Action review comment',
			userId: 2, reviewId: 5}
		const result = await commentValidator.validateCommentInput(data)
		const expectedResult = {review: 'User already added comment'}
		expect(result).toEqual(expectedResult)
		dbStub.restore()
		done()
	})

	test('userId, gameId review none existence in database', async(done) => {
		expect.assertions(1)
		const dbStub = sinon.stub(commentModel, 'getCommentByUserAndReviewId')
			.callsFake(() => Promise.resolve())
		const data = {title: 'GTA Review comment', content: 'Action review comment',
			userId: 1, reviewId: 3}
		const result = await commentValidator.validateCommentInput(data)
		const expectedResult = {}
		expect(result).toEqual(expectedResult)
		dbStub.restore()
		done()
	})
})

describe('validateData()', () => {
	test('review id contains error', async(done) => {
		expect.assertions(1)
		const data = {}
		const result = await commentValidator.validateData(data)
		const expectedResult = {title: 'Comment title Must not be empty',
			content: 'Comment content Must not be empty'}
		expect(result).toEqual(expectedResult)
		done()
	})
	test('review id constains no error', async(done) => {
		expect.assertions(1)
		const data = {title: 'GTA Review comment', content: 'Action review comment'}
		const result = await commentValidator.validateData(data)
		const expectedResult = {}
		expect(result).toEqual(expectedResult)
		done()
	})
})

describe('validateReviewId()', () => {
	test('review id contains error', async(done) => {
		expect.assertions(1)
		const result = await commentValidator.validateReviewId()
		const expectedResult = {reviewId: 'Review Id Must not be empty'}
		expect(result).toEqual(expectedResult)
		done()
	})
	test('review id constains no error', async(done) => {
		expect.assertions(1)
		const result = await commentValidator.validateReviewId(2)
		const expectedResult = {}
		expect(result).toEqual(expectedResult)
		done()
	})
})

describe('validateUserId()', () => {
	test('user id contains error', async(done) => {
		expect.assertions(1)
		const result = await commentValidator.validateUserId()
		const expectedResult = {userId: 'User Id Must not be empty'}
		expect(result).toEqual(expectedResult)
		done()
	})
	test('user id constains no error', async(done) => {
		expect.assertions(1)
		const result = await commentValidator.validateUserId(3)
		const expectedResult = {}
		expect(result).toEqual(expectedResult)
		done()
	})
})

describe('validateCommentId()', () => {
	test('game id contains error', async(done) => {
		expect.assertions(1)
		const result = await commentValidator.validateCommentId()
		const expectedResult = {commentId: 'Comment Id Must not be empty'}
		expect(result).toEqual(expectedResult)
		done()
	})
	test('game id constains no error', async(done) => {
		expect.assertions(1)
		const result = await commentValidator.validateCommentId(1)
		const expectedResult = {}
		expect(result).toEqual(expectedResult)
		done()
	})
})

describe('validateCommentLike()', () => {
	test('comment like contains error', async(done) => {
		expect.assertions(1)
		const data = {}
		const result = await commentValidator.validateCommentLike(data)
		const expectedResult = {like: 'Like Must not be empty'}
		expect(result).toEqual(expectedResult)
		done()
	})

	test('userId, commentId like is of existence in database', async(done) => {
		expect.assertions(1)
		const dbStub = sinon.stub(likeModel, 'getLikeByUserAndCommentId')
			.callsFake(() => Promise.resolve({success: 'found like'}))
		const commentStub = sinon.stub(commentModel, 'getCommentById')
			.callsFake(() => Promise.resolve({success: 'found comment'}))
		const data = {like: 'true', userId: 2, commentId: 5}
		const result = await commentValidator.validateCommentLike(data)
		const expectedResult = {like: 'User already liked the comment'}
		expect(result).toEqual(expectedResult)
		dbStub.restore()
		commentStub.restore()
		done()
	})

	test('userId, commentId like none existence in database', async(done) => {
		expect.assertions(1)
		const dbStub = sinon.stub(likeModel, 'getLikeByUserAndCommentId')
			.callsFake(() => Promise.resolve())
		const commentStub = sinon.stub(commentModel, 'getCommentById')
			.callsFake(() => Promise.resolve({success: 'found comment'}))
		const data = {like: 'true', userId: 1, commentId: 3}
		const result = await commentValidator.validateCommentLike(data)
		const expectedResult = {}
		expect(result).toEqual(expectedResult)
		dbStub.restore()
		commentStub.restore()
		done()
	})

	test('userId, commentId comment none existence in database', async(done) => {
		expect.assertions(1)
		const dbStub = sinon.stub(likeModel, 'getLikeByUserAndCommentId')
			.callsFake(() => Promise.resolve())
		const commentStub = sinon.stub(commentModel, 'getCommentById')
			.callsFake(() => Promise.resolve())
		const data = {like: 'true', userId: 2, commentId: 5}
		const result = await commentValidator.validateCommentLike(data)
		const expectedResult = {comment: 'Comment does not exist with the given Id'}
		expect(result).toEqual(expectedResult)
		dbStub.restore()
		commentStub.restore()
		done()
	})

	test('userId, commentId comment is of existence in database', async(done) => {
		expect.assertions(1)
		const dbStub = sinon.stub(likeModel, 'getLikeByUserAndCommentId')
			.callsFake(() => Promise.resolve())
		const commentStub = sinon.stub(commentModel, 'getCommentById')
			.callsFake(() => Promise.resolve({success: 'found comment'}))
		const data = {like: 'true', userId: 1, commentId: 3}
		const result = await commentValidator.validateCommentLike(data)
		const expectedResult = {}
		expect(result).toEqual(expectedResult)
		dbStub.restore()
		commentStub.restore()
		done()
	})
})
