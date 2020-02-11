'use strict'
require('dotenv').config()
const temp = process.env.NODE_ENV
process.env.NODE_ENV = 'dev'
const server = require('./server')
const request = require('supertest')
const constants = require('./src/constants')
const commentModel = require('./src/models/comments')
const sinon = require('sinon')
const prefix = '/api/v1.0/comment'

afterEach(() => {
	server.close()
	jest.clearAllMocks()
})

describe('routes: main server port', () => {

	test('server should be listening', async(done) => {
		const response = await request(server).post(`${prefix}/trips`)
		expect(response.status).toEqual(constants.NOT_FOUND)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Not Found')
		expect(response.body.detail).toEqual('Not Available')
		process.env.NODE_ENV = temp
		done()
	})
})

describe('routes: main server entrypoint', () => {
	test('should return error on request to uknown path post', async(done) => {
		const response = await request(server).post(`${prefix}/trips`)
		expect(response.status).toEqual(constants.NOT_FOUND)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Not Found')
		expect(response.body.detail).toEqual('Not Available')
		done()
	})
	test('should return error on request to uknown path get', async(done) => {
		const response = await request(server).get(`${prefix}/trips`)
		expect(response.status).toEqual(constants.NOT_FOUND)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Not Found')
		expect(response.body.detail).toEqual('Not Available')
		done()
	})

	test('should successfully delete comment', async(done) => {
		const commentStub = sinon.stub(commentModel, 'getCommentByUserAndReviewId').callsFake(() =>
			Promise.resolve([{Id: 1, userId: 1, reviewId: 1, Title: 'titles', content: 'contents'}]))
		const deleteStub = sinon.stub(commentModel, 'deleteComment').callsFake(() => Promise.resolve())
		const response = await request(server).delete(`${prefix}/deleteComment`)
			.query({reviewId: 1, userId: 2})
		expect(response.status).toEqual(constants.SUCCESS)
		expect(response.type).toEqual('application/json')
		expect(response.body.message).toEqual('Successfully deleted')
		done()
		commentStub.restore()
		deleteStub.restore()
	})
})


