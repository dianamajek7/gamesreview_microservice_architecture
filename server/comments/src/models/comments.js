'use strict'
const db = require('../database/config')
/**
 * @class { Comments }
 * @classdesc Comments Class specification
 * @static
 * @throws {error} Throws error recieved from database
 */
module.exports = class Comments {
	/** @lends Comments.prototype */
	/**
     * @constructs SaveComment
	 * @param comment
    */
	static async savecomment(comment) {
		const dateRegisteredEndPos = 19
		comment.date= new Date().toISOString().slice(0, dateRegisteredEndPos).replace('T', ' ')
		const result = Object.freeze({userId: comment.userId, reviewId: comment.reviewId,
			Title: comment.title, content: comment.content, dateAdded: comment.date})
		const sql = 'INSERT INTO Comment SET ?'
		const res = await db.query(sql, [result])
			.catch(error => {
				console.error(error)
				throw error
			})
		return res[0]
	}
	/**
     * @constructs GetCommentByUserAndReviewId
	 * @param userId
	 * @param reviewId
    */
	static async getCommentByUserAndReviewId(userId, reviewId) {
		const sql = 'SELECT Id, userId, reviewId, Title, content FROM Comment WHERE reviewId = ? AND userId = ?'
		const result = await db.query(sql, [reviewId, userId])
			.catch(error => {
				console.error(error)
				throw error
			})
		return result
	}
	/**
     * @constructs GetAllCommentsByReviewID
	 * @param reviewId
    */
	static async getAllCommentsByReviewID(reviewId) {
		const sql = `SELECT Id, userId, reviewId, Title, content
			FROM Comment WHERE reviewId = ?`
		const result = await db.query(sql, reviewId)
			.catch(error => {
				console.error(error)
				throw error
			})
		return result
	}
	/**
     * @constructs GetCommentById
	 * @param id
    */
	static async getCommentById(id) {
		const sql = `SELECT Id, userId, reviewId, Title, content
            FROM Comment WHERE Id = ?`
		const result = await db.query(sql, id)
			.catch(error => {
				console.error(error)
				throw error
			})
		return result
	}
	/**
     * @constructs UpdateCommentByUserAndReviewId
	 * @param comment
    */
	static async updateCommentByUserAndReviewId(comment) {
		const data = Object.freeze({Title: comment.title, content: comment.content})
		const sql = 'UPDATE Comment SET ? WHERE userId = ? AND reviewId = ?'
		const result = await db.query(sql, [data, comment.userId, comment.reviewId])
			.catch(error => {
				console.error(error)
				throw error
			})
		return result[0]
	}
	/**
     * @constructs DeleteComment
	 * @param userId
	 * @param reviewId
    */
	static async deleteComment(userId, reviewId) {
		const sql = 'DELETE FROM Comment WHERE userId = ? AND reviewId = ?'
		const result = await db.query(sql, [userId, reviewId])
			.catch(error => {
				console.error(error)
				throw error
			})
		return result[0]
	}
}
