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
	test('valis string present, must be false', async(done) => {
		expect.assertions(1)
		const result = utilValidator.isEmptyObjectString('d')
		expect(result).toBeFalsy()
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

describe('validateRequiredLength()', () => {

	test('value less than minimum length, must return an error', async(done) => {
		expect.assertions(1)
		const result = utilValidator.validateRequiredLength('Tom', 5, 10)
		const expectedResult = { valid: false, error: 'Must be at least 5 characters long' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('value greater than maximum length, must return an error', async(done) => {
		expect.assertions(1)
		const result = utilValidator
			.validateRequiredLength('I am Tom, I love writing unit test for validity of code', 5, 10)
		const expectedResult = { valid: false, error: 'Must not be longer than 10 characters'}
		expect(result).toEqual(expectedResult)
		done()
	})
	test('value meets minimum length required, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = utilValidator.validateRequiredLength('I am Tom, I love writing', 5, 30)
		const expectedResult = { valid: true}
		expect(result).toEqual(expectedResult)
		done()
	})

})


describe('validateCharacters()', () => {

	test('value with uknown regEX key, must return an error', async(done) => {
		expect.assertions(1)
		const result = utilValidator.validateCharacters('5ll', 'NUMBER_AND_LETTERS')
		const expectedResult = { valid: false, error: 'Error, check enteries' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('value contains numbers with no letters using a valid regEX key, must return an error', async(done) => {
		expect.assertions(1)
		const result = utilValidator.validateCharacters('20', 'LETTERS_REGX')
		const expectedResult = { valid: false, error: 'Must contain at least one letter'}
		expect(result).toEqual(expectedResult)
		done()
	})
	test('value contains at least one letter using a valid regEX key, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = utilValidator.validateCharacters('I am 20', 'LETTERS_REGX')
		const expectedResult = { valid: true}
		expect(result).toEqual(expectedResult)
		done()
	})
	test('value contains no number with no letters using a valid regEX key, must return an error', async(done) => {
		expect.assertions(1)
		const result = utilValidator.validateCharacters('@', 'LETTERS_NUMBERS_REGX')
		const expectedResult = { valid: false, error: 'Must contain at least one letter and one number'}
		expect(result).toEqual(expectedResult)
		done()
	})
	test('value contains numbers and letters using a valid regEX key, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = utilValidator.validateCharacters('I am 20', 'LETTERS_NUMBERS_REGX')
		const expectedResult = { valid: true}
		expect(result).toEqual(expectedResult)
		done()
	})
	test('value contains no upper or lower case letter with no number using a valid regEX key, must return an error', async(done) => {
		expect.assertions(1)
		const result = utilValidator.validateCharacters('today', 'UPPER_LOWER_CASE_NUMBER_REGEX')
		const expectedResult =
                    { valid: false, error: 'Must contain at least one uppercase, one lowercase letter and one number'}
		expect(result).toEqual(expectedResult)
		done()
	})
	test('value contains upper and lower case letters with one number using a valid regEX key, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = utilValidator.validateCharacters('Today1', 'UPPER_LOWER_CASE_NUMBER_REGEX')
		const expectedResult = { valid: true}
		expect(result).toEqual(expectedResult)
		done()
	})
	test('value contains no upper or lower case letter with no number nor char using a valid regEX key, must return an error', async(done) => {
		expect.assertions(1)
		const result = utilValidator.validateCharacters('today1', 'UPPER_LOWER_CASE_NUMBER_SPECIAL_CHAR_REGEX')
		const expectedResult = { valid: false,
			error: 'Must contain at least one uppercase, one lowercase letter, one number and one special character'}
		expect(result).toEqual(expectedResult)
		done()
	})
	test('value contains upper and lower case letters with at least one number and a char using a valid regEX key, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = utilValidator.validateCharacters('Today@1', 'UPPER_LOWER_CASE_NUMBER_SPECIAL_CHAR_REGEX')
		const expectedResult = { valid: true}
		expect(result).toEqual(expectedResult)
		done()
	})
	test('value contains no email using a valid regEX key, must return an error', async(done) => {
		expect.assertions(1)
		const result = utilValidator.validateCharacters('today@.', 'EMAIL_REGEX')
		const expectedResult = { valid: false, error: 'Must be a valid email address'}
		expect(result).toEqual(expectedResult)
		done()
	})
	test('value contains a email using a valid regEX key, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = utilValidator.validateCharacters('Todayvalid@gmail.com', 'EMAIL_REGEX')
		const expectedResult = { valid: true}
		expect(result).toEqual(expectedResult)
		done()
	})
	test('value contains no date of birth using a valid regEX key, must return an error', async(done) => {
		expect.assertions(1)
		const result = utilValidator.validateCharacters('my birthday', 'DOB_REGEX')
		const expectedResult = { valid: false, error: 'Must be in dd/MM/yyyy this format only'}
		expect(result).toEqual(expectedResult)
		done()
	})
	test('value contains a date of brith but in the wrong format using a valid regEX key, must return an error', async(done) => {
		expect.assertions(1)
		const result = utilValidator.validateCharacters('04-09-2000', 'DOB_REGEX')
		const expectedResult = { valid: false, error: 'Must be in dd/MM/yyyy this format only'}
		expect(result).toEqual(expectedResult)
		done()
	})
	test('value contains a date of brith in the correct format using a valid regEX key, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = utilValidator.validateCharacters('04/09/2000', 'DOB_REGEX')
		const expectedResult = { valid: true }
		expect(result).toEqual(expectedResult)
		done()
	})

})

describe('validateIfMatchRegEx()', () => {

	test('value contains a valid regEX key with an invalid value to match, must return an error', async(done) => {
		expect.assertions(1)
		const result = utilValidator.validateIfMatchRegEx(/(?=.*[a-zA-Z])/, '@.', 'Must contain at least one letter')
		const expectedResult = { valid: false, error: 'Must contain at least one letter'}
		expect(result).toEqual(expectedResult)
		done()
	})
	test('value contains a valid regEX key with a invalid value to match, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = utilValidator.validateIfMatchRegEx(/(?=.*[a-zA-Z])/,
			'I am Ford', 'Must contain at least one letter')
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

describe('getDate()', () => {
	test('contains a date string, must return a date', async(done) => {
		expect.assertions(1)
		const result = utilValidator.getDate('19/12/2010')
		expect(result).toEqual(new Date('2011-01-19T00:00:00.000Z'))
		done()
	})
})
