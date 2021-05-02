# GAMES REVIEW SYSTEM
 * This project was developed using JavaScript and Node.js for backend
   * React for the front-end
   * Jest and puppetter for testing
   * Docker is also used to compose each microservice component in a container following a microservice architecture
 * Logged-in users should be able to browse a list of games (including publisher, title, summary, detailed description and photos).
 * Users should be able to add reviews.

 * In addition the games should be arranged in suitable categories.
 * Users should be able to add new games if these are not already in the list.
 * Users should be able to rate the games.
 * All new reviews should be flagged as pending until checked and released by the site admin.
  * To login as admin kindly email me for the request and I will send over the credentials.
<a href="mailto:dianamajek.dd@gmail.com?"><img src="https://img.shields.io/badge/gmail-%23DD0031.svg?&style=for-the-badge&logo=gmail&logoColor=white"/></a>

 * In addition, the site should be full-text searchable.
 * Reviewers should be able to upload screenshots of the game they are reviewing.
 * Users can comment on other reviews

* A walkthrough of the application running [__Click here...__](https://drive.google.com/file/d/1N5KJgeXPstbZcRQz4kOEc65C5pSPcz6T/view?usp=sharing)

#### Note: To spin up the docker and its containers perform the following steps:
  * under server/user uninstall bcrypt locally from node_modules in terminal using command: npm uninstall bcrypt
  * The Dockerfile within user directory contians a command to reinstall bcrypt, this is to ensure when spinning up the containers the user microservice installs bcrypt within its folder directory and avoid causing an error
