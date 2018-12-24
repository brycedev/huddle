import Vue from 'vue'
import App from './App.vue'
import router from './router'
import stash from 'vue-stash'
import './registerServiceWorker'

Vue.config.productionTip = false
Vue.use(stash)
window.axios = require('axios')
window.blockstack = require('blockstack')

new Vue({
  data: () => ({
    store: {
      bus: new Vue(),
      isDev: process.env.NODE_ENV === "development",
      huddles: [],
      user: false
    }
  }),
  router,
  render: h => h(App)
}).$mount('#app')
