let roomSocket;
const fs = require('fs');
const GameState = require('./gameState');
const gameData = 'server/data.json';
class Room {
    constructor(id, userName, playerGender, playerPrefGender, socket) {
        let objStr = fs.readFileSync(gameData, 'utf8');
        let clientsideJSON = eval('(' + objStr + ')');
        let initialGameState = getGameStateFromJSON(clientsideJSON);
        this.socket = socket;
        this.id = id;
        this.playersCount = 1;
        this.state = {
        	players:[{
        		name: userName,
        		playerGender,
        		playerPrefGender
        	}]
        };
        this.roomState = new GameState(initialGameState, this.emitState.bind(this), this.userName, this.playerGender, this.playerPrefGender);
    }

    addPlayerToRoom(userName, playerGender, playerPrefGender){
        let newPlayer = {
        	name: userName,
        	playerGender,
    		playerPrefGender
        }
        this.state.players.push(newPlayer);
        this.playersCount++;
    }

    emitState(msg) {
        console.log('+++++ emit', this.socket.id, 'to', this.socket.roomId);
        if(msg.hasOwnProperty('message')){
            this.socket.emit('message', msg);
            this.socket.broadcast.to(this.id).emit('message', msg);
        } else {
            this.socket.emit('state update', msg);
            this.socket.broadcast.to(this.id).emit('state update', msg);
        }
    }
}

function getGameStateFromJSON(sourceJSON) {
    var sourceJSON = sourceJSON;
    var hotspots = {};
    var modals = {};
    var games = {};
    for (let scene in sourceJSON.scenes) {
        if (sourceJSON.scenes[scene].type  === 'staticScene') {
            modals[scene] = objectWithoutProperties(sourceJSON.scenes[scene],['type','hotSpots']);
        }
        if (sourceJSON.scenes[scene].type  === 'gameScene') {
            games[scene] = objectWithoutProperties(sourceJSON.scenes[scene],['type','hotSpots']);
        }
        hotspots[scene] = sourceJSON.scenes[scene].hotSpots.reduce((result,hs) => {
            if (hs.hasOwnProperty('id')){
                result.push(objectWithoutProperties(hs,['pitch','yaw']));
            }
            return result;
        }, []);
    }
    return {hotSpots:hotspots, modals:modals, games:games};
}

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
module.exports = Room;