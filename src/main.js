require('setimmediate')
const isDev = window.location.host !== "huddle.group"
const dbPrefix = 'aegaewgaewhaehaerh'

import Vue from 'vue'
import App from './App.vue'
import gun from 'vue-gun'
import router from './router'
import stash from 'vue-stash'
import portal from 'portal-vue'
import './util/registerServiceWorker'

Vue.config.productionTip = false
Vue.use(gun)
Vue.use(portal)
Vue.use(stash)
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
    { id: uuid('huddle'), name: 'Crypto', description: 'We believe crypto will revolutionize the financial system. Join us and escape the noise of Twitter. Bring Satoshi with you!', hue: 10, background: ''},
    { id: uuid('huddle'), name: 'Futurology', description: `Autonomous cars, robotic surgery, aritificial intelligence. Let's build the future together!`, hue: 10, background: `https://picsum.photos/1920x1080/?random=${Math.floor(Math.random() * 357)}`},
    { id: uuid('huddle'), name: 'Fortnite', description: 'Tilted towers and battle royale; where are the winners at?', hue: 10, background: `https://picsum.photos/1920x1080/?random=${Math.floor(Math.random() * 357)}` },
    { id: uuid('huddle'), name: 'Request For Product', description: 'New ideas are worth sharing. This is their home.', hue: 10, background: `https://picsum.photos/1920x1080/?random=${Math.floor(Math.random() * 357)}` },
    { id: uuid('huddle'), name: 'Health & Fitness', description: 'Kale, protein powder, gallon water jugs. Seriously though, come be fit with us!', hue: 10, background: `https://picsum.photos/1920x1080/?random=${Math.floor(Math.random() * 357)}` },
    { id: uuid('huddle'), name: 'Photography School', description: 'If you love capturing beautiful moments, this is the place for you!', hue: 10, background: `https://picsum.photos/1920x1080/?random=${Math.floor(Math.random() * 357)}` },
    { id: uuid('huddle'), name: 'We Love Dogs', description: `Do you also agree we don't deserve dogs? This is your home.`, hue: 10, background: `https://picsum.photos/1920x1080/?random=${Math.floor(Math.random() * 357)}` },
    { id: uuid('huddle'), name: 'Book Club', description: `Sex is cool and all, but have you ever read a good book and discussed it?`, hue: 10, background: `https://picsum.photos/1920x1080/?random=${Math.floor(Math.random() * 357)}` },
    { id: uuid('huddle'), name: 'Best Travel Eats', description: `If your tastebuds guid your travels, come find the best places to eat around the world. Just don't salivate too much, please.`, hue: 10, background: `https://picsum.photos/1920x1080/?random=${Math.floor(Math.random() * 357)}` },
    { id: uuid('huddle'), name: 'Indie Makers', description: `What are we cooking up today? Come meeet the other digital makers that just keep on shipping.`, hue: 10, background: `https://picsum.photos/1920x1080/?random=${Math.floor(Math.random() * 357)}` },
  ]
  publicObjs.forEach(o => {
    o.createdAt = Date.now()
    o.updatedAt = Date.now()
    o.type = 'public',
    o.isProposed = false
    o.isApproved = true
    o.slug = slug(o.name, { lower: true, replacement: '' })
  })
  const names = ['AMA', 'BillGuyTheScienceNye', 'Crypto', 'Vue.js', 'EarthPorn', 'Indie Makers', 'Fortnite', 'Celebrities', 'HuddleHQ', 'Music Production', 'Study Buddies', 'Chess Club', 'Futurology', 'New Year Resolutions']
  const proposed = ['Music Production', 'Study Buddies']
  const hybrid = ['HuddleHQ']
  huddles = publicObjs
  // let huddles = []
  // names.forEach(n => {
  //   let huddle = {
  //     id: uuid('huddle'),
  //     hue: Math.floor(Math.random() * 357),
  //     name: n,
  //     description: `You're a very talented young man, with your own clever thoughts and ideas. Do you need a manager? Do you have any idea how long it takes those cups to decompose. You're a very talented young man, with your own clever thoughts and ideas. Do you need a manager?`,
  //     type: hybrid.includes(n) ? 'hybrid' : 'public',
  //     createdAt: Date.now(),
  //     updatedAt: Date.now(),
  //     background: n == 'HuddleHQ' ? 'https://huddle.group/cover.jpg' : `https://picsum.photos/1920x1080/?random=${Math.floor(Math.random() * 357)}`,
  //     isProposed: proposed.includes(n),
  //     isApproved: !proposed.includes(n),
  //     slug: slug(n, { lower: true, replacement: '' })
  //   }
  //   huddles.push(huddle)
  // })
  return huddles
}

new Vue({
  data: () => ({
    store: store
  }),
  router,
  render: h => h(App)
}).$mount('#app')