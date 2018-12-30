<template>
  <div id="app" class="min-h-screen bg-khak-grey">
    <portal-target name="modal">

    </portal-target>
    <nav class="w-full fixed z-max subtle" :class="{'bg-black' : scroll > 32}">
      <div class="container">
        <div class="flex justify-between items-center py-2">
          <router-link class="block no-underline" to="/">
            <img src="../src/assets/logo.svg" alt="Huddle logo" width="120">
          </router-link>
          <div class="flex flex-grow">
            <div class="mx-auto flex justify-center">
              <div class="flex -mb-px mr-6">
                <router-link to="/#search" class="no-underline flex items-center text-white uppercase" active-class="active-link">
                  <img src="../src/assets/search.svg" alt="" width="14">
                </router-link>
              </div>
              <div class="flex -mb-px mr-6">
                <router-link to="/about" class="no-underline flex items-center text-white uppercase hover:opacity-100 opacity-75" active-class="opacity-100">
                  <span class="text-xs cursor-pointer">About</span>
                </router-link>
              </div>
              <div class="flex -mb-px mr-6">
                <router-link to="/discover" class="no-underline flex items-center text-white uppercase hover:opacity-100 opacity-75" active-class="opacity-100">
                  <span class="text-xs cursor-pointer">Discover</span>
                </router-link>
              </div>
              <div class="flex -mb-px">
                <router-link :to="randomSlug" class="no-underline flex items-center text-white uppercase hover:opacity-100 opacity-75">
                  <span class="text-xs cursor-pointer">Random</span>
                </router-link>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-full text-black text-center py-2 px-4 cursor-pointer flex items-center" @click="!user ? signIn() : logout()">
            <span v-if="!user">Login</span>
            <img v-if="user" class="w-6 h-6 rounded-full mr-2" :src="user.avatar"/>
            <span v-if="user">{{ user.name.replace('.id.blockstack','') }}</span>
          </div>
        </div>
      </div>
    </nav>
    <router-view/>
    
  </div>
</template>

<script>
export default {
  store: ['huddles', 'user', 'users'],
  data() {
    return {
      random: 0,
      scroll: 0
    }
  },
  computed: {
    randomSlug(){
      return this.eligibleRandomSlugs.length > 0
        ? `/h/${this.eligibleRandomSlugs[Math.floor(Math.random() * this.eligibleRandomSlugs.length)].slug}`
        : '#'
    },
    eligibleRandomSlugs(){
      if(this.$route.name == 'Huddle'){
        return this.huddles.filter(h => h.slug !== this.$route.params.slug)
      }
      return this.huddles
    }
  },
  mounted(){
    this.random = Math.floor(Math.random() * this.huddles.length)
    document.addEventListener('scroll', e => {
      this.scroll = window.scrollY
    })
    setTimeout(async () => {
      await this.checkUser()
    })
  },
  methods: {
    async checkUser(){
      if(blockstack.isUserSignedIn()) {
        const userData = blockstack.loadUserData()
        await this.setUser(userData)
      } else if (blockstack.isSignInPending()) {
        blockstack.handlePendingSignIn().then(async (userData) => {
          await this.setUser(userData)
          this.$router.push('/')
        })
      }
    },
    logout () {
      blockstack.signUserOut(window.location.origin)
    },
    setUser(data){
      return new Promise(async (resolve, reject) => {
        this.user = new blockstack.Person(data.profile)
        this.user.id = data.identityAddress
        this.user.name = data.username
        this.user.avatar = this.user.avatarUrl() ? this.user.avatarUrl() : 'https://placehold.it/300x300'
        // check to see if the user exists
        if(!this.users.find(u => u.id == this.user.id)){
          console.log('instantiating user : ', this.user.name)
          // add user to the decentralized gundb instance
          const identity = { id: this.user.id, name: this.user.name, avatar: this.user.avatar }
          const newUser = shogun.get(`${gun.prefix}:users/${this.user.id}`).put(identity)
          gun.users.set(newUser)
          // configure the user's gaia storage
          this.user.preferences = {
            blockedUsers : [],
            hideNSFW: true,
            mutedWords : []
          }
          const newPrefs = JSON.stringify(this.user.preferences)
          await blockstack.putFile('preferences.json', newPrefs, { encrypt : true })
          resolve()
        } else {
          console.log('loading user : ', this.user.name)
          // user exists, so load their gaia storage
          blockstack.getFile('preferences.json', { decrypt: true })
          .then(prefs => {
            this.user.preferences = JSON.parse(prefs)
            resolve()
          }).catch(err => reject(err))
        }
      })
    },
    signIn () {
      const origin = window.location.origin
      blockstack.redirectToSignIn()
      // blockstack.redirectToSignIn(origin, origin + '/manifest.json', ['scope_write', 'publish_data'])
    }
  }
}
</script>

<style lang="stylus">
@tailwind preflight;
@tailwind components;
@tailwind utilities;

body
  font-weight 300
  font-family 'Nunito', sans-serif

.break
  word-break break-word
.subtle
  transition all .27s ease
.scale
  &:hover
    transform scale(1.01)
.centercenter
  background-position center center
.spin
  animation-name spin
  animation-duration 5000ms
  animation-iteration-count infinite
  animation-timing-function linear

@keyframes spin
  from
    transform:rotate(0deg)
  to
    transform:rotate(360deg)

.canvas 
  background-image: url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm33.414-6l5.95-5.95L45.95.636 40 6.586 34.05.636 32.636 2.05 38.586 8l-5.95 5.95 1.414 1.414L40 9.414l5.95 5.95 1.414-1.414L41.414 8zM40 48c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM9.414 40l5.95-5.95-1.414-1.414L8 38.586l-5.95-5.95L.636 34.05 6.586 40l-5.95 5.95 1.414 1.414L8 41.414l5.95 5.95 1.414-1.414L9.414 40z' fill='%23ffffff' fill-opacity='0.047' fill-rule='evenodd'/%3E%3C/svg%3E");
</style>
