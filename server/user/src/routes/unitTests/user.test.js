'use strict'
const userServer = require('../../../server')
const request = require('supertest')
const sinon = require('sinon')
const bcrypt = require('bcrypt-promise')
const jwt = require('jsonwebtoken')
const userModel = require('../../models/user')
const adminModel = require('../../models/admin')
const signupHelper = require('../helper/signupHelper')
const constants = require('../../constants')
const prefix = '/api/v1.0/user'

afterEach(() => {
	userServer.close()
	jest.clearAllMocks()
})

describe('routes: user on post login', () => {

	test('should return error on post login with no credentials', async(done) => {
		const ctx = jest.fn( () => ctx.request.body = {} )
		const response = await request(userServer).post(`${prefix}/login`)
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual({username: 'Username Must not be empty',
			password: 'Password Must not be empty'})
		done()
	})

	test('should successfully return token on user login post request', async(done) => {
		const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYXV0aF9hZG1pbiIsI
		mlhdCI6MTU3Mzg4NzA1NywiZXhwIjoxNTczODkwNjU3fQ.4pmkrhoo-k7Ao7CNa`
		const getUserStub = sinon.stub(userModel, 'getUserLoginCred').callsFake(() =>
			Promise.resolve({Password: '.TomHarry12', Active: true, Deleted: false}))
		const getAdminStub = sinon.stub(adminModel, 'getAdminLoginCred').callsFake(() => Promise.resolve({}))
		const bycryptStub = sinon.stub(bcrypt, 'compare').callsFake(() => Promise.resolve(true))
		const jwtStub = sinon.stub(jwt, 'sign').callsFake(() => Promise.resolve(token))

		const response = await request(userServer).post(`${prefix}/login`)
			.send({username: 'Tom', password: '.TomHarry12'})
		expect(response.status).toEqual(constants.SUCCESS)
		expect(response.type).toEqual('application/json')
		expect(response.body.success).toBeTruthy()
		expect(response.body.token).toEqual(`Bearer ${token}`)
		getUserStub.restore()
		getAdminStub.restore()
		bycryptStub.restore()
		jwtStub.restore()
		done()
	})

	test('should successfully return token on admin login post request', async(done) => {
		const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ejk441jk590YXV0aF9hZG1pbiIsI
		mlhdCI6MTU3Mzg4NzA1NywiZXhwIjoxNTczODkwNjU3fQ.4pmkrhoo-k7Ao7CNa`
		const getUserStub = sinon.stub(userModel, 'getUserLoginCred').callsFake(() => Promise.resolve({}))
		const getAdminStub = sinon.stub(adminModel, 'getAdminLoginCred').callsFake(() =>
			Promise.resolve({adminName: 'IAMAdmin', Password: '.AdminMain11'}))
		const bycryptStub = sinon.stub(bcrypt, 'compare').callsFake(() => Promise.resolve(true))
		const jwtStub = sinon.stub(jwt, 'sign').callsFake(() => Promise.resolve(token))

		const response = await request(userServer).post(`${prefix}/login`)
			.send({username: 'IAMAdmin', password: '.AdminMain11'})
		expect(response.status).toEqual(constants.SUCCESS)
		expect(response.type).toEqual('application/json')
		expect(response.body.success).toBeTruthy()
		expect(response.body.token).toEqual(`Bearer ${token}`)
		getUserStub.restore()
		getAdminStub.restore()
		bycryptStub.restore()
		jwtStub.restore()
		done()
	})
})

describe('routes: user on post signup', () => {

	test('should successfully signup a new user on post request', async(done) => {
		const data = {username: 'Tom', password: '.TomHarry12',
			confirmPassword: '.TomHarry12', email: 'tommHarry@gmail.com',
			profileImageURL: 'https://servmask.com/img/products/url.png',
			securityQuestion1: 'What is your dog name?', securityAnswer1: 'Marrie',
			securityQuestion2: 'What is your favourite meal?', securityAnswer2: 'Rice'}

		const helperStub = sinon.stub(signupHelper, 'checkForErrorsOnSignUp').callsFake(() =>
			Promise.resolve({usernameDeleted: false, emailDeleted: false}))
		const registerUserStub = sinon.stub(userModel, 'registerUser').callsFake(() => Promise.resolve(1))
		const savePasswordStub = sinon.stub(userModel, 'savePasswordReminder').callsFake(() => Promise.resolve())
		const bycryptSaltStub = sinon.stub(bcrypt, 'genSalt').callsFake(() => Promise.resolve('some_generatedSalt'))
		const bycryptHashStub = sinon.stub(bcrypt, 'hash').callsFake(() => Promise.resolve('some_HashedPassword'))

		const response = await request(userServer).post(`${prefix}/signup`)
			.send(data)
		expect(response.status).toEqual(constants.SUCCESS)
		expect(response.type).toEqual('application/json')
		expect(response.body.message).toEqual('User Created Successfully')
		helperStub.restore()
		registerUserStub.restore()
		savePasswordStub.restore()
		bycryptSaltStub.restore()
		bycryptHashStub.restore()
		done()
	})

	test('should successfully signup a previosuly deleted user on post request', async(done) => {
		const data = {username: 'Tom', password: '.TomHarry12',
			confirmPassword: '.TomHarry12', email: 'tommHarry@gmail.com',
			profileImageURL: 'https://servmask.com/img/products/url.png',
			securityQuestion1: 'What is your dog name?', securityAnswer1: 'Marrie',
			securityQuestion2: 'What is your favourite meal?', securityAnswer2: 'Rice'}

		const helperStub = sinon.stub(signupHelper, 'checkForErrorsOnSignUp').callsFake(() =>
			Promise.resolve({usernameDeleted: true, emailDeleted: true}))
		const updateUserStub = sinon.stub(userModel, 'updateDeletedUser').callsFake(() => Promise.resolve(2))
		const updatePasswordStub = sinon.stub(userModel, 'updatePasswordReminder').callsFake(() => Promise.resolve())
		const bycryptSaltStub = sinon.stub(bcrypt, 'genSalt').callsFake(() => Promise.resolve('some_generatedSalt'))
		const bycryptHashStub = sinon.stub(bcrypt, 'hash').callsFake(() => Promise.resolve('some_HashedPassword'))
		const response = await request(userServer).post(`${prefix}/signup`)
			.send(data)
		expect(response.status).toEqual(constants.SUCCESS)
		expect(response.type).toEqual('application/json')
		expect(response.body.message).toEqual('User Created Successfully')
		helperStub.restore()
		updateUserStub.restore()
		updatePasswordStub.restore()
		bycryptSaltStub.restore()
		bycryptHashStub.restore()
		done()
	})

})

describe('routes: getAllUserDataById', () => {

	test('should return error on getAllUserDataById request as body is empty', async(done) => {
		const response = await request(userServer).get(`${prefix}/getAllUserDataById`)
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual({errors: {Id: 'User Id Required'} })
		done()
	})

	test('should successfully getgameId on request', async(done) => {
		const data = {Id: 1, Username: 'Tom', Password: '.TomHarry12',
			Email: 'tommHarry@gmail.com',
			profileImageURL: 'https://servmask.com/img/products/url.png', About: 'My name is Tom',
			role: 0, Active: 1, Deleted: 0, dateRegistered: '2019-10-27 18:11:45' }
		const gameStub = sinon.stub(userModel, 'getAllUserDataById').callsFake(() => Promise.resolve(data))
		const response = await request(userServer).get(`${prefix}/getAllUserDataById`)
			.query({Id: 1})
		expect(response.status).toEqual(constants.SUCCESS)
		expect(response.type).toEqual('application/json')
		expect(response.body.message).toEqual(data)
		gameStub.restore()
		done()
	})

	test('should return error on request as user data could not be found', async(done) => {
		const userStub = sinon.stub(userModel, 'getAllUserDataById').callsFake(() => Promise.resolve())
		const response = await request(userServer).get(`${prefix}/getAllUserDataById`)
			.query({Id: 1})
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual('Could not get user credentials with the userId')
		userStub.restore()
		done()
	})
})


describe('routes: user on post logout', () => {

	test('should return error on post logout with no token provided', async(done) => {
		const ctx = jest.fn( () => ctx.headers.authorization = {} )
		const response = await request(userServer).post(`${prefix}/logout`)
		expect(response.status).toEqual(constants.FORBIDDEN)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Forbidden')
		expect(response.body.detail).toEqual('Token missing')
		done()
	})


	test('should throw error on request as token as been blackListed on logout', async(done) => {
		const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ejk441jk590YXV0aF9hZG1pbiIsI
		mlhdCI6MTU3Mzg4NzA1NywiZXhwIjoxNTczODkwNjU3fQ.4pmkrhoo-k7Ao7CNa`

		const getBlackListTokenStub = sinon.stub(userModel, 'getBlackListToken')
			.callsFake(() => Promise.resolve([{Id: 1, token}]))
		const response = await request(userServer).post(`${prefix}/logout`).auth(`Bearer ${token}`)
		expect(response.status).toEqual(constants.BAD_REQUEST)
		expect(response.type).toEqual('application/json')
		expect(response.body.title).toEqual('Bad Request')
		expect(response.body.detail).toEqual('User already logged out')
		getBlackListTokenStub.restore()
		done()
	})
	test('should successfully blackList a token on logout request', async(done) => {
		const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ejk441jk590YXV0aF9hZG1pbiIsI
		mlhdCI6MTU3Mzg4NzA1NywiZXhwIjoxNTczODkwNjU3fQ.4pmkrhoo-k7Ao7CNa`
		const getBlackListTokenStub = sinon.stub(userModel, 'getBlackListToken').callsFake(() => Promise.resolve())
		const blackListTokenStub = sinon.stub(userModel, 'blackListToken').callsFake(() => Promise.resolve({}))
		const response = await request(userServer).post(`${prefix}/logout`).auth(`Bearer ${token}`)
		expect(response.status).toEqual(constants.SUCCESS)
		expect(response.type).toEqual('application/json')
		expect(response.body.message).toEqual('Successfully logged out')
		getBlackListTokenStub.restore()
		blackListTokenStub.restore()
		done()
	})
})

