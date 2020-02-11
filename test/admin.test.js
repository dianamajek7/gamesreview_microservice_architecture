'use strict'
const timeout = process.env.SLOWMO ? 30000: 10000

beforeAll(async() => {
	await page.goto(URL, {waitUntil: 'domcontentloaded'})
	const width = 1220
	const height = 1080
	await page.setViewport({ width, height })
})

describe('update a review as an admin ', () => {
	test('delete review', async() => {
		await page.click(`input[name=username]`)
        await page.keyboard.type('auth_admin')


        await page.click(`input[name=password]`)
        await page.keyboard.type('admin@Goal1')
        
        await page.click('[type="submit"]')
        await page.waitForSelector('.ant-table-row ant-table-row-level-0')
        await page.screenshot({ path: 'screenshots/adminPortal.png', fullPage: true });
        //delete button
        await page.click('#root > div > div > div > div > div > div > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(6) > span > span > span > i > svg')
        await page.waitForSelector('.ant-popover-message')
        await page.click(`body > div:nth-child(11) > div > div > div > div.ant-popover-inner > div > div > div.ant-popover-buttons > button.ant-btn.ant-btn-primary.ant-btn-sm`)
        await page.screenshot({ path: 'screenshots/adminDeleteReview.png', fullPage: true });
        expect(true).toBeTruthy()
    })

	
}, timeout)


