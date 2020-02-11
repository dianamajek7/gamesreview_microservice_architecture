'use strict'


module.exports = {
	/** @constant sqlCommentTable
    @type {string}
    @default
    */
	COMMENT_TABLE: `CREATE TABLE Comment (
        Id INT NOT NULL AUTO_INCREMENT,
        userId INT,
        reviewId INT,
        Title TEXT,
        content TEXT,
        dateAdded DATETIME,
        PRIMARY KEY (Id)
    )`,

	/** @constant sqlCommentLike
    @type {string}
    @default
    */
	LIKE_TABLE: `CREATE TABLE Comment_Like (
        userId INT,
        commentId INT,
        liker BOOLEAN
    )`
}
