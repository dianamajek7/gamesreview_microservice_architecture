'use strict'

module.exports = {

	launch: {
		headless: process.env.HEADLESS !== 'false',
		slowMo: process.env.SLOWMO ? process.env.SLOWMO : 0, fullPage: true,
		args: ['--no-sandbox']
	}
}
