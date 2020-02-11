'use strict'
const timeout = process.env.SLOWMO ? 30000 : 10000

beforeAll(async() => {
    await page.goto(URL, {waitUntil: 'domcontentloaded'})
    const width = 800
	const height = 600
	await page.setViewport({ width, height })
})

describe('Test header and subheading of the page', () => {

	test('login', async() => {

        await page.click(`input[name=username]`)
        await page.keyboard.type('majekodr')


        await page.click(`input[name=password]`)
        await page.keyboard.type('d')
        
        await page.click('[type="submit"]')
        await page.waitForSelector('.input-feedback');
        const html = await page.$eval('.input-feedback', el => el.innerHTML);

        expect(html).toBe('Password is too short - should be 7 chars minimum.')
        await page.screenshot({ path: 'screenshots/login.png', fullPage: true });
	}, timeout)
})
