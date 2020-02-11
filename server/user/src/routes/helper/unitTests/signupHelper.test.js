'use strict'

const signupHelper = require('../signupHelper')
const userModel = require('../../../models/user')
const {createMockContext} = require('@shopify/jest-koa-mocks')
const sinon = require('sinon')
const constants = require('../../../constants')

afterEach(() => {
	jest.clearAllMocks()
})

describe('checkForErrorsOnSignUp()', () => {

	test('should throw 400 BadRequest error, as username is not present', async(done) => {
		expect.assertions(1)
		const ctx = createMockContext({})
		await signupHelper.checkForErrorsOnSignUp({}, ctx)
		expect(ctx.throw).toBeCalledWith(constants.BAD_REQUEST, { title: 'Bad Request',
			detail: {errors: {username: 'Username Must not be empty', password: 'Password Must not be empty',
				confirmPassword: 'Confirm Password Must not be empty', email: 'Email Must not be empty',
				profileImageURL: 'Image Must not be empty', securityQuestion: 'Security question must be selected',
				securityAnswer: 'Security answer must be filled'}}})

		done()
	})

	test('should throw 400 BadRequest error, as user cannot signup as an admin', async(done) => {
		expect.assertions(1)
		const ctx = createMockContext({})
		const data = {username: 'Tom_admin', password: '.TomHarry12',
			confirmPassword: '.TomHarry12', email: 'tommHarry@gmail.com',
			profileImageURL: 'https://servmask.com/img/products/url.png',
			securityQuestion1: 'What is your dog name?', securityAnswer1: 'Marrie',
			securityQuestion2: 'What is your favourite meal?', securityAnswer2: 'Rice'}

		await signupHelper.checkForErrorsOnSignUp(data, ctx)
		expect(ctx.throw).toBeCalledWith(constants.BAD_REQUEST, { title: 'Bad Request',
			detail: {username: 'User cannot signup as an admin'}})

		done()
	})

	test('should successfully return username and email deleted status as true as user found and deleted', async(done) => {
		expect.assertions(1)

		const userStub = sinon.stub(userModel, 'getUserByUsername').callsFake(async(username) => {
			console.log(`MOCK get username with ${username}`)
			const data = {Username: 'Tom', Deleted: 1}
			return data

		})
		const emailStub = sinon.stub(userModel, 'getUserByEmail').callsFake(async(email) => {
			console.log(`MOCK get email with ${email}`)
			const data = {email: 'tommHarry@gmail.com', Deleted: 1}
			return data
		})
		const ctx = createMockContext({})
		const data = {username: 'Tom', password: '.TomHarry12',
			confirmPassword: '.TomHarry12', email: 'tommHarry@gmail.com',
			profileImageURL: 'https://servmask.com/img/products/url.png',
			securityQuestion1: 'What is your dog name?', securityAnswer1: 'Marrie',
			securityQuestion2: 'What is your favourite meal?', securityAnswer2: 'Rice'}


		const result = await signupHelper.checkForErrorsOnSignUp(data, ctx)
		expect(result).toStrictEqual({usernameDeleted: true, emailDeleted: true})
		done()
		userStub.restore()
		emailStub.restore()
	})

	test('should throw 400 BadRequest error, as username and email already exists', async(done) => {
		expect.assertions(1)

		const userStub = sinon.stub(userModel, 'getUserByUsername').callsFake(async(username) => {
			console.log(`MOCK get username with ${username}`)
			const data = {Username: 'Tom', Deleted: 0}
			return data

		})
		const emailStub = sinon.stub(userModel, 'getUserByEmail').callsFake(async(email) => {
			console.log(`MOCK get email with ${email}`)
			const data = {email: 'tommHarry@gmail.com', Deleted: 0}
			return data
		})
		const ctx = createMockContext({})
		const data = {username: 'Tom', password: '.TomHarry12',
			confirmPassword: '.TomHarry12', email: 'tommHarry@gmail.com',
			profileImageURL: 'https://servmask.com/img/products/url.png',
			securityQuestion1: 'What is your dog name?', securityAnswer1: 'Marrie',
			securityQuestion2: 'What is your favourite meal?', securityAnswer2: 'Rice'}

		await signupHelper.checkForErrorsOnSignUp(data, ctx)
		expect(ctx.throw).toBeCalledWith(constants.BAD_REQUEST, { title: 'Bad Request',
			detail: {errors: {username: 'Username already exists', email: 'Email address already exists'}}})
		done()
		userStub.restore()
		emailStub.restore()
	})

	test('should successfully return username and email deleted status as false if no user found', async(done) => {
		expect.assertions(1)

		const userStub = sinon.stub(userModel, 'getUserByUsername').callsFake(() => Promise.resolve(undefined))
		const emailStub = sinon.stub(userModel, 'getUserByEmail').callsFake(() => Promise.resolve(undefined))
		const ctx = createMockContext({})
		const data = {username: 'Tom', password: '.TomHarry12',
			confirmPassword: '.TomHarry12', email: 'tommHarry@gmail.com',
			profileImageURL: 'https://servmask.com/img/products/url.png',
			securityQuestion1: 'What is your dog name?', securityAnswer1: 'Marrie',
			securityQuestion2: 'What is your favourite meal?', securityAnswer2: 'Rice'}

		const result = await signupHelper.checkForErrorsOnSignUp(data, ctx)
		expect(result).toStrictEqual({usernameDeleted: false, emailDeleted: false})
		done()
		userStub.restore()
		emailStub.restore()
	})
})
