'use strict'
const db = require('../database/config'); const user = require('./helper/user')
const queries = require('./helper/admin_queries'); const helper = require('./helper/user')
/**
 * @class { User }
 * @classdesc User Class specification
 * @static
 * @throws {error} Throws error recieved from database */
module.exports = class User {
	/** @lends User.prototype */
	/**
     * @constructs getUserLoginCred
	 * @param username */
	static async getUserLoginCred(username) {
		const result = await db.query('SELECT Id, Password, Active, Deleted FROM User WHERE Username = ?', username)
			.catch( error => {
				console.error(error); throw error
			}); return result[0]
	}
	/**
     * @constructs getUserByUsername
	 * @param username */
	static async getUserByUsername(username) {
		const result = await db.query('SELECT Username, Deleted FROM User WHERE Username = ?', username)
			.catch( error => {
				console.error(error); throw error
			}); return result[0]
	}
	/**
     * @constructs getUserByEmail
	 * @param email */
	static async getUserByEmail(email) {
		const result = await db.query('SELECT Email, Deleted FROM User WHERE Email = ?', email)
			.catch(error => {
				console.error(error); throw error
			}); return result[0]
	}
	/**
     * @constructs getAllUserDataById
	 * @param id */
	static async getAllUserDataById(id) {
		const result = await db.query('SELECT * FROM User WHERE Id = ?', id)
			.catch(error => {
				console.error(error); throw error
			}); return result[0]
	}
	/**
     * @constructs getUserById
	 * @param username */
	static async getUserById(username) {
		return await db.query(queries.SELECT_USERID, username)
			.catch(error => {
				console.error(error); throw error
			})
	}
	/**
     * @constructs getUserRole
	 * @param id */
	static async getUserRole(id) {
		const res = await db.query('SELECT role FROM User WHERE Id= ?', id)
			.catch(error => {
				console.error(error); throw error
			}); return res[0]
	}
	/**
     * @constructs savePasswordReminder
	 * @param data */
	static async savePasswordReminder(data) {
		let result = user.getResult(data)
		result = await db.query('INSERT INTO Password_Reminder SET ?', [result])
			.catch(error => {
				console.error(error); throw error
			}); return result
	}
	/**
     * @constructs updatePasswordReminder
	 * @param data */
	static async updatePasswordReminder(data) {
		let result = user.getResult(data)
		result = await db.query('UPDATE Password_Reminder SET ? WHERE userId = ?', [result, data.userId])
			.catch(error => {
				console.error(error); throw error
			}); return result[0]
	}
	/**
     * @constructs registerUser
	 * @param result */
	static async registerUser(result) {
		const dateRegisteredEndPos = 19
		let data = Object.assign({ Username: result.username, Password: result.password,
			Email: result.email, profileImageURL: result.profileImageURL})
		data.Active = true; data.Deleted = false; data.role = 0
		data.dateRegistered = new Date().toISOString().slice(0, dateRegisteredEndPos).replace('T', ' ')
		await db.query('INSERT INTO User SET ?', data)
			.catch(error => {
				console.error(error); throw error
			}); data = await this.getUserById(result.username); return data[0].Id
	}
	/**
     * @constructs blackListToken
	 * @param token */
	static async blackListToken(token) {
		return await db.query('INSERT INTO token_BlackList SET ?', [{token}])
			.catch(error => {
				console.error(error); throw error
			})
	}
	/**
     * @constructs getBlackListToken
	 * @param token */
	static async getBlackListToken(token) {
		return await db.query('SELECT * FROM token_BlackList WHERE token = ?', token)
			.catch(error => {
				console.error(error); throw error
			})
	}
	/**
     * @constructs deletedUserParam
	 * @param result
	 * @param emailDeleted*/
	static async deletedUserParam(result, emailDeleted, usernameDeleted) {
		let sql, queryParam = ''
		if(usernameDeleted) {
			sql = 'UPDATE User SET ? WHERE Username = ?'; queryParam = result.username
		} else if(emailDeleted) {
			sql = 'UPDATE User SET ? WHERE Email = ?'; queryParam = result.email
		}; return {sql, queryParam}
	}
	/**
     * @constructs updateDeletedUser
	 * @param result
	 * @param emailDeleted*/
	static async updateDeletedUser(result, emailDeleted, usernameDeleted) {
		const data = await helper.getDeletedUserData(result)
		const {sql, queryParam} = await this.deletedUserParam(result, emailDeleted, usernameDeleted)
		await db.query(sql, [data, queryParam])
			.catch(error => {
				console.error(error); throw error
			}); const res = await this.getUserById(result.username); return res[0].Id
	}
}
