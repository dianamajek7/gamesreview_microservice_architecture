'use strict'
const db = require('../database/config')
/**
 * @class { Rates }
 * @classdesc Rates Class specification
 * @static
 * @throws {error} Throws error recieved from database
 */
module.exports = class Rates {
	/** @lends Rates.prototype */
	/**
     * @constructs saveRate
	 * @param data */
	static async saveRate(data) {
		const rateValue = Object.freeze({userId: data.userId, gameId: data.gameId, rate: data.rate})
		const sql = 'INSERT INTO Rate SET ?'
		const res = await db.query(sql, [rateValue])
			.catch(error => {
				console.error(error)
				throw error
			})
		return res
	}
	/**
     * @constructs GetTotalRateByGameId
	 * @param gameId */
	static async getTotalRateByGameId(gameId) {
		const sql = 'SELECT SUM(DISTINCT rate) AS sum FROM Rate WHERE gameId = ?'
		const result = await db.query(sql, gameId)
			.catch(error => {
				console.error(error)
				throw error
			})
		return result[0].sum
	}
	/**
     * @constructs CountALLRateByGameID
	 * @param gameId */
	static async countALLRateByGameID(gameId) {
		const sql = 'SELECT COUNT(*) AS rateCounter FROM Rate WHERE gameId = ?'
		const result = await db.query(sql, gameId)
			.catch(error => {
				console.error(error)
				throw error
			})
		return result[0].rateCounter
	}
	/**
     * @constructs GetRateByUserID
	 * @param userId
	 * @param gameId */
	static async getRateByUserID(userId, gameId) {
		const sql = 'SELECT rate FROM Rate WHERE userId = ? And gameId = ?'
		const result = await db.query(sql, [userId, gameId])
			.catch(error => {
				console.error(error)
				throw error
			})
		return result[0]
	}
}
