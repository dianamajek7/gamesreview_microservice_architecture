'use strict'

const tokenBlackList = require('../tokenBlackList')
const tonBlackListDB = require('../../database/config')
const sqlite = require('sqlite-async')
const sinon = require('sinon')

let testPoolStub

afterEach(() => {
	jest.clearAllMocks()
})

describe('getTokenBlackListed()', () => {
	test('successfully get token', async(done) => {
		expect.assertions(1)
		const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYXV0aF9hZG1pbiIsI
            mlhdCI6MTU3Mzg4NzA1NywiZXhwIjoxNTczODkwNjU3fQ.4pmkrhoo-k7Ao7CNa`
		testPoolStub = sinon.stub(tonBlackListDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS token_BlackList 
                (Id INTEGER PRIMARY KEY AUTOINCREMENT, token LONGTEXT);`)
			await db.run(`INSERT INTO token_BlackList(token) 
				VALUES("${token}");`)
			sql = `SELECT * FROM token_BlackList
				WHERE token = "${params}";`
			await db.run(sql)
			const data = await db.all(sql)
			await db.close()
			return data
		})
		const result = await tokenBlackList.getTokenBlackListed(token).then(result => result)
		const expected = {Id: 1, token: token}
		expect(result).toEqual(expected)
		testPoolStub.restore()
		done()
	})

	test('on get token error prompt', async(done) => {
		expect.assertions(1)
		const token = 'eya'
		testPoolStub = sinon.stub(tonBlackListDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await tokenBlackList.getTokenBlackListed(token).catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})
