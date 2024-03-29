import Vue from 'vue'

import Cookies from 'js-cookie'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import Element from 'element-ui'
import basicContainer from './components/basic-container/main'
import api from './http'
// import 'element-ui/lib/theme-chalk/index.css'
import '../theme/index.css'
import '@/styles/index.scss' // global css
import 'animate.css'

import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog' // error log
import './permission' // permission control
import * as filters from './filters' // global filters
import { hasPermission } from '@/utils/permission'
Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(api)
// 注册全局容器
Vue.component('basicContainer', basicContainer)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
Vue.prototype.hasPermission = hasPermission

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
