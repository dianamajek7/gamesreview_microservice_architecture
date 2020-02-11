
'use strict'
const validator = require('./helper/gameHelper')
const gameModel = require('../models/game')
const utilVal = require('./helper/utilValidator')
/**
 * Validate game input.
 * @param {Object} data - An object param
 * @return {Object} Returns an error of object if no error returns an empty object
 */
const validateGameInput = async(data) => {
	const errors = {}

	if (!validator.validateDescription(data.description).valid)
		errors.description = validator.validateDescription(data.description).error

	if (!validator.validateSummary(data.summary).valid)
		errors.summary = validator.validateSummary(data.summary).error

	Object.assign(errors, validateGameTitle(data.title),
		validateCategoryName(data.categoryName), validateData(data), await checkGameExist(errors, data))

	return errors
}
/**
 * Validate if game exists.
 * @param {Object} errors - An object param
 * @param {Object} data - An object param
 * @return {Object} Returns an error of object if no error returns an empty object
 */
const checkGameExist = async(errors, data) => {
	if(utilVal.isEmptyObjectString(errors)) {
		const result = await gameModel.getGameById(data.title)
		if(result) errors.game = 'Game already exists'
	}
	return errors
}
/**
 * Validate data.
 * @param {Object} data - An object param
 * @return {Object} Returns an error of object if no error returns an empty object
 */
const validateData = (data) => {
	const errors = {}
	if (!validator.validatePublisher(data.publisher).valid)
		errors.publisher = validator.validatePublisher(data.publisher).error

	if(!validator.validateImage(data.image).valid)
		errors.image =
                validator.validateImage(data.image).error
	return errors
}
/**
 * Validate game title.
 * @param {string} title - A string param
 * @return {Object} Returns an error of object if no error returns an empty object
 */
const validateGameTitle = (title) => {
	const errors = {}
	if (!validator.validateTitle(title).valid)
		 errors.title = validator.validateTitle(title).error
	return errors
}
/**
 * Validate rate.
 * @param {string} categoryName - A string param
 * @return {Object} Returns an error of object if no error returns an empty object
 */
const validateCategoryName = (categoryName) => {
	const errors = {}
	if (!validator.validateCategoryName(categoryName).valid)
		errors.categoryName =
			validator.validateCategoryName(categoryName).error
	return errors
}
/**
 * Validate user id.
 * @param {number} userId - A number param
 * @return {Object} Returns an error of object if no error returns an empty object
 */
const validateUserID = (userId) => {
	const errors = {}
	if(!validator.validateUserId(userId).valid)
		errors.userId = validator.validateUserId(userId).error
	return errors
}
/**
 * Validate rate.
 * @param {number} rate - A number param
 * @return {Object} Returns an error of object if no error returns an empty object
 */
const validateRate = (rate) => {
	const errors = {}
	if(!validator.validateRate(rate).valid)
		errors.rate = validator.validateRate(rate).error
	return errors
}
module.exports = { validateGameInput, validateGameTitle, validateCategoryName,
	validateUserID, validateRate}
