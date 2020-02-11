'use strict'

const encrypt = require('../encrypt')
const bcrypt = require('bcrypt-promise')
const sinon = require('sinon')

let bcryptSaltStub, bcryptHashStub

afterEach(() => {
	jest.clearAllMocks()
})

describe('password encryption', () => {

	test('should successfully return data of password hashed with the salt', async(done) => {
		expect.assertions(4)
		const data = {username: 'Tom', password: '.TomHarry12',
			confirmPassword: '.TomHarry12', email: 'tommHarry@gmail.com',
			firstname: 'Tom', lastname: 'Harry',
			dob: '18/04/2000', profileImageURL: 'https://servmask.com/img/products/url.png',
			securityQuestion1: 'What is your dog name?', securityAnswer1: 'Marrie',
			securityQuestion2: 'What is your favourite meal?', securityAnswer2: 'Rice'}

		const result = await encrypt(data)
		expect(result.password).toBeDefined()
		expect(result.password).toEqual(expect.not.stringMatching('.TomHarry12'))
		expect(result.confirmPassword).toBeDefined()
		expect(result.confirmPassword).toEqual(expect.not.stringMatching('.TomHarry12'))
		done()
	})

	test('should successfully return data without confirm password of password hashed with the salt', async(done) => {
		expect.assertions(3)
		const data = {username: 'admin', password: '.admin'}
		const result = await encrypt(data)
		expect(result.password).toBeDefined()
		expect(result.password).toEqual(expect.not.stringMatching('.admin'))
		expect(result.confirmPassword).toBeUndefined()
		done()
	})
})

describe('generating salt', () => {

	beforeEach( () => {
		bcryptSaltStub = sinon.stub(bcrypt, 'genSalt').callsFake( () => new Promise(() => {
			throw new Error('salt error')
		}))
		bcryptHashStub = sinon.stub(bcrypt, 'hash').callsFake( () => Promise.resolve('hash generated'))
	})
	afterEach(() => {
		bcryptSaltStub.restore()
		bcryptHashStub.restore()
	})
	test('should throw error on generating salt', async(done) => {
		expect.assertions(1)
		await encrypt({}).catch(err => {
			expect(err).toStrictEqual(Error('salt error'))
		})
		done()
	})
})


describe('generating password hash', () => {

	beforeEach( () => {
		bcryptSaltStub = sinon.stub(bcrypt, 'genSalt').callsFake( () => Promise.resolve('salt generated'))
		bcryptHashStub = sinon.stub(bcrypt, 'hash').callsFake( () => new Promise(() => {
			throw new Error('hash error')
		}))
	})
	afterEach(() => {
		bcryptSaltStub.restore()
		bcryptHashStub.restore()
	})
	test('should throw error whilst hashing', async(done) => {
		expect.assertions(1)
		await encrypt({}).catch(err => {
			expect(err).toStrictEqual(Error('hash error'))
		})
		done()
	})
})
