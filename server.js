// Startup the Server for Pokemon Battle Assistant

const express = require('express');
const app = express();
const favicon = require('express-favicon');
// const csv = require('./jquery.csv.js');

app.use(express.static('static_files'));
app.use(favicon(__dirname + '/static_files/favicon.ico'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${ PORT }`);
});