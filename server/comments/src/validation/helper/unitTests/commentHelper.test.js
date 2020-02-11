'use strict'

const commentHelper = require('../commentHelper')

describe('validateTitle()', () => {

	test('title value is empty, must return an error', async(done) => {
		expect.assertions(1)
		const result = commentHelper.validateTitle('')
		const expectedResult = { valid: false, error: 'Comment title Must not be empty' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('title contains no letter, must return an error', async(done) => {
		expect.assertions(1)
		const result = commentHelper.validateTitle('123')
		const expectedResult = { valid: false, error: 'Comment title Must contain only letters' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('title contains letters, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = commentHelper.validateTitle('Tom')
		expect(result).toBeTruthy()
		done()
	})

})

describe('validatLike()', () => {

	test('like value is empty, must return an error', async(done) => {
		expect.assertions(1)
		const result = commentHelper.validateLike('')
		const expectedResult = { valid: false, error: 'Like Must not be empty' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('like contains no letter, must return an error', async(done) => {
		expect.assertions(1)
		const result = commentHelper.validateLike('123')
		const expectedResult = { valid: false, error: 'Like Must contain only letters' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('like contains letters, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = commentHelper.validateLike('Tom')
		expect(result).toBeTruthy()
		done()
	})

})

describe('validateContent()', () => {

	test('summary value is empty, must return an error', async(done) => {
		expect.assertions(1)
		const result = commentHelper.validateContent('')
		const expectedResult = { valid: false, error: 'Comment content Must not be empty' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('summary contains no letter, must return an error', async(done) => {
		expect.assertions(1)
		const result = commentHelper.validateContent('123')
		const expectedResult = { valid: false, error: 'Comment content Must contain at least two words' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('summary contains one word, must return an error', async(done) => {
		expect.assertions(1)
		const result = commentHelper.validateContent('Tom')
		const expectedResult = { valid: false, error: 'Comment content Must contain at least two words' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('summary contains letters, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = commentHelper.validateContent('Tom fd')
		expect(result).toBeTruthy()
		done()
	})

})

describe('validateId()', () => {

	test('user id value is empty, must return an error', async(done) => {
		expect.assertions(1)
		const result = await commentHelper.validateId('')
		const expectedResult = { valid: false, error: 'Id Must not be empty' }
		expect(result).toEqual(expectedResult)
		done()
	})

	test('user id value contains a string, must return an error', async(done) => {
		expect.assertions(1)
		const result = await commentHelper.validateId('kjds')
		const expectedResult = { valid: false, error: 'Id Must be a number'}
		expect(result).toEqual(expectedResult)
		done()
	})

	test('user id contains a number, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = commentHelper.validateId(5)
		expect(result).toBeTruthy()
		done()
	})
})
