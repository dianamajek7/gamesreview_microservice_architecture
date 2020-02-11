'use strict'
const timeout = process.env.SLOWMO ? 30000 : 10000

beforeAll(async() => {
	await page.goto(URL, {waitUntil: 'domcontentloaded'})
	const width = 1220
	const height = 1080
	await page.setViewport({ width, height })
})

describe('Test like and unlikee review, view comments', () => {

	test('like a review, should increment noOfLikes', async() => {
        await page.click(`input[name=username]`)
        await page.keyboard.type('majekodr')


        await page.click(`input[name=password]`)
        await page.keyboard.type('DianaTest.12')
        
        await page.click('[type="submit"]')
        await page.waitForSelector('#header')  //wait for dashboard
        await page.click('#root > div > section > ul > li:nth-child(4) > a') //click game dashboard
        await page.waitForSelector('#root > div > div > div > div:nth-child(1) > a') //filterlink
        
        await page.waitForSelector('.ant-list-items') //games list
        await page.click('#viewreviews')
        await page.waitForSelector('#root > div > div > div > div') //reviews loading
        await page.waitForSelector('#root > div > div > div > div > div.ant-spin-nested-loading > div > ul')//reviews list
        const htmlVal = await page.$eval('#like > span', (element) => element.innerHTML, await page.$(`#like > span`))
        const initialValue = htmlVal
        await page.click('#like');

        const likes = await page.$(`#like > span`)
        const noOflikes = await page.evaluate(h2Handle => h2Handle.innerHTML, likes)

        expect(Number(noOflikes)).toBe(Number(initialValue))
        await page.screenshot({ path: 'screenshots/likeReview.png', fullPage: true });

    }, timeout)

    test('unlike a review, should decrement noOfLikes', async() => {

        const htmlVal = await page.$eval('#like > span', (element) => element.innerHTML, await page.$(`#like > span`))
        const initialValue = htmlVal
        await page.click('#undo')

        const likes = await page.$(`#like > span`)
        const noOflikes = await page.evaluate(h2Handle => h2Handle.innerHTML, likes)

        expect(Number(noOflikes)).toBe(Number(initialValue))
        await page.screenshot({ path: 'screenshots/unlikeReview.png', fullPage: true });

    }, timeout)

    test('view comments', async() => {
        await page.click(`#addCommentButton`)
        await page.waitForSelector('.ant-list-header')
        const htmlVal = await page.$eval('.ant-list-header', (element) => element.innerHTML, '.ant-list-header')
        

        expect(htmlVal.includes('comment')).toBeTruthy()
        await page.screenshot({ path: 'screenshots/loadCommentReview.png', fullPage: true });

    }, timeout)
    
})


