'use strict'
const commentServer = require('../../../server')
const request = require('supertest')
const sinon = require('sinon')
const likeModel = require('../../models/likes')
const commentModel = require('../../models/comments')
const commentValidator = require('../../validation/commentValidator')
const constants = require('../../constants')
const prefix = '/api/v1.0/comment'

afterEach(() => {
	commentServer.close()
	jest.clearAllMocks()
})

describe('routes: saveLike', () => {
	test('should return error on saveLike post request as body is empty', async(done) => {
		const response = await request(commentServer).post(`${prefix}/saveLike`)
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual({errors: {commentId: 'Comment Id Must not be empty',
			userId: 'User Id Must not be empty'}})
		done()
	})

	test('should return error on saveLike post request as comment does not exist', async(done) => {
		const validatorStub = sinon.stub(commentValidator, 'validateCommentLike').callsFake(async() => {
			console.log('MOCK commentvalidator error response')
			return {comment: 'Comment does not exist with the given Id'}
		})
		const response = await request(commentServer).post(`${prefix}/saveLike`)
			.send({userId: 3, commentId: 2})
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual({errors: {comment: 'Comment does not exist with the given Id'}})
		done()
		validatorStub.restore()
	})

	test('should return error on saveLike post request as like is false', async(done) => {
		const validatorStub = sinon.stub(commentValidator, 'validateCommentLike').callsFake(() => Promise.resolve({}))
		const response = await request(commentServer).post(`${prefix}/saveLike`)
			.send({userId: 3, commentId: 2, like: 'false'})
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual({Like: 'Like must be true'})
		done()
		validatorStub.restore()
	})

	test('shouldsuccessfully saveLike on post request', async(done) => {
		const validatorStub = sinon.stub(commentValidator, 'validateCommentLike').callsFake(() => Promise.resolve({}))
		const likeStub = sinon.stub(likeModel, 'savelike').callsFake(() => Promise.resolve())
		const response = await request(commentServer).post(`${prefix}/saveLike`)
			.send({userId: 3, commentId: 2, like: 'true'})
		expect(response.status).toEqual(constants.SUCCESS)
		expect(response.type).toEqual('application/json')
		expect(response.body.message).toEqual('Like Successfully added')
		done()
		validatorStub.restore()
		likeStub.restore()
	})
})


describe('routes: getAllLikesBycommentID', () => {
	test('should return error on request as body is empty', async(done) => {
		const response = await request(commentServer).get(`${prefix}/getAllLikesBycommentID`)
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual({errors: {commentId: 'Comment Id Must not be empty'}})
		done()
	})

	test('should return error on request as comment does not exist', async(done) => {
		const validatorStub = sinon.stub(commentModel, 'getCommentById').callsFake(() => Promise.resolve())
		const response = await request(commentServer).get(`${prefix}/getAllLikesBycommentID`)
			.query({commentId: 2})
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual('Comment does not exist with the given Id')
		done()
		validatorStub.restore()

	})

	test('should successfully return all likes', async(done) => {
		const validatorStub = sinon.stub(commentModel, 'getCommentById').callsFake(() => Promise.resolve(2))
		const likeStub = sinon.stub(likeModel, 'getAllLikesBycommentID').callsFake(() =>
			Promise.resolve([{userId: 1, commentId: 1, liker: 1}, {userId: 2, commentId: 1, liker: 1}]))
		const response = await request(commentServer).get(`${prefix}/getAllLikesBycommentID`)
			.query({commentId: 2})
		expect(response.status).toEqual(constants.SUCCESS)
		expect(response.type).toEqual('application/json')
		expect(response.body.message).toEqual(
			[{userId: 1, commentId: 1, liker: 1}, {userId: 2, commentId: 1, liker: 1}])
		done()
		validatorStub.restore()
		likeStub.restore()
	})

	test('should return error on request as likes could not be found', async(done) => {
		const validatorStub = sinon.stub(commentModel, 'getCommentById').callsFake(() => Promise.resolve(2))
		const likeStub = sinon.stub(likeModel, 'getAllLikesBycommentID').callsFake(() => Promise.resolve())
		const response = await request(commentServer).get(`${prefix}/getAllLikesBycommentID`)
			.query({commentId: 2})
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual('Could not get likes with the commentId')
		done()
		validatorStub.restore()
		likeStub.restore()
	})
})

describe('routes: /deleteLike', () => {
	test('should return error on deleteLike post request as body is empty', async(done) => {
		const response = await request(commentServer).delete(`${prefix}/deleteLike`)
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual({errors: {commentId: 'Comment Id Must not be empty',
			userId: 'User Id Must not be empty'}})
		done()
	})

	test('should successfully remove like', async(done) => {
		const likeStub = sinon.stub(likeModel, 'getLikeByUserAndCommentId').callsFake(() =>
			Promise.resolve([{userId: 1, commentId: 1, liker: 1}, {userId: 2, commentId: 1, liker: 1}]))
		const deleteStub = sinon.stub(likeModel, 'deleteLike').callsFake(() => Promise.resolve())
		const response = await request(commentServer).delete(`${prefix}/deleteLike`)
			.query({commentId: 1, userId: 2})
		expect(response.status).toEqual(constants.SUCCESS)
		expect(response.type).toEqual('application/json')
		expect(response.body.message).toEqual('Successfully deleted')
		done()
		likeStub.restore()
		deleteStub.restore()
	})

	test('should return error on request as like could not be found on comment', async(done) => {
		const likeStub = sinon.stub(likeModel, 'getLikeByUserAndCommentId').callsFake(() => Promise.resolve())
		const response = await request(commentServer).delete(`${prefix}/deleteLike`)
			.query({commentId: 2, userId: 2})
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual('Could not find like on comment')
		done()
		likeStub.restore()
	})

})
