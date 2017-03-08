"use strict";
const gameData = 'server/data.json';
const express = require('express');
const port = 3050;
const bodyParser = require('body-parser');
const cors = require('cors');
const GameState = require('./gameState');
const fs = require('fs');
const clientSessions = require('client-sessions');
const Room = require('./Room.class');
const RoomsManager = require('./roomManager');


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
	// res.sendFile(gameData);
	// express.static('../public/sw.js', staticOptions)
});
app.get('/img/artifacts/:id', function (req, res) {
	var fileStream = fs.createReadStream('../img/artifacts/'+req.params.id);
	fileStream.pipe(res);
	console.log('hello photo');
});

http.listen(port, function () {
	console.log(`misterREST server is ready`);
});


const io = require('socket.io')(http);
const gameIo = io.of('/game');

function emitState(msg) {
	if(msg.hasOwnProperty('message')){
		gameIo.emit('message', msg);
	} else {
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
// var gameState = new GameState(initialGameState, emitState);

gameIo.count = 0;
gameIo.roomsGroup = new RoomsManager();

gameIo.on('connection', function (socket) {
	console.log('socket.id 1',socket.id);
	var wantedUserId = +socket.handshake.query.userId;
	var wantedUserRoom = +socket.handshake.query.roomId;
	console.log('a user connected');
	let stateWithUserId;
	console.log('inactiveUsers[]:',inactiveUsers);
	console.log('wantedUserRoom:',wantedUserRoom, 'wantedUserId', wantedUserId);
	console.log('inactiveUsers[wantedUserRoom]:',inactiveUsers[wantedUserRoom]);
	if(inactiveUsers[wantedUserRoom] && inactiveUsers[wantedUserRoom][wantedUserId] != undefined) {
	// if (inactiveUsers[wantedUserId] == wantedUserRoom ){
		console.log("it's a known inactive user!");
		let room = gameIo.roomsGroup.getRoomById(wantedUserRoom);
		inactiveUsers[wantedUserRoom][wantedUserId] = false;
		socket.roomId = room.id;
		socket.room = room;
		socket.join(room.id);
		stateWithUserId = socket.room.roomState.reconnectPlayer(wantedUserId);
	} else {
		if (!socket.roomId) {
			// console.log('socket.handshake.query:',socket.handshake.query);
			let userName = socket.handshake.query.userName;
			let myGender = socket.handshake.query.myGender;
			let prefGender = socket.handshake.query.prefGender;
			gameIo.count++;
			console.log('escaping together', gameIo.count);
			let room = gameIo.roomsGroup.setupAvailableRoom(userName, myGender, prefGender, socket);
			socket.roomId = room.id;
			socket.room = room;
			socket.join(room.id);
			// console.log('socket.room:',socket.room);
		}
		// stateWithUserId = gameState.addPlayer(socket.handshake.query.userName, socket.handshake.query.myGender, socket.handshake.query.prefGender, 'classroom');
		stateWithUserId = socket.room.roomState.addPlayer(socket.handshake.query.userName, socket.handshake.query.myGender, socket.handshake.query.prefGender, 'classroom');
		// console.log('socket.room.roomState:',socket.room.roomState);
	}
	const userId = stateWithUserId.userId;
	const roomId = socket.roomId;
	stateWithUserId.roomId = socket.roomId;
	socket.emit('state update', stateWithUserId);
	// gameIo.emit('state update', stateWithUserId);
	// gameIo.to(0).emit('state update', stateWithUserId);
	console.log('state update1', stateWithUserId.userId);
	// socket.broadcast.to(socket.roomId).emit('state update', {
	// 	bags : stateWithUserId.bags,
	// 	players : stateWithUserId.players,
	// 	scenes : stateWithUserId.scenes
	// });
	gameIo.to(socket.roomId).emit('state update', {
		bags : stateWithUserId.bags,
		players : stateWithUserId.players,
		scenes : stateWithUserId.scenes
	});

	socket.on('disconnect', function () {
		console.log('user',userId,'disconnected from room', roomId);
		if(!inactiveUsers[roomId]) inactiveUsers[roomId]=[];
		inactiveUsers[roomId][userId] = roomId;
	});
	socket.on('chat message', function (msg) {
		console.log('chat message');
		gameIo.emit('chat message', msg);
	});
	socket.on('userClick', function (msg) {
		console.log('socket.id 2',socket.id);
		console.log('userClick:', (msg));
		socket.room.roomState.userClick(userId, msg);
		console.log('socket.roomId:',socket.roomId);
	});
	socket.on('bagedArtifactClicked', function (msg) {
		console.log('bagedArtifactClicked:', msg);
		socket.room.roomState.bagedArtifactClicked(userId, msg);
	});
});

http.listen(port, function () {
	console.log('WebSocket is Ready');
});

