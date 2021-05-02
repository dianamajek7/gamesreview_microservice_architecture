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
SELECT "auth_admin", "$2b$10$gi4FToO6tbOFF/MtaB9YtuPGyQXU67lWXoi5V2PYuSfeGe.mklEAi" 
FROM DUAL
WHERE NOT EXISTS (
        SELECT 1
        FROM Admin
        WHERE adminName = "auth_admin"
)
LIMIT 1;
