'use strict'
const validateSignupInput = require('../../validation/signupValidator')
const utilVal = require('../../validation/helper/utilValidator')
const constants = require('../../constants')
const userModel = require('../../models/user')
/**
 * Check for errors on signup, and checks whether a user has been deleted using email or username.
 * @param {string} result - An object param
 * @param {string} ctx - Koa router path which contains data from the URL
 * @throws {BAD_REQUEST} Throws error if error object not empty,
 * if error object is empty object returns username and email boolean if deleted.
 */
const checkForErrorsOnSignUp = async(result, ctx) => {
	let errors = await validateSignupInput(result)
	if (!utilVal.isEmptyObjectString(errors))
		return ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: {errors }})
	if(result.username.includes('_admin'))
		return ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request',
			detail: {username: 'User cannot signup as an admin'}})
	const existingUser = await checkForExistingUser(result, errors)
	errors = existingUser.errors
	const usernameDeleted = existingUser.usernameDeleted
	const emailDeleted = existingUser.emailDeleted

	if(!utilVal.isEmptyObjectString(errors))
		return ctx.throw(constants.BAD_REQUEST, { title: 'Bad Request', detail: {errors} })
	return Object.freeze({usernameDeleted, emailDeleted})
}
/**
 * Check for exisiting user, and checks whether a user has been found using email or username.
 * @param {string} result - An object param
 * @param {Object} errors - An object param
 * @returns {Object} Returns errors, username and email boolean if deleted.
 */
const checkForExistingUser= async(result, errors) => {
	const emailFound = await userModel.getUserByEmail(result.email)
	const userFound = await userModel.getUserByUsername(result.username)

	if(!utilVal.isEmpty(userFound) && userFound.Deleted === 0 )
		errors.username = 'Username already exists'
	Object.assign(errors, await checkIfEmailExists(errors, emailFound))
	const {usernameDeleted, emailDeleted} = await checkUserDeleted(userFound, emailFound)
	return { errors, usernameDeleted, emailDeleted}
}
/**
 * Check for exisiting user by email, and checks whether a user has been found using email or username.
 * @param {Object} errors - An object param
 * @param {string} emailFound - A string param
 * @returns {Object} Returns errors object, if email exists.
 */
const checkIfEmailExists = async(errors, emailFound) => {
	if(!utilVal.isEmpty(emailFound) && emailFound.Deleted === 0)
		errors.email = 'Email address already exists'
	return errors
}
/**
 * Check for if a user has been deleted by email and username.
 * @param {string} userFound - An string param
 * @param {string} emailFound - A string param
 * @returns {Boolean} Returns whether a username and email found has been deleted.
 */
const checkUserDeleted = async(userFound, emailFound) => {
	let usernameDeleted = false, emailDeleted = false
	if (!utilVal.isEmpty(userFound) && userFound.Deleted === 1 ) usernameDeleted = true
	emailDeleted = await checkIfEmailFound(emailFound, emailDeleted)
	return {usernameDeleted, emailDeleted}
}
/**
 * Check for whether an email has been found.
 * @param {string} emailFound - A string param
 * @param {string} emailDeleted - An string param
 * @returns {Object} Returns errors object, if email exists.
 */
const checkIfEmailFound = (emailFound, emailDeleted) => {
	if (!utilVal.isEmpty(emailFound) && emailFound.Deleted === 1) emailDeleted = true
	return emailDeleted
}

module.exports = { checkForErrorsOnSignUp}
