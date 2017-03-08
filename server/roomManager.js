const Room = require('./Room.class');

class RoomsManager {
    constructor(){
        this.roomsCount = -1;
        // this.rooms = [ new Room(this.getNextRoomNum()) ];
        this.rooms = [];
    }

    setupAvailableRoom(userName, myGender, prefGender, socket) {
        // console.log('Creating new room for a',myGender, 'who likes', prefGender);
        // console.log('this.rooms:',this.rooms);
        let room = this.rooms.find((currRoom) =>
            (currRoom.playersCount < 2)&&
            (currRoom.state.players[0].playerGender === prefGender) &&
            (currRoom.state.players[0].playerPrefGender === myGender)
        );
        // if no appropriate room found
        if (room === undefined) {
            this.roomsCount++;
            room = new Room(this.roomsCount, userName, myGender, prefGender, socket);
            console.log('Creating a room:', room.id);
            this.rooms.push( room );
        } else {
            // found a room with a possible lover
            // but the room is full :)
            // if (room.playersCount >= 2) {
            //     room = new Room(this.getNextRoomNum(), userName, myGender, prefGender, socket);
            //     console.log('Creating new room:', room.id);
            //     this.rooms.push( room );
            // } else {
                // found a room for the player!
                room.addPlayerToRoom(userName, myGender, prefGender);
                console.log('Found spot in existing room:', room.id);
            // }
        }
        return room;
    }

    getNextRoomNum(){
        return this.roomsCount++;
    }

    getRoomById(id) {
        return this.rooms.filter(room => room.id === id)[0];
    }
}

module.exports = RoomsManager;