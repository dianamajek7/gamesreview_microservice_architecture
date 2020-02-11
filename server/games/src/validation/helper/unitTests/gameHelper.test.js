'use strict'

const gameHelper = require('../gameHelper')

describe('validateTitle()', () => {

	test('title value is empty, must return an error', async(done) => {
		expect.assertions(1)
		const result = gameHelper.validateTitle('')
		const expectedResult = { valid: false, error: 'Game title Must not be empty' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('title contains no letter, must return an error', async(done) => {
		expect.assertions(1)
		const result = gameHelper.validateTitle('123')
		const expectedResult = { valid: false, error: 'Game title Must contain only letters' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('title contains letters, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = gameHelper.validateTitle('Tom')
		expect(result).toBeTruthy()
		done()
	})

})

describe('validateDescription()', () => {

	test('description value is empty, must return an error', async(done) => {
		expect.assertions(1)
		const result = gameHelper.validateDescription('')
		const expectedResult = { valid: false, error: 'Game description Must not be empty' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('description contains no letter, must return an error', async(done) => {
		expect.assertions(1)
		const result = gameHelper.validateDescription('123')
		const expectedResult = { valid: false, error: 'Game description Must contain at least two words' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('description contains one word, must return an error', async(done) => {
		expect.assertions(1)
		const result = gameHelper.validateDescription('To')
		const expectedResult = { valid: false, error: 'Game description Must contain at least two words' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('description contains letters, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = gameHelper.validateDescription('Tom Ford Sam')
		expect(result).toBeTruthy()
		done()
	})

})

describe('validateSummary()', () => {

	test('summary value is empty, must return an error', async(done) => {
		expect.assertions(1)
		const result = gameHelper.validateSummary('')
		const expectedResult = { valid: false, error: 'Game summary Must not be empty' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('summary contains no letter, must return an error', async(done) => {
		expect.assertions(1)
		const result = gameHelper.validateSummary('123')
		const expectedResult = { valid: false, error: 'Game summary Must contain at least two words' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('summary contains one word, must return an error', async(done) => {
		expect.assertions(1)
		const result = gameHelper.validateSummary('Tom')
		const expectedResult = { valid: false, error: 'Game summary Must contain at least two words' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('summary contains letters, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = gameHelper.validateSummary('Tom fd')
		expect(result).toBeTruthy()
		done()
	})

})

describe('validatePublisher()', () => {

	test('publisher value is empty, must return an error', async(done) => {
		expect.assertions(1)
		const result = gameHelper.validatePublisher('')
		const expectedResult = { valid: false, error: 'Game publisher Must not be empty' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('publisher contains no letter, must return an error', async(done) => {
		expect.assertions(1)
		const result = gameHelper.validatePublisher('123')
		const expectedResult = { valid: false, error: 'Game publisher Must contain only letters' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('publisher contains letters, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = gameHelper.validatePublisher('Tom')
		expect(result).toBeTruthy()
		done()
	})

})

describe('validateCategoryName()', () => {

	test('category value is empty, must return an error', async(done) => {
		expect.assertions(1)
		const result = gameHelper.validateCategoryName('')
		const expectedResult = { valid: false, error: 'Category name Must not be empty' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('category contains no letter, must return an error', async(done) => {
		expect.assertions(1)
		const result = gameHelper.validateCategoryName('123')
		const expectedResult = { valid: false, error: 'Category name Must contain only letters' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('category contains letters, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = gameHelper.validateCategoryName('Tom')
		expect(result).toBeTruthy()
		done()
	})

})

describe('validateImage()', () => {

	test('image value is empty, must return an error', async(done) => {
		expect.assertions(1)
		const result = await gameHelper.validateImage('')
		const expectedResult = { valid: false, error: 'Game image Must not be empty' }
		expect(result).toEqual(expectedResult)
		done()
	})

	test('image contains a valid url, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = gameHelper.validateImage('https://servmask.com/img/products/url.png')
		expect(result).toBeTruthy()
		done()
	})

})

describe('validateUserId()', () => {

	test('user id value is empty, must return an error', async(done) => {
		expect.assertions(1)
		const result = await gameHelper.validateUserId('')
		const expectedResult = { valid: false, error: 'User id Must not be empty' }
		expect(result).toEqual(expectedResult)
		done()
	})

	test('user id value contains a string, must return an error', async(done) => {
		expect.assertions(1)
		const result = await gameHelper.validateUserId('kjds')
		const expectedResult = { valid: false, error: 'User id Must be a number'}
		expect(result).toEqual(expectedResult)
		done()
	})

	test('user id contains a number, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = gameHelper.validateUserId(5)
		expect(result).toBeTruthy()
		done()
	})
})

describe('validateRate()', () => {

	test('rate value is empty, must return an error', async(done) => {
		expect.assertions(1)
		const result = await gameHelper.validateRate('')
		const expectedResult = { valid: false, error: 'Rate Must not be empty' }
		expect(result).toEqual(expectedResult)
		done()
	})

	test('rate value contains a string, must return an error', async(done) => {
		expect.assertions(1)
		const result = await gameHelper.validateRate('kjds')
		const expectedResult = { valid: false, error: 'Rate Must be a number or a decimal'}
		expect(result).toEqual(expectedResult)
		done()
	})

	test('rate value greater than 5, must return an error', async(done) => {
		expect.assertions(1)
		const result = await gameHelper.validateRate(6)
		const expectedResult = { valid: false, error: 'Rate is out of 5'}
		expect(result).toEqual(expectedResult)
		done()
	})

	test('Rate contains a number, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = gameHelper.validateRate(5)
		expect(result).toBeTruthy()
		done()
	})

	test('Rate contains a decimal, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = gameHelper.validateRate(2.1)
		expect(result).toBeTruthy()
		done()
	})

})
