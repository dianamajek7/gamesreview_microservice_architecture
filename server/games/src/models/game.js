'use strict'
const db = require('../database/config')
const queries = require('./helper/admin_queries')
/**
 * @class { Games }
 * @classdesc Games Class specification
 * @static
 * @throws {error} Throws error recieved from database
 */
module.exports = class Games {
	/** @lends Games.prototype */
	/**
     * @constructs Savegame
	 * @param game
    */
	static async savegame(game) {
		const result = Object.freeze( {title: game.title,
			categoryID: game.categoryID, Publisher: game.publisher,
			summary: game.summary, description: game.description, imageURL: game.image})
		const sql = 'INSERT INTO Game SET ?'
		const res = await db.query(sql, [result])
			.catch(error => {
				console.error(error)
				throw error
			})
		return res
	}
	/**
     * @constructs UpdateGameRating
	 * @param rate
	 * @param gameId */
	static async updateGameRating(rate, gameId) {
		const data = Object.freeze({rating: rate})
		const sql = 'UPDATE Game SET ? WHERE Id = ?'
		const result = await db.query(sql, [data, gameId])
			.catch(error => {
				console.error(error)
				throw error
			})
		return result[0]
	}
	/**
     * @constructs GetAllGames */
	static async getAllGames() {
		const sql = 'SELECT * FROM Game'
		const result = await db.query(sql)
			.catch(error => {
				console.error(error)
				throw error
			})
		return result
	}
	/**
     * @constructs GetGameByTitle
	 * @param gameTitle */
	static async getGameByTitle(gameTitle) {
		const sql = 'SELECT * FROM Game WHERE Title = ?'
		const result = await db.query(sql, gameTitle)
			.catch(error => {
				console.error(error)
				throw error
			})
		return result
	}
	/**
     * @constructs GetGameTitles */
	static async getGameTitles() {
		const sql = 'SELECT Title FROM Game'
		const result = await db.query(sql)
			.catch(error => {
				console.error(error)
				throw error
			})
		return result
	}
	/**
     * @constructs GetByGameCategory
	 * @param categoryId */
	static async getByGameCategory(categoryId) {
		const sql = 'SELECT * FROM Game WHERE categoryID = ?'
		const result = await db.query(sql, categoryId)
			.catch(error => {
				console.error(error)
				throw error
			})
		return result
	}
	/**
     * @constructs GetGameById
	 * @param gameTitle */
	static async getGameById(gameTitle) {
		const result = await db.query(queries.SELECT_GAME_BYID, gameTitle)
			.catch(error => {
				console.error(error)
				throw error
			})
		if(result[0]) return result[0].Id
	}
}
