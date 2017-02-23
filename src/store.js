import Vuex from 'vuex';
import authModule from './modules/auth/auth.module';
import shopModule from './modules/shop/shop.module';
import cartModule from './modules/cart/cart.module';
import escapeTogetherModule from './modules/escapeTogether/escapeTogether.module';

const isProduction = process.env.NODE_ENV === 'production';

export default new Vuex.Store({
  modules: {
    auth : authModule,
    shop: shopModule,
    cart : cartModule,
    escapeTogether: escapeTogetherModule
  },
  strict : !isProduction
})
