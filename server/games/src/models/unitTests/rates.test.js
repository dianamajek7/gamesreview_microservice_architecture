'use strict'

const rates = require('../rates')
const ratesDB = require('../../database/config')
const sqlite = require('sqlite-async')
const sinon = require('sinon')

let testPoolStub

afterEach(() => {
	jest.clearAllMocks()
})

describe('saveRate() exiting id', () => {
	test('should successfully save rate', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(ratesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Rate (userId INTEGER, gameId INTEGER,
                rate FLOAT);`)
			await db.run(`INSERT INTO Rate(userId, gameId, rate)
                VALUES(1, 1, 3.25);`)
			await db.close()
			return
		})
		const result = await rates.saveRate({userId: 1,
			gamedId: 1, rate: 3.25,
			description: 'description', image: 'http://google.com.png'}).then(result => result)
		expect(result).toBeUndefined()
		testPoolStub.restore()
		done()
	})

	test('on save rate error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(ratesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await rates.saveRate({}).catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})


describe('getTotalRateByGameId()', () => {
	test('successfully get total rates by gameId', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(ratesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Rate (userId INTEGER, gameId INTEGER,
                rate FLOAT);`)
			await db.run(`INSERT INTO Rate(userId, gameId, rate)
                VALUES(1, 1, 3.5);`)
			await db.run(`INSERT INTO Rate(userId, gameId, rate)
            VALUES(4, 1, 2.5);`)
			const data = await db.all(sql.replace('?', `${params}`))
			await db.close()
			return data
		})
		const result = await rates.getTotalRateByGameId(1).then(result => result)
		expect(result).toEqual(6)
		testPoolStub.restore()
		done()
	})

	test('on get total rates by gameId error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(ratesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await rates.getTotalRateByGameId(1).catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})


describe('countALLRateByGameID()', () => {
	test('successfully count up all game rates by gameId', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(ratesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Rate (userId INTEGER, gameId INTEGER,
                rate FLOAT);`)
			await db.run(`INSERT INTO Rate(userId, gameId, rate)
                VALUES(1, 1, 3.5);`)
			await db.run(`INSERT INTO Rate(userId, gameId, rate)
            VALUES(4, 1, 2.5);`)
			const data = await db.all(sql.replace('?', `${params}`))
			await db.close()
			return data
		})
		const result = await rates.countALLRateByGameID(1).then(result => result)
		expect(result).toEqual(2)
		testPoolStub.restore()
		done()
	})

	test('on count up all game rates by gameId error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(ratesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await rates.countALLRateByGameID(1).catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})

describe('getRateByUserID()', () => {
	test('successfully get rate by userId and gameId', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(ratesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Rate (userId INTEGER, gameId INTEGER,
                rate FLOAT);`)
			await db.run(`INSERT INTO Rate(userId, gameId, rate)
                VALUES(1, 1, 5);`)
			const data = await db.all(`SELECT rate FROM Rate WHERE userId = ${params[0]} And gameId = ${params[1]}`)
			await db.close()
			return data
		})
		const result = await rates.getRateByUserID(1, 1).then(result => result)
		const expected = {rate: 5}
		expect(result).toEqual(expected)
		testPoolStub.restore()
		done()
	})

	test('on get rate by userId and gameId error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(ratesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await rates.getRateByUserID(1,1).catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})
