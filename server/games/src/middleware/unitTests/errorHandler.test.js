
'use strict'

const errorHandler = require('../errorHandler.js')

describe('Middleware Error Handling()', () => {

	test('should throw 404 error, as status is set', async(done) => {
		expect.assertions(3)
		const ctx = jest.fn()
		const next = jest.fn( () => {
			throw {
				'status': 403,
				'title': 'Forbidden',
				'detail': 'Not acessible'
			}
		} )
		await errorHandler(ctx, next)
			.then( () => {
				expect(ctx.body.status).toBe(403)
				expect(ctx.body.title).toEqual('Forbidden')
				expect(ctx.body.detail).toEqual('Not acessible')
			})
		done()
	})

	test('should throw default 500 error, as status is not set', async(done) => {
		expect.assertions(3)
		const ctx = jest.fn()
		const next = jest.fn( () => {
			throw {
				'title': 'Internal Server Error',
				'detail': 'Error occurred whilst processing DB tables'
			}
		} )
		await errorHandler(ctx, next)
			.then( () => {
				expect(ctx.body.status).toBe(500)
				expect(ctx.body.title).toEqual('Internal Server Error')
				expect(ctx.body.detail).toEqual('Error occurred whilst processing DB tables')
			})
		done()
	})

	test('should throw default 500 error and Internal Server Error as status and detail was not set', async(done) => {
		expect.assertions(3)
		const ctx = jest.fn()
		const next = jest.fn( () => {
			throw new Error()
		} )
		await errorHandler(ctx, next)
			.then( () => {
				expect(ctx.body.status).toBe(500)
				expect(ctx.body.title).toEqual('Internal Server Error')
				expect(ctx.body.detail).toBeUndefined()
			})
		done()
	})

	test('should handle next function with no errors', async(done) => {
		expect.assertions(1)
		const ctx = jest.fn()
		const next = jest.fn( () => ctx.body = {message: 'created successfully'} )
		await errorHandler(ctx, next)
			.then( () => {
				expect(ctx.body.message).toBe('created successfully')
			})
		done()
	})


})
