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
		false, `Game title ${Validation.validateIfEmpty(value).error}`)

	if (!Validation.validateIfOnlyLetters(value).valid) return Validation.setValidatedResult(
		false, `Game title ${Validation.validateIfOnlyLetters(value).error}`)
	return res
}
/**
 * Validate whether a Description string is empty.
 * @param {string} value - A description string param
 * @return {boolean} Returns false of const res if description string is empty with the appropriate error
 * or true if not empty
 */
const validateDescription = (value) => {
	if (!Validation.validateIfEmpty(value).valid) return Validation.setValidatedResult(
		false, `Game description ${Validation.validateIfEmpty(value).error}`)

	if (!Validation.validateContainsWords(value).valid) return Validation.setValidatedResult(
		false, `Game description ${Validation.validateContainsWords(value).error}`)
	return res
}
/**
 * Validate whether a Summary string is empty.
 * @param {string} value - A summary string param
 * @return {boolean} Returns false of const res if summary string is empty with the appropriate error
 * or true if not empty
 */
const validateSummary = (value) => {
	if (!Validation.validateIfEmpty(value).valid) return Validation.setValidatedResult(
		false, `Game summary ${Validation.validateIfEmpty(value).error}`)

	if (!Validation.validateContainsWords(value).valid) return Validation.setValidatedResult(
		false, `Game summary ${Validation.validateContainsWords(value).error}`)
	return res
}
/**
 * Validate whether a Publisher string is empty.
 * @param {string} value - A publisher string param
 * @return {boolean} Returns false of const res if publisher string is empty with the appropriate error
 * or true if not empty
 */
const validatePublisher = (value) => {
	if (!Validation.validateIfEmpty(value).valid) return Validation.setValidatedResult(
		false, `Game publisher ${Validation.validateIfEmpty(value).error}`)

	if (!Validation.validateIfOnlyLetters(value).valid) return Validation.setValidatedResult(
		false, `Game publisher ${Validation.validateIfOnlyLetters(value).error}`)
	return res
}
/**
 * Validate whether a Image string is empty.
 * @param {string} value - A categrory name string param
 * @return {boolean} Returns false of const res if categrory name string is empty with the appropriate error
 * or true if not empty
 */
const validateCategoryName = (value) => {
	if (!Validation.validateIfEmpty(value).valid) return Validation.setValidatedResult(
		false, `Category name ${Validation.validateIfEmpty(value).error}`)
	if (!Validation.validateIfOnlyLetters(value).valid) return Validation.setValidatedResult(
		false, `Category name ${Validation.validateIfOnlyLetters(value).error}`)
	return res
}
/**
 * Validate whether a Image string is empty.
 * @param {string} value - A image url string param
 * @return {boolean} Returns false of const res if image url string is empty with the appropriate error
 * or true if not empty
 */
const validateImage = (imageUrl) => {

	if (!Validation.validateIfEmpty(imageUrl).valid) return Validation.setValidatedResult(
		false, `Game image ${Validation.validateIfEmpty(imageUrl).error}`)

	return res
}
/**
 * Validate whether UserID number is empty.
 * @param {number} userID - A user id number param
 * @return {boolean} Returns false of const res if user id number is empty with the appropriate error
 * or true if not empty
 */
const validateUserId = (userID) => {

	if (!Validation.validateIfEmpty(userID).valid) return Validation.setValidatedResult(
		false, `User id ${Validation.validateIfEmpty(userID).error}`)

	if (!Validation.isNumber(userID).valid) return Validation.setValidatedResult(
		false, `User id ${Validation.isNumber(userID).error}`)

	return res
}
/**
 * Validate whether Rate number is empty.
 * @param {float} valuer - A rate float param
 * @return {boolean} Returns false of const res if rate number is empty
 * or not a number or is greater than 5 with the appropriate error
 * and true if not empty
 */
const validateRate = (value) => {
	const maxRateValue = 5.0
	if (!Validation.validateIfEmpty(value).valid) return Validation.setValidatedResult(
		false, `Rate ${Validation.validateIfEmpty(value).error}`)

	if (!Validation.isNumberOrDecimal(value).valid) return Validation.setValidatedResult(
		false, `Rate ${Validation.isNumberOrDecimal(value).error}`)
	if(value > maxRateValue) return Validation.setValidatedResult(
		false, 'Rate is out of 5')
	return res
}


module.exports = {
	validateTitle,
	validateDescription,
	validateSummary,
	validatePublisher,
	validateCategoryName,
	validateImage,
	validateUserId,
	validateRate
}
