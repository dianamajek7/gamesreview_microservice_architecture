'use strict'

const auth = require('../auth')
const {createMockContext} = require('@shopify/jest-koa-mocks')
const jwt = require('jsonwebtoken')
const db = require('../../database/config')
const sqlite = require('sqlite-async')
const sinon = require('sinon')
const blackListModel = require('../../models/tokenBlackList')
const constants = require('../../constants')

let jwtStub, testPoolStub

afterEach(() => {
	jest.clearAllMocks()
})

describe('Middleware Empty Auth in header for Authentication', () => {

	test('should throw 403 Forbidden error, as authorization header isnt set', async(done) => {
		expect.assertions(1)
		const ctx = createMockContext({})
		ctx.headers.authorization = ''
		const next = jest.fn()

		await auth(ctx, next)
		expect(ctx.throw).toBeCalledWith(constants.FORBIDDEN, { title: 'Forbidden',
			detail: 'No token, Authentication Failed'})
		done()
	})

	test('should throw 403 Forbidden error, as token was incorrect', async(done) => {
		expect.assertions(1)
		jwtStub = sinon.stub(blackListModel, 'getTokenBlackListed').callsFake(() =>
			Promise.resolve({success: 'Token exists'}))
		const ctx = createMockContext({headers: {authorization: 'Bearer tokenTest'}})
		const next = jest.fn()

		await auth(ctx, next)
		expect(ctx.throw).toBeCalledWith(constants.FORBIDDEN, { title: 'Forbidden',
			detail: 'Token malformed, Authentication Failed'})
		jwtStub.restore()
		done()
	})

	test('should successfully authenticate', async(done) => {
		expect.assertions(1)
		const blackListStub = sinon.stub(blackListModel, 'getTokenBlackListed').callsFake(() =>
			Promise.resolve())
		const jWTSTUB = sinon.stub(jwt, 'verify').callsFake(() => Promise.resolve({success: 'Token is valid'}))
		const ctx = createMockContext({headers: {authorization: 'Bearer tokenTest'}})
		const next = jest.fn()

		const result = await auth(ctx, next).then( () => ctx.body.jwtPayload )
		expect(result).toStrictEqual({success: 'Token is valid'})
		blackListStub.restore()
		jWTSTUB.restore()
		done()
	})
})

describe('Middleware Auth Present in header for Authentication', () => {

	beforeEach( () => {
		jwtStub = sinon.stub(jwt, 'verify').callsFake(() => Promise.resolve({success: 'Token is valid'}))
	})
	afterEach(() => {
		jwtStub.restore()
	})
	test('should successfully set payload of details held on token', async(done) => {
		const blackListStub = sinon.stub(blackListModel, 'getTokenBlackListed').callsFake(() =>
			Promise.resolve())
		expect.assertions(1)
		const ctx = createMockContext({headers: {authorization: 'Bearer tokenTest'}})
		const next = jest.fn()

		const result = await auth(ctx, next).then( () => ctx.body.jwtPayload )
		expect(result).toStrictEqual({success: 'Token is valid'})
		blackListStub.restore()
		done()
	})
})

describe('Middleware Auth Present in header for Authentication but blacklisted', () => {

	beforeEach( () => {
		testPoolStub = sinon.stub(db, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS token_BlackList 
                (Id INTEGER PRIMARY KEY AUTOINCREMENT, token LONGTEXT);`)
			await db.run(`INSERT INTO token_BlackList(token) 
				VALUES("${params}");`)
			sql = `SELECT * FROM token_BlackList
				WHERE token = "${params}";`
			await db.run(sql)
			const data = await db.all(sql)
			await db.close()
			return data
		})
	})
	afterEach(() => {
		testPoolStub.restore()
	})
	test('should throw 403 Forbidden error, as token was blacklisted', async(done) => {
		expect.assertions(1)
		const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYXV0aF9hZG1pbiIsI
		mlhdCI6MTU3Mzg4NzA1NywiZXhwIjoxNTczODkwNjU3fQ.4pmkrhoo-k7Ao7CNa`
		const ctx = createMockContext({headers: {authorization: `Bearer ${token}`}})
		const next = jest.fn()

		await auth(ctx, next)
		expect(ctx.throw).toBeCalledWith(constants.FORBIDDEN, { title: 'Forbidden',
			detail: 'Token no longer valid, Authentication Failed'})
		done()

	})
})

describe('Middleware Auth Present in header for Authentication not blacklisted', () => {

	beforeEach( () => {
		testPoolStub = sinon.stub(db, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS token_BlackList 
                (Id INTEGER PRIMARY KEY AUTOINCREMENT, token LONGTEXT);`)
			sql = `SELECT * FROM token_BlackList
				WHERE token = "${params}";`
			await db.run(sql)
			const data = await db.all(sql)
			await db.close()
			return data
		})
		jwtStub = sinon.stub(jwt, 'verify').callsFake(() => Promise.resolve({success: 'Token is valid'}))
	})
	afterEach(() => {
		testPoolStub.restore()
		jwtStub.restore()
	})
	test('should successfully set payload of details held on token, as token was not blacklisted', async(done) => {
		expect.assertions(1)
		const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYXV0aF9hZG1pbiIsI
		mlhdCI6MTU3Mzg4NzA1NywiZXhwIjoxNTczODkwNjU3fQ.4pmkrhoo-k7Ao7CNa`
		const ctx = createMockContext({headers: {authorization: `Bearer ${token}`}})
		const next = jest.fn()

		const result = await auth(ctx, next).then( () => ctx.body.jwtPayload )
		expect(result).toStrictEqual({success: 'Token is valid'})
		done()
	})
})
