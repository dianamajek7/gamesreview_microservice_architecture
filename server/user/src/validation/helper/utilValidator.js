'use strict'
const VALID = true
const INVALID = false
// /**
//  * Enum for tri-state regEx values with its's expression and error.
//  * @readonly
//  * @enum {string}
//  */
const allRegEx = {
	LETTERS_REGX: {expression: /(?=.*[a-zA-Z])/,
		error: 'Must contain at least one letter'},
	LETTERS_NUMBERS_REGX: {expression: /(?=.*\d)(?=.*[a-zA-Z])/,
		error: 'Must contain at least one letter and one number'},
	UPPER_LOWER_CASE_NUMBER_REGEX: {expression: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/,
		error: 'Must contain at least one uppercase, one lowercase letter and one number'},
	UPPER_LOWER_CASE_NUMBER_SPECIAL_CHAR_REGEX: {expression: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/,
		error: 'Must contain at least one uppercase, one lowercase letter, one number and one special character'},
	EMAIL_REGEX:
		{expression: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
			error: 'Must be a valid email address'},
	DOB_REGEX: {expression: /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/,
		error: 'Must be in dd/MM/yyyy this format only'}
}
/**
 * Check whether valid or error.
 * @param {boolean} valid - A boolean param
 * @param {string} error - A string param
 * @return {string} Returns valid or error */
const setValidatedResult = (valid, error) => {
	if (valid) return { valid }
	return { valid, error }
}
/**
 * Check whether a string is empty.
 * @param {string} value - A string param
 * @return {string} Returns true if string is empty or false if not empty */
const isEmpty = (value) => {
	if (value === '' || value === undefined || value === null) return true
	return false
}
/**
 * Check whether an object is empty.
 * @param {Object} value - An object param
 * @return {boolean} Returns true if object is empty or false if not empty */
const checkEmptyObject = (value) => {
	if(typeof value === 'object' && Object.keys(value).length === 0 ) return true
	return false
}
/**
 * Check whether a trimmed string or an object is empty.
 * @param {Object} value - An object or a trimmed string param
 * @return {boolean} Returns true if object or a trimmed string is empty or false if not empty */
const isEmptyObjectString = (value) => {
	if ( checkEmptyObject(value) || typeof value === 'string' && value.trim().length === 0) return true
	return false
}
/**
 * Check whether a string or an object is empty.
 * @param {string} value - An object or a string param
 * @example
 * // returns { valid: false, error: 'Must not be empty' }
 * @return {boolean} Returns false if object or string is empty with the appropriate error or true if not empty
 */
const validateIfEmpty = (value) => {
	if(isEmpty(value))
		return setValidatedResult(INVALID, 'Must not be empty')
	if(isEmptyObjectString(value))	return setValidatedResult(INVALID, 'Must not be empty')
	return setValidatedResult(VALID)
}
/**
 * Check whether a string contains only letters.
 * @param {string} value - A string param
 * @return {boolean} Returns false if string is empty or with not just letters with the appropriate error
 * or true if not empty and contains only letters
 */
const validateIfOnlyLetters = (value) => {
	if (/^[a-zA-Z ]+$/.test(value)) {
		return setValidatedResult(VALID)
	}
	return setValidatedResult(INVALID, 'Must contain only letters')
}
/**
 * Check required length.
 * @param {string} value - A string param
 * @param {number} minLength - A number param
 * @param {number} maxLength - A number param
 * @return {boolean} Returns false if string if string does not meet required min and max length
 * with the appropriate error or true if valid
 */
const validateRequiredLength = (value, minLength, maxLength) => {
	if (value.length >= minLength && value.length < maxLength) {
		return setValidatedResult(VALID)
	} else if (value.length < minLength) {
		return setValidatedResult(INVALID, `Must be at least ${minLength} characters long`)
	}
	return setValidatedResult(INVALID, `Must not be longer than ${maxLength} characters`)
}
/**
 * Check value contains the set of characters depending on the code case return valid response .
 * @param {string} value - A string param
 * @param {string} key - A string param
 * @return {boolean} Returns false if string if string does not meet required regexCode requirement
 * with the appropriate error
 */
const validateCharacters = (value, key) => {
	if (allRegEx[key]) return validateIfMatchRegEx(allRegEx[key].expression, value, allRegEx[key].error)
	return setValidatedResult(INVALID, 'Error, check enteries')
}
/**
 * Check value contains the set of characters depending on the code case return valid response .
 * @param {string} regex - A string param
 * @param {string} value - A string param
 * @param {Object} error - An object param
 * @return {boolean} Returns false if string if string does not meet required regexCode requirement
 * with the appropriate error or true if valid
 */
const validateIfMatchRegEx = (regEx, value, error) => {
	if (value.match(regEx)) return setValidatedResult(VALID)
	return setValidatedResult(INVALID, error)
}
/**
 * Get the correct format of the date parsed.
 * @param {string} date - A string param
 * @return {date} Returns the string converted to date in format DD/MM/YYYY
 */
const getDate = (date) => {
	const yearIndex = 2
	const day = Number(date.split('/')[0])
	const month = Number(date.split('/')[1])
	const year = Number(date.split('/')[yearIndex])

	return new Date(year, month, day)
}

module.exports = {
	setValidatedResult, isEmpty, isEmptyObjectString,
	validateIfEmpty, validateIfOnlyLetters, validateRequiredLength ,
	validateCharacters, validateIfMatchRegEx, getDate
}
