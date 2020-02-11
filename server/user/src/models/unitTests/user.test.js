'use strict'

const user = require('../user')
const userDB = require('../../database/config')
const sqlite = require('sqlite-async')
const sinon = require('sinon')

let testPoolStub

afterEach(() => {
	jest.clearAllMocks()
})

describe('getUserLoginCred()', () => {
	test('should successfully get user login credentials', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(userDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS User (Id INTEGER PRIMARY KEY AUTOINCREMENT, Username TEXT, 
				Email TEXT, Password TEXT, profileImageURL LONGTEXT, About TEXT, role INTEGER, 
				Active BOOLEAN, Deleted BOOLEAN, dateRegistered DATETIME);`)
			await db.run(`INSERT INTO User(Username, Email, Password, profileImageURL, 
                role, Active, Deleted)
                VALUES("i_AMAUSER", "user@gmail.com", "user_strongPasswordEncrypted",
                    "http://www.google.com.png", 0, true, false);`)
			const data = await db.all(sql.replace('?', `"${params}"`))
			await db.close()
			return data
		})
		const result = await user.getUserLoginCred('i_AMAUSER').then(result => result)
		const expected = {Id: 1, Password: 'user_strongPasswordEncrypted', Active: 1, Deleted: 0}
		expect(result).toEqual(expected)
		testPoolStub.restore()
		done()
	})

	test('on get user login credentials error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(userDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await user.getUserLoginCred('UNKOWN_USER').catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})


describe('getUserByUsername()', () => {
	test('should successfully get user by username', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(userDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS User (Id INTEGER PRIMARY KEY AUTOINCREMENT, Username TEXT, 
				Email TEXT, Password TEXT, profileImageURL LONGTEXT, About TEXT, role INTEGER, 
				Active BOOLEAN, Deleted BOOLEAN, dateRegistered DATETIME);`)
			await db.run(`INSERT INTO User(Username, Email, Password, profileImageURL, 
                role, Active, Deleted)
                VALUES("i_AMAUSER", "user@gmail.com", "user_strongPasswordEncrypted",
                    "http://www.google.com.png", 0, true, false);`)
			const data = await db.all(sql.replace('?', `"${params}"`))
			await db.close()
			return data
		})
		const result = await user.getUserByUsername('i_AMAUSER').then(result => result)
		const expected = {Username: 'i_AMAUSER', Deleted: 0}
		expect(result).toEqual(expected)
		testPoolStub.restore()
		done()
	})

	test('on get user by username error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(userDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await user.getUserByUsername('UNKOWN_USER').catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})


describe('getUserByEmail()', () => {
	test('should successfully get user by email', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(userDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS User (Id INTEGER PRIMARY KEY AUTOINCREMENT, Username TEXT, 
				Email TEXT, Password TEXT, profileImageURL LONGTEXT, About TEXT, role INTEGER, 
				Active BOOLEAN, Deleted BOOLEAN, dateRegistered DATETIME);`)
			await db.run(`INSERT INTO User(Username, Email, Password, profileImageURL, 
                role, Active, Deleted)
                VALUES("i_AMAUSER", "user@gmail.com", "user_strongPasswordEncrypted",
                    "http://www.google.com.png", 0, true, false);`)
			const data = await db.all(sql.replace('?', `"${params}"`))
			await db.close()
			return data
		})
		const result = await user.getUserByEmail('user@gmail.com').then(result => result)
		const expected = {Email: 'user@gmail.com', Deleted: 0}
		expect(result).toEqual(expected)
		testPoolStub.restore()
		done()
	})

	test('on get user by email error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(userDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await user.getUserByEmail('UNKOWN_USER').catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})


describe('getUserById()', () => {
	test('should successfully get user by id', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(userDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS User (Id INTEGER PRIMARY KEY AUTOINCREMENT, Username TEXT, 
				Email TEXT, Password TEXT, profileImageURL LONGTEXT, About TEXT, role INTEGER, 
				Active BOOLEAN, Deleted BOOLEAN, dateRegistered DATETIME);`)
			await db.run(`INSERT INTO User(Username, Email, Password, profileImageURL, 
                role, Active, Deleted)
                VALUES("i_AMAUSER", "user@gmail.com", "user_strongPasswordEncrypted",
                    "http://www.google.com.png", 0, true, false);`)
			const data = await db.all(sql.replace('?', `"${params}"`))
			await db.close()
			return data
		})
		const result = await user.getUserById('i_AMAUSER').then(result => result)
		const expected = [{Id: 1}]
		expect(result).toEqual(expected)
		testPoolStub.restore()
		done()
	})

	test('on get user by id error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(userDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await user.getUserById('UNKOWN_USER').catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})

describe('getAllUserDataById()', () => {
	test('successfully get all games', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(userDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS User (Id INTEGER PRIMARY KEY AUTOINCREMENT, Username TEXT, 
				Email TEXT, Password TEXT, profileImageURL LONGTEXT, About TEXT, role INTEGER, 
				Active BOOLEAN, Deleted BOOLEAN, dateRegistered DATETIME);`)
			await db.run(`INSERT INTO User(Username, Email, Password, profileImageURL, About,
                role, Active, Deleted, dateRegistered)
                VALUES("Tom", "tommHarry@gmail.com", ".TomHarry12",
                    "https://servmask.com/img/products/url.png", "My name is Tom", 0, true, false, '2019-10-27 18:11:45');`)
			const data = await db.all(sql.replace('?', `"${params}"`))
			await db.close()
			return data
		})
		const result = await user.getAllUserDataById(1).then(result => result)
		const expected = {Id: 1, Username: 'Tom', Password: '.TomHarry12', Email: 'tommHarry@gmail.com',
			profileImageURL: 'https://servmask.com/img/products/url.png', About: 'My name is Tom',
			role: 0, Active: 1, Deleted: 0, dateRegistered: '2019-10-27 18:11:45' }
		expect(result).toEqual(expected)
		testPoolStub.restore()
		done()
	})

	test('should prompt an error on getAllUserDataById', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(userDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await user.getAllUserDataById().catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})

describe('getUserRole()', () => {
	test('should successfully get user role', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(userDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS User (Id INTEGER PRIMARY KEY AUTOINCREMENT, Username TEXT, 
				Email TEXT, Password TEXT, profileImageURL LONGTEXT, About TEXT, role INTEGER, 
				Active BOOLEAN, Deleted BOOLEAN, dateRegistered DATETIME);`)
			await db.run(`INSERT INTO User(Username, Email, Password, profileImageURL, 
                role, Active, Deleted)
                VALUES("i_AMAUSER", "user@gmail.com", "user_strongPasswordEncrypted",
                    "http://www.google.com.png", 0, true, false);`)
			const data = await db.all(sql.replace('?', `${params}`))
			await db.close()
			return data
		})
		const result = await user.getUserRole(1).then(result => result)
		const expected = {role: 0}
		expect(result).toEqual(expected)
		testPoolStub.restore()
		done()
	})

	test('on get user role error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(userDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await user.getUserRole('3').catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})

describe('savePasswordReminder()', () => {
	test('should successfully save user password reminder', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(userDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Password_Reminder (Id INTEGER PRIMARY KEY AUTOINCREMENT, 
				userId INTEGER, securityQuestion1 TEXT, securityAnswer1 TEXT, securityQuestion2 TEXT,
				securityAnswer2 TEXT);`)
			await db.run(`INSERT INTO Password_Reminder(userId, securityQuestion1, securityAnswer1, 
                securityQuestion2, securityAnswer2)
                VALUES(3, "what is your fav meal?", "rice", "Your fav pet name?", "cindy");`)
			await db.close()
			return
		})
		const result = await user.savePasswordReminder({userId: 3, securityQuestion1: 'what is your fav meal?',
            	securityAnswer1: 'rice', securityQuestion2: 'Your fav pet name?',
            	securityAnswer2: 'cindy'}).then(result => result)
		expect(result).toBeUndefined()
		testPoolStub.restore()
		done()
	})

	test('on save user password reminder error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(userDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await user.savePasswordReminder({}).catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})

describe('updatePasswordReminder()', () => {
	test('successfully update user password reminder', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(userDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS Password_Reminder (Id INTEGER PRIMARY KEY AUTOINCREMENT, 
				userId INTEGER, securityQuestion1 TEXT, securityAnswer1 TEXT, securityQuestion2 TEXT,
				securityAnswer2 TEXT);`)
			await db.run(`INSERT INTO Password_Reminder(userId, securityQuestion1, securityAnswer1, 
                securityQuestion2, securityAnswer2)
                VALUES(3, "what is your fav meal?", "rice", "Your fav pet name?", "cindy");`)
			sql = `UPDATE Password_Reminder SET userId = 3, securityQuestion1 = "what is your fav meal?",
                securityAnswer1 = "noodles", securityQuestion2 = "Your fav pet name?", securityAnswer2 = "marvin"
                WHERE userId = ${params[1]};`
			await db.run(sql)
			sql = `SELECT Id, securityQuestion1, securityAnswer1,
			    securityQuestion2, securityAnswer2 FROM Password_Reminder WHERE userId = ${params[1]};`
			await db.run(sql)
			const data = await db.all(sql)
			await db.close()
			return data
		})
		const result = await user.updatePasswordReminder({userId: 3, securityQuestion1: 'what is your fav meal?',
			securityAnswer1: 'noodles', securityQuestion2: 'Your fav pet name?',
			securityAnswer2: 'marvin'}).then(result => result)
		const expected = {Id: 1, securityQuestion1: 'what is your fav meal?',
			securityAnswer1: 'noodles', securityQuestion2: 'Your fav pet name?',
			securityAnswer2: 'marvin'}
		expect(result).toEqual(expected)
		testPoolStub.restore()
		done()
	})

	test('on update user password reminder error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(userDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await user.updatePasswordReminder(2.5, 1).catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})


describe('registerUser()', () => {
	test('should successfully register user', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(userDB, 'query').callsFake(async(sql, params) => {
			if(testPoolStub.callCount === 1) {
				console.log('callCount1')
				console.log(`MOCK ${sql} with params ${params}`)
				const db = await sqlite.open(':memory:')
				await db.run(`CREATE TABLE IF NOT EXISTS User (Id INTEGER PRIMARY KEY AUTOINCREMENT, Username TEXT, 
                    Email TEXT, Password TEXT, profileImageURL LONGTEXT, About TEXT, role INTEGER, 
                    Active BOOLEAN, Deleted BOOLEAN, dateRegistered DATETIME);`)
				await db.run(`INSERT INTO User(Username, Email, Password, profileImageURL, 
                    role, Active, Deleted)
                    VALUES("i_AMAUSER", "user@gmail.com", "user_strongPasswordEncrypted",
                        "http://www.google.com.png", 0, true, false);`)
				await db.close()

			} else if(testPoolStub.callCount === 2) {
				console.log('callCount2')
				console.log(`MOCK ${sql} with params ${params}`)
				const db = await sqlite.open(':memory:')
				await db.run(`CREATE TABLE IF NOT EXISTS User (Id INTEGER PRIMARY KEY AUTOINCREMENT, Username TEXT, 
                    Email TEXT, Password TEXT, profileImageURL LONGTEXT, About TEXT, role INTEGER, 
                    Active BOOLEAN, Deleted BOOLEAN, dateRegistered DATETIME);`)
				await db.run(`INSERT INTO User(Username, Email, Password, profileImageURL, 
                    role, Active, Deleted)
                    VALUES("i_AMAUSER", "user@gmail.com", "user_strongPasswordEncrypted",
                        "http://www.google.com.png", 0, true, false);`)
			    const data = await db.all(sql.replace('?', `"${params}"`))
				await db.close()
				return data
			}
		})
		const result = await user.registerUser({username: 'i_AMAUSER', password: 'user_strongPasswordEncrypted',
			Email: 'user@gmail.com', profileImageURL: 'http://www.google.com.png' }).then(result => result)
		expect(result).toEqual(1)
		testPoolStub.restore()
		done()
	})

	test('on register error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(userDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await user.registerUser({}).catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})

describe('blackListToken()', () => {
	test('should successfully blackListToken', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(userDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS token_BlackList (Id INTEGER PRIMARY KEY AUTOINCREMENT, 
				token LONGTEXT);`)
			await db.run(`INSERT INTO token_BlackList(token)
                VALUES("${params[0].token}");`)
			await db.close()
			return
		})
		const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYXV0aF9hZG1pbiIsI
		mlhdCI6MTU3Mzg4NzA1NywiZXhwIjoxNTczODkwNjU3fQ.4pmkrhoo-k7Ao7CNa`
		const result = await user.blackListToken(token).then(result => result)
		expect(result).toBeUndefined()
		testPoolStub.restore()
		done()
	})

	test('on blackListToken error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(userDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await user.blackListToken().catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})

describe('getBlackListToken()', () => {
	test('should successfully get getBlackListToken', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(userDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			const db = await sqlite.open(':memory:')
			await db.run(`CREATE TABLE IF NOT EXISTS token_BlackList (Id INTEGER PRIMARY KEY AUTOINCREMENT, 
				token LONGTEXT);`)
			await db.run(`INSERT INTO token_BlackList(token)
                VALUES("${params}");`)
			const data = await db.all(`SELECT * FROM token_BlackList WHERE token = "${params}";`)
			await db.close()
			return data
		})
		const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYXV0aF9hZG1pbiIsI
			mlhdCI6MTU3Mzg4NzA1NywiZXhwIjoxNTczODkwNjU3fQ.4pmkrhoo-k7Ao7CNa`
		const result = await user.getBlackListToken(token).then(result => result)
		const expected = [{Id: 1, token}]
		expect(result).toEqual(expected)
		testPoolStub.restore()
		done()
	})

	test('on getBlackListToken error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(userDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await user.getBlackListToken('3').catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})

describe('deletedUserParam()', () => {
	test('should successfully prepare sql query when emailDeleted ', async(done) => {
		expect.assertions(1)

		const result = await user.deletedUserParam({email: 'user@gmail.com', username: 'i_AMAUSER'}, true, false)
			.then(result => result)
		console.log('reshj', result)
		expect(result).toStrictEqual({
			sql: 'UPDATE User SET ? WHERE Email = ?',
			queryParam: 'user@gmail.com'
		})
		done()
	})

	test('should successfully prepare sql query when userDeleted ', async(done) => {
		expect.assertions(1)

		const result = await user.deletedUserParam({email: 'user@gmail.com', username: 'i_AMAUSER'}, false, true)
			.then(result => result)
		console.log('ranu', result)
		expect(result).toStrictEqual({
			sql: 'UPDATE User SET ? WHERE Username = ?',
			queryParam: 'i_AMAUSER'
		})
		done()
	})
})

describe('updateDeletedUser()', () => {
	test('successfully update deleted user identified by email deleted', async(done) => {
		expect.assertions(2)
		testPoolStub = sinon.stub(userDB, 'query').callsFake(async(sql, params) => {
			if(testPoolStub.callCount === 1) {
				console.log('callCount1')
				console.log(`MOCK ${sql} with params ${params[1]}`)
				expect(params[1]).toStrictEqual('user@gmail.com')
				const db = await sqlite.open(':memory:')
				await db.run(`CREATE TABLE IF NOT EXISTS User (Id INTEGER PRIMARY KEY AUTOINCREMENT, Username TEXT, 
                    Email TEXT, Password TEXT, profileImageURL LONGTEXT, About TEXT, role INTEGER, 
                    Active BOOLEAN, Deleted BOOLEAN, dateRegistered DATETIME);`)
				await db.run(`INSERT INTO User(Username, Email, Password, profileImageURL, 
                    role, Active, Deleted)
                    VALUES("i_AMAUSER", "user@gmail.com", "user_strongPasswordEncrypted",
                        "http://www.google.com.png", 0, false, true);`)

				sql = `UPDATE User SET Username = "updated_USER", Password = "user_PasswordEncrypted",
                    Email = "user@gmail.com", profileImageURL = "http://www.google.com.png", role = 0, Active = true,
                     Deleted = false WHERE Email = "${params[1]}";`
				await db.run(sql)
				await db.close()
			} else if (testPoolStub.callCount === 2) {
				console.log('callCount2')
				console.log(`MOCK ${sql} with params ${params}`)
				const db = await sqlite.open(':memory:')
				await db.run(`CREATE TABLE IF NOT EXISTS User (Id INTEGER PRIMARY KEY AUTOINCREMENT, Username TEXT, 
                    Email TEXT, Password TEXT, profileImageURL LONGTEXT, About TEXT, role INTEGER, 
                    Active BOOLEAN, Deleted BOOLEAN, dateRegistered DATETIME);`)
				await db.run(`INSERT INTO User(Username, Email, Password, profileImageURL, 
                    role, Active, Deleted)
                    VALUES("updated_USER", "user@gmail.com", "user_PasswordEncrypted",
                        "http://www.google.com.png", 0, true, false);`)
			    const data = await db.all(sql.replace('?', `"${params}"`))
				await db.close()
				return data
			}
		})
		const result = await user.updateDeletedUser({username: 'updated_USER', password: 'user_PasswordEncrypted',
			email: 'user@gmail.com', profileImageURL: 'http://www.google.com.png' }, true, false).then(result => result)
		expect(result).toBe(1)
		testPoolStub.restore()
		done()
	})

	test('successfully update deleted user identified by username deleted', async(done) => {
		expect.assertions(2)
		testPoolStub = sinon.stub(userDB, 'query').callsFake(async(sql, params) => {
			if(testPoolStub.callCount === 1) {
				console.log('callCount1')
				console.log(`MOCK ${sql} with params ${params}`)
				expect(params[1]).toStrictEqual('updated_USER')
				const db = await sqlite.open(':memory:')
				await db.run(`CREATE TABLE IF NOT EXISTS User (Id INTEGER PRIMARY KEY AUTOINCREMENT, Username TEXT, 
                    Email TEXT, Password TEXT, profileImageURL LONGTEXT, About TEXT, role INTEGER, 
                    Active BOOLEAN, Deleted BOOLEAN, dateRegistered DATETIME);`)
				await db.run(`INSERT INTO User(Username, Email, Password, profileImageURL, 
                    role, Active, Deleted)
                    VALUES("i_AMAUSER", "user@gmail.com", "user_strongPasswordEncrypted",
                        "http://www.google.com.png", 0, false, true);`)

				sql = `UPDATE User SET Username = "updated_USER", Password = "user_PasswordEncrypted",
                    Email = "user@gmail.com", profileImageURL = "http://www.google.com.png", role = 0, Active = true,
                     Deleted = false WHERE Username = "${params[1]}";`
				await db.run(sql)
				await db.close()
			} else if (testPoolStub.callCount === 2) {
				console.log('callCount2')
				console.log(`MOCK ${sql} with params ${params}`)
				const db = await sqlite.open(':memory:')
				await db.run(`CREATE TABLE IF NOT EXISTS User (Id INTEGER PRIMARY KEY AUTOINCREMENT, Username TEXT, 
                    Email TEXT, Password TEXT, profileImageURL LONGTEXT, About TEXT, role INTEGER, 
                    Active BOOLEAN, Deleted BOOLEAN, dateRegistered DATETIME);`)
				await db.run(`INSERT INTO User(Username, Email, Password, profileImageURL, 
                    role, Active, Deleted)
                    VALUES("updated_USER", "user@gmail.com", "user_PasswordEncrypted",
                        "http://www.google.com.png", 0, true, false);`)
			    const data = await db.all(sql.replace('?', `"${params}"`))
				await db.close()
				return data
			}
		})
		const result = await user.updateDeletedUser({username: 'updated_USER', password: 'user_PasswordEncrypted',
			Email: 'user@gmail.com', profileImageURL: 'http://www.google.com.png' }, false, true).then(result => result)
		expect(result).toBe(1)
		testPoolStub.restore()
		done()
	})

	test('on update deleted user error prompt', async(done) => {
		expect.assertions(1)
		testPoolStub = sinon.stub(userDB, 'query').callsFake(async(sql, params) => {
			console.log(`MOCK ${sql} with params ${params}`)
			throw new Error()
		})
		const result = await user.updateDeletedUser({}).catch(err => err)
		expect(result).toBeInstanceOf(Error)
		testPoolStub.restore()
		done()
	})
})

