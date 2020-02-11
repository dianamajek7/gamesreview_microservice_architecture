'use strict'

const utilValidator = require('../utilValidator.js')

describe('isEmpty()', () => {

	test('empty value, must be true', async(done) => {
		expect.assertions(1)
		const result = utilValidator.isEmpty('')
		expect(result).toBeTruthy()
		done()
	})
	test('null value, must be true', async(done) => {
		expect.assertions(1)
		const result = utilValidator.isEmpty(null)
		expect(result).toBeTruthy()
		done()
	})
	test('undefined value, must be true', async(done) => {
		expect.assertions(1)
		const result = utilValidator.isEmpty(undefined)
		expect(result).toBeTruthy()
		done()
	})
	test('value present, must be false', async(done) => {
		expect.assertions(1)
		const result = utilValidator.isEmpty(' ')
		expect(result).toBeFalsy()
		done()
	})

})


describe('isEmptyObjectString()', () => {

	test('object typeof value with a length of zero, must be true', async(done) => {
		expect.assertions(1)
		const result = utilValidator.isEmptyObjectString([])
		expect(result).toBeTruthy()
		done()
	})
	test('string typeof value with a length of zero, must be true', async(done) => {
		expect.assertions(1)
		const result = utilValidator.isEmptyObjectString('')
		expect(result).toBeTruthy()
		done()
	})
	test('valid string present, must be false', async(done) => {
		expect.assertions(1)
		const result = utilValidator.isEmptyObjectString('d')
		expect(result).toBeFalsy()
		done()
	})

})

describe('validateIfOnlyLetters()', () => {

	test('value present but contains characters and letters, must return an error', async(done) => {
		expect.assertions(1)
		const result = utilValidator.validateIfOnlyLetters('Tom@Ford.com')
		const expectedResult = { valid: false, error: 'Must contain only letters' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('value present contains only letters, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = utilValidator.validateIfOnlyLetters('Tom Ford')
		const expectedResult = { valid: true}
		expect(result).toEqual(expectedResult)
		done()
	})
})

describe('validateContainsWords()', () => {

	test('value present but contains one word, must return an error', async(done) => {
		expect.assertions(1)
		const result = utilValidator.validateContainsWords('game')
		const expectedResult = { valid: false, error: 'Must contain at least two words' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('value present contain two words, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = utilValidator.validateContainsWords('Game GTA')
		const expectedResult = { valid: true}
		expect(result).toEqual(expectedResult)
		done()
	})

})

describe('setValidatedResult()', () => {
	test('contains valid and and an error in object, must return an error', async(done) => {
		expect.assertions(1)
		const result = utilValidator.setValidatedResult(false, 'Must contain at least one letter')
		const expectedResult = { valid: false, error: 'Must contain at least one letter'}
		expect(result).toEqual(expectedResult)
		done()
	})
	test('contains only valid with no error in object, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = utilValidator.setValidatedResult(true)
		const expectedResult = { valid: true}
		expect(result).toEqual(expectedResult)
		done()
	})
})

describe('isNumber()', () => {
	test('contains a string, must return an error', async(done) => {
		expect.assertions(1)
		const result = utilValidator.isNumber('string')
		const expectedResult = { valid: false, error: 'Must be a number'}
		expect(result).toEqual(expectedResult)
		done()
	})
	test('contains a number, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = utilValidator.isNumber(1234)
		const expectedResult = { valid: true}
		expect(result).toEqual(expectedResult)
		done()
	})
})

describe('validateIfEmpty()', () => {

	test('value present but contains white spaces not letters, must return an error', async(done) => {
		expect.assertions(1)
		const result = utilValidator.validateIfEmpty(' ')
		const expectedResult = { valid: false, error: 'Must not be empty' }
		expect(result).toEqual(expectedResult)
		done()
	})

	test('value present but contains an object not letters, must return an error', async(done) => {
		expect.assertions(1)
		const result = utilValidator.validateIfEmpty([])
		const expectedResult = { valid: false, error: 'Must not be empty' }
		expect(result).toEqual(expectedResult)
		done()
	})

	test('value present with valid lettersmust return a success validation, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = utilValidator.validateIfEmpty('admin')
		const expectedResult = { valid: true}
		expect(result).toEqual(expectedResult)
		done()
	})

})
