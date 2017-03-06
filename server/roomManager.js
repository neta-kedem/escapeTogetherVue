const Room = require('./Room.class');

class RoomsManager {
    constructor(){
        this.roomsCount = 0;
        // this.rooms = [ new Room(this.getNextRoomNum()) ];
        this.rooms = [];
    }

    setupAvailableRoom(userName, myGender, prefGender) {
        // console.log('Creating new room for a',myGender, 'who likes', prefGender);
        // console.log('this.rooms:',this.rooms);
        let room = this.rooms.find((currRoom) =>
            (currRoom.state.players[0].playerGender === prefGender) &&
            (currRoom.state.players[0].playerPrefGender === myGender)
        );
        console.log('room',room);
        // if no appropriate room found
        if (room === undefined) {
            room = new Room(this.roomsCount, userName, myGender, prefGender);
            console.log('Creating a room:', room.id);
            this.rooms.push( room );
            this.roomsCount++;
        } else {
            // found a room with a possible lover
            // but the room is full :)
            if (room.playersCount >= 2) {
            room = new Room(this.getNextRoomNum(), userName, myGender, prefGender);
            console.log('Creating new room:', room.id);
            this.rooms.push( room );
        } else {
            // found a room for the player!
            room.addPlayerToRoom(userName, myGender, prefGender);
            console.log('Found spot in existing room:', room.id);
        }}
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