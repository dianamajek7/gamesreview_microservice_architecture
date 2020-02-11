'use strict'
const request = require('supertest')
const sinon = require('sinon')
const adminServer = require('../../../server')
const adminModel = require('../../models/admin')
const reviewModel = require('../../models/reviews')
const constants = require('../../constants')
const prefix = '/api/v1.0/review'

afterEach(() => {
	adminServer.close()
	jest.clearAllMocks()
})

describe('routes: admin', () => {
	test('should successfully return create_comments_db post request', async(done) => {
		const adminModelStub = sinon.stub(adminModel, 'createTables').callsFake(async() => {
			console.log('MOCK createTables')
			return {message: 'created successfully'}
		})
		const response = await request(adminServer).post(`${prefix}/admin/create_reviews_db`)
		expect(response.status).toEqual(constants.SUCCESS)
		expect(response.type).toEqual('application/json')
		expect(response.body.message).toEqual('created successfully')
		adminModelStub.restore()
		done()
	})

	test('should return error on create_comments_db post request', async(done) => {
		const adminModelStub = sinon.stub(adminModel, 'createTables').callsFake(async() => {
			console.log('MOCK createTables error response')
			throw {
				status: constants.INTERNAL_SERVER_ERROR,
				title: 'Internal Server Error',
				detail: 'Error occurred whilst processing DB tables'
			}

		})
		const response = await request(adminServer).post(`${prefix}/admin/create_reviews_db`)
		expect(response.status).toEqual(constants.INTERNAL_SERVER_ERROR)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Internal Server Error')
		expect(response.body.detail).toEqual('Error occurred whilst processing DB tables')
		adminModelStub.restore()
		done()
	})
})


describe('routes: getAllReviews', () => {

	test('should successfully return all reviews', async(done) => {
		const reviewStub = sinon.stub(reviewModel, 'getAllReviews').callsFake(() =>
			Promise.resolve([{Id: 1, userId: 1, gameId: 3,
				Title: 'Title', content: 'Content', screenshotImageURL: 'http://google.com.png',
				flag: 'approved', dateAdded: '2019-07-27 23:11:45'},
			{Id: 2, userId: 3, gameId: 5, Title: 'Title', content: 'Content',
				screenshotImageURL: 'http://google.com.png',flag: 'pending', dateAdded: '2019-10-27 18:11:45'}]))
		const response = await request(adminServer).get(`${prefix}/admin/getAllReviews`)
		expect(response.status).toEqual(constants.SUCCESS)
		expect(response.type).toEqual('application/json')
		expect(response.body.message).toEqual([{Id: 1, userId: 1, gameId: 3,
			Title: 'Title', content: 'Content', screenshotImageURL: 'http://google.com.png',
			flag: 'approved', dateAdded: '2019-07-27 23:11:45'},
		{Id: 2, userId: 3, gameId: 5, Title: 'Title', content: 'Content',
			screenshotImageURL: 'http://google.com.png', flag: 'pending', dateAdded: '2019-10-27 18:11:45'}])
		done()
		reviewStub.restore()

	})
})

describe('routes: updateReviewFlag', () => {

	test('should return error on update review flag put request body is empty', async(done) => {
		const response = await request(adminServer).put(`${prefix}/admin/updateReviewFlag/2`)
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual({errors: {flag: 'Flag Must not be empty'}})
		done()
	})

	test('should return error on update review as flag is not approved', async(done) => {
		const response = await request(adminServer).put(`${prefix}/admin/updateReviewFlag/2`)
			.send({flag: 'pending'})
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual({flag: 'Flag must be set to approved to be updated'})
		done()
	})
	// const validatePendingStub = sinon.stub(reviewModel, 'getPendingReviewById').callsFake(() =>
	// 		Promise.resolve([{userId: 3, gameId: 1,
	// 			Title: 'Title', content: 'Content',screenshotImageURL: 'http://google.com.png'}]))
	test('should successfully updateReview', async(done) => {
		const validatePendingStub = sinon.stub(reviewModel, 'getPendingReviewsById').callsFake(() =>
			Promise.resolve([{userId: 3, gameId: 1,
				Title: 'Title', content: 'Content',screenshotImageURL: 'http://google.com.png'}]))
		const validateApprovedStub = sinon.stub(reviewModel, 'getApprovedReviewById').callsFake(() => Promise.resolve())
		const updateStub = sinon.stub(reviewModel, 'updateReviewFlag').callsFake(() => Promise.resolve())
		const response = await request(adminServer).put(`${prefix}/admin/updateReviewFlag/2`)
			.send({flag: 'approved'})
		expect(response.status).toEqual(constants.SUCCESS)
		expect(response.type).toEqual('application/json')
		expect(response.body.message).toEqual('Successfully updated flag')
		validatePendingStub.restore()
		validateApprovedStub.restore()
		updateStub.restore()
		done()
	})

	test('should successfully throw error as review not found', async(done) => {
		const validatePendingStub = sinon.stub(reviewModel, 'getPendingReviewsById').callsFake(() =>
			Promise.resolve())
		const response = await request(adminServer).put(`${prefix}/admin/updateReviewFlag/2`)
			.send({flag: 'approved'})
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual('Review does not exist')
		validatePendingStub.restore()
		done()
	})

	test('should successfully throw error on updateReview', async(done) => {
		const validatePendingStub = sinon.stub(reviewModel, 'getPendingReviewsById').callsFake(() =>
			Promise.resolve([{userId: 3, gameId: 1,
				Title: 'Title', content: 'Content',screenshotImageURL: 'http://google.com.png'}]))
		const validateApprovedStub = sinon.stub(reviewModel, 'getApprovedReviewById').callsFake(() =>
			Promise.resolve({userId: 2, gameId: 4, title: 'the Title', content: 'the Content'}))
		const response = await request(adminServer).put(`${prefix}/admin/updateReviewFlag/2`)
			.send({flag: 'approved'})
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual('Review already approved')
		validatePendingStub.restore()
		validateApprovedStub.restore()
		done()
	})

})

describe('routes: /deleteReview', () => {

	test('should return error on deleteReview post request as body is empty', async() => {
		const params = undefined
		const response = await request(adminServer).delete(`${prefix}/admin/deleteReview/${params}`)
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual({errors: {reviewId: 'Review Id Must be a number'}})
	})

	test('should successfully delete review', async(done) => {
		const reviewStub = sinon.stub(reviewModel, 'getPendingReviewsById').callsFake(() => Promise.resolve(2))
		const deleteStub = sinon.stub(reviewModel, 'deleteReview').callsFake(() => Promise.resolve())
		const response = await request(adminServer).delete(`${prefix}/admin/deleteReview/2`)
		expect(response.status).toEqual(constants.SUCCESS)
		expect(response.type).toEqual('application/json')
		expect(response.body.message).toEqual('Successfully deleted')
		reviewStub.restore()
		deleteStub.restore()
		done()
	})

	test('should return error on request as review could not be found', async(done) => {
		const reviewStub = sinon.stub(reviewModel, 'getPendingReviewsById').callsFake(() => Promise.resolve())
		const response = await request(adminServer).delete(`${prefix}/admin/deleteReview/2`)
			.query({reviewId: 2, userId: 2})
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual('Could not find review to delete')
		reviewStub.restore()
		done()
	})

})
