'use strict'
/**
 * A module that compares users assigned jwtToken to ensure valid session user using bcrypt comapre
 * @module generateAuth
 */
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt-promise')
const constants = require('../../constants')
const secret = process.env.JWT_KEY || '_Strong_@password'
const duration = {expiresIn: '1h'}

/**
 * Validates user credentials against what was provided, and generates a token for validated user.
 * @param {string} username - A string param
 * @param {string} password - A string param
 * @param {Object} currentUser - An object contains users hash password stored,
 * that will be use to compare with password param
 * @throws {UNAUTHORIZED} Throws error if details provided on request does not match what is stored
 * @return {Object} Returns jwtToken with an expiration of an hour
 */
module.exports = async(username, password, curentUser) => {
	if(await bcrypt.compare(password, curentUser.Password)) {
		const payload = {id: curentUser.Id, name: username}
		const token = jwt.sign(payload, secret, duration)
		return token
	}
	throw {
		status: constants.UNAUTHORIZED,
		title: 'Unauthorized',
		detail: {errors: {password: 'Incorrect password'}}
	}
}
