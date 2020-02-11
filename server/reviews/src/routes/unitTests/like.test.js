'use strict'
const reviewServer = require('../../../server')
const request = require('supertest')
const sinon = require('sinon')
const likeModel = require('../../models/likes')
const reviewModel = require('../../models/reviews')
const reviewValidator = require('../../validation/reviewValidator')
const constants = require('../../constants')
const prefix = '/api/v1.0/review'

afterEach(() => {
	reviewServer.close()
	jest.clearAllMocks()
})

describe('routes: saveLike', () => {
	test('should return error on saveLike post request as body is empty', async(done) => {
		const response = await request(reviewServer).post(`${prefix}/saveLike`)
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual({errors: {reviewId: 'Review Id Must not be empty',
			userId: 'User Id Must not be empty'}})
		done()
	})

	test('should return error on saveLike post request as review does not exist', async(done) => {
		const validatorStub = sinon.stub(reviewValidator, 'validateReviewLike').callsFake(async() => {
			console.log('MOCK reviewvalidator error response')
			return {review: 'Review does not exist with the given Id'}
		})
		const response = await request(reviewServer).post(`${prefix}/saveLike`)
			.send({userId: 3, reviewId: 2, like: 'true'})
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual({errors: {review: 'Review does not exist with the given Id'}})
		done()
		validatorStub.restore()
	})

	test('should return error on saveLike post request as like is false', async(done) => {
		const validatorStub = sinon.stub(reviewValidator, 'validateReviewLike').callsFake(() => Promise.resolve({}))
		const response = await request(reviewServer).post(`${prefix}/saveLike`)
			.send({userId: 3, reviewId: 2, like: 'false'})
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual({Like: 'Like must be true'})
		done()
		validatorStub.restore()
	})

	test('shouldsuccessfully saveLike on post request', async(done) => {
		const validatorStub = sinon.stub(reviewValidator, 'validateReviewLike').callsFake(() => Promise.resolve({}))
		const likeStub = sinon.stub(likeModel, 'savelike').callsFake(() => Promise.resolve())
		const response = await request(reviewServer).post(`${prefix}/saveLike`)
			.send({userId: 3, reviewId: 2, like: 'true'})
		expect(response.status).toEqual(constants.SUCCESS)
		expect(response.type).toEqual('application/json')
		expect(response.body.message).toEqual('Like Successfully added')
		done()
		validatorStub.restore()
		likeStub.restore()
	})
})


describe('routes: getAllLikesByReviewID', () => {
	test('should return error on request as body is empty', async(done) => {
		const response = await request(reviewServer).get(`${prefix}/getAllLikesByreviewID`)
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual({errors: {reviewId: 'Review Id Must not be empty'}})
		done()
	})

	test('should return error on request as review does not exist', async(done) => {
		const validatorStub = sinon.stub(reviewModel, 'getPendingReviewsById').callsFake(() => Promise.resolve())
		const response = await request(reviewServer).get(`${prefix}/getAllLikesByReviewID`)
			.query({reviewId: 2})
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual('Review does not exist with the given Id')
		done()
		validatorStub.restore()

	})

	test('should successfully return all likes', async(done) => {
		const validatorStub = sinon.stub(reviewModel, 'getPendingReviewsById').callsFake(() =>
			Promise.resolve([{Id: 2, userId: 3, gameId: 1,
				Title: 'Title', content: 'Content',screenshotImageURL: 'http://google.com.png'}]))
		const likeStub = sinon.stub(likeModel, 'getAllLikesByReviewID').callsFake(() =>
			Promise.resolve([{userId: 1, reviewId: 1, liker: 1}, {userId: 2, reviewId: 1, liker: 1}]))
		const response = await request(reviewServer).get(`${prefix}/getAllLikesByReviewID`)
			.query({reviewId: 2})
		expect(response.status).toEqual(constants.SUCCESS)
		expect(response.type).toEqual('application/json')
		expect(response.body.message).toEqual(
			[{userId: 1, reviewId: 1, liker: 1}, {userId: 2, reviewId: 1, liker: 1}])
		validatorStub.restore()
		likeStub.restore()
		done()

	})

	test('should return error on request as likes could not be found', async(done) => {
		const validatorStub = sinon.stub(reviewModel, 'getPendingReviewsById').callsFake(() =>
			Promise.resolve([{Id: 2, userId: 3, gameId: 1,
				Title: 'Title', content: 'Content',screenshotImageURL: 'http://google.com.png'}]))
		const likeStub = sinon.stub(likeModel, 'getAllLikesByReviewID').callsFake(() => Promise.resolve())
		const response = await request(reviewServer).get(`${prefix}/getAllLikesByReviewID`)
			.query({reviewId: 2})
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual('Could not get likes with the reviewId')
		validatorStub.restore()
		likeStub.restore()
		done()
	})
})

describe('routes: /deleteLike', () => {
	test('should return error on deleteLike post request as body is empty', async(done) => {
		const response = await request(reviewServer).delete(`${prefix}/deleteLike`)
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual({errors: {reviewId: 'Review Id Must not be empty',
			userId: 'User Id Must not be empty'}})
		done()
	})

	test('should successfully remove like', async(done) => {
		const likeStub = sinon.stub(likeModel, 'getLikeByUserAndReviewId').callsFake(() =>
			Promise.resolve([{userId: 1, reviewId: 1, liker: 1}, {userId: 2, reviewId: 1, liker: 1}]))
		const deleteStub = sinon.stub(likeModel, 'deleteLike').callsFake(() => Promise.resolve())
		const response = await request(reviewServer).delete(`${prefix}/deleteLike`)
			.query({reviewId: 1, userId: 2})
		expect(response.status).toEqual(constants.SUCCESS)
		expect(response.type).toEqual('application/json')
		expect(response.body.message).toEqual('Successfully deleted')
		done()
		likeStub.restore()
		deleteStub.restore()
	})

	test('should return error on request as like could not be found on review', async(done) => {
		const likeStub = sinon.stub(likeModel, 'getLikeByUserAndReviewId').callsFake(() => Promise.resolve())
		const response = await request(reviewServer).delete(`${prefix}/deleteLike`)
			.query({reviewId: 2, userId: 2})
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual('Could not find like to delete')
		done()
		likeStub.restore()
	})
})
