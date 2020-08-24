import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 添加 IE 兼容
import '@babel/polyfill'

import './plugins/element.js'
import './plugins/axios.js'
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
