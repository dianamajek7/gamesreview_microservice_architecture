grant all privileges on *.* to 'root'@'%' identified by 'password';
flush privileges;


CREATE TABLE IF NOT EXISTS Comment (
        Id INT NOT NULL AUTO_INCREMENT,
        userId INT,
        reviewId INT,
        Title TEXT,
        content TEXT,
        dateAdded DATETIME,
        PRIMARY KEY (Id)
);

CREATE TABLE IF NOT EXISTS Comment_Like (
        userId INT,
        commentId INT,
        liker BOOLEAN
);
INSERT INTO `Comment`(`Id`, `userId`, `reviewId`, `Title`, `content`, `dateAdded`) 
VALUES (1, 1, 3, 'GTA Review', 'I loved playing it also', '2019-02-27 23:11:45'),
(2, 4, 11, 'Mario Review', 'I loved playing better try again', '2019-02-27 23:11:45'),
(3, 2, 11, 'Mario Review', 'It is a must try, loved playing better try again', '2019-02-27 23:11:45'),
(4, 1, 11, 'Mario Review', 'It is a must try, loved playing better try again', '2019-02-27 23:11:45'),
(5, 6, 11, 'Mario Review', 'Definetly try, loved playing better try again', '2019-02-27 23:11:45'),
(6, 8, 11, 'Mario Review', 'You would not regret it! loved playing better try again', '2019-02-27 23:11:45'),
(7, 2, 1, 'Warfare Review', 'It is the best Action game', '2019-02-27 23:11:45'),
(8, 2, 10, 'CSGirl Review', 'It is the one you do not want to miss out on', '2019-02-27 23:11:45'),
(9, 4, 3, 'GTA Review', 'It is the one you do not want to miss out on, stealing cars, shooting and running from police.', '2019-02-27 23:11:45'),
(10, 2, 8, 'Peppa Pig Review', 'It is the one you do not want to miss out on, best for babies', '2019-02-27 23:11:45');

INSERT INTO `Comment_Like`(`userId`, `commentId`, `liker`) 
VALUES (2, 5, 1), (3, 5, 1), (1, 5, 1), (4, 5, 1), (8, 10, 1),
(4, 9, 1);