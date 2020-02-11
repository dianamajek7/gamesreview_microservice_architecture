'use strict'
const timeout = process.env.SLOWMO ? 30000 : 10000

beforeAll(async() => {
	await page.goto(URL, {waitUntil: 'domcontentloaded'})
	const width = 1220
	const height = 1080
	await page.setViewport({ width, height })
})

describe('Test filter game, addgame, addreview, view review', () => {

	test('sub Header of the page', async() => {
		await page.click(`input[name=username]`)
        await page.keyboard.type('majekodr')


        await page.click(`input[name=password]`)
        await page.keyboard.type('DianaTest.12')
        
        await page.click('[type="submit"]')
        await page.waitForSelector('#root > div > div > div > h2') //search input box
        await page.click('#root > div > section > ul > li:nth-child(4) > a') //click game dashboard
        await page.waitForSelector('#root > div > div > div > div:nth-child(1) > a') //filterlink
        await page.hover('#root > div > div > div > div:nth-child(1) > a')
        await page.waitForSelector('#filterCategory > li:nth-child(2)') //filterlink
        await page.click('#filterCategory > li:nth-child(1)') //one of the categories
	    await page.screenshot({ path: 'screenshots/filteredGame.png', fullPage: true });
        const list = await page.evaluate(() => Array //#gamesList > div.ant-spin-nested-loading > div > ul'
			.from(document.querySelectorAll('.ant-list-items'))
            .map(td => td.innerHTML)
        )
        const listCounter  = (list[0].match(/gameItem/g) || []).length;
        const listResult = listCounter  > 1 ? true : false;
        expect(listResult).toBeTruthy()
    }, timeout)

	test('add a review on a game without screenshot of game', async() => {
        await page.click('#addreview')
        
        await page.click(`#review_form_in_modal_content`)
        await page.keyboard.type('The best game I played')


        await page.click(`#reviewForm > div:nth-child(3) > div > div > span > span > div > span`)
        
        await page.screenshot({ path: 'screenshots/addGameReview.png', fullPage: true });
        await page.click('[type="button"]')

		expect( true).toBeTruthy()
    }, timeout)

    test('add a review on a game with screenshot of game', async() => {
        await page.click('#addreview')
        
        await page.click(`#review_form_in_modal_content`)
        await page.keyboard.type('The best game I played')

        await page.click(`#review_form_in_modal_content`)
        await page.keyboard.type('The best game I played')

        await page.click('#reviewForm > div:nth-child(3) > div > div > span > span > div > span')
        const fileInput = await page.$('input[type=file]');
        await fileInput.uploadFile('screenshots/disneyUniverse.png');

        await page.screenshot({ path: 'screenshots/addGameReviewWithImageOfGame.png', fullPage: true });
        await page.evaluate(() => {
            document.querySelector('[type="button"]').click();
        });
       
		expect(true).toBeTruthy()
    }, timeout)

    test('add a new game', async() => {
        await page.screenshot({ path: 'screenshots/sxe.png', fullPage: true });
        await page.click('#gamesList > div.ant-list-footer > div > span > button')
        
        await page.click(`#addgame_form_in_modal_title`)
        await page.keyboard.type('Packman')

        await page.click(`#addgame_form_in_modal_categoryName`)
        await page.keyboard.type('Maze Arcade')

        await page.click(`#addgame_form_in_modal_publisher`)
        await page.keyboard.type('Namco')

        await page.click(`#addgame_form_in_modal_summary`)
        await page.keyboard.type('Pac-Man is a maze arcade game developed and released by Namco in 1980.')

        await page.click(`#addgame_form_in_modal_description`)
        await page.keyboard.type(`Pac-Man is a maze arcade game developed and released by Namco in 1980. 
            The original Japanese title of Puck Man was changed to Pac-Man for international 
                releases as a preventative measure against defacement of the arcade machines.`)
        
        await page.click('#gameForm > div:nth-child(4) > div > div > div > div > span > span > div > span')
        const fileInput = await page.$('input[type=file]')
        await fileInput.uploadFile('screenshots/packman.png');
   

        await page.screenshot({ path: 'screenshots/addGame.png', fullPage: true });
        await page.evaluate(() => {
            
            document.querySelector('[type="button"]').click();
        });
       
		expect(true).toBeTruthy()
    }, timeout * 40)

    test('click review to view a game reviews', async() => {
        await page.click('#viewreviews')
        
        Promise.resolve(page.waitForSelector('.ant-list-items') )//reviews list
		const list = await page.evaluate(() => Array
			.from(document.querySelectorAll('.ant-list-items'))
			.map(td => td.innerHTML)
        )

	    await page.screenshot({ path: 'screenshots/gameReview.png', fullPage: true });
		const listCounter  = (list[0].match(/gameItem/g) || []).length;
		const listResult = listCounter  >= 1 ? true : false;
       
		expect(listResult).toBeTruthy()
    }, timeout)
    
})


