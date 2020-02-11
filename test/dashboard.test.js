'use strict'
const timeout =  process.env.SLOWMO ? 30000 : 10000
beforeAll(async() => {
	await page.goto(URL, {waitUntil: 'domcontentloaded'})
	const width = 1220
	const height = 1080
	await page.setViewport({ width, height })
})

describe('Test search box by game title, viewgames', () => {

	test('sub Header of the page', async() => {
		await page.click(`input[name=username]`)
        await page.keyboard.type('majekodr')


        await page.click(`input[name=password]`)
        await page.keyboard.type('DianaTest.12')
        
        await page.click('[type="submit"]')
		const h2Handle = await page.waitForSelector('#root > div > div > div > h2')
        const html = await page.evaluate(h2Handle => h2Handle.innerHTML, h2Handle)

        expect(html).toBe('Search a game by its title to get started')
    }, timeout)

	test('Header of the page', async() => {
		const headerHandle = await page.waitForSelector('#header')
		const html = await page.evaluate(headerHandle => headerHandle.innerHTML, headerHandle)

		expect(html).toBe('Welcome to Game Review')
		await page.screenshot({ path: 'screenshots/dashboard.png', fullPage: true });
	}, timeout)

	test('search input for games by title', async() => {
		await page.click(`#searchInput`)
        await page.keyboard.type('warfare')
		await page.click(".global-search-item-desc")
		
        await page.waitForSelector('.ant-list-items') //games list
		const list = await page.evaluate(() => Array //#gamesList > div.ant-spin-nested-loading > div > ul'
			.from(document.querySelectorAll('.ant-list-items'))
			.map(td => td.innerHTML)
	    )
	    await page.screenshot({ path: 'screenshots/searchoneGame.png', fullPage: true });
		const listCounter  = (list[0].match(/gameItem/g) || []).length;
		const listResult = listCounter  === 1 ? true : false;
	
		const games = await page.waitForSelector('#gameItem > div.ant-list-item-main > div > div > h4 > span')
        const gameTitle = await page.evaluate(title => title.innerHTML, games)

		expect(listResult).toBeTruthy()
		expect( gameTitle).toBe('Warfare')
	}, timeout)
	
})


