/**
 * @author Rukiyat Majekodunmi <majekodr@uni.coventry.ac.uk>
 */
'use strict'
const mysql= require('mysql')

const localPort = 3306
const HOST = process.env.DB_HOST || 'localhost'
const PORT = process.env.DB_PORT || localPort
const USER = process.env.DB_USER || 'root'
const PASSWORD = process.env.DB_PASSWORD || 'password'
const DB = process.env.DB_DATABASE || 'comments_db'

/**
 * @class {Database}
 * @classdesc Database Class specification
 * @static
 */
module.exports = class Database {
	/**
	 * A class for creating database pool connection.
	 * @constructs
	 */
	static getPool() {

		const pool = mysql.createPool({
			host: HOST,
			port: PORT,
			user: USER,
			password: PASSWORD,
			database: DB,
		})
		return pool
	}

	/**
     * @class
	 * @property {object} connection Holds the database connection pool.
     * @property {string} query The database query.
	 * @property {set} params The values to be prepend to the database query.
     */
	static async executeQuery(connection, query, params) {
		return new Promise((resolve, reject) => {
			connection.query(query, params, (err, result) => {

				connection.release()
				connection.destroy()
				if (err) {
					console.log('Unexpected error whilst querying database')
					reject(err)
				} else {
					console.log(`Successfullly excecuted query: ${query}`)
					resolve(result)
				}
			})
		})

	}

	/**
     * @class
     * @property {string} query The database query.
	 * @property {set} params The values to be prepend to the database query.
     */
	static query(query, params) {
		return new Promise((resolve, reject) => {
			const pool = this.getPool()

			pool.getConnection(async(err, connection) => {

				if (err) {
					console.log(`Unexpected error whilst connecting to MySql client: ${err}`)
					reject(err)
				}

				await this.executeQuery(connection, query, params).then(res => resolve(res)).catch(err => reject(err))

			})
		})

	}
}
