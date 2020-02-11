'use strict'

const admin = require('../admin')
const adminDB = require('../../database/config')
const sqlite = require('sqlite-async')
const sinon = require('sinon')

let testPoolStub

afterEach(() => {
	jest.clearAllMocks()
})

describe('createTables()', () => {
	test('create tables', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(adminDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Review (Id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER
				gameId INTEGER, Title TEXT, content TEXT, screenshotImageURL LONGTEXT, flag TEXT, dateAdded DATETIME);`)
			await db.run(`CREATE TABLE IF NOT EXISTS Review_Like (userId INTEGER
				reviewId INTEGER, liker BOOLEAN);`)
			await db.close()
		})
		const result = await admin.createTables((err, result) => {
			if (!err) return result
		})
		expect(result).toStrictEqual({message: 'created successfully'})
		testPoolStub.restore()
		done()
	})

	test('create tables with error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(adminDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`${sql};`)
			await db.close()
		})
		const result = await admin.createTables().catch(err => err)
		expect(result).toStrictEqual({
			status: 500,
			title: 'Internal Server Error',
			detail: 'Error occurred whilst processing DB tables'
		})
		testPoolStub.restore()
		done()
	})
})
