grant all privileges on *.* to 'root'@'%' identified by 'password';
flush privileges;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'

CREATE TABLE IF NOT EXISTS User (Id INT NOT NULL AUTO_INCREMENT,
        Username VARCHAR(32) NOT NULL,
        Email VARCHAR(32) NOT NULL,
        `Password` VARCHAR(256) NOT NULL,
        profileImageURL LONGTEXT,
        About VARCHAR(32),
        `role` INT,
        Active BOOLEAN,
        Deleted BOOLEAN,
        dateRegistered DATETIME NOT NULL,
        PRIMARY KEY (Id),
        UNIQUE KEY unique_email (Email),
        UNIQUE KEY unique_username (Username)
);

CREATE TABLE IF NOT EXISTS Password_Reminder (
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
);


CREATE TABLE IF NOT EXISTS `Admin` (
        Id INT NOT NULL AUTO_INCREMENT,
        adminName TEXT,
        `password` TEXT,
        PRIMARY KEY (Id)
);

CREATE TABLE IF NOT EXISTS token_BlackList (
        Id INT NOT NULL AUTO_INCREMENT,
        token LONGTEXT,
        PRIMARY KEY (Id)
);

INSERT INTO Admin(adminName, password)
SELECT "auth_admin", "$2b$10$37nQDSvdmhxSDKix9kIr0.BhTo10K3G6X/AccAZ6ijbUstDFm4aG6" 
FROM DUAL
WHERE NOT EXISTS (
        SELECT 1
        FROM Admin
        WHERE adminName = "auth_admin"
)
LIMIT 1;


INSERT INTO `User`(`Id`, `Username`, `Email`, `Password`, `profileImageURL`, `About`, `role`, `Active`, `Deleted`, `dateRegistered`) 
        VALUES (1, 'sammarl', 'sammal@gmail.com', 'Sam.Marl12', 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        'I am sam', 0, 1, 0,'2019-10-27 23:11:45');

INSERT INTO `User`(`Id`, `Username`, `Email`, `Password`, `profileImageURL`, `About`, `role`, `Active`, `Deleted`, `dateRegistered`) 
        VALUES (2, 'gracie', 'gracie@gmail.com', 'Grace.12', 'https://cdn1.iconfinder.com/data/icons/user-pictures/100/female1-512.png',
        'I am Gracie', 0, 1, 0,'2019-09-27 23:11:45');

INSERT INTO `User`(`Id`, `Username`, `Email`, `Password`, `profileImageURL`, `About`, `role`, `Active`, `Deleted`, `dateRegistered`) 
        VALUES (3, 'tomark', 'tommark@gmail.com', 'Tom.Mark12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqf84eCVGQWKp-qErPk0njWhqragEhnKOom1UNJY0hcOBb3vgX0g&s',
        'I am Tom', 0, 1, 0,'2019-01-27 23:11:45');

INSERT INTO `User`(`Id`, `Username`, `Email`, `Password`, `profileImageURL`, `About`, `role`, `Active`, `Deleted`, `dateRegistered`) 
        VALUES (4, 'tester', 'tester@gmail.com', 'Test.Test12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2RgV5yu32nzVGZMsFyhq1kKwSddQ7S4CGDveRoMQsQDB7RZunXw&s',
        'I am tester', 0, 1, 0,'2019-10-27 23:11:45');

INSERT INTO `User`(`Id`, `Username`, `Email`, `Password`, `profileImageURL`, `About`, `role`, `Active`, `Deleted`, `dateRegistered`) 
        VALUES (5, 'unia', 'unia@gmail.com', 'Unia.Ma11', 'https://p7.hiclipart.com/preview/118/942/565/computer-icons-avatar-child-user-avatar-thumbnail.jpg',
        'I am unia', 0, 1, 0,'2019-08-10 23:11:45');

INSERT INTO `User`(`Id`, `Username`, `Email`, `Password`, `profileImageURL`, `About`, `role`, `Active`, `Deleted`, `dateRegistered`) 
        VALUES (6, 'steve','steve@gmail.com', 'Sam.Marl12', 'https://i7.pngguru.com/preview/340/946/334/avatar-user-computer-icons-software-developer-avatar-thumbnail.jpg',
        'I am steve', 0, 1, 0,'2019-07-27 23:11:45');

INSERT INTO `User`(`Id`, `Username`, `Email`, `Password`, `profileImageURL`, `About`, `role`, `Active`, `Deleted`, `dateRegistered`) 
        VALUES (7, 'john', 'john@gmail.com', 'John.Baptist12', 'https://i0.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?fit=256%2C256&quality=100&ssl=1',
        'I am john', 0, 1, 0,'2019-03-27 23:11:45');

INSERT INTO `User`(`Id`, `Username`, `Email`, `Password`, `profileImageURL`, `About`, `role`, `Active`, `Deleted`, `dateRegistered`) 
        VALUES (8, 'marn', 'marn@gmail.com', 'Sam.Marl12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTANaCVQsuC4AlKCmp-u0HnDi-fDjKptWGPRNt0yFz0nrfqmrQLuw&s',
        'I am sam', 0, 1, 0,'2019-05-27 23:11:45');

INSERT INTO `User`(`Id`, `Username`, `Email`, `Password`, `profileImageURL`, `About`, `role`, `Active`, `Deleted`, `dateRegistered`) 
        VALUES (9, 'develop', 'developer@gmail.com', 'Developer.l12', 'https://www.tm-town.com/assets/default_female600x600-3702af30bd630e7b0fa62af75cd2e67c.png',
        'I am a developer', 0, 1, 0,'2019-02-27 23:11:45');

INSERT INTO `User`(`Id`, `Username`, `Email`, `Password`, `profileImageURL`, `About`, `role`, `Active`, `Deleted`, `dateRegistered`) 
        VALUES (10, 'production', 'production@gmail.com', 'Production.12', 'https://boygeniusreport.files.wordpress.com/2018/08/bold-1.png?w=400&h=400&crop=1',
        'I am a production', 0, 1, 0,'2019-01-27 23:11:45');