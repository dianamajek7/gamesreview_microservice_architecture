'use strict'

const userController = require('../userController')
const userModel = require('../../models/user')
const {createMockContext} = require('@shopify/jest-koa-mocks')
const sinon = require('sinon')
const constants = require('../../constants')

let saveUserStub, savePasswordReminderStub

afterEach(() => {
	jest.clearAllMocks()
})

describe('newUser()', () => {
	beforeEach( () => {
		saveUserStub = sinon.stub(userModel, 'registerUser').callsFake(() => Promise.resolve(1))
		savePasswordReminderStub = sinon.stub(userModel, 'savePasswordReminder').callsFake(() => Promise.resolve())
	})
	afterEach(() => {
		saveUserStub.restore()
		savePasswordReminderStub.restore()
	})
	test('should successfully add new user credentials', async(done) => {
		expect.assertions(2)
		const ctx = createMockContext({})
		const result = {username: 'i_AMAUSER', password: 'user_strongPasswordEncrypted',
			Email: 'user@gmail.com', profileImageURL: 'http://www.google.com.png' }

		const response = await userController.newUser(result, ctx).then( () => ({status: ctx.status, body: ctx.body}) )
		expect(response.status).toBe(constants.SUCCESS)
		expect(response.body).toStrictEqual({ message: 'User Created Successfully'})
		done()
	})
})

describe('deletedUser()', () => {
	test('should successfully add previously deleted user credentials indicated by email deleted', async(done) => {
		expect.assertions(2)
		saveUserStub = sinon.stub(userModel, 'updateDeletedUser').callsFake(() => Promise.resolve(1))
		savePasswordReminderStub = sinon.stub(userModel, 'updatePasswordReminder').callsFake(() => Promise.resolve())
		const ctx = createMockContext({})
		const result = {username: 'i_AMAUSER', password: 'user_strongPasswordEncrypted',
			Email: 'user@gmail.com', profileImageURL: 'http://www.google.com.png' }

		const response = await userController.deletedUser(result, true, false, ctx)
			.then( () => ({status: ctx.status, body: ctx.body}) )
		expect(response.status).toBe(constants.SUCCESS)
		expect(response.body).toStrictEqual({ message: 'User Created Successfully'})
		saveUserStub.restore()
		savePasswordReminderStub.restore()
		done()
	})
	test('should successfully add previously deleted user credentials indicated by username deleted', async(done) => {
		expect.assertions(2)
		saveUserStub = sinon.stub(userModel, 'updateDeletedUser').callsFake(() => Promise.resolve(1))
		savePasswordReminderStub = sinon.stub(userModel, 'updatePasswordReminder').callsFake(() => Promise.resolve())
		const ctx = createMockContext({})
		const result = {username: 'i_AMAUSER', password: 'user_strongPasswordEncrypted',
			Email: 'user@gmail.com', profileImageURL: 'http://www.google.com.png' }

		const response = await userController.deletedUser(result,false, true, ctx)
			.then( () => ({status: ctx.status, body: ctx.body}) )
		expect(response.status).toBe(constants.SUCCESS)
		expect(response.body).toStrictEqual({ message: 'User Created Successfully'})
		saveUserStub.restore()
		savePasswordReminderStub.restore()
		done()
	})
})

describe('checkForErrorsOnLogin()', () => {

	test('should throw 401 Unauthorized error, as user or admin is not present', async(done) => {
		expect.assertions(1)
		const ctx = createMockContext({})
		await userController.checkForErrorsOnLogin({}, {}, ctx)
		expect(ctx.throw).toBeCalledWith(constants.UNAUTHORIZED, { title: 'Unauthorized',
			detail: 'Authentication failed, Unkown User'})
		done()
	})

	test('should throw 401 Unauthorized error, as user is deleted', async(done) => {
		expect.assertions(1)
		const ctx = createMockContext({})
		await userController.checkForErrorsOnLogin({Deleted: true, Active: false}, {}, ctx)
		expect(ctx.throw).toBeCalledWith(constants.UNAUTHORIZED, { title: 'Unauthorized',
			detail: 'Authentication failed'})
		done()
	})

	test('should successfully return no errors, as user is not deleted', async(done) => {
		expect.assertions(1)
		const ctx = createMockContext({})
		await userController.checkForErrorsOnLogin({Deleted: false, Active: true}, {}, ctx)
		expect(ctx.throw).not.toHaveBeenCalled()
		done()
	})

	test('should throw 401 Unauthorized error, as user is inactivated', async(done) => {
		expect.assertions(1)
		const ctx = createMockContext({})
		await userController.checkForErrorsOnLogin({Active: false, Deleted: false}, {}, ctx)
		expect(ctx.throw).toBeCalledWith(constants.UNAUTHORIZED, { title: 'Unauthorized',
			detail: 'Account Deactive'})
		done()
	})

	test('should successfully return no errors, as user is activated', async(done) => {
		expect.assertions(1)
		const ctx = createMockContext({})
		await userController.checkForErrorsOnLogin({Active: true, Deleted: false}, {}, ctx)
		expect(ctx.throw).not.toHaveBeenCalled()
		done()
	})

	test('should successfully return no errors on admin present', async(done) => {
		expect.assertions(1)
		const ctx = createMockContext({})
		await userController.checkForErrorsOnLogin({}, {adminName: 'i_AMADMIN'}, ctx)
		expect(ctx.throw).not.toHaveBeenCalled()
		done()
	})
})
