'use strict'
const VALID = true; const INVALID = false
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
 * @return {boolean} Returns false if object or string is empty with the appropriate error or true if not empty */
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
 * or false if not empty and contains only letters
 */
const validateIfOnlyLetters = (value) => {
	if (/^[a-zA-Z ]+$/.test(value)) {
		return setValidatedResult(VALID)
	}
	return setValidatedResult(INVALID, 'Must contain only letters')
}
/**
 * Check whether a string contains words.
 * @param {string} value - A string param
 * @return {boolean} Returns false if string is empty or contains less than two words
 *  with the appropriate error true if not empty
 */
const validateContainsWords = (value) => {
	if(/(\w.+\s).+$/.test(value)) return setValidatedResult(VALID)
	return setValidatedResult(INVALID, 'Must contain at least two words')
}
/**
 * Check whether value is a number or decimal.
 * @param {float} value - A float param
 * @return {boolean} Returns false if value isn't a number or a decimal with the appropriate error
 * or true if not empty and is a number
 */
const isNumberOrDecimal = (value ) => {
	if(!/^[1-9]\d*(\.\d+)?$/.test(value)) return setValidatedResult(INVALID, 'Must be a number or a decimal')
	return setValidatedResult(VALID)
}
/**
 * Check whether value is a number.
 * @param {number} value - A number param
 * @return {boolean} Returns false if value isn't a number with the appropriate error
 * or true if not empty and is a number
 */
const isNumber = (value ) => {
	if(!/^\d+$/.test(value)) return setValidatedResult(INVALID, 'Must be a number')
	return setValidatedResult(VALID)
}
module.exports = {
	setValidatedResult,
	isEmpty,
	isEmptyObjectString,
	validateIfOnlyLetters,
	validateContainsWords,
	validateIfEmpty,
	isNumber,
	isNumberOrDecimal
}
