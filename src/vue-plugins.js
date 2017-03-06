import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import VeeValidate from 'vee-validate';
import VueTouch from 'vue-touch';

Vue.use(Vuex);
Vue.use(VeeValidate);
Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(VueTouch, {name: 'v-touch'});