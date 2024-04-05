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

// Import required modules
const express = require('express');
const fs = require('fs');
const WebSocket = require('ws');
const cookieParser = require('cookie-parser');
const Wordle = require("./model.js");

// Define constants
const port = 8580; 
const socketPort = port + 1;
const GAME_DURATION_SECONDS = 60;
const cookieOptions = { maxAge: 3600000 }; // Cookie expires in 1 hour

// Initialize variables
let gameInstance = null;
let gameTimer = null;
let gameWinners = [];
let words = ["words"]; // Default value

// Initialize data structures
const clients = [];
const fingerprintMap = {};
const database = {};

// Initialize Express app
const app = express();
app.use(cookieParser());
app.use(express.json()); // Support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // Support URL-encoded bodies

// Initialize WebSocket server
const wss = new WebSocket.Server({ port: socketPort });

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
 * web socket server
 ******************************************************************************/

// Handle new WebSocket connection
wss.on('connection', function connection(ws, req) {
    const clientUserAgent = req.headers['user-agent'];
    
    // Check if a client with the same user agent already exists
    if (clientUserAgent in fingerprintMap) {
        console.log("Client already exists for this user agent.");
        // Do not add a new client
        return;
    }
    
    // Add the new client
    fingerprintMap[clientUserAgent] = ws;
    clients.push(ws);

	// Start a new game if none exists
    if (!gameInstance) {
        startNewGame();
    } else {
        broadcastPlayerCount(clients.length);
    }

	// Handle WebSocket disconnection
    ws.on('close', function () {
        delete fingerprintMap[clientUserAgent];
        clients.splice(clients.indexOf(ws), 1);

		// End the game if all players have disconnected
        if (clients.length === 0) {
            console.log("All players disconnected. Returning to menu...");
            endGame();
        } else {
            broadcastPlayerCount(clients.length);
        }
    });
});

/******************************************************************************
 * broadcasting functions
 ******************************************************************************/

// Broadcast player count to all clients
function broadcastPlayerCount(count) {
    const data = { type: 'playerCount', count };
    broadcastData(data);
}

// Broadcast data to all clients
function broadcastData(data) {
    const message = JSON.stringify(data);
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// Start a new game
function startNewGame() {
	if (gameTimer) {
        clearInterval(gameTimer);
		gameTimer = null;
    }
	gameInstance = new Wordle(words)
	gameWinners = []
	gameInstance.reset()
    console.log('New game instance created.');
    broadcastPlayerCount(clients.length);
    startTimer();
}

// End the current game
function endGame() {
    clearInterval(gameTimer);
    gameInstance = null;
	setTimeout(startNewGame, 10000);
}

// Start the game timer
function startTimer() {
    let startTime = Date.now();
    gameTimer = setInterval(() => {
        let elapsedTime = Date.now() - startTime;
        let remainingTime = GAME_DURATION_SECONDS - Math.floor(elapsedTime / 1000);
        if (remainingTime <= 0) {
            clearInterval(gameTimer);
            remainingTime = 0; // Ensure remaining time doesn't go negative
            endGame();
        }
        broadcastData({ type: 'timerUpdate', remainingTime });
    }, 1000);
}



/******************************************************************************
 * routes
 ******************************************************************************/

// initialize the game and get the username and stats
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
		wordle.setTarget(gameInstance.getTarget())
        res.cookie('username', newUsername, cookieOptions); 
        res.status(200).json({"username": newUsername, "wins": wins, "losses": losses});
    }
});

// reset the game
app.put('/api/username/:username/newgame', function (req, res) {
	let username=req.params.username;

	if(!(username in database)){
		let wordle=new Wordle(words);
		wordle.setUsername(username);
		database[username]=wordle;
	} 
	database[username].reset();
	if (gameInstance) {
		database[username].setTarget(gameInstance.getTarget())
	}

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

	if (gameInstance) {
		database[username].setTarget(gameInstance.getTarget())
	}
	var data = database[username].makeGuess(guess);
	if (data.state === "won") {
		gameWinners.push(username)
	}
	database[username].setWinnersArray(gameWinners);
	data.winners = gameWinners;
	res.status(200);
	res.json(data);
});

app.listen(port, function () {
  	console.log('Example app listening on port '+port);
});

