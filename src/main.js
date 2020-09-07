import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@babel/polyfill' // 添加 IE 兼容
import '@styles/index.scss'
import '@plugins/element.js'
import './permission.js'
import '@components/register-global-component.js'
import api from '@api/index.js'
import utils from '@utils/index.js'
import vuescroll from 'vuescroll/dist/vuescroll-native'

Vue.use(vuescroll)
Vue.config.productionTip = false
Vue.prototype.$api = api // http网络请求api
Vue.prototype.$utils = utils // 工具函数类
const IS_PROD = ['development'].includes(process.env.NODE_ENV)
if (IS_PROD) {
  Vue.config.devtools = true
}
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
