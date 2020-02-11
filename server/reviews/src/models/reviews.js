'use strict'
/**
 * @class { Reviews }
 * @classdesc Reviews Class specification
 * @static
 * @throws {error} Throws error recieved from database
 */
const db = require('../database/config')
module.exports = class Reviews {
	/** @lends Reviews.prototype */
	/**
     * @constructs Savereview
	 * @param review */
	static async savereview(review) {
		const dateRegisteredEndPos = 19
		review.date= new Date().toISOString().slice(0, dateRegisteredEndPos).replace('T', ' ')
		const result = Object.freeze({userId: review.userId, gameId: review.gameId,
			Title: review.title, content: review.content, screenshotImageURL: review.screenshot,
			flag: 'pending', dateAdded: review.date})
		const sql = 'INSERT INTO Review SET ?'
		const res = await db.query(sql, [result])
			.catch(error => {
				console.error(error)
				throw error
			})
		return res
	}
	/**
     * @constructs GetReviewByUserAndGameId
	 * @param gameId
	 * @param userId */
	static async getReviewByUserAndGameId(gameId, userId) {
		const sql = 'SELECT Id FROM Review WHERE gameId = ? AND userId = ?'
		const result = await db.query(sql, [gameId, userId])
			.catch(error => {
				console.error(error)
				throw error
			})
		return result
	}
	/**
     * @constructs GetAllReviewsByGameID
	 * @param gameId */
	static async getAllReviewsByGameID(gameId) {
		const flag = 'approved'
		const sql = `SELECT Id, userId, gameId, Title, content, 
			screenshotImageURL FROM Review WHERE gameId = ? AND flag = ?`
		const result = await db.query(sql, [gameId, flag])
			.catch(error => {
				console.error(error)
				throw error
			})
		return result
	}
	/**
     * @constructs GetPendingReviewsByGameID
	 * @param gameId */
	static async getPendingReviewsByGameID(gameId) {
		const flag = 'pending'
		const sql = `SELECT Id, userId, gameId, Title, content, 
			screenshotImageURL FROM Review WHERE gameId = ? AND flag = ?`
		const result = await db.query(sql, [gameId, flag])
			.catch(error => {
				console.error(error)
				throw error
			})
		return result
	}
	/**
     * @constructs GetPendingReviewsById
	 * @param id */
	static async getPendingReviewsById(id) {
		const sql = `SELECT userId, gameId, Title, content, 
			screenshotImageURL FROM Review WHERE Id = ?`
		const result = await db.query(sql, id)
			.catch(error => {
				console.error(error)
				throw error
			})
		return result
	}
	/**
     * @constructs GetApprovedReviewById
	 * @param id */
	static async getApprovedReviewById(id) {
		const flag = 'approved'
		const sql = `SELECT userId, gameId, Title, content, 
			screenshotImageURL FROM Review WHERE Id = ? AND flag = ?`
		const result = await db.query(sql, [id, flag])
			.catch(error => {
				console.error(error)
				throw error
			})
		return result
	}
	/**
     * @constructs GetAllReviews */
	static async getAllReviews() {
		const sql = 'SELECT * FROM Review'
		const result = await db.query(sql)
			.catch(error => {
				console.error(error)
				throw error
			})
		return result
	}
	/**
     * @constructs UpdateReviewFlag
	 * @param flag
	 * @param id
    */
	static async updateReviewFlag(flag, id) {
		const data = Object.freeze({flag})
		const sql = 'UPDATE Review SET ? WHERE Id = ?'
		const result = await db.query(sql, [data, id])
			.catch(error => {
				console.error(error)
				throw error
			})
		return result[0]
	}
	/**
     * @constructs deleteReview
	 * @param reviewId
    */
	static async deleteReview(reviewId) {
		const sql = 'DELETE FROM Review WHERE Id = ?'
		const result = await db.query(sql, reviewId)
			.catch(error => {
				console.error(error)
				throw error
			})
		return result[0]
	}
}
