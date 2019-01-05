require('setimmediate')
const isDev = window.location.host !== "huddle.group"
const dbPrefix = 'aeg389807tex'

import Vue from 'vue'
import App from './App.vue'
import gun from 'vue-gun'
import router from './router'
import stash from 'vue-stash'
import portal from 'portal-vue'
import tooltip from 'v-tooltip'
import './util/registerServiceWorker'

Vue.config.productionTip = false
Vue.use(gun)
Vue.use(portal)
Vue.use(stash)
Vue.use(tooltip, {
  defaultHideOnTargetClick: false,
  popover: {
    defaultPlacement: 'top'
  }
})
window.axios = require('axios')
window.blockstack = require('blockstack')
window.gunPrefix = dbPrefix
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
};

const store = {
  bus: new Vue(),
  huddles: [],
  isDev: isDev,
  user: false,
  users: []
}

window.seedDatabase = () => {
  localStorage.clear()
  let huddles = []
  let publicObjs = [
    { id: uuid('huddle'), name: 'Crypto', description: 'We believe crypto will revolutionize the financial system. Join us and escape the noise of Twitter. Bring Satoshi with you!', hue: Math.floor(Math.random() * 357), background: `https://picsum.photos/1920x1080/?random=${Math.floor(Math.random() * 357)}`},
    { id: uuid('huddle'), name: 'Futurology', description: `Autonomous cars, robotic surgery, aritificial intelligence. Let's build the future together!`, hue: Math.floor(Math.random() * 357), background: `https://picsum.photos/1920x1080/?random=${Math.floor(Math.random() * 357)}`},
    { id: uuid('huddle'), name: 'Fortnite', description: 'Tilted towers and battle royale; where are the winners at?', hue: Math.floor(Math.random() * 357), background: `https://picsum.photos/1920x1080/?random=${Math.floor(Math.random() * 357)}` },
    { id: uuid('huddle'), name: 'Request For Product', description: 'New ideas are worth sharing. This is their home.', hue: Math.floor(Math.random() * 357), background: `https://picsum.photos/1920x1080/?random=${Math.floor(Math.random() * 357)}` },
    { id: uuid('huddle'), name: 'Health & Fitness', description: 'Kale, protein powder, gallon water jugs. Seriously though, come be fit with us!', hue: Math.floor(Math.random() * 357), background: `https://picsum.photos/1920x1080/?random=${Math.floor(Math.random() * 357)}` },
    { id: uuid('huddle'), name: 'Photography School', description: 'If you love capturing beautiful moments, this is the place for you!', hue: Math.floor(Math.random() * 357), background: `https://picsum.photos/1920x1080/?random=${Math.floor(Math.random() * 357)}` },
    { id: uuid('huddle'), name: 'We Love Dogs', description: `Do you also agree we don't deserve dogs? This is your home.`, hue: Math.floor(Math.random() * 357), background: `https://picsum.photos/1920x1080/?random=${Math.floor(Math.random() * 357)}` },
    { id: uuid('huddle'), name: 'Book Club', description: `Sex is cool and all, but have you ever read a good book and discussed it?`, hue: Math.floor(Math.random() * 357), background: `https://picsum.photos/1920x1080/?random=${Math.floor(Math.random() * 357)}` },
    { id: uuid('huddle'), name: 'Best Travel Eats', description: `If your tastebuds guid your travels, come find the best places to eat around the world. Just don't salivate too much, please.`, hue: Math.floor(Math.random() * 357), background: `https://picsum.photos/1920x1080/?random=${Math.floor(Math.random() * 357)}` },
    { id: uuid('huddle'), name: 'Indie Makers', description: `What are we cooking up today? Come meeet the other digital makers that just keep on shipping.`, hue: Math.floor(Math.random() * 357), background: `https://picsum.photos/1920x1080/?random=${Math.floor(Math.random() * 357)}` },
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

new Vue({
  data: () => ({
    store: store
  }),
  router,
  render: h => h(App)
}).$mount('#app')