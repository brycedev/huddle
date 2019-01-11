<template>
  <div id="app" class="min-h-screen bg-khak-grey flex flex-col">
    <portal-target name="modal"></portal-target>
    <nav class="w-full fixed z-max subtle" :class="{'bg-black' : scroll > 32}">
      <div class="container px-6 sm:px-0">
        <div class="flex justify-between items-center py-3 px-2">
          <router-link class="sm:block no-underline hidden" to="/">
            <img src="../src/assets/logo.svg" alt="Huddle logo" width="120">
          </router-link>
          <router-link class="sm:hidden block no-underline" to="/">
            <img src="../src/assets/logomark-white.png" alt="Huddle logo" width="35">
          </router-link>
          <div class="hidden sm:block">
            <div class="flex mx-auto self-center">
              <!-- <div class="flex -mb-px mr-6">
                <router-link to="/#search" class="no-underline flex items-center text-white uppercase" active-class="active-link">
                  <img src="../src/assets/search.svg" alt="" width="14">
                </router-link>
              </div> -->
              <div class="flex -mb-px mr-6">
                <router-link to="/discover" class="no-underline flex items-center text-white uppercase hover:opacity-100 opacity-75" active-class="opacity-100">
                  <span class="text-xs cursor-pointer">Discover</span>
                </router-link>
              </div>
              <div class="flex -mb-px mr-6">
                <router-link :to="randomSlug" class="no-underline flex items-center text-white uppercase hover:opacity-100 opacity-75">
                  <span class="text-xs cursor-pointer">Random</span>
                </router-link>
              </div>
              <div class="flex -mb-px">
                <router-link to="/about" class="no-underline flex items-center text-white uppercase hover:opacity-100 opacity-75" active-class="opacity-100">
                  <span class="text-xs cursor-pointer">About</span>
                </router-link>
              </div>
            </div>
          </div>
          <div class="relative bg-white rounded-full text-black text-center py-2 px-4 cursor-pointer flex items-center" @click="signIn()" v-if="!user" v-tooltip.left="'Try the testnet!'">Login</div>
          <div class="relative" v-if="user">
            <div class="bg-white rounded-full text-black text-center py-2 px-4 flex items-center cursor-pointer" @click="toggleDropdown">
              <img class="w-6 h-6 rounded-full mr-2 z-50" :src="user.avatar"/>
              <span class="z-50">{{ user.username ? user.username : user.bi }}</span>
            </div>
            <div class="absolute pin-t w-40 pin-r mt-14 flex flex-col items-center subtle opacity-0" :class="{ 'opacity-100' : showDropdown, 'pointer-events-none' : !showDropdown }">
              <router-link :to="`/i/${this.user.username}`" class="no-underline text-black block w-full">
                <div class="flex items-center mb-4 justify-center bg-white shadow-md py-2 px-4 rounded-full w-full cursor-pointer">
                  <img class="mr-2" width="20" src="../src/assets/user-circle.svg"/>
                  <span>Profile</span>
                </div>
              </router-link>
              <router-link to="/settings" class="no-underline text-black block w-full">
                <div class="flex items-center mb-4 justify-center bg-white shadow-md py-2 px-4 rounded-full w-full cursor-pointer">
                  <img class="mr-2" width="20" src="../src/assets/cogs.svg"/>
                  <span>Settings</span>
                </div>
              </router-link>
              <div class="flex items-center justify-center bg-huddle-blue shadow-md text-white py-2 px-4 rounded-full w-full cursor-pointer" @click="logout()">
                <img class="mr-2" width="20" src="../src/assets/logout-white.svg"/>
                <span>Logout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <router-view ref="currentChild"/>
    <footer class="bg-black py-8 w-full mt-8">
      <div class="container mx-auto px-6">
        <div class="flex flex-col sm:items-start sm:flex-row w-full justify-center">
          <img src="../src/assets/logomark-white.png" class="self-start mr-4 md:mr-12 mb-8 md:mb-0" alt="Huddle logo" width="35">
          <div class="block sm:table-cell mr-4 md:mr-12 mb-8 md:mb-0">
            <p class="no-underline flex items-center text-white uppercase opacity-75 text-xs mb-4">Community</p>
            <ul class="list-reset text-xs mb-6">
              <li class="mt-3 inline-block mr-2 sm:block sm:mr-0">
                <a href="mailto:support@huddle.group" class="text-white opacity-75 hover:opacity-100 no-underline">Support</a>
              </li>
              <li class="mt-3 inline-block mr-2 sm:block sm:mr-0">
                <a href="https://twitter.com/itshuddletime" target="_blank" class="text-white opacity-75 hover:opacity-100 no-underline">Twitter</a>
              </li>
            </ul>
          </div>        
          <div class="block sm:table-cell mr-4 md:mr-12 mb-8 md:mb-0">
            <p class="no-underline flex items-center text-white uppercase opacity-75 text-xs mb-4">Legal</p>
            <ul class="list-reset text-xs mb-6">
              <li class="mt-3 inline-block mr-2 sm:block sm:mr-0">
                <a href="#" class="text-white opacity-75 hover:opacity-100 no-underline">Terms</a>
              </li>
              <li class="mt-3 inline-block mr-2 sm:block sm:mr-0">
                <a href="#" class="text-white opacity-75 hover:opacity-100 no-underline">Privacy</a>
              </li>
            </ul>
          </div>
          <p class="no-underline flex items-center text-white uppercase opacity-75 text-xs self-start">&copy; {{ (new Date).getFullYear()}}</p>
        </div>
      </div>
  </footer>
  </div>
</template>

<script>
export default {
  store: ['bus', 'isDev', 'huddles', 'user', 'users'],
  data() {
    return {
      scroll: 0,
      showDropdown: false,
    }
  },
  computed: {
    randomSlug(){
      return this.eligibleRandomSlugs.length > 0
        ? `/h/${this.eligibleRandomSlugs[Math.floor(Math.random() * this.eligibleRandomSlugs.length)].slug}`
        : '#'
    },
    eligibleRandomSlugs(){
      if(['HuddlePublic', 'HuddlePrivate'].includes(this.$route.name)){
        return this.huddles.filter(h => h.slug !== this.$route.params.slug && h.type == 'public' && h.isApproved)
      }
      return this.huddles.filter(h => h.type == 'public' && h.isApproved)
    }
  },
  created(){
    this.instantiateGun()
  },
  mounted(){
    document.addEventListener('scroll', e => {
      this.scroll = window.scrollY
    })
  },
  methods: {
    toggleDropdown(){
      this.showDropdown = !this.showDropdown
    },
    instantiateGun(){
      this.$gun.get(`${gunPrefix}:huddles`).once(async v => {
        if(typeof(v) == 'undefined') await this.seedData()
      })
      this.$gun.get(`${gunPrefix}:huddles`).map().on((node, key) => {
        this.huddles.push(node)
        this.huddles = Array.from(new Set(this.huddles))
      })
      this.$gun.get(`${gunPrefix}:users`).map().on((node, key) => {
        this.users.push(node)
        this.users = Array.from(new Set(this.users))
      })
    },
    async seedData(){
      (await seedDatabase()).forEach(h => {
        const newHuddle = this.$gun.get(`${gunPrefix}:huddles/${h.id}`).put(h)
        this.$gun.get(`${gunPrefix}:huddles`).set(newHuddle)
      })
    },
    logout () {
      blockstack.signUserOut(window.location.origin)
    },
    putUser(data){
      return new Promise(async (resolve, reject) => {
        this.user = new blockstack.Person(data.profile)
        this.user.bi = data.username
        this.user.id = data.identityAddress
        this.user.avatar = this.user.avatarUrl() ? this.user.avatarUrl() : 'https://placehold.it/300x300'
        const exist = this.users.find(u => u.id === this.user.id)
        exist ? this.user.username = exist.username : data.username
        await this.loadGaia()
        resolve()
      })
    },
    loadGaia(){
      return new Promise(async(resolve, reject) => {
        if(this.isDev) console.log('loading user gaia storage: ', this.user.username)
        // user exists, load their gaia storage
        this.user.preferences = JSON.parse(await blockstack.getFile('preferences.json', { decrypt: true }))
        if(this.user.preferences && this.user.preferences.isPublic){
          this.user.username = this.user.preferences.username
          this.user.publicHuddles = JSON.parse(await blockstack.getFile('publicHuddles.json', { decrypt: false }))
          this.user.publicPosts = JSON.parse(await blockstack.getFile('publicPosts.json', { decrypt: false }))
          this.user.publicComments = JSON.parse(await blockstack.getFile('publicComments.json', { decrypt: false }))
          this.user.publicLibrary = JSON.parse(await blockstack.getFile('publicLibrary.json', { decrypt: false }))
        }
        const tempHuddles = []
        const privHuddles = JSON.parse(await blockstack.getFile('privateHuddles.json', { decrypt: true }))
        privHuddles.forEach(h => {
          blockstack.getFile(`privateHuddles/${h}.json`, { decrypt: true })
          .then(file => {
            tempHuddles.push(JSON.parse(file))
          })
        })
        this.user.privateHuddles = tempHuddles
        this.user.privatePosts = JSON.parse(await blockstack.getFile('privatePosts.json', { decrypt: true }))
        this.user.privateComments = JSON.parse(await blockstack.getFile('privateComments.json', { decrypt: true }))
        this.user.privateLibrary = JSON.parse(await blockstack.getFile('privateLibrary.json', { decrypt: true }))
        resolve()
      })
      
    },
    signIn() {
      const origin = window.location.origin
      const date = new Date()
      date.setHours(date.getHours() + 1)
      const authRequest = blockstack.makeAuthRequest(
        blockstack.generateAndStoreTransitKey(),
        `${origin}/welcome`,
        `${origin}/manifest.json`,
        ['store_write', 'publish_data'],
        origin,
        date,
        { solicitGaiaHubUrl: true }
      )
      blockstack.redirectToSignInWithAuthRequest(authRequest)
    }
  },
  watch: {
    $route(){
      if(this.showDropdown) this.showDropdown = false
      this.loadGaia()
    },
    user(value){
      if(value) this.loadGaia()
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
  background-size cover
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
  background-image url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm33.414-6l5.95-5.95L45.95.636 40 6.586 34.05.636 32.636 2.05 38.586 8l-5.95 5.95 1.414 1.414L40 9.414l5.95 5.95 1.414-1.414L41.414 8zM40 48c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM9.414 40l5.95-5.95-1.414-1.414L8 38.586l-5.95-5.95L.636 34.05 6.586 40l-5.95 5.95 1.414 1.414L8 41.414l5.95 5.95 1.414-1.414L9.414 40z' fill='%23ffffff' fill-opacity='0.047' fill-rule='evenodd'/%3E%3C/svg%3E");
</style>

<style>
/* Make clicks pass-through */
#nprogress {
  pointer-events: none;
}

#nprogress .bar {
  background: #5F91D6;

  position: fixed;
  z-index: 1031;
  top: 0;
  left: 0;

  width: 100%;
  height: 2px;
}

/* Fancy blur effect */
#nprogress .peg {
  display: block;
  position: absolute;
  right: 0px;
  width: 100px;
  height: 100%;
  box-shadow: 0 0 10px #5F91D6, 0 0 5px #5F91D6;
  opacity: 1.0;

  -webkit-transform: rotate(3deg) translate(0px, -4px);
      -ms-transform: rotate(3deg) translate(0px, -4px);
          transform: rotate(3deg) translate(0px, -4px);
}

/* Remove these to get rid of the spinner */
#nprogress .spinner {
  display: block;
  position: fixed;
  z-index: 1031;
  top: 15px;
  right: 15px;
}

#nprogress .spinner-icon {
  width: 18px;
  height: 18px;
  box-sizing: border-box;

  border: solid 2px transparent;
  border-top-color: #5F91D6;
  border-left-color: #5F91D6;
  border-radius: 50%;

  -webkit-animation: nprogress-spinner 400ms linear infinite;
          animation: nprogress-spinner 400ms linear infinite;
}

.nprogress-custom-parent {
  overflow: hidden;
  position: relative;
}

.nprogress-custom-parent #nprogress .spinner,
.nprogress-custom-parent #nprogress .bar {
  position: absolute;
}

@-webkit-keyframes nprogress-spinner {
  0%   { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}
@keyframes nprogress-spinner {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}


.tooltip {
  display: block !important;
  z-index: 9999999999999999;
}

.tooltip .tooltip-inner {
  background: #5F91D6;
  color: rgba(255, 255, 255, .85);
  font-size: 13px;
  border-radius: 16px;
  padding: 7px 11px;
}

.tooltip .tooltip-arrow {
  display: none;
}

.tooltip[x-placement^="top"] {
  margin-bottom: 5px;
}

.tooltip[x-placement^="top"] .tooltip-arrow {
  border-width: 5px 5px 0 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  bottom: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="bottom"] {
  margin-top: 5px;
}

.tooltip[x-placement^="bottom"] .tooltip-arrow {
  border-width: 0 5px 5px 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-top-color: transparent !important;
  top: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="right"] {
  margin-left: 5px;
}

.tooltip[x-placement^="right"] .tooltip-arrow {
  border-width: 5px 5px 5px 0;
  border-left-color: transparent !important;
  border-top-color: transparent !important;
  border-bottom-color: transparent !important;
  left: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip[x-placement^="left"] {
  margin-right: 5px;
}

.tooltip[x-placement^="left"] .tooltip-arrow {
  border-width: 5px 0 5px 5px;
  border-top-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  right: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip.popover .popover-inner {
  background: #f9f9f9;
  color: black;
  padding: 24px;
  border-radius: 5px;
  box-shadow: 0 5px 30px rgba(black, .1);
}

.tooltip.popover .popover-arrow {
  border-color: #f9f9f9;
}

.tooltip[aria-hidden='true'] {
  visibility: hidden;
  opacity: 0;
  transition: opacity .15s, visibility .15s;
}

.tooltip[aria-hidden='false'] {
  visibility: visible;
  opacity: 1;
  transition: opacity .15s;
}
</style>