import Vue from 'vue'
import router from './router'
import store from '@/store' 
import '@/assets/common.css'
//导入element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
//导入axios
import myhttp from '@/plugins/http.js'

//使用插件
Vue.use(ElementUI)
 Vue.use(myhttp)

Vue.config.productionTip = false

// 富文本
import {quillEditor} from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.component('quillEditor',quillEditor)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
