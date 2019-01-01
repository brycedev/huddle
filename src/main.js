require('setimmediate')
const isDev = window.location.host !== "huddle.group"
const dbPrefix = 'gayktykrtylrtylt'

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

const store = {
  bus: new Vue(),
  huddles: [],
  isDev: isDev,
  user: false,
  users: []
}

window.seedDatabase = () => {
  localStorage.clear()
  const names = ['AMA', 'BillGuyTheScienceNye', 'Crypto', 'Vue.js', 'EarthPorn', 'Indie Makers', 'Fortnite', 'Celebrities']
  let huddles = []
  names.forEach(n => {
    let huddle = {
      id: uuid('huddle'),
      hue: Math.floor(Math.random() * 357),
      name: n,
      description: `You're a very talented young man, with your own clever thoughts and ideas. Do you need a manager? Do you have any idea how long it takes those cups to decompose. You're a very talented young man, with your own clever thoughts and ideas. Do you need a manager?`,
      type: 'public',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      background: `https://picsum.photos/1920x1080/?random=${Math.floor(Math.random() * 357)}`,
      isProposed: false,
      isApproved: true,
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