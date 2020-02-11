'use strict'

/**
 * Check whether a string is empty.
 * @param {string} value - A string param
 * @return {string} Returns true if string is empty or false if not empty
 */
const isEmpty = (value) => {
	if (value === '' || value === undefined || value === null) return true
	return false
}
/**
 * Check whether an object is empty.
 * @param {Object} value - An object param
 * @return {boolean} Returns true if object is empty or false if not empty
 */
const checkEmptyObject = (value) => {
	if(typeof value === 'object' && Object.keys(value).length === 0 ) return true
	return false
}

/**
 * Check whether a trimmed string or an object is empty.
 * @param {Object} value - An object or a trimmed string param
 * @return {boolean} Returns true if object or a trimmed string is empty or false if not empty
 */
const isEmptyObjectString = (value) => {
	if ( checkEmptyObject(value) ||
		typeof value === 'string' && value.trim().length === 0) return true
	return false
}

/**
 * Check whether a string or an object is empty.
 * @param {string} value - An object or a string param
 * @return {boolean} Returns true if object or string is empty or false if not empty
 */
const validateIfEmpty = (value) => {
	if(isEmpty(value))
		return true
	if(isEmptyObjectString(value))	return true
	return false
}


module.exports = { validateIfEmpty }
