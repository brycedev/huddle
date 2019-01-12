require('setimmediate')
const isDev = process.env.NODE_ENV == 'development'
const dbPrefix = 'oapeiawegiawoe'

import Vue from 'vue'
import App from './App.vue'
import gun from 'vue-gun'

require('gun')
require('gun/lib/unset.js')
import router from './router'
import stash from 'vue-stash'
import meta from 'vue-meta'
import portal from 'portal-vue'
import tooltip from 'v-tooltip'

Vue.config.productionTip = false
// Vue.use(gun, { peers: [isDev ? 'http://localhost:8765/gun' : 'https://friend.huddle.group/gun'] })
Vue.use(gun)
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

window.seedDatabase = async () => {
  localStorage.clear()
  let huddles = []
  let publicObjs = [
    { id: uuid('huddle'), name: 'Crypto', description: 'We believe crypto will revolutionize the financial system. Join us and escape the noise of Twitter. Bring Satoshi with you!', hue: Math.floor(Math.random() * 357), background: `https://huddle.ams3.cdn.digitaloceanspaces.com/huddles/crypto.jpg`},
    { id: uuid('huddle'), name: 'Futurology', description: `Autonomous cars, robotic surgery, aritificial intelligence. Let's build the future together!`, hue: Math.floor(Math.random() * 357), background: 'https://huddle.ams3.cdn.digitaloceanspaces.com/huddles/futurology.jpg'},
    { id: uuid('huddle'), name: 'Fortnite', description: 'Tilted towers and battle royale; where are the winners at?', hue: Math.floor(Math.random() * 357), background: `https://huddle.ams3.cdn.digitaloceanspaces.com/huddles/fortnite.jpg` },
    { id: uuid('huddle'), name: 'Request For Product', description: 'New ideas are worth sharing. This is their home.', hue: Math.floor(Math.random() * 357), background: `https://huddle.ams3.cdn.digitaloceanspaces.com/huddles/rfp.jpg` },
    { id: uuid('huddle'), name: 'Health & Fitness', description: 'Kale, protein powder, gallon water jugs. Seriously though, come be fit with us!', hue: Math.floor(Math.random() * 357), background: `https://huddle.ams3.cdn.digitaloceanspaces.com/huddles/healthfitness.jpg` },
    { id: uuid('huddle'), name: 'Photography School', description: 'If you love capturing beautiful moments, this is the place for you!', hue: Math.floor(Math.random() * 357), background: `https://huddle.ams3.cdn.digitaloceanspaces.com/huddles/photographyschool.jpg` },
    { id: uuid('huddle'), name: 'We Love Dogs', description: `Do you also agree we don't deserve dogs? This is your home.`, hue: Math.floor(Math.random() * 357), background: `https://huddle.ams3.cdn.digitaloceanspaces.com/huddles/welovedogs.jpg` },
    { id: uuid('huddle'), name: 'Book Club', description: `Sex is cool and all, but have you ever read a good book and discussed it?`, hue: Math.floor(Math.random() * 357), background: `https://huddle.ams3.cdn.digitaloceanspaces.com/huddles/bookclub.jpg` },
    { id: uuid('huddle'), name: 'Best Travel Eats', description: `If your tastebuds guide your travels, come find the best places to eat around the world. Just don't salivate too much, please.`, hue: Math.floor(Math.random() * 357), background: `https://huddle.ams3.cdn.digitaloceanspaces.com/huddles/besttraveleats.jpg` },
    { id: uuid('huddle'), name: 'Indie Makers', description: `What are we cooking up today? Come meeet the other digital makers that just keep on shipping.`, hue: Math.floor(Math.random() * 357), background: `https://huddle.ams3.cdn.digitaloceanspaces.com/huddles/indiemakers.jpg` },
  ]
  publicObjs.forEach(o => {
    o.createdAt = Date.now()
    o.updatedAt = Date.now()
    o.type = 'public',
    o.isProposed = false
    o.isApproved = true
    o.slug = slug(o.name, { lower: true, replacement: '' })
  })
  let proposedObjs = [
    { id: uuid('huddle'), name: 'Study Buddies', description: 'We believe crypto will revolutionize the financial system. Join us and escape the noise of Twitter. Bring Satoshi with you!', hue: Math.floor(Math.random() * 357), background: `https://picsum.photos/1920x1080/?random=${Math.floor(Math.random() * 357)}`},
    { id: uuid('huddle'), name: 'Music Production', description: `Autonomous cars, robotic surgery, aritificial intelligence. Let's build the future together!`, hue: Math.floor(Math.random() * 357), background: `https://picsum.photos/1920x1080/?random=${Math.floor(Math.random() * 357)}`}
  ]
  proposedObjs.forEach(o => {
    o.createdAt = Date.now()
    o.updatedAt = Date.now()
    o.type = 'public',
    o.isProposed = true
    o.isApproved = false
    o.slug = slug(o.name, { lower: true, replacement: '' })
  })
  publicObjs.forEach(o => {
    huddles.push(o)
  })
  proposedObjs.forEach(o => {
    huddles.push(o)
  })
  return huddles
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