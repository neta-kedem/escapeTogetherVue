"use strict";
const gameData = 'server/data.json';
const express = require('express');
const port = 3003;
const bodyParser = require('body-parser');
const cors = require('cors');
const GameState = require('./gameState');
const fs = require('fs');
const clientSessions = require('client-sessions');



const app = express();
app.use(cors());
app.use(bodyParser.json());

var corsOptions = {
  origin: ['/http:\/\/localhost:\d+/', '*'],
  credentials: true
};

app.use(express.static('uploads'));
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(clientSessions({
	cookieName: 'session',
	secret: 'C0d1ng 1s fun 1f y0u kn0w h0w',
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000,
}));

const http = require('http').Server(app);
let objStr = fs.readFileSync(gameData, 'utf8');

app.get('/gameData', function (req, res) {
	var fileStream = fs.createReadStream(gameData);
	fileStream.pipe(res);
	console.log('hello my new user');
	// res.sendFile(gameData);
	// express.static('../public/sw.js', staticOptions)
});

http.listen(port, function () {
	console.log(`misterREST server is ready`);
});


const io = require('socket.io')(http);
const gameIo = io.of('/game');

function emitState(msg) {
	if(msg.hasOwnProperty('message')){
		gameIo.emit('message', msg);
		}
	else{
		gameIo.emit('state update', msg);
		}
}

//from babel
function objectWithoutProperties(obj, keys) {
	var target = {};
	for (var i in obj) {
		if (keys.indexOf(i) >= 0)
			continue;
		if (!Object.prototype.hasOwnProperty.call(obj, i))
			continue;
		target[i] = obj[i];
	}
	return target;
}

function getGameStateFromJSON(sourceJSON) {
	var sourceJSON = sourceJSON;
	var hotspots = {};
	var modals = {};
	for (let scene in sourceJSON.scenes) {
	    if (sourceJSON.scenes[scene].type  === 'staticScene'){
	        modals[scene] = objectWithoutProperties(sourceJSON.scenes[scene],['type','hotSpots']);
        }
		hotspots[scene] = sourceJSON.scenes[scene].hotSpots.reduce((result,hs)=>{
			if (hs.hasOwnProperty('id')){
				result.push(objectWithoutProperties(hs,['pitch','yaw']));
			}
			return result;
		},[]);
	}
	return {hotSpots:hotspots, modals:modals};
}

//use eval to allow comments inside JSON file.
//eval fails on JSON files starting with "{", using () is a workaround for that
let clientsideJSON = eval('(' + objStr + ')');

let initialGameState = getGameStateFromJSON(clientsideJSON);
let inactiveUsers=[];
var gameState = new GameState(initialGameState, emitState);
gameIo.on('connection', function (socket) {
	var wantedUserId = +socket.handshake.query.userId;
	console.log('a user connected');
	let stateWithUserId;
	if (inactiveUsers[wantedUserId]){
		console.log("it's a known inactive user!");
		inactiveUsers[wantedUserId] = false;
		stateWithUserId = gameState.reconnectPlayer(wantedUserId);
	}else{
		stateWithUserId = gameState.addPlayer('gramsci', 'queer', 'classroom');
	}
	const userId = stateWithUserId.userId;
	// console.log(stateWithUserId);
	socket.emit('state update', stateWithUserId);
	console.log('state update');
	socket.broadcast.emit('state update', {
		bags : stateWithUserId.bags,
		players : stateWithUserId.players,
		scenes : stateWithUserId.scenes
	});
	socket.on('disconnect', function () {
		console.log('user',userId,'disconnected');
		inactiveUsers[userId] = true;
	});
	socket.on('chat message', function (msg) {
		console.log('chat message');
		gameIo.emit('chat message', msg);
	});
	socket.on('userClick', function (msg) {
		console.log('userClick:', (msg));
		gameState.userClick(userId, msg);
	});
	socket.on('bagedArtifactClicked', function (msg) {
		console.log('bagedArtifactClicked:', msg);
		gameState.bagedArtifactClicked(userId, msg);
	});

});

http.listen(3003, function () {
console.log('WebSocket is Ready');
});

