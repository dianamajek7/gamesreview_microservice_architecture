
'use strict'

module.exports = {
	displayName: 'test',
	verbose: true,
	collectCoverage: true,
	coverageThreshold: {
		global: {
			branches: 0,
			functions: 0,
			lines: 0,
			statements: 0
		}
	},
	'globalSetup': '<rootDir>/node_modules/@databases/mysql-test/jest/globalSetup.js',
	'globalTeardown': '<rootDir>/node_modules/@databases/mysql-test/jest/globalTeardown.js',
	testPathIgnorePatterns: [
		'/node_modules/',
		'/__tests__/fixtures/',
	]
}
