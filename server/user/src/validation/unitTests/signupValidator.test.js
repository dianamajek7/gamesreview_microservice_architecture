'use strict'

const signupValidator = require('../signupValidator')

describe('validate SignupValidator', () => {

	test(`username, password, confirmPassword, email, firstname, lastname, dob, image, 
    securityQuestions and securityAnswers, value is empty, must return errors within errors object`, async(done) => {
		expect.assertions(1)
		const data = {}
		const result = await signupValidator(data)
		const expectedResult = {username: 'Username Must not be empty', password: 'Password Must not be empty',
			confirmPassword: 'Confirm Password Must not be empty', email: 'Email Must not be empty',
			profileImageURL: 'Image Must not be empty', securityQuestion: 'Security question must be selected',
			securityAnswer: 'Security answer must be filled'}
		expect(result).toEqual(expectedResult)
		done()
	})

	test(`all values present but password and confirmPassword value are not identical, 
    must return errors within errors object`, async(done) => {
		expect.assertions(1)
		const data = {username: 'Tom', password: '.TomHarry12',
			confirmPassword: '.Tom"arry12', email: 'tommHarry@gmail.com',
			profileImageURL: 'https://servmask.com/img/products/url.png',
			securityQuestion1: 'What is your dog name?', securityAnswer1: 'Marrie',
			securityQuestion2: 'What is your favourite meal?', securityAnswer2: 'Rice'}
		const result = await signupValidator(data)
		const expectedResult = {confirmPassword: 'Confirm Passwords must match'}
		expect(result).toEqual(expectedResult)
		done()
	})

	test(`all values present but security questions and aswers are identical, 
    must return errors within errors object`, async(done) => {
		expect.assertions(1)
		const data = {username: 'Tom', password: '.TomHarry12',
			confirmPassword: '.TomHarry12', email: 'tommHarry@gmail.com',
			profileImageURL: 'https://servmask.com/img/products/url.png',
			securityQuestion1: 'What is your dog name?', securityAnswer1: 'Marrie',
			securityQuestion2: 'What is your dog name?', securityAnswer2: 'Marrie'}
		const result = await signupValidator(data)
		const expectedResult = {securityQuestion: 'Security questions must not be the same',
			securityAnswer: 'Security answers must not be the same'}
		expect(result).toEqual(expectedResult)
		done()
	})

	test('all values present and valid must return a success validation with no errors in errors object', async(done) => {
		expect.assertions(1)
		const data = {username: 'Tom', password: '.TomHarry12',
			confirmPassword: '.TomHarry12', email: 'tommHarry@gmail.com',
			profileImageURL: 'https://servmask.com/img/products/url.png',
			securityQuestion1: 'What is your dog name?', securityAnswer1: 'Marrie',
			securityQuestion2: 'What is your favourite meal?', securityAnswer2: 'Rice'}
		const result = await signupValidator(data)
		const expectedResult = {}
		expect(result).toEqual(expectedResult)
		done()
	})
})
