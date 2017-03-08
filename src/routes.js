import VueRouter from 'vue-router';

import Signin from './components/signin';
import Signup from './components/signup';
import EscapeTogether from './components/escapeTogether';

const routes = [
  {
    path     : '/game',
    name     : 'escapeTogether',
    component: EscapeTogether
  },
  {
    path     : '/',
    name     : 'signin',
    component: Signin
  },
  {
    path     : '/signup',
    name     : 'signup',
    component: Signup
  },
  { path: '*', redirect: { name: 'home' } }];

const router = new VueRouter({
  // mode: 'history',
  routes
});

export default router