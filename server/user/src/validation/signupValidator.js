'use strict'
const validator = require('./helper/credentialsValidator')
/**
 * A module that validates user crendentials on login request
 * @module signupValidator
 */
module.exports = async(data) => {
	/**
	 * Validate user data on request.
	 * @memberof module:signupValidator
	 * @param {Object} data - An object param
	 * @return {Object} Returns an error of object, if no error returns an empty object
	*/
	const errors = {}
	if (!validator.validateUserName(data.username).valid)
		errors.username = validator.validateUserName(data.username).error
	if (!validator.validateEmail(data.email).valid)
		errors.email = validator.validateEmail(data.email).error
	if (!validator.validateImage(data.profileImageURL).valid)
		errors.profileImageURL = validator.validateImage(data.profileImageURL).error

	Object.assign(errors, validateData(data), validateQuestAndAns(data))
	return errors
}
/**
 * Validate data.
 * @memberof module:signupValidator
 * @param {Object} data - An object param
 * @return {Object} Returns an error of object if no error returns an empty object
 */
const validateData = (data) => {
	const errors = {}
	if (!validator.validatePassword(data.password).valid)
		errors.password = validator.validatePassword(data.password).error
	if (!validator.validateConfirmPassword(data.password, data.confirmPassword).valid)
		errors.confirmPassword =
			`Confirm ${validator.validateConfirmPassword(data.password, data.confirmPassword).error}`
	return errors
}
/**
 * Validate questions an answer.
 * @memberof module:signupValidator
 * @param {Object} data - An object param
 * @return {Object} Returns an error of object, if no error returns an empty object
 */
const validateQuestAndAns = (data) => {
	const errors = {}
	if(!validator.validateSecurityQuest(data.securityQuestion1, data.securityQuestion2).valid)
		errors.securityQuestion =
			validator.validateSecurityQuest(data.securityQuestion1, data.securityQuestion2).error
	if(!validator.validateSecurityAnswer(data.securityAnswer1, data.securityAnswer2).valid)
		errors.securityAnswer =
			validator.validateSecurityAnswer(data.securityAnswer1, data.securityAnswer2).error
	return errors
}
