'use strict'

module.exports = {
	/** @constant sqlUserTable
    @type {string}
    @default
    */
	USER_TABLE: `CREATE TABLE User (Id INT NOT NULL AUTO_INCREMENT,
        Username VARCHAR(32) NOT NULL,
        Email VARCHAR(32) NOT NULL,
        Password VARCHAR(256) NOT NULL,
        profileImageURL LONGTEXT,
        About VARCHAR(32),
        role INT,
        Active BOOLEAN,
        Deleted BOOLEAN,
        dateRegistered DATETIME NOT NULL,
        PRIMARY KEY (Id),
        UNIQUE KEY unique_email (Email),
        UNIQUE KEY unique_username (Username)
    )`,

	/** @constant sqlPasswordReminderTable
    @type {string}
    @default
    */
	PASSWORD_REMINDER: `CREATE TABLE Password_Reminder (
        Id INT NOT NULL AUTO_INCREMENT,
        userId INT,
        securityQuestion1 TEXT,
        securityAnswer1 TEXT,
        securityQuestion2 TEXT,
        securityAnswer2 TEXT,
        PRIMARY KEY (Id),
        FOREIGN KEY (userId)
            REFERENCES User(Id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
    )`,

	/** @constant sqlAdminTable
    @type {string}
    @default
    */
	ADMIN_TABLE: `CREATE TABLE Admin (
        Id INT NOT NULL AUTO_INCREMENT,
        adminName TEXT,
        password TEXT,
        PRIMARY KEY (Id)
    )`,

	/** @constant sqlTokenBlackListTable
    @type {string}
    @default
    */
	TOKEN_BLACKLIST_TABLE: `CREATE TABLE token_BlackList (
        Id INT NOT NULL AUTO_INCREMENT,
        token LONGTEXT,
        PRIMARY KEY (Id)
    )`,

	/** @constant sqlLikeTable
    @type {string}
    @default
    */
	SELECT_USERID: 'SELECT Id FROM User WHERE Username = ?',

	/** @constant internalAdminUsername
    @type {string}
    @default
    */
	ADMIN_NAME: 'auth_admin',
	/** @constant internalAdminPassword
    @type {string}
    @default
    */
	ADMIN_PASSWORD: 'admin@Goal1'
}
