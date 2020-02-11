'use strict'
require('dotenv').config()
const temp = process.env.NODE_ENV
process.env.NODE_ENV = 'dev'
const server = require('./server')
const request = require('supertest')
const constants = require('./src/constants')
const prefix = '/api/v1.0/review'

afterEach(() => {
	server.close()
})

describe('routes: main server port', () => {

	test('server should be listening', async(done) => {
		const response = await request(server).post(`${prefix}/saveLike`)
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual({errors: {reviewId: 'Review Id Must not be empty',
			userId: 'User Id Must not be empty'}})
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

	test('should return error on saveLike post request as body is empty', async(done) => {
		const response = await request(server).post(`${prefix}/saveLike`)
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual({errors: {reviewId: 'Review Id Must not be empty',
			userId: 'User Id Must not be empty'}})
		done()
	})

	test('saerver should be listening', async(done) => {
		const response = await request(server).post(`${prefix}/saveLike`)
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual({errors: {reviewId: 'Review Id Must not be empty',
			userId: 'User Id Must not be empty'}})
		done()
	})


})


