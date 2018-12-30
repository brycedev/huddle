require('setimmediate')
const isDev = process.env.NODE_ENV === "development"
const dbPrefix = 'awunebpieotzvtduc'
const huddleDb = `${dbPrefix}:huddles`
const userDb = `${dbPrefix}:users`

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import stash from 'vue-stash'
import portal from 'portal-vue'
import './util/registerServiceWorker'

Vue.config.productionTip = false
Vue.use(portal)
Vue.use(stash)
window.axios = require('axios')
window.blockstack = require('blockstack')
window.gun = { prefix: dbPrefix }
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
  let names = ['AMA', 'BillGuyTheScienceNye', 'Crypto', 'Vue.js', 'EarthPorn', 'Indie Makers', 'Fortnite', 'Celebrities']
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
    console.log('seedle huddle db: ', huddle.name)
    const newHuddle = shogun.get(`${gun.prefix}:huddles/${huddle.id}`).put(huddle)
    gun.huddles.set(newHuddle)
  })
}

window.updateGun = () => {
  let huddles = []
  let users = []
  gun.huddles.map().on(huddle => {
    huddles.push(huddle)
  })
  store.huddles = Array.from(new Set(huddles))
  if(store.huddles.length < 1 && isDev) seedDatabase()
  console.log('huddles : ', store.huddles)
  gun.users.map().on(user => {
    users.push(user)
  })
  store.users = Array.from(new Set(users))
  console.log('users : ', store.users)
}
window.bootGun = () => {
  return new Promise((resolve, reject) => {
    window.shogun = Gun()
    window.gun.huddles = shogun.get(huddleDb)
    window.gun.users = shogun.get(userDb)
    gun.huddles.on(() => { updateGun() })
    gun.users.on( () => { updateGun() })
    updateGun()
    resolve()
  })
}


bootGun().then(() => {
  new Vue({
    data: () => ({
      store: store
    }),
    router,
    render: h => h(App)
  }).$mount('#app')
})