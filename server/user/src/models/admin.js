'use strict'

const db = require('../database/config')
const queries = require('./helper/admin_queries')
const constants = require('../constants')
const encrypt = require('../routes/helper/encrypt')

/**
 * @class { Admin }
 * @classdesc Admin Class specification
 * @static
 */
class Admin {
	/** @lends Admin.prototype */
	/**
     * @constructs AdminTables
	 * @throws {error} Throws error recieved from database
     */
	static async createTables() {

		try {
			await db.query(queries.USER_TABLE)
			await db.query(queries.PASSWORD_REMINDER)
			await db.query(queries.ADMIN_TABLE)
			await db.query(queries.TOKEN_BLACKLIST_TABLE)
			await this.saveAdminCred()
			return {message: 'created successfully'}

		} catch (error) {
			throw {
				status: constants.INTERNAL_SERVER_ERROR,
				title: 'Internal Server Error',
				detail: 'Error occurred whilst processing DB tables'
			}
		}
	}
	/**
     * @constructs saveAdminCred */
	static async saveAdminCred() {
		let data = {adminName: queries.ADMIN_NAME, password: queries.ADMIN_PASSWORD}
		data = await encrypt(data)
		const sql = 'INSERT INTO Admin SET ?'
		const result = await db.query(sql, [data])
			.catch(error => {
				console.error(error)
				throw error
			})
		console.log(result)
	}
	/**
     * @constructs getAdminLoginCred
	 * @param username */
	static async getAdminLoginCred(username) {
		const sql = 'SELECT adminName, Password FROM Admin WHERE adminName = ?'
		const result = await db.query(sql, username)
			.catch( error => {
				console.error(error)
				throw error
			})
		return result[0]
	}
}

module.exports = Admin
