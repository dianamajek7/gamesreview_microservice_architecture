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
			await db.run(`CREATE TABLE IF NOT EXISTS User (Id INTEGER PRIMARY KEY AUTOINCREMENT, Username TEXT, 
				Email TEXT, Password TEXT, profileImageURL LONGTEXT, About TEXT, role INTEGER, 
				Active BOOLEAN, Deleted BOOLEAN, dateRegistered DATETIME);`)
			await db.run(`CREATE TABLE IF NOT EXISTS Password_Reminder (Id INTEGER PRIMARY KEY AUTOINCREMENT, 
				userId INTEGER, securityQuestion1 TEXT, securityAnswer1 TEXT, securityQuestion2 TEXT,
				securityAnswer2 TEXT);`)
			await db.run(`CREATE TABLE IF NOT EXISTS Admin (Id INTEGER PRIMARY KEY AUTOINCREMENT, 
				adminName TEXT, password TEXT);`)
			await db.run(`CREATE TABLE IF NOT EXISTS token_BlackList (Id INTEGER PRIMARY KEY AUTOINCREMENT, 
				token LONGTEXT);`)
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

describe('saveAdminCred()', () => {
	test('should successfully save admin credentials', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(adminDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Admin (Id INTEGER PRIMARY KEY AUTOINCREMENT, 
				adminName TEXT, password TEXT);`)
			await db.run(`INSERT INTO Admin(adminName, password)
                VALUES("i_AMADMIN", "admin_strongPasswordEncrypted");`)
			await db.close()
			return
		})
		const result = await admin.saveAdminCred().then(result => result)
		expect(result).toBeUndefined()
		testPoolStub.restore()
		done()
	})

	test('on save admin credentials error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(adminDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await admin.saveAdminCred().catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})

describe('getAdminLoginCred()', () => {
	test('should successfully get admin login credentials', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(adminDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Admin (Id INTEGER PRIMARY KEY AUTOINCREMENT, 
				adminName TEXT, password TEXT);`)
			await db.run(`INSERT INTO Admin(adminName, password)
                VALUES("i_AMADMIN", "admin_strongPasswordEncrypted");`)
			const data = await db.all(sql.replace('?', `"${params}"`))
			await db.close()
			return data
		})
		const result = await admin.getAdminLoginCred('i_AMADMIN').then(result => result)
		const expected = {adminName: 'i_AMADMIN', password: 'admin_strongPasswordEncrypted'}
		expect(result).toEqual(expected)
		testPoolStub.restore()
		done()
	})

	test('on get admin login credentials error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(adminDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await admin.getAdminLoginCred('i_AMAUSER').catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})
