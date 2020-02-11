'use strict'
const commentServer = require('../../../server')
const request = require('supertest')
const sinon = require('sinon')
const commentModel = require('../../models/comments')
const constants = require('../../constants')
const prefix = '/api/v1.0/comment'

afterEach(() => {
	commentServer.close()
	jest.clearAllMocks()
})

describe('routes: saveComment', () => {

	test('should return error on saveComment post request as body is empty', async(done) => {
		const validatorStub = sinon.stub(commentModel, 'getCommentByUserAndReviewId').callsFake(() => Promise.resolve())
		const response = await request(commentServer).post(`${prefix}/saveComment`)
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual({errors: {userId: 'User Id Must not be empty',
			title: 'Comment title Must not be empty', content: 'Comment content Must not be empty',
			reviewId: 'Review Id Must not be empty'}})
		validatorStub.restore()
		done()
	})

	test('should successfully saveComment on post request', async(done) => {
		const validatorStub = sinon.stub(commentModel, 'getCommentByUserAndReviewId').callsFake(() => Promise.resolve())
		const likeStub = sinon.stub(commentModel, 'savecomment').callsFake(() => Promise.resolve())
		const response = await request(commentServer).post(`${prefix}/saveComment`)
			.send({userId: 3, reviewId: 2, title: 'The title', content: 'this is the content'})
		expect(response.status).toEqual(constants.SUCCESS)
		expect(response.type).toEqual('application/json')
		expect(response.body.message).toEqual('Comment Successfully added')
		validatorStub.restore()
		likeStub.restore()
		done()
	})
})


describe('routes: getCommentsByUserAndReviewId', () => {

	test('should return error on getCommentsByUserAndReviewId by request as body is empty', async(done) => {
		const response = await request(commentServer).get(`${prefix}/getCommentsByUserAndReviewId`)
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual({errors: {userId: 'User Id Must not be empty',
			reviewId: 'Review Id Must not be empty'}})
		done()
	})

	test('should successfully return all comments byUserAndReviewId', async(done) => {
		const commentStub = sinon.stub(commentModel, 'getCommentByUserAndReviewId').callsFake(() =>
			Promise.resolve([{Id: 1, userId: 1, reviewId: 1, Title: 'titles', content: 'contents'}]))
		const response = await request(commentServer).get(`${prefix}/getCommentsByUserAndReviewId`)
			.query({userId: 1, reviewId: 2})
		expect(response.status).toEqual(constants.SUCCESS)
		expect(response.type).toEqual('application/json')
		expect(response.body.message).toEqual(
			[{Id: 1, userId: 1, reviewId: 1, Title: 'titles', content: 'contents'}])
		commentStub.restore()
		done()
	})

	test('should return error on request as comments could not be found', async(done) => {
		const likeStub = sinon.stub(commentModel, 'getCommentByUserAndReviewId').callsFake(() => Promise.resolve())
		const response = await request(commentServer).get(`${prefix}/getCommentsByUserAndReviewId`)
			.query({userId: 1, reviewId: 2})
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual('Could not find user comments on review')
		likeStub.restore()
		done()
	})
})

describe('routes: getAllCommentsByReviewID', () => {

	test('should return error on getAllCommentsByReviewId by request as body is empty', async(done) => {
		const response = await request(commentServer).get(`${prefix}/getAllCommentsByReviewID`)
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual({errors: {reviewId: 'Review Id Must not be empty'}})
		done()
	})

	test('should successfully return all comments byReviewId', async(done) => {
		const commentStub = sinon.stub(commentModel, 'getAllCommentsByReviewID').callsFake(() =>
			Promise.resolve([{Id: 1, userId: 1, reviewId: 1, Title: 'titles', content: 'contents'}]))
		const response = await request(commentServer).get(`${prefix}/getAllCommentsByReviewID`)
			.query({reviewId: 2})
		expect(response.status).toEqual(constants.SUCCESS)
		expect(response.type).toEqual('application/json')
		expect(response.body.message).toEqual(
			[{Id: 1, userId: 1, reviewId: 1, Title: 'titles', content: 'contents'}])
		commentStub.restore()
		done()
	})

	test('should return error on request as comments byReviewId as it could not be found', async(done) => {
		const commentStub = sinon.stub(commentModel, 'getAllCommentsByReviewID').callsFake(() => Promise.resolve())
		const response = await request(commentServer).get(`${prefix}/getAllCommentsByReviewID`)
			.query({userId: 1, reviewId: 2})
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual('Could not find comments on review')
		commentStub.restore()
		done()
	})
})

describe('routes: updateCommentByUserAndReviewId', () => {

	test('should return error on updateomment put request as body is empty', async(done) => {
		const response = await request(commentServer).put(`${prefix}/updateCommentByUserAndReviewId`)
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual({errors: {userId: 'User Id Must not be empty',
			title: 'Comment title Must not be empty', content: 'Comment content Must not be empty',
			reviewId: 'Review Id Must not be empty'}})
		done()
	})

	test('should return error on get comments byUserAndReviewId', async(done) => {
		const commentStub = sinon.stub(commentModel, 'getCommentByUserAndReviewId').callsFake(() => Promise.resolve())
		const response = await request(commentServer).put(`${prefix}/updateCommentByUserAndReviewId`)
			.send( {userId: 1, reviewId: 1, title: 'new Title',
				content: 'new Content'})
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual('Comment not found')
		commentStub.restore()
		done()
	})

	test('should successfully update comments byReviewAndUserId', async(done) => {
		const commentStub = sinon.stub(commentModel, 'getCommentByUserAndReviewId').callsFake(() =>
			Promise.resolve([{Id: 1, userId: 1, reviewId: 1, Title: 'titles', content: 'contents'}]))
		const updateStub = sinon.stub(commentModel, 'updateCommentByUserAndReviewId').callsFake(() => Promise.resolve())
		const response = await request(commentServer).put(`${prefix}/updateCommentByUserAndReviewId`)
			.send({userId: 1, reviewId: 1, title: 'new Title',
				content: 'new Content'})
		expect(response.status).toEqual(constants.SUCCESS)
		expect(response.type).toEqual('application/json')
		expect(response.body.message).toEqual('Successfully updated comment')
		commentStub.restore()
		updateStub.restore()
		done()
	})
})

describe('routes: /deleteComment', () => {

	test('should return error on deleteComment post request as body is empty', async() => {
		const response = await request(commentServer).delete(`${prefix}/deleteComment`)
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual({errors: {reviewId: 'Review Id Must not be empty',
			userId: 'User Id Must not be empty'}})
	})

	test('should successfully delete comment', async(done) => {
		const likeStub = sinon.stub(commentModel, 'getCommentByUserAndReviewId').callsFake(() =>
			Promise.resolve([{Id: 1, userId: 1, reviewId: 1, Title: 'titles', content: 'contents'}]))
		const deleteStub = sinon.stub(commentModel, 'deleteComment').callsFake(() => Promise.resolve())
		const response = await request(commentServer).delete(`${prefix}/deleteComment`)
			.query({reviewId: 1, userId: 2})
		expect(response.status).toEqual(constants.SUCCESS)
		expect(response.type).toEqual('application/json')
		expect(response.body.message).toEqual('Successfully deleted')
		likeStub.restore()
		deleteStub.restore()
		done()
	})

	test('should return error on request as comment could not be found', async(done) => {
		const likeStub = sinon.stub(commentModel, 'getCommentByUserAndReviewId').callsFake(() => Promise.resolve())
		const response = await request(commentServer).delete(`${prefix}/deleteComment`)
			.query({reviewId: 2, userId: 2})
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual('Could not find comment to delete')
		likeStub.restore()
		done()
	})
})
