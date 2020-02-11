'use strict'

const reviewHelper = require('../reviewHelper')

describe('validateTitle()', () => {

	test('title value is empty, must return an error', async(done) => {
		expect.assertions(1)
		const result = reviewHelper.validateTitle('')
		const expectedResult = { valid: false, error: 'Review title Must not be empty' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('title contains no letter, must return an error', async(done) => {
		expect.assertions(1)
		const result = reviewHelper.validateTitle('123')
		const expectedResult = { valid: false, error: 'Review title Must contain only letters' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('title contains letters, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = reviewHelper.validateTitle('Tom')
		expect(result).toBeTruthy()
		done()
	})

})

describe('validatLike()', () => {

	test('like value is empty, must return an error', async(done) => {
		expect.assertions(1)
		const result = reviewHelper.validateLike('')
		const expectedResult = { valid: false, error: 'Like Must not be empty' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('like contains no letter, must return an error', async(done) => {
		expect.assertions(1)
		const result = reviewHelper.validateLike('123')
		const expectedResult = { valid: false, error: 'Like Must contain only letters' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('like contains letters, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = reviewHelper.validateLike('Tom')
		expect(result).toBeTruthy()
		done()
	})

})

describe('validateContent()', () => {

	test('summary value is empty, must return an error', async(done) => {
		expect.assertions(1)
		const result = reviewHelper.validateContent('')
		const expectedResult = { valid: false, error: 'Review content Must not be empty' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('summary contains no letter, must return an error', async(done) => {
		expect.assertions(1)
		const result = reviewHelper.validateContent('123')
		const expectedResult = { valid: false, error: 'Review content Must contain at least two words' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('summary contains one word, must return an error', async(done) => {
		expect.assertions(1)
		const result = reviewHelper.validateContent('Tom')
		const expectedResult = { valid: false, error: 'Review content Must contain at least two words' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('summary contains letters, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = reviewHelper.validateContent('Tom fd')
		expect(result).toBeTruthy()
		done()
	})

})

describe('validateScreenshot()', () => {

	test('screenshot is empty, must return an error', async(done) => {
		expect.assertions(1)
		const result = await reviewHelper.validateScreenshot('')
		const expectedResult = { valid: false, error: 'Review Screenshot Must not be empty' }
		expect(result).toEqual(expectedResult)
		done()
	})

	test('screenshot contains a valid url, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = reviewHelper.validateScreenshot('https://servmask.com/img/products/url.png')
		expect(result).toBeTruthy()
		done()
	})

})

describe('validateId()', () => {

	test('user id value is empty, must return an error', async(done) => {
		expect.assertions(1)
		const result = await reviewHelper.validateId('')
		const expectedResult = { valid: false, error: 'Id Must not be empty' }
		expect(result).toEqual(expectedResult)
		done()
	})

	test('user id value contains a string, must return an error', async(done) => {
		expect.assertions(1)
		const result = await reviewHelper.validateId('kjds')
		const expectedResult = { valid: false, error: 'Id Must be a number'}
		expect(result).toEqual(expectedResult)
		done()
	})

	test('user id contains a number, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = reviewHelper.validateId(5)
		expect(result).toBeTruthy()
		done()
	})
})

describe('validateFlag()', () => {

	test('flag value is empty, must return an error', async(done) => {
		expect.assertions(1)
		const result = reviewHelper.validateFlag('')
		const expectedResult = { valid: false, error: 'Flag Must not be empty' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('flag contains no letter, must return an error', async(done) => {
		expect.assertions(1)
		const result = reviewHelper.validateFlag('123')
		const expectedResult = { valid: false, error: 'Flag Must contain only letters' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('flag contains letters, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = reviewHelper.validateFlag('Approved')
		expect(result).toBeTruthy()
		done()
	})

})
