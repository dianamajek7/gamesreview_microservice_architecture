'use strict'
const adminServer = require('../../../server')
const request = require('supertest')
const sinon = require('sinon')
const adminModel = require('../../models/admin')
const constants = require('../../constants')
const prefix = '/api/v1.0/comment'

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
		const response = await request(adminServer).post(`${prefix}/admin/create_comments_db`)
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
		const response = await request(adminServer).post(`${prefix}/admin/create_comments_db`)
		expect(response.status).toEqual(constants.INTERNAL_SERVER_ERROR)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Internal Server Error')
		expect(response.body.detail).toEqual('Error occurred whilst processing DB tables')
		adminModelStub.restore()
		done()
	})
})
