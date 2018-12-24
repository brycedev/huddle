<template>
  <div id="app">
    <nav class="w-full fixed z-max subtle" style="height: 60px;" :class="{'bg-black' : scroll > 20}">
      <div class="container">
        <div class="flex justify-between items-center py-2">
          <router-link class="block no-underline" to="/">
            <img src="../src/assets/logo.svg" alt="Huddle logo" width="120">
          </router-link>
          <div class="flex flex-grow">
            <div class="mx-auto flex justify-center">
              <div class="flex -mb-px mr-6">
                  <router-link to="/#search" class="no-underline flex items-center py-4 text-white uppercase" active-class="active-link">
                      <img src="../src/assets/search.svg" alt="" width="14">
                  </router-link>
              </div>
              <div class="flex -mb-px mr-6">
                  <router-link to="/about" class="no-underline flex items-center py-4 text-white uppercase" active-class="active-link">
                      <span class="text-xs hover:opacity-100 opacity-75 cursor-pointer">About</span>
                  </router-link>
              </div>
              <div class="flex -mb-px mr-6">
                  <router-link to="/discover" class="no-underline flex items-center py-4 text-white uppercase" active-class="active-link">
                      <span class="text-xs hover:opacity-100 opacity-75 cursor-pointer">Discover</span>
                  </router-link>
              </div>
              <div class="flex -mb-px">
                  <router-link to="/random" class="no-underline flex items-center py-4 text-white uppercase" active-class="active-link">
                      <span class="text-xs hover:opacity-100 opacity-75 cursor-pointer">Random</span>
                  </router-link>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-full text-black text-center py-2 px-4 cursor-pointer" @click="user == null ? signIn : false">
            <span v-if="user == null">Login</span>
            <span v-else>{{ user.name }}</span>
          </div>
        </div>
      </div>
    </nav>
    <router-view/>
  </div>
</template>

<script>

export default {
  store: ['huddles', 'user'],
  data() {
    return {
      scroll: 0
    }
  },
  mounted(){
    document.addEventListener('scroll', e => {
      this.scroll = window.scrollY
    })
    for (let i = 0; i < 23; i++) {
      this.huddles.push({ id: i, hue: Math.floor(Math.random() * 357) + 0 })
    }
    if(blockstack.isUserSignedIn()) {
      const userData = blockstack.loadUserData()
      this.user = new blockstack.Person(userData.profile)
      this.user.name = userData.username
      this.user.avatar = this.user.avatarUrl() ? this.user.avatarUrl() : 'https://placehold.it/300x300'
      console.log(this.user)
    } else if (blockstack.isSignInPending()) {
      blockstack.handlePendingSignIn()
      .then((userData) => {
        window.location = window.location.origin
      })
    }
  },
  methods: {
    signIn () {
      const origin = window.location.origin
      blockstack.redirectToSignIn(origin, `${origin}/manifest.json`, ['scope_write', 'publish_data', 'email'])
    }
  },
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
</style>
