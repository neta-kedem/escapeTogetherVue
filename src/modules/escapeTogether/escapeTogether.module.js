import socket from '../../main.js';

export const OPEN_MODAL = 'store/OPEN_MODAL';
export const CLOSE_MODAL = 'store/CLOSE_MODAL';
export const MODAL_SRC = 'store/MODAL_SRC';
export const SET_HOT_SPOTS = 'store/SET_HOT_SPOTS';
export const SET_BAGS = 'store/SET_BAGS';
export const SET_USER_ID = 'store/SET_USER_ID';
export const SET_SOCKET = 'store/SET_SOCKET';
export const SOCKET_ON = 'store/SOCKET_ON';

export const MY_GENDER = 'store/MY_GENDER';
export const PREF_GENDER = 'store/PREF_GENDER';
export const NICKNAME = 'store/NICKNAME';

const state = {
  showModal     : false,
  modalSrc      : null,
  modalHotSpots : [],
  socket        : socket,
  currScene     : '',
  bags          : [],
  userId        : -1,
  myGender      : '',
  prefGender    : '',
  nickName      :''
};

const getters = {
    showModal   : state => state.showModal ,
    modalSrc    : state => state.modalSrc ,
    modalHotSpots:state => state.modalHotSpots ,
    socket      : state => socket,
    bags        : state => state.bags,
    userId      : state => state.userId,
    myGender    : state => state.myGender,
    prefGender  : state => state.prefGender,
    nickName    : state => state.nickName,
};

const mutations = {
    [OPEN_MODAL]( state ) {
        state.showModal = true;
        console.log('state.modalSrc:',state.modalSrc);
    },
    [CLOSE_MODAL]( state ) {
        state.showModal = false;
    },
    [MODAL_SRC]( state, src ) {
        state.modalSrc  = src;
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
    [SET_SOCKET] ( state, socket ) {
        state.socket = socket;
    },
    [SOCKET_ON] ( state, socketOn ) {
        state.socket.on(socketOn.action, socketOn.function)
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
};

const actions = {
}

export default {
  state,
  getters,
  actions,
  mutations
}
