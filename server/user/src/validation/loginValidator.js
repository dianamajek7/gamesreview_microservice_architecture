'use strict'
/**
 * A module that validates user crendentials on login request
 * @module loginValidator
 */
const validator = require('./helper/credentialsValidator')
const utilVal= require('./helper/utilValidator')
/**
 * Validate user data on request.
 * @param {Object} data - An object param
 * @return {Object} Returns an error of object, if no error returns an empty object
 */
module.exports = async(data) => {
	const errors = {}

	if (!validator.validateUserName(data.username).valid)
		errors.username = validator.validateUserName(data.username).error

	if (!utilVal.validateIfEmpty(data.password).valid)
		errors.password = `Password ${utilVal.validateIfEmpty(data.password).error}`
	return errors
}
