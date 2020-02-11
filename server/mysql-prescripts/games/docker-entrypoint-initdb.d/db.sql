grant all privileges on *.* to 'root'@'%' identified by 'password';
flush privileges;


CREATE TABLE IF NOT EXISTS Game (
        Id INT NOT NULL AUTO_INCREMENT,
        Title TEXT,
        categoryID INT,
        Publisher TEXT,
        summary TEXT,
        `description` TEXT,
        imageURL LONGTEXT,
        rating FLOAT DEFAULT 0,
        PRIMARY KEY (Id)
);

CREATE TABLE IF NOT EXISTS Category (
        Id INT NOT NULL AUTO_INCREMENT,
        Name TEXT,
        PRIMARY KEY (Id)
);

CREATE TABLE Rate (
        userId INT,
        gameId INT,
        rate FLOAT
);

INSERT INTO `Category`(`Id`, `Name`) 
VALUES (1, 'Video Game'), (2, 'Massively Multiplayer Online'), (3, 'Pervasive Game'), (4,'Role Playing Game'), (5, 'Simulation Game');

INSERT INTO `Game` (`Id`, `Title`, `categoryID`, `Publisher`, `summary`, `description`, `imageURL`, `rating`) 
VALUES (1, 'Warfare', 1, 'Warfare Developer', 'Warfare is a arena shoot game', 'Drive cars, have mission', 'https://images-na.ssl-images-amazon.com/images/I/71jPJXXYdIL._SY445_.jpg', 2.5),
(2, 'GTA', 1, 'GTA Developer', 'Spend all day playing', 'Drive cars, have mission and shooting', 'https://cdn.images.express.co.uk/img/dynamic/143/590x/GTA-6-1179665.jpg?r=1568827384164', 3.1),
(3, 'Mario', 5, 'Mario Developer', 'Spend all day playing', 'Alot of jumping', 'https://ewscripps.brightspotcdn.com/dims4/default/0a28d4f/2147483647/strip/true/crop/1422x800+89+0/resize/1280x720!/quality/90/?url=https%3A%2F%2Fewscripps.brightspotcdn.com%2F49%2Fbf%2Fc479914148dbabde25c63483311b%2Fsuper-mario-bros.jpg', 4.025),
(4, 'Blackops', 1, 'Blackops Developer', 'Spend all day playing', 'Drive cars, have mission and shooting and stealing cars', 'https://upload.wikimedia.org/wikipedia/en/thumb/0/02/CoD_Black_Ops_cover.png/220px-CoD_Black_Ops_cover.png', 4.025),
(5, 'Peppa Pig', 5, 'Peppa Pig Developer', 'Spend all day playing', 'Drive cars, have mission', 'https://www.sundaypost.com/wp-content/uploads/sites/13/2019/11/Peppa-Pig-in-Scots-PR-eOne-1.jpg', 0),
(6, 'Witcher3', 3, 'Witcher3 Developer', 'Spend all day playing', 'Drive cars, have mission', 'https://static.cdprojektred.com/thewitcher.com/media/wallpapers/witcher3/full/witcher3_en_wallpaper_the_witcher_3_wild_hunt_geralt_with_trophies_2560x1600_1449484679.png', 0),
(7, 'CS Girl', 4, 'CS Girl Developer', 'Spend all day playing', 'Drive cars, have mission', 'https://files.gamebanana.com/img/ss/guis/_1718-.jpg', 3.05);
(8, 'Habbo', 2, 'Sony Developer', 'Spend all day playing', 'Drive cars, have mission', 'https://vignette.wikia.nocookie.net/habbo/images/f/f2/Game_info_feature.png/revision/latest?cb=20120908172715&path-prefix=en', 3.05);

INSERT INTO `Rate`(`userId`, `gameId`, `rate`) 
VALUES (1, 1, 2.5), (2, 2, 2.9), (4, 3, 3), (5, 3, 3), (5, 4, 3), (7, 7, 3), (7, 4, 5);
