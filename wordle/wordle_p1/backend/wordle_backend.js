/**
 * read    GET - Safe, Idempotent, Cachable
 * update  PUT - Idempotent
 * delete  DELETE - Idempotent
 * create  POST
 *
 * https://restfulapi.net/http-methods/
 * https://restfulapi.net/http-status-codes/
 *
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
 * https://restfulapi.net/rest-put-vs-post/
 **/

const port = 8580; 
const express = require('express');

const app = express();
const fs = require('fs');
const Wordle = require("./model.js");

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const database = {};
var words = ["words"]; // just in case!!

/******************************************************************************
 * word routines
 ******************************************************************************/

// Read in all words, lets hope this finished before we need the words!
// https://www.memberstack.com/blog/reading-files-in-node-js
fs.readFile('./words.5', 'utf8', (err, data) => {
        if (err)console.error(err);
        else words = data.split("\n");
});

/******************************************************************************
 * middleware
 ******************************************************************************/
app.use(express.json()); // support json encoded bodies
app.use(express.urlencoded({ extended: true })); // support encoded bodies

// https://expressjs.com/en/starter/static-files.html
// app.use(express.static('static-content')); 

/******************************************************************************
 * routes
 ******************************************************************************/
app.get('/api/username/', function (req, res) {
    const username = req.cookies.username;
    let wins, losses;

    if (username && database[username]) {
        wins = database[username].getWins();
        losses = database[username].getLosses();
        res.status(200).json({"username": username, "wins": wins, "losses": losses});
    } else {
        let wordle = new Wordle(words);
        const newUsername = wordle.getUsername();
        database[newUsername] = wordle;
        wins = wordle.getWins(); // Use wordle object directly here
        losses = wordle.getLosses(); // Use wordle object directly here
        res.cookie('username', newUsername); 
        res.status(200).json({"username": newUsername, "wins": wins, "losses": losses});
    }
});


app.put('/api/username/:username/newgame', function (req, res) {
	let username=req.params.username;

	if(!(username in database)){
		let wordle=new Wordle(words);
		wordle.setUsername(username);
		database[username]=wordle;
	} 
	database[username].reset();

	res.status(200);
	res.json({"status":"created"});
});

// Add another guess against the current secret word
app.post('/api/username/:username/guess/:guess', function (req, res) {
	let username=req.params.username;
	let guess=req.params.guess;

	if(! username in database){
		res.status(409);
		res.json({"error":`${username} does not have an active game`});
		return;
	}
	var data = database[username].makeGuess(guess);
	res.status(200);
	res.json(data);
});

app.listen(port, function () {
  	console.log('Example app listening on port '+port);
});

