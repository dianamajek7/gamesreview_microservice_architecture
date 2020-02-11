'use strict'

/**
 * @function getResult
 * @param {string} data - An object containing user data
 * @return {Data} The user data on signup
 */
const getResult = (data) => Object.freeze({userId: data.userId, securityQuestion1: data.securityQuestion1,
	securityAnswer1: data.securityAnswer1, securityQuestion2: data.securityQuestion2,
	securityAnswer2: data.securityAnswer2})

/**
 * @function getDeletedUserData
 * @param {string} data - An object containing a deleted user data
 * @return {Data} The deleted user data on signup
 */
const getDeletedUserData = (result) => {
	const dateRegisteredEndPos = 19
	const data = { Username: result.username, Password: result.password,
		Email: result.email, profileImageURL: result.profileImageURL, role: 0, Active: true, Deleted: false}
	data.dateRegistered = new Date().toISOString().slice(0, dateRegisteredEndPos).replace('T', ' ')
	return Object.freeze(data)
}

module.exports = {
	getResult, getDeletedUserData
}
