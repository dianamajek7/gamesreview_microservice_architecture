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

### Prerequisites to run application either via docker or locally
* __Ensure to call this endpoint once__ in Postman/SoapUI, this to ensure to create a new databse for the user 
  * POST Method, Body empty{}, URL(port number good defer locally on docker use 3001): http://localhost:3001/api/v1.0/user/admin/create_user_db

### Note: To spin up the docker and its containers perform the following steps:
  * Under server/user uninstall bcrypt locally from node_modules in terminal using command: npm uninstall bcrypt
    * Once completed bcrypt should not be present in the package.json
  * The Dockerfile within user directory contians a command to reinstall bcrypt, this is to ensure when spinning up the containers the user microservice installs bcrypt within its folder directory and avoid causing an error
