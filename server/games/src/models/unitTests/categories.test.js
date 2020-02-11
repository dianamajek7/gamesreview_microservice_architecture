'use strict'

const categories = require('../categories')
const categoriesDB = require('../../database/config')
const sqlite = require('sqlite-async')
const sinon = require('sinon')

let testPoolStub

afterEach(() => {
	jest.clearAllMocks()
})

describe('saveCategory() exiting id', () => {
	test('should successfully return id of existing category', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(categoriesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Category (Id INTEGER PRIMARY KEY AUTOINCREMENT,
                Name TEXT);`)
			await db.run(`INSERT INTO Category(Name)
                VALUES("Thriller");`)
			sql = `SELECT Id FROM Category WHERE Name = "${params}";`
			const data = await db.all(sql)
			await db.close()
			return data
		})
		const result = await categories.saveCategory('Thriller').then(result => result)
		expect(result).toEqual(1)
		testPoolStub.restore()
		done()
	})
})

describe('saveCategory()', () => {

	test('should successfully save category and return its id', async(done) => {
		expect.assertions(1)

		testPoolStub = sinon.stub(categoriesDB, 'query').callsFake(async(sql, params) => {

			if(testPoolStub.callCount === 2) {
				console.log('callCount2')
				console.log(`MOCK ${sql} with params ${params}`)
				const db = await sqlite.open(':memory:')
				await db.run(`CREATE TABLE IF NOT EXISTS Category (Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Name TEXT);`)
				await db.run(`INSERT INTO Category(Name)
		            VALUES("Thriller");`)
			    await db.close()
				return
			} else if(testPoolStub.callCount === 1) {
				console.log('callCount1')
				console.log(`MOCK ${sql} with params ${params}`)
				const db = await sqlite.open(':memory:')
				await db.run(`CREATE TABLE IF NOT EXISTS Category (Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Name TEXT);`)

				sql = `SELECT Id FROM Category WHERE Name = "${params}";`
				const data = await db.all(sql)
				await db.close()
				return data
			} else if (testPoolStub.callCount === 3) {
				console.log(`MOCK ${sql} with params ${params}`)
				const db = await sqlite.open(':memory:')
				await db.run(`CREATE TABLE IF NOT EXISTS Category (Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Name TEXT);`)
				await db.run(`INSERT INTO Category(Name)
		            VALUES("Thriller");`)
				sql = `SELECT Id FROM Category WHERE Name = "${params}";`
				const data = await db.all(sql)
				await db.close()
				return data
			}
		})

		const result = await categories.saveCategory('Thriller').then(result => result)
		expect(result).toEqual(1)
		testPoolStub.restore()
		done()
	})

	test('should prompt with an error on id of existing category', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(categoriesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()

		})
		const result = await categories.saveCategory({Name: 'Thriller'}).catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})

	test('should prompt with an error on getting id of save category', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(categoriesDB, 'query').callsFake(async(sql, params) => {

			if(testPoolStub.callCount === 2) {
				console.log(`MOCK ${sql} with params ${params}`)
				throw new Error()
			} else if(testPoolStub.callCount === 1) {
				console.log('callCount1')
				console.log(`MOCK ${sql} with params ${params}`)
				const db = await sqlite.open(':memory:')
				await db.run(`CREATE TABLE IF NOT EXISTS Category (Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Name TEXT);`)

				sql = `SELECT Id FROM Category WHERE Name = "${params}";`
				const data = await db.all(sql)
				await db.close()
				return data
			}
		})
		const result = await categories.saveCategory('Thriller').catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})

describe('getAllCategories()', () => {
	test('successfully get all categories', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(categoriesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Category (Id INTEGER PRIMARY KEY AUTOINCREMENT,
                Name TEXT);`)
			await db.run(`INSERT INTO Category(Name)
                VALUES("Thriller");`)
			const data = await db.all(sql)
			await db.close()
			return data
		})
		const result = await categories.getAllCategories().then(result => result)
		const expected = [{
			Id: 1, Name: 'Thriller'}]
		expect(result).toEqual(expected)
		testPoolStub.restore()
		done()
	})

	test('should prompt an error on getAllCategories', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(categoriesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await categories.getAllCategories().catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})

describe('getCategoryById(()', () => {
	test('successfully get category by Id using category name', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(categoriesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Category (Id INTEGER PRIMARY KEY AUTOINCREMENT,
                Name TEXT);`)
			await db.run('INSERT INTO Category (Name) VALUES("Thriller");')
			sql = `SELECT Id FROM Category WHERE Name = "${params}";`
			await db.run(sql)
			const data = await db.all(sql)
			await db.close()
			return data
		})
		const result = await categories.getCategoryById('Thriller').then(result => result)
		expect(result).toEqual(1)
		testPoolStub.restore()
		done()
	})

	test('should return null when get category by Id using category name', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(categoriesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Category (Id INTEGER PRIMARY KEY AUTOINCREMENT,
                Name TEXT);`)
			sql = `SELECT Id FROM Category WHERE Name = "${params}";`
			await db.run(sql)
			const data = await db.all(sql)
			await db.close()
			return data
		})
		const result = await categories.getCategoryById('Thriller').then(result => result)
		expect(result).toBeUndefined()
		testPoolStub.restore()
		done()
	})

	test('on get category by Id using category name error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(categoriesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await categories.getCategoryById('Thriller').catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})
