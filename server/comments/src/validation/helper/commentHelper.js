'use strict'
const Validation = require('./utilValidator')
/** @constant {boolean} */
const res = { valid: true }
/**
 * Validate whether a Title string is empty.
 * @param {string} value - A title string param
 * @return {boolean} Returns false of const res if title string is empty with the appropriate error or true if not empty
 */
const validateTitle = (value) => {
	if (!Validation.validateIfEmpty(value).valid) return Validation.setValidatedResult(
		false, `Comment title ${Validation.validateIfEmpty(value).error}`)

	if (!Validation.validateIfOnlyLetters(value).valid) return Validation.setValidatedResult(
		false, `Comment title ${Validation.validateIfOnlyLetters(value).error}`)
	return res
}
/**
 * Validate whether a Content string is empty.
 * @param {string} value - A content string param
 * @return {boolean} Returns false of const res if content string is empty with the appropriate error
 * or true if not empty
 */
const validateContent = (value) => {
	if (!Validation.validateIfEmpty(value).valid) return Validation.setValidatedResult(
		false, `Comment content ${Validation.validateIfEmpty(value).error}`)

	if (!Validation.validateContainsWords(value).valid) return Validation.setValidatedResult(
		false, `Comment content ${Validation.validateContainsWords(value).error}`)
	return res
}
/**
 * Validate whether like string is empty.
 * @param {string} value - A like string param
 * @return {boolean} Returns false of const res if like string is empty with the appropriate error
 * or true if not empty
 */
const validateLike = (value) => {
	if (!Validation.validateIfEmpty(value).valid) return Validation.setValidatedResult(
		false, `Like ${Validation.validateIfEmpty(value).error}`)

	if (!Validation.validateIfOnlyLetters(value).valid) return Validation.setValidatedResult(
		false, `Like ${Validation.validateIfOnlyLetters(value).error}`)
	return res
}
/**
 * Validate whether id number is empty.
 * @param {number} id - A id number param
 * @return {boolean} Returns false of const res if id number is empty with the appropriate error
 * or true if not empty
 */
const validateId = (id) => {
	if (!Validation.validateIfEmpty(id).valid) return Validation.setValidatedResult(
		false, `Id ${Validation.validateIfEmpty(id).error}`)

	if (!Validation.isNumber(id).valid) return Validation.setValidatedResult(
		false, `Id ${Validation.isNumber(id).error}`)
	return res
}

module.exports = {
	validateTitle,
	validateContent,
	validateId,
	validateLike
}
