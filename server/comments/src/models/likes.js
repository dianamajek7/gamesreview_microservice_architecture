'use strict'
const db = require('../database/config')

/**
 * @class { Likes }
 * @classdesc Likes Class specification
 * @static
 * @throws {error} Throws error recieved from database
 */
module.exports = class Likes {
	/** @lends Likes.prototype */
	/**
     * @constructs Savelike
	 * @param data */
	static async savelike(data) {
		if(data.like === 'true') data.like = true
		const result = Object.freeze({userId: data.userId, commentId: data.commentId, liker: data.like})
		const sql = 'INSERT INTO Comment_Like SET ?'
		const res = await db.query(sql, [result])
			.catch(error => {
				console.error(error)
				throw error
			})
		return res[0]
	}
	/**
     * @constructs GetLikeByUserAndCommentId
	 * @param userId
	 * @param commentId */
	static async getLikeByUserAndCommentId(userId, commentId) {
		const sql = 'SELECT * FROM Comment_Like WHERE userId = ? AND commentId = ?'
		const result = await db.query(sql, [userId, commentId])
			.catch(error => {
				console.error(error)
				throw error
			})
		return result
	}
	/**
     * @constructs GetAllLikesBycommentID
	 * @param commentId */
	static async getAllLikesBycommentID(commentId) {
		const sql = 'SELECT * FROM Comment_Like WHERE commentId = ?'
		const result = await db.query(sql, commentId)
			.catch(error => {
				console.error(error)
				throw error
			})
		return result
	}

	/**
     * @constructs DeleteLike
	 * @param commentId
	 * @param userId */
	static async deleteLike(commentId, userId) {
		const sql = 'DELETE FROM Comment_Like WHERE commentId = ? AND userId = ?'
		const result = await db.query(sql, [commentId, userId])
			.catch(error => {
				console.error(error)
				throw error
			})
		return result[0]
	}


}
