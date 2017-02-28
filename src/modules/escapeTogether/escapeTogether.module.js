import socket from '../../main.js';


export const OPEN_MODAL = 'store/OPEN_MODAL';
export const CLOSE_MODAL = 'store/CLOSE_MODAL';
export const MODAL_SRC = 'store/MODAL_SRC';
export const SET_HOT_SPOTS = 'store/SET_HOT_SPOTS';
export const SET_BAGS = 'store/SET_BAGS';
export const SET_USER_ID = 'store/SET_USER_ID';
export const SET_SOCKET = 'store/SET_SOCKET';
export const SOCKET_ON = 'store/SOCKET_ON';
export const START_SOCKET_IO = 'store/START_SOCKET_IO';

const state = {
  showModal     : false,
  modalSrc      : null,
  modalHotSpots : [],
  socket        : socket,
  currScene     : '',
  bags          : [],
  userId        : -1,
};

const getters = {
    showModal   : state => state.showModal ,
    modalSrc    : state => state.modalSrc ,
    modalHotSpots:state => state.modalHotSpots ,
    socket      : state => socket,
    bags        : state => state.bags,
    userId      : state => state.userId,
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
        state.userId = userId;
    },
    [SET_SOCKET] ( state, socket ) {
        state.socket = socket;
    },
    [SOCKET_ON] ( state, socketOn ) {
        state.socket.on(socketOn.action, socketOn.function)
    },
};

const actions = {
    startSocketIo({commit}){
    }
}

export default {
  state,
  getters,
  actions,
  mutations
}
