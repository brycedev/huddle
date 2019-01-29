require('setimmediate')
window.isDev = process.env.NODE_ENV == 'development'
const dbPrefix = isDev ? 'awawekj.ke' : 'test123'

import Vue from 'vue'
import App from './App.vue'
import gun from 'vue-gun'

window.Vue = Vue
window.jeffsum = require('jeffsum')
require('gun')
require('gun/lib/unset')
require('gun/lib/radix')
require('gun/lib/radisk')
require('gun/lib/store')
require('gun/lib/rindexed')
require('gun/sea')
import router from './router'
import stash from 'vue-stash'
import meta from 'vue-meta'
import portal from 'portal-vue'
import tooltip from 'v-tooltip'

Vue.config.productionTip = false
Vue.use(gun, { 
  peers: isDev ? 'http://localhost:8765/gun' : 'https://friend.huddle.group/gun',
  store: RindexedDB({})
})
Vue.use(meta)
Vue.use(portal)
Vue.use(stash)
Vue.use(tooltip, { defaultHideOnTargetClick: false,
  popover: {
    defaultPlacement: 'top'
  }
})
window.axios = require('axios')
window.blockstack = require('blockstack')
window.gunPrefix = dbPrefix
window.linkifyHtml = require('linkifyjs/html')
window.progress = require('nprogress')
window.slug = require('slug')
window.uuid = ((a, b) => {
  for (b = a = ''; a++ < 36; b += a * 51 & 52 ? (a ^ 15 ? 8 ^ Math.random() * (a ^ 20 ? 16 : 4) : 4).toString(16) : '-');
  return b.replace(/-/g, "")
})
window.later = (delay, value) => {
  let timer = 0;
  let reject = null;
  const promise = new Promise((resolve, _reject) => {
      reject = _reject;
      timer = setTimeout(resolve, delay, value);
  });
  return {
    get promise() { return promise },
    cancel() {
      if (timer) {
        clearTimeout(timer);
        timer = 0;
        reject();
        reject = null;
      }
    }
  };
}

window.entryRoute = ''

const store = {
  bus: new Vue(),
  huddles: [],
  isDev: isDev,
  user: false,
  users: []
}

let firstBoot = true

progress.configure({ showSpinner: false, color: '#fff' })
router.beforeEach((to, from, next) => {
  progress.start()
  if(!from.name && firstBoot && blockstack.isUserSignedIn()) {
    // must be first boot, set intended route
    window.entryRoute = to.fullPath
    firstBoot = false
    next({ path: '/welcome' })
  } else {
    next()
  }
  next()
})

router.afterEach((to, from) => {
  progress.done()
})

new Vue({
  data: () => ({
    store: store
  }),
  router,
  render: h => h(App)
}).$mount('#app')