'use strict'

const generateAuth = require('../generateAuth')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt-promise')
const constants = require('../../../constants')
const sinon = require('sinon')

let jwtStub, bcryptStub

afterEach(() => {
	jest.clearAllMocks()
})

describe('generate Token on valid password', () => {

	beforeEach( () => {
		bcryptStub = sinon.stub(bcrypt, 'compare').callsFake(() => Promise.resolve(true))
		jwtStub = sinon.stub(jwt, 'sign').callsFake(() => Promise.resolve('.TomHarry12'))
	})
	afterEach(() => {
		jwtStub.restore()
		bcryptStub.restore()
	})
	test('should successfully return token', async(done) => {
		expect.assertions(1)
		const username = 'Tomm'
		const password = '.TomHarry12'
		const currentUser = {password: '.TomHarry12'}

		const result = await generateAuth(username, password, currentUser)
		expect(result).toStrictEqual('.TomHarry12')
		done()
	})
})

describe('error on invalid password', () => {

	beforeEach( () => {
		bcryptStub = sinon.stub(bcrypt, 'compare').callsFake(() => Promise.resolve(false))
	})
	afterEach(() => {
		bcryptStub.restore()
	})
	test('should throw 401 error with passwords not matching', async(done) => {
		const username = 'Tomm'
		const password = '.TomHarry12'
		const currentUser = {password: '.TomHarry2'}

		await generateAuth(username, password, currentUser).catch(err => {
			expect.assertions(3)
			expect(err.status).toBe(constants.UNAUTHORIZED)
			expect(err.title).toEqual('Unauthorized')
			expect(err.detail).toEqual({errors: {password: 'Incorrect password'}})
		})
		done()
	})
})
