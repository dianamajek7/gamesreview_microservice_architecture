'use strict'
const Validation = require('./utilValidator')
/** @constant {boolean} */
const res = {valid: true}
const MAX_LENGTH = 80
const MIN_LENGTH = 7
const PWD_CHAR_REGX = 'UPPER_LOWER_CASE_NUMBER_SPECIAL_CHAR_REGEX'
const EMAIL_CHAR_REGEX = 'EMAIL_REGEX'
const LETTERS_CHAR_REGX = 'LETTERS_REGX'
/**
 * Validate whether a Username string is empty.
 * @param {string} username - A username string param
 * @return {boolean} Returns false of const res if username string is empty
 * with the appropriate error or true if not empty
 */
const validateUserName = (username) => {
	if (!Validation.validateIfEmpty(username).valid) return Validation.setValidatedResult(
		false, `Username ${Validation.validateIfEmpty(username).error}`)

	if (!Validation.validateCharacters(username, LETTERS_CHAR_REGX).valid) return Validation.setValidatedResult(
		false, `Username ${Validation.validateCharacters(username, LETTERS_CHAR_REGX).error}`)
	return res
}
/**
 * Validate whether a password string is empty.
 * @param {string} password - A password string param
 * @return {boolean} Returns false of const res if password string is empty
 * with the appropriate error or true if not empty
 */
const validatePassword = (password) => {
	if (!Validation.validateIfEmpty(password).valid) return Validation.setValidatedResult(
		false, `Password ${Validation.validateIfEmpty(password).error}`)
	if (!Validation.validateRequiredLength(password, MIN_LENGTH, MAX_LENGTH).valid)
		return Validation.setValidatedResult(
			false, `Password ${Validation.validateRequiredLength(password, MIN_LENGTH, MAX_LENGTH).error}`)
	// check password against character set (4- A a 1 @)
	if (!Validation.validateCharacters(password, PWD_CHAR_REGX).valid)
		return Validation.setValidatedResult(
			false, `Password ${Validation.validateCharacters(password, PWD_CHAR_REGX).error}`)
	return res
}
/**
 * Validate whether a ConfirmPassword string is empty and matches password string param.
 * @param {string} password - A password string param
 * @param {string} confirmPassword - A confirm password string param
 * @return {boolean} Returns false of const res if confirm password string is empty
 * with the appropriate error or true if not empty
 */
const validateConfirmPassword = (password, confirmPassword) => {
	if (!validatePassword(password).valid)
		return validatePassword(password)
	if (password !== confirmPassword)
		return Validation.setValidatedResult(false, 'Passwords must match')
	return res
}
/**
 * Validate whether a Email string is empty.
 * @param {string} email - A email string param
 * @return {boolean} Returns false of const res if email string is empty
 * with the appropriate error or true if not empty
 */
const validateEmail = (email) => {
	if (!Validation.validateIfEmpty(email).valid) return Validation.setValidatedResult(
		false, `Email ${Validation.validateIfEmpty(email).error}`)
	if (!Validation.validateCharacters(email, EMAIL_CHAR_REGEX).valid)
		return Validation.setValidatedResult(false,
			`Email ${Validation.validateCharacters(email, EMAIL_CHAR_REGEX).error}`)
	return res
}
/**
 * Validate whether a securityQuestions string are empty.
 * @param {string} securityQuest1 - A securityQuest1 string param
 * @param {string} securityQuest2 - A securityQuest2 string param
 * @return {boolean} Returns false of const res if security questions string is empty
 * with the appropriate error or true if not empty
 */
const validateSecurityQuest = (securityQuest1, securityQuest2) => {
	if (!Validation.validateIfEmpty(securityQuest1).valid || !Validation.validateIfEmpty(securityQuest2).valid)
		return Validation.setValidatedResult(false, 'Security question must be selected')
	if(securityQuest1 === securityQuest2)
		return Validation.setValidatedResult(false, 'Security questions must not be the same')
	return res
}
/**
 * Validate whether a securityAnswers string are empty.
 * @param {string} securityAnswer1 - A securityAnswer1 string param
 * @param {string} securityAnswer2 - A securityAnswer2 string param
 * @return {boolean} Returns false of const res if security questions string is empty
 * with the appropriate error or true if not empty
 */
const validateSecurityAnswer = (securityAnswer1, securityAnswer2) => {
	if (!Validation.validateIfEmpty(securityAnswer1).valid || !Validation.validateIfEmpty(securityAnswer2).valid)
		return Validation.setValidatedResult(false, 'Security answer must be filled')
	if(securityAnswer1 === securityAnswer2)
		return Validation.setValidatedResult(false, 'Security answers must not be the same')
	return res
}
/**
 * Validate whether a ImageUrl string is empty.
 * @param {string} imageUrl - A imageUrl string param
 * @return {boolean} Returns false of const res if imageUrl string is empty with the appropriate error
 * or true if not empty
 */
const validateImage = (imageUrl) => {
	if (!Validation.validateIfEmpty(imageUrl).valid) return Validation.setValidatedResult(
		false, `Image ${Validation.validateIfEmpty(imageUrl).error}`)
	return res
}

module.exports = { validateUserName, validatePassword,
	validateConfirmPassword, validateEmail, validateSecurityQuest,
	validateSecurityAnswer, validateImage
}
