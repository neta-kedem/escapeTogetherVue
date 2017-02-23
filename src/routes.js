import VueRouter from 'vue-router';

import Signin from './components/signin';
import Signup from './components/signup';
import Shop from './components/shop';
import EscapeTogether from './components/escapeTogether';
import Admin from './components/admin/admin';

const routes = [{
  path     : '/signin',
  name     : 'signin',
  component: Signin
  },
  {
    path     : '/signup',
    name     : 'signup',
    component: Signup
  },
  {
    path     : '/shop',
    name     : 'shop',
    component: Shop
  },
  {
    path     : '/',
    name     : 'escapeTogether',
    component: EscapeTogether
  },
  {
    path     : '/admin',
    name     : 'admin',
    component: Admin
  },
  
  { path: '*', redirect: { name: 'home' } }];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router