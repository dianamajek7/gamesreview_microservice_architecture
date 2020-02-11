'use strict'
require('dotenv').config()
const temp = process.env.NODE_ENV
process.env.NODE_ENV = 'dev'
const server = require('./server')
const request = require('supertest')
const constants = require('./src/constants')
const gameModel = require('./src/models/game')
const sinon = require('sinon')
const prefix = '/api/v1.0/game'

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

	test('should return error on saveRate post game could not be found', async(done) => {
		const gameStub = sinon.stub(gameModel, 'getGameById').callsFake(() => Promise.resolve())
		const response = await request(server).post(`${prefix}/saveRate`)
			.send({userId: 1, title: 'GTA', rate: 3.25,
				description: 'description', image: 'http://google.com.png'})
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual({errors: {game: 'Game title could not be found'}})
		gameStub.restore()
		done()
	})

})


