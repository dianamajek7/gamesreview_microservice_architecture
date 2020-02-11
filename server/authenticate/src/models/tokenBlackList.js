'use strict'

const db = require('../database/config')

/**
 * @class { TokenBlackList }
 * @classdesc TokenBlackList Class specification
 * @static
 */
module.exports = class TokenBlackList {
	/** @lends TokenBlackList.prototype */
	/**
     * @constructs TokenBlackList
     * @param token
	 * @throws {error} Throws error recieved from database
     */
	static async getTokenBlackListed(token) {
		const sql = 'SELECT * FROM token_BlackList WHERE token = ?'
		const result = await db.query(sql, token)
			.catch(error => {
				console.error(error)
				throw error
			})
		console.log(result[0])
		return result[0]
	}

}
