'use strict'

const likes = require('../likes')
const likesDB = require('../../database/config')
const sqlite = require('sqlite-async')
const sinon = require('sinon')

let testPoolStub

afterEach(() => {
	jest.clearAllMocks()
})

describe('savelike()', () => {
	test('successfully save like', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(likesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Review_Like (userId INTEGER, reviewId INTEGER,
				liker BOOLEAN);`)
			const data = await db.run(`INSERT INTO Review_Like(userId, reviewId, liker) 
				VALUES("${params.userId}", "${params.reviewId}", "${params.liker}");`)
			await db.close()
			return data
		})
		const result = await likes.savelike({userId: 1, reviewId: 1, like: 'true'}).then(result => result)
		expect(result).toBeUndefined()
		testPoolStub.restore()
		done()
	})

	test('create tables with error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(likesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await likes.savelike({}).catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})

describe('getLikeByUserAndReviewId()', () => {
	test('successfully get like by user and reviewId', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(likesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Review_Like (userId INTEGER, reviewId INTEGER,
				liker BOOLEAN);`)
			await db.run(`INSERT INTO Review_Like(userId, reviewId, liker) 
				VALUES(1, 1, true);`)
			sql = `SELECT * FROM Review_Like WHERE userId = ${params[0]} AND reviewId = ${params[1]};`
			await db.run(sql)
			const data = await db.all(sql)
			await db.close()
			return data
		})
		const result = await likes.getLikeByUserAndReviewId(1, 1).then(result => result)
		const expected = [{userId: 1, reviewId: 1, liker: 1}]
		expect(result).toEqual(expected)
		testPoolStub.restore()
		done()
	})

	test('on get like by userId and reviewId error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(likesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await likes.getLikeByUserAndReviewId(1, 1).catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})

describe('getAllLikesByReviewID()', () => {
	test('successfully get all likes by reviewId', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(likesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Review_Like (userId INTEGER, reviewId INTEGER,
				liker BOOLEAN);`)
			await db.run(`INSERT INTO Review_Like(userId, reviewId, liker) 
				VALUES(1, 1, true);`)
			const data = await db.all(sql.replace('?', `${params}`))
			await db.close()
			return data
		})
		const result = await likes.getAllLikesByReviewID(1).then(result => result)
		const expected = [{userId: 1, reviewId: 1, liker: 1}]
		expect(result).toEqual(expected)
		testPoolStub.restore()
		done()
	})

	test('on get all likes by reviewId error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(likesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await likes.getAllLikesByReviewID(1).catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})


describe('deleteLike()', () => {
	test('successfully delete like by reviewId and userId', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(likesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Review_Like (userId INTEGER, reviewId INTEGER,
				liker BOOLEAN);`)
			await db.run(`INSERT INTO Review_Like(userId, reviewId, liker) 
				VALUES(1, 1, true);`)
			sql = `DELETE FROM Review_Like WHERE reviewId = ${params[0]} AND userId = ${params[1]};`
			await db.run(sql)
			sql = `SELECT * FROM Review_Like WHERE reviewId = ${params[0]} AND userId = ${params[1]};`
			await db.run(sql)

			const data = await db.all(sql)
			await db.close()
			return data
		})
		const result = await likes.deleteLike(1, 1).then(result => result)
		expect(result).toBeUndefined()
		testPoolStub.restore()
		done()
	})

	test('on delete like by userId and reviewId error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(likesDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await await likes.deleteLike(1,1).catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})
