<template>
  <div id="app" class="min-h-screen bg-khak-grey">
    <nav class="w-full fixed z-max subtle" style="height: 60px;" :class="{'bg-black' : scroll > 20}">
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
                <router-link :to="randomSlug" class="no-underline flex items-center text-white uppercase hover:opacity-100 opacity-75" active-class="opacity-100">
                  <span class="text-xs cursor-pointer">Random</span>
                </router-link>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-full text-black text-center py-2 px-4 cursor-pointer flex items-center" @click="!user ? signIn() : logout()">
            <span v-if="!user">Login</span>
            <img v-if="user" class="w-6 h-6 rounded-full mr-2" :src="user.avatar"/>
            <span v-if="user">{{ user.name }}</span>
          </div>
        </div>
      </div>
    </nav>
    <router-view/>
  </div>
</template>

<script>
export default {
  store: ['user'],
  data() {
    return {
      random: 0,
      scroll: 0
    }
  },
  computed: {
    huddles(){
      return window.db.huddles.all
    },
    randomSlug(){
      return this.huddles.length > 0
        ? `/h/${this.huddles[this.random].slug}`
        : '/'
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
    async setUser(data){
      this.user = new blockstack.Person(data.profile)
      this.user.id = data.identityAddress
      this.user.name = data.username
      this.user.avatar = this.user.avatarUrl() ? this.user.avatarUrl() : 'https://placehold.it/300x300'
      const users = window.db.users.all
      if(!users.find(u => u.id == this.user.id)){
        console.log('adding user to orbit: ', this.user.id)
        await window.db.users.instance.put({ id: this.user.id })
      }
      await updateIpfs()
    },
    signIn () {
      const origin = 'http://localhost:8080/'
      blockstack.redirectToSignIn()
      // blockstack.redirectToSignIn(origin, origin + 'manifest.json', ['scope_write', 'publish_data'])
    }
  },
  watch: {
    $route(){
      this.random = Math.floor(Math.random() * this.huddles.length)
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

.subtle
  transition all .27s ease

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
</style>
