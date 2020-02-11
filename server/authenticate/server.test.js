'use strict'
require('dotenv').config()
const sinon = require('sinon')
const jwt = require('jsonwebtoken')
const constants = require('./src/constants')
const tokenModel = require('./src/models/tokenBlackList')
let server, request, temp

describe('routes: main server port', () => {

	beforeAll(() => {
		temp = process.env.NODE_ENV
		process.env.NODE_ENV = 'dev'
		server = require('./server')
		request = require('supertest')
	})

	afterEach(() => {
		server.close()
		jest.clearAllMocks()
		process.env.NODE_ENV = 'test'
	})


	test('server should be listening', async(done) => {
		const response = await request(server).get('/')
		expect(response.status).toEqual(constants.FORBIDDEN)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Forbidden')
		expect(response.body.detail).toEqual('No token, Authentication Failed')
		process.env.NODE_ENV = temp
		done()
	})
})

describe('routes: main server entrypoint', () => {

	beforeAll(() => {
		server = require('./server')
		request = require('supertest')
	})

	afterEach(() => {
		server.close()
		jest.clearAllMocks()
	})

	test('should return error as token not provided in header', async(done) => {
		const response = await request(server).get('/')
		expect(response.status).toEqual(constants.FORBIDDEN)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Forbidden')
		expect(response.body.detail).toEqual('No token, Authentication Failed')
		done()
	})

	test('should return error as token is blackListed', async(done) => {
		const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ejk441jk590YXV0aF9hZG1pbiIsI
		mlhdCI6MTU3Mzg4NzA1NywiZXhwIjoxNTczODkwNjU3fQ.4pmkrhoo-k7Ao7CNa`
		const tokenStub = sinon.stub(tokenModel, 'getTokenBlackListed').callsFake(() =>
			Promise.resolve([{Id: 1, token: 'some_token'}]))
		const response = await request(server).get('/').auth(`Bearer ${token}`)
		expect(response.status).toEqual(constants.FORBIDDEN)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Forbidden')
		expect(response.body.detail).toEqual('Token no longer valid, Authentication Failed')
		tokenStub.restore()
		done()
	})

	test('should successfully authenticate request', async(done) => {
		const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ejk441jk590YXV0aF9hZG1pbiIsI
		mlhdCI6MTU3Mzg4NzA1NywiZXhwIjoxNTczODkwNjU3fQ.4pmkrhoo-k7Ao7CNa`

		const blackListTokenStub = sinon.stub(tokenModel, 'getTokenBlackListed').callsFake(() => Promise.resolve())
		const jwtStub = sinon.stub(jwt, 'verify').callsFake(() => Promise.resolve({userId: 1, name: 'user'}))
		const response = await request(server).get('/').auth(`Bearer ${token}`)
		expect(response.status).toEqual(constants.SUCCESS)
		blackListTokenStub.restore()
		jwtStub.restore()
		done()
	})
})

describe('routes: main server entrypoint', () => {
	test('should succesfully listen', async(done) => {

		process.env.NODE_ENV = 'test'
		const supertest = require('supertest')
		const app = require('./server')
		let request = null
		let server = null

		server = app.listen(done)
		request = supertest.agent(server)
		request.get('/')
			.expect(constants.FORBIDDEN, {
				title: 'Forbidden',
				status: 403,
				detail: 'No token, Authentication Failed'
			 })
		server.close(done)
		done()
		jest.clearAllMocks()
	})

	test('should succesfully listen and throw error', async(done) => {

		const supertest = require('supertest')
		const app = require('./server')
		let request = null
		let server = null
		server = app.listen(done)
		request = supertest.agent(server)
		request.get('/')
			.expect(constants.FORBIDDEN, {
				title: 'Forbidden',
				status: 403,
				detail: 'No token, Authentication Failed'
			 })
		server.close(done)
		done()
		jest.clearAllMocks()
	})
})

describe('routes', () => {

	afterEach(() => {
		jest.clearAllMocks()
	})
	test(' GET /', async(done) => {
		process.env.NODE_ENV = 'test'
		const supertest = require('supertest')
		const app = require('./server')
		supertest(app)
		expect(app.listen()).toBeDefined()
		app.close()
		done()
	})
})


