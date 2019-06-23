// Node.js + Express server backend for petsapp
// version 3 - use Firebase API as a database, which is called from the
// frontend, so nothing needs to be in the backend except for static_files
//
// COGS121 by Philip Guo
// https://github.com/pgbovine/COGS121

// Prerequisites - first run:
//   npm install
//
// which will look in package.json and install all dependencies
// (e.g., express)
//
// To start the server, run:
//   node server.js
//
// and open the frontend webpage at http://localhost:3000/petsapp.html
//
//
// [optional] you can use nodemon to automatically restart your Node.js
// server whenever your backend files change. https://nodemon.io/
//
// Install globally using:
//
// sudo npm install -g nodemon
//
// and then start the server using:
//   nodemon server.js

const express = require('express');
require('dotenv').config();
const app = express();
const favicon = require('express-favicon');

// put all of your static files (e.g., HTML, CSS, JS, JPG) in the static_files/
// sub-directory, and the server will serve them from there. e.g.,:
//
// http://localhost:3000/petsapp.html
// http://localhost:3000/cat.jpg
//
// will send the file static_files/cat.jpg to the user's web browser
//
// Learn more: http://expressjs.com/en/starter/static-files.html
app.use(express.static('static_files'));
app.use(favicon(__dirname + '/static_files/favicon.ico'));

// start the server at URL: http://localhost:3000/
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${ PORT }`);
});
