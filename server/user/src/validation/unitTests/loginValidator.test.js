'use strict'

const loginValidator = require('../loginValidator')

describe('validate LoginValidator', () => {

	test('username and password value is empty, must return errors within errors object', async(done) => {
		expect.assertions(1)
		const data = { username: '', password: ''}
		const result = await loginValidator(data)
		const expectedResult = {username: 'Username Must not be empty', password: 'Password Must not be empty' }
		expect(result).toEqual(expectedResult)
		done()
	})

	test('username value is empty, must return an error within errors object', async(done) => {
		expect.assertions(1)
		const data = {password: 'bnb'}
		const result = await loginValidator(data)
		const expectedResult = {username: 'Username Must not be empty'}
		expect(result).toEqual(expectedResult)
		done()
	})

	test('password value is empty, must return an error within errors object', async(done) => {
		expect.assertions(1)
		const data = { username: 'bnb'}
		const result = await loginValidator(data)
		const expectedResult = {password: 'Password Must not be empty' }
		expect(result).toEqual(expectedResult)
		done()
	})

	test(`username and password value is present, must return a success validation 
	with no errors in errors object`, async(done) => {
		expect.assertions(1)
		const data = { username: 'Tom', password: 'Ford'}
		const result = await loginValidator(data)
		const expectedResult = {}
		expect(result).toEqual(expectedResult)
		done()
	})

})
