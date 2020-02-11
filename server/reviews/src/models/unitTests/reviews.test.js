'use strict'

const reviews = require('../reviews')
const reviewsDB = require('../../database/config')
const sqlite = require('sqlite-async')
const sinon = require('sinon')

let testPoolStub

afterEach(() => {
	jest.clearAllMocks()
})

describe('savereview()', () => {
	test('should successfully save review', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(reviewsDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Review (Id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER,
				gameId INTEGER, Title TEXT, content TEXT, screenshotImageURL LONGTEXT, flag TEXT, dateAdded DATETIME);`)
			await db.run(`INSERT INTO Review (userId, gameId, title, content,
                screenshotImageURL, flag)
                VALUES(1, 1, "Title", "Content", "http://google.com.png", "pending");`)
			await db.close()
			return
		})
		const result = await reviews.savereview({userId: 1,
			gameId: 1, title: 'Title', content: 'Content',
			screenshot: 'http://google.com.png'}).then(result => result)
		expect(result).toBeUndefined()
		testPoolStub.restore()
		done()
	})

	test('on save review error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(reviewsDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await reviews.savereview({}).catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})

describe('getReviewByUserAndGameId()', () => {
	test('successfully get review by user and gameId', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(reviewsDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Review (Id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER,
				gameId INTEGER, Title TEXT, content TEXT, screenshotImageURL LONGTEXT, flag TEXT, dateAdded DATETIME);`)
			await db.run(`INSERT INTO Review (userId, gameId, title, content,
                screenshotImageURL, flag)
                VALUES(1, 1, "Title", "Content", "http://google.com.png", "pending");`)
			sql = `SELECT Id FROM Review WHERE gameId = ${params[0]} AND userId = ${params[1]};`
			await db.run(sql)
			const data = await db.all(sql)
			await db.close()
			return data
		})
		const result = await reviews.getReviewByUserAndGameId(1, 1).then(result => result)
		const expected = [{Id: 1}]
		expect(result).toEqual(expected)
		testPoolStub.restore()
		done()
	})

	test('on get like by userId and reviewId error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(reviewsDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await reviews.getReviewByUserAndGameId(1, 1).catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})

describe('getAllReviewsByGameID()', () => {
	test('successfully get all reviews by gameId that are approved', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(reviewsDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Review (Id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER,
				gameId INTEGER, Title TEXT, content TEXT, screenshotImageURL LONGTEXT, flag TEXT, dateAdded DATETIME);`)
			await db.run(`INSERT INTO Review (userId, gameId, title, content,
                screenshotImageURL, flag)
                VALUES(1, 1, "Title", "Content", "http://google.com.png", "approved");`)
			await db.run(`INSERT INTO Review (userId, gameId, title, content,
                screenshotImageURL, flag)
                VALUES(3, 1, "Title", "Content", "http://google.com.png", "approved");`)
			sql = `SELECT Id, userId, gameId, Title, content, 
			    screenshotImageURL FROM Review WHERE gameId = ${params[0]} AND flag = "${params[1]}";`
			await db.run(sql)
			const data = await db.all(sql)
			await db.close()
			return data
		})
		const result = await reviews.getAllReviewsByGameID(1).then(result => result)
		const expected = [{Id: 1, userId: 1, gameId: 1,
			Title: 'Title', content: 'Content',screenshotImageURL: 'http://google.com.png'},
		{Id: 2, userId: 3, gameId: 1,
			Title: 'Title', content: 'Content',screenshotImageURL: 'http://google.com.png'}]
		expect(result).toEqual(expected)
		testPoolStub.restore()
		done()
	})

	test('on get all reviews by gameId that are approved error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(reviewsDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await reviews.getAllReviewsByGameID(1).catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})

describe('getPendingReviewsByGameID()', () => {
	test('successfully get pending reviews by gameId', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(reviewsDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Review (Id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER,
				gameId INTEGER, Title TEXT, content TEXT, screenshotImageURL LONGTEXT, flag TEXT, dateAdded DATETIME);`)
			await db.run(`INSERT INTO Review (userId, gameId, title, content,
                screenshotImageURL, flag)
                VALUES(1, 1, "Title", "Content", "http://google.com.png", "approved");`)
			await db.run(`INSERT INTO Review (userId, gameId, title, content,
                screenshotImageURL, flag)
                VALUES(3, 1, "Title", "Content", "http://google.com.png", "pending");`)
			sql = `SELECT Id, userId, gameId, Title, content, 
			    screenshotImageURL FROM Review WHERE gameId = ${params[0]} AND flag = "${params[1]}";`
			await db.run(sql)
			const data = await db.all(sql)
			await db.close()
			return data
		})
		const result = await reviews.getPendingReviewsByGameID(1).then(result => result)
		const expected = [{Id: 2, userId: 3, gameId: 1,
			Title: 'Title', content: 'Content',screenshotImageURL: 'http://google.com.png'}]
		expect(result).toEqual(expected)
		testPoolStub.restore()
		done()
	})

	test('on get pending reviews by gameId error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(reviewsDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await reviews.getPendingReviewsByGameID(1).catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})

describe('getPendingReviewsById()', () => {
	test('successfully get pending reviews by Id', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(reviewsDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Review (Id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER,
				gameId INTEGER, Title TEXT, content TEXT, screenshotImageURL LONGTEXT, flag TEXT, dateAdded DATETIME);`)
			await db.run(`INSERT INTO Review (userId, gameId, title, content,
                screenshotImageURL, flag)
                VALUES(1, 1, "Title", "Content", "http://google.com.png", "approved");`)
			await db.run(`INSERT INTO Review (userId, gameId, title, content,
                screenshotImageURL, flag)
                VALUES(3, 1, "Title", "Content", "http://google.com.png", "pending");`)
			sql = `SELECT userId, gameId, Title, content, 
			    screenshotImageURL FROM Review WHERE Id = ${params};`
			await db.run(sql)
			const data = await db.all(sql)
			await db.close()
			return data
		})
		const result = await reviews.getPendingReviewsById(2).then(result => result)
		const expected = [{userId: 3, gameId: 1,
			Title: 'Title', content: 'Content',screenshotImageURL: 'http://google.com.png'}]
		expect(result).toEqual(expected)
		testPoolStub.restore()
		done()
	})

	test('on get pending reviews by Id error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(reviewsDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await reviews.getPendingReviewsById(34).catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})

describe('getApprovedReviewById()', () => {
	test('successfully get reviews status that are aprroved by review Id', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(reviewsDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Review (Id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER,
				gameId INTEGER, Title TEXT, content TEXT, screenshotImageURL LONGTEXT, flag TEXT, dateAdded DATETIME);`)
			await db.run(`INSERT INTO Review (userId, gameId, title, content,
                screenshotImageURL, flag)
                VALUES(1, 3, "Title", "Content", "http://google.com.png", "approved");`)
			await db.run(`INSERT INTO Review (userId, gameId, title, content,
                screenshotImageURL, flag)
                VALUES(3, 5, "Title", "Content", "http://google.com.png", "pending");`)
			sql = `SELECT userId, gameId, Title, content, 
			    screenshotImageURL FROM Review WHERE Id = ${params[0]} AND flag = "${params[1]}";`
			await db.run(sql)
			const data = await db.all(sql)
			await db.close()
			return data
		})
		const result = await reviews.getApprovedReviewById(1).then(result => result)
		const expected = [{userId: 1, gameId: 3,
			Title: 'Title', content: 'Content',screenshotImageURL: 'http://google.com.png'}]
		expect(result).toEqual(expected)
		testPoolStub.restore()
		done()
	})

	test('on get reviews status that are aprroved by review Id error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(reviewsDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await reviews.getApprovedReviewById(1).catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})

describe('getAllReviews()', () => {
	test('successfully get all reviews', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(reviewsDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Review (Id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER,
				gameId INTEGER, Title TEXT, content TEXT, screenshotImageURL LONGTEXT, flag TEXT, dateAdded DATETIME);`)
			await db.run(`INSERT INTO Review (userId, gameId, title, content,
                screenshotImageURL, flag, dateAdded)
                VALUES(1, 3, "Title", "Content", "http://google.com.png", "approved", "2019-07-27 23:11:45");`)
			await db.run(`INSERT INTO Review (userId, gameId, title, content,
                screenshotImageURL, flag, dateAdded)
                VALUES(3, 5, "Title", "Content", "http://google.com.png", "pending", "2019-10-27 18:11:45");`)
			const data = await db.all(sql)
			await db.close()
			return data
		})
		const result = await reviews.getAllReviews().then(result => result)
		const expected = [{Id: 1, userId: 1, gameId: 3,
			Title: 'Title', content: 'Content', screenshotImageURL: 'http://google.com.png',
			flag: 'approved', dateAdded: '2019-07-27 23:11:45'},
		{Id: 2, userId: 3, gameId: 5, Title: 'Title', content: 'Content', screenshotImageURL: 'http://google.com.png',
			flag: 'pending', dateAdded: '2019-10-27 18:11:45'}]
		console.log('mgn;', result)
		expect(result).toEqual(expected)
		testPoolStub.restore()
		done()
	})

	test('should prompt an error on getAllGames', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(reviewsDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await reviews.getAllReviews().catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})


describe('updateReviewFlag()', () => {
	test('successfully update game rating by gameId', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(reviewsDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Review (Id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER,
				gameId INTEGER, Title TEXT, content TEXT, screenshotImageURL LONGTEXT, flag TEXT, dateAdded DATETIME);`)
			await db.run(`INSERT INTO Review (userId, gameId, title, content,
                screenshotImageURL, flag)
                VALUES(1, 3, "Title", "Content", "http://google.com.png", "approved");`)
			await db.run(`INSERT INTO Review (userId, gameId, title, content,
                screenshotImageURL, flag)
                VALUES(3, 5, "Title", "Content", "http://google.com.png", "pending");`)
			await db.run(`UPDATE Review SET flag = 'approved' WHERE Id = ${params[1]};`)
			sql = `SELECT Id, flag FROM Review WHERE Id = ${params[1]};`
			await db.run(sql)
			const data = await db.all(sql)
			await db.close()
			return data
		})
		const result = await reviews.updateReviewFlag('approved', 2).then(result => result)
		const expected = {Id: 2, flag: 'approved'}
		expect(result).toEqual(expected)
		testPoolStub.restore()
		done()
	})

	test('on update comment by userId and reviewId error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(reviewsDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await reviews.updateReviewFlag('approved', 24).catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})

describe('deleteReview()', () => {
	test('successfully delete review by review id', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(reviewsDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Review (Id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER,
				gameId INTEGER, Title TEXT, content TEXT, screenshotImageURL LONGTEXT, flag TEXT, dateAdded DATETIME);`)
			await db.run(`INSERT INTO Review (userId, gameId, title, content,
                screenshotImageURL, flag)
                VALUES(1, 3, "Title", "Content", "http://google.com.png", "approved");`)
			await db.run(`INSERT INTO Review (userId, gameId, title, content,
                screenshotImageURL, flag)
                VALUES(3, 5, "Title", "Content", "http://google.com.png", "pending");`)
			await db.run(`DELETE FROM Review WHERE Id = ${params};`)

			sql = `SELECT userId, gameId, Title, content, screenshotImageURL FROM Review
				WHERE Id = ${params};`
			await db.run(sql)
			const data = await db.all(sql)
			await db.close()
			return data
		})
		const result = await reviews.deleteReview(1).then(result => result)
		expect(result).toBeUndefined()
		testPoolStub.restore()
		done()
	})

	test('on delete like error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(reviewsDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await reviews.deleteReview(4).catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})
