<template>
  <div id="app" class="min-h-screen bg-khak-grey">
    <portal-target name="modal"></portal-target>
    <nav class="w-full fixed z-max subtle" :class="{'bg-black' : scroll > 32}">
      <div class="container px-6 sm:px-0">
        <div class="flex justify-between items-center py-2">
          <router-link class="sm:block no-underline hidden" to="/">
            <img src="../src/assets/logo.svg" alt="Huddle logo" width="120">
          </router-link>
          <router-link class="sm:hidden block no-underline" to="/">
            <img src="../src/assets/logomark-white.png" alt="Huddle logo" width="35">
          </router-link>
          <div class="sm:flex-grow hidden sm:flex">
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
    <footer class="bg-black py-8 w-full mt-8">
      <div class="container mx-auto px-8">
        <div class="flex w-full justify-center">
          <img src="../src/assets/logomark-white.png" class="self-start mr-12" alt="Huddle logo" width="35">
          <div class="block sm:table-cell mr-12">
            <p class="no-underline flex items-center text-white uppercase opacity-75 text-xs mb-4">Links</p>
            <ul class="list-reset text-xs mb-6">
              <li class="mt-2 inline-block mr-2 sm:block sm:mr-0">
                <a href="#" class="text-white opacity-75 hover:opacity-100 no-underline">FAQ</a>
              </li>
              <li class="mt-2 inline-block mr-2 sm:block sm:mr-0">
                <a href="#" class="text-white opacity-75 hover:opacity-100 no-underline">Help</a>
              </li>
              <li class="mt-2 inline-block mr-2 sm:block sm:mr-0">
                <a href="#" class="text-white opacity-75 hover:opacity-100 no-underline">Support</a>
              </li>
            </ul>
          </div>
          <div class="block sm:table-cell mr-12">
            <p class="no-underline flex items-center text-white uppercase opacity-75 text-xs mb-4">Community</p>
            <ul class="list-reset text-xs mb-6">
              <li class="mt-2 inline-block mr-2 sm:block sm:mr-0">
                <a href="#" class="text-white opacity-75 hover:opacity-100 no-underline">Facebook</a>
              </li>
              <li class="mt-2 inline-block mr-2 sm:block sm:mr-0">
                <a href="#" class="text-white opacity-75 hover:opacity-100 no-underline">Linkedin</a>
              </li>
              <li class="mt-2 inline-block mr-2 sm:block sm:mr-0">
                <a href="#" class="text-white opacity-75 hover:opacity-100 no-underline">Twitter</a>
              </li>
            </ul>
          </div>        
          <div class="block sm:table-cell mr-12">
            <p class="no-underline flex items-center text-white uppercase opacity-75 text-xs mb-4">Legal</p>
            <ul class="list-reset text-xs mb-6">
              <li class="mt-2 inline-block mr-2 sm:block sm:mr-0">
                <a href="#" class="text-white opacity-75 hover:opacity-100 no-underline">Terms</a>
              </li>
              <li class="mt-2 inline-block mr-2 sm:block sm:mr-0">
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
  store: ['huddles', 'user', 'users'],
  data() {
    return {
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
      if(['HuddlePublic', 'HuddlePrivate'].includes(this.$route.name)){
        return this.huddles.filter(h => h.slug !== this.$route.params.slug && h.type == 'public')
      }
      return this.huddles.filter(h => h.type == 'public')
    }
  },
  mounted(){
    document.addEventListener('scroll', e => {
      this.scroll = window.scrollY
    })
    setTimeout(async () => {
      await this.checkUser()
    })
    this.$gun.get(`${gunPrefix}:huddles`).once(v => {
      if(typeof(v) == 'undefined') this.seedData()
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
    seedData(){
      seedDatabase().forEach(h => {
        const newHuddle = this.$gun.get(`${gunPrefix}:huddles/${h.id}`).put(h)
        this.$gun.get(`${gunPrefix}:huddles`).set(newHuddle)
      })
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
          // add user to the gundb instance
          const identity = { id: this.user.id, name: this.user.name, avatar: this.user.avatar }
          const newUser = this.$gun.get(`${gunPrefix}:users/${this.user.id}`).put(identity)
          this.$gun.get(`${gunPrefix}:users`).set(newUser)
          // configure the user's gaia storage
          this.user.preferences = {
            blockedUsers : [],
            hideNonVerifiedUsers: true,
            hideNSFW: true,
            mutedWords : []
          }
          const cleanArray = JSON.stringify([])
          this.user.privateGroups = []
          this.user.publicGroups = []
          this.user.publicPosts = []
          this.user.privatePosts = []
          this.user.publicComments = []
          this.user.privateComments = []
          await blockstack.putFile('preferences.json', JSON.stringify(this.user.preferences), { encrypt : true })
          await blockstack.putFile('privateGroups.json', cleanArray, { encrypt : true })
          await blockstack.putFile('publicGroups.json', cleanArray, { encrypt : false })
          await blockstack.putFile('publicPosts.json', cleanArray, { encrypt : false })
          await blockstack.putFile('privatePosts.json', cleanArray, { encrypt : true })
          await blockstack.putFile('publicComments.json', cleanArray, { encrypt : false })
          await blockstack.putFile('privateComments.json', cleanArray, { encrypt : true })
          resolve()
        } else {
          console.log('loading user : ', this.user.name)
          // user exists, so load their gaia storage
          this.user.preferences = JSON.parse(await blockstack.getFile('preferences.json', { decrypt: true }))
          this.user.privateGroups = JSON.parse(await blockstack.getFile('privateGroups.json', { decrypt: true }))
          this.user.publicGroups = JSON.parse(await blockstack.getFile('publicGroups.json', { decrypt: false }))
          this.user.publicPosts = JSON.parse(await blockstack.getFile('publicPosts.json', { decrypt: false }))
          this.user.privatePosts = JSON.parse(await blockstack.getFile('privatePosts.json', { decrypt: true }))
          this.user.publicComments = JSON.parse(await blockstack.getFile('publicComments.json', { decrypt: false }))
          this.user.privateComments = JSON.parse(await blockstack.getFile('privateComments.json', { decrypt: true }))
          resolve()
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
