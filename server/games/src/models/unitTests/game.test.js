'use strict'

const games = require('../game')
const gamesDB = require('../../database/config')
const sqlite = require('sqlite-async')
const sinon = require('sinon')

let testPoolStub

afterEach(() => {
	jest.clearAllMocks()
})


describe('savegame() exiting id', () => {
	test('should successfully save game', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(gamesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Game (Id INTEGER PRIMARY KEY AUTOINCREMENT, Title TEXT,
                categoryId INTEGER, Publisher TEXT, summary TEXT, description TEXT, 
                imageURL LONGTEXT, rating FLOAT DEFAULT 0);`)
			await db.run(`INSERT INTO Game(title, categoryID, Publisher, summary,
                description, imageURL)
                VALUES("Title", 1, "publisher", "summary", "description", "http://google.com.png");`)
			await db.close()
			return
		})
		const result = await games.savegame({title: 'Title',
			categoryID: 1, publisher: 'publisher', summary: 'summary',
			description: 'description', image: 'http://google.com.png'}).then(result => result)
		expect(result).toBeUndefined()
		testPoolStub.restore()
		done()
	})

	test('on save game error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(gamesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await games.savegame({}).catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})

describe('updateGameRating()', () => {
	test('successfully update game rating by gameId', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(gamesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Game (Id INTEGER PRIMARY KEY AUTOINCREMENT, Title TEXT,
                categoryId INTEGER, Publisher TEXT, summary TEXT, description TEXT, 
                imageURL LONGTEXT, rating FLOAT DEFAULT 0);`)
			await db.run(`INSERT INTO Game(title, categoryID, Publisher, summary,
                description, imageURL)
                VALUES("Title", 1, "publisher", "summary", "description", "http://google.com.png");`)
			sql = `UPDATE Game SET rating = ${params[0].rating} 
				WHERE Id = ${params[1]};`
			await db.run(sql)
			sql = `SELECT Id, rating FROM Game WHERE Id = ${params[1]};`
			await db.run(sql)
			const data = await db.all(sql)
			await db.close()
			return data
		})
		const result = await games.updateGameRating(2.5, 1).then(result => result)
		const expected = {Id: 1, rating: 2.5}
		expect(result).toEqual(expected)
		testPoolStub.restore()
		done()
	})

	test('on update comment by userId and reviewId error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(gamesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await games.updateGameRating(2.5, 1).catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})


describe('getAllGames()', () => {
	test('successfully get all games', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(gamesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Game (Id INTEGER PRIMARY KEY AUTOINCREMENT, Title TEXT,
                categoryId INTEGER, Publisher TEXT, summary TEXT, description TEXT, 
                imageURL LONGTEXT, rating FLOAT DEFAULT 0);`)
			await db.run(`INSERT INTO Game(title, categoryID, Publisher, summary,
                description, imageURL)
                VALUES("Title", 1, "publisher", "summary", "description", "http://google.com.png");`)
			const data = await db.all(sql)
			await db.close()
			return data
		})
		const result = await games.getAllGames().then(result => result)
		const expected = [{Id: 1, Title: 'Title', categoryId: 1, Publisher: 'publisher',
			summary: 'summary', description: 'description', imageURL: 'http://google.com.png', rating: 0}]
		expect(result).toEqual(expected)
		testPoolStub.restore()
		done()
	})

	test('should prompt an error on getAllGames', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(gamesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await games.getAllGames().catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})


describe('getGameTitles(()', () => {
	test('successfully get all games titles', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(gamesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Game (Id INTEGER PRIMARY KEY AUTOINCREMENT, Title TEXT,
                categoryId INTEGER, Publisher TEXT, summary TEXT, description TEXT, 
                imageURL LONGTEXT, rating FLOAT DEFAULT 0);`)
			await db.run(`INSERT INTO Game(title, categoryID, Publisher, summary,
                description, imageURL)
                VALUES("Warfare", 1, "publisher", "summary", "description", "http://google.com.png");`)
			await db.run(`INSERT INTO Game(title, categoryID, Publisher, summary,
                description, imageURL)
                VALUES("GTA", 1, "publisher", "summary", "description", "http://google.com.png");`)
			const data = await db.all(sql)
			await db.close()
			return data
		})
		const result = await games.getGameTitles().then(result => result)
		const expected = [{Title: 'Warfare'},{Title: 'GTA'}]
		expect(result).toEqual(expected)
		testPoolStub.restore()
		done()
	})

	test('on get all games titles error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(gamesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await games.getGameTitles().catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})

describe('getByGameCategory()', () => {
	test('successfully get all game associated with the category Id', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(gamesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Game (Id INTEGER PRIMARY KEY AUTOINCREMENT, Title TEXT,
                categoryId INTEGER, Publisher TEXT, summary TEXT, description TEXT, 
                imageURL LONGTEXT, rating FLOAT DEFAULT 0);`)
			await db.run(`INSERT INTO Game(title, categoryID, Publisher, summary,
                description, imageURL)
                VALUES("Warfare", 1, "publisher", "summary", "description", "http://google.com.png");`)
			const data = await db.all(sql.replace('?', `"${params}"`))
			await db.close()
			return data
		})
		const result = await games.getByGameCategory(1).then(result => result)
		const expected = [{Id: 1, Title: 'Warfare', categoryId: 1, Publisher: 'publisher',
			summary: 'summary', description: 'description', imageURL: 'http://google.com.png', rating: 0}]
		expect(result).toEqual(expected)
		testPoolStub.restore()
		done()
	})

	test('on get all game associated with the category Id title error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(gamesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await games.getByGameCategory(1).catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})


describe('getGameByTitle()', () => {
	test('successfully get game by title', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(gamesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Game (Id INTEGER PRIMARY KEY AUTOINCREMENT, Title TEXT,
                categoryId INTEGER, Publisher TEXT, summary TEXT, description TEXT, 
                imageURL LONGTEXT, rating FLOAT DEFAULT 0);`)
			await db.run(`INSERT INTO Game(title, categoryID, Publisher, summary,
                description, imageURL)
                VALUES("Warfare", 1, "publisher", "summary", "description", "http://google.com.png");`)
			const data = await db.all(sql.replace('?', `"${params}"`))
			await db.close()
			return data
		})
		const result = await games.getGameByTitle('Warfare').then(result => result)
		const expected = [{Id: 1, Title: 'Warfare', categoryId: 1, Publisher: 'publisher',
			summary: 'summary', description: 'description', imageURL: 'http://google.com.png', rating: 0}]
		expect(result).toEqual(expected)
		testPoolStub.restore()
		done()
	})

	test('on get game associated with the title error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(gamesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await games.getGameByTitle(1).catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})

describe('getGameById(()', () => {
	test('successfully get game Id by game title', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(gamesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Game (Id INTEGER PRIMARY KEY AUTOINCREMENT, Title TEXT,
                categoryId INTEGER, Publisher TEXT, summary TEXT, description TEXT, 
                imageURL LONGTEXT, rating FLOAT DEFAULT 0);`)
			await db.run(`INSERT INTO Game(title, categoryID, Publisher, summary,
                description, imageURL)
                VALUES("Warfare", 1, "publisher", "summary", "description", "http://google.com.png");`)
			const data = await db.all(sql.replace('?', `"${params}"`))
			await db.close()
			return data
		})
		const result = await games.getGameById('Warfare').then(result => result)
		expect(result).toEqual(1)
		testPoolStub.restore()
		done()
	})


	test('should return null when get game Id by game title', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(gamesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Game (Id INTEGER PRIMARY KEY AUTOINCREMENT, Title TEXT,
                categoryId INTEGER, Publisher TEXT, summary TEXT, description TEXT, 
                imageURL LONGTEXT, rating FLOAT DEFAULT 0);`)
			const data = await db.all(sql.replace('?', `"${params}"`))
			await db.close()
			return data
		})
		const result = await games.getGameById('Warfare').then(result => result)
		expect(result).toBeUndefined()
		testPoolStub.restore()
		done()
	})

	test('on get game Id using game title error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(gamesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await games.getGameById('Thriller').catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})
