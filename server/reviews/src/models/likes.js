'use strict'
/**
 * @class { Likes }
 * @classdesc Likes Class specification
 * @static
 * @throws {error} Throws error recieved from database
 */
const db = require('../database/config')
module.exports = class Likes {
	/** @lends Likes.prototype */
	/**
     * @constructs Savelike
	 * @param data
    */
	static async savelike(data) {
		if(data.like === 'true') data.like = true
		const result = Object.freeze({userId: data.userId, reviewId: data.reviewId, liker: data.like})
		const sql = 'INSERT INTO Review_Like SET ?'
		const res = await db.query(sql, [result])
			.catch(error => {
				console.error(error)
				throw error
			})
		return res[0]
	}
	/**
     * @constructs GetLikeByUserAndReviewId
	 * @param userId
	 * @param reviewId
    */
	static async getLikeByUserAndReviewId(userId, reviewId) {
		const sql = 'SELECT * FROM Review_Like WHERE userId = ? AND reviewId = ?'
		const result = await db.query(sql, [userId, reviewId])
			.catch(error => {
				console.error(error)
				throw error
			})
		return result
	}
	/**
     * @constructs GetAllLikesByReviewID
	 * @param reviewId
    */
	static async getAllLikesByReviewID(reviewId) {
		const sql = 'SELECT * FROM Review_Like WHERE reviewId = ?'
		const result = await db.query(sql, reviewId)
			.catch(error => {
				console.error(error)
				throw error
			})
		return result
	}
	/**
     * @constructs DeleteLike
	 * @param reviewId
	 * @param userId
    */
	static async deleteLike(reviewId, userId) {
		const sql = 'DELETE FROM Review_Like WHERE reviewId = ? AND userId = ?'
		const result = await db.query(sql, [reviewId, userId])
			.catch(error => {
				console.error(error)
				throw error
			})
		return result[0]
	}
}
