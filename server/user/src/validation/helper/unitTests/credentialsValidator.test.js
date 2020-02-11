'use strict'

const signUpValidator = require('../credentialsValidator')

describe('validateUserName()', () => {

	test('username value is empty, must return an error', async(done) => {
		expect.assertions(1)
		const result = signUpValidator.validateUserName('')
		const expectedResult = { valid: false, error: 'Username Must not be empty' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('username contains no letter, must return an error', async(done) => {
		expect.assertions(1)
		const result = signUpValidator.validateUserName('123')
		const expectedResult = { valid: false, error: 'Username Must contain at least one letter' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('username contains no letter but objects, must return an error', async(done) => {
		expect.assertions(1)
		const result = signUpValidator.validateUserName('[]')
		const expectedResult = { valid: false, error: 'Username Must contain at least one letter' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('username contains at least one letter, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = signUpValidator.validateUserName('Tom')
		expect(result).toBeTruthy()
		done()
	})

})

describe('validatePassword()', () => {

	test('password value is empty, must return an error', async(done) => {
		expect.assertions(1)
		const result = signUpValidator.validatePassword('')
		const expectedResult = { valid: false, error: 'Password Must not be empty' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('password less than minimum length, must return an error', async(done) => {
		expect.assertions(1)
		const result = signUpValidator.validatePassword('Tom')
		const expectedResult = { valid: false, error: 'Password Must be at least 7 characters long' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('password greater than maximum length, must return an error', async(done) => {
		expect.assertions(1)
		const result = signUpValidator.validatePassword(
			'99 bottles of beer on the wall, 99 bottles of beerTake one down and pass it around\n',
			'98 bottles of beer on the wall. 98 bottles of beer on the wall, 98 bottles of beer.\n',
			'Take one down and pass it around, 97 bottles of beer on the wall\n')

		const expectedResult = { valid: false, error: 'Password Must not be longer than 80 characters'}
		expect(result).toEqual(expectedResult)
		done()
	})
	test('password contains no upper or lower case letter with no number nor char, must return an error', async(done) => {
		expect.assertions(1)
		const result = signUpValidator.validatePassword('today12')
		const expectedResult = { valid: false,
			error: 'Password Must contain at least one uppercase, one lowercase letter, one number and one special character'}
		expect(result).toEqual(expectedResult)
		done()
	})
	test(`password contains upper and lower case letters with one number and a char,
	 must return a success validation`, async(done) => {
		expect.assertions(1)
		const result = signUpValidator.validatePassword('Today@123')
		const expectedResult = { valid: true}
		expect(result).toEqual(expectedResult)
		done()
	})

})

describe('validateConfirmPassword()', () => {

	test('password value is empty but contains confirmPassword, must return an error', async(done) => {
		expect.assertions(1)
		const result = signUpValidator.validateConfirmPassword('', 'me')
		const expectedResult = { valid: false, error: 'Password Must not be empty' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('password less than minimum length but contains confirmPassword, must return an error', async(done) => {
		expect.assertions(1)
		const result = signUpValidator.validateConfirmPassword('Tom', 'Tomm')
		const expectedResult = { valid: false, error: 'Password Must be at least 7 characters long' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('password greater than maximum length but contains confirmPassword, must return an error', async(done) => {
		expect.assertions(1)
		const result = signUpValidator.validateConfirmPassword(
			'99 bottles of beer on the wall, 99 bottles of beerTake one down and pass it around\n',
			'98 bottles of beer on the wall. 98 bottles of beer on the wall, 98 bottles of beer.\n',
			'Take one down and pass it around, 97 bottles of beer on the wall\n', 'TOMM.45')

		const expectedResult = { valid: false, error: 'Password Must not be longer than 80 characters'}
		expect(result).toEqual(expectedResult)
		done()

	})
	test(`password contains no upper or lower case letter with no number 
	nor char but contains confirmPassword, must return an error`, async(done) => {
		expect.assertions(1)
		const result = signUpValidator.validateConfirmPassword('today12', 'today12')
		const expectedResult = { valid: false,
			error: 'Password Must contain at least one uppercase, one lowercase letter, one number and one special character'}
		expect(result).toEqual(expectedResult)
		done()
	})
	test(`password contains upper and lower case letter with at least one number 
	and a char but does not match confirmPassword, must return an error`, async(done) => {
		expect.assertions(1)
		const result = signUpValidator.validateConfirmPassword('Today@1234', 'Today@124')
		const expectedResult = { valid: false, error: 'Passwords must match'}
		expect(result).toEqual(expectedResult)
		done()
	})
	test(`password contains upper and lower case letters with at least one number, a char 
	and also matches confirmPassword, must return a success validation`, async(done) => {
		expect.assertions(1)
		const result = signUpValidator.validateConfirmPassword('Today@123456', 'Today@123456')
		const expectedResult = { valid: true}
		expect(result).toEqual(expectedResult)
		done()
	})

})

describe('validateEmail()', () => {

	test('email value is empty, must return an error', async(done) => {
		expect.assertions(1)
		const result = signUpValidator.validateEmail('')
		const expectedResult = { valid: false, error: 'Email Must not be empty' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('email not valid, must return an error', async(done) => {
		expect.assertions(1)
		const result = signUpValidator.validateEmail('today@.')
		const expectedResult = { valid: false, error: 'Email Must be a valid email address' }
		expect(result).toEqual(expectedResult)
		done()
	})

	test('email invalid, must return an error', async(done) => {
		expect.assertions(1)
		const result = signUpValidator.validateEmail('1234')
		const expectedResult = { valid: false, error: 'Email Must be a valid email address' }
		expect(result).toEqual(expectedResult)
		done()
	})

	test('email valid, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = signUpValidator.validateEmail('Todayvalid@gmail.com')
		const expectedResult = { valid: true}
		expect(result).toEqual(expectedResult)
		done()
	})

})

describe('validateSecurityQuest()', () => {

	test('both security questions are empty, must return an error', async(done) => {
		expect.assertions(1)
		const result = signUpValidator.validateSecurityQuest('', '')
		const expectedResult = { valid: false, error: 'Security question must be selected' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('first security question is empty, must return an error', async(done) => {
		expect.assertions(1)
		const result = signUpValidator.validateSecurityQuest('', 'What is your name?')
		const expectedResult = { valid: false, error: 'Security question must be selected' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('second security question is empty, must return an error', async(done) => {
		expect.assertions(1)
		const result = signUpValidator.validateSecurityQuest('What is your name?', '')
		const expectedResult = { valid: false, error: 'Security question must be selected' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('both security questions are equal, must return an error', async(done) => {
		expect.assertions(1)
		const result = signUpValidator.validateSecurityQuest('Where were you born?', 'Where were you born?')
		const expectedResult = { valid: false, error: 'Security questions must not be the same' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('both security questions are different, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = signUpValidator.validateSecurityQuest('Where were you born?', 'Where did you travel to first?')
		const expectedResult = { valid: true }
		expect(result).toEqual(expectedResult)
		done()
	})

})


describe('validateSecurityAnswer()', () => {


	test('both security answers are empty, must return an error', async(done) => {
		expect.assertions(1)
		const result = signUpValidator.validateSecurityAnswer('', '')
		const expectedResult = { valid: false, error: 'Security answer must be filled' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('first security answer is empty, must return an error', async(done) => {
		expect.assertions(1)
		const result = signUpValidator.validateSecurityAnswer('', 'Tom')
		const expectedResult = { valid: false, error: 'Security answer must be filled' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('second security answer is empty, must return an error', async(done) => {
		expect.assertions(1)
		const result = signUpValidator.validateSecurityAnswer('Tom', '')
		const expectedResult = { valid: false, error: 'Security answer must be filled' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('both security answers are equal, must return an error', async(done) => {
		expect.assertions(1)
		const result = signUpValidator.validateSecurityAnswer('UK', 'UK')
		const expectedResult = { valid: false, error: 'Security answers must not be the same' }
		expect(result).toEqual(expectedResult)
		done()
	})
	test('both security answers are different, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = signUpValidator.validateSecurityAnswer('UK?', 'Dubai')
		const expectedResult = { valid: true }
		expect(result).toEqual(expectedResult)
		done()
	})

})

describe('validateImage()', () => {

	test('image value is empty, must return an error', async(done) => {
		expect.assertions(1)
		const result = await signUpValidator.validateImage('')
		const expectedResult = { valid: false, error: 'Image Must not be empty' }
		expect(result).toEqual(expectedResult)
		done()
	})

	test('image contains a valid url, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = signUpValidator.validateImage('https://servmask.com/img/products/url.png')
		expect(result).toBeTruthy()
		done()
	})

})
