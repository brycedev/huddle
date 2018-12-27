const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')
const isDev = process.env.NODE_ENV === "development"

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import stash from 'vue-stash'
import './util/registerServiceWorker'

Vue.config.productionTip = false
Vue.use(stash)
window.axios = require('axios')
window.blockstack = require('blockstack')
window.updateIpfs = () => {
  return new Promise(async (resolve, reject) => {
    window.db.huddles.all = db.huddles.instance.query(doc => true)
    window.db.users.all = db.users.instance.query(doc => true)
    // console.log('huddles :', db.huddles.instance.address.toString())
    // console.log('users :', db.users.instance.address.toString())
    console.log('huddles : ', db.huddles.all)
    console.log('users : ', db.users.all)
    resolve()
  })
}
window.bootIpfs = () => {
  return new Promise(async (resolve, reject) => {
    const ipfs = new IPFS({
      repo: 'ipfs/shared/',
      config: {
        "Bootstrap": []
      },
      EXPERIMENTAL: {
        pubsub: true
      }
    })
    ipfs.on('error', (e) => reject(e))
    ipfs.once('ready', async () => {
      window.orbitdb = new OrbitDB(ipfs)
      window.db = {
        huddles: {},
        users: {}
      }
      window.db.huddles.instance = await orbitdb.docstore('hdl.huddles', { indexBy: 'id' })
      window.db.users.instance = await orbitdb.docstore('hdl.users')
      await db.huddles.instance.load()
      await db.users.instance.load()
      await updateIpfs()
      resolve()
    })
  })
}
window.slug = require('slug')

bootIpfs().then(() => {
  new Vue({
    data: () => ({
      store: {
        bus: new Vue(),
        isDev: isDev,
        user: false
      }
    }),
    router,
    render: h => h(App)
  }).$mount('#app')
})