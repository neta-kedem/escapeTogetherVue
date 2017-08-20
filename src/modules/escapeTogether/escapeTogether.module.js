export const OPEN_MODAL     = 'store/OPEN_MODAL';
export const CLOSE_MODAL    = 'store/CLOSE_MODAL';
export const MODAL_SRC      = 'store/MODAL_SRC';

export const OPEN_GAME      = 'store/OPEN_GAME';
export const CLOSE_GAME     = 'store/CLOSE_GAME';
export const GAME_CODE      = 'store/GAME_CODE';
export const GAME_HTML      = 'store/GAME_HTML';
export const GAME_CSS      = 'store/GAME_CSS';

export const SET_HOT_SPOTS  = 'store/SET_HOT_SPOTS';
export const SET_BAGS       = 'store/SET_BAGS';
export const SET_USER_ID    = 'store/SET_USER_ID';
export const SET_SOCKET     = 'store/SET_SOCKET';
export const SOCKET_ON      = 'store/SOCKET_ON';

export const MY_GENDER      = 'store/MY_GENDER';
export const PREF_GENDER    = 'store/PREF_GENDER';
export const NICKNAME       = 'store/NICKNAME';

export const UPDATE_MSG       = 'store/UPDATE_MSG';

const state = {
    showModal     : false,
    playGame      : false,
    modalSrc      : null,
    modalHotSpots : [],
    currScene     : '',
    bags          : [],
    userId        : -1,
    myGender      : '',
    prefGender    : '',
    nickName      : '',
    gameCode      : '',
    gameHtml      : '',
    gameCSS       : '',
    completeMsg   : '',
};

const getters = {
    showModal   : state => state.showModal,
    playGame    : state => state.playGame,
    modalSrc    : state => state.modalSrc,
    modalHotSpots:state => state.modalHotSpots ,
    socket      : state => socket,
    bags        : state => state.bags,
    userId      : state => state.userId,
    myGender    : state => state.myGender,
    prefGender  : state => state.prefGender,
    nickName    : state => state.nickName,
    gameCode    : state => state.gameCode,
    gameHtml    : state => state.gameHtml,
    gameCSS     : state => state.gameCSS,
    completeMsg : state => state.completeMsg,
};

const mutations = {
    [OPEN_MODAL]( state ) {
        state.showModal = true;
    },
    [CLOSE_MODAL]( state ) {
        state.showModal = false;
    },
    [OPEN_GAME]( state ) {
        state.playGame = true;
    },
    [CLOSE_GAME]( state ) {
        state.playGame = false;
    },
    [MODAL_SRC]( state, src ) {
        state.modalSrc  = src;
    },
    [GAME_CODE]( state, gameCode ) {
        state.gameCode  = gameCode;
    },
    [GAME_HTML]( state, gameHtml ) {
        state.gameHtml  = gameHtml;
    },
    [GAME_CSS]( state, gameCSS ) {
        state.gameCSS  = gameCSS;
    },
    [SET_HOT_SPOTS] ( state, hotSpots ) {
        state.modalHotSpots = hotSpots;
    },
    [SET_BAGS] ( state, bags ) {
        state.bags = bags;
    },
    [SET_USER_ID] ( state, userId ) {
        state.userId = userId % 2;
    },
    [MY_GENDER] ( state, myGender ) {
        state.myGender = myGender;
    },
    [PREF_GENDER] ( state, prefGender ) {
        state.prefGender = prefGender;
    },
    [NICKNAME] ( state, nickName ) {
        state.nickName = nickName;
    },
    [UPDATE_MSG] ( state, newMsg ) {
        state.completeMsg = newMsg;
    },
};

const actions = {
}

export default {
    state,
    getters,
    actions,
    mutations
}
