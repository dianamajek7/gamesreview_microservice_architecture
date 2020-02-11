'use strict'
const validator = require('./helper/reviewHelper')
const utilVal = require('./helper/utilValidator')
const reviewModel = require('../models/reviews')
const likeModel = require('../models/likes')
/**
 * Validate review input.
 * @param {Object} data - An object param
 * @return {Object} Returns an error of object if no error returns an empty object
 */
const validateReviewInput = async(data) => {
	const errors = {}
	if (!validator.validateTitle(data.title).valid)
		errors.title = validator.validateTitle(data.title).error

	Object.assign(errors, validateData(data),
		validateUserId(data.userId), validateGameId(data.gameId))
	if(utilVal.isEmptyObjectString(errors)) {
		const result = await reviewModel.getReviewByUserAndGameId(data.gameId, data.userId)
		if(utilVal.validateIfEmpty(result).valid) errors.review = 'User already added review for the gameId'
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
	if (!validator.validateContent(data.content).valid)
		errors.content = validator.validateContent(data.content).error
	if(!validator.validateScreenshot(data.screenshot).valid)
		errors.screenshot =
                validator.validateScreenshot(data.screenshot).error
	return errors
}
/**
 * Validate review id.
 * @param {number} id - A number param
 * @return {Object} Returns an error of object if no error returns an empty object
 */
const validateReviewId = (id) => {
	const errors = {}
	if(!validator.validateId(id).valid)
		errors.reviewId = `Review ${validator.validateId(id).error}`
	return errors
}
/**
 * Validate user id.
 * @param {number} id - A number param
 * @return {Object} Returns an error of object if no error returns an empty object
 */
const validateUserId = (id) => {
	const errors = {}
	if(!validator.validateId(id).valid)
		errors.userId = `User ${validator.validateId(id).error}`
	return errors
}
/**
 * Validate game id.
 * @param {number} id - A number param
 * @return {Object} Returns an error of object if no error returns an empty object
 */
const validateGameId = (id) => {
	const errors = {}
	if(!validator.validateId(id).valid)
		errors.gameId = `Game ${validator.validateId(id).error}`
	return errors
}
/**
 * Validate review like.
 * @param {Object} data - An object param
 * @return {Object} Returns an error of object if no error returns an empty object
 */
const validateReviewLike = async(data) => {
	const errors = {}
	if (!validator.validateLike(data.like).valid)
		errors.like = validator.validateLike(data.like).error
	if(utilVal.isEmptyObjectString(errors)) {
		const result = await likeModel.getLikeByUserAndReviewId(data.userId, data.reviewId)
		if(utilVal.validateIfEmpty(result).valid) errors.like = 'User already liked the review'
		Object.assign(errors, await checkReviewExists(errors, data))
	}
	return errors
}
/**
 * Validate if review exists.
 * @param {Object} errors - An object param
 * @param {Object} data - An object param
 * @return {Object} Returns an error of object if no error returns an empty object
 */
const checkReviewExists = async(errors, data) => {
	const checkreviewExists = await reviewModel.getPendingReviewsById(data.reviewId)
	if(!utilVal.validateIfEmpty(checkreviewExists).valid) {
		errors.review = 'Review does not exist with the given Id'
	}
	return errors
}
/**
 * Validate flag.
 * @param {string} flag - A string param
 * @return {Object} Returns an error of object if no error returns an empty object
 */
const validateFlag = (flag) => {
	const errors = {}
	if (!validator.validateFlag(flag).valid)
		errors.flag = validator.validateFlag(flag).error
	return errors
}

module.exports = { validateReviewInput, validateReviewId, validateGameId,
	validateUserId, validateReviewLike, validateFlag}
