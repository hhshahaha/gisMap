import Vue from 'vue'
import App from './index.vue'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
Vue.prototype.$axios = axios
Vue.config.productionTip = false
new Vue({
  el: '#app',
  render: h => h(App)
})
