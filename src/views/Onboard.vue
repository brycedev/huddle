<template>
  <div class="max-w-full relative overflow-hidden flex-grow -mb-8">
    <div class="w-full bg-black relative canvas">
      <div class="container flex justify-center items-center">
        <div class="flex justify-center items-center flex-col py-20 my-12">
          <h1 class="text-4xl text-white font-light max-w-sm text-center mb-4 flex z-50">
            Welcome to Huddle
          </h1>
          <p class="text-white text-lg">The community is glad to have you.</p>
        </div>
      </div>
    </div>
    <div class="container flex">
      <div class="w-full justify-center flex">
        <div class="w-full max-w-sm bg-white rounded-lg py-6 px-8 flex flex-col -mt-12 z-50">
          <div class="w-full mb-4">
            <p class="text-black font-medium mb-6">Choose your username! It's okay to get creative.</p>
            <input v-model="username" type="text" class="block appearance-none text-grey-darker py-3 px-4 rounded-full w-full bg-khak-grey outline-none text-normal mb-3" placeholder="markhuddleberg">
          </div>
          <div class="w-full">
            <p class="text-black font-medium mb-6">Do you plan to participate in public communities?</p>
            <div class="flex w-full bg-khak-grey rounded-full mb-6">
              <div class="py-3 px-4 w-1/2 cursor-pointer subtle rounded-full" :class="styleForParticipate(true)" @click="participate = true">
                <p class="text-normal text-center">Yes</p>
              </div>
              <div class="py-3 px-4 w-1/2 cursor-pointer subtle rounded-full" :class="styleForParticipate(false)" @click="participate = false">
                <p class="text-normal text-center">No</p>
              </div>
            </div>
          </div>
          <div class="w-full">
            <p class="text-black font-medium mb-6">Should we hide NSFW posts and groups?</p>
            <div class="flex w-full bg-khak-grey rounded-full mb-6">
              <div class="py-3 px-4 w-1/2 cursor-pointer subtle rounded-full" :class="styleForHideNSFW(true)" @click="hideNSFW = true">
                <p class="text-normal text-center">Yes</p>
              </div>
              <div class="py-3 px-4 w-1/2 cursor-pointer subtle rounded-full" :class="styleForHideNSFW(false)" @click="hideNSFW = false">
                <p class="text-normal text-center">No</p>
              </div>
            </div>
          </div>
          <div class="bg-huddle-blue rounded-full px-6 text-white text-center py-3 cursor-pointer" @click="createProfile">
            <span v-show="!isCreating">Create</span>
            <img src="../assets/spinner.svg" class="spin" alt="" width="16" v-show="isCreating">
          </div>
        </div>
      </div>
    </div>
    <img src="../assets/astronaut.svg" class="-mb-12 mt-12 table max-w-md mx-auto" alt="Huddle onboarding" width="100%">
  </div>
</template>

<script>
export default {
  name: 'Onboard',
  store: ['user'],
  data() {
    return {
      isCreating: false,
      participate: true,
      hideNSFW: true,
      username: ''
    }
  },
  computed: {
    
  },
  methods: {
    async setUser(data, isPublic){
      return new Promise(async (resolve, reject) => {
        this.user = new blockstack.Person(data.profile)
        this.user.id = data.identityAddress
        this.user.name = data.username
        this.user.avatar = this.user.avatarUrl() ? this.user.avatarUrl() : 'https://placehold.it/300x300'
        console.log('instantiating user : ', this.user.name)
        // add user to the gundb instance
        let identity = {}
        if(isPublic)
          identity = { id: this.user.id, name: this.user.name, avatar: this.user.avatar, public: true }
        else
          identity = { id: this.user.id, public: false }
        const newUser = this.$gun.get(`${gunPrefix}:users/${this.user.id}`).put(identity)
        this.$gun.get(`${gunPrefix}:users`).set(newUser)
        // configure the user's gaia storage
        this.user.preferences = {
          isOnboarded: true,
          username: data.username,
          isPublic: isPublic,
          blockedUsers : [],
          hideUnlikelyHuddleProposals: false,
          hideNonVerifiedUsers: false,
          hideNSFW: true,
          filters : [
            // example filters
            // { type: 'wordBeginsWith', match: 'poli' },
            // { type: 'wordIs', match: 'jeffblum' }
          ]
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
      })
    },
    async checkUser(){
      if(!this.$route.query.authResponse) this.$router.push('/')
      if (blockstack.isSignInPending()) {
        blockstack.handlePendingSignIn().then(async userData => {
          this.userData = userData
          const file = await blockstack.getFile('preferences.json', { decrypt: true })
          if(file && file.isOnboarded){
            userData.username = file.username
            this.$parent.putUser(userData)
            this.$router.push('/')
          } else {
            await this.$parent.putUser(userData)
            this.$router.push('/welcome')
          }
        })
      }
    },
    styleForParticipate(type){
      if(this.participate == type) return 'bg-black text-white'
      else return 'bg-transparent text-grey-darker'
    },
    styleForHideNSFW(type){
      if(this.hideNSFW == type) return 'bg-black text-white'
      else return 'bg-transparent text-grey-darker'
    },
    async createProfile(){
      this.isCreating = true
      setTimeout(async() => {
        this.userData.username = this.username
        await this.setUser(this.userData, this.participate)
        await this.$parent.loadGaia()
        await this.$parent.putUser(this.userData)
        this.$router.push('/')
        this.isCreating = false
      }, 2000)
      
    }
  },
  mounted(){
    this.checkUser()
  }
}
</script>
