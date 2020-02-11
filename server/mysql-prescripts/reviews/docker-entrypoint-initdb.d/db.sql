grant all privileges on *.* to 'root'@'%' identified by 'password';
flush privileges;


CREATE TABLE IF NOT EXISTS Review (
        Id INT NOT NULL AUTO_INCREMENT,
        userId INT,
        gameId INT,
        Title TEXT,
        content TEXT,
        screenshotImageURL LONGTEXT,
        flag TEXT,
        dateAdded DATETIME,
        PRIMARY KEY (Id)
);

CREATE TABLE IF NOT EXISTS Review_Like (
        userId INT,
        reviewId INT,
        liker BOOLEAN
);

INSERT INTO `Review_Like`(`userId`, `reviewId`, `liker`) VALUES (2, 3, 1);
INSERT INTO `Review_Like`(`userId`, `reviewId`, `liker`) VALUES (2, 4, 1);
INSERT INTO `Review_Like`(`userId`, `reviewId`, `liker`) VALUES (3, 4, 1);
INSERT INTO `Review_Like`(`userId`, `reviewId`, `liker`) VALUES (5, 4, 1);
INSERT INTO `Review_Like`(`userId`, `reviewId`, `liker`) VALUES (5, 2, 1);
INSERT INTO `Review_Like`(`userId`, `reviewId`, `liker`) VALUES (1, 2, 1);
INSERT INTO `Review_Like`(`userId`, `reviewId`, `liker`) VALUES (1, 3, 1);
INSERT INTO `Review_Like`(`userId`, `reviewId`, `liker`) VALUES (5, 8, 1);
INSERT INTO `Review_Like`(`userId`, `reviewId`, `liker`) VALUES (9, 7, 1);

INSERT INTO `Review`(`Id`, `userId`, `gameId`, `Title`, `content`, `screenshotImageURL`, `flag`, `dateAdded`) 
        VALUES (1, 2, 1, 'Warfare', 'Warfare is pretty good, enjoyed playing it', 'https://i.guim.co.uk/img/media/8c9594b1b6f4eab2f9767f13002b30a24ee93791/353_151_1260_756/master/1260.jpg?width=300&quality=85&auto=format&fit=max&s=3ab5769b464270a6055c3c817ff83770', 'approved', '2019-02-27 23:11:45');

INSERT INTO `Review`(`Id`, `userId`, `gameId`, `Title`, `content`, `screenshotImageURL`, `flag`, `dateAdded`) 
        VALUES (2, 3, 1, 'Warfare', 'Warfare is okay but there are better games', 'https://i.guim.co.uk/img/media/8c9594b1b6f4eab2f9767f13002b30a24ee93791/353_151_1260_756/master/1260.jpg?width=300&quality=85&auto=format&fit=max&s=3ab5769b464270a6055c3c817ff83770', 'approved', '2019-02-27 23:11:45'); 

INSERT INTO `Review`(`Id`, `userId`, `gameId`, `Title`, `content`, `screenshotImageURL`, `flag`, `dateAdded`) 
        VALUES (3, 2, 2, 'GTA', 'GTA is pretty good, enjoyed playing it', 'http://www.androidshock.com/wp-content/uploads/2014/01/GTA-SA-2.jpg', 'approved', '2019-02-27 23:11:45');   

INSERT INTO `Review`(`Id`, `userId`, `gameId`, `Title`, `content`, `screenshotImageURL`, `flag`, `dateAdded`) 
        VALUES (4, 1, 2, 'GTA', 'GTA is okay but there are better games', 'http://www.oldpcgaming.net/wp-content/uploads/2016/04/Snap336_1.jpg', 'approved', '2019-02-27 23:11:45');   

INSERT INTO `Review`(`Id`, `userId`, `gameId`, `Title`, `content`, `screenshotImageURL`, `flag`, `dateAdded`) 
        VALUES (5, 3, 4, 'Blackops', 'Blackops is pretty good, enjoyed playing it', 'https://ksassets.timeincuk.net/wp/uploads/sites/54/2018/10/Call-of-Duty-Black-Ops-4.4-1024x576.jpg', 'approved', '2019-02-27 23:11:45');   

INSERT INTO `Review`(`Id`, `userId`, `gameId`, `Title`, `content`, `screenshotImageURL`, `flag`, `dateAdded`) 
        VALUES (6, 4, 4, 'Blackops', 'Blackops is okay but there are better games', 'https://ksassets.timeincuk.net/wp/uploads/sites/54/2018/10/Call-of-Duty-Black-Ops-4.4-1024x576.jpg', 'approved', '2019-02-27 23:11:45');       

INSERT INTO `Review`(`Id`, `userId`, `gameId`, `Title`, `content`, `screenshotImageURL`, `flag`, `dateAdded`) 
        VALUES (7, 5, 5, 'Peppa Pig', 'Peppa Pig is pretty good, enjoyed playing it', 'https://i.guim.co.uk/img/static/sys-images/Technology/Pix/pictures/2010/4/7/1270636567606/Peppa-Pig-Fun-and-Games-001.jpg?width=300&quality=85&auto=format&fit=max&s=27f1cdfbf7247b400dfe27dc1831aa8d', 'approved', '2019-02-27 23:11:45');   

INSERT INTO `Review`(`Id`, `userId`, `gameId`, `Title`, `content`, `screenshotImageURL`, `flag`, `dateAdded`) 
        VALUES (8, 6, 5, 'Peppa Pig', 'Peppa Pig is okay but there are better games', 'https://i.guim.co.uk/img/static/sys-images/Technology/Pix/pictures/2010/4/7/1270636567606/Peppa-Pig-Fun-and-Games-001.jpg?width=300&quality=85&auto=format&fit=max&s=27f1cdfbf7247b400dfe27dc1831aa8d', 'approved', '2019-02-27 23:11:45');   


INSERT INTO `Review`(`Id`, `userId`, `gameId`, `Title`, `content`, `screenshotImageURL`, `flag`, `dateAdded`) 
        VALUES (9, 7, 6, 'Witcher3', 'Witcher3 is the best game', 'https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/pictures/2015/5/13/1431520130189/8bfad8ae-5a24-4617-988e-ccafee83324f-1020x612.jpeg?width=300&quality=85&auto=format&fit=max&s=dd3de485a8cd5382ec672ce0eb1a4797', 'approved', '2019-02-27 23:11:45');   

INSERT INTO `Review`(`Id`, `userId`, `gameId`, `Title`, `content`, `screenshotImageURL`, `flag`, `dateAdded`) 
        VALUES (10, 8, 7, 'CS Girl', 'CS Girl is okay but there are better games', 'https://thumbs.gfycat.com/UnknownFragrantAssassinbug-poster.jpg', 'approved', '2019-02-27 23:11:45');

INSERT INTO `Review`(`Id`, `userId`, `gameId`, `Title`, `content`, `screenshotImageURL`, `flag`, `dateAdded`) 
        VALUES (11, 9, 3, 'Mario', 'Mario is okay but there are better games', 'https://image.businessinsider.com/5d07b0fc6fc92043b17f8c26?width=1100&format=jpeg&auto=webp', 'approved', '2019-02-27 23:11:45');                                               

INSERT INTO `Review`(`Id`, `userId`, `gameId`, `Title`, `content`, `screenshotImageURL`, `flag`, `dateAdded`) 
        VALUES (12, 1, 3, 'GTA', 'GTA is one of the games you must play', 'http://www.oldpcgaming.net/wp-content/uploads/2016/04/Snap336_1.jpg', 'pending', '2019-02-27 23:11:45');  
                                                     
INSERT INTO `Review`(`Id`, `userId`, `gameId`, `Title`, `content`, `screenshotImageURL`, `flag`, `dateAdded`) 
        VALUES (13, 5, 3, 'Mario', 'Mario is pretty daft not smart game', 'https://image.businessinsider.com/5d07b0fc6fc92043b17f8c26?width=1100&format=jpeg&auto=webp', 'pending', '2019-02-27 23:11:45'); 

INSERT INTO `Review`(`Id`, `userId`, `gameId`, `Title`, `content`, `screenshotImageURL`, `flag`, `dateAdded`) 
        VALUES (14, 2, 7, 'CS Girl', 'CS Girl is not all that', 'https://thumbs.gfycat.com/UnknownFragrantAssassinbug-poster.jpg', 'pending', '2019-02-27 23:11:45'); 

INSERT INTO `Review`(`Id`, `userId`, `gameId`, `Title`, `content`, `screenshotImageURL`, `flag`, `dateAdded`) 
        VALUES (15, 7, 6, 'Witcher3', 'Witcher3 is pretty terrible', 'https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/pictures/2015/5/13/1431520130189/8bfad8ae-5a24-4617-988e-ccafee83324f-1020x612.jpeg?width=300&quality=85&auto=format&fit=max&s=dd3de485a8cd5382ec672ce0eb1a4797', 'pending', '2019-02-27 23:11:45');                                                                       