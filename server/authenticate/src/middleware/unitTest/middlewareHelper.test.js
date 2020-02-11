'use strict'
const helper = require('../middlewareHelper')


describe('validateIfEmpty()', () => {

	test('value present but contains white spaces not letters, must return an error', async(done) => {
		expect.assertions(1)
		const result = helper.validateIfEmpty(' ')
		expect(result).toBeTruthy()
		done()
	})

	test('value present but contains an object not letters, must return an error', async(done) => {
		expect.assertions(1)
		const result = helper.validateIfEmpty([])
		expect(result).toBeTruthy()
		done()
	})

	test('value present with valid lettersmust return a success validation, must return a success validation', async(done) => {
		expect.assertions(1)
		const result = helper.validateIfEmpty('admin')
		expect(result).toBeFalsy()
		done()
	})

})
