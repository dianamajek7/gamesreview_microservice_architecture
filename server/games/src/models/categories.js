'use strict'
/**
 * @class { Categories }
 * @classdesc Categories Class specification
 * @static
 * @throws {error} Throws error recieved from database
 */
const db = require('../database/config')
const queries = require('./helper/admin_queries')
const utilVal = require('../validation/helper/utilValidator')
module.exports = class Categories {
	/** @lends Categories.prototype */
	/**
     * @constructs GetCategoryById
	 * @param categoryName
    */
	static async getCategoryById(categoryName) {
		const result = await db.query(queries.SELECT_CATEGORY_BYID, categoryName)
			.catch(error => {
				console.error(error)
				throw error
			})
		console.log(result)
		if(!utilVal.isEmptyObjectString(result)) return result[0].Id
	}
	/**
     * @constructs SaveCategory
	 * @param category
    */
	static async saveCategory(category) {
		let result = await this.getCategoryById(category)

		if(utilVal.isEmpty(result)) {
			const categoryName = Object.freeze({Name: category})
			const sql = 'INSERT INTO Category SET ?'
			await db.query(sql, [categoryName])
				.catch(error => {
					console.error(error)
					throw error
				})
			result = await this.getCategoryById(category)
			return result
		}
		return result
	}
	/**
     * @constructs GetAllCategories
    */
	static async getAllCategories() {
		const sql = 'SELECT * FROM Category'
		const result = await db.query(sql)
			.catch(error => {
				console.error(error)
				throw error
			})
		return result
	}

}
