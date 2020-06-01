import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import EleForm from 'vue-ele-form'

import EleFormUploadFile from 'vue-ele-form-upload-file'
Vue.component('upload-file', EleFormUploadFile)

import LbTable from '@/components/LbTable'
Vue.component('LbTable', LbTable)

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

// // 按钮级权限控制 v-permission="['admin']"
// import permission from '@/directive/permission/index.js'
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

Vue.use(ElementUI, { size: 'small' })
Vue.use(EleForm)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
