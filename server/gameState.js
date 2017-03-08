/**
 * Created by neta on 7/27/16.
 */
"use strict";
var GameState = (function () {
    function GameState(scenesData, cb, playerName, playerGender, playerCurrScene) {
        var that = this;
        if (playerCurrScene === void 0) { playerCurrScene = 'classroom'; }
        this.bags = []; //decide later the exact item structure
        this.players = [];
        //to put in some utility file
        this.flatten = function (list) { return list.reduce(function (acc, curr) { return acc.concat(Array.isArray(curr) ? that.flatten(curr) : curr); }, []); };
        this.scenes = scenesData.hotSpots;
        this.modals = scenesData.modals;
        this.cb = cb;
        if (playerGender) {
            console.log('playerGender????',playerGender);
            this.addPlayer(playerName, playerGender, playerCurrScene);
        }
    }
    //the mother of all the game logic
    GameState.prototype.sendStateToUsers = function () {
        this.cb({ bags: this.bags, players: this.players, scenes: this.scenes });
    };
    GameState.prototype.findArtifactById = function (artifactId) {
        var theArtifact;
        for (var scene in this.scenes) {
            var foundItems = this.scenes[scene].filter(function (artifact) { return artifact.id === artifactId; });
            if (foundItems.length) {
                theArtifact = foundItems[0];
                break;
            }
        }
        return theArtifact;
    };
    GameState.prototype.userClick = function (userId, artifactId) {
        if(artifactId.devtoolsEnabled || artifactId.source) return;
        var that = this;
        console.log('game state totally knows' , artifactId , 'was clicked');
        // console.log('this.players:',this.players);
        var userScene = this.players[userId].currScene;
        var clickedArtifact;
        for (var scene in this.scenes) {
            var foundItems = this.scenes[scene].filter(function (artifact) { return artifact.id === artifactId; });
            if (foundItems.length) {
                clickedArtifact = foundItems[0];
                break;
            }
        }
        console.log('***clicked***', clickedArtifact.id);
        //if the clicked artifact is shown (prevent bugs due to "clicking" an already hidden object due to communication lag)
        if (clickedArtifact.shown) {
            if ((!clickedArtifact.required.length && !this.players[userId].itemIdInHand) || clickedArtifact.required.indexOf(this.players[userId].itemIdInHand) >= 0) {
                //this is the place to handle clickedArtifact.actions
                if (this.players[userId].itemIdInHand) {
                    this.removeItemFromBag(this.players[userId].itemIdInHand);
                    this.unSelectItemInBag(userId);
                }
                clickedArtifact.actions.forEach(function (action) {
                    switch (Object.keys(action)[0]) {
                        case 'collect':
                            that.bags[userId].push(that.findArtifactById(action.collect));
                            console.log('totally collecting!');
                            break;
                        case 'loadScene':
                            that.players[userId].currScene = action.loadScene;
                            break;
                        case 'changeSceneEveryone':
                            Object.keys(action.changeSceneEveryone).forEach(function (sceneToChange) {
                                that.players.forEach(function (player) {
                                    if (player.currScene === sceneToChange)
                                        player.currScene = action.changeSceneEveryone[sceneToChange];
                                });
                            });
                            break;
                        case 'showHotSpot':
                            that.findArtifactById(action.showHotSpot).shown = true;
                            break;
                        case 'hideHotSpot':
                            that.findArtifactById(action.hideHotSpot).shown = false;
                            break;
                        case 'message':
                            that.sendMessage(userId, action.message);
                            break;
                        case 'playSound':
                            that.soundEffect(userId, action.sound);
                            //todo: add sound effects
                            break;
                    }
                });
            }
            else {
                //requirements don't match
                if (clickedArtifact.message) {
                    this.sendMessage(userId, clickedArtifact.message);
                }
            }
        }
        this.sendStateToUsers();
    };
    //a happy new player joind the room
    GameState.prototype.addPlayer = function (name, gender, prefGender, currScene, givenId) {
        if (currScene === void 0) { currScene = 'classroom'; }
        this.players.push({ name: name, gender: gender, prefGender:prefGender, currScene: currScene, itemIdInHand: null });
        // console.log('this.players in addPlayer',this.players);
        this.bags.push([]);
        return { bags: this.bags, players: this.players, scenes: this.scenes, modals: this.modals, userId: this.players.length - 1 };
    };
    //a happy old player reconnected the game
    GameState.prototype.reconnectPlayer = function (userId) {
        return { bags: this.bags, players: this.players, scenes: this.scenes, modals: this.modals, userId: userId };
    };
    //an item in the bag section was clicked. the user can use it if no one else is using this
    GameState.prototype.bagedArtifactClicked = function (userId, artifactId) {
        var clickedArtifact = this.flatten(this.bags).filter(function (artifact) { return artifact.id === artifactId; })[0];
        //if the clicked artifact is shown (prevent bugs due to "clicking" an already hidden object due to communication lag)
        if (clickedArtifact.beingUsedBy === -1) {
            clickedArtifact.beingUsedBy = userId;
            this.players[userId].itemIdInHand = clickedArtifact.id;
        }
        else if (this.players[userId].itemIdInHand === clickedArtifact.id) {
            this.unSelectItemInBag(userId);
        }
        else {
            console.log('someone else is playing with that ' + clickedArtifact.id);
        }
        this.sendStateToUsers();
    };
    ;
    GameState.prototype.unSelectItemInBag = function (userId) {
        var that = this;
        if (this.players[userId].itemIdInHand) {
            this.bags.forEach(function (bag) {
                bag.forEach(function (artifact) {
                    if (artifact.id === that.players[userId].itemIdInHand)
                        artifact.beingUsedBy = -1;
                    console.log('artifact.id:', artifact.id);
                });
            });
            this.players[userId].itemIdInHand = '';
        }
    };
    GameState.prototype.removeItemFromBag = function (artifactId) {
        this.bags = this.bags.map(function (bag) {
            return bag.filter(function (artifact) {
                return artifact.id !== artifactId;
            });
        });
    };
    GameState.prototype.sendMessage = function (userId, message) {
        this.cb({ message: message, userId: userId });
    };
    GameState.prototype.soundEffect = function (userId, soundPath) {
        this.cb({ sound: soundPath, userId: userId });
    };
    return GameState;
}());
exports.GameState = GameState;
module.exports = GameState;
//# sourceMappingURL=gameState.js.map