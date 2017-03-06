class Room {
    constructor(id, userName, playerGender, playerPrefGender) {
    	// console.log('Room constructor playerGender:',playerGender);
    	// console.log('Room constructor playerPrefGender:',playerPrefGender);
        const GameState = require('./gameState');

        this.id = id;
        this.playersCount = 1;
        this.state = {
        	players:[{
        		name: userName,
        		playerGender,
        		playerPrefGender
        	}]
        };
        this.roomState = new GameState(initialGameState, emitState);
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
}

module.exports = Room;