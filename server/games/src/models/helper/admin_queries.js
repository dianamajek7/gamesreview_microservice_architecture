'use strict'

module.exports = {
	/** @constant sqlGameTable
    @type {string}
    @default
    */
	GAME_TABLE: `CREATE TABLE Game (
        Id INT NOT NULL AUTO_INCREMENT,
        Title TEXT,
        categoryID INT,
        Publisher TEXT,
        summary TEXT,
        description TEXT,
        imageURL LONGTEXT,
        rating FLOAT DEFAULT 0,
        PRIMARY KEY (Id)
    )`,

	/** @constant sqlCategoryTable
    @type {string}
    @default
    */
	CATEGORY_TABLE: `CREATE TABLE Category (
        Id INT NOT NULL AUTO_INCREMENT,
        Name TEXT,
        PRIMARY KEY (Id)
    )`,

	/** @constant sqlRateTable
    @type {string}
    @default
    */
	RATE_TABLE: `CREATE TABLE Rate (
        userId INT,
        gameId INT,
        rate FLOAT,
    )`,

	/** @constant sqlSelectCategoryById
    @type {string}
    @default
    */
	SELECT_CATEGORY_BYID: 'SELECT Id FROM Category WHERE Name = ?',

	/** @constant sqlSelectGameById
    @type {string}
    @default
    */
	SELECT_GAME_BYID: 'SELECT Id FROM Game WHERE Title = ?'

}
