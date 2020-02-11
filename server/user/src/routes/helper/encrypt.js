'use strict'
/**
 * A module that encrypts users password using bcrypt hashing
 * @module encrypt
 */
const bcrypt = require('bcrypt-promise')
const constants = require('../../constants')
/**
 * Generates a hash for a new requested user.
 * @param {Object} result - An object param
 * @return {Object} Returns password hash, also returns confirm password
 * @throws {ERROR} Throws error to be handled by the caller
 * depending if confirm password is present
 */
module.exports = async(result) => {
	const salt = await bcrypt.genSalt(constants.SALT_ROUNDS).catch(err => {
		console.error(err)
		throw err
	})

	const hash = await bcrypt.hash(result.password, salt).catch(err => {
		console.error(err)
		throw err
	})

	result.password = hash
	if(result.confirmPassword) result.confirmPassword = hash
	return result
}
