'use strict'
const validator = require('./helper/commentHelper')
const utilVal = require('./helper/utilValidator')
const commentModel = require('../models/comments')
const likeModel = require('../models/likes')
/**
 * Validate comment input.
 * @param {Object} data - An object param
 * @return {Object} Returns an error of object if no error returns an empty object
 */
const validateCommentInput = async(data) => {
	const errors = {}

	Object.assign(errors, validateData(data), validateUserId(data.userId), validateReviewId(data.reviewId))
	if(utilVal.isEmptyObjectString(errors)) {
		const result = await commentModel.getCommentByUserAndReviewId(data.userId, data.reviewId)
		if(utilVal.validateIfEmpty(result).valid) errors.review = 'User already added comment'
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
	if (!validator.validateTitle(data.title).valid)
		errors.title = validator.validateTitle(data.title).error
	if (!validator.validateContent(data.content).valid)
		errors.content = validator.validateContent(data.content).error
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
 * Validate comment id.
 * @param {number} id - A number param
 * @return {Object} Returns an error of object if no error returns an empty object
 */
const validateCommentId = (id) => {
	const errors = {}
	if(!validator.validateId(id).valid)
		errors.commentId = `Comment ${validator.validateId(id).error}`
	return errors
}
/**
 * Validate comment like.
 * @param {Object} data - An object param
 * @return {Object} Returns an error of object if no error returns an empty object
 */
const validateCommentLike = async(data) => {
	const errors = {}
	if (!validator.validateLike(data.like).valid)
		errors.like = validator.validateLike(data.like).error
	if(utilVal.isEmptyObjectString(errors)) {
		const result = await likeModel.getLikeByUserAndCommentId(data.userId, data.commentId)
		if(utilVal.validateIfEmpty(result).valid) errors.like = 'User already liked the comment'

		Object.assign(errors, await checkcommentExists(errors, data))
	}
	return errors
}
/**
 * Validate if comment exists.
 * @param {Object} errors - An object param
 * @param {Object} data - An object param
 * @return {Object} Returns an error of object if no error returns an empty object
 */
const checkcommentExists = async(errors, data) => {
	const checkcommentExists = await commentModel.getCommentById(data.commentId)
	if(!utilVal.validateIfEmpty(checkcommentExists).valid) {
		errors.comment = 'Comment does not exist with the given Id'
	}
	return errors
}

module.exports = { validateCommentInput, validateReviewId, validateCommentId,
	validateUserId, validateCommentLike, validateData}
