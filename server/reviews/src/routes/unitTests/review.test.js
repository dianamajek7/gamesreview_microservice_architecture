
'use strict'
const reviewServer = require('../../../server')
const request = require('supertest')
const sinon = require('sinon')
const reviewModel = require('../../models/reviews')
const constants = require('../../constants')
const prefix = '/api/v1.0/review'

afterEach(() => {
	reviewServer.close()
	jest.clearAllMocks()
})

describe('routes: saveReview', () => {

	test('should return error on saveReview post request as body is empty', async(done) => {
		const validatorStub = sinon.stub(reviewModel, 'getReviewByUserAndGameId').callsFake(() => Promise.resolve())
		const response = await request(reviewServer).post(`${prefix}/saveReview`)
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual({errors: {title: 'Review title Must not be empty',
			content: 'Review content Must not be empty', screenshot: 'Review Screenshot Must not be empty',
			userId: 'User Id Must not be empty', gameId: 'Game Id Must not be empty'}})
		validatorStub.restore()
		done()
	})

	test('should successfully saveReview on post request', async(done) => {
		const validatorStub = sinon.stub(reviewModel, 'getReviewByUserAndGameId').callsFake(() => Promise.resolve())
		const reviewStub = sinon.stub(reviewModel, 'savereview').callsFake(() => Promise.resolve())
		const response = await request(reviewServer).post(`${prefix}/saveReview`)
			.send({userId: 3, gameId: 2, title: 'The title', content: 'this is the content',
				screenshot: 'http://www.google.com.png'})
		expect(response.status).toEqual(constants.SUCCESS)
		expect(response.type).toEqual('application/json')
		expect(response.body.message).toEqual('Review Successfully added')
		validatorStub.restore()
		reviewStub.restore()
		done()
	})
})

describe('routes: getAllReviewsByReviewID', () => {

	test('should return error on getAllReviewsByGameId by request as body is empty', async(done) => {
		const response = await request(reviewServer).get(`${prefix}/getAllReviewsByGameId`)
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual({errors: {gameId: 'Game Id Must not be empty'}})
		done()
	})

	test('should successfully return all reviews byReviewId', async(done) => {
		const reviewStub = sinon.stub(reviewModel, 'getAllReviewsByGameID').callsFake(() =>
			Promise.resolve([{Id: 1}]))
		const response = await request(reviewServer).get(`${prefix}/getAllReviewsByGameID`)
			.query({gameId: 2})
		expect(response.status).toEqual(constants.SUCCESS)
		expect(response.type).toEqual('application/json')
		expect(response.body.message).toEqual([{Id: 1}])
		reviewStub.restore()
		done()
	})

	test('should return error on request as review is pending approval', async(done) => {
		const reviewStub = sinon.stub(reviewModel, 'getAllReviewsByGameID').callsFake(() => Promise.resolve())
		const pendingReviewStub = sinon.stub(reviewModel, 'getPendingReviewsByGameID')
			.callsFake(() => Promise.resolve(6))
		const response = await request(reviewServer).get(`${prefix}/getAllReviewsByGameID`)
			.query({gameId: 2})
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual('Review on gameId pending approval from admin')
		reviewStub.restore()
		pendingReviewStub.restore()
		done()
	})


	test('should return error on request as reviews byReviewId as it could not be found', async(done) => {
		const reviewStub = sinon.stub(reviewModel, 'getAllReviewsByGameID').callsFake(() => Promise.resolve())
		const pendingReviewStub = sinon.stub(reviewModel, 'getPendingReviewsByGameID')
			.callsFake(() => Promise.resolve())
		const response = await request(reviewServer).get(`${prefix}/getAllReviewsByGameID`)
			.query({gameId: 2})
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual('Could not get reviews with the gameId')
		reviewStub.restore()
		pendingReviewStub.restore()
		done()
	})
})

