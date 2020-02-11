'use strict'

module.exports = {
	/** @constant sqlReviewTable
    @type {string}
    @default
    */
	REVIEW_TABLE: `CREATE TABLE Review (
        Id INT NOT NULL AUTO_INCREMENT,
        userId INT,
        gameId INT,
        Title TEXT,
        content TEXT,
        screenshotImageURL LONGTEXT,
        flag TEXT,
        dateAdded DATETIME,
        PRIMARY KEY (Id)
    )`,

	/** @constant sqlReviewLikeTable
    @type {string}
    @default
    */
	LIKE_TABLE: `CREATE TABLE Review_Like (
        userId INT,
        reviewId INT,
        liker BOOLEAN
    )`
}
