import './style.scss';
import './vendor';
import './vue-plugins';

import Vue from 'vue';
import store from './store';
import router from './routes';
import MainNav from './components/main-nav';

import io from 'socket.io-client';
const SERVER_URL=window.location.hostname+':3050';
const socket = io(SERVER_URL+'/game',{query:{userId:localStorage.getItem('escapeTogetherUserId')}});
// const socket = io('/game',{path: '/escapeTogether/game/socket.io', secure: true, query:{userId:localStorage.getItem('escapeTogetherUserId')}});
export default socket;

// Vue.http.options.root="https://coding-academy.net/escapeTogether/game/server"
Vue.http.options.root='http://'+SERVER_URL;

const app = new Vue({
  router,
  store,
  components: {
    MainNav
  }
}).$mount('#app');

