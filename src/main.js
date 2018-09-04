import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'//防止移动端触屏延迟
import lazyload from 'vue-lazyload'
import store from './store'
fastclick.attach(document.body);
Vue.use(lazyload,{
	loading:require('components/recommend/images/icon.jpg')
})
/*Vue.config.productionTip = false*/

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  store
})
