'use strict'

const comments = require('../comments')
const commentsDB = require('../../database/config')
const sqlite = require('sqlite-async')
const sinon = require('sinon')

let testPoolStub

afterEach(() => {
	jest.clearAllMocks()
})

describe('savecomment()', () => {
	test('successfully save comment', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(commentsDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Comment (Id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER,
				reviewId INTEGER, Title TEXT, content TEXT, dateAdded DATETIME);`)
			const data = await db.run(`INSERT INTO Comment(userId, reviewId, Title, content) 
				VALUES("${params.userId}", "${params.reviewId}", "${params.Title}", "${params.content}");`)
			await db.close()
			return data
		})
		const result = await comments.savecomment({userId: 1, reviewId: 1,
			title: 'title', content: 'content'}).then(result => result)
		expect(result).toBeUndefined()
		testPoolStub.restore()
		done()
	})

	test('create tables with error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(commentsDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await comments.savecomment({}).catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})

describe('getCommentByUserAndReviewId()', () => {
	test('successfully get comment by user and reviewId', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(commentsDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Comment (Id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER,
				reviewId INTEGER, Title TEXT, content TEXT, dateAdded DATETIME);`)
			await db.run(`INSERT INTO Comment(userId, reviewId, Title, content) 
				VALUES(1, 1, "titles", "contents");`)
			sql = `SELECT Id, userId, reviewId, Title, content FROM Comment 
				WHERE reviewId = ${params[0]} AND userId = ${params[1]};`
			await db.run(sql)
			const data = await db.all(sql)
			await db.close()
			return data
		})
		const result = await comments.getCommentByUserAndReviewId(1, 1).then(result => result)
		const expected = [{
			Id: 1, userId: 1, reviewId: 1, Title: 'titles', content: 'contents'}]
		expect(result).toEqual(expected)
		testPoolStub.restore()
		done()
	})

	test('on get comment error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(commentsDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await comments.getCommentByUserAndReviewId(1, 1).catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})

describe('getAllCommentsByReviewID()', () => {
	test('successfully get all comments by reviewId', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(commentsDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Comment (Id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER,
				reviewId INTEGER, Title TEXT, content TEXT, dateAdded DATETIME);`)
			await db.run(`INSERT INTO Comment(userId, reviewId, Title, content) 
				VALUES(1, 1, "titles", "contents");`)
			sql = `SELECT Id, userId, reviewId, Title, content FROM Comment WHERE reviewId = ${params};`
			await db.run(sql)
			const data = await db.all(sql)
			await db.close()
			return data
		})
		const result = await comments.getAllCommentsByReviewID(1).then(result => result)
		const expected = [{
			Id: 1, userId: 1, reviewId: 1, Title: 'titles', content: 'contents'}]
		expect(result).toEqual(expected)
		testPoolStub.restore()
		done()
	})

	test('on get all comment error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(commentsDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await comments.getAllCommentsByReviewID(1, 1).catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})

describe('getCommentById(()', () => {
	test('successfully get all comments by commentId', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(commentsDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Comment (Id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER,
				reviewId INTEGER, Title TEXT, content TEXT);`)
			await db.run(`INSERT INTO Comment(userId, reviewId, Title, content) 
				VALUES(1, 1, "titles", "contents");`)
			sql = `SELECT Id, userId, reviewId, Title, content FROM Comment WHERE Id = ${params};`
			await db.run(sql)
			const data = await db.all(sql)
			await db.close()
			return data
		})
		const result = await comments.getCommentById(1).then(result => result)
		const expected = [{
			Id: 1, userId: 1, reviewId: 1, Title: 'titles', content: 'contents'}]
		expect(result).toEqual(expected)
		testPoolStub.restore()
		done()
	})

	test('on get comment by commentId error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(commentsDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await comments.getCommentById(1).catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})


describe('updateCommentByUserAndReviewId()', () => {
	test('successfully update comment by userId and reviewId', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(commentsDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Comment (Id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER,
				reviewId INTEGER, Title TEXT, content TEXT);`)
			await db.run(`INSERT INTO Comment(userId, reviewId, Title, content) 
				VALUES(1, 1, "titles", "contents");`)
			sql = `UPDATE Comment SET Title = '${params[0].Title}', content = '${params[0].content}' 
				WHERE userId = ${params[1]} AND reviewId = ${params[2]};`
			await db.run(sql)
			sql = `SELECT Id, userId, reviewId, Title, content FROM Comment 
				WHERE userId = ${params[1]} AND reviewId = ${params[2]};`
			await db.run(sql)

			const data = await db.all(sql)
			await db.close()
			return data
		})
		const result = await comments.updateCommentByUserAndReviewId({userId: 1, reviewId: 1, title: 'newTitle',
			content: 'newContent'}).then(result => result)
		const expected = {Id: 1, Title: 'newTitle', content: 'newContent', reviewId: 1, userId: 1}
		expect(result).toEqual(expected)
		testPoolStub.restore()
		done()
	})

	test('on update comment by userId and reviewId error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(commentsDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await comments.updateCommentByUserAndReviewId(1).catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})

describe('deleteComment()', () => {
	test('successfully delete comment by userId and reviewId', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(commentsDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Comment (Id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER,
				reviewId INTEGER, Title TEXT, content TEXT);`)
			await db.run(`INSERT INTO Comment(userId, reviewId, Title, content) 
				VALUES(1, 1, "titles", "contents");`)
			sql = `DELETE FROM Comment WHERE userId = ${params[0]} AND reviewId = ${params[1]};`
			await db.run(sql)
			sql = `SELECT Id, userId, reviewId, Title, content FROM Comment 
				WHERE userId = ${params[0]} AND reviewId = ${params[1]};`
			await db.run(sql)

			const data = await db.all(sql)
			await db.close()
			return data
		})
		const result = await comments.deleteComment(1, 1).then(result => result)
		expect(result).toBeUndefined()
		testPoolStub.restore()
		done()
	})

	test('on delete comment by userId and reviewId error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(commentsDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await comments.deleteComment(1,1).catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})
