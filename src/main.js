require('setimmediate')
const isDev = window.location.host !== "huddle.group"
const dbPrefix = 'aewphauwua'

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
  const names = ['AMA', 'BillGuyTheScienceNye', 'Crypto', 'Vue.js', 'EarthPorn', 'Indie Makers', 'Fortnite', 'Celebrities', 'HuddleHQ', 'Music Production', 'Study Buddies', 'Chess Club', 'Futurology', 'New Year Resolutions']
  const proposed = ['Music Production', 'Study Buddies']
  const hybrid = ['HuddleHQ']
  let huddles = []
  names.forEach(n => {
    let huddle = {
      id: uuid('huddle'),
      hue: Math.floor(Math.random() * 357),
      name: n,
      description: `You're a very talented young man, with your own clever thoughts and ideas. Do you need a manager? Do you have any idea how long it takes those cups to decompose. You're a very talented young man, with your own clever thoughts and ideas. Do you need a manager?`,
      type: hybrid.includes(n) ? 'hybrid' : 'public',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      background: n == 'HuddleHQ' ? 'https://huddle.group/cover.jpg' : `https://picsum.photos/1920x1080/?random=${Math.floor(Math.random() * 357)}`,
      isProposed: proposed.includes(n),
      isApproved: !proposed.includes(n),
      slug: slug(n, { lower: true, replacement: '' })
    }
    huddles.push(huddle)
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