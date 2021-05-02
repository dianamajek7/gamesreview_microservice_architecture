# GAMES REVIEW SYSTEM
 * This project was developed using JavaScript and Node.js for backend
   * React for the front-end
   * Jest and puppetter for testing
   * Docker is also used to compose each component in a container following a microservice architecture
 * Logged-in users should be able to browse a list of games (including publisher, title, summary, detailed description and photos).
 * Users should be able to add reviews and comments.

 * In addition the games should be arranged in suitable categories.
 * Users should be able to add new games if these are not already in the list.
 * Users should be able to rate the games.
 * All new reviews should be flagged as pending until checked and released by the site admin.
  * To login as admin kindly email me a request and I will mail over the credentials.
<a href="mailto:dianamajek.dd@gmail.com?"><img src="https://img.shields.io/badge/gmail-%23DD0031.svg?&style=for-the-badge&logo=gmail&logoColor=white"/></a>

 * The site should be full-text searchable.
 * Reviewers should be able to upload screenshots of the game they are reviewing.
 * Users can comment or like others reviews

* A walkthrough of the application running [__Click here...__](https://drive.google.com/file/d/1N5KJgeXPstbZcRQz4kOEc65C5pSPcz6T/view?usp=sharing)

### Prerequisites to run the application locally
* Run this commend in the route level of the folder ./server/user __npm install bcrypt@latest --save__, this is to ensure the dependency 'bcrypt' is installed and present in package.json file

### Prerequisites to spin the application up within a docker environment
  * Locate this folder ./server/user ensure 'bcrypt' dependency is not present in the package.json file, however if it is present uninstall bcrypt locally in terminal by using the command __npm uninstall bcrypt__
    * If completed successfully bcrypt should not be present in the package.json and in the node_modules folder
  * The Dockerfile within the user directory contians the command 'npm install bcrypt@latest --save' to reinstall bcrypt, this is to ensure when spinning up the containers the user microservice installs bcrypt within its folder directory, which avoids causing an error
