'use strict'

const db = require('../database/config')
const queries = require('./helper/admin_queries')
const constants = require('../constants')
/**
 * @class { Admin }
 * @classdesc Admin Class specification
 * @static
 */
module.exports = class Admin {
	/** @lends Admin.prototype */
	/**
     * @constructs AdminTables
	 * @throws {error} Throws error recieved from database
     */
	static async createTables() {

		try {
			await db.query(queries.GAME_TABLE)
			await db.query(queries.CATEGORY_TABLE)
			await db.query(queries.RATE_TABLE)
			return {message: 'created successfully'}

		} catch (error) {
			throw {
				status: constants.INTERNAL_SERVER_ERROR,
				title: 'Internal Server Error',
				detail: 'Error occurred whilst processing DB tables'
			}
		}
	}
}
