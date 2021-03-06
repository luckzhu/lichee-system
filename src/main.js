import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import EleForm from 'vue-ele-form'

import EleFormUploadFile from 'vue-ele-form-upload-file'
Vue.component('upload-file', EleFormUploadFile)

import EleFormDynamic from 'vue-ele-form-dynamic'
Vue.component('dynamic', EleFormDynamic)

import LbTable from '@/components/LbTable'
Vue.component('LbTable', LbTable)

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

// 按钮级权限控制 v-permission="['admin']"
import permission from '@/directive/permission/index.js'
Vue.directive('permission', permission)

Vue.use(ElementUI, { size: 'small' })
Vue.use(EleForm)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
