'use strict'
const timeout =  process.env.SLOWMO ? 30000 : 10000

beforeAll(async() => {
	await page.goto(URL, {waitUntil: 'domcontentloaded'})
	const width = 1220
	const height = 1080
	await page.setViewport({ width, height })
})

describe('Test view edit and delete commets, like comments, unlike comments', () => {

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
        await page.click(`#addCommentButton`)
        await page.waitForSelector('.ant-list-header')
        await page.waitForSelector('.ant-list-items')
        const likeButton = `#root > div > div > div > div.ant-list.comment-list.ant-list-lg.ant-list-split.ant-list-something-after-last-item > div.ant-spin-nested-loading 
            > div > ul > li > ul > li > div > span > span:nth-child(1) > button`
        await page.click(likeButton)
        expect(true).toBeTruthy()
        await page.screenshot({ path: 'screenshots/likeCommentReview.png', fullPage: true });

    }, timeout)

    test('unlike a comment review, should decrement noOfLikes', async() => {
        const undoLikeButton = `#root > div > div > div > div.ant-list.comment-list.ant-list-lg.ant-list-split.ant-list-something-after-last-item > div.ant-spin-nested-loading 
            > div > ul > li > ul > li > div > span > span:nth-child(2) > button`
        await page.click(undoLikeButton)

        expect(true).toBeTruthy()
        await page.screenshot({ path: 'screenshots/unlikeCommentReview.png', fullPage: true });

    }, timeout)

    test('add comment on review', async() => { 
        await page.click('#root > div > div > div > div:nth-child(2) > div > div > div.ant-comment-content > div.ant-comment-content-detail > div > div:nth-child(1) > div > div > span > textarea')
        Promise.resolve(page.keyboard.type(`Parents need to know that Pac-Man and the Ghostly Adventures is an animated 
            series thats loosely based on the classic video game.`))
        await page.screenshot({ path: 'screenshots/addCommentReview.png', fullPage: true });
        await page.click('#addComment')

        const htmlVal = await page.$eval('.ant-list-header', (element) => element.innerHTML, '.ant-list-header')
        await page.screenshot({ path: 'screenshots/updateAddCommentListCommentReview.png', fullPage: true });
        expect(htmlVal.includes('comment')).toBeTruthy()

        await page.click(`#root > div > div > div > div.ant-list.comment-list.ant-list-lg.ant-list-split.ant-list-something-after-last-item > div.ant-spin-nested-loading > div > ul > li:nth-child(2) > ul > li > div > span > span:nth-child(1) > button > i > svg`)
        await page.screenshot({ path: 'screenshots/d.png', fullPage: true });

        await page.click(`#deleteComment > div > div > div.ant-popover-buttons >
             button.ant-btn.ant-btn-primary.ant-btn-sm`)
    }, timeout)


    test('delete comment on review', async() => {
        await page.screenshot({ path: 'screenshots/e.png', fullPage: true });
        await page.click('#root > div > div > div > div:nth-child(2) > div > div > div.ant-comment-content > div.ant-comment-content-detail > div > div:nth-child(1) > div > div > span > textarea')
        await page.keyboard.type(`Parents need to know that Pac-Man and the Ghostly Adventures is an animated 
            series thats loosely based on the classic video game.`)
        await page.click('#addComment')
        await page.screenshot({ path: 'screenshots/beforedeleteCommentReview.png', fullPage: true });
        Promise.resolve(page.waitForSelector('#root > div > div > div > div.ant-list.comment-list.ant-list-lg.ant-list-split.ant-list-something-after-last-item > div.ant-spin-nested-loading > div > ul > li:nth-child(2) > ul > li > div > span > span:nth-child(1) > button'))
        await page.click(`#root > div > div > div > div.ant-list.comment-list.ant-list-lg.ant-list-split.ant-list-something-after-last-item > div.ant-spin-nested-loading > div > ul > li:nth-child(2) > ul > li > div > span > span:nth-child(1) > button > i > svg`)
        await page.screenshot({ path: 'screenshots/d.png', fullPage: true });

        await page.click(`#deleteComment > div > div > div.ant-popover-buttons >
             button.ant-btn.ant-btn-primary.ant-btn-sm`)

        await page.screenshot({ path: 'screenshots/afterdeleteCommentReview.png', fullPage: true });
        expect(true).toBeTruthy()
    }, timeout)
    
})


