'use strict'
require('dotenv').config()
const server = require('./server')
const request = require('supertest')
const constants = require('./src/constants')
const adminModel = require('./src/models/admin')
const sinon = require('sinon')
const prefix = '/api/v1.0/user'

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

	test('should successfully return create_user_db post request as it is a valida path', async(done) => {
		const adminModelStub = sinon.stub(adminModel, 'createTables').callsFake(async() => {
			console.log('MOCK createTables')
			return {message: 'created successfully'}

		})
		const response = await request(server).post('/api/v1.0/user/admin/create_user_db')
		expect(response.status).toEqual(constants.SUCCESS)
		expect(response.type).toEqual('application/json')
		expect(response.body.message).toEqual('created successfully')
		adminModelStub.restore()
		done()
	})
})
