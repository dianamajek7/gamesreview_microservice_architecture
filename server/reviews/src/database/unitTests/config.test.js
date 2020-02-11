'use strict'
require('dotenv').config()
const config = require('../config')
const mysql= require('mysql')
const sinon = require('sinon')

let testPoolStub, excuteQueryStub, pool

describe('getPool()', () => {
	test('create a pool', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(mysql, 'createPool').callsFake(() => true)
		expect(config.getPool()).toBeTruthy()
		done()
		testPoolStub.restore()
	})
})

describe('error catch for query()', () => {
	beforeEach(() => {
		pool = {
			getConnection: function(cb, err, connection) {
				console.log(connection, cb)
				if(err) throw err

				cb(new Error('connection not established'))

			},
		}
		testPoolStub = sinon.stub(config, 'getPool').callsFake(() => pool)
	})
	afterEach(() => {
		testPoolStub.restore()
	})
	test('catch error rejected from query on connection established ', async(done) => {
		expect.assertions(1)
		await config.query('sql', 'param').catch(err => {
		 	expect(err).toBeDefined()
		 })

		done()
	})
})

describe('success pending pool query()', () => {

	beforeEach(() => {
		pool = {
			getConnection: function(cb, err, connection) {
				console.log(connection)
				if(err) console.log(err)
				cb()

			},
		}
		testPoolStub = sinon.stub(config, 'getPool').callsFake(() => pool)
	})
	afterEach(() => {
		testPoolStub.restore()
		excuteQueryStub.restore()
	})
	test('successfully resolved query on connection established ', async(done) => {

		expect.assertions(1)
		excuteQueryStub = sinon.stub(config, 'executeQuery')
			.callsFake(() => Promise.resolve('Successfullly excecuted query'))
		const result = await config.query('sql', 'param')
		expect(result).toBe('Successfullly excecuted query')

		done()
	})

})

describe('executeQuery()', () => {
	beforeEach(() => {

		pool = mysql.createPool({
			host: 'mysql_test',
			user: 'root',
			password: 'password',
			database: 'mysql_test',
		})
		pool = {
			getConnection: function(cb, err, connection) {
				console.log(connection)
				if(err) console.log(err)
				cb()

			},
		}
		testPoolStub = sinon.stub(config, 'getPool').callsFake(() => pool)
	})
	afterEach(() => {
		testPoolStub.restore()
		excuteQueryStub.restore()
	})

	test('execute query', async(done) => {
		expect.assertions(1)
		let callCount = 0
		const connection = {
			query: function(query, param, cb) {
				console.log(query, param)
				callCount ++
				cb()
			},
			release: function() {
				return
			},
			destroy: function() {
				return
			}
		}
		await config.executeQuery(connection, 'SELECT Host FROM db')
		expect(callCount).toBe(1)
		done()
		testPoolStub.restore()
	})

	test('catch error rejected whilst executing query', async(done) => {
		expect.assertions(1)
		const connection = {
			query: function(query, param, cb) {
				console.log(query, param, cb)
				cb(new Error('ER_NO_DB_ERROR: No database selected'))
			},
			release: function() {
				return
			},
			destroy: function() {
				return
			}
		}
		await config.executeQuery(connection, 'SELECT Host FROM db')
			.catch(err => expect(err).toStrictEqual(new Error('ER_NO_DB_ERROR: No database selected')))
		done()
		testPoolStub.restore()
	})
})

