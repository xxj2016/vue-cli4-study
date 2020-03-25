//  IE 兼容
import '@babel/polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import http from './utils/request'
Vue.prototype.http = http
// 引入全局样式
import '@/assets/css/index.scss'

// 全局引入按需引入UI库 vant
import '@/plugins/vant'

// 移动端适配
import 'lib-flexible/flexible.js'

// filters
import './filters'
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
